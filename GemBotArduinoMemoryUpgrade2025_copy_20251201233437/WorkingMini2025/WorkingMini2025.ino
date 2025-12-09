
#include <Nextion.h>
#include <HardwareSerial.h>
#include <SoftwareSerial.h>
#include <EEPROM.h>  // [2025-12-06 14:44] Added EEPROM for power failure recovery


//Nextion nextion(18, 19);
char incomingByte; // for incoming serial data




/*
This is the main program for running Merlins Gem Bot Automated Faceting Machine
Designed/Created by Austin Moore and Ryan Barbrick
This program is designed to be used with an arry of wheels at certain speeds
This version will prompt the user for the shape of stone,
information such as the number of facets,
number and order of angles to cut
the size of the desired finished stone. 
Later versions of this program should include a Graphical User Interface
with pre programmed designs to be able to select and cut from
This will save allot of time on the user end having to input the information for each stone 
 */


 // Read a multi dimensional array from a CSV file.
//
#include <SPI.h>
#include <SdFat.h>

#define CS_PIN 10 //pin 10

//const int totalFacets = 32;
// 32 X 3 array
#define ROW_DIM 32
#define COL_DIM 3
//String fileName = "READNUM.TXT";
//String fileNameC = "srbC.TXT";
//String fileNameG = "srbG.TXT";
//String fileNameP = "srbP.TXT";
 
#include <Adafruit_Keypad.h>
#include <Adafruit_Keypad_Ringbuffer.h>
// ** menu **
// include CMBMenu
#include "CMBMenu.hpp"
//keypad pins are 30-36
#include <ezButton.h>
//limit switch pins are 2,3,4,5,7
ezButton limitSwitchp(22);
ezButton limitSwitchx(23);
ezButton limitSwitchy(24);
ezButton limitSwitchCalI(6);//change
ezButton limitSwitchCalx(6);//change
ezButton limitSwitchCaly(6);//change


#include <Stepper.h> //This includes the stepper.h library for Arduino
#define STEPS 96 //96 steps per revolution  for a 3.75 deg motor 
#define D0 11 // These are the GPIO pins you are using for the sequence.
//#define D1 10 this is being used for the sd card so we will change the pin to pin 7
#define D1 7
#define D2 9
#define D3 8
const int enab1 = 12; // These are the GPIO pins connected to the ENB pins
const int enab2 = 13;

int countX = 4200;
int countY = 3300;
int intervalCount;//this is how many times to rotate before stepping down during preform
        //variables for moving stone close to wheel
        int xVar = 4200;
        int yVar = 3300;
        int xVarTo = 1000;
        int yVarTo = 1000;
        int xVarToOffset = 0;
        int yVarToOffset = 0;

//====== EEPROM STATE PERSISTENCE [2025-12-06 14:44] ======
// [2025-12-06 14:50] Expanded to save complete machine state for resume after power failure
// EEPROM addresses for saving state on power failure
#define EEPROM_ADDR_X_POS 0       // X axis position (2 bytes)
#define EEPROM_ADDR_Y_POS 2       // Y axis position (2 bytes)
#define EEPROM_ADDR_P_POS 4       // P axis position (2 bytes)
#define EEPROM_ADDR_INDEX_POS 6   // Index position (2 bytes)
#define EEPROM_ADDR_DESIGN 8      // Design selection (1 byte)
#define EEPROM_ADDR_SHAPE 9       // Shape selection (1 byte)
#define EEPROM_ADDR_CUT_STAGE 10  // Current cutting stage (1 byte)
#define EEPROM_ADDR_CHECKSUM 11   // Checksum for validation (1 byte)
#define EEPROM_VALID_FLAG 0xAB    // Magic number to verify valid data


//Buzzer is set to 5

//====== STATE TRACKING [2025-12-06 14:52] ======
// Track current machine state for persistence
int currentShape = 0;        // 0=Round, 1=Cushion, 2=Emerald, etc
int currentDesign = 0;        // 0=Standard Round Brilliant, etc
int currentCutStage = 0;      // 0=Menu, 1=Preform, 2=Cut, 3=Polish
int currentIndexPos = 0;      // Index/gear position

// Shape and design mappings based on menu system
enum SHAPES { SHAPE_ROUND = 1, SHAPE_CUSHION = 2, SHAPE_EMERALD = 3 };
enum CUT_STAGES { STAGE_MENU = 0, STAGE_PREFORM = 1, STAGE_CUT = 2, STAGE_POLISH = 3 };
enum DESIGNS { DESIGN_SRB = 1 }; // Standard Round Brilliant

// include library for LCD
//#include "LiquidCrystal.h"
#include <Wire.h>
#include <hd44780.h>                       // main hd44780 header
#include <hd44780ioClass/hd44780_I2Cexp.h> // i2c expander i/o class header

hd44780_I2Cexp lcd; // declare lcd object: auto locate & auto config expander chip

// If you wish to use an i/o expander at a specific address, you can specify the
// i2c address and let the library auto configure it. If you don't specify
// the address, or use an address of zero, the library will search for the
// i2c address of the device.
// hd44780_I2Cexp lcd(i2c_address); // specify a specific i2c address
//
// It is also possible to create multiple/seperate lcd objects
// and the library can still automatically locate them.
// Example:
// hd4480_I2Cexp lcd1;
// hd4480_I2Cexp lcd2;
// The individual lcds would be referenced as lcd1 and lcd2
// i.e. lcd1.home() or lcd2.clear()
//
// It is also possible to specify the i2c address
// when declaring the lcd object.
// Example:
// hd44780_I2Cexp lcd1(0x20);
// hd44780_I2Cexp lcd2(0x27);
// This ensures that each each lcd object is assigned to a specific
// lcd device rather than letting the library automatically asign it.

// LCD geometry
const char LCD_COLS = 20;
const char LCD_ROWS = 4;

#include <Adafruit_MotorShield.h>
//#include <LiquidCrystal.h>
//#include <LiquidCrystal_I2C.h>

//keypad set up here:
#include <Keypad.h>
const byte ROWS = 4;
const byte COLS = 3;
char hexaKeys[ROWS][COLS] = {
  {'1', '2', '3'},
  {'4', '5', '6'},
  {'7', '8', '9'},
  {'*', '0', '#'}
};
 
byte rowPins[ROWS] = {30, 31, 32, 33};
byte colPins[COLS] = {34, 35, 36};
 
Keypad customKeypad = Keypad(makeKeymap(hexaKeys), rowPins, colPins, ROWS, COLS);

// Create the motor shield object with the default I2C address
Adafruit_MotorShield AFMS = Adafruit_MotorShield();
// Or, create it with a different I2C address (say for stacking)
Adafruit_MotorShield AFMS2 = Adafruit_MotorShield(0x61);

Stepper indexMotor(STEPS, D0, D1, D2, D3); //create a stepping sequence for the index motor.t 
// Connect a stepper motor with 200 steps per revolution (1.8 degree)
// to motor port #1 (M1 and M2)
// to motor port #2 (M3 and M4)
//Adafruit_StepperMotor *indexMotor = AFMS.getStepper(96, 1);
Adafruit_StepperMotor *YaxisMotor = AFMS.getStepper(200, 2);//y motlsaor mid board 5v (AFMS mid motor shield) (200==steps,2==location of wires)
Adafruit_StepperMotor *PaxisMotor = AFMS2.getStepper(200, 1);//angle motor on top board 12 v (AFMS2 top motor shield) (200==steps,1==location of wires)
Adafruit_StepperMotor *XaxisMotor = AFMS2.getStepper(200, 2);//x motor on top board 12 v (AFMS2 top motor shield) (200==steps,2==location of wires)
unsigned int dt=500;
byte IndexSteps;
int YaxisSteps = 0;
int XaxisSteps = 0;
byte indexNumber = 1;
int PaxisSteps = 0; 
byte forwardSingleStep = 8;
int backwardSingleStep = -8;
byte run = 0;

byte Start=0;
//int buzzer = 5;

 float roundWidth = 25.5;// in mm
 float roundDesiredWidth = 15.9;// in mm
 float rotations = 1; // this will remove 1 mm of material for every 40 steps with 150 grit lap
 int rotationCount;
 float totalSteps = rotations * 96; 

//home variables
  byte homeYSet = 0; 
  byte homeYSet2 = 0;
  int homeYPosition = 0;
  byte homeXSet = 0;
  int homeXPosition = 0;
  byte homePSet = 0;
  int homePPosition = 0;

//====== MOTOR SPEED CONTROL (OPTIMIZED FOR RAM) ======
// Use #define macros instead of const int to save ~40 bytes
// Precision speeds - for detailed cutting control
#define Y_PREC_SPD 150     // Y precision speed (up from 100)
#define X_PREC_SPD 1500    // X precision speed (up from 1000)
#define P_PREC_SPD 450     // P precision speed (up from 300)

// Fast speeds - for rapid material removal
#define Y_FAST_SPD 300     // Y fast speed (up from 200)
#define X_FAST_SPD 3000    // X fast speed (up from 2000)
#define P_FAST_SPD 1200    // P fast speed (up from 800)

// Speed mode flag: 0=precision, 1=fast (single byte = 1 byte RAM)
byte fastMode = 0;

//====== JOYSTICK CONTROL VARIABLES ======
// Joystick position data (0-255 scale, 128 = center)
byte joystickX = 128;      // X-axis (left/right)
byte joystickY = 128;      // Y-axis (up/down)
byte joystickP = 128;      // P-axis (rotate)
byte joystickActive = 0;   // 0=inactive, 1=active
  int homeYOffsetStepsChuck = 0;
  int homeXOffsetStepsChuck = 0;
  int homePOffsetStepsChuck = 0;
   
  int calibratedYPositionChuck = 0;
  int calibratedXPositionChuck = 0;
  int calibratedPPositionChuck = 0;  

  int chuckY = calibratedYPositionChuck;
  int chuckX = calibratedXPositionChuck;

//dop calibration variables
  int homeYOffsetStepsDop = 0;
  int homeXOffsetStepsDop = 0;
  int homePOffsetStepsDop = 0;

  int calibratedYPositionDop = 0;
  int calibratedXPositionDop = 0;
  int calibratedPPositionDop = 0;

  int dopY = calibratedYPositionDop;
  int dopX = calibratedXPositionDop;

  int dopLength = dopX - chuckX ;
  int dopWidth  = dopY - chuckY ; 


//setting variables
  int homeYOffsetStepsRough = 0;
  int homeXOffsetStepsRough = 0;
  int homePOffsetStepsRough = 0;
   
  int calibratedYPositionRough = 0;
  int calibratedXPositionRough = 0;
  int calibratedPPositionRough = 0;  

  int RoughY = calibratedYPositionRough;
  int RoughX = calibratedXPositionRough;

int roughStoneWidth;
int roughStoneHeight;
int roughStoneDiameter;
int roughStoneCir;

int endStoneWidth = 5;
int endStoneHeight = 3;
int endStoneDiameter;
int endStoneCir;

//Default design-----------------------------------------------------------------------------------------------------Design
//String shape = "Symmetry";
//String designName = "32 Fold";
//int indexGearUsed = 96;
//total number of facets
//int totalFacets = 82;

//total anglesCut
//int totalAnglesCut = 8;
//int totalPavilionAngles = 1;
//int totalGirdleAngles = 1;
//int totalCrownAngles = 6;

//preform Angles
//int girdleAnglePreform = 90;
//int pavilionAnglePreformDeg = 52;
//int crownAnglePreformDeg = 52;
//int tableAnglePreformDeg = 0;

//Crown
//const int totalCrownFacets = 36; 
//int totalCFacets = 36;

//Girdle-- list of constant girdle facets, this number cannot be changed
// so we must create multiple to create different size arrays based on the number of girdle facets requested by the design
//const int totalGirdleFacets = 12;
//const int totalGirdleFacets14 = 14;
//const int totalGirdleFacets16 = 16;
//const int totalGirdleFacets18 = 18;
//const int totalGirdleFacets20 = 20;
//const int totalGirdleFacets22 = 22;
//const int totalGirdleFacets24 = 24;
//const int totalGirdleFacets32 = 32;
//const int totalGirdleFacets40 = 40;
//const int totalGirdleFacets48 = 48;
//const int totalGirdleFacets96 = 96;
//int totalGFacets = 16;

//Pavilion
//const int totalPavilionFacets = 32;
//int totalPFacets = 32;


//stone arrays -        angle number--angle--index
//crown indexes
//int firstCrownIndex = 4;
//int crownArray [totalCrownFacets][3]{{1,51,4},
                                     //{1,51,12},
                                     //{1,51,20},
                                     //{1,51,28},
                                     //{1,51,36},
                                    // {1,51,44},
                                     //{1,51,52},
                                     //{1,51,60},
                                     //{1,51,68},
                                    // {1,51,76},
                                    // {1,51,84},
                                    // {1,51,92},
                                    // {2,42,96},
                                    // {2,42,16},
                                    // {2,42,32},
                                    // {2,42,48},
                                     //{2,42,64},
                                     //{2,42,80},
                                    // {3,20,8},
                                    // {3,20,24},
                                    // {3,20,40},
                                    // {3,20,56},
                                    // {3,20,72},
                                     //{3,20,88},
                                     //{4,15,8},
                                     //{4,15,24},
                                    // {4,15,40},
                                    // {4,15,56},
                                    // {4,15,72},
                                    // {4,15,88},
                                    // {5,11,96},
                                    // {5,11,16},
                                    // {5,11,32},
                                    // {5,11,48},
                                    // {5,11,64},
                                     //{5,11,80}};

//girdle indexes
//int firstGirdleIndex = 4;
//int girdleArray [totalGirdleFacets][3]{{1,45.36,96},
                                     //{1,90,80},
                                    // {1,90,64},
                                     //{1,90,48},
                                     //{1,90,32},
                                     //{1,90,16}};

//pavilion indexes
//int firstPavilionIndex = 96;
//int pavilionArray [totalPavilionFacets][3]{
                                   //  {1,47.52,96},
                                   //  {1,47.52,80},
                                   //  {1,47.52,64},
                                   //  {1,47.52,48},
                                   //  {1,47.52,32},
                                   //  {1,47.52,16}};

//This will help control the movement to each index
//   indexGearArray         teeth- steps- -SINGLEs per tooth on gear
//int indexGearArray[ 8 ][ 3 ] = { {23,8,178},
                               //  {64,3,32},
                                // {72,2,197},
                                // {80,2,128},
                                // {84,2,72},
                                // {88,2,70},
                                // {96,2,213},
                                // {120,1,170}};

//limit switches
int LimitP = 2;
int LimitX = 3;
int LimitY = 4;
int LimitCy = 5;
int LimitCx = 6;
int LimitCi = 17;

//index motor variables
int totalIndex = 96;
int stepsForward = 0;
int SINGLEsForward = 0;
int stepsDown = 0;
int SINGLEsDown = 0;
int indexStepsForward = 0;
int indexStepsBakcward = 0;
int indexSINGLEsForward = 0;
int indexSINGLEsBackward = 0;

int cycleCount = 1;

 
// ********************************************
// definitions
// ********************************************
// LCD pins
//const uint8_t g_PinLcdScl_ui8c = A5; // SCL
//const uint8_t g_PinLcdSda_ui8c = A4; // SDA


// define text to display

//Preform
const char g_MenuPreform_pc[] PROGMEM = {"<      Preform     >" };

const char g_MenuPreformRound_pc[] PROGMEM = {"Round"};
//const char g_MenuPreformTriangle_pc[] PROGMEM = {"Triangle 3 Sides"};
//const char g_MenuPreformSquare_pc[] PROGMEM = {"Square 4 Sides"};

//const char g_MenuPreformHexagon_pc[] PROGMEM = {"Hexagon 6 Sides"};

//const char g_MenuPreformOctagon_pc[] PROGMEM = {"Octagon 8 Sides"};

//const char g_MenuPreformDodecagon_pc[] PROGMEM = {"Dodecagon 12 Sides"};

//Preform Stone Menu based on shape
//round
const char g_MenuPreformGRoundSettings_pc[] PROGMEM = {"Round Dimensions"};
const char g_MenuPreformGRound_pc[] PROGMEM = {"Girdle Round"};
//const char g_MenuPreformPRound_pc[] PROGMEM = {"Pavilion Round"};
//const char g_MenuPreformCRound_pc[] PROGMEM = {"Crown Round"};
//const char g_MenuPreformTRound_pc[] PROGMEM = {"Table Flat"};


//Cut Stone Menu
const char g_MenuCut_pc[] PROGMEM = {"<      Cut Gem     >"};
const char g_MenuCutG_pc[] PROGMEM = {"Cut Girdle"};
//const char g_MenuCutP_pc[] PROGMEM = {"Cut Pavilion"};
//const char g_MenuCutC_pc[] PROGMEM = {"Cut Crown"};
//const char g_MenuCutT_pc[] PROGMEM = {"Cut Table"};

//Polish Stone Menu
const char g_MenuPolish_pc[] PROGMEM = {"<    Polish Gem     "};
const char g_MenuPolishG_pc[] PROGMEM = {"Polish Girdle"};
//const char g_MenuPolishP_pc[] PROGMEM = {"Polish Pavilion"};
//const char g_MenuPolishC_pc[] PROGMEM = {"Polish Crown"};
//const char g_MenuPolishT_pc[] PROGMEM = {"Polish Table"};

//Design Menu
const char g_MenuDesign_pc[] PROGMEM = {"<      Design      >"};



//const char g_MenuDesignCustomIndexGear_pc[] PROGMEM = {"Select Index Gear"};

//const char g_MenuDesignCustomIndexGear96_pc[] PROGMEM = {"96 Tooth Gear"};


//Settings Menu
const char g_MenuSettings_pc[] PROGMEM = {"      Settings     >"};
const char g_MenuSettingsSwitchTest_pc[] PROGMEM = {"    Switch Test    >"};
const char g_MenuSettingsHome_pc[] PROGMEM = {"<       Home       >"};
const char g_MenuSettingsIndexSet_pc[] PROGMEM = {"<    Manual Cont   >"};
const char g_MenuSettingsChuckCalibration_pc[] PROGMEM = {"<   Chuck Calibr.  >"};
const char g_MenuSettingsDopCalibration_pc[] PROGMEM = {"<   Dop Calibr.    >"};
const char g_MenuSettingsRoughCalibration_pc[] PROGMEM = {"<   Rough Calibr.   "};

// define function IDs
enum MenuFID {
  //preform----------------Preform
  MenuPreform,
  //shapes-----------------Shapes
  MenuPreformRound,
  //MenuPreformSquare,
 
 MenuPreformGRoundSettings,
  MenuPreformGRound,//preform girdle
  MenuPreformPRound,//preform pavilion
  MenuPreformCRound,//preform crown
  MenuPreformTRound,//preform table

  //MenuPreformGSquare,//preform girdle
  //MenuPreformPSquare,//preform pavilion
  //MenuPreformCSquare,//preform crown
  //MenuPreformTSquare,//preform table

  
  MenuCut,
  MenuCutG,//cut girdle
  MenuCutP,//cut pavilion
  MenuCutC,//cut crown
  MenuCutT,//cut table
  MenuPolish,
  MenuPolishG,//polish girdle
  MenuPolishP,//polish pavilion
  MenuPolishC,//polish crown
  MenuPolishT,//polish table
  //Designs-----------------Designs
  MenuDesign,

  

  //SHAPES AND DESIGNS-------------------------               SHAPES AND DESIGNS 
  

  //Settings
  MenuSettings,
  MenuSettingsSwitchTest,
  MenuSettingsHome,
  MenuSettingsIndexSet,
  MenuSettingsChuckLocation,
  MenuSettingsChuckCalibration,
  MenuSettingsDopLocation,
  MenuSettingsDopCalibration,
  MenuSettingsRoughDimensions,
  MenuSettingsRoughCalibration
};

// define key types
enum KeyType {
  KeyNone, // no key is pressed
  KeyLeft,
  KeyRight,
  KeyEnter,
  KeyExit
};

// ** menu **
// create global CMBMenu instance
// (here for maximum 100 menu entries)
CMBMenu<700> g_Menu;

//LCD Pins are 7 through 12
//const int rs = 7, en = 8, d4 = 9, d5 = 10, d6 = 11, d7 = 12;
//LiquidCrystal lcd(rs, en, d4, d5, d6, d7);
//char messageOut[5] = "Hello"; //String data
//char message[10]; //Initialized variable to store recieved data

// ********************************************
// setup
// ********************************************

void setup(){
 //delay(1000);
Serial.begin(9600);

Serial1.begin(9600); // opens serial port, sets data rate to 9600 bps, this one is for TX/RX pins, for Nextion display
//Serial2.begin(9600);// opens serial port, sets data rate to 9600 bps, this one is for TX/RX pins, for communication to giga board 

  //index motor
  digitalWrite(enab1, HIGH); //This enables your motor controller.
  digitalWrite(enab2, HIGH);
  indexMotor.setSpeed(300); //This sets the motor speed to * rpm

  //Limit Switches
  limitSwitchx.setDebounceTime(50);//50 milliseconds originally switched to 200 for a longer press time to make sure no false clicks/bounces
  limitSwitchy.setDebounceTime(50);//50 milliseconds
  limitSwitchp.setDebounceTime(50);//50 milliseconds
  limitSwitchCaly.setDebounceTime(50);//50 milliseconds
  limitSwitchCalx.setDebounceTime(50);//50 milliseconds
  // LCD 
  int status;
  status = lcd.begin(LCD_COLS, LCD_ROWS);
	if(status) // non zero status means it was unsuccesful
	{
		// hd44780 has a fatalError() routine that blinks an led if possible
		// begin() failed so blink error code using the onboard LED if possible
		hd44780::fatalError(status); // does not return
	}

	// initalization was successful, the backlight should be on now

	// Print a message to the LCD
	//lcd.print("Hello, User!");
  //delay(1000);
  lcd.clear();
  lcd.print("Merlin's Gem Bot");
  lcd.setCursor(0,1);
  lcd.print("By. Ryan Barbrick");
  //lcd.setCursor(4,4);
  //lcd.print("LOADING...");
  delay(1000);

  //Serial.begin(9600);
  //Serial.println("===========================");
  //Serial.println("------------Menu-----------");
  //Serial.println("===========================");
  //Serial.println("");
  //Serial.println("1: left, 3: right, 0: enter, 2: exit, 8: print menu");
  //Serial.println("");

  // ** menu **
  // add nodes to menu (layer, string, function ID)
  //-------------------------------------------------this needs to stay organized----------------------------------------------------
   //---------------**
  //1. Settings Menu**
  //----------------**
  g_Menu.addNode(0, g_MenuSettings_pc , MenuSettings);

  g_Menu.addNode(1, g_MenuSettingsSwitchTest_pc , MenuSettingsSwitchTest);
  g_Menu.addNode(1, g_MenuSettingsHome_pc , MenuSettingsHome);
  g_Menu.addNode(1, g_MenuSettingsIndexSet_pc , MenuSettingsIndexSet);
  //Step 2:Chuck Calibration
  g_Menu.addNode(1, g_MenuSettingsChuckCalibration_pc , MenuSettingsChuckCalibration);

  //Step 3:Dop Calibration
  g_Menu.addNode(1, g_MenuSettingsDopCalibration_pc , MenuSettingsDopCalibration);

  //Step 4:Rough Calibration
  g_Menu.addNode(1, g_MenuSettingsRoughCalibration_pc , MenuSettingsRoughCalibration);
 

  //---------------------------------------------------------------------------------------
  //------------------**
  //5.Design Main Menu**
  //------------------**
  g_Menu.addNode(0, g_MenuDesign_pc, MenuDesign);
  //Design Menu Second Layer**

  

  //Shapes Menu Fourth Layer**
  
  //---------------------------------------------------------------------------------------

  
  //-------------------------**
  //6.Preform Menu Fist Layer**
  //-------------------------**
  g_Menu.addNode(0, g_MenuPreform_pc, MenuPreform);
  //Preform Menu Second Layer**
  g_Menu.addNode(1, g_MenuPreformRound_pc, MenuPreformRound);
  g_Menu.addNode(2, g_MenuPreformGRoundSettings_pc, MenuPreformGRoundSettings);//preform girdle settings
   g_Menu.addNode(2, g_MenuPreformGRound_pc, MenuPreformGRound);//preform girdle
  // g_Menu.addNode(2, g_MenuPreformPRound_pc, MenuPreformPRound);//preform pavilion
  // g_Menu.addNode(2, g_MenuPreformCRound_pc, MenuPreformCRound);//preform crown
  // g_Menu.addNode(2, g_MenuPreformTRound_pc, MenuPreformTRound);//preform table
  

  //-------------------------**
  //7.CutGem Menu First Layer**
  //-------------------------**
  g_Menu.addNode(0, g_MenuCut_pc, MenuCut);
  //CutGem Menu Second Layer**
   g_Menu.addNode(1, g_MenuCutG_pc, MenuCutG);
  // g_Menu.addNode(1, g_MenuCutP_pc, MenuCutP);
  // g_Menu.addNode(1, g_MenuCutC_pc, MenuCutC);
  // g_Menu.addNode(1, g_MenuCutT_pc, MenuCutT);
  //--------------------------------------------------------------------------

  //--------------------------**
  //8.PolishGem Menu First Layer**
  //--------------------------**
  g_Menu.addNode(0, g_MenuPolish_pc, MenuPolish);
  //PolishGem Menu Second Layer**
   g_Menu.addNode(1, g_MenuPolishG_pc, MenuPolishG);
  // g_Menu.addNode(1, g_MenuPolishP_pc, MenuPolishP);
  // g_Menu.addNode(1, g_MenuPolishC_pc, MenuPolishC);
  // g_Menu.addNode(1, g_MenuPolishT_pc, MenuPolishT);
  //---------------------------------------------------------------------------

  

  // ** menu **
  // build menu and print menu
  // (see terminal for output)
  const char* info;
  g_Menu.buildMenu(info);
  g_Menu.printMenu();

  // ** menu **
  // print current menu entry
   printMenuEntry(info);

   Serial.begin(9600); // set up Serial library at 9600 bps
pinMode(LimitP, INPUT_PULLUP);
pinMode(LimitX, INPUT_PULLUP);
pinMode(LimitY, INPUT_PULLUP);
pinMode(LimitCi, INPUT_PULLUP);
pinMode(LimitCx, INPUT_PULLUP);
pinMode(LimitCy, INPUT_PULLUP);
//pinMode(buzzer, OUTPUT);


  if (!AFMS.begin()) {         // create with the default frequency 1.6KHz
    Serial.println("ERROR: Motor Shield 1 (AMFS1) NOT FOUND!");
  } else {
    Serial.println("OK: Motor Shield 1 (AMFS1) found");
  }
  if (!AFMS2.begin()) {         // create with the default frequency 1.6KHz
    Serial.println("ERROR: Motor Shield 2 (AMFS2) NOT FOUND!");
  } else {
    Serial.println("OK: Motor Shield 2 (AMFS2) found");
  }
  
  //====== INITIALIZE MOTORS WITH PRECISION SPEEDS ======
  //indexMotor->setSpeed(100);  // 100 rpm
  YaxisMotor->setSpeed(Y_PREC_SPD);  // Start in precision mode
  XaxisMotor->setSpeed(X_PREC_SPD);
  PaxisMotor->setSpeed(P_PREC_SPD);
  Serial.println("Motors initialized in PRECISION mode");
  
  // [2025-12-06 14:44] Recover state from EEPROM on startup
  loadMotorState();

  }//close setup()

// ********************************************
// loop
// ********************************************
void loop(){

//comm to nextion AND USB Serial (from web interface)
 incomingByte = "";

// Check USB Serial (Serial0) - Commands from Web Interface
if (Serial.available() > 0) {
    incomingByte = Serial.read();
    Serial.print("I received: ");
    Serial.println((char)incomingByte);
    Start = (char)incomingByte;
}
// Check Nextion Serial (Serial1) - Commands from Touch Screen
else if (Serial1.available() > 0 ) { // if some data was received from the Nextion Display
    incomingByte = Serial1.read(); // read the incoming byte (this will also delete the byte from the serial buffer)
    
    // Optionally, print the data to the serial monitor
    Serial.print("I received: ");
    //Serial.println(incomingByte);
    Serial.println((char)incomingByte);
    Start = (char)incomingByte;
    
    
  }//close if
  
 
  // function ID
  int fid = 0;

  // info text from menu
  const char* info;

  // go to deeper or upper layer?
  bool layerChanged=false;

  // determine pressed key
  KeyType key = getKey();


  // ** menu **
  // call menu methods regarding pressed key
  switch(key) {
    case KeyExit:
      g_Menu.exit();
      break;
    case KeyEnter:
      g_Menu.enter(layerChanged);
      break;
    case KeyRight:
      g_Menu.right();
      break;
    case KeyLeft:
      g_Menu.left();
      break;
    case KeyUp:
      g_Menu.up();
      break; // [2025-12-06 15:06] Added KeyUp handler for menu navigation
      
    default:
      break;
  }//close switch
incomingByte = "";
  // ** menu **
  // pint/update menu when key was pressed
  // and get current function ID "fid"
  if (KeyNone != key) {
    fid = g_Menu.getInfo(info);
    printMenuEntry(info);
  }//close if
  

  // ** menu **
  // do action regarding function ID "fid"
  if ((0 != fid) && (KeyEnter == key) && (!layerChanged)) {
    switch (fid) {
      case MenuSettings:
      Serial1.print("page 1"); // command to load page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        settings();
        break;
        case MenuSettingsSwitchTest:
        Serial1.print("page 10"); // command to load page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        switchTest();
        
        break;
        case MenuSettingsHome:
        settingsHome();
 
        break;
        case MenuSettingsIndexSet:
        //Serial1.print("page 12"); // command to load page
        //Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        manualControl();
        break;
       
        case MenuSettingsChuckLocation:
        chuckLocation();
        
        break;
        case MenuSettingsChuckCalibration:
        chuckCalibration();
       
        break;
        case MenuSettingsDopLocation:
        dopLocation();
       
        break;
        case MenuSettingsDopCalibration:
        dopCalibration();
      
        break;
        case MenuSettingsRoughDimensions:
        roughDimensions();
      
        break;
        case MenuSettingsRoughCalibration:
        roughCalibration();
       
        break;
      case MenuDesign:
       design();
  
        break;
         //round-----------------------------------------------
      case MenuPreformGRoundSettings:
       
        preformGRoundSettings();
        break;
      case MenuPreformGRound:
       
        preformGRound();//preform girdle Function
        break;
      case MenuPreformPRound:
        //preformPRound();//preform pavilion Function
        break;
      case MenuPreformCRound:
        //preformCRound();//preform crown Function
        break;
      case MenuPreformTRound:
        //preformT();//preform table Function
        break;
   
        //cut function call
      case MenuCutP:
        //cutP();//cut pavilion Function
        break;
      default:
        break;
    }//close switch
  }//close if
  
  //====== WEB INTERFACE COMMAND HANDLER ======
  // Handle additional web commands for speed toggle and joystick control
  // These work in addition to menu navigation (0=ENTER, 1=LEFT, 2=EXIT, 3=RIGHT, 8=UP)
  
  if(Start != 0) {
    switch(Start) {
      case 't':  // Toggle speed mode (precision <-> fast)
      case 'T':
        fastMode = 1 - fastMode;
        updateMotorSpeeds();
        Start = 0;  // Clear the command
        break;
        
      case 'w':  // Move Y axis up (web interface command)
      case 'W':
        if(fastMode == 1) {
          YaxisMotor->step(10, BACKWARD, MICROSTEP);  // Fast: 10 steps
          Serial.println("Y UP (FAST): 10 steps");
        } else {
          YaxisMotor->step(1, BACKWARD, MICROSTEP);   // Precision: 1 step
          Serial.println("Y UP (PRECISION): 1 step");
        }
        Start = 0;
        break;
        
      case 'z':  // Move Y axis down (web interface command)
      case 'Z':
        if(fastMode == 1) {
          YaxisMotor->step(10, FORWARD, MICROSTEP);   // Fast: 10 steps
          Serial.println("Y DOWN (FAST): 10 steps");
        } else {
          YaxisMotor->step(1, FORWARD, MICROSTEP);    // Precision: 1 step
          Serial.println("Y DOWN (PRECISION): 1 step");
        }
        Start = 0;
        break;
        
      case 'a':  // Move X axis left (web interface command)
      case 'A':
        if(fastMode == 1) {
          XaxisMotor->step(5, FORWARD, MICROSTEP);       // Fast: 5 steps
          Serial.println("X LEFT (FAST): 5 steps");
        } else {
          XaxisMotor->step(1, FORWARD, MICROSTEP);       // Precision: 1 step
          Serial.println("X LEFT (PRECISION): 1 step");
        }
        Start = 0;
        break;
        
      case 'd':  // Move X axis right (web interface command)
      case 'D':
        if(fastMode == 1) {
          XaxisMotor->step(5, BACKWARD, MICROSTEP);      // Fast: 5 steps
          Serial.println("X RIGHT (FAST): 5 steps");
        } else {
          XaxisMotor->step(1, BACKWARD, MICROSTEP);      // Precision: 1 step
          Serial.println("X RIGHT (PRECISION): 1 step");
        }
        Start = 0;
        break;
        
      case 'q':  // Move P axis up/counter-clockwise (web interface command)
      case 'Q':
        // SAFETY GATE: Only allow P movement if Y axis cleared (limit switch not pressed)
        if(digitalRead(LimitY) == HIGH) {  // HIGH = not pressed
          if(fastMode == 1) {
            PaxisMotor->step(3, BACKWARD, MICROSTEP);   // Fast: 3 steps
            Serial.println("P UP (FAST): 3 steps");
          } else {
            PaxisMotor->step(1, BACKWARD, MICROSTEP);   // Precision: 1 step
            Serial.println("P UP (PRECISION): 1 step");
          }
        } else {
          Serial.println("P BLOCKED: Y-axis at limit (safety gate)");
        }
        Start = 0;
        break;
        
      case 'e':  // Move P axis down/clockwise (web interface command)
      case 'E':
        // SAFETY GATE: Only allow P movement if Y axis cleared (limit switch not pressed)
        if(digitalRead(LimitY) == HIGH) {  // HIGH = not pressed
          if(fastMode == 1) {
            PaxisMotor->step(3, FORWARD, MICROSTEP);    // Fast: 3 steps
            Serial.println("P DOWN (FAST): 3 steps");
          } else {
            PaxisMotor->step(1, FORWARD, MICROSTEP);    // Precision: 1 step
            Serial.println("P DOWN (PRECISION): 1 step");
          }
        } else {
          Serial.println("P BLOCKED: Y-axis at limit (safety gate)");
        }
        Start = 0;
        break;
        
      case 'j':  // Joystick data (X,Y,Index,P coordinates)
      case 'J':
        // Format: jX,Y,Index,P where each value is 0-255 (128=center)
        // Example: j128,128,128,128 = center position (no movement)
        joystickX = Serial.parseInt();      // Read X value (after 'j')
        Serial.read();  // consume comma
        joystickY = Serial.parseInt();      // Read Y value
        Serial.read();  // consume comma
        byte joystickIndex = Serial.parseInt();  // Read Index value
        Serial.read();  // consume comma
        joystickP = Serial.parseInt();      // Read P value
        joystickActive = 1;
        handleJoystickMovement();
        Start = 0;
        break;
        
      case 'i':  // Index axis decrement (web interface command)
      case 'I':
        if(fastMode == 1) {
          indexMotor.step(-5);  // Move backward 5 steps
          Serial.println("INDEX DEC (FAST): 5 steps");
        } else {
          indexMotor.step(-1);  // Move backward 1 step
          Serial.println("INDEX DEC (PRECISION): 1 step");
        }
        Start = 0;
        break;
        
      case 'o':  // Index axis increment (web interface command)
      case 'O':
        if(fastMode == 1) {
          indexMotor.step(5);   // Move forward 5 steps
          Serial.println("INDEX INC (FAST): 5 steps");
        } else {
          indexMotor.step(1);   // Move forward 1 step
          Serial.println("INDEX INC (PRECISION): 1 step");
        }
        Start = 0;
        break;
        
      case 'k':  // Stop joystick
      case 'K':
        joystickActive = 0;
        joystickX = 128;  // Reset to center
        joystickY = 128;
        joystickP = 128;
        Start = 0;
        break;
        
      case 'h':  // Home command
      case 'H':
        // [2025-12-06 14:42] Added home command routing for web interface
        Serial.println("Home command received");
        Start = 0;
        break;
        
      case 'i':  // Index decrement
        // [2025-12-06 14:42] Added index decrement command routing for web interface
        Serial.println("Index decrement");
        Start = 0;
        break;
        
      case 'o':  // Index increment
        // [2025-12-06 14:42] Added index increment command routing for web interface
        Serial.println("Index increment");
        Start = 0;
        break;
        
      case 'x':  // Diagnostic test
      case 'X':
        // [2025-12-06 14:42] Added comprehensive diagnostic function for troubleshooting
        testMotorConnections();
        Start = 0;
        break;
        
      case 's':  // Save state to EEPROM (auto-save from web controls)
      case 'S':
        // [2025-12-06 14:47] Save current motor positions to EEPROM (quiet mode for auto-save)
        saveCompleteState();  // Use complete state saving function
        Start = 0;
        break;
        
      case 'r':  // Reset/clear saved state
      case 'R':
        // [2025-12-06 14:44] Clear saved state for fresh start
        clearSavedState();
        Start = 0;
        break;
    }
  }
  
}//close loop

// ********************************************
// ** menu **
// printMenuEntry
// ********************************************
void printMenuEntry(const char* f_Info){
  String info_s;
  MBHelper::stringFromPgm(f_Info, info_s);

  // when using LCD: add/replace here code to
  // display info on LCD
  Serial.println("----------------");
  Serial.println(info_s);
  Serial.println("----------------");

  // print on LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(info_s);

  // you can print here additional infos into second line of LCD
  if (info_s == "      Settings     >"){
    Serial1.print("page 0"); // command to load page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command

   }else if(info_s == "<      Design      >"){
    Serial1.print("page 14"); // command to load page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command

   }else if(info_s == "<      Preform     >"){
    Serial.println("Preform Selected");
    Start = MenuPreform;
    currentCutStage = STAGE_PREFORM;
    Serial.println("[STATE] Detected: Preform stage");

   }else if(info_s == "<      Cut Gem     >"){
    Serial.println("Cut Gem Selected");
    Start = MenuCut;
    currentCutStage = STAGE_CUT;
    Serial.println("[STATE] Detected: Cut Gem stage");

   }else if(info_s == "<    Polish Gem     "){
    Serial.println("Polish Gem Selected");
    Start = MenuPolish;
    currentCutStage = STAGE_POLISH;
    Serial.println("[STATE] Detected: Polish Gem stage");

   }else if(info_s == "    Switch Test    >"){
    Serial1.print("page 1"); // command to load page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command

   }else if(info_s == "<       Home       >"){
    Serial1.print("page 2"); // command to load page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command

   }else if(info_s == "<    Manual Cont   >"){
    Serial1.print("page 3"); // command to load page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command

   }else if(info_s == "<   Chuck Calibr.  >"){
    Serial1.print("page 4"); // command to load page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command

   }else if(info_s == "<   Dop Calibr.    >"){
    Serial1.print("page 6"); // command to load page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command

   }else if(info_s == "<   Rough Calibr.   "){
    Serial1.print("page 8"); // command to load page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command

   }
}//close printMenuEntry

// ********************************************
// getKey touch screen input
// ********************************************
KeyType getKey(){
    KeyType key = KeyNone;
    //char Key_s = customKeypad.getKey();
     char Key_s = (char)incomingByte;
  while(Key_s != '#'){
    switch (Key_s){
      case NO_KEY:
        break;
        case 'r':
        roundDesiredWidth -= .1;
        lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Girdle Dimensions");
  lcd.setCursor(0,1);
  lcd.print("Stone W:");
  lcd.print(roundWidth);
  lcd.setCursor(18,1);
  lcd.print("mm");
  lcd.setCursor(0,2);
  lcd.print("Desired W:");
  lcd.print(roundDesiredWidth);
  lcd.setCursor(18,2);
  lcd.print("mm");
  lcd.setCursor(0,3);
  lcd.print("Press Start!");
          Serial.println(Key_s);
        break;
        case 'q':
        roundDesiredWidth += .1;
        lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Girdle Dimensions");
  lcd.setCursor(0,1);
  lcd.print("Stone W:");
  lcd.print(roundWidth);
  lcd.setCursor(18,1);
  lcd.print("mm");
  lcd.setCursor(0,2);
  lcd.print("Desired W:");
  lcd.print(roundDesiredWidth);
  lcd.setCursor(18,2);
  lcd.print("mm");
  lcd.setCursor(0,3);
  lcd.print("Press Start!");
          Serial.println(Key_s);
        break;
        case 'p':
        roundWidth -= .1;
        lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Girdle Dimensions");
  lcd.setCursor(0,1);
  lcd.print("Stone W:");
  lcd.print(roundWidth);
  lcd.setCursor(18,1);
  lcd.print("mm");
  lcd.setCursor(0,2);
  lcd.print("Desired W:");
  lcd.print(roundDesiredWidth);
  lcd.setCursor(18,2);
  lcd.print("mm");
  lcd.setCursor(0,3);
  lcd.print("Press Start!");
          Serial.println(Key_s);
        break;
        case 'o':
        roundWidth += .1;
        lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Girdle Dimensions");
  lcd.setCursor(0,1);
  lcd.print("Stone W:");
  lcd.print(roundWidth);
  lcd.setCursor(18,1);
  lcd.print("mm");
  lcd.setCursor(0,2);
  lcd.print("Desired W:");
  lcd.print(roundDesiredWidth);
  lcd.setCursor(18,2);
  lcd.print("mm");
  lcd.setCursor(0,3);
  lcd.print("Press Start!");
          Serial.println(Key_s);
        break;
      case '0':
        key = KeyEnter;
          Serial.println(Key_s);
        break;
      case '1':
        key = KeyLeft;
          Serial.println(Key_s);
        break;
      case '2':
        key = KeyExit;
          Serial.println(Key_s);
          YaxisMotor->release();//this will release the y axis motor and stop it from moving
          XaxisMotor->release();//this will release the x axis motor and stop it from moving
        break;
      case '3':
        key = KeyRight;
          Serial.println(Key_s);
        break;
      case '8':
        key = KeyUp;
          Serial.println(Key_s);
        break; // [2025-12-06 15:06] Fixed missing UP command for control pad navigation
      case '*':
          lcd.clear();
          g_Menu.printMenu();
        break;
        case 'b':
          Serial.println(Key_s);
        indexMotor.step(backwardSingleStep); //-----------------------------------------------------manualControl index 
        break;
      case 'c':
          Serial.println(Key_s);
          indexMotor.step(forwardSingleStep);
        break;
        case 'd':
        countX -= 1;
        Serial.println(countX);
          Serial.println(Key_s);
          XaxisMotor->step(1,FORWARD,SINGLE);//moves the X axis left
          Serial1.print("delay=10"); // command to set delay while key pressed
          Serial1.print("\xFF\xFF\xFF"); // Nextion end command
          Serial1.print("vis left,1"); // command to set button to visible after movement is made
          Serial1.print("\xFF\xFF\xFF"); // Nextion end command

        break;
        case 'e':
        countY -= 1;
        Serial.println(countY);
          Serial.println(Key_s);
          YaxisMotor->step(1,BACKWARD,MICROSTEP);//moves the Y axis up 1 step 825
          Serial1.print("delay=10"); // command to set delay while key pressed
          Serial1.print("\xFF\xFF\xFF"); // Nextion end command
          Serial1.print("vis up,1"); // command to set button to visible after movement is made
          Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        break;
        case 'f':
        countX += 1;
        Serial.println(countX);
          Serial.println(Key_s);
          XaxisMotor->step(1,BACKWARD,SINGLE);//moves the X axis right
          Serial1.print("delay=10"); // command to set delay while key pressed
          Serial1.print("\xFF\xFF\xFF"); // Nextion end command
          Serial1.print("vis right,1"); // command to set button to visible after movement is made
          Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        break;
        case 'g':
          Serial.println(Key_s);
          PaxisMotor->step(1,FORWARD,MICROSTEP);//Changed from FORWARD to backward 8/25/2024 9/16 AUS MINI
         if(xVarTo<xVar){
          xVarToOffset=xVarToOffset-2;
          Serial.println(xVarToOffset);
         }
         if(yVarTo<yVar){
          yVarToOffset=yVarToOffset-10;
          Serial.println(yVarToOffset);
         }
        break;
        case 'h':
          Serial.println(Key_s);
          settingsHomePreform();
        break;
        case 'i':
        countY += 1;
        Serial.println(countY);
          Serial.println(Key_s);
          YaxisMotor->step(1,FORWARD,MICROSTEP);//moves the Y axis down 1 step 825
          Serial1.print("delay=10"); // command to set delay while key pressed
          Serial1.print("\xFF\xFF\xFF"); // Nextion end command
          Serial1.print("vis down,1"); // command to set button to visible after movement is made
          Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        break;
        case 'j':
          Serial.println(Key_s);
          PaxisMotor->step(1,BACKWARD,MICROSTEP);//changed from BACKWARD TO FORWARD 8/25/2024 9/16 AUS MINI
          if(xVarTo<xVar){
          xVarToOffset=xVarToOffset+2;
          Serial.println(xVarToOffset);
         }
         if(yVarTo<yVar){
          yVarToOffset=yVarToOffset+10;
          Serial.println(yVarToOffset);
         }
          
        break;
        case 'k':
          Serial.println(Key_s);
           settingsHome();
        break;
        case 'l':
          Serial.println(Key_s);
           pAxisHome();
        break;
        case 'm':
          Serial.println(Key_s);
          //YaxisSteps +=1;
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Cut ");
        //YaxisMotor->step(1,FORWARD,MICROSTEP);//825
        for (int i=1; i<=8; i++){
  XaxisMotor->step (80,FORWARD,SINGLE);
  XaxisMotor->step (80,BACKWARD,SINGLE);
        }
        break;
        case 'n':
          Serial.println(Key_s);
         xVar = 4200;
         yVar = 3300;
         xVarTo = 1100;
         yVarTo = 300;
        countX = 4200;
        countY = 3300;
        closeTo();
          
          
        break;
        case 's'://if angle is less than 90 degrees or stone is too large dont move stone so close to wheel
          Serial.println(Key_s);
         xVar = 4200;
         yVar = 3300;
         xVarTo = 1100-xVarToOffset;
         yVarTo = 1400+yVarToOffset;
        countX = 4200;
        countY = 3300;
        closeTo();
        break;
        
      }//close switch
      return key;
    }//close while loop
}//close getKey()
//Functions--------------------------------------------------------------------Functions to call

// ********************************************
// settings
// ********************************************
void settings(){
  lcd.clear();
  lcd.setCursor(0,1);
  lcd.print("settings()    ");
  Serial1.print("page 1"); // command to load page
  Serial1.print("\xFF\xFF\xFF"); // Nextion end command

}//close settings() function

//chuckLocation
void chuckLocation(){
//output current chuck Location
//lcd.clear();
  //     lcd.setCursor(0,0);
    //   lcd.print("X Location: ");
      // lcd.setCursor(12,0);
       //lcd.print(calibratedXPositionChuck);
       //lcd.setCursor(0,1); 
        //lcd.print("Y Location: ");
       //lcd.setCursor(12,1);
       //lcd.print(calibratedYPositionChuck);
}//close chuckLocation()

//chuckCalibration
void chuckCalibration(){
  settingsHome();//run home function
  
//no dop aka chuck calibration variables... used to calculate the length of dop stick
  homeYOffsetStepsChuck = 0;
  homeXOffsetStepsChuck = 0;
  
   
  calibratedYPositionChuck = 0;
  calibratedXPositionChuck = 0;
    

  //ChuckY = calibratedYPositionChuck;
  //ChuckX = calibratedXPositionChuck;
  //move the chuck close to the wheel
  //move the Y axis Close to the wheel----------------------------------------Step 1
       lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Moving Y Axis down");
      for (int i = 0; i < 2500; i++){//for loop to step 3000 steps is just at edge of wheel
      YaxisMotor->step(1,FORWARD,MICROSTEP);//825move down one step every loop
      homeYOffsetStepsChuck = homeYOffsetStepsChuck + 1;// add one to the home offset for the Y axis every step 
       lcd.setCursor(0,1);
       lcd.print(homeYOffsetStepsChuck);
      }//close loop to move Y Axis close to the wheel

       //move the Y axis Close to the wheel----------------------------------------Step 2
       lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Moving X Axis left");
      for (int i = 0; i < 1000; i++){//for loop to step
      XaxisMotor->step(1,FORWARD,SINGLE);//move left one step every loop
      homeXOffsetStepsChuck = homeXOffsetStepsChuck + 1;// add one to the home offset for the X axis every step 
       lcd.setCursor(0,1);
       lcd.print(homeXOffsetStepsChuck);
      }//close loop to move X Axis close to the wheel

      //automatically calibrate position-------------------------------------------------------------------------------- Step 3
          
      
  
      calibratedYPositionChuck = 0;
      int yPositionChuckSet = 0;

      calibratedXPositionChuck = 0;
      int xPositionChuckSet = 0;

      
      //loop for the x calibrator limit switch 
 limitSwitchCalx.loop();
 

//loop for limit switch x calibrator--------------------------------------limit switch x calibrator
  if(limitSwitchCalx.isPressed())
 Serial.println("x cal limit switch: Untouched -> Touched");
  
 if(limitSwitchCalx.isReleased())
 Serial.println("x limit cal switch: Touched -> Untouched");

 
       lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Calibrating...");
       
      //the x calibaration function can be ran. 
 while(xPositionChuckSet == 0){
       limitSwitchCalx.loop();
       lcd.clear();
       lcd.setCursor(0,1);
       lcd.print("Calibrating X");
    //XaxisMotor->step(1,FORWARD,SINGLE);// move down one step every loop
    homeXOffsetStepsChuck = homeXOffsetStepsChuck + 1;// add one to the home offset for the X axis every step
      if(limitSwitchCalx.isPressed()){//check if limit switch X has been pressed
 Serial.println("cal x limit switch: Untouched -> Touched");//output that the x limit switch has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("X Calibrated");
      xPositionChuckSet = xPositionChuckSet + 1;//set the yPositionChuckSet to 1 so that the loop stops
        calibratedXPositionChuck = homeXOffsetStepsChuck;//set the position for the calibrated X position, this will be used for calculating the length of the dop stick 
        XaxisMotor->release();//this will release the x axis motor and stop it from moving
        XaxisMotor->step(200,BACKWARD,SINGLE);//offset 100 steps from the Xswitch, so the machine can run its home function
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("X Calibrated");

      }//close if statement for x limit switch pressed
  }//close while loop for x calibration

//loop for the y calibrator limit switch 
  limitSwitchCaly.loop();

  //loop for limit switch y calibrator--------------------------------------limit switch y calibrator

 lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Calibrating...");
       
    while(yPositionChuckSet == 0){
      limitSwitchCaly.loop();
      lcd.clear();
      lcd.setCursor(0,1);
       lcd.print("Calibrating Y");
      //YaxisMotor->step(1,BACKWARD,MICROSTEP);//825move down one step every loop
      homeYOffsetStepsChuck = homeYOffsetStepsChuck + 1;// add one to the home offset for the Y axis every step
      if(limitSwitchCaly.isPressed()){//check to see if limit switch Y(on calibrator) has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Y Calibrated");
        yPositionChuckSet = yPositionChuckSet + 1;//set the yPositionChuckSet to 1 so that the loop stops
        calibratedYPositionChuck = homeYOffsetStepsChuck;//set the position for the calibrated Y position, this will be used for calculating the length of the dop stick
        //YaxisMotor->release();//this will release the y axis motor and stop it from moving
        YaxisMotor->step(100,BACKWARD,MICROSTEP);//825offset 100 steps from the Yswitch

      }//close if statement for y limit switch pressed
    }//close while loop for y calibration
  
      
   XaxisMotor->release();//this will release the x axis motor and stop it from moving
   //YaxisMotor->release();//this will release the Y axis motor and stop it from moving


      //manually move the chuck into calibrated position if it is off a bit---------------------------Step 4
      while(Start != '2'){
  Start=customKeypad.getKey();
  //char Start = (char)incomingByte;
    switch (Start){
      case NO_KEY:
        break;
        //move x axis to the left
      case '1'://move 1 step left
XaxisMotor->step(1,FORWARD,SINGLE);//move left one step 
homeXOffsetStepsChuck = homeXOffsetStepsChuck + 1;// add 1 to the home offset for the x axis
        break;
      case '2'://exit to menu and save calibrated location---------------------------------------------------exit
         g_Menu.printMenu();
        break;
        //move x axis to the right 
      case '3'://move one step right------------------------------------------------------------------------one step right
        XaxisMotor->step(1,BACKWARD,SINGLE);//move right one step 
homeXOffsetStepsChuck = homeXOffsetStepsChuck - 1;// subtract 1 from the home offset for the x axis
       lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("X Location: ");
       lcd.setCursor(12,0);
       lcd.print(homeXOffsetStepsChuck);
       lcd.setCursor(0,1);
        lcd.print("Y Location: ");
       lcd.setCursor(12,1);
       lcd.print(homeYOffsetStepsChuck);
        break;      
        //save the calibrated location----------------------------------------------------------------------save 
        case '0':
         calibratedXPositionChuck = homeXOffsetStepsChuck;
         calibratedYPositionChuck = homeYOffsetStepsChuck;
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Chuck Calibrated");
        lcd.setCursor(0,1);
        lcd.print("Press 2 to Exit");
       
        break;    
        case '5'://move the y axis up---------------------------------------------------------------------move up 1 step
        YaxisMotor->step(1,BACKWARD,MICROSTEP);//825moves the Y axis up 1 step
        homeYOffsetStepsChuck = homeYOffsetStepsChuck -1;//subtract one from the home offset
         lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("X Location: ");
       lcd.setCursor(12,0);
       lcd.print(homeXOffsetStepsChuck);
       lcd.setCursor(0,1);
        lcd.print("Y Location: ");
       lcd.setCursor(12,1);
       lcd.print(homeYOffsetStepsChuck);
        break;
        case '8'://move the y axis down------------------------------------------------------------------move down 1 step
        YaxisMotor->step(1,FORWARD,MICROSTEP);//825moves the Y axis up 1 step
        homeYOffsetStepsChuck = homeYOffsetStepsChuck + 1;//add one to the home offset
         lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("X Location: ");
       lcd.setCursor(12,0);
       lcd.print(homeXOffsetStepsChuck);
       lcd.setCursor(0,1);
        lcd.print("Y Location: ");
       lcd.setCursor(12,1);
       lcd.print(homeYOffsetStepsChuck);
        break;  
        case '4'://10 steps left---------------------------------------------------------------------move left 10 steps
        XaxisMotor->step(10,FORWARD,SINGLE);//move left 10 steps 
homeXOffsetStepsChuck = homeXOffsetStepsChuck + 10;// add 10 to the home offset for the x axis
 lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("X Location: ");
       lcd.setCursor(12,0);
       lcd.print(homeXOffsetStepsChuck);
       lcd.setCursor(0,1);
        lcd.print("Y Location: ");
       lcd.setCursor(12,1);
       lcd.print(homeYOffsetStepsChuck);
        break;
        case '6'://10 steps right--------------------------------------------------------------------move right 10 steps
        XaxisMotor->step(10,BACKWARD,SINGLE);//move right 10 steps 
homeXOffsetStepsChuck = homeXOffsetStepsChuck - 10;// subtract 10 from the home offset for the x axis
 lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("X Location: ");
       lcd.setCursor(12,0);
       lcd.print(homeXOffsetStepsChuck);
       lcd.setCursor(0,1);
        lcd.print("Y Location: ");
       lcd.setCursor(12,1);
       lcd.print(homeYOffsetStepsChuck);
        break;
      }//close switch
      }//close while loop
}//close chuckCalibration()


//dopLocation-----------------------------------------------------------dopLocation
void dopLocation(){
//output dop location
 
}//close dopLocation

//dopCalibration--------------------------------------------------------dopCalibration
void dopCalibration(){
  //settingsHome();//run home function
  //move the dop close to the wheel------------------------------------Step 1

  //homeYSet
  //homeYPosition
  //homeXSet
  //homeXPosition
  //homePSet
  //homePPosition

//Count and save offset from home to wheel----------------------------Step 2
  //homeYOffsetSteps
  //homeXOffsetSteps
  //homePOffsetSteps

//Calculate and save positions----------------------------------------Step 3
  //calibratedYPosition
  //calibratedXPosition
  //calibratedPPosition

  settingsHome();//run home function
  
//dop calibration variables... used to calculate the length of dop stick
  homeYOffsetStepsDop = 0;
  homeXOffsetStepsDop = 0;
  
   
  calibratedYPositionDop = 0;
  calibratedXPositionDop = 0;
    
  //move the Dop close to the wheel
  //move the Y axis Close to the wheel----------------------------------------Step 1
       lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Moving Y Axis down");
      for (int i = 0; i < 2500; i++){//for loop to step 3000 steps is just at edge of wheel
      YaxisMotor->step(1,FORWARD,MICROSTEP);//825move down one step every loop
      homeYOffsetStepsDop = homeYOffsetStepsDop + 1;// add one to the home offset for the Y axis every step 
       lcd.setCursor(0,1);
       lcd.print(homeYOffsetStepsDop);
      }//close loop to move Y Axis close to the wheel

       //move the X axis Close to the wheel----------------------------------------Step 2
       lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Moving X Axis left");
      for (int i = 0; i < 500; i++){//for loop to step
      XaxisMotor->step(1,FORWARD,SINGLE);//move left one step every loop
      homeXOffsetStepsDop = homeXOffsetStepsDop + 1;// add one to the home offset for the X axis every step 
       lcd.setCursor(0,1);
       lcd.print(homeXOffsetStepsDop);
      }//close loop to move X Axis close to the wheel

      //automatically calibrate position-------------------------------------------------------------------------------- Step 3
          
      calibratedYPositionDop = 0;
      int yPositionDopSet = 0;

      calibratedXPositionDop = 0;
      int xPositionDopSet = 0;

      
      //loop for the x calibrator limit switch 
 limitSwitchCalx.loop();
 

//loop for limit switch x calibrator--------------------------------------limit switch x calibrator
  if(limitSwitchCalx.isPressed())
 Serial.println("x cal limit switch: Untouched -> Touched");
  
 if(limitSwitchCalx.isReleased())
 Serial.println("x limit cal switch: Touched -> Untouched");

 
       lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Calibrating...");
       
      //the x calibaration function can be ran. 
 while(xPositionDopSet == 0){
       limitSwitchCalx.loop();
       lcd.clear();
       lcd.setCursor(0,1);
       lcd.print("Calibrating X");
    //XaxisMotor->step(1,FORWARD,SINGLE);// move down one step every loop
    homeXOffsetStepsDop = homeXOffsetStepsDop + 1;// add one to the home offset for the X axis every step
      if(limitSwitchCalx.isPressed()){//check if limit switch X has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("X Calibrated");
      xPositionDopSet = xPositionDopSet + 1;//set the xPositionDopSet to 1 so that the loop stops
        calibratedXPositionDop = homeXOffsetStepsDop;//set the position for the calibrated X position, this will be used for calculating the length of the dop stick 
        //XaxisMotor->release();//this will release the x axis motor and stop it from moving
        XaxisMotor->step(200,BACKWARD,SINGLE);//offset 100 steps from the Xswitch, so the machine can run its home function
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("X Calibrated");

      }//close if statement for x limit switch pressed
  }//close while loop for x calibration

//loop for the y calibrator limit switch 
  limitSwitchCaly.loop();

  //loop for limit switch y calibrator--------------------------------------limit switch y calibrator

 lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Calibrating...");
       
    while(yPositionDopSet == 0){
      limitSwitchCaly.loop();
      lcd.clear();
      lcd.setCursor(0,1);
       lcd.print("Calibrating Y");
      //YaxisMotor->step(1,FORWARD,MICROSTEP);//825move down one step every loop
      homeYOffsetStepsDop = homeYOffsetStepsDop + 1;// add one to the home offset for the Y axis every step
      if(limitSwitchCaly.isPressed()){//check to see if limit switch Y(on calibrator) has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Y Calibrated");
        yPositionDopSet = yPositionDopSet + 1;//set the yPositionDopSet to 1 so that the loop stops
        calibratedYPositionDop = homeYOffsetStepsDop;//set the position for the calibrated Y position, this will be used for calculating the length of the dop stick
        //YaxisMotor->release();//this will release the y axis motor and stop it from moving
        YaxisMotor->step(100,BACKWARD,MICROSTEP);//825offset 100 steps from the Yswitch

      }//close if statement for y limit switch pressed
    }//close while loop for y calibration
  
      
   XaxisMotor->release();//this will release the x axis motor and stop it from moving
   //YaxisMotor->release();//this will release the Y axis motor and stop it from moving


      //manually move the Dop into calibrated position if it is off a bit---------------------------Step 4
      while(Start != '2'){
  Start=customKeypad.getKey();
  //char Start = (char)incomingByte;
    switch (Start){
      case NO_KEY:
        break;
        //move x axis to the left
      case '1'://move 1 step left
XaxisMotor->step(1,FORWARD,SINGLE);//move left one step 
homeXOffsetStepsDop = homeXOffsetStepsDop + 1;// add 1 to the home offset for the x axis
        break;
      case '2'://exit to menu and save calibrated location---------------------------------------------------exit
         g_Menu.printMenu();
        break;
        //move x axis to the right 
      case '3'://move one step right------------------------------------------------------------------------one step right
        XaxisMotor->step(1,BACKWARD,SINGLE);//move right one step 
homeXOffsetStepsDop = homeXOffsetStepsDop - 1;// subtract 1 from the home offset for the x axis
       lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("X Location: ");
       lcd.setCursor(12,0);
       lcd.print(homeXOffsetStepsDop);
       lcd.setCursor(0,1);
        lcd.print("Y Location: ");
       lcd.setCursor(12,1);
       lcd.print(homeYOffsetStepsDop);
        break;      
        //save the calibrated location----------------------------------------------------------------------save 
        case '0':
         calibratedXPositionDop = homeXOffsetStepsDop;
         calibratedYPositionDop = homeYOffsetStepsDop;
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Dop Calibrated");
        lcd.setCursor(0,1);
        lcd.print("Press 2 to Exit");
       
        break;    
        case '5'://move the y axis up---------------------------------------------------------------------move up 1 step
        YaxisMotor->step(1,BACKWARD,MICROSTEP);//825moves the Y axis up 1 step
        homeYOffsetStepsDop = homeYOffsetStepsDop -1;//subtract one from the home offset
         lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("X Location: ");
       lcd.setCursor(12,0);
       lcd.print(homeXOffsetStepsDop);
       lcd.setCursor(0,1);
        lcd.print("Y Location: ");
       lcd.setCursor(12,1);
       lcd.print(homeYOffsetStepsDop);
        break;
        case '8'://move the y axis down------------------------------------------------------------------move down 1 step
        YaxisMotor->step(1,FORWARD,MICROSTEP);//825moves the Y axis up 1 step
        homeYOffsetStepsDop = homeYOffsetStepsDop + 1;//add one to the home offset
         lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("X Location: ");
       lcd.setCursor(12,0);
       lcd.print(homeXOffsetStepsDop);
       lcd.setCursor(0,1);
        lcd.print("Y Location: ");
       lcd.setCursor(12,1);
       lcd.print(homeYOffsetStepsDop);
        break;  
        case '4'://10 steps left---------------------------------------------------------------------move left 10 steps
        XaxisMotor->step(10,FORWARD,SINGLE);//move left 10 steps 
homeXOffsetStepsDop = homeXOffsetStepsDop + 10;// add 10 to the home offset for the x axis
 lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("X Location: ");
       lcd.setCursor(12,0);
       lcd.print(homeXOffsetStepsDop);
       lcd.setCursor(0,1);
        lcd.print("Y Location: ");
       lcd.setCursor(12,1);
       lcd.print(homeYOffsetStepsDop);
        break;
        case '6'://10 steps right--------------------------------------------------------------------move right 10 steps
        XaxisMotor->step(10,BACKWARD,SINGLE);//move right 10 steps 
homeXOffsetStepsDop = homeXOffsetStepsDop - 10;// subtract 10 from the home offset for the x axis
 lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("X Location: ");
       lcd.setCursor(12,0);
       lcd.print(homeXOffsetStepsDop);
       lcd.setCursor(0,1);
        lcd.print("Y Location: ");
       lcd.setCursor(12,1);
       lcd.print(homeYOffsetStepsDop);
        break;
      }//close switch
      }//close while loop


}//close dopCalibration
//roughDimensions-------------------------------------------------------roughDimensions
void roughDimensions(){

}//close roughDimensions
//roughCalibration------------------------------------------------------roughCalibration
void roughCalibration(){
  settingsHome();//run home function
  
//Rough calibration variables... used to calculate the rough stone dimensions
  homeYOffsetStepsRough = 0;
  homeXOffsetStepsRough = 0;
  
   
  calibratedYPositionRough = 0;
  calibratedXPositionRough = 0;
    
  //move the Rough close to the wheel
  //move the Y axis Close to the wheel----------------------------------------Step 1
       lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Moving Y Axis down");
      for (int i = 0; i < 2500; i++){//for loop to step 3000 steps is just at edge of wheel
      YaxisMotor->step(1,FORWARD,MICROSTEP);//825move down one step every loop
      homeYOffsetStepsRough = homeYOffsetStepsRough + 1;// add one to the home offset for the Y axis every step 
       lcd.setCursor(0,1);
       lcd.print(homeYOffsetStepsRough);
      }//close loop to move Y Axis close to the wheel

       //move the Y axis Close to the wheel----------------------------------------Step 2
       lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Moving X Axis left");
      for (int i = 0; i < 500; i++){//for loop to step
      XaxisMotor->step(1,FORWARD,SINGLE);//move left one step every loop
      homeXOffsetStepsRough = homeXOffsetStepsRough + 1;// add one to the home offset for the X axis every step 
       lcd.setCursor(0,1);
       lcd.print(homeXOffsetStepsRough);
      }//close loop to move X Axis close to the wheel

      //automatically calibrate position-------------------------------------------------------------------------------- Step 3
          
      
  
      calibratedYPositionRough = 0;
      int yPositionRoughSet = 0;

      calibratedXPositionRough = 0;
      int xPositionRoughSet = 0;

      
      //loop for the x calibrator limit switch 
 limitSwitchCalx.loop();
 

//loop for limit switch x calibrator--------------------------------------limit switch x calibrator
  if(limitSwitchCalx.isPressed())
 Serial.println("x cal limit switch: Untouched -> Touched");
  
 if(limitSwitchCalx.isReleased())
 Serial.println("x limit cal switch: Touched -> Untouched");

 
       lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Calibrating...");
       
      //the x calibaration function can be ran. 
 while(xPositionRoughSet == 0){
       limitSwitchCalx.loop();
       lcd.clear();
       lcd.setCursor(0,1);
       lcd.print("Calibrating X");
    //XaxisMotor->step(1,FORWARD,SINGLE);// move down one step every loop
    homeXOffsetStepsRough = homeXOffsetStepsRough + 1;// add one to the home offset for the X axis every step
      if(limitSwitchCalx.isPressed()){//check if limit switch X has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("X Calibrated");
      xPositionRoughSet = xPositionRoughSet + 1;//set the yPositionChuckSet to 1 so that the loop stops
        calibratedXPositionRough = homeXOffsetStepsRough;//set the position for the calibrated X position, this will be used for calculating the length of the dop stick 
        XaxisMotor->release();//this will release the x axis motor and stop it from moving
        XaxisMotor->step(200,BACKWARD,SINGLE);//offset 100 steps from the Xswitch, so the machine can run its home function
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("X Calibrated");

      }//close if statement for x limit switch pressed
  }//close while loop for x calibration

//loop for the y calibrator limit switch 
  limitSwitchCaly.loop();

  //loop for limit switch y calibrator--------------------------------------limit switch y calibrator

 lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Calibrating...");
       
    while(yPositionRoughSet == 0){
      limitSwitchCaly.loop();
      lcd.clear();
      lcd.setCursor(0,1);
       lcd.print("Calibrating Y");
      //YaxisMotor->step(1,BACKWARD,MICROSTEP);//825move down one step every loop
      homeYOffsetStepsRough = homeYOffsetStepsRough + 1;// add one to the home offset for the Y axis every step
      if(limitSwitchCaly.isPressed()){//check to see if limit switch Y(on calibrator) has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Y Calibrated");
        yPositionRoughSet = yPositionRoughSet + 1;//set the yPositionRoughSet to 1 so that the loop stops
        calibratedYPositionRough = homeYOffsetStepsRough;//set the position for the calibrated Y position, this will be used for calculating the length of the dop stick
        //YaxisMotor->release();//this will release the y axis motor and stop it from moving
        YaxisMotor->step(100,BACKWARD,MICROSTEP);//825offset 100 steps from the Yswitch

      }//close if statement for y limit switch pressed
    }//close while loop for y calibration
  
      
   XaxisMotor->release();//this will release the x axis motor and stop it from moving
   //YaxisMotor->release();//this will release the Y axis motor and stop it from moving


      //manually move the Rough into calibrated position if it is off a bit---------------------------Step 4
      while(Start != '2'){
  Start=customKeypad.getKey();
  //char Start = (char)incomingByte;
    switch (Start){
      case NO_KEY:
        break;
        //move x axis to the left
      case '1'://move 1 step left
XaxisMotor->step(1,FORWARD,SINGLE);//move left one step 
homeXOffsetStepsRough = homeXOffsetStepsRough + 1;// add 1 to the home offset for the x axis
        break;
      case '2'://exit to menu and save calibrated location---------------------------------------------------exit
         g_Menu.printMenu();
        break;
        //move x axis to the right 
      case '3'://move one step right------------------------------------------------------------------------one step right
        XaxisMotor->step(1,BACKWARD,SINGLE);//move right one step 
homeXOffsetStepsRough = homeXOffsetStepsRough - 1;// subtract 1 from the home offset for the x axis
       lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("X Location: ");
       lcd.setCursor(12,0);
       lcd.print(homeXOffsetStepsRough);
       lcd.setCursor(0,1);
        lcd.print("Y Location: ");
       lcd.setCursor(12,1);
       lcd.print(homeYOffsetStepsRough);
        break;      
        //save the calibrated location----------------------------------------------------------------------save 
        case '0':
         calibratedXPositionRough = homeXOffsetStepsRough;
         calibratedYPositionRough = homeYOffsetStepsRough;
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Rough Calibrated");
        lcd.setCursor(0,1);
        lcd.print("Press 2 to Exit");
       
        break;    
        case '5'://move the y axis up---------------------------------------------------------------------move up 1 step
        YaxisMotor->step(1,BACKWARD,MICROSTEP);//825moves the Y axis up 1 step
        homeYOffsetStepsRough = homeYOffsetStepsRough -1;//subtract one from the home offset
         lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("X Location: ");
       lcd.setCursor(12,0);
       lcd.print(homeXOffsetStepsRough);
       lcd.setCursor(0,1);
        lcd.print("Y Location: ");
       lcd.setCursor(12,1);
       lcd.print(homeYOffsetStepsRough);
        break;
        case '8'://move the y axis down------------------------------------------------------------------move down 1 step
        YaxisMotor->step(1,FORWARD,MICROSTEP);//825moves the Y axis up 1 step
        homeYOffsetStepsRough = homeYOffsetStepsRough + 1;//add one to the home offset
         lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("X Location: ");
       lcd.setCursor(12,0);
       lcd.print(homeXOffsetStepsRough);
       lcd.setCursor(0,1);
        lcd.print("Y Location: ");
       lcd.setCursor(12,1);
       lcd.print(homeYOffsetStepsRough);
        break;  
        case '4'://10 steps left---------------------------------------------------------------------move left 10 steps
        XaxisMotor->step(10,FORWARD,SINGLE);//move left 10 steps 
homeXOffsetStepsRough = homeXOffsetStepsRough + 10;// add 10 to the home offset for the x axis
 lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("X Location: ");
       lcd.setCursor(12,0);
       lcd.print(homeXOffsetStepsRough);
       lcd.setCursor(0,1);
        lcd.print("Y Location: ");
       lcd.setCursor(12,1);
       lcd.print(homeYOffsetStepsRough);
        break;
        case '6'://10 steps right--------------------------------------------------------------------move right 10 steps
        XaxisMotor->step(10,BACKWARD,SINGLE);//move right 10 steps 
homeXOffsetStepsRough = homeXOffsetStepsRough - 10;// subtract 10 from the home offset for the x axis
 lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("X Location: ");
       lcd.setCursor(12,0);
       lcd.print(homeXOffsetStepsRough);
       lcd.setCursor(0,1);
        lcd.print("Y Location: ");
       lcd.setCursor(12,1);
       lcd.print(homeYOffsetStepsRough);
        break;
      }//close switch
      }//close while loop
}//close roughCalibartion

// ********************************************
// design
// ********************************************
void design(){
  lcd.clear();
  lcd.setCursor(0,1);
  lcd.print("design()   ");
  
}//close design() function

// ********************************************
// design design
// ********************************************
void designDesign(){
  lcd.clear();
  lcd.setCursor(0,1);
  lcd.print("designDesign()   ");
  
}//close designDesign() function




// *******************************************************************************************
//                                                                       preform Girdle Round
// *******************************************************************************************
void preformGRoundSettings(){
  
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Dimensions");
  lcd.setCursor(0,1);
  lcd.print("Stone Width:");
  lcd.print(roundWidth);
  lcd.setCursor(18,1);
  lcd.print("mm");
  lcd.setCursor(0,2);
  lcd.print("Desired W:");
  lcd.print(roundDesiredWidth);
  lcd.setCursor(18,2);
  lcd.print("mm");
  lcd.setCursor(0,3);
  lcd.print("Press Start!");
  preformGRound();
}//close preformGRoundSettings()

void preformGRound(){
  
  lcd.clear();
  Serial.println("Function preformGRound() was called.");
  lcd.setCursor(0,1);
  lcd.print("Preform Round");
  stepsForward = 0;//set the steps forward back to zero
  stepsDown = 0;//set the steps down back to zero

//Ready state and buzzer tone to start
lcd.clear();
lcd.setCursor(0,0);
lcd.setCursor(0,0);
lcd.print("                    600 Grit Lap");
lcd.setCursor(0,1);
lcd.print("Position stone to");
lcd.setCursor(0,2);
Serial.println("Press 0 to start");
//tone(buzzer,1900,100);
while (Start==0){
  Start=customKeypad.getKey();
  //char Start = (char)incomingByte;
  }
//tone(buzzer,1900,100);
lcd.clear();
lcd.setCursor(0,0);
lcd.print("Rounding");
lcd.setCursor(0,1);
lcd.print("Cycle # ");
lcd.setCursor(9,2);
lcd.print(cycleCount);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//get the starting time
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

unsigned long StartTime = millis();

//indexMotor->setSpeed(100);
XaxisMotor->setSpeed(3000);//3000 rpms is max speed for nema 17
YaxisMotor->setSpeed(100);
PaxisMotor->setSpeed(300);
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//cuts 20 revolutions, moves down one step and forward one steps
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//roundWidth = 25.5;// in mm
//roundDesiredWidth = 15.9;// in mm
//PaxisMotor->step(1, BACKWARD,MICROSTEP); //Put preassure on the lap  
rotations = (roundWidth - roundDesiredWidth) * 56; // this will remove 1 mm of material for every 56 steps with 600 grit lap (56*.018mm) steps down is 1mm of movement
for (rotationCount = 0; rotationCount < rotations; rotationCount++){
  YaxisMotor->step(1, FORWARD,MICROSTEP);//825 320 SINGLEs = 1 mm 1 SINGLE = .003125mm one step down lower to wheel 40 steps per 1mm of movement from 5 deg ball screw at 200 steps per revolution
  
          Serial1.print("yVar.val-=1"); //subtract 1 from the y var on touch screen
          Serial1.print("\xFF\xFF\xFF"); // Nextion end command
          Serial.println("Step Down");
          //unsigned long CurrentTime = millis();
 // unsigned long ElapsedTime = CurrentTime - StartTime;
 // unsigned long minTime = ElapsedTime/60000;
    lcd.clear();
lcd.setCursor(0,0);
//lcd.print ("Minutes Running:");
//lcd.setCursor(17,0);
//lcd.print (minTime);

 lcd.setCursor(0,3);
  lcd.print ("Steps:");
  lcd.setCursor(7,3);
  lcd.print(rotationCount);//counter for layers cut
  lcd.setCursor(10,3);
  lcd.print ("of "); // set this to the number of steps
  lcd.print (rotations);
  stepsDown = stepsDown + 1;//count the steps of downward movement
for (int i = 0; i < 1920; i++){ //set this to the times to rotate 96 = 1 revolution THIS IS THE ONE* 1920 is 20 revolutions per 1 step down

//unsigned long CurrentTime = millis();
  //unsigned long ElapsedTime = CurrentTime - StartTime;
  //unsigned long minTime = ElapsedTime/60000;
//lcd.clear();
//lcd.setCursor(0,0);
//lcd.print ("Minutes Running:");
//lcd.setCursor(17,0);
//lcd.print (minTime);


 //lcd.setCursor(0,3);
  //lcd.print ("Steps:");
  //lcd.setCursor(7,3);
  //lcd.print(rotationCount + 1);//counter for layers cut
  //lcd.setCursor(13,3);
 // lcd.print ("of "); // set this to the number of steps
  //lcd.print (rotations);

  //YaxisMotor->step(1, FORWARD,SINGLE);// 320 SINGLEs = 1 mm 1 SINGLE = .018mm
  //indexMotor->step(96,FORWARD, SINGLE); //96 equals one full revolution
  for(int s = 0; s < 8; s++){
  indexMotor.step(1);
  //indexMotor.step(960); //turn 10 revolutions
  }//close for loop
  //XaxisMotor->step(1,FORWARD, SINGLE); //double check starting clearance from stepper motor to drip pan
  //stepsForward = stepsForward + 1;//count the steps of forward movement
  //stepsDown = stepsDown + 1;//count the steps of downward movement

}//close for loop
}//close for loop for number of rotations

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//move quill up 10mm out of the way of the wheel while still rotating. release quill for inspection and to re-locate stone to edge of wheel.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

for (int i = 0; i < (stepsDown + 50); i++){
  YaxisMotor->step(1, BACKWARD,MICROSTEP);//825 320 SINGLEs = 1 mm 1 SINGLE = .018mm one step up from wheel
  
          Serial1.print("yVar.val+=1"); //add one to the y var on touch screen
          Serial1.print("\xFF\xFF\xFF"); // Nextion end command
          
  stepsDown = stepsDown - 1;//count the steps of upward movement
for (int i = 0; i < 192; i++){ //set this to the times to rotate 192 is 2 times for moving stone up

  for(int s = 0; s < 8; s++){
  indexMotor.step(1);
  //indexMotor.step(96); //turn 1 revolution
  }//close for loop
  
  //stepsForward = stepsForward + 1;//count the steps of forward movement
  //stepsDown = stepsDown + 1;//count the steps of downward movement

}//close for loop
}//close for loop for number of rotations

//YaxisMotor->release();//this will release the y axis motor and stop it from moving
XaxisMotor->release();//this will release the x axis motor and stop it from moving
lcd.clear();
lcd.setCursor(0,0);
lcd.print("Press X");//exit
g_Menu.printMenu();
   
}//close preformGRound() function

// ************************************************************************************************************
//                                                                                       preform Pavilion Round
// ************************************************************************************************************
/*
void preformPRound(){
  lcd.clear();
  Serial.println("Function preformPRound() was called.");
  lcd.setCursor(0,1);
  lcd.print("Preform Pavilion Round");
  stepsForward = 0;//set the steps forward back to zero
  stepsDown = 0;//set the steps down back to zero

//Ready state and buzzer tone to start
lcd.clear();
lcd.setCursor(0,0);
lcd.print("Round Pavilion by .5mm");
lcd.setCursor(0,1);
lcd.print("                    PRESS 1 TO START");
lcd.setCursor(0,2);
lcd.print("Position stone");
lcd.setCursor(0,3);
lcd.print("Set angle to 45* deg");
Serial.println("Press 1 to start");
//tone(buzzer,1900,100);
while (Start==0){
  Start=customKeypad.getKey();
  //char Start = (char)incomingByte;
  }
//tone(buzzer,1900,100);
lcd.clear();
lcd.setCursor(0,0);
lcd.print("Rounding Girdle");
lcd.setCursor(0,1);
lcd.print("Cycle # ");
lcd.setCursor(9,2);
lcd.print(cycleCount);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//get the starting time
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

unsigned long StartTime = millis();

//indexMotor->setSpeed(100);
XaxisMotor->setSpeed(100);
YaxisMotor->setSpeed(100);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//cuts one revolution, moves down one step and forward one steps
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//PaxisMotor->step(1, FORWARD,MICROSTEP); //Put preassure on the lap 

for (int i = 0; i < 2; i++){ //set this to the depth you want to cut to achieve a round outline. 40 = .5mm
  unsigned long CurrentTime = millis();
  unsigned long ElapsedTime = CurrentTime - StartTime;
  unsigned long minTime = ElapsedTime/60000;

lcd.setCursor(0,0);
lcd.print ("Minutes Running:");
lcd.setCursor(17,0);
lcd.print (minTime);

 lcd.setCursor(0,3);
  lcd.print ("Rotation:");
  lcd.setCursor(10,3);
  lcd.print(i+1);//counter for layers cut
  lcd.setCursor(13,3);
  lcd.print ("of 2"); // set this to the same number as the layers of cutting
  
  YaxisMotor->step(1, FORWARD,MICROSTEP);//825 320 SINGLEs = 1 mm 1 SINGLE = .003125mm
  //indexMotor->step(96,FORWARD, SINGLE); //96 equals one full revolution
  indexMotor.step(96);
  XaxisMotor->step(1,FORWARD,SINGLE); //double check starting clearance from stepper motor to drip pan
  stepsForward = stepsForward + 1;//count the steps of forward movement
  stepsDown = stepsDown + 1;//count the steps of downward movement

}//close for loop

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//move quill up 10mm out of the way of the wheel. release quill for inspection and to re-locate stone to edge of wheel.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

YaxisMotor->step(200,BACKWARD,MICROSTEP);//825this will raise the quill
XaxisMotor->step(stepsForward,BACKWARD, SINGLE);//this will move the quill back to the spot it started 60 steps back  
//YaxisMotor->release();//this will release the y axis motor
XaxisMotor->release();//this will release the x axis motor

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//sounds triple tone to indicate cutting is complete
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//tone(buzzer,1900,500);
//delay(1000);
//tone(buzzer,1200,500);
//delay(1000);
//tone(buzzer,1900,500);


lcd.clear();
lcd.setCursor(0,0);
lcd.print("FINISHED CUTTING");//line 1
lcd.setCursor(0,1);
lcd.print("X & Y Axis Released");//line 2
lcd.setCursor(0,2);
lcd.print("Cut Again?");//line 3
lcd.setCursor(0,3);
lcd.print("Press 1 to cut again");//line 4
lcd.setCursor(20,4);
lcd.print("Triple Press 2 exits 0 Cut Again");//line 4
//tone(buzzer,1900,100);
Start = 0;
Start=customKeypad.getKey();
//char Start = (char)incomingByte;
while(Start != '2'){
  Start=customKeypad.getKey();
  //char Start = (char)incomingByte;
    switch (Start){
      case NO_KEY:
        break;
      case '1':
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  
//Press a key to do the cycle again, quill lowers back to position
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
YaxisMotor->step(400,FORWARD, MICROSTEP);//825
cycleCount = cycleCount + 1;
preformPRound();
        break;
      case '2':
         cycleCount = 1;
         g_Menu.printMenu();
        break;
      }//close switch
    }//close while loop  
}//close preformPRound() function
*/

// *********************************************************************************************
//                                                                           preform Crown Round
// *********************************************************************************************
/*
void preformCRound(){
  
}//close preformCRound() function
*/
/*
  //Triangle--------------------------------------------------------------------Triangle Preform
  void preformGTriangle(){
lcd.clear();
 }//close
 void preformPTriangle(){
lcd.clear();
 }//close
 void preformCTriangle(){
lcd.clear();
 }//close
  //Square---------------------------------------------------------------------Square Preform
  void preformGSquare(){
    
 }//close preformGSquare()
 void preformPSquare(){
  
 }//close preformCSquare()
  
  //Hexagon-------------------------------------------------------------------Hexagon Preform
  void preformGHexagon(){
lcd.clear();
 }//close
 void preformPHexagon(){
lcd.clear();
 }//close
 void preformCHexagon(){
lcd.clear();
 }//close

  //Octagon-------------------------------------------------------------------Octagon Preform
  void preformGOctagon(){
lcd.clear();
 }//close
 void preformPOctagon(){
lcd.clear();
 }//close
 void preformCOctagon(){
lcd.clear();
 }//close
 
  //Dodecagon------------------------------------------------------------------Dodecagon Preform
  void preformGDodecagon(){
lcd.clear();
 }//close
 void preformPDodecagon(){
lcd.clear();
 }//close
 void preformCDodecagon(){
lcd.clear();
 }//close
*/
// ************************************************************************************************
// preform Table Flat                                                           Preform Table Flat
// ************************************************************************************************
/*
void preformT(){
  lcd.clear();
  Serial.println("Function preformT() was called.");
  lcd.setCursor(0,1);
  lcd.print("Preform Table");
  stepsForward = 0;//set the steps forward back to zero
  stepsDown = 0;//set the steps down back to zero

//Ready state and buzzer tone to start
lcd.clear();
lcd.setCursor(0,0);
lcd.print("Cut Table by .5mm");
lcd.setCursor(0,1);
lcd.print("                    PRESS 1 TO START");
lcd.setCursor(0,2);
lcd.print("Position stone");
lcd.setCursor(0,3);
lcd.print("Set angle to 0* deg");
Serial.println("Press 1 to start");
//tone(buzzer,1900,100);
while (Start==0){
  Start=customKeypad.getKey();
  //char Start = (char)incomingByte;
  }
//tone(buzzer,1900,100);
lcd.clear();
lcd.setCursor(0,0);
lcd.print("Cutting Table");
lcd.setCursor(0,1);
lcd.print("Cycle # ");
lcd.setCursor(9,2);
lcd.print(cycleCount);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//get the starting time
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

unsigned long StartTime = millis();

//indexMotor->setSpeed(100);
XaxisMotor->setSpeed(100);
YaxisMotor->setSpeed(100);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//cuts one revolution, moves down one step and forward one steps
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//PaxisMotor->step(1, BACKWARD, SINGLE); //Put preassure on the lap 

for (int i = 0; i < 2; i++){ //set this to the depth you want to cut to achieve a round outline. 40 = .5mm
  YaxisMotor->step(1, FORWARD,MICROSTEP);//825 320 SINGLEs = 1 mm 1 SINGLE = .003125mm
  //indexMotor->step(96,FORWARD, SINGLE); //96 equals one full revolution
  indexMotor.step(96);
  XaxisMotor->step(1,FORWARD,SINGLE); //double check starting clearance from stepper motor to drip pan
  stepsForward = stepsForward + 1;//count the steps of forward movement
  stepsDown = stepsDown + 1;//count the steps of downward movement
  
  //print the elapsed time in seconds
  unsigned long CurrentTime = millis();
  unsigned long ElapsedTime = CurrentTime - StartTime;
  unsigned long minTime = ElapsedTime/60000;
  lcd.clear();
  lcd.setCursor(0,1);
  lcd.print ("Minutes:" + minTime);
  lcd.setCursor(11,1);

  lcd.setCursor(0,3);
  lcd.print ("Rotation:");
  lcd.setCursor(10,3);
  lcd.print(i+1);//counter for layers cut
  lcd.setCursor(13,3);
  lcd.print ("of 2"); // set this to the same number as the layers of cutting

}//close for loop

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//move quill up 10mm out of the way of the wheel. release quill for inspection and to re-locate stone to edge of wheel.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

YaxisMotor->step(200,BACKWARD,MICROSTEP);//825this will raise the quill
XaxisMotor->step(stepsForward,BACKWARD, SINGLE);//this will move the quill back to the spot it started 60 steps back  
YaxisMotor->release();//this will release the y axis motor
XaxisMotor->release();//this will release the x axis motor

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//sounds triple tone to indicate cutting is complete
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//tone(buzzer,1900,500);
//delay(1000);
//tone(buzzer,1200,500);
//delay(1000);
//tone(buzzer,1900,500);


lcd.clear();
lcd.setCursor(0,0);
lcd.print("FINISHED CUTTING");//line 1
lcd.setCursor(0,1);
lcd.print("X & Y Axis Released");//line 2
lcd.setCursor(0,2);
lcd.print("Cut Again?");//line 3
lcd.setCursor(0,3);
lcd.print("Press 1 to cut again");//line 4
lcd.setCursor(20,4);
lcd.print("Triple Press 2 exits");//line 4
//tone(buzzer,1900,100);
Start = 0;
Start=customKeypad.getKey();
//char Start = (char)incomingByte;
while(Start != '2'){
  Start=customKeypad.getKey();
  //char Start = (char)incomingByte;
    switch (Start){
      case NO_KEY:
        break;
      case '1':
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  
//Press a key to do the cycle again, quill lowers back to position
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
YaxisMotor->step(200,FORWARD, MICROSTEP);//825
cycleCount = cycleCount + 1;
preformT();
        break;
      case '2':
      cycleCount = 1;
         g_Menu.printMenu();
        break;
      }//close switch
    }//close while loop  
}//close preformT() function
*/
// ********************************************
// cut
// ********************************************
void cut(){
  lcd.clear();
  Serial.println("Function cut() was called.");
  lcd.setCursor(0,1);
  lcd.print("cut()    ");
}//close cut() function





void switchTest(){
//limit switch
      int testYSet = 0; 
      int testXSet = 0;
      int testPSet = 0;
      //limit switch
 //limitSwitchx.loop();
 //limitSwitchy.loop();
 //limitSwitchp.loop();

 

 //loop for limit switch p-----------------------------------------limit switch p
 //if(limitSwitchp.isPressed())
 //Serial.println("p limit switch: Untouched -> Touched Angle Set to 90");

 //if(limitSwitchp.isReleased())
 //Serial.println("p limit switch: Touched -> Untouched");
 

 //else Serial.println("p limit switch: Touched");
//loop for limit switch x--------------------------------------limit switch x
  //if(limitSwitchx.isPressed())
 //Serial.println("x limit switch: Untouched -> Touched");

 //if(limitSwitchx.isReleased())
 //Serial.println("x limit switch: Touched -> Untouched");

 //loop for limit switch y--------------------------------------limit switch y
  //if(limitSwitchy.isPressed())
 //Serial.println("y limit switch: Untouched -> Touched 9");

 //if(limitSwitchy.isReleased())
 //Serial.println("y limit switch: Touched -> Untouched");

       lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Start Switch Test &");
       
    while(testPSet != 90){//loop until the p switch is pressed
      limitSwitchp.loop();
      lcd.setCursor(0,1);
       lcd.print("Press Angle Switch");
      if(limitSwitchp.isPressed()){//check to see if limit switch P has been pressed
 Serial.println("p limit switch: Untouched -> Touched");//output that the p limit switch has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Switch Works!");
        Serial1.print("progressBar.val+=33"); // command to update page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        Serial1.print("angleSetText.txt=\"Working\""); // command to update page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        Serial1.print("angleSetText.pco=1024"); // command to update page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        Serial1.print("progressText.txt=\"Progress: 33.333%\""); // command to update page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        testPSet = 90;//set the testYSet to 90 so that the loop stops
      //now that the p switch is tested
      //the Y switch can now be tested 
      }
    }//close p test while loop

    while(testYSet != 90){//loop until the Y Switch is pressed
      limitSwitchy.loop();
      lcd.setCursor(0,1);
       lcd.print("Press Y Switch");
      if(limitSwitchy.isPressed()){//check to see if limit switch Y has been pressed
 Serial.println("y limit switch: Untouched -> Touched 10");//output that the y limit switch has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Switch Y Works!");
        Serial1.print("progressBar.val+=33"); // command to update page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        Serial1.print("yAxisText.txt=\"Working\""); // command to update page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        Serial1.print("yAxisText.pco=1024"); // command to update page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        Serial1.print("progressText.txt=\"Progress: 66.666%\""); // command to update page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        testYSet = 90;//set the testYSet to 90 so that the loop stops
      //now that the y switch is tested
      //the X switch can now be tested 
      }
    }//close y test while loop

    while(testXSet != 90){//loop until x is pressed
      limitSwitchx.loop();
      lcd.setCursor(0,1);
       lcd.print("Press X Switch");
      if(limitSwitchx.isPressed()){//check to see if limit switch X has been pressed
 Serial.println("x limit switch: Untouched -> Touched");//output that the x limit switch has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Switch X Works!");
        Serial1.print("progressBar.val+=33"); // command to update page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        Serial1.print("xAxisText.txt=\"Working\""); // command to update page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        Serial1.print("xAxisText.pco=1024"); // command to update page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        Serial1.print("progressText.txt=\"Progress: 100%\""); // command to update page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        Serial1.print("Settings.sTest.txt=\"1.Switch Test: Complete\""); // command to update page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        Serial1.print("Settings.sTest.pco=1024"); // command to update page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        testXSet = 90;//set the testXSet to 90 so that the loop stops
      //now that the X switch is tested
      //Test complete
      }
    }//close x test while loop
    
  //delay(1000);
  lcd.clear();
  lcd.setCursor(0,1);
  lcd.print("Complete Press X");
  Serial1.print("page 1"); // command to load page
  Serial1.print("\xFF\xFF\xFF"); // Nextion end command
g_Menu.printMenu();
        
}//close switchTest()
void settingsHomePreform(){
  limitSwitchy.resetCount();
     int ystepCount = 0;
      homeYSet = 0; 
      homeYSet2 = 0; 
      homeYPosition = 0;
      homeXSet = 0;
      homeXPosition = 0;
      homePPosition = 0;
      homePSet = 0;
      //limit switch
 limitSwitchx.loop();
 limitSwitchy.loop();
 limitSwitchp.loop();

 

 //loop for limit switch p-----------------------------------------limit switch p
 //if(limitSwitchp.isPressed())
 //Serial.println("p limit switch: Untouched -> Touched Angle Set to 90");

 //if(limitSwitchp.isReleased())
 //Serial.println("p limit switch: Touched -> Untouched Moving Arm up");
 

 //else Serial.println("p limit switch: Touched");
//loop for limit switch x--------------------------------------limit switch x
  //if(limitSwitchx.isPressed())
 //Serial.println("x limit switch: Untouched -> Touched");

 //if(limitSwitchx.isReleased())
 //Serial.println("x limit switch: Touched -> Untouched");

 //loop for limit switch y--------------------------------------limit switch y
  //if(limitSwitchy.isPressed())
 //Serial.println("y limit switch: Untouched -> Touched 11");

 //if(limitSwitchy.isReleased())
 //Serial.println("y limit switch: Touched -> Untouched");

       
    while(homeYSet == 0){
      limitSwitchy.loop();
      lcd.clear();
      lcd.setCursor(0,1);
       lcd.print("Homing Y");
      YaxisMotor->step(1,BACKWARD,SINGLE);//825move up one step every loop
       ystepCount +=1;
      if(limitSwitchy.isPressed()){//check to see if limit switch Y has been pressed
 Serial.println("y limit switch: Untouched -> Touched 12");//output that the y limit switch has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Home Y Set");
        homeYSet = homeYSet + 1;//set the homeYSet to 1 so that the loop stops
        //YaxisMotor->release();//this will release the y axis motor and stop it from moving
        YaxisMotor->step(100,FORWARD,MICROSTEP);//offset 100 steps from the Yswitch, set to home position for Y
        homeYPosition = 0;//set the position for Y, This will be used in later functions to calculate different things such as stone size and tip of dop location
      Serial.println(limitSwitchy.getState());
        if(limitSwitchy.getCount()!=2){
        if(ystepCount<99){//make sure the test has been ran by checking if the y steps have moved more than 99 steps
        while(homeYSet2 == 0){
          Serial.println(limitSwitchy.getCount());
      limitSwitchy.loop();
      lcd.clear();
      lcd.setCursor(0,1);
       lcd.print("Homing Y");
      YaxisMotor->step(1,BACKWARD,SINGLE);//825move up one step every loop
      if(limitSwitchy.isPressed()){//check to see if limit switch Y has been pressed
 Serial.println("y limit switch: Untouched -> Touched 162");//output that the y limit switch has been pressed

        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Home Y Set");
        homeYSet2 = homeYSet2 + 1;//set the homeYSet to 1 so that the loop stops
        //YaxisMotor->release();//this will release the y axis motor and stop it from moving
        YaxisMotor->step(100,FORWARD,MICROSTEP);//825offset 100 steps from the Yswitch, set to home position for Y
        homeYPosition = 0;//set the position for Y, This will be used in later functions to calculate different things such as stone size and tip of dop location
      }//close second check
        }//close if check for y up movement
        }//close count check
      //now that the quill is up and out of the way of everything
      //the x home function can be ran. 
 while(homeXSet == 0){
       limitSwitchx.loop();
       lcd.clear();
       lcd.setCursor(0,1);
       lcd.print("Homing X");
    XaxisMotor->step(1,BACKWARD,SINGLE);// move back one step every loop
    //delay(10);
      if(limitSwitchx.isPressed()){//check if limit switch X has been pressed
 Serial.println("x limit switch: Untouched -> Touched");//output that the x limit switch has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Home X Set");
      homeXSet = homeXSet + 1;//set the homeXSet to 1 so that the loop stops
      //XaxisMotor->release();//this will release the x axis motor and stop it from moving
      XaxisMotor->step(50,FORWARD,SINGLE);//offset 50 steps from the Xswitch, set to home position for X
      homeXPosition = 0;//set the position for X, This will be used in later functions to calculate different things such as stone size and tip of dop location
      }//close if statement
  }//close while loop
      }
    }//close if statement for Y limit Switch Pressed
  }//close while loop for Y limit Switch
  lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Setting Home");
       PaxisMotor->step(10,BACKWARD,MICROSTEP);//make sure the angle is less than 90 (changed from Forward to backward 8/25/2024)
    while(homePSet != 90){//loop until the Protractor angle is set to 90
      limitSwitchp.loop();
      lcd.setCursor(0,1);
       lcd.print("Homing P Angle");
       PaxisMotor->step(1,BACKWARD,MICROSTEP);//move up one step every loop (changed from backward to forward 8/25/2024) 9/16 aus mini 
      if(limitSwitchp.isPressed()){//check to see if limit switch P has been pressed
 Serial.println("p limit switch: Untouched -> Touched");//output that the p limit switch has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Home P Angle Set to 90");
        homePSet = 90;//set the homePSet to 90 so that the loop stops
        homePPosition = 90;//set the position for P, This will be used in later functions
      //now that the quill is up and out of the way of everything
      //the Y home function can be ran. 
      }
    }//close while loop
   //XaxisMotor->release();//this will release the x axis motor and stop it from moving
   //YaxisMotor->release();//this will release the Y axis motor and stop it from moving
   lcd.clear();
      
}//close settingsHomePreform()

void settingsHomeCalibration(){
  limitSwitchy.resetCount();
     int ystepCount = 0;
      homeYSet = 0; 
      homeYSet2 = 0; 
      homeYPosition = 0;
      homeXSet = 0;
      homeXPosition = 0;
      homePPosition = 0;
      homePSet = 0;
      //limit switch
 limitSwitchx.loop();
 limitSwitchy.loop();
 limitSwitchp.loop();

 

 //loop for limit switch p-----------------------------------------limit switch p
 //if(limitSwitchp.isPressed())
 //Serial.println("p limit switch: Untouched -> Touched Angle Set to 90");

 //if(limitSwitchp.isReleased())
 //Serial.println("p limit switch: Touched -> Untouched Moving Arm up");
 

 //else Serial.println("p limit switch: Touched");
//loop for limit switch x--------------------------------------limit switch x
  //if(limitSwitchx.isPressed())
 //Serial.println("x limit switch: Untouched -> Touched");

 //if(limitSwitchx.isReleased())
 //Serial.println("x limit switch: Touched -> Untouched");

 //loop for limit switch y--------------------------------------limit switch y
  //if(limitSwitchy.isPressed())
 //Serial.println("y limit switch: Untouched -> Touched 13");

 //if(limitSwitchy.isReleased())
 //Serial.println("y limit switch: Touched -> Untouched");

       
    while(homeYSet == 0){
      limitSwitchy.loop();
      lcd.clear();
      lcd.setCursor(0,1);
       lcd.print("Homing Y");
      YaxisMotor->step(1,BACKWARD,SINGLE);//825move up one step every loop
      ystepCount +=1;
      Serial1.print("yVar.val+=1"); // add one to yVar on the nextion
  Serial1.print("\xFF\xFF\xFF"); // Nextion end command
      if(limitSwitchy.isPressed()){//check to see if limit switch Y has been pressed
 Serial.println("y limit switch: Untouched -> Touched 14");//output that the y limit switch has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Home Y Set");
        homeYSet = homeYSet + 1;//set the homeYSet to 1 so that the loop stops
        //YaxisMotor->release();//this will release the y axis motor and stop it from moving
        YaxisMotor->step(100,FORWARD,MICROSTEP);//825offset 100 steps from the Yswitch, set to home position for Y
        Serial1.print("yVar.val-=100"); // remove 100 from yVar on the nextion
  Serial1.print("\xFF\xFF\xFF"); // Nextion end command
        homeYPosition = 0;//set the position for Y, This will be used in later functions to calculate different things such as stone size and tip of dop location
      Serial.println(limitSwitchy.getState());
        if(limitSwitchy.getCount()!=2){
        if(ystepCount<99){//make sure the test has been ran by checking if the y steps have moved more than 99 steps
        while(homeYSet2 == 0){
          Serial.println(limitSwitchy.getCount());
      limitSwitchy.loop();
      lcd.clear();
      lcd.setCursor(0,1);
       lcd.print("Homing Y");
      YaxisMotor->step(1,BACKWARD,SINGLE);//825move up one step every loop
    
      if(limitSwitchy.isPressed()){//check to see if limit switch Y has been pressed
 Serial.println("y limit switch: Untouched -> Touched 162");//output that the y limit switch has been pressed

        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Home Y Set");
        homeYSet2 = homeYSet2 + 1;//set the homeYSet to 1 so that the loop stops
        //YaxisMotor->release();//this will release the y axis motor and stop it from moving
        YaxisMotor->step(100,FORWARD,MICROSTEP);//825offset 100 steps from the Yswitch, set to home position for Y
        homeYPosition = 0;//set the position for Y, This will be used in later functions to calculate different things such as stone size and tip of dop location
      }//close second check
        }//close if check for y up movement
        }//close count check
      //now that the quill is up and out of the way of everything
      //the x home function can be ran. 
 while(homeXSet == 0){
       limitSwitchx.loop();
       lcd.clear();
       lcd.setCursor(0,1);
       lcd.print("Homing X");
    XaxisMotor->step(1,BACKWARD,SINGLE);// move back one step every loop
    Serial1.print("xVar.val+=1"); // add one to xVar on the nextion
  Serial1.print("\xFF\xFF\xFF"); // Nextion end command
      if(limitSwitchx.isPressed()){//check if limit switch X has been pressed
 Serial.println("x limit switch: Untouched -> Touched");//output that the x limit switch has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Home X Set");
      homeXSet = homeXSet + 1;//set the homeXSet to 1 so that the loop stops
      XaxisMotor->release();//this will release the x axis motor and stop it from moving
      XaxisMotor->step(50,FORWARD,SINGLE);//offset 50 steps from the Xswitch, set to home position for X
      Serial1.print("yVar.val-=50"); // remove 50 from xVar on the nextion
  Serial1.print("\xFF\xFF\xFF"); // Nextion end command
      homeXPosition = 0;//set the position for X, This will be used in later functions to calculate different things such as stone size and tip of dop location
      }//close if statement
  }//close while loop
      }
    }//close if statement for Y limit Switch Pressed
  }//close while loop for Y limit Switch
  lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Setting Home");
       PaxisMotor->step(10,FORWARD,MICROSTEP);//make sure the angle is less than 90 (changed from forward to backward 5/25/2024) 9/16 aus mini
    while(homePSet != 90){//loop until the Protractor angle is set to 90
      limitSwitchp.loop();
      lcd.setCursor(0,1);
       lcd.print("Homing P Angle");
       PaxisMotor->step(1,BACKWARD,MICROSTEP);//move up one step every loop (changed from Backward to forward 5/25/2024) 9/16 aus mini
      if(limitSwitchp.isPressed()){//check to see if limit switch P has been pressed
 Serial.println("p limit switch: Untouched -> Touched");//output that the p limit switch has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Home P Angle Set to 90");
        homePSet = 90;//set the homeYSet to 90 so that the loop stops
        homePPosition = 90;//set the position for P, This will be used in later functions

      //now that the quill is up and out of the way of everything
      //the Y home function can be ran. 
      }
    }//close while loop
   XaxisMotor->release();//this will release the x axis motor and stop it from moving
   //YaxisMotor->release();//this will release the Y axis motor and stop it from moving
   lcd.clear();
      
}//close settingsHomeCalibration()

void settingsHome(){
  limitSwitchy.resetCount();
     int ystepCount = 0;
      homeYSet = 0; 
      homeYSet2 = 0; 
      homeYPosition = 0;
      homeXSet = 0;
      homeXPosition = 0;
      homePPosition = 0;
      homePSet = 0;
      //limit switch
 limitSwitchx.loop();
 limitSwitchy.loop();
 limitSwitchp.loop();

 

 //loop for limit switch p-----------------------------------------limit switch p
 //if(limitSwitchp.isPressed())
 //Serial.println("p limit switch: Untouched -> Touched Angle Set to 90");

 //if(limitSwitchp.isReleased())
 //Serial.println("p limit switch: Touched -> Untouched Moving Arm up");
 

 //else Serial.println("p limit switch: Touched");
//loop for limit switch x--------------------------------------limit switch x
  //if(limitSwitchx.isPressed())
 //Serial.println("x limit switch: Untouched -> Touched");

 //if(limitSwitchx.isReleased())
 //Serial.println("x limit switch: Touched -> Untouched");

 //loop for limit switch y--------------------------------------limit switch y
  //if(limitSwitchy.isPressed())
 //Serial.println("y limit switch: Untouched -> Touched 15");

 //if(limitSwitchy.isReleased())
 //Serial.println("y limit switch: Touched -> Untouched");

       
    while(homeYSet == 0){
      limitSwitchy.loop();
      lcd.clear();
      lcd.setCursor(0,1);
       lcd.print("Homing Y");
      YaxisMotor->step(1,BACKWARD,SINGLE);//825move up one step every loop
      ystepCount +=1;
      if(limitSwitchy.isPressed()){//check to see if limit switch Y has been pressed
 Serial.println("y limit switch: Untouched -> Touched 16");//output that the y limit switch has been pressed
 Serial.println(limitSwitchy.getCount());
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Home Y Set");
        homeYSet = homeYSet + 1;//set the homeYSet to 1 so that the loop stops
        //YaxisMotor->release();//this will release the y axis motor and stop it from moving
        YaxisMotor->step(100,FORWARD,MICROSTEP);//825offset 100 steps from the Yswitch, set to home position for Y
        homeYPosition = 0;//set the position for Y, This will be used in later functions to calculate different things such as stone size and tip of dop location
       Serial.println(limitSwitchy.getState());
        if(limitSwitchy.getCount()!=2){
        if(ystepCount<99){//make sure the test has been ran by checking if the y steps have moved more than 99 steps
        while(homeYSet2 == 0){
          Serial.println(limitSwitchy.getCount());
      limitSwitchy.loop();
      lcd.clear();
      lcd.setCursor(0,1);
       lcd.print("Homing Y");
      YaxisMotor->step(1,BACKWARD,SINGLE);//825move up one step every loop
    
      if(limitSwitchy.isPressed()){//check to see if limit switch Y has been pressed
 Serial.println("y limit switch: Untouched -> Touched 162");//output that the y limit switch has been pressed

        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Home Y Set");
        homeYSet2 = homeYSet2 + 1;//set the homeYSet to 1 so that the loop stops
        //YaxisMotor->release();//this will release the y axis motor and stop it from moving
        YaxisMotor->step(100,FORWARD,MICROSTEP);//825offset 100 steps from the Yswitch, set to home position for Y
        homeYPosition = 0;//set the position for Y, This will be used in later functions to calculate different things such as stone size and tip of dop location
      }//close second check
        }//close if check for y up movement
        }//close count check
      //now that the quill is up and out of the way of everything
      //the x home function can be ran. 
 while(homeXSet == 0){
       limitSwitchx.loop();
       lcd.clear();
       lcd.setCursor(0,1);
       lcd.print("Homing X");
    XaxisMotor->step(1,BACKWARD,SINGLE);// move back one step every loop
    //delay(10);
      if(limitSwitchx.isPressed()){//check if limit switch X has been pressed
 Serial.println("x limit switch: Untouched -> Touched");//output that the x limit switch has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Home X Set");
      homeXSet = homeXSet + 1;//set the homeXSet to 1 so that the loop stops
      XaxisMotor->release();//this will release the x axis motor and stop it from moving
      XaxisMotor->step(50,FORWARD,SINGLE);//offset 50 steps from the Xswitch, set to home position for X
      homeXPosition = 0;//set the position for X, This will be used in later functions to calculate different things such as stone size and tip of dop location
      }//close if statement
  }//close while loop
        }
    }//close if statement for Y limit Switch Pressed
  }//close while loop for Y limit Switch
  
  //====== P AXIS HOMING WITH SAFETY GATE ======
  // SAFETY: Check if P is already at home position (90°) from switch
  // If so, move Y axis away from wheel first before proceeding
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("P Axis Check");
  limitSwitchp.loop();
  
  if(limitSwitchp.getState() == 1) {
    // P switch is already pressed (at 90°) - stone may still be at wheel!
    Serial.println("INFO: P axis already at home position (90°)");
    Serial.println("INFO: Moving Y axis clear of wheel first for safety");
    
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Y Clear of Wheel");
    lcd.setCursor(0,1);
    lcd.print("Moving away...");
    
    // Move Y up 50 steps to clear grinding wheel
    for(int clearStep = 0; clearStep < 50; clearStep++) {
      YaxisMotor->step(1, BACKWARD, MICROSTEP);  // Move Y up
      delay(5);
    }
    
    Serial.println("INFO: Y axis cleared, safe to reference P home");
    delay(500);
  }
  
  // Now proceed with normal P axis homing
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Setting Home");
  PaxisMotor->step(10,FORWARD,MICROSTEP);//make sure the angle is less than 90 (changed from forward to backward 8/25/2024) 9/16 aus mini
  
  while(homePSet != 90){//loop until the Protractor angle is set to 90
    limitSwitchp.loop();
    lcd.setCursor(0,1);
    lcd.print("Homing P Angle");
    PaxisMotor->step(1,BACKWARD,MICROSTEP);//move up one step every loop (changed from backward to forward 8/25/2024) 9/16 aus mini
    
    if(limitSwitchp.isPressed()){//check to see if limit switch P has been pressed
      Serial.println("p limit switch: Untouched -> Touched");//output that the p limit switch has been pressed
      lcd.clear();
      lcd.setCursor(0,1);
      lcd.print("Home P Angle Set to 90");
      homePSet = 90;//set the homeYSet to 90 so that the loop stops
      homePPosition = 90;//set the position for P, This will be used in later functions
      //now that the quill is up and out of the way of everything
      //the Y home function can be ran. 
      }
    }//close while loop
   XaxisMotor->release();//this will release the x axis motor and stop it from moving
   //YaxisMotor->release();//this will release the Y axis motor and stop it from moving
   lcd.clear();
       manualControl();
}//close home()

//====== UPDATE MOTOR SPEEDS FUNCTION ======
void updateMotorSpeeds() {
  if(fastMode == 1) {
    YaxisMotor->setSpeed(Y_FAST_SPD);
    XaxisMotor->setSpeed(X_FAST_SPD);
    PaxisMotor->setSpeed(P_FAST_SPD);
    Serial.println("INFO: Motors set to FAST mode");
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("FAST MODE");
    delay(800);
  } else {
    YaxisMotor->setSpeed(Y_PREC_SPD);
    XaxisMotor->setSpeed(X_PREC_SPD);
    PaxisMotor->setSpeed(P_PREC_SPD);
    Serial.println("INFO: Motors set to PRECISION mode");
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("PRECISION MODE");
    delay(800);
  }
}

//====== JOYSTICK CONTROL HANDLER ======
void handleJoystickMovement() {
  // Process joystick input and move axes smoothly
  // Joystick values: 0-127 = left/backward, 128 = center, 129-255 = right/forward
  
  // X-axis control (left/right)
  if(joystickX < 120) {
    // Left movement (X backward)
    byte steps = map(120 - joystickX, 0, 120, 1, 10);
    XaxisMotor->step(steps, FORWARD, SINGLE);
  } 
  else if(joystickX > 136) {
    // Right movement (X forward)
    byte steps = map(joystickX - 136, 0, 120, 1, 10);
    XaxisMotor->step(steps, BACKWARD, SINGLE);
  }
  
  // Y-axis control (up/down)
  if(joystickY < 120) {
    // Down movement (Y forward)
    byte steps = map(120 - joystickY, 0, 120, 1, 10);
    YaxisMotor->step(steps, FORWARD, MICROSTEP);
  }
  else if(joystickY > 136) {
    // Up movement (Y backward)
    byte steps = map(joystickY - 136, 0, 120, 1, 10);
    YaxisMotor->step(steps, BACKWARD, MICROSTEP);
  }
  
  // P-axis control (rotate)
  if(joystickP < 120) {
    // Counter-clockwise (P backward)
    byte steps = map(120 - joystickP, 0, 120, 1, 5);
    PaxisMotor->step(steps, BACKWARD, MICROSTEP);
  }
  else if(joystickP > 136) {
    // Clockwise (P forward)
    byte steps = map(joystickP - 136, 0, 120, 1, 5);
    PaxisMotor->step(steps, FORWARD, MICROSTEP);
  }
}

void manualControl(){//---------------------------------------------------------------------------------------------manual controls
Serial1.print("page 12"); // command to load page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command

  YaxisSteps = 0;
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("   Manual Control  ");


}//close manualControl()

void pAxisHome(){//------------------------------------------------------------------------p axis home set to 90
   homePPosition = 0;
   homePSet = 0;
  limitSwitchp.loop();

 //loop for limit switch p-----------------------------------------limit switch p
 if(limitSwitchp.isPressed()){
 Serial.println("p limit switch: Untouched -> Touched Angle Set to 90");
 homePSet = 90;
 homePPosition = 90;
 }
 if(limitSwitchp.isReleased())
 Serial.println("p limit switch: Touched -> Untouched Moving Arm up");

if(limitSwitchp.isPressed()){
   homePSet = 90;
 homePPosition = 90;
}
PaxisMotor->step(10,FORWARD,MICROSTEP);//make sure the angle is less than 90 (changed from forward to backward AUG252024) 9/16 aus mini
while(homePSet != 90){//loop until the Protractor angle is set to 90
      limitSwitchp.loop();
      lcd.setCursor(0,1);
       lcd.print("Homing P Angle");
       PaxisMotor->step(1,BACKWARD,MICROSTEP);//move up one step every loop (changith the rotational spin from one way to the other in august )
      if(limitSwitchp.isPressed()){//check to see if limit switch P has been pressed
        lcd.clear();
        lcd.setCursor(3,0);
        lcd.print("Angle Set to 90");
        homePSet = 90;//set the homeYSet to 90 so that the loop stops
        homePPosition = 90;//set the position for P, This will be used in later functions
        delay(1000);
        manualControl();
      //now that the quill is up and out of the way of everything
      //the Y home function can be ran. 
      }
    }//close while loop
}//close pAxisHome()

void pAxisHomePreform(){//------------------------------------------------------------------------p axis home set to 90
   run = 0;
   homePPosition = 0;
   homePSet = 0;
  limitSwitchp.loop();

 //loop for limit switch p-----------------------------------------limit switch p
 if(limitSwitchp.isPressed()){
 Serial.println("p limit switch: Untouched -> Touched Angle Set to 90");
 homePSet = 90;
 homePPosition = 90;
 }
 if(limitSwitchp.isReleased())
 Serial.println("p limit switch: Touched -> Untouched Moving Arm up");

if(limitSwitchp.isPressed()){
   homePSet = 90;
 homePPosition = 90;
}
PaxisMotor->step(10,BACKWARD,MICROSTEP);//make sure the angle is less than 90 (changed rotation aug)
while(homePSet != 90){//loop until the Protractor angle is set to 90
      limitSwitchp.loop();
      lcd.setCursor(0,1);
       lcd.print("Homing P Angle");
       PaxisMotor->step(1,BACKWARD,MICROSTEP);//move up one step every loop (changed rotation aug) 9/16 aus mini
      if(limitSwitchp.isPressed()){//check to see if limit switch P has been pressed
        lcd.clear();
        lcd.setCursor(3,0);
        lcd.print("Angle Set to 90");
        homePSet = 90;//set the homeYSet to 90 so that the loop stops
        homePPosition = 90;//set the position for P, This will be used in later functions
        delay(1000);
        preformGRound();
      //now that the quill is up and out of the way of everything
      //the Y home function can be ran. 
      }
    }//close while loop
}//close pAxisHomePreform()

void closeTo(){
         while(xVar>xVarTo){
    if(xVar>xVarTo){
      xVar-=1;
      countX-=1;
      //moves left until xVar is at 1000
      XaxisMotor->step(1,FORWARD,SINGLE);//moves the X axis left
      }//close if
      }//close while
      while(xVar<xVarTo){
        if(xVar<xVarTo){
          xVar+=1;
          countX+=1;
          //moves right until xVar is at 2100
          XaxisMotor->step(1,BACKWARD,SINGLE);//moves the X axis right
          }//close if
        }
        while(yVar>yVarTo){
          if(yVar>yVarTo){
            yVar-=1;
            countY-=1;
            //moves down until yVar is at 1000
            YaxisMotor->step(1,FORWARD,MICROSTEP);//825moves the Y axis down 1 step
            }//close if
          }
          while(yVar<yVarTo){
            if(yVar<yVarTo){
              yVar+=1;
              countY+=1;
              //moves up until yVar is at 1000
              YaxisMotor->step(1,FORWARD,MICROSTEP);//moves the Y axis up 1 step
              }//close if
            }//close while loop
}//close closeTo()


// ========================================================================
// STATE PERSISTENCE FUNCTIONS - Save/Load for power failure recovery
// [2025-12-06 14:44] Added EEPROM persistence for machine state
// [2025-12-06 14:47] Added quiet mode for auto-save to reduce serial spam
// [2025-12-06 14:50] Expanded to save design, shape, stage, and index position
// ========================================================================
void saveMotorState(bool quiet = false) {
  // [2025-12-06 14:52] Use complete state saving with tracking
  saveCompleteState();
  if (!quiet) {
    Serial.println("Complete machine state saved to EEPROM");
  }
}

void loadMotorState() {
  // [2025-12-06 14:52] Use complete state loading with tracking
  loadCompleteState();
}

void clearSavedState() {
  // Clear EEPROM for fresh start
  EEPROM.write(EEPROM_ADDR_CHECKSUM, 0);
  Serial.println("Saved state cleared");
}

// [2025-12-06 14:52] State tracking functions
void updateMachineState() {
  // Detect current state based on menu selections and serial output
  // This function should be called when menu items are selected
  
  // Example: Detect shape from menu selection
  if (Start == MenuPreformRound || Start == MenuPreformGRoundSettings || Start == MenuPreformGRound) {
    currentShape = SHAPE_ROUND;
    currentCutStage = STAGE_PREFORM;
    Serial.println("[STATE] Detected: Round shape in Preform stage");
  }
  
  // Auto-save state when significant changes occur
  saveCompleteState(); // Save complete state
}

void saveCompleteState() {
  // [2025-12-06 14:52] Save complete machine state including tracked variables
  EEPROM.put(EEPROM_ADDR_X_POS, countX);
  EEPROM.put(EEPROM_ADDR_Y_POS, countY);
  EEPROM.put(EEPROM_ADDR_P_POS, homePPosition);
  EEPROM.put(EEPROM_ADDR_INDEX_POS, currentIndexPos);
  EEPROM.write(EEPROM_ADDR_DESIGN, currentDesign);
  EEPROM.write(EEPROM_ADDR_SHAPE, currentShape);
  EEPROM.write(EEPROM_ADDR_CUT_STAGE, currentCutStage);
  EEPROM.write(EEPROM_ADDR_CHECKSUM, EEPROM_VALID_FLAG);
  
  Serial.println("[STATE] Complete machine state saved:");
  Serial.print("  Shape: ");
  Serial.println(currentShape);
  Serial.print("  Design: ");
  Serial.println(currentDesign);
  Serial.print("  Stage: ");
  Serial.println(currentCutStage);
  Serial.print("  Index: ");
  Serial.println(currentIndexPos);
}

void loadCompleteState() {
  // [2025-12-06 14:52] Load complete machine state
  if (EEPROM.read(EEPROM_ADDR_CHECKSUM) == EEPROM_VALID_FLAG) {
    EEPROM.get(EEPROM_ADDR_X_POS, countX);
    EEPROM.get(EEPROM_ADDR_Y_POS, countY);
    EEPROM.get(EEPROM_ADDR_P_POS, homePPosition);
    EEPROM.get(EEPROM_ADDR_INDEX_POS, currentIndexPos);
    currentDesign = EEPROM.read(EEPROM_ADDR_DESIGN);
    currentShape = EEPROM.read(EEPROM_ADDR_SHAPE);
    currentCutStage = EEPROM.read(EEPROM_ADDR_CUT_STAGE);
    
    Serial.println("\n========================================");
    Serial.println("COMPLETE STATE RECOVERY");
    Serial.println("========================================");
    Serial.print("X Position: ");
    Serial.println(countX);
    Serial.print("Y Position: ");
    Serial.println(countY);
    Serial.print("P Position: ");
    Serial.println(homePPosition);
    Serial.print("Index Position: ");
    Serial.println(currentIndexPos);
    Serial.print("Shape: ");
    Serial.print(currentShape);
    Serial.print(" (");
    switch(currentShape) {
      case SHAPE_ROUND: Serial.print("Round"); break;
      case SHAPE_CUSHION: Serial.print("Cushion"); break;
      case SHAPE_EMERALD: Serial.print("Emerald"); break;
      default: Serial.print("Unknown"); break;
    }
    Serial.println(")");
    Serial.print("Design: ");
    Serial.println(currentDesign);
    Serial.print("Cut Stage: ");
    Serial.print(currentCutStage);
    Serial.print(" (");
    switch(currentCutStage) {
      case STAGE_MENU: Serial.print("Menu"); break;
      case STAGE_PREFORM: Serial.print("Preform"); break;
      case STAGE_CUT: Serial.print("Cut"); break;
      case STAGE_POLISH: Serial.print("Polish"); break;
      default: Serial.print("Unknown"); break;
    }
    Serial.println(")");
    Serial.println("========================================\n");
  } else {
    Serial.println("No saved state found - starting fresh");
  }
}

// ========================================================================
// DIAGNOSTIC FUNCTION - Comprehensive motor and power diagnostics
// ========================================================================
void testMotorConnections() {
  Serial.println("\n========================================");
  Serial.println("GEMBOT DIAGNOSTIC TEST");
  Serial.println("========================================");
  
  // Test power supply voltages
  Serial.println("\n--- POWER SUPPLY CHECK ---");
  int v12_raw = analogRead(A0);  // Assuming 12V on A0 (with voltage divider)
  float v12 = (v12_raw / 1023.0) * 5.0 * 2.4;  // Approximate conversion (adjust divider ratio)
  Serial.print("12V Supply: ");
  Serial.print(v12);
  Serial.println("V");
  
  if (v12 < 10.0) {
    Serial.println("WARNING: Low 12V supply voltage!");
  } else if (v12 > 14.0) {
    Serial.println("WARNING: High 12V supply voltage!");
  } else {
    Serial.println("OK: 12V supply within range");
  }
  
  // Test Motor Shield 1 (AMFS1) - X and Y axes
  Serial.println("\n--- MOTOR SHIELD 1 (AMFS1) ---");
  Serial.println("Testing X Axis Motor (AMFS1)...");
  for (int i = 0; i < 5; i++) {
    XaxisMotor->step(1, FORWARD, MICROSTEP);
    delay(50);
  }
  Serial.println("X Forward: 5 steps sent");
  
  for (int i = 0; i < 5; i++) {
    XaxisMotor->step(1, BACKWARD, MICROSTEP);
    delay(50);
  }
  Serial.println("X Backward: 5 steps sent");
  Serial.println("X Axis: Check if motor moved smoothly");
  
  delay(500);
  
  Serial.println("\nTesting Y Axis Motor (AMFS1)...");
  for (int i = 0; i < 5; i++) {
    YaxisMotor->step(1, FORWARD, MICROSTEP);
    delay(50);
  }
  Serial.println("Y Forward: 5 steps sent");
  
  for (int i = 0; i < 5; i++) {
    YaxisMotor->step(1, BACKWARD, MICROSTEP);
    delay(50);
  }
  Serial.println("Y Backward: 5 steps sent");
  Serial.println("Y Axis: Check if motor moved smoothly");
  
  // Test Motor Shield 2 (AMFS2) - P axis
  Serial.println("\n--- MOTOR SHIELD 2 (AMFS2) ---");
  Serial.println("Testing P Axis Motor (AMFS2)...");
  for (int i = 0; i < 5; i++) {
    PaxisMotor->step(1, FORWARD, MICROSTEP);
    delay(50);
  }
  Serial.println("P Forward: 5 steps sent");
  
  for (int i = 0; i < 5; i++) {
    PaxisMotor->step(1, BACKWARD, MICROSTEP);
    delay(50);
  }
  Serial.println("P Backward: 5 steps sent");
  Serial.println("P Axis: Check if motor moved smoothly");
  
  // Limit switch check
  Serial.println("\n--- LIMIT SWITCHES ---");
  Serial.print("X Limit: ");
  Serial.println(digitalRead(LimitX) ? "OPEN" : "PRESSED");
  Serial.print("Y Limit: ");
  Serial.println(digitalRead(LimitY) ? "OPEN" : "PRESSED");
  Serial.print("P Limit: ");
  Serial.println(digitalRead(LimitP) ? "OPEN" : "PRESSED");
  
  Serial.println("\n========================================");
  Serial.println("DIAGNOSTIC COMPLETE");
  Serial.println("========================================\n");
}

// ========================================================================-----
// Update Log Notes
//------------------------------------------------------------------------------
//   3/8/2023 update - calibration function added for dop and rough 
//   3/10/2023 update - re organize the menu to make it flow better for the user
//   3/14/2023 update - update the menu to include what can be cut with the implemented 96 tooth index gear
//   3/15/2023 update - removing commented code that is not being used to see if it decreases memory size
//                    - this does not decrease memory size but it does make the code look cleaner
//                    - to decrease memory size the variables names need to be shortened such as (designName = "Standard Round Brilliant" to designName = "SRB")
//    4/18/2024 update- final working version  for Tester Machines with motor wire swap around to 12v
// proximity sensors instead of limit switches?
//   5/12/2023 update - editing the menu to include all shapes and designs
//End of Gem Bot Menu By. Ryan Barbrick & Austin Moore
// ========================================================================