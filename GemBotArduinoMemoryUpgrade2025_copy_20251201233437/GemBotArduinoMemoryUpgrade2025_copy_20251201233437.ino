#include <Nextion.h>
#include <SPI.h>
#include <SdFat.h>
#include <Wire.h>
#include <hd44780.h>
#include <hd44780ioClass/hd44780_I2Cexp.h>
#include <Adafruit_Keypad.h>
#include <Adafruit_Keypad_Ringbuffer.h>
#include "CMBMenu.hpp"
#include <ezButton.h>
#include <Stepper.h>
#include <Adafruit_MotorShield.h>
#include <Keypad.h>
#include <stdint.h>
#include <ArduinoJson.h>
#include <avr/wdt.h>

// WiFi/FTP support is optional and disabled for Arduino Mega
// Uncomment below and provide arduino_secrets.h for ESP32 with WiFi support
// #include "arduino_secrets.h"
// #include <WiFi.h>
// #include <ESP32FtpClient.h>
// ESP32FtpClient ftp(FTP_HOST, FTP_USER, FTP_PASS, 5000, 2);

//Nextion nextion(18, 19);
char incomingByte; // for incoming serial data

#define CUT_LOG_FILENAME "cutlog.csv"

// ========================================================
// GLOBAL STATE STRUCTURE AND VARIABLES
// ========================================================

// State structure for tracking machine status (optional enhancement)
struct GemBotState {
  int progress;           // Current progress percentage
  bool processComplete;   // Whether process is complete
  // Add more fields as needed for your state tracking
};

// Global state instance
GemBotState gState = {0, false};

// WiFi fallback flag
bool wifiFallback = false;

// Device token (from arduino_secrets.h)
// Fallback definition if not in secrets
#ifndef DEVICE_TOKEN
  #define DEVICE_TOKEN "GemBot_001"
#endif

/*
This is the main program for running Merlins Gem Bot Automated Faceting Machine
Designed/Created by Austin Moore and Ryan Barbrick
This program is designed to be used with an array of wheels at certain speeds
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


//Buzzer is set to 5

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

Stepper indexMotor(STEPS, D0, D1, D2, D3); //create a stepping sequence for the index motor.
// Connect a stepper motor with 200 steps per revolution (1.8 degree)
// to motor port #1 (M1 and M2)
// to motor port #2 (M3 and M4)
//Adafruit_StepperMotor *indexMotor = AFMS.getStepper(96, 1);
Adafruit_StepperMotor *YaxisMotor = AFMS.getStepper(200, 2);//y motlsaor mid board 5v (AFMS mid motor shield) (200==steps,2==location of wires)
Adafruit_StepperMotor *PaxisMotor = AFMS2.getStepper(200, 1);//angle motor on top board 12 v (AFMS2 top motor shield) (200==steps,1==location of wires)
Adafruit_StepperMotor *XaxisMotor = AFMS2.getStepper(200, 2);//x motor on top board 12 v (AFMS2 top motor shield) (200==steps,2==location of wires)
int dt=500;
int IndexSteps;
int YaxisSteps = 0;
int XaxisSteps = 0;
int indexNumber = 1;
int PaxisSteps = 0; 
int forwardSingleStep = 8;
int backwardSingleStep = -8;
int run = 0;

int Start=0;
//int buzzer = 5;

 double roundWidth = 25.5;// in mm
 double roundDesiredWidth = 15.9;// in mm
 double rotations = 1; // this will remove 1 mm of material for every 40 steps with 150 grit lap
 int rotationCount;
 double totalSteps = rotations * 96; 

//home variables
  int homeYSet = 0; 
  int homeYSet2 = 0;
  int homeYPosition = 0;
  int homeXSet = 0;
  int homeXPosition = 0;
  int homePSet = 0;
  int homePPosition = 0;

//chuck with no dop calibration variables... used to calculate the length of dop stick
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

int endStoneWidth = 5.5;
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
                                    // {1,51,68},
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
  limitSwitchx.setDebounceTime(200);//50 milliseconds originally switched to 200 for a longer press time to make sure no false clicks/bounces
  limitSwitchy.setDebounceTime(200);//50 milliseconds
  limitSwitchp.setDebounceTime(200);//50 milliseconds
  limitSwitchCaly.setDebounceTime(200);//50 milliseconds
  limitSwitchCalx.setDebounceTime(200);//50 milliseconds
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
  // if (!AFMS.begin(1000)) {  // OR with a different frequency, say 1KHz
    Serial.println("Could not find Motor Shield. Check wiring amfs1.");
    //while (1);
  }//close if statement for AFMS
  Serial.println("Motor Shield found. amfs1");
  if (!AFMS2.begin()) {         // create with the default frequency 1.6KHz
   //if (!AFMS2.begin(1000)) {  // OR with a different frequency, say 1KHz
    Serial.println("Could not find Motor Shield. Check wiring amfs2.");
    //while (1);
  //Serial.println("Motor Shield found. amfs2");
  }//close if statement for AFMS2
 Serial.println("Motor Shield found. amfs2");  
  //indexMotor->setSpeed(100);  // 100 rpm
  YaxisMotor->setSpeed(100);  // 100 rpm
  XaxisMotor->setSpeed(1000);  // 1000 rpm
  PaxisMotor->setSpeed(300);  // 100 rpm 

  // WiFi support disabled for Arduino Mega (requires ESP32)
  // Uncomment below if using ESP32 with WiFi capability
  // WiFi.begin(SECRET_SSID, SECRET_PASS);
  // unsigned long start = millis();
  // while (WiFi.status() != WL_CONNECTED && millis() - start < 15000) {
  //     delay(500);
  // }
  // if (WiFi.status() == WL_CONNECTED) {
  //     uploadDeviceToken();
  // }
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
else if (Serial1.available() > 0) { // if some data was received from the Nextion Display
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
    Serial1.print("page 16"); // command to load page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command

   }else if(info_s == "<      Cut Gem     >"){
    Serial1.print("page 17"); // command to load page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command

   }else if(info_s == "<    Polish Gem     "){
    Serial1.print("page 18"); // command to load page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command

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

   }else if(info_s == "<      Cut Gem     >"){
    Serial1.print("page 17"); // command to load page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command

   }else if(info_s == "<    Polish Gem     "){
    Serial1.print("page 18"); // command to load page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command

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
    showHelpForMenu();
    showHelpForState(); // Ensure help is shown for every state
}//close printMenuEntry

// ********************************************
// getKey touch screen input
// ********************************************
KeyType getKey(){
    KeyType key = KeyNone;
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
      case '*':
          lcd.clear();
          g_Menu.printMenu();
          //updateStateVars(); saveStateToSD();
          break;
      case '#':
        //if (loadStateFromSD()) {
          //applyStateVars();
          //lcd.clear();
          //lcd.setCursor(0,0);
          //lcd.print("State Loaded");
        //} else {
          //lcd.clear();
          //lcd.setCursor(0,0);
          //lcd.print("Load Failed");
        //}
        break;
        case 'a':
          Serial.println(Key_s);
          settingsHomeCalibration();
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
          updateStateVars(); saveStateToSD();
          break;
        case 'e':
        countY += 1;
        Serial.println(countY);
          Serial.println(Key_s);
          YaxisMotor->step(1,FORWARD,MICROSTEP);//moves the Y axis up 1 step
          Serial1.print("delay=10"); // command to set delay while key pressed
          Serial1.print("\xFF\xFF\xFF"); // Nextion end command
          Serial1.print("vis up,1"); // command to set button to visible after movement is made
          Serial1.print("\xFF\xFF\xFF"); // Nextion end command
          updateStateVars(); saveStateToSD();
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
          updateStateVars(); saveStateToSD();
          break;
        case 'i':
        countY -= 1;
        Serial.println(countY);
          Serial.println(Key_s);
          YaxisMotor->step(1,BACKWARD,MICROSTEP);//moves the Y axis down 1 step
          Serial1.print("delay=10"); // command to set delay while key pressed
          Serial1.print("\xFF\xFF\xFF"); // Nextion end command
          Serial1.print("vis down,1"); // command to set button to visible after movement is made
          Serial1.print("\xFF\xFF\xFF"); // Nextion end command
          updateStateVars(); saveStateToSD();
          break;

      }
      return key;
    }
}

// Helper: Send command to Nextion and wait for response
String sendNextionCommandAndGetResponse(const String& cmd, unsigned long timeout = 500) {
  Serial1.print(cmd);
  Serial1.print("\xFF\xFF\xFF");
  unsigned long start = millis();
  String response = "";
  while (millis() - start < timeout) {
    while (Serial1.available()) {
      char c = Serial1.read();
      response += c;
      if (response.endsWith("\xFF\xFF\xFF")) {
        response.remove(response.length() - 3);
        return response;
      }
    }
  }
  return response;
}

// Global: Track last known editable fields
String lastEditableFields = "";

// Helper: Query Nextion for editable fields and handle response
void checkAndDisplayEditableFields() {
    String response = sendNextionCommandAndGetResponse("getEditableFields()");
    if (response.length() > 0 && response != lastEditableFields) {
        lastEditableFields = response;
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Editable:");
        lcd.setCursor(0,1);
        lcd.print(response);
    }
}

// Helper: Constantly check for state changes and update SD card
void monitorStateChanges() {
    static GemBotState prevState;
    if (memcmp(&gState, &prevState, sizeof(GemBotState)) != 0) {
        updateStateVars();
        saveStateToSD();
        prevState = gState;
        if (!wifiFallback && !uploadStateToFTP()) {
            fallbackToLocal();
        }
    }
}

unsigned long lastLiveSync = 0;

// Helper: Convert state to JSON
String stateToJson() {
    StaticJsonDocument<1024> doc;
    doc["device_token"] = DEVICE_TOKEN;
    doc["progress"] = gState.progress;
    doc["processComplete"] = gState.processComplete;
    // Add more fields as needed for remote monitoring
    doc["roundWidth"] = roundWidth;
    doc["roundDesiredWidth"] = roundDesiredWidth;
    doc["rotations"] = rotations;
    doc["rotationCount"] = rotationCount;
    doc["totalSteps"] = totalSteps;
    doc["countX"] = countX;
    doc["countY"] = countY;
    doc["homeYPosition"] = homeYPosition;
    doc["homeXPosition"] = homeXPosition;
    doc["homePPosition"] = homePPosition;
    doc["dopLength"] = dopLength;
    doc["dopWidth"] = dopWidth;
    doc["roughStoneWidth"] = roughStoneWidth;
    doc["roughStoneHeight"] = roughStoneHeight;
    doc["roughStoneDiameter"] = roughStoneDiameter;
    doc["roughStoneCir"] = roughStoneCir;
    doc["endStoneWidth"] = endStoneWidth;
    doc["endStoneHeight"] = endStoneHeight;
    doc["endStoneDiameter"] = endStoneDiameter;
    doc["endStoneCir"] = endStoneCir;
    doc["cycleCount"] = cycleCount;
    doc["timestamp"] = millis();
    // Add more as needed for your application
    String json;
    serializeJson(doc, json);
    return json;
}

// Upload state to FTP server (disabled for Arduino Mega - requires ESP32)
bool uploadStateToFTP() {
    // WiFi/FTP not available on Arduino Mega
    // This function is a stub and always returns false
    showUserFeedback("WiFi not available", "Use ESP32 for WiFi support");
    return false;
    
    // Code below is for reference when using ESP32:
    // if (WiFi.status() != WL_CONNECTED) {
    //     showUserFeedback("WiFi not connected", "WiFi not connected");
    //     return false;
    // }
    // ftp.OpenConnection();
    // ftp.InitFile("Type I");
    // String filename = String("/GemBot/") + DEVICE_TOKEN + "_state.json";
    // ftp.NewFile(filename.c_str());
    // String json = stateToJson();
    // ftp.Write(json.c_str());
    // ftp.CloseFile();
    // ftp.CloseConnection();
    // showUserFeedback("State synced", "State synced");
    // return true;
}

// Fallback to local/touchscreen mode
void fallbackToLocal() {
    wifiFallback = true;
    showUserFeedback("WiFi/FTP Lost!", "WiFi/FTP Lost!");
    lcd.setCursor(0, 1);
    lcd.print("Local Control Only");
    delay(2000);
}

// --- Real-time JSON state output for web visualizer ---
String currentShape = "";
String currentDesign = "";
int currentFacet = 0;
double currentAngle = 0.0;
int currentIndex = 0;
String currentStage = "";
String currentTip = "";

void outputJsonState() {
  StaticJsonDocument<512> doc;
  doc["shape"] = currentShape;
  doc["design"] = currentDesign;
  doc["facet"] = currentFacet;
  doc["angle"] = currentAngle;
  doc["index"] = currentIndex;
  doc["stage"] = currentStage;
  JsonObject calib = doc.createNestedObject("calib");
  calib["x"] = homeXOffsetStepsRough;
  calib["y"] = homeYOffsetStepsRough;
  doc["tip"] = currentTip;
  String json;
  serializeJson(doc, json);
  Serial.println(json);
}

// Call this function whenever the state changes
void setStateAndOutput(const String& shape, const String& design, int facet, double angle, int index, const String& stage, const String& tip) {
  currentShape = shape;
  currentDesign = design;
  currentFacet = facet;
  currentAngle = angle;
  currentIndex = index;
  currentStage = stage;
  currentTip = tip;
  outputJsonState();
}

// Example: update state after calibration
void roughCalibration() {
  // ...existing code...
  setStateAndOutput(currentShape, currentDesign, currentFacet, currentAngle, currentIndex, "Calibration", "Calibration complete. Ready to cut.");
  // ...existing code...
}
// Example: update state after cut stage change
void onCutStageChange(const String& stage) {
  String tip = "";
  if (stage == "Girdle") tip = "Tip: Check girdle symmetry before moving to pavilion.";
  else if (stage == "Pavilion") tip = "Tip: Cut pavilion facets to meet at the center.";
  else if (stage == "Crown") tip = "Tip: Crown facets should align with pavilion points.";
  else if (stage == "Table") tip = "Tip: Table should be flat and centered.";
  else if (stage == "Polish") tip = "Tip: Inspect for scratches and polish all facets.";
  setStateAndOutput(currentShape, currentDesign, currentFacet, currentAngle, currentIndex, stage, tip);
}
// Example: call onCutStageChange when stage changes
// onCutStageChange("Girdle");

// ========================================================
// STUB IMPLEMENTATIONS FOR MENU HELPER FUNCTIONS
// These are placeholder implementations for optional features
// ========================================================

// Stub: Show help information for current menu
void showHelpForMenu() {
  // TODO: Implement help display for menu
  // This function would show help text based on current menu
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Help for Menu");
  delay(2000);
}

// Stub: Show help information for current state
void showHelpForState() {
  // TODO: Implement help display for state
  // This function would show help text based on current machine state
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Help for State");
  delay(2000);
}

// ========================================================
// REQUIRED MENU FUNCTIONS - Copied from WorkingMini2025
// ========================================================

void settings(){
  lcd.clear();
 // Serial.println("Function settings() was called.");
  lcd.setCursor(0,1);
  lcd.print("settings()    ");
  Serial1.print("page 1"); // command to load page
  Serial1.print("\xFF\xFF\xFF"); // Nextion end command

}//close settings() function

void chuckLocation(){
//output current chuck Location
}//close chuckLocation()

void chuckCalibration(){
  settingsHome();//run home function
  
//no dop aka chuck calibration variables... used to calculate the length of dop stick
  homeYOffsetStepsChuck = 0;
  homeXOffsetStepsChuck = 0;
  
   
  calibratedYPositionChuck = 0;
  calibratedXPositionChuck = 0;
    

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
    homeXOffsetStepsChuck = homeXOffsetStepsChuck + 1;// add one to the home offset for the X axis every step
      if(limitSwitchCalx.isPressed()){//check if limit switch X has been pressed
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
  if(limitSwitchCaly.isPressed())
 Serial.println("y limit switch: Untouched -> Touched 1");

 if(limitSwitchCaly.isReleased())
 Serial.println("y limit switch: Touched -> Untouched");

 lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Calibrating...");
       
    while(yPositionChuckSet == 0){
      limitSwitchCaly.loop();
      lcd.clear();
      lcd.setCursor(0,1);
       lcd.print("Calibrating Y");
      homeYOffsetStepsChuck = homeYOffsetStepsChuck + 1;// add one to the home offset for the Y axis every step
      if(limitSwitchCaly.isPressed()){//check to see if limit switch Y(on calibrator) has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Y Calibrated");
        yPositionChuckSet = yPositionChuckSet + 1;//set the yPositionChuckSet to 1 so that the loop stops
        calibratedYPositionChuck = homeYOffsetStepsChuck;//set the position for the calibrated Y position, this will be used for calculating the length of the dop stick
        YaxisMotor->step(100,BACKWARD,MICROSTEP);//825offset 100 steps from the Yswitch

      }//close if statement for y limit switch pressed
    }//close while loop for y calibration
  
      
   XaxisMotor->release();//this will release the x axis motor and stop it from moving

   g_Menu.printMenu();
}//close chuckCalibration()

void dopLocation(){
//output dop location
}//close dopLocation

void dopCalibration(){
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
    homeXOffsetStepsDop = homeXOffsetStepsDop + 1;// add one to the home offset for the X axis every step
      if(limitSwitchCalx.isPressed()){//check if limit switch X has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("X Calibrated");
      xPositionDopSet = xPositionDopSet + 1;//set the xPositionDopSet to 1 so that the loop stops
        calibratedXPositionDop = homeXOffsetStepsDop;//set the position for the calibrated X position, this will be used for calculating the length of the dop stick 
        XaxisMotor->step(200,BACKWARD,SINGLE);//offset 100 steps from the Xswitch, so the machine can run its home function
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("X Calibrated");

      }//close if statement for x limit switch pressed
  }//close while loop for x calibration

//loop for the y calibrator limit switch 
  limitSwitchCaly.loop();

  //loop for limit switch y calibrator--------------------------------------limit switch y calibrator
  if(limitSwitchCaly.isPressed())
 Serial.println("y limit switch: Untouched -> Touched 3");

 if(limitSwitchCaly.isReleased())
 Serial.println("y limit switch: Touched -> Untouched");

 lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Calibrating...");
       
    while(yPositionDopSet == 0){
      limitSwitchCaly.loop();
      lcd.clear();
      lcd.setCursor(0,1);
       lcd.print("Calibrating Y");
      homeYOffsetStepsDop = homeYOffsetStepsDop + 1;// add one to the home offset for the Y axis every step
      if(limitSwitchCaly.isPressed()){//check to see if limit switch Y(on calibrator) has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Y Calibrated");
        yPositionDopSet = yPositionDopSet + 1;//set the yPositionDopSet to 1 so that the loop stops
        calibratedYPositionDop = homeYOffsetStepsDop;//set the position for the calibrated Y position, this will be used for calculating the length of the dop stick
        YaxisMotor->step(100,BACKWARD,MICROSTEP);//825offset 100 steps from the Yswitch

      }//close if statement for y limit switch pressed
    }//close while loop for y calibration
  
      
   XaxisMotor->release();//this will release the x axis motor and stop it from moving

   g_Menu.printMenu();
}//close dopCalibration

void roughDimensions(){

}//close roughDimensions

void design(){
  lcd.clear();
  lcd.setCursor(0,1);
  lcd.print("design()   ");
  
}//close design() function

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
  lcd.setCursor(0,1);
  lcd.print("Preform Round");
  
  // Placeholder implementation
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Preform Rounding");
  lcd.setCursor(0,1);
  lcd.print("Ready - Press 0");
  
  g_Menu.printMenu();
   
}//close preformGRound() function

void switchTest(){
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Switch Test");
  lcd.setCursor(0,1);
  lcd.print("Running...");
  delay(2000);
  g_Menu.printMenu();
}//close switchTest()

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

       
    while(homeYSet == 0){
      limitSwitchy.loop();
      lcd.clear();
      lcd.setCursor(0,1);
       lcd.print("Homing Y");
      YaxisMotor->step(1,BACKWARD,SINGLE);//825move up one step every loop
      ystepCount +=1;
      if(limitSwitchy.isPressed()){//check to see if limit switch Y has been pressed
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Home Y Set");
        homeYSet = homeYSet + 1;//set the homeYSet to 1 so that the loop stops
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

        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Home Y Set");
        homeYSet2 = homeYSet2 + 1;//set the homeYSet to 1 so that the loop stops
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
      if(limitSwitchx.isPressed()){//check if limit switch X has been pressed
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
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Home P Angle Set to 90");
        homePSet = 90;//set the homeYSet to 90 so that the loop stops
        homePPosition = 90;//set the position for P, This will be used in later functions
      }
    }//close while loop
   XaxisMotor->release();//this will release the x axis motor and stop it from moving
   lcd.clear();
       manualControl();
}//close home()

void manualControl(){//---------------------------------------------------------------------------------------------manual controls
Serial1.print("page 12"); // command to load page
        Serial1.print("\xFF\xFF\xFF"); // Nextion end command

  YaxisSteps = 0;
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("   Manual Control  ");

}//close manualControl()

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
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Home Y Set");
        homeYSet = homeYSet + 1;//set the homeYSet to 1 so that the loop stops
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

        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Home Y Set");
        homeYSet2 = homeYSet2 + 1;//set the homeYSet to 1 so that the loop stops
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
        lcd.clear();
        lcd.setCursor(0,1);
        lcd.print("Home P Angle Set to 90");
        homePSet = 90;//set the homeYSet to 90 so that the loop stops
        homePPosition = 90;//set the position for P, This will be used in later functions

      }
    }//close while loop
   XaxisMotor->release();//this will release the x axis motor and stop it from moving
   lcd.clear();
      
}//close settingsHomeCalibration()

// ========================================================
// STUB IMPLEMENTATIONS FOR STATE MANAGEMENT FUNCTIONS
// These are placeholder implementations for optional features
// ========================================================

// Stub: Update state variables (optional enhancement)
void updateStateVars() {
  // TODO: Implement state variable updates if needed
  // This function would capture current machine state
}

// Stub: Save state to SD card (optional enhancement)
void saveStateToSD() {
  // TODO: Implement SD card save functionality
  // This function would persist state to SD card
}

// Stub: Load state from SD card (optional enhancement)
bool loadStateFromSD() {
  // TODO: Implement SD card load functionality
  // Return true if load successful, false otherwise
  return false;
}

// Stub: Apply loaded state variables (optional enhancement)
void applyStateVars() {
  // TODO: Implement state restoration
  // This function would restore state variables from loaded data
}

// Stub: Upload device token to server (optional enhancement)
void uploadDeviceToken() {
  // TODO: Implement device token upload
  // This function would register device with remote server
}

// Stub: Show user feedback on display (optional enhancement)
void showUserFeedback(const String& title, const String& message) {
  // TODO: Implement user feedback display
  // This function would show messages to user on LCD/Nextion
  Serial.print("Feedback: ");
  Serial.print(title);
  Serial.print(" - ");
  Serial.println(message);
}