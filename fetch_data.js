/**
 * File: fetchData.js
 * Date: 08/20/2022
 * Author: Charvi Shukla
 * Converts data stored in the form of HTML into a JS object, and subsequently 
 * into a JSON object 
 */

const {
    table
} = require("console");
const util = require("util");
const fs = require("fs");
const {
    get
} = require("https");
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;



const PATH_TO_CATALOG_HTML = "alltables.html";

/**
 * This function reads a given HTML document and creates a DOM for it. Since the 
 * HTML document only contains tables, we call the result "tables."
 * @returns an array of HTML tables.
 */
function getTablesFromFile() {
    const data = fs.readFileSync(PATH_TO_CATALOG_HTML, {
        encoding: "utf-8"
    });
    const dom = new JSDOM(data);
    const tables = dom.window.document.getElementsByTagName("table");
    return tables;
}

/**
 * fetches the tables from the HTML file and converst HTML data to the JSON format.
 */
function main() {
    let tables = getTablesFromFile();
    let json = tablesToSubjects(tables);
    fs.writeFileSync("catalog.json", JSON.stringify(json));
}

/**
 * @param tables of course data. Tables is an array of multiple HTML tables. This 
 * method traverses through each table and extracts the HTML data contained within 
 * each table. 
 * The extracted data is pushed into an array and that array is then used to 
 * populate a JavaScript object.
 * @returns JavaScript object for each subject [i.e. the ENTIRE catalog].
 */
function tablesToSubjects(tables) {
    let subjectArr = [];
    for (let i = 0; i < tables.length; i++) {
        let subjectJSON = buildIndividualSubjectJSON(tables.item(i));
        subjectArr.push(subjectJSON);
    }
    return {
        subject: subjectArr,
    };
}


/**
 * @param table is a single table from an array of HTML tables.
 * @returns a javascript object containing course data from a SINGLE table.
 * The object contains all the courses offered in one subject/department.
 * 
 * start at index = 4 [i.e. the first green row]
 * - the title rows do not have a class
 * - section rows [including the lectures] have class="sectxt"
 * - final rows have class="nonerntxt" 
 */
function buildIndividualSubjectJSON(table) {
    let res = [];
    let rows = table.getElementsByTagName("tr");
    let i = 4;
    let chunk = {};
    //console.log(rows.length);
    while (i < rows.length) {
        let row = rows.item(i);

        if (row.classList.contains("sectxt")) {
            let sectiondata = getSectionData(row);
            if (chunk.secInfo) {
                chunk.secInfo = [...chunk.secInfo, sectiondata];
            } else {
                chunk.secInfo = [sectiondata]
            }
        } else {
            if (i !== 4) {
                res.push(chunk);
            }
            chunk = {};
            let courseTitle = getCourseTitle(row);
            chunk = {
                classData: courseTitle
            };
        }
        i++;
    }
    res.push(chunk);

    //console.log(JSON.stringify(res));

    return res;
}



// tb = getTablesFromFile();
// randomtb = tb[0];
// console.log(JSON.stringify(buildIndividualSubjectJSON(randomtb)));

// rows = randomtb.querySelectorAll("tr");
// sectionRow = rows[6];
// console.log(JSON.stringify(getSectionData(sectionRow)));

/**
 * gets course title from specific rows
 * @param tr is the wor containhing the course information 
 * @returns a JS object containing all course title info 
 */
function getCourseTitle(tr) { // gets the green rows 
    res = {}
    //let tr = Array.from(table.querySelectorAll("tr:not([class])"));
    let cols = tr.querySelectorAll("td.crsheader");
    if (cols.length === 4) {
        // getting number of units
        let txt = cols[2].innerHTML;
        let removeWhitespace = txt.replace(/(?:\s)/g, "");
        let idx = removeWhitespace.search(/<\/a>\([^)]*\)<br>/);
        let units = removeWhitespace.substring(idx + 5, removeWhitespace.length - 5);
        // pushing course units, number, and name 
        res = {
            courseNum: cols[1].innerHTML,
            courseName: cols[2].querySelector("span.boldtxt").innerHTML.trim(),
            unitCount: units
        }
    }
    return res;
}

tb = getTablesFromFile();
randomtb = tb[0];
rows = randomtb.querySelectorAll("tr");
sectionRow = rows[4];
console.log(JSON.stringify(getCourseTitle(sectionRow)));


/**
 * Takes a row form the HTML and converts the section data into a 
 * JSON format 
 * @param tr is a row from a given table  
 * @returns JSON containing all data from a singular ROW 
 */
function getSectionData(tr) { // gets the purple rows 
    res = {};

    // columns from each row are saved in an array.
    let columns = tr.querySelectorAll("td.brdr");
    // predicate to find if the row contains discussion information.
    let instructionType = columns.item(3).innerHTML;

    let lecture = '<span id="insTyp" title="Lecture">LE</span>';
    let disc = '<span id="insTyp" title="Discussion">DI</span>';
    let lab = '<span id="insTyp" title="Laboratory">LA</span>';
    let studio = '<span id="insTyp" title="Studio">ST</span>';
    let practicum = '<span id="insTyp" title="Practicum">PR</span>';
    let seminar = '<span id="insTyp" title="Seminar">SE</span>'

    if (instructionType === disc ||
        instructionType === lab ||
        instructionType === studio ||
        instructionType === practicum) {
        if (columns.length !== 13) {
            // cancelled Discussions have less than 13 columns.
            res = {
                status: "course cancelled"
            };
        } else {
            if (instructionType == disc) {
                res = {
                    ...res,
                    instructionType: "DI"
                };
            } else if (instructionType == lab) {
                res = {
                    ...res,
                    instructionType: "LA"
                };
            } else if (instructionType == studio) {
                res = {
                    ...res,
                    instructionType: "ST"
                };
            } else if (instructionType = practicum) {
                res = {
                    ...res,
                    instructionType: "PR"
                };
            }

            res = {
                ...res,
                sectionID: columns[4].innerHTML,
                sectionDays: columns[5].innerHTML.trim(),
                sectionTiming: columns[6].innerHTML,
                sectioBuilding: columns[7].innerHTML.trim(),
                sectionRoom: columns[8].innerHTML.trim()
            }
        }

    } else if (instructionType === lecture || instructionType === seminar) {
        if (columns.length === 13) {
            res = {
                insType: instructionType.innerHTML,
                sectionID: columns[4].innerHTML,
                lectureDays: columns[5].innerHTML.trim(),
                lectureTiming: columns[6].innerHTML,
                lectureBuilding: columns[7].innerHTML.trim(),
                lectureRoom: columns[8].innerHTML.trim(),
                professorName: columns[9].querySelector("a").innerHTML.trim()
            }
        }
    }

    return res;
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// HELPER METHOD 1
function isCourseName(str) {
    if (str === "Prerequisites  " || str === "Resources" ||
        str === '<span title="CAPE - Course and Professor Evaluations">Evaluations</span>' ||
        str === "Prerequisites") {
        return false;
    } else {
        return true;
    }
}


//main();