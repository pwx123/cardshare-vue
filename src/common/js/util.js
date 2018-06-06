const randomStr = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnoprstuvwxyz012345678'
export function getCardId(userName) {
  let date = new Date()
  let year = date.getFullYear().toString()
  let month = padLeft(date.getMonth() + 1)
  let day = padLeft(date.getDate())
  let randomStr = getFiveWord()
  let str = userName + year + month + day + randomStr
  return str
}

export function emailCheck(email) {
  var emailreg = /^([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
  if (!emailreg.test(email)) {
    return false
  }
  return true
}
export function pwdCheck(pwd) {
  var pwdreg = /^[a-zA-Z]\w{5,17}$/
  if (!pwdreg.test(pwd)) {
    return false
  }
  return true
}
export function phoneNumCheck(phoneNUm) {
  var phoneNumreg = /^[1][3,4,5,7,8][0-9]{9}$/
  if (!phoneNumreg.test(phoneNUm)) {
    return false
  }
  return true
}
export function stringCheck(string) {
  var result = removeSpace(string)
  if (result.length === 0) {
    return false
  }
  return true
}

function removeSpace(string) {
  var result
  result = string.trim()
  result = result.replace(/\s/g, '')
  return result
}

function padLeft(value) {
  if (value.toString().length === 1) {
    return '0' + value.toString()
  } else {
    return value
  }
}

export function getFiveWord() {
  let str = ''
  for (let i = 0; i < 5; i++) {
    str += randomStr.charAt(Math.random() * randomStr.length)
  }
  return str
}

export function timeFormat(time) {
  let date = new Date(time)
  let month = date.getMonth() + 1
  let day = date.getDay()
  let hour = date.getHours()
  let minutes = date.getMinutes()
  let str = `${month}-${day} ${hour}:${minutes}`
  return str
}
