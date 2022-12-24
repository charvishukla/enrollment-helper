const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const ALL_SUBJECTS = "./AllSubjects/";
let all_subjects = removeDSStore(fs.readdirSync(ALL_SUBJECTS));

function removeDSStore(arr) {
  return arr.filter((str) => str !== ".DS_Store");
}

function getAllReqs() {
  let templateDOM = new JSDOM(fs.readFileSync("template.html", { encoding: "utf-8" }));

  for (let j = 0; j < all_subjects.length; j++) {
    const subject = all_subjects[j];
    let subjectDirPath = ALL_SUBJECTS + subject;

    console.log(subject);
    let all_pages = removeDSStore(fs.readdirSync(subjectDirPath));

    for (let j = 1; j <= all_pages.length; j++) {
      const page = all_pages[j];
      let pageData = fs.readFileSync(subjectDirPath + "/" + subject + "-" + j + ".html", { encoding: "utf-8" });
      let dom = new JSDOM(pageData);
      let tablesArr = dom.window.document.getElementsByTagName("table");
      let has2OrMoreTables = tablesArr.length > 1;
      if (has2OrMoreTables) {
        let table = tablesArr[1];
        templateDOM.window.document.body.appendChild(table);
      }
    }
  }

  fs.writeFileSync("alltables.html", templateDOM.serialize());
}

getAllReqs();
