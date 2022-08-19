// plain tr tags contain the course info  
    // td class="crsheader" is the course code
    // td class="crsheader" colspan="5"  is the number of units 
    //  td class="crsheader" colspan="5" --> span class="boldtxt" is the course name 

// tr tag --> class="nonenrtxt" is the final for the course  

// tr tag --> class="sectxt" are the sections for the course 
    // td class="brdr" contains span id="instyp" ---> instruction type 
    // td contains <a> onclick=" ..." ---> professtor name

const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function getHTMLData(path) {
    let fileData = fs.readFileSync(path, { encoding: "utf-8"});
    return fileData;
}

function getCouseHeader(htmlData) {
    let dom = new JSDOM(htmlData);
    let tableOfContents = dom.window.document.getElementsByTagName("table").item[1];
    let courseName = tableOfContents.getElementsByClassName("crsheader");


    return courseName;
}


let data = getHTMLData('/Users/charvieshukla/documents/AllSubjects/CSE/CSE.html');

console.log(getCouseHeader(data));