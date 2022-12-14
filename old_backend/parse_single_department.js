
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// - - - - - - - - - - HTMLs -> JSON - - - - - - - - - -

function headerAndSectionToJSON(headers, sections) {
    return headers.map((h, i) => ({ ...h, sections: sections[i] }));
}

function getTable(html) {
    const dom = new JSDOM(html)
    return dom.window.document.querySelector("table.tbrdr");
}

function headerAndSectionFromHtml(html) {
    const table = getTable(html);
    return [getHeader(table), getSection(table)];
}

function parseHtml(html) {
    const [headers, sections] = headerAndSectionFromHtml(html);
    return headerAndSectionToJSON(headers, sections)
}

function parseHtmlArr(htmls) {
    return htmls.map(parseHtml);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// - - - - - - - -  helper functions - - - - - - - - - - - - - - - - - - - - - 
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 


// parse dep name 
function getDepartmentName(table) {
    var h2 = table.querySelector("h2");
    var inner = h2.querySelector("span.centeralign");
    return inner.innerHTML.trim();
}

// predicate to see if a tr contains course header elems
function isCourseHeader(tr) {
    var courseHeader = tr.querySelectorAll("td.crsheader");
    if (courseHeader.length === 0) {
        return -1;
    } else if (courseHeader.length === 3) {
        return -1;
    } else {
        return 0;
    }
}

// function to parse instructor name 
function getInstructorName(tds){
    let res; 
    if(tds[9].querySelectorAll("a").length !== 0){
        res = tds[9].querySelector("a").innerHTML.trim();
    } 
    else {
        // the case where the instructor is Staff 
        res = tds[9].innerHTML.trim();
    } 
    return res.replace("\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<br>", "")
}


// get the waitlist count 
function getWaitlist(tds){
    let col = tds[10].querySelectorAll("span");
    let res;
    if(col.length === 0){
        res = tds[10].innerHTML.trim();
    } else {
        res = tds[10].querySelector("span").innerHTML.trim();
    }

    if(res.length === 1 || res.length === 2 || res.length === 3){
        return res;
    }
    else if(res === "&nbsp;") {
        return ""
    }
    else {
        res = res.replace("FULL<br>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t \t", "")
        return res;
    }
}

// gets the max capacity of a particular section of the course
function getCapacity(tds){
    let col = tds[11].querySelectorAll("span");
    let res;
    if(col.length === 0){
        res = tds[11].innerHTML.trim();
    } else {
        res = tds[11].querySelector("span").innerHTML.trim();
    }

    if(res === "&nbsp;") {
        return "";
    }
    else {
        return res;
    }

}

// function to parse units 
function getUnits(td) {
    // getting number of units
    let txt = td.innerHTML;
    let removeWhitespace = txt.replace(/(?:\s)/g, "");
    let idx = removeWhitespace.search(/<\/a>\([^)]*\)<br>/);
    let numuts = removeWhitespace.substring(idx + 5, removeWhitespace.length - 5);
    let units = numuts.substring(0, 1);

    return units;
}

// parse the courseHeader row 
function getHeader(table) {
    const trs = table.querySelectorAll("tr");
    let res = [];
    for (let i = 0; i < trs.length; i++) {
        if (isCourseHeader(trs[i]) === 0) {
            json = {}
            var tds = trs[i].querySelectorAll("td.crsheader");


            json = {
                courseDep: getDepartmentName(table),
                courseNum: tds[1].innerHTML,
                courseName: tds[2].querySelector("span.boldtxt").innerHTML.trim(),
                courseUnits: getUnits(tds[2]),
                //sections: getsec(table)
            }
            res.push(json);
        }
    }
    return res;
}

//  get section data 
function getSection(table) {
    let res = [];
    const trs = table.querySelectorAll("tr");
    let sections = [];


    for (let i = 4; i < trs.length; i++) {
        if (isCourseHeader(trs[i]) === 0) {
            if (i !== 4) {
                res.push(sections);
            }
            sections = [];
        }

        if (issectxt(trs[i]) === 0) {
            sections.push(parseHTMLrowelem(trs[i]));
        }
    }
    res.push(sections);
    return res;
}


// predicate to check if a HTML row element is a section
function issectxt(tr) {
    var sec = tr.querySelectorAll("td.brdr");
    if (sec.length === 13) {
        return 0;
    }
}


// parse section info 
function parseHTMLrowelem(tr) {
    let res = {}
    let tds = tr.querySelectorAll("td.brdr");
    let instyp = tds.item(3).querySelector("span").innerHTML;

    res = {
        instructionType: instyp,
        secID: tds[4].innerHTML,
        day: tds[5].innerHTML.trim(),
        time: tds[6].innerHTML,
        building: tds[7].innerHTML.trim(),
        room: tds[8].innerHTML.trim(),
        instructor: getInstructorName(tds),
        seatsLeft: getWaitlist(tds),
        capacity: getCapacity(tds)

    }
    return res;
}


module.exports = {
    headerAndSectionToJSON: headerAndSectionToJSON,
    getTable: getTable,
    headerAndSectionFromHtml: headerAndSectionFromHtml,
    parseHtml: parseHtml,
    parseHtmlArr: parseHtmlArr,
    getDepartmentName: getDepartmentName,
    isCourseHeader: isCourseHeader,
    getInstructorName: getInstructorName,
    getWaitlist: getWaitlist,
    getCapacity: getCapacity,
    getUnits: getUnits,
    getHeader: getHeader,
    getSection: getSection,
    issectxt: issectxt,
    parseHTMLrowelem: parseHTMLrowelem
  };

//main("CSE");