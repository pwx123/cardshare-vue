var express = require('express');
var router = express.Router();
var User = require('../models/users')
var Card = require('../models/cards')
var getKey = require('./../utils/util')

/* GET users listing. */
router.post('/login', function (req, res, next) {
  let param = {
    userName: req.body.userName,
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
        res.cookie("userName", doc.userName, {
          path: "/",
          maxAge: 1000 * 60 * 60
        });
        res.json({
          status: "0",
          msg: "登陆成功",
          result: {
            userName: doc.userName
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
  let userName = req.body.userName;
  let userPwd = req.body.userPwd;
  let newUser = new User({
    userName: userName,
    userPwd: userPwd
  });
  User.find({
    userName: userName
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
                userName: userName
              }
            });
          }
        })
      }
    }
  })
})

router.post('/getCardList', function (req, res, next) {
  let userName = req.body.userName;
  Card.findOne({
    user: userName
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
  let user = req.body.userName;
  let cardId = req.body.cardId;
  Card.update({
    user: user
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
  let user = req.body.userName
  let cardid = req.body.card.cardid;
  let userName = req.body.card.userName;
  let key = getKey(userName);
  let phoneNum = req.body.card.phoneNum;
  let email = req.body.card.email;
  Card.update({
    user: user,
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

router.post('/addCart', function (req, res, next) {
  let user = req.body.user;
  let card = req.body.card;
  card.key = getKey(card.userName);
  Card.findOne({
    user: user
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
          user: user,
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
          user: user
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
module.exports = router;
