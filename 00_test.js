let led = "str";

let arr = [1, 2, 3];

let obj = {};

obj["1"] = true;

let yetBtnStatus = {};
function toggle(index) {
  !yetBtnStatus[index]
    ? (yetBtnStatus[index] = true)
    : (yetBtnStatus[index] = false);
}

toggle("1");
toggle("1");
toggle("1");

console.log(yetBtnStatus["1"] === true);
