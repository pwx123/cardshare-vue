<template>
  <transition name="slide">
    <div class="addcard">
      <h1>Add Card</h1>
      <input type="text" class="user" placeholder="用户名" v-model="userName"><br/>
      <input type="text" class="phoneNum" placeholder="电话" v-model="phoneNum"><br/>
      <input type="text" class="email" placeholder="邮箱" v-model="email"><br/>
      <div class="btns">
        <div class="btn cancelbtn" @click="cancel">取消</div>
        <div class="btn addbtn" @click="add">添加</div>
      </div>
      <modal :msg="msg" :mdShow="mdShow" @closeMd="closeMd"></modal>
    </div>
  </transition>
</template>

<script>
import axios from "axios";
import { getCardId } from "common/js/util";
import { mapMutations } from "vuex";
import modal from "base/modal/modal";

export default {
  data() {
    return {
      userName: "",
      phoneNum: "",
      email: "",
      msg: "",
      mdShow: false
    };
  },
  methods: {
    add() {
      if (this.userName.trim() == "" || this.phoneNum.trim() == "") {
        this.msg = "姓名和电话不能为空";
        this.mdShow = true;
        return;
      }
      let card = {
        cardid: getCardId(this.$cookie.get("userName")),
        userName: this.userName,
        phoneNum: this.phoneNum,
        email: this.email,
        key: ""
      };
      axios
        .post("/users/addCart", {
          user: this.$cookie.get("userName"),
          card: card
        })
        .then(res => {
          if (res.data.status == 0) {
            this.setReFresh(true); //重新加载CardList
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
  },
  components: {
    modal
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

