<template>
  <transition name="slide">
    <div class="login">
      <h1>CardShare Login</h1>
      <input type="text" class="user" placeholder="用户名" v-model="userName"><br/>
      <input type="password" class="password" placeholder="密码" v-model="userPwd"><br/>
      <div class="logbtn" @click="login">登陆</div>
      <div class="line">
        <span></span>
        <b>或</b>
        <span></span>
      </div>
      <router-link tag="div" class="regbtn" to="/Reg">注册</router-link>
      <modal :msg="msg" :mdShow="mdShow" @closeMd="closeMd"></modal>
    </div>
  </transition>
</template>

<script>
import modal from "base/modal/modal";
import axios from "axios";
import MD5 from "crypto-js/md5";
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      userName: "",
      userPwd: "",
      msg: "",
      mdShow: false
    };
  },
  methods: {
    login() {
      if (this.userName.trim() == "" || this.userPwd.trim() == "") {
        this.msg = "不能为空";
        this.mdShow = true;
        this.userName = "";
        this.userPwd = "";
      } else {
        axios
          .post("/users/login", {
            userName: this.userName,
            userPwd: MD5(this.userPwd).toString()
          })
          .then(res => {
            if (res.data.status == "0") {
              this.setReFresh(true);
              this.$router.push("/CardList");
            } else {
              this.msg = res.data.msg;
              this.mdShow = true;
            }
          });
      }
    },
    closeMd() {
      this.mdShow = false;
    },
    ...mapMutations({
      setReFresh: "SET_REFRESH_MUTATION"
    })
  },
  components: {
    modal
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.login
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  background-color #eee
  z-index 30
  text-align center

  h1
    margin 20% 0 30px 0
    font-size 40px

  .line
    height 20px
    margin-top 10px
    color #666
    font-size 12px

    span
      height 100%
      transform translateY(-5px)
      display inline-block
      width 35%
      border-bottom 1px solid #666
      margin 0 5px

  .user, .password
    width 60%
    height 40px
    font-size 16px
    margin-top 20px
    padding-left 20px
    border-radius 8px
    box-sizing border-box
    outline 0
    border 1px solid #bfcbd9
    transition 0.5s border-color
    appearance none

    &:focus
      border-color #20a0ff

  .logbtn, .regbtn
    width 140px
    height 35px
    line-height 35px
    margin 0 auto
    color #fff
    border-radius 5px
    transition all 0.2s

    &:active
      opacity 0.6

  .logbtn
    margin-top 50px
    background-color $color-theme

  .regbtn
    margin-top 20px
    background-color #999

.slide-enter-active, .slide-leave-active
  transition all 0.5s

.slide-enter, .slide-leave-to
  opacity 0
  transform translate3d(100%, 0, 0)
</style>

