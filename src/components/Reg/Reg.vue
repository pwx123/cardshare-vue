<template>
  <transition name="slide">
    <div class="reg">
      <h1>CardShare Register</h1>
      <input type="text" class="user" placeholder="用户名" v-model="userName"><br/>
      <input type="password" class="password" placeholder="密码" v-model="userPwd"><br/>
      <input type="password" class="password" placeholder="确认密码" v-model="userPwdRep"><br/>
      <div class="regbtn" @click="reg">注册</div>
      <modal :msg="msg" :mdShow="mdShow" @closeMd="closeMd"></modal>
    </div>
  </transition>
</template>

<script>
import modal from "base/modal/modal";
import axios from "axios";
import MD5 from "crypto-js/md5";

export default {
  data() {
    return {
      userName: "",
      userPwd: "",
      userPwdRep: "",
      msg: "",
      mdShow: false
    };
  },
  methods: {
    reg() {
      if (
        this.userName.trim() == "" ||
        this.userPwd.trim() == "" ||
        this.userPwdRep.trim() == ""
      ) {
        this.msg = "不能为空";
        this.mdShow = true;
        this.userName = "";
        this.userPwd = "";
        this.userPwdRep = "";
      } else if (this.userPwd != this.userPwdRep) {
        this.msg = "两次输入的密码不一致";
        this.mdShow = true;
        this.userPwd = "";
        this.userPwdRep = "";
      } else {
        axios
          .post("/users/reg", {
            userName: this.userName,
            userPwd: MD5(this.userPwd).toString()
          })
          .then(res => {
            if (res.data.status == "0") {
              this.$router.push("/Login");
            } else {
              this.msg = res.data.msg;
              this.mdShow = true;
            }
          });
      }
    },
    closeMd() {
      this.mdShow = false;
    }
  },
  components: {
    modal
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.reg
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  background-color #eee
  z-index 41
  text-align center

  h1
    margin 20% 0 30px 0
    font-size 40px

  .user, .password
    width 60%
    height 40px
    font-size 16px
    margin-top 24px
    padding-left 20px
    border-radius 8px
    box-sizing border-box
    outline 0
    border 1px solid #bfcbd9
    transition 0.5s border-color
    appearance none

    &:focus
      border-color #20a0ff

  .regbtn
    width 140px
    height 35px
    line-height 35px
    margin 0 auto
    color #fff
    border-radius 5px
    transition 0.2s opacity

    &:active
      opacity 0.8

  .regbtn
    margin-top 50px
    background-color $color-theme

.slide-enter-active, .slide-leave-active
  transition all 0.3s

.slide-enter, .slide-leave-to
  opacity 0
  transform translate3d(100%, 0, 0)
</style>

