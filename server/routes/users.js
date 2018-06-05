var express = require('express');
var router = express.Router();
var User = require('../models/users')
var Card = require('../models/cards')
var Event = require('../models/events')
var getKey = require('./../utils/util')

/* GET users listing. */
router.post('/login', function (req, res, next) {
  let param = {
    loginUserEmail: req.body.loginUserEmail,
    userPwd: req.body.userPwd
  };
  User.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        status: "100",
        msg: "数据库访问失败!",
        result: ""
      });
    } else {
      if (doc) {
        res.cookie("loginUserEmail", doc.loginUserEmail, {
          path: "/",
          maxAge: 1000 * 60 * 60 * 365
        });
        res.cookie("newEventId", doc.newEventId, {
          path: "/",
          maxAge: 1000 * 60 * 60 * 365
        });
        res.json({
          status: "0",
          msg: "登陆成功",
          result: {
            loginUserEmail: doc.loginUserEmail
          }
        });
      } else {
        res.json({
          status: "002",
          msg: "登陆失败",
          result: ""
        });
      }
    }
  })
});


//test async
// function findUser(userName) {
//   return new Promise((resolve, reject) => {
//     User.find({
//       userName: userName
//     }, (err, doc) => {
//       if (err) {
//         reject({
//           tatus: "100",
//           msg: "数据库访问失败!",
//           result: ""
//         })
//       } else {
//         if (doc.length != 0) {
//           reject({
//             status: "003",
//             msg: "用户已存在!",
//             result: ""
//           })
//         } else {
//           resolve('succ')
//         }
//       }
//     })
//   })
// }

// function userSave(userName, userPwd) {
//   return new Promise((resolve, reject) => {
//     let newUser = new User({
//       userName: userName,
//       userPwd: userPwd
//     });
//     newUser.save(err => {
//       if (err) {
//         reject({
//           tatus: "100",
//           msg: "数据库访问失败!",
//           result: ""
//         })
//       } else {
//         resolve({
//           status: "0",
//           msg: "注册成功",
//           result: {
//             userName: userName
//           }
//         });
//       }
//     })
//   })
// }
// async function conn(req, res, next) {
//   let userName = req.body.userName;
//   let userPwd = req.body.userPwd;
//   await findUser(userName);
//   return await userSave(userName, userPwd);
// }
// router.post('/reg', function (req, res, next) {
//   conn(req, res, next)
//     .then(result => {
//       res.json(result);
//     })
//     .catch(error => {
//       res.json(error);
//     })
// })
router.post('/reg', function (req, res, next) {
  let loginUserEmail = req.body.loginUserEmail;
  let userPwd = req.body.userPwd;
  let newUser = new User({
    loginUserEmail: loginUserEmail,
    userPwd: userPwd,
    userName: "",
    newEventId: ""
  });
  User.find({
    loginUserEmail: loginUserEmail
  }, (err, doc) => {
    if (err) {
      res.json({
        status: "100",
        msg: "数据库访问失败!",
        result: ""
      });
    } else {
      if (doc.length != 0) {
        res.json({
          status: "003",
          msg: "用户已存在!",
          result: ""
        });
      } else {
        newUser.save(function (err) {
          if (err) {
            res.json({
              status: "100",
              msg: "数据库访问失败!",
              result: ""
            });
          } else {
            res.json({
              status: "0",
              msg: "注册成功",
              result: {
                loginUserEmail: loginUserEmail
              }
            });
          }
        })
      }
    }
  })
})

router.post('/getUserMsg', function (req, res, next) {
  let loginUserEmail = decodeURI(req.cookies.loginUserEmail);
  let param = {
    loginUserEmail: loginUserEmail
  };
  User.findOne(param, {
    userPwd: 0,
    _id: 0
  }, (err, doc) => {
    if (err) {
      res.json({
        status: "100",
        msg: "数据库访问失败!",
        result: ""
      });
    } else {
      if (doc) {
        res.json({
          status: "0",
          msg: "成功",
          result: {
            user: doc
          }
        });
      } else {
        res.json({
          status: "002",
          msg: "失败",
          result: ""
        });
      }
    }
  })
})
router.post('/editUserMsg', function (req, res, next) {
  let loginUserEmail = req.body.loginUserEmail;
  let phoneNum = req.body.phoneNum;
  let userName = req.body.userName;
  User.update({
    loginUserEmail: loginUserEmail
  }, {
    phoneNum: phoneNum,
    userName: userName
  }, (err, doc) => {
    if (err) {
      res.json({
        status: "100",
        msg: "数据库访问失败!",
        result: ""
      });
    } else {
      res.json({
        status: "0",
        msg: "修改成功",
        result: {
          loginUserEmail: loginUserEmail
        }
      });
    }
  })
})
router.post('/getCardList', function (req, res, next) {
  let loginUserEmail = req.body.loginUserEmail;
  Card.findOne({
    loginUserEmail: loginUserEmail
  }, (err, doc) => {
    if (err) {
      res.json({
        status: "100",
        msg: "数据库访问失败!",
        result: ""
      });
    } else {
      if (!doc) {
        res.json({
          status: '0',
          msg: "访问成功",
          result: ""
        })
      } else {
        res.json({
          status: '0',
          msg: "访问成功",
          result: doc.cardList
        })
      }
    }
  })
})

router.post('/removeCard', function (req, res, next) {
  let loginUserEmail = req.body.loginUserEmail;
  let cardId = req.body.cardId;
  Card.update({
    loginUserEmail: loginUserEmail
  }, {
    $pull: {
      cardList: {
        cardid: cardId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({
        status: "100",
        msg: "数据库访问失败",
        result: ""
      });
    } else {
      res.json({
        status: "0",
        msg: "删除成功",
        result: "success"
      });
    }
  })
})

router.post('/editCard', function (req, res, next) {
  let loginUserEmail = req.body.loginUserEmail
  let cardid = req.body.card.cardid;
  let userName = req.body.card.userName;
  let key = getKey(userName);
  let phoneNum = req.body.card.phoneNum;
  let email = req.body.card.email;
  Card.update({
    loginUserEmail: loginUserEmail,
    "cardList.cardid": cardid
  }, {
    "cardList.$.key": key,
    "cardList.$.userName": userName,
    "cardList.$.phoneNum": phoneNum,
    "cardList.$.email": email
  }, (err, doc) => {
    if (err) {
      res.json({
        status: "100",
        msg: "数据库访问失败",
        result: ""
      });
    } else {
      res.json({
        status: "0",
        msg: "更改成功",
        result: "success"
      });
    }
  })
})

router.post('/addCard', function (req, res, next) {
  let loginUserEmail = req.body.loginUserEmail;
  let card = req.body.card;
  card.key = getKey(card.userName);
  Card.findOne({
    loginUserEmail: loginUserEmail
  }, (err, doc) => {
    if (err) {
      res.json({
        status: "100",
        msg: "数据库访问失败!",
        result: ""
      });
    } else {
      if (!doc) {
        let cardList = [];
        cardList.push(card);
        let newCard = new Card({
          loginUserEmail: loginUserEmail,
          cardList: cardList
        });
        newCard.save(err => {
          if (err) {
            res.json({
              status: "100",
              msg: "数据库访问失败!",
              result: ""
            });
          } else {
            res.json({
              status: "0",
              msg: "添加成功",
              result: "success"
            });
          }
        })
      } else {
        Card.update({
          loginUserEmail: loginUserEmail
        }, {
          $push: {
            cardList: card
          }
        }, (err, doc) => {
          if (err) {
            res.json({
              status: "100",
              msg: "数据库访问失败",
              result: ""
            });
          } else {
            res.json({
              status: "0",
              msg: "添加成功",
              result: "success"
            });
          }
        })
      }
    }
  })
})

router.post('/hasNewEvent', function (req, res, next) {})
router.post('/getEventList', function (req, res, next) {
  let loginUserEmail = req.body.loginUserEmail;
  getEventListStart(loginUserEmail)
    .then(result => {
      //还需要设置数据库user newEventId
      res.cookie("newEventId", result.newEventId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 365
      });
      res.json({
        status: "0",
        msg: "成功",
        result: result.userEventList
      });
    })
    .catch(error => {
      console.log(error);
      res.json(error);
    })
})
router.post('/addEvent', function (req, res, next) {
  let item = {
    phoneNum: req.body.phoneNum,
    event: req.body.event
  }
  Event.update({}, {
    $push: {
      eventList: item
    }
  }, (err, doc) => {
    if (err) {
      res.json({
        status: "100",
        msg: "数据库访问失败",
        result: ""
      });
    } else {
      res.json({
        status: "0",
        msg: "添加成功",
        result: "success"
      });
    }
  })
})

function getEventList() {
  return new Promise((resolve, reject) => {
    Event.findOne({}, (err, doc) => {
      if (err) {
        reject({
          status: "100",
          msg: "数据库访问失败!",
          result: ""
        })
      } else {
        resolve(doc);
      }
    })
  })
}

function getCard(loginUserEmail) {
  return new Promise((resolve, reject) => {
    Card.findOne({
      loginUserEmail: loginUserEmail
    }, (err, doc) => {
      if (err) {
        reject({
          status: "100",
          msg: "数据库访问失败!",
          result: ""
        });
      } else {
        if (!doc) {
          reject({
            status: '200',
            msg: "无此用户",
            result: ""
          })
        } else {
          resolve(doc);
        }
      }
    })
  })
}
async function getEventListStart(loginUserEmail) {
  let event = await getEventList();
  let eventList = event.eventList;
  let newEventId = event.newEventId;
  let user = await getCard(loginUserEmail);
  let cardList = user.cardList;
  let temp = [];
  let cardListNum = [];
  let userEventList = [];
  for (let i = 0; i < cardList.length; i++) {
    temp.push(cardList[i].phoneNum);
  }
  cardListNum = Array.from(new Set([...temp]));
  for (let i = 0; i < cardListNum.length; i++) {
    let phoneNum = cardListNum[i];
    for (let j = 0; j < eventList.length; j++) {
      if (eventList[j].phoneNum === phoneNum) {
        userEventList.push(eventList[j]);
      }
    }
  }
  let result = {
    userEventList: userEventList,
    newEventId: newEventId
  }
  return result;
}
module.exports = router;
