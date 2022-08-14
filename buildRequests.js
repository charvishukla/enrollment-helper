const fs = require("fs");
let payloads = fs.readFileSync("payloads.txt", { encoding: "utf-8" }).split("\n");


/**
 * Builds the cURL POST requests using a given poyload, a url, and the syntax for the request 
 * @param {*} payload is the form data 
 * @returns a string representing the cURL request
 */
 function makeRequsts(payload) {
  let fetchFrom = "'https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudentResult.htm'";
return "curl -X POST -d " +  payload  +  " " + fetchFrom + " -o /Users/charvieshukla/documents/AllSubjects/" ;
}



/**
 * Generates requests from an array of payloads
 * @param {*} payloads is an array of payloads to generate requests from 
 * @returns an array of requests
 */
function genRequests(payloads){
  arrayOfRequests = [];
  payloads.forEach((payload) =>{
    arrayOfRequests.push(makeRequsts(payload));
  });
return arrayOfRequests
}

//console.log(genRequests(payloads))


/**
 * 
 * @returns 
 */
function fileLocation() {
  let requests = genRequests(payloads);
  let subjects = [
    "AIP",
    "AAS",
    "AWP",
    "ANES",
    "ANBI",
    "ANAR",
    "ANTH",
    "ANSC",
    "AESE",
    "AUD",
    "BENG",
    "BNFO",
    "BIEB",
    "BICD",
    "BIPN",
    "BIBC",
    "BGGN",
    "BGJC",
    "BGRD",
    "BGSE",
    "BILD",
    "BIMM",
    "BISP",
    "BIOM",
    "CMM",
    "CENG",
    "CHEM",
    "CHIN",
    "CCS",
    "CLIN",
    "CLRE",
    "COGS",
    "COMM",
    "COGR",
    "CSS",
    "CSE",
    "CGS",
    "CAT",
    "TDDM",
    "TDHD",
    "TDMV",
    "TDPF",
    "TDTR",
    "DSC",
    "DSE",
    "DERM",
    "DSGN",
    "DOC",
    "DDPM",
    "ECON",
    "EDS",
    "ERC",
    "ECE",
    "EMED",
    "ENG",
    "ENVR",
    "ESYS",
    "ETIM",
    "ETHN",
    "EXPR",
    "FMPH",
    "FPM",
    "FILM",
    "GPCO",
    "GPEC",
    "GPGN",
    "GPIM",
    "GPL",
    "GPPA",
    "GPPS",
    "GLBH",
    "GSS",
    "HITO",
    "HIEA",
    "HIEU",
    "HILA",
    "HISC",
    "HINE",
    "HIUS",
    "HIGL",
    "HIGR",
    "HILD",
    "HDS",
    "HUM",
    "INTL",
    "JAPN",
    "JWSP",
    "LATI",
    "LHCO",
    "LISL",
    "LIAB",
    "LIDS",
    "LIFR",
    "LIGN",
    "LIGM",
    "LIHL",
    "LIIT",
    "LIPO",
    "LISP",
    "LTAM",
    "LTCO",
    "LTCS",
    "LTFR",
    "LTGM",
    "LTGK",
    "LTIT",
    "LTKO",
    "LTLA",
    "LTRU",
    "LTSP",
    "LTTH",
    "LTWR",
    "LTEN",
    "LTWL",
    "LTEA",
    "MMW",
    "MBC",
    "MATS",
    "MATH",
    "MSED",
    "MAE",
    "MED",
    "MCWP",
    "MUS",
    "NANO",
    "NEU",
    "NEUG",
    "OPTH",
    "ORTH",
    "PATH",
    "PEDS",
    "PHAR",
    "SPPS",
    "PHIL",
    "PHYS",
    "PHYA",
    "POLI",
    "PSY",
    "PSYC",
    "RMAS",
    "RAD",
    "MGTF",
    "MGT",
    "MGTA",
    "MGTP",
    "RELI",
    "RMED",
    "REV",
    "SOMI",
    "SOMC",
    "SIOC",
    "SIOG",
    "SIOB",
    "SIO",
    "SXTH",
    "SOCG",
    "SOCE",
    "SOCI",
    "SE",
    "SURG",
    "SYN",
    "TDAC",
    "TDDE",
    "TDDR",
    "TDGE",
    "TDGR",
    "TDHT",
    "TDPW",
    "TDPR",
    "TMC",
    "USP",
    "UROL",
    "VIS",
    "WARR",
    "WCWP",
    "WES"
  ];
  res =[];
  let i = 0;
  while (i<subjects.length) {
    res.push(requests[i] + subjects[i] + "/" + subjects[i] + ".html" + ";\nsleep 3;\n");
    i++;
  }
  
  return res;
}

console.log(typeof(fileLocation()))

/**
 * 
 */
function main() {
  commands = fileLocation();
  commands.forEach((command) => {
    fs.writeFileSync("allRequests.sh", command, { flag: "a+" });
  });
    
  
}


main();

// location 
// /Users/charvieshukla/documents/AllSubjects/ + "subject"/subject.html

// curl -X POST -d 'selectedTerm=FA22&xsoc_term=&loggedIn=false&tabNum=&selectedSubjects=AIP&_selectedSubjects=1&schedOption1=true&_schedOption1=on&_schedOption11=on&_schedOption12=on&schedOption2=true&_schedOption2=on&_schedOption4=on&_schedOption5=on&_schedOption3=on&_schedOption7=on&_schedOption8=on&_schedOption13=on&_schedOption10=on&_schedOption9=on&schDay=M&_schDay=on&schDay=T&_schDay=on&schDay=W&_schDay=on&schDay=R&_schDay=on&schDay=F&_schDay=on&schDay=S&_schDay=on&schStartTime=12%3A00&schStartAmPm=0&schEndTime=12%3A00&schEndAmPm=0&_selectedDepartments=1&schedOption1Dept=true&_schedOption1Dept=on&_schedOption11Dept=on&_schedOption12Dept=on&schedOption2Dept=true&_schedOption2Dept=on&_schedOption4Dept=on&_schedOption5Dept=on&_schedOption3Dept=on&_schedOption7Dept=on&_schedOption8Dept=on&_schedOption13Dept=on&_schedOption10Dept=on&_schedOption9Dept=on&schDayDept=M&_schDayDept=on&schDayDept=T&_schDayDept=on&schDayDept=W&_schDayDept=on&schDayDept=R&_schDayDept=on&schDayDept=F&_schDayDept=on&schDayDept=S&_schDayDept=on&schStartTimeDept=12%3A00&schStartAmPmDept=0&schEndTimeDept=12%3A00&schEndAmPmDept=0&courses=&sections=&instructorType=begin&instructor=&titleType=contain&title=&_hideFullSec=on&_showPopup=on' 'https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudentResult.htm' -o  /Users/charvieshukla/documents/AllSubjects/AIP/AIP-1.html;
// + ";\nsleep 3000;\n"