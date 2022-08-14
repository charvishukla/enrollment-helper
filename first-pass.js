const fs = require("fs");

let CATALOG_PATH = "/Users/charvieshukla/documents/AllSubjects/";
let COURSE_DIR_NAMES = fs.readdirSync(CATALOG_PATH);

function getPagePaths(courseCode) {
  let coursePath = `${CATALOG_PATH}/${courseCode}`;

  let pageNames = fs.readdirSync(coursePath);

  for (let i = 0; i < pageNames.length; i++) {
    let fileName = `${coursePath}/${pageNames[i]}`;
    let htmlText = fs.readFileSync(fileName, { encoding: "utf-8" });
    fs.writeFileSync(
      `${coursePath}/nohead-${pageNames[i]}`,
      htmlText.replace(
        /<head>([^]*?)<[/]head>/,
        `<head><link rel="stylesheet" href="../../style.css"><script src="../../parser.js" defer></script></head>`
      )
    );
  }
  return;
}

getPagePaths("BENG");
