const fs = require("fs");

let CATALOG_PATH = "/Users/charvieshukla/documents/AllSubjects/";

function findNumPages(courseCode) {
    let coursePath = `${CATALOG_PATH}/${courseCode}`;
    let pageNames = fs.readdirSync(coursePath);
    
    for (let i = 0; i < pageNames.length; i++) {
        let fileName = `${coursePath}/${pageNames[i]}`;
        let htmlText = fs.readFileSync(fileName, { encoding: "utf-8" });

        let table = document.querySelector('table')
        
    }
}