const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const ALL_SUBJECTS = '/Users/charvieshukla/documents/AllSubjects/'

let all_subjects = fs.readdirSync(ALL_SUBJECTS).filter(str => str !== '.DS_Store')
let URL = "https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudentResult.htm"


/**
 * 
 * @returns 
 */
function getAllReqs() {
    let reqs = ``;
    for (let j = 0; j < all_subjects.length; j++) {
        const subject = all_subjects[j];
        let filePath = ALL_SUBJECTS + subject + '/' + subject +'.html'
        let fileData = fs.readFileSync(filePath, { encoding: "utf-8"})
        let dom = new JSDOM(fileData);
        let tablesArr = dom.window.document.getElementsByTagName("table")
        let hasTable = tablesArr.length > 0;
        if(hasTable) {
            let table = tablesArr[0];
            let row = table.getElementsByTagName("tr").item(0)
            let cell = row.getElementsByTagName("td").item(2).innerHTML
            let rx = /\(.*\)/gm
            let arr = rx.exec(cell.trim())
            let pages = arr[0].replace('&nbsp;of&nbsp;', ' ').replace('(','').replace(')','').split(" ").map(str => parseInt(str))[1]
            if(pages > 1) {
                for(let i = 2; i <= pages; i++) {
                    let payload = genPayload(subject)
                    let url = URL + `?page=${i}`
                    let outfile = ALL_SUBJECTS + subject + "/" + subject + `-${i}.html`;
                    reqs = reqs + '\n' + `curl -X POST -d '${payload}' '${url}' -o ${outfile};` + '\n' + 'sleep 3;'
                }
            } 
        } 
        
    }

    return reqs;
}



fs.writeFileSync('all_sub_reqs.sh', getAllReqs());




function getNumPages(subject){
    var folder = fs.readdirSync(ALL_SUBJECTS + subject );
    for (const file in folder) {
        var content = fs.readFileSync(file);
        const dom = new JSDOM(content);
        const elem = dom.body.getElementbyTagName('table');
    }
    return elem;
}



function genPayload(subjectCode) {
    return `selectedTerm=FA22&xsoc_term=&loggedIn=false&tabNum=&selectedSubjects=${subjectCode}&_selectedSubjects=1&schedOption1=true&_schedOption1=on&_schedOption11=on&_schedOption12=on&schedOption2=true&_schedOption2=on&_schedOption4=on&_schedOption5=on&_schedOption3=on&_schedOption7=on&_schedOption8=on&_schedOption13=on&_schedOption10=on&_schedOption9=on&schDay=M&_schDay=on&schDay=T&_schDay=on&schDay=W&_schDay=on&schDay=R&_schDay=on&schDay=F&_schDay=on&schDay=S&_schDay=on&schStartTime=12%3A00&schStartAmPm=0&schEndTime=12%3A00&schEndAmPm=0&_selectedDepartments=1&schedOption1Dept=true&_schedOption1Dept=on&_schedOption11Dept=on&_schedOption12Dept=on&schedOption2Dept=true&_schedOption2Dept=on&_schedOption4Dept=on&_schedOption5Dept=on&_schedOption3Dept=on&_schedOption7Dept=on&_schedOption8Dept=on&_schedOption13Dept=on&_schedOption10Dept=on&_schedOption9Dept=on&schDayDept=M&_schDayDept=on&schDayDept=T&_schDayDept=on&schDayDept=W&_schDayDept=on&schDayDept=R&_schDayDept=on&schDayDept=F&_schDayDept=on&schDayDept=S&_schDayDept=on&schStartTimeDept=12%3A00&schStartAmPmDept=0&schEndTimeDept=12%3A00&schEndAmPmDept=0&courses=&sections=&instructorType=begin&instructor=&titleType=contain&title=&_hideFullSec=on&_showPopup=on`
}