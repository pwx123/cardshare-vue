# cardshare

课程需要编写的一个实现名片面对面分享的功能，需求是实现APP，但是用web的方式实现了基本功能。引入了百度地图api，实现了地理位置的基本操作。

前端：vue

后端：mongoDB,express



# 实现的功能

1. 登录/注册
2. 名片列表
3. 名片详情
4. 名片搜索
5. 事件发布
5. 面对面分享名片（输入对应数字接受对应名片）
6. 定位及路线规划

# 项目预览
查看Demo [点这里](http://182.61.16.163/cardshare)


在手机上效果更好，扫一扫体验

![二维码](https://github.com/pwx123/cardshare-vue/raw/master/screenshots/qrcode.png)

# 前端

## 项目依赖

<p align="center">
  <a href="http://sioxas.github.io/">
    <img src="https://img.shields.io/travis/rust-lang/rust.svg" alt="Build">
  </a>
  <a href="http://sioxas.github.io/">
    <img src="https://img.shields.io/badge/vue-v2.5.17-blue.svg" alt="Vue">
  </a>
  <a href="http://sioxas.github.io/">
    <img src="https://img.shields.io/badge/vuex-v3.0.1-blue.svg" alt="Vuex">
  </a>
  <a href="http://sioxas.github.io/">
    <img src="https://img.shields.io/badge/vue--router-v3.0.1-blue.svg" alt="Vue-Router">
  </a>
  <a href="http://sioxas.github.io/">
    <img src="https://img.shields.io/badge/vue--cookie-v1.1.4-blue.svg" alt="Vue-Cookie">
  </a>
  <a href="http://sioxas.github.io/">
    <img src="https://img.shields.io/badge/vue--socket.io-v2.1.1--b-blue.svg" alt="Vue-Socket.io">
  </a>
  <a href="http://sioxas.github.io/">
    <img src="https://img.shields.io/badge/axios-v0.18.0-blue.svg" alt="Axios">
  </a>
  <a href="http://sioxas.github.io/">
    <img src="https://img.shields.io/badge/better--scroll-v1.12.6-blue.svg" alt="Better-Scroll">
  </a>
  <a href="http://sioxas.github.io/">
    <img src="https://img.shields.io/badge/crypto--js-v3.1.9--1-blue.svg" alt="Crypto-Js">
  </a>
  <a href="http://sioxas.github.io/">
    <img src="https://img.shields.io/badge/socket.io--client-v2.1.0-blue.svg" alt="Socket.io-Client">
  </a>
</p>

## 项目运行

``` bash
# 安装依赖
npm install

# 开发预览
npm run dev

# 打包发布
npm run build

# 查看分析报告
npm run build --report
```

# 后端

## 项目依赖

<p align="center">
  <a href="http://sioxas.github.io/">
    <img src="https://img.shields.io/travis/rust-lang/rust.svg" alt="Build">
  </a>
  <a href="http://sioxas.github.io/">
    <img src="https://img.shields.io/badge/express-v4.6.0-blue.svg" alt="Express">
  </a>
  <a href="http://sioxas.github.io/">
    <img src="https://img.shields.io/badge/mongoose-v5.0.17-blue.svg" alt="Mongoose">
  </a>
  <a href="http://sioxas.github.io/">
    <img src="https://img.shields.io/badge/socket.io-v2.1.0-blue.svg" alt="Socket.io">
  </a>
  <a href="http://sioxas.github.io/">
    <img src="https://img.shields.io/badge/pinyin-v2.8.3-blue.svg" alt="Pinyin">
  </a>
</p>

## 项目运行

``` bash
# 进入目录
cd server

# 安装依赖
npm install

# 启动服务器
npm start

```
# 截图


### 首页
![首页](https://github.com/pwx123/cardshare-vue/raw/master/screenshots/index.png)
### 名片
![名片详情](https://github.com/pwx123/cardshare-vue/raw/master/screenshots/card.png)
### 事件
![事件](https://github.com/pwx123/cardshare-vue/raw/master/screenshots/event.png)

### 分享/接受
![分享](https://github.com/pwx123/cardshare-vue/raw/master/screenshots/share.png)
![接受](https://github.com/pwx123/cardshare-vue/raw/master/screenshots/rec.png)
### 搜索
![搜索](https://github.com/pwx123/cardshare-vue/raw/master/screenshots/search.png)
### 登录/注册
![登录](https://github.com/pwx123/cardshare-vue/raw/master/screenshots/login.png)
![注册](https://github.com/pwx123/cardshare-vue/raw/master/screenshots/reg.png)
### 用户
![用户](https://github.com/pwx123/cardshare-vue/raw/master/screenshots/user.png)
### 地理位置
![地理位置](https://github.com/pwx123/cardshare-vue/raw/master/screenshots/location.png)
![地理位置](https://github.com/pwx123/cardshare-vue/raw/master/screenshots/router.png)
