var pinyin = require("pinyin")

function getKey(userName) {
  if (!userName) {
    return "#";
  }
  let key = pinyin(userName, {
      style: pinyin.STYLE_FIRST_LETTER
    })[0]
    .toString()
    .charAt(0)
    .toUpperCase();
  return key;
}
module.exports = getKey
