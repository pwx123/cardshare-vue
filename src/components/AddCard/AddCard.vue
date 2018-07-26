<template>
  <transition name="slide">
    <div class="addcard">
      <h1>Add Card</h1>
      <input
        v-model="userName"
        type="text"
        class="user"
        placeholder="用户名"
      ><br>
      <input
        v-model="phoneNum"
        type="text"
        class="phoneNum"
        placeholder="电话"
      ><br>
      <input
        v-model="email"
        type="text"
        class="email"
        placeholder="邮箱"
      ><br>
      <input
        v-model="address"
        type="text"
        class="email"
        placeholder="地址"
      ><br>
      <div class="btns">
        <div
          class="btn cancelbtn"
          @click="cancel"
        >取消</div>
        <div
          class="btn addbtn"
          @click="add"
        >添加</div>
      </div>
      <modal
        :msg="msg"
        :md-show="mdShow"
        @closeMd="closeMd"
      />
    </div>
  </transition>
</template>

<script>
import axios from "axios";
import {
  getCardId,
  emailCheck,
  phoneNumCheck,
  stringCheck
} from "common/js/util";
import { mapMutations } from "vuex";
import modal from "base/modal/modal";

export default {
  components: {
    modal
  },
  data() {
    return {
      userName: "",
      phoneNum: "",
      email: "",
      address: "",
      msg: "",
      mdShow: false
    };
  },
  methods: {
    add() {
      if (!stringCheck(this.userName)) {
        this.msg = "姓名不能为空";
        this.mdShow = true;
        return;
      }
      if (!phoneNumCheck(this.phoneNum)) {
        this.msg = "手机号码不符合规范";
        this.mdShow = true;
        return;
      }
      if (!emailCheck(this.email)) {
        this.msg = "邮箱不符合规范";
        this.mdShow = true;
        return;
      }
      if (!this.address.length) {
        this.msg = "地址不能为空";
        this.mdShow = true;
        return;
      }
      let card = {
        cardid: getCardId(this.$cookie.get("loginUserEmail")),
        userName: this.userName,
        phoneNum: this.phoneNum,
        email: this.email,
        address: this.address,
        key: ""
      };
      axios
        .post("/users/addCard", {
          loginUserEmail: this.$cookie.get("loginUserEmail"),
          card: card
        })
        .then(res => {
          if (res.data.status === "0") {
            this.setReFresh(true); // 重新加载CardList
            this.$router.push("/CardList");
          } else {
            console.log(res.data);
          }
        });
    },
    cancel() {
      this.$router.push({ path: "/CardList" });
    },
    closeMd() {
      this.mdShow = false;
    },
    ...mapMutations({
      setReFresh: "SET_REFRESH_MUTATION"
    })
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.addcard
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

  .user, .phoneNum, .email
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

  .btns
    display flex
    justify-content space-around

    .btn
      height 35px
      width 120px
      line-height 35px
      color #fff
      border-radius 5px
      transition 0.2s opacity
      margin-top 30px
      background-color $color-theme

      &:active
        opacity 0.8

    .cancelbtn
      background-color #ec4c5d

.slide-enter-active, .slide-leave-active
  transition all 0.3s

.slide-enter, .slide-leave-to
  opacity 0
  transform translate3d(100%, 0, 0)
</style>
