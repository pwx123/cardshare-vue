<template>
  <transition name="slide">
    <div class="usermsg">
      <div class="header">
        <i
          class="icon iconfont icon-back"
          @click="back"
        />
        <span>个人信息</span>
      </div>
      <div class="list setting first">
        <span class="item">姓名</span>
        <span v-show="!isEdit">{{ user.userName?user.userName:"空" }}</span>
        <input
          v-show="isEdit"
          v-model="edituser.userName"
          type="text"
          class="edit-input"
        >
      </div>
      <div class="list quit">
        <span class="item">邮箱</span>
        <span v-show="!isEdit">{{ user.loginUserEmail }}</span>
        <input
          v-show="isEdit"
          v-model="edituser.loginUserEmail"
          type="text"
          class="edit-input"
          disabled
        >
      </div>
      <div class="list about">
        <span class="item">电话</span>
        <span v-show="!isEdit">{{ user.phoneNum?user.phoneNum:"空" }}</span>
        <input
          v-show="isEdit"
          v-model="edituser.phoneNum"
          type="text"
          class="edit-input"
        >
      </div>
      <div class="btn">
        <span
          class="edit"
          @click="editOrcancel"
        >{{ isEdit?'取消':'修改' }}</span>
        <span
          v-show="isEdit"
          class="delete"
          @click="removeOrsave"
        >{{ isEdit?'保存':'删除' }}</span>
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
import axios from 'axios'
import { phoneNumCheck, stringCheck } from 'common/js/util'
import modal from 'base/modal/modal'
export default {
  components: {
    modal
  },
  data() {
    return {
      user: {},
      edituser: {},
      isEdit: false,
      msg: '',
      mdShow: false
    }
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('userMsg'))
    this.edituser = Object.assign({}, this.user)
    if (!this.user.loginUserEmail) {
      this.back()
    }
  },
  methods: {
    editOrcancel() {
      if (this.isEdit) {
        this.isEdit = false
      } else {
        this.isEdit = true
      }
    },
    removeOrsave() {
      if (!stringCheck(this.edituser.userName)) {
        this.msg = '姓名不能为空'
        this.mdShow = true
        return
      }
      if (!phoneNumCheck(this.edituser.phoneNum)) {
        this.msg = '手机号码不符合规范'
        this.mdShow = true
        return
      }
      axios
        .post('/users/editUserMsg', {
          loginUserEmail: this.$cookie.get('loginUserEmail'),
          phoneNum: this.edituser.phoneNum,
          userName: this.edituser.userName
        })
        .then(res => {
          if (res.data.status === '0') {
            this.isEdit = false
            this.user = this.edituser
            localStorage.setItem('userMsg', JSON.stringify(this.edituser))
          } else {
            console.log(res.data)
          }
        })
    },
    closeMd() {
      this.mdShow = false
    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.usermsg
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  background-color #eee
  z-index 41

  .header
    background-color $color-theme
    width 100%
    height 44px
    line-height 44px
    padding-left 15px
    color #fff
    font-size 18px
    border-bottom 1px solid #eee
    position relative

    i
      font-weight bold
      font-size 18px
      padding-right 10px

  .list
    height 38px
    line-height 28px
    border-bottom 1px solid #aaa
    margin 10px 20px 0px 20px
    padding 0 20px 0 20px

    span
      margin-left 10px

    .edit-input
      width 180px
      margin-left 30px
      height 30px
      outline none
      font-size 16px
      border-radius 4px
      border 1px solid #aaa
      transition all 0.5s
      padding-left 10px

      &:focus
        border 1px solid $color-theme

  .first
    padding-top 10px
    border-top 1px solid #aaa

  .btn
    width 80%
    margin 0 auto
    margin-top 40px
    border none
    display flex
    justify-content space-around
    text-align center
    font-size 18px
    align-items center

    .edit
      border 1px solid #333
      color #fff
      width 80px
      border-radius 5px
      height 35px
      line-height 35px
      background-color #444
      transition all 0.5s

    .delete
      border 1px solid #333
      width 80px
      border-radius 5px
      color #fff
      height 35px
      line-height 35px
      background-color #ec4c5d
      transition all 0.5s

.slide-enter-active, .slide-leave-active
  transition all 0.3s

.slide-enter, .slide-leave-to
  opacity 0
  transform translate3d(100%, 0, 0)
</style>
