import { appendFileSync, writeFile, readFileSync, writeFileSync } from "fs";
// import fetch from "sync-fetch";
import fetch from "node-fetch";

let readText = function (path) {
  try {
    return readFileSync(path, "utf-8");
  } catch (e) {
    console.log(e);
  }
};

let text;

// let text = readText("./asset/Avengers_Endgame.srt");

// writeFileSync("./asset/text.txt", text, "utf-8");

// appendFileSync("./asset/word.txt", text, "utf-8");

// text 한줄씩, .split("\n") 후 배열로 push

// async function getTitle() {
//   const response = fetch(
//     "https://translate.google.co.kr/?hl=ko&sl=en&tl=ko&text=important&op=translate"
//   );
//   return response;
// }

// console.log(getTitle());

const scrap = fetch(
  `https://api.allorigins.win/get?url=${encodeURIComponent(
    "https://translate.google.co.kr/?hl=ko&sl=en&tl=ko&text=important&op=translate"
  )}`
)
  .then((response) => {
    if (response.ok) return response.json();
    throw new Error("Network response was not ok.");
  })
  .then((data) => {
    // console.log(data);
    text = data.toString();
  })
  .then(() => {
    writeFile("./asset/text.txt", text, (e) => console.log(e));
  });
