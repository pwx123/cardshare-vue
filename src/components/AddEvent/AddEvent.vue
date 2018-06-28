<template>
  <transition name="slide">
    <div class="usermsg">
      <div class="header">
        <i
          class="icon iconfont icon-back"
          @click="back"
        />
        <span>添加事件</span>
      </div>
      <div class="list">
        <span class="item">标题</span>
        <input
          v-model="event.title"
          type="text"
          class="edit-input"
        >
      </div>
      <div class="list detail">
        <span class="item">详情</span>
        <textarea
          v-model="event.detail"
          type="text"
          class="edit-input detail-input"
        />
      </div>
      <div class="btn">
        <span
          class="edit"
          @click="cancel"
        >取消</span>
        <span
          class="delete"
          @click="save"
        >保存</span>
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
import { mapMutations } from 'vuex'
import { stringCheck } from 'common/js/util'
import modal from 'base/modal/modal'
export default {
  components: {
    modal
  },
  data() {
    return {
      event: {
        time: '',
        title: '',
        detail: ''
      },
      isEdit: false,
      msg: '',
      mdShow: false,
      userMsg: ''
    }
  },
  mounted() {
    this.userMsg = JSON.parse(localStorage.getItem('userMsg'))
  },
  methods: {
    cancel() {
      this.$router.go(-1)
    },
    save() {
      if (!stringCheck(this.event.title) || !stringCheck(this.event.detail)) {
        this.msg = '信息不能为空'
        this.mdShow = true
        return
      }
      let data = new Date()
      this.event.time = data.toJSON()
      axios
        .post('/users/addEvent', {
          phoneNum: this.userMsg.phoneNum,
          event: this.event
        })
        .then(res => {
          if (res.data.status === '0') {
            this.setReFresh(true) // 重新加载
            this.$router.push({ path: '/Event' })
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
    },
    ...mapMutations({
      setReFresh: 'SET_REFRESH_MUTATION'
    })
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

  .detail
    height 180px
    position relative

    span
      display inline-block
      position absolute

    .detail-input
      margin-left 75px
      resize none
      height 160px
      font-size 16px

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
