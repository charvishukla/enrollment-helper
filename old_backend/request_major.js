/*
 * Write a javascript function that 
 * accepts the major's code as a parameter
 * and executes a sequence of requests (one
 * request per page of the major) and combines 
 * all the data into a JSON object
 */

const axios = require('axios');
const qs = require('qs');

const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;

const parse = require('./parse_single_department.js');


let fetchfrom = 'https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudentResult.htm';

/**
 * @param {String} term 
 * @param {String} dep 
 * 
 * Returns the first page of schedule for a given term and department 
 */
async function pg1_req(term, dep) {
    const data = {
        'selectedTerm': term,
        'selectedSubjects': dep
    }

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    try {
        const response = await axios.post(fetchfrom, qs.stringify(data), config);
        return response.data;
    } 
    catch (error) {
        console.error(error);
    }

}
/**
 * @param {String} term 
 * @param {String} dep 
 * 
 * - gets responses for all the pages related to a given department
 * - saves all these responses in an array
 */
async function allpgs_req(term, dep) {
    // check if there are multiple pages 
    const pg1 = await pg1_req(term, dep);
    let dom = new JSDOM(pg1);
    // console.log(typeof(pg1));

    let tablesArr = dom.window.document.querySelectorAll("table");
    console.log("Number of tables in HTML: " + tablesArr.length);

    if (tablesArr.length > 0) {
        let table = tablesArr[0];
        let row = table.querySelectorAll("tr").item(0);
        let cell = row.querySelectorAll("td").item(2).innerHTML.trim();
        let rx = /\(.*\)/gm;
        let arr = rx.exec(cell.trim());
        let pages = arr[0].replace('&nbsp;of&nbsp;', ' ').replace('(', '').replace(')', '').split(" ").map(str => parseInt(str))[1];
        console.log("The number of pages is:" + pages);

        let response_arr = [];
        for (let i = 2; i <= pages; i++) {
            let new_url = fetchfrom + `?page=${i}`
            // data remains same 
            const data = {
                'selectedTerm': term,
                'selectedSubjects': dep
            }
            // config remains same 
            const config = {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            
            try {
                const response = await axios.post(new_url, qs.stringify(data), config);
                //return response.data;
                console.log("sent request #" +  i)
                response_arr.push(response.data);
            } 
            catch (error) {
                console.error(error);
            }
            
        }
        console.log(response_arr.length);
        return response_arr;   
    }
}

// allpgs_req("FA22", "BENG")


async function buildcombinedJSON(term, dep){
    const pg1 = await pg1_req(term, dep);
    let res = parse.parseHtml(pg1);
    const req_arr = await allpgs_req(term, dep);
    let temp = parse.parseHtmlArr(req_arr);
    res = {
        ...temp
    }
    console.log(res);
    return res;
}


// buildcombinedJSON("FA22", "CSE");


