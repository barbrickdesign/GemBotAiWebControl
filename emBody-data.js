/**
 * emBody Cancer Data Module
 * Comprehensive cancer type database with statistics and educational information
 * Data sourced from: American Cancer Society, National Cancer Institute, WHO
 */

const CancerData = {
    // Total human body cells estimate
    totalBodyCells: 30000000000000, // 30 trillion cells

    // Cancer types with detailed information
    types: {
        overview: {
            name: "Overview - All Cancers",
            annualCases: "10,000,000+",
            survivalRate: "Varies",
            affectedCells: "Various",
            color: "#9b59b6",
            description: "Cancer is a group of diseases involving abnormal cell growth with the potential to invade or spread to other parts of the body.",
            cellPercentage: 0.001, // Starting percentage
            characteristics: [
                "Uncontrolled cell division",
                "Ability to invade nearby tissues",
                "Potential to spread (metastasize)",
                "Resistance to cell death signals",
                "Sustained angiogenesis (blood vessel growth)"
            ],
            treatmentOptions: [
                "Surgery - Physical removal of tumors",
                "Chemotherapy - Drug-based treatment",
                "Radiation therapy - High-energy radiation",
                "Immunotherapy - Boosting immune system",
                "Targeted therapy - Specific molecular targets",
                "Hormone therapy - Blocking hormones"
            ],
            researchLinks: [
                { text: "National Cancer Institute", url: "https://www.cancer.gov" },
                { text: "American Cancer Society", url: "https://www.cancer.org" },
                { text: "World Health Organization", url: "https://www.who.int/cancer" }
            ],
            statistics: {
                globalBurden: "~10 million deaths per year worldwide",
                commonTypes: "Lung, breast, colorectal, prostate, skin",
                preventable: "30-50% of cancers are preventable"
            }
        },

        lung: {
            name: "Lung Cancer",
            annualCases: "2,200,000",
            survivalRate: "21%",
            affectedCells: "Bronchial & Alveolar",
            color: "#e74c3c",
            description: "Lung cancer begins in the lungs and is the leading cause of cancer deaths worldwide. It's strongly associated with smoking.",
            cellPercentage: 0.05,
            characteristics: [
                "Persistent cough and chest pain",
                "Shortness of breath",
                "Coughing up blood",
                "Weight loss and fatigue",
                "Often diagnosed at advanced stages"
            ],
            subtypes: [
                "Non-small cell lung cancer (NSCLC) - 85% of cases",
                "Small cell lung cancer (SCLC) - 15% of cases",
                "Adenocarcinoma - Most common NSCLC subtype",
                "Squamous cell carcinoma",
                "Large cell carcinoma"
            ],
            treatmentOptions: [
                "Surgical resection (lobectomy, pneumonectomy)",
                "Chemotherapy combinations",
                "Targeted therapy (EGFR, ALK inhibitors)",
                "Immunotherapy (checkpoint inhibitors)",
                "Radiation therapy (SBRT, conventional)"
            ],
            riskFactors: [
                "Smoking (90% of cases)",
                "Secondhand smoke exposure",
                "Radon gas exposure",
                "Occupational exposures (asbestos, arsenic)",
                "Air pollution",
                "Family history"
            ],
            statistics: {
                averageAge: "70 years at diagnosis",
                maleToFemaleRatio: "1.2:1",
                preventability: "90% of cases are smoking-related"
            }
        },

        breast: {
            name: "Breast Cancer",
            annualCases: "2,300,000",
            survivalRate: "90%",
            affectedCells: "Mammary Epithelial",
            color: "#ff69b4",
            description: "Breast cancer develops from breast tissue, most commonly from the inner lining of milk ducts or the lobules.",
            cellPercentage: 0.02,
            characteristics: [
                "Lump in breast or underarm",
                "Change in breast size or shape",
                "Nipple discharge or inversion",
                "Skin changes (dimpling, redness)",
                "Usually painless in early stages"
            ],
            subtypes: [
                "Invasive ductal carcinoma (IDC) - 80%",
                "Invasive lobular carcinoma (ILC) - 10%",
                "Triple-negative breast cancer",
                "HER2-positive breast cancer",
                "Hormone receptor-positive cancer"
            ],
            treatmentOptions: [
                "Lumpectomy or mastectomy",
                "Sentinel lymph node biopsy",
                "Hormone therapy (tamoxifen, aromatase inhibitors)",
                "HER2-targeted therapy (trastuzumab)",
                "Chemotherapy (adjuvant or neoadjuvant)",
                "Radiation therapy"
            ],
            riskFactors: [
                "Female gender (99% of cases)",
                "Age (risk increases with age)",
                "Family history and genetics (BRCA1/2)",
                "Early menstruation or late menopause",
                "Never having been pregnant",
                "Hormone replacement therapy"
            ],
            statistics: {
                averageAge: "62 years at diagnosis",
                geneticComponent: "5-10% hereditary",
                screeningRecommendation: "Annual mammogram starting at age 40-45"
            }
        },

        colorectal: {
            name: "Colorectal Cancer",
            annualCases: "1,900,000",
            survivalRate: "65%",
            affectedCells: "Colon & Rectal Epithelial",
            color: "#d35400",
            description: "Colorectal cancer starts in the colon or rectum and often develops from polyps over many years.",
            cellPercentage: 0.03,
            characteristics: [
                "Change in bowel habits",
                "Blood in stool",
                "Abdominal discomfort or pain",
                "Unexplained weight loss",
                "Fatigue and weakness"
            ],
            subtypes: [
                "Adenocarcinoma - 95% of cases",
                "Carcinoid tumors",
                "Gastrointestinal stromal tumors (GIST)",
                "Lymphomas",
                "Sarcomas"
            ],
            treatmentOptions: [
                "Surgical resection (colectomy, proctectomy)",
                "Chemotherapy (FOLFOX, FOLFIRI regimens)",
                "Targeted therapy (bevacizumab, cetuximab)",
                "Radiation therapy (for rectal cancer)",
                "Immunotherapy (for MSI-high tumors)"
            ],
            riskFactors: [
                "Age over 50",
                "Family history of colorectal cancer",
                "Inflammatory bowel disease",
                "High-fat, low-fiber diet",
                "Sedentary lifestyle",
                "Obesity and diabetes"
            ],
            statistics: {
                preventability: "50% preventable with screening",
                polypsToCancer: "Takes 10-15 years typically",
                screeningAge: "Start at age 45 (new guidelines)"
            }
        },

        prostate: {
            name: "Prostate Cancer",
            annualCases: "1,400,000",
            survivalRate: "98%",
            affectedCells: "Prostate Glandular",
            color: "#3498db",
            description: "Prostate cancer is a common cancer that develops in the prostate gland in men, typically growing slowly.",
            cellPercentage: 0.015,
            characteristics: [
                "Often asymptomatic in early stages",
                "Difficulty urinating",
                "Weak urine stream",
                "Blood in urine or semen",
                "Bone pain in advanced cases"
            ],
            subtypes: [
                "Acinar adenocarcinoma - Most common",
                "Ductal adenocarcinoma",
                "Transitional cell carcinoma",
                "Squamous cell carcinoma",
                "Small cell carcinoma"
            ],
            treatmentOptions: [
                "Active surveillance (watchful waiting)",
                "Radical prostatectomy",
                "Radiation therapy (external beam, brachytherapy)",
                "Hormone therapy (androgen deprivation)",
                "Chemotherapy (for advanced cases)",
                "Cryotherapy or HIFU"
            ],
            riskFactors: [
                "Age (rare before 40, common after 65)",
                "Family history",
                "African American ethnicity",
                "Obesity",
                "Diet high in red meat and dairy"
            ],
            statistics: {
                averageAge: "66 years at diagnosis",
                growth: "Often very slow-growing",
                screening: "PSA test and digital rectal exam"
            }
        },

        skin: {
            name: "Skin Cancer (Melanoma)",
            annualCases: "287,000",
            survivalRate: "93%",
            affectedCells: "Melanocytes",
            color: "#8b4513",
            description: "Melanoma is the most serious type of skin cancer, developing in cells that produce melanin pigment.",
            cellPercentage: 0.008,
            characteristics: [
                "New or changing mole",
                "Asymmetric shape",
                "Irregular borders",
                "Multiple colors",
                "Diameter larger than 6mm"
            ],
            subtypes: [
                "Superficial spreading melanoma - 70%",
                "Nodular melanoma",
                "Lentigo maligna melanoma",
                "Acral lentiginous melanoma",
                "Amelanotic melanoma"
            ],
            treatmentOptions: [
                "Surgical excision with wide margins",
                "Sentinel lymph node biopsy",
                "Immunotherapy (checkpoint inhibitors)",
                "Targeted therapy (BRAF/MEK inhibitors)",
                "Radiation therapy",
                "Chemotherapy (for advanced cases)"
            ],
            riskFactors: [
                "UV radiation exposure (sun, tanning beds)",
                "Fair skin, light hair",
                "Multiple moles",
                "Family history",
                "History of sunburns",
                "Weakened immune system"
            ],
            statistics: {
                preventability: "90% preventable with sun protection",
                ABCDE: "Screening acronym for melanoma",
                rising: "Incidence has been rising globally"
            }
        },

        lymphoma: {
            name: "Lymphoma",
            annualCases: "544,000",
            survivalRate: "73%",
            affectedCells: "Lymphocytes",
            color: "#9b59b6",
            description: "Lymphoma is cancer of the lymphatic system, affecting infection-fighting cells called lymphocytes.",
            cellPercentage: 0.012,
            characteristics: [
                "Swollen lymph nodes",
                "Fever and night sweats",
                "Unexplained weight loss",
                "Fatigue",
                "Itchy skin"
            ],
            subtypes: [
                "Hodgkin lymphoma",
                "Non-Hodgkin lymphoma (NHL)",
                "B-cell lymphomas - Most common",
                "T-cell lymphomas",
                "Diffuse large B-cell lymphoma (DLBCL)"
            ],
            treatmentOptions: [
                "Chemotherapy (CHOP, R-CHOP regimens)",
                "Radiation therapy",
                "Immunotherapy (rituximab, CAR T-cell)",
                "Stem cell transplantation",
                "Targeted therapy",
                "Watchful waiting (for indolent types)"
            ],
            riskFactors: [
                "Weakened immune system",
                "Certain infections (EBV, H. pylori)",
                "Age (risk increases with age)",
                "Family history",
                "Autoimmune diseases"
            ],
            statistics: {
                classification: "Over 70 subtypes",
                treatable: "Many types are highly curable",
                ageRange: "Can occur at any age"
            }
        },

        leukemia: {
            name: "Leukemia",
            annualCases: "474,000",
            survivalRate: "65%",
            affectedCells: "Blood & Bone Marrow",
            color: "#c0392b",
            description: "Leukemia is cancer of blood-forming tissues, hindering the body's ability to fight infection.",
            cellPercentage: 0.01,
            characteristics: [
                "Frequent infections",
                "Weakness and fatigue",
                "Easy bleeding or bruising",
                "Fever or chills",
                "Unexplained weight loss"
            ],
            subtypes: [
                "Acute lymphoblastic leukemia (ALL)",
                "Acute myeloid leukemia (AML)",
                "Chronic lymphocytic leukemia (CLL)",
                "Chronic myeloid leukemia (CML)",
                "Hairy cell leukemia"
            ],
            treatmentOptions: [
                "Chemotherapy (induction and consolidation)",
                "Targeted therapy (tyrosine kinase inhibitors)",
                "Stem cell transplantation",
                "Radiation therapy",
                "Immunotherapy (CAR T-cell therapy)",
                "Clinical trials"
            ],
            riskFactors: [
                "Previous cancer treatment",
                "Genetic disorders (Down syndrome)",
                "Family history",
                "Exposure to chemicals (benzene)",
                "Smoking",
                "Radiation exposure"
            ],
            statistics: {
                children: "Most common childhood cancer",
                chronicVsAcute: "Acute requires immediate treatment",
                research: "Significant advances in targeted therapies"
            }
        },

        pancreatic: {
            name: "Pancreatic Cancer",
            annualCases: "496,000",
            survivalRate: "10%",
            affectedCells: "Pancreatic Ductal",
            color: "#7f8c8d",
            description: "Pancreatic cancer is highly aggressive and difficult to detect early, forming in the tissues of the pancreas.",
            cellPercentage: 0.018,
            characteristics: [
                "Often asymptomatic until advanced",
                "Abdominal pain radiating to back",
                "Jaundice (yellowing of skin/eyes)",
                "Loss of appetite and weight loss",
                "New-onset diabetes"
            ],
            subtypes: [
                "Pancreatic ductal adenocarcinoma (PDAC) - 90%",
                "Pancreatic neuroendocrine tumors (PNETs)",
                "Acinar cell carcinoma",
                "Cystic neoplasms"
            ],
            treatmentOptions: [
                "Whipple procedure (pancreaticoduodenectomy)",
                "Chemotherapy (FOLFIRINOX, gemcitabine)",
                "Radiation therapy",
                "Targeted therapy (limited options)",
                "Palliative care (pain management)",
                "Clinical trials"
            ],
            riskFactors: [
                "Smoking (20-30% of cases)",
                "Chronic pancreatitis",
                "Diabetes",
                "Family history",
                "Obesity",
                "Age over 65"
            ],
            statistics: {
                challenging: "Very low early detection rate",
                aggressive: "Rapid progression",
                research: "Urgent need for better treatments"
            }
        },

        liver: {
            name: "Liver Cancer",
            annualCases: "906,000",
            survivalRate: "20%",
            affectedCells: "Hepatocytes",
            color: "#e67e22",
            description: "Liver cancer, primarily hepatocellular carcinoma, begins in the main type of liver cell (hepatocyte).",
            cellPercentage: 0.022,
            characteristics: [
                "Upper abdominal pain",
                "Swelling in abdomen",
                "Jaundice",
                "Weight loss",
                "Nausea and vomiting"
            ],
            subtypes: [
                "Hepatocellular carcinoma (HCC) - 75%",
                "Intrahepatic cholangiocarcinoma",
                "Angiosarcoma",
                "Hepatoblastoma (in children)"
            ],
            treatmentOptions: [
                "Partial hepatectomy",
                "Liver transplantation",
                "Ablation therapy (radiofrequency, microwave)",
                "Embolization therapy (TACE)",
                "Targeted therapy (sorafenib, lenvatinib)",
                "Immunotherapy"
            ],
            riskFactors: [
                "Chronic hepatitis B or C infection",
                "Cirrhosis",
                "Excessive alcohol consumption",
                "Obesity and diabetes",
                "Aflatoxin exposure",
                "Non-alcoholic fatty liver disease"
            ],
            statistics: {
                prevention: "Hepatitis B vaccine can prevent HCC",
                geography: "Higher rates in Asia and Africa",
                rising: "Increasing in Western countries"
            }
        },

        kidney: {
            name: "Kidney Cancer",
            annualCases: "431,000",
            survivalRate: "76%",
            affectedCells: "Renal Tubular",
            color: "#16a085",
            description: "Kidney cancer, most commonly renal cell carcinoma, forms in the lining of the kidney's tiny tubes.",
            cellPercentage: 0.011,
            characteristics: [
                "Blood in urine (hematuria)",
                "Lower back pain",
                "Abdominal mass",
                "Fatigue",
                "Unexplained weight loss"
            ],
            subtypes: [
                "Clear cell renal cell carcinoma - 70%",
                "Papillary renal cell carcinoma",
                "Chromophobe renal cell carcinoma",
                "Collecting duct carcinoma",
                "Wilms tumor (in children)"
            ],
            treatmentOptions: [
                "Partial or radical nephrectomy",
                "Targeted therapy (sunitinib, pazopanib)",
                "Immunotherapy (nivolumab, ipilimumab)",
                "Radiation therapy",
                "Ablation therapy",
                "Active surveillance (for small tumors)"
            ],
            riskFactors: [
                "Smoking",
                "Obesity",
                "High blood pressure",
                "Family history",
                "Chronic kidney disease",
                "Occupational exposures"
            ],
            statistics: {
                detection: "Often found incidentally on imaging",
                gender: "Twice as common in men",
                survival: "High survival if caught early"
            }
        },

        brain: {
            name: "Brain Cancer (Glioblastoma)",
            annualCases: "308,000",
            survivalRate: "6%",
            affectedCells: "Glial Cells",
            color: "#34495e",
            description: "Glioblastoma is the most aggressive malignant brain tumor, originating from astrocytic cells.",
            cellPercentage: 0.009,
            characteristics: [
                "Persistent headaches",
                "Seizures",
                "Nausea and vomiting",
                "Cognitive or personality changes",
                "Progressive neurological deficits"
            ],
            subtypes: [
                "Glioblastoma multiforme (GBM) - Grade IV",
                "Astrocytoma",
                "Oligodendroglioma",
                "Ependymoma",
                "Medulloblastoma"
            ],
            treatmentOptions: [
                "Surgical resection (maximal safe resection)",
                "Radiation therapy (60 Gy standard)",
                "Temozolomide chemotherapy",
                "Tumor treating fields (TTFields)",
                "Immunotherapy trials",
                "Clinical trials (CAR T, oncolytic viruses)"
            ],
            riskFactors: [
                "Age (peak incidence 75-84 years)",
                "Previous radiation exposure",
                "Genetic syndromes (rare)",
                "Male gender (slightly higher risk)",
                "Family history (rare)"
            ],
            statistics: {
                aggressive: "Median survival 15-18 months",
                recurrence: "Nearly always recurs",
                research: "Major focus of cancer research"
            }
        },

        ovarian: {
            name: "Ovarian Cancer",
            annualCases: "314,000",
            survivalRate: "49%",
            affectedCells: "Ovarian Epithelial",
            color: "#e91e63",
            description: "Ovarian cancer forms in the tissues of the ovary and is often diagnosed at advanced stages.",
            cellPercentage: 0.007,
            characteristics: [
                "Bloating and abdominal distension",
                "Pelvic or abdominal pain",
                "Difficulty eating",
                "Urinary frequency",
                "Often vague symptoms"
            ],
            subtypes: [
                "High-grade serous carcinoma - Most common",
                "Endometrioid carcinoma",
                "Clear cell carcinoma",
                "Mucinous carcinoma",
                "Low-grade serous carcinoma"
            ],
            treatmentOptions: [
                "Debulking surgery (cytoreduction)",
                "Chemotherapy (carboplatin + paclitaxel)",
                "PARP inhibitors (for BRCA mutations)",
                "Targeted therapy (bevacizumab)",
                "Intraperitoneal chemotherapy",
                "Clinical trials"
            ],
            riskFactors: [
                "Age (most common after menopause)",
                "Family history and BRCA mutations",
                "Never having been pregnant",
                "Endometriosis",
                "Hormone replacement therapy",
                "Obesity"
            ],
            statistics: {
                detection: "No effective screening test",
                hereditary: "10-15% linked to BRCA mutations",
                advocacy: "Teal ribbon awareness campaign"
            }
        }
    },

    // Helper function to get cancer data
    getCancerType(type) {
        return this.types[type] || this.types.overview;
    },

    // Calculate approximate cancer cells
    calculateCancerCells(type) {
        const cancerInfo = this.getCancerType(type);
        return Math.floor(this.totalBodyCells * cancerInfo.cellPercentage);
    }
};

// Make globally available
window.CancerData = CancerData;
