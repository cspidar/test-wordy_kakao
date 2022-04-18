import request from "request";

let result;
let arr = [];

export function translate(text) {
  const client_id = "Q1hXkCUKxHcveLdSXV1t";
  const client_secret = "nQUsCkkc3U";
  let options = {
    url: "https://openapi.naver.com/v1/papago/n2mt",
    method: "POST",
    headers: {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    },
    form: { source: "en", target: "ko", text: text },
    // json: true,
  };

  request
    .post(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body);
      } else {
        console.log("error = " + response.statusCode, error);
      }
    })
    .on("data", (d) => {
      result += d;
    })
    .on("end", () => {
      // data is now ready
      console.log(result);
      // arr.push(result);
    });
}

translate("hello");

//sync request
//https://www.npmjs.com/package/sync-request
//https://stackoverflow.com/questions/41437291/how-to-add-parameters-in-nodejs-sync-request
