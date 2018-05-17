const randomStr = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnoprstuvwxyz012345678";
export function getCardId(userName) {
  let date = new Date();
  let year = date.getFullYear().toString();
  let month = padLeft(date.getMonth() + 1);
  let day = padLeft(date.getDate());
  let randomStr = getFiveWord()
  let str = userName + year + month + day + randomStr;
  return str;
}

function padLeft(value) {
  if (value.toString().length == 1) {
    return "0" + value.toString();
  } else {
    return value;
  }
}

function getFiveWord() {
  let str = ""
  for (let i = 0; i < 5; i++) {
    str += randomStr.charAt(Math.random() * randomStr.length)
  }
  return str;
}
