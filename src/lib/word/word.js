import { appendFileSync, writeFile, readFileSync, writeFileSync } from "fs";
import voca from "voca";
import { delWords } from "./delWords.js";
// import fetch from "sync-fetch";
import fetch from "node-fetch";

// 텍스트 생성용 임시 객체
let tmpText = "";

// 텍스트 로드
const readText = function (path) {
  try {
    return readFileSync(path, "utf-8");
  } catch (e) {
    console.log(e);
  }
};
let srt = readText("../asset/Avengers_Endgame.srt");

//

// 객체 생성
let arr = [];
arr = srt.split("\r\n");
// ["", "", ...]

let rarr = []; // 결과 객체 배열
// let rarr = [
//   {
//     example: ["", ""],
//     time: "",
//   },
// ];

// example_en, example_ko 생성

let trarr = []; // 번역 결과 포함 객체 배열
// let trarr = [
//   {
//     en: ["", ""],
//     ko: ["", ""],
//     time: "",
//   },
// ];

let wordObj = {}; // 단어별 시간, 예문 정리
// let wordObj = {
//   word: {
//     time: [t1, t2],
//     en: [
//       [ex1_1, ex1_2],
//       [ex2_1, ex2_2],
//     ],
//     ko: [
//       [ex1_1, ex1_2],
//       [ex2_1, ex2_2],
//     ],
//   },
// };

let wordList = []; // 단어별 배열화

//

// rarr
for (let i = 0; i < arr.length; i++) {
  let word = {};
  let example = [];
  if (arr[i].includes("-->")) {
    word.time = arr[i].replace("-->", "-").replaceAll(/,.../g, "");
    i++;

    let tmp = "";
    while (arr[i] !== "") {
      if (arr[i].includes("- ")) {
        example.push(arr[i].replace("- ", ""));
        i++;
      } else {
        tmp += `${arr[i]} `;
        i++;
      }
    }
    if (tmp !== "") {
      example.push(tmp);
      tmp = "";
    }

    word.example = example;
    rarr.push(word);
    word = {};
  }
}

//

// // rarr 출력
// let r = "";
// for (let line of rarr) {
//   // r += line.time;
//   // r += "\r\n";

//   r += line.example[0];
//   if (line.example[1] !== undefined) {
//     r += "\r\n";
//     r += line.example[1];
//   }
//   r += "\r\n\r\n";
// }
// writeFileSync("./en_example.txt", r, "utf-8");

//

//trarr
function exToArr(s_) {
  let source = readText(`${s_}`);
  source;
  let rawArr = source.split("\r\n");
  let exArr = [];
  let tmp = [];
  for (let ex of rawArr) {
    if (ex !== "") {
      tmp.push(ex);
    } else {
      exArr.push(tmp);
      tmp = [];
    }
  }
  return exArr;
}
let enArr_en = exToArr("./en_example.txt");
let enArr_ko = exToArr("./ko_example.txt");
// console.log(enArr_ko);

for (let i = 0; i < rarr.length; i++) {
  let tmp = {};
  tmp.time = rarr[i].time;
  tmp.en = enArr_en[i];
  tmp.ko = enArr_ko[i];
  trarr.push(tmp);
  tmp = {};
}
// console.log(trarr[0]);

// trarr 출력
// let trarrText = "";
// for (let unit of trarr) {
//   trarrText += unit.time;
//   trarrText += "\r\n";
//   trarrText += unit.en;
//   trarrText += "\r\n";
//   trarrText += unit.ko;
//   trarrText += "\r\n";
//   trarrText += "\r\n";
// }
// writeFileSync("./trarrText.txt", trarrText, "utf-8");

//

//

// wordObj
for (let unit of trarr) {
  let rawWords = voca.words(voca.lowerCase(unit.en[0]));
  if (unit.en[1]) {
    let others = voca.words(voca.lowerCase(unit.en[1]));
    rawWords = [...rawWords, ...others];
  }
  let tmp = new Set(rawWords); // 중복 제거
  let uniqueWords = [...tmp];
  // console.log(uniqueWords);

  for (let word of uniqueWords) {
    if (!wordObj[word]) {
      wordObj[word] = { time: [], en: [], ko: [] };
    }
    let wordExample_en = [unit.en[0]];
    let wordExample_ko = [unit.ko[0]];
    if (unit.en[1]) {
      wordExample_en = [...wordExample_en, unit.en[1]];
      wordExample_ko = [...wordExample_ko, unit.ko[1]];
    }
    wordObj[word].time.push(unit.time);
    wordObj[word].en.push(wordExample_en);
    wordObj[word].ko.push(wordExample_ko);
  }
}
// console.log(wordObj.needs.time);

// wordObj 삭제 로직
for (let word in wordObj) {
  if (!isNaN(Number(word))) delete wordObj[word];
  if (word.length <= 2) delete wordObj[word];
  // if (Object.keys(wordObj[word]).length > 9) delete wordObj[word];
  for (let delWord of delWords) {
    if (wordObj[delWord]) delete wordObj[delWord];
    if (wordObj[`${delWord}s`]) delete wordObj[`${delWord}s`];
    // if (wordObj[`${delWord}ed`]) delete wordObj[`${delWord}ed`];
  }
}
// console.log(wordObj);

//

// // wordObj 출력
// for (let word in wordObj) {
//   tmpText += word;
//   tmpText += "\r\n";
//   for (let i = 0; i < wordObj[word].en.length; i++) {
//     tmpText += wordObj[word].time[i];
//     tmpText += "\r\n";
//     tmpText += wordObj[word].en[i][0];
//     tmpText += "\r\n";
//     tmpText += wordObj[word].ko[i][0];
//     tmpText += "\r\n";
//     if (wordObj[word].en[i][1]) {
//       tmpText += wordObj[word].en[i][1];
//       tmpText += "\r\n";
//       tmpText += wordObj[word].ko[i][1];
//       tmpText += "\r\n";
//     }
//   }
//   tmpText += "\r\n";
// }
// writeFileSync("./tmpText.txt", tmpText, "utf-8");

// wordObj 출력
tmpText += `export const ori_items = [`;
for (let word in wordObj) {
  tmpText += `{`;
  tmpText += `word: "${word}",`;
  tmpText += `time: [`;
  for (let i = 0; i < wordObj[word].en.length; i++) {
    tmpText += `"${wordObj[word].time[i]}",`;
  }
  tmpText += `],`;

  tmpText += `en: [`;
  for (let i = 0; i < wordObj[word].en.length; i++) {
    tmpText += `[`;
    tmpText += `"${wordObj[word].en[i][0]
      .replaceAll("'", "'")
      .replaceAll('"', "")}"`;
    if (wordObj[word].en[i][1]) {
      tmpText += `, "${wordObj[word].en[i][1]
        .replaceAll("'", "'")
        .replaceAll('"', "")}"`;
    }
    tmpText += `],`;
  }
  tmpText += `],`;
  tmpText += `ko: [`;
  for (let i = 0; i < wordObj[word].ko.length; i++) {
    tmpText += `[`;
    tmpText += `"${wordObj[word].ko[i][0]
      .replaceAll("'", "'")
      .replaceAll('"', "")}"`;
    if (wordObj[word].ko[i][1]) {
      tmpText += `, "${wordObj[word].ko[i][1]
        .replaceAll("'", "'")
        .replaceAll('"', "")}"`;
    }
    tmpText += `],`;
  }
  tmpText += `],`;

  tmpText += `},`;
  tmpText += "\r\n";
}
tmpText += `]`;
writeFileSync("./tmpText.txt", tmpText, "utf-8");

//
//

//

// console.log(rtext);

// arr = arr.filter((t) => t !== "");

// writeFileSync("./en.txt", rtext, "utf-8");

// let text = readText("./Avengers_Endgame.srt");

// appendFileSync("./word.txt", text, "utf-8");

// text 한줄씩, .split("\n") 후 배열로 push

// async function getTitle() {
//   const response = fetch(
//     "https://translate.google.co.kr/?hl=ko&sl=en&tl=ko&text=important&op=translate"
//   );
//   return response;
// }

// console.log(getTitle());
