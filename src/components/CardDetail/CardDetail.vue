<template>
  <transition name="slide">
    <div class="carddetail">
      <div
        ref="header"
        :style="{backgroundColor:color}"
        class="header"
      >
        <div
          ref="picname"
          class="picname"
        >
          <div
            :style="{backgroundColor:color}"
            class="pic"
          >{{ userNameCharAt }}</div>
          <div class="userName">{{ card.userName }}</div>
        </div>
      </div>
      <div
        ref="layer"
        class="bg-layer"
      />
      <scroll
        ref="scrolldetail"
        :listen-scroll="listenScroll"
        :probe-type="probetype"
        class="scrolldetail"
        @scroll="scroll"
      >
        <ul
          ref="scrolldetailul"
          class="scrolldetailul"
        >
          <li>
            <span>姓名</span>
            <span
              v-show="!isEdit"
              class="value"
            >{{ card.userName }}</span>
            <input
              v-show="isEdit"
              v-model="editcard.userName"
              type="text"
              class="edit-input"
            >
          </li>
          <li>
            <span>电话</span>
            <span
              v-show="!isEdit"
              class="value"
            >
              <a :href="'tel:'+card.phoneNum">{{ card.phoneNum }}
                <i class="icon iconfont icon-jisuanqi" />
              </a>
            </span>
            <input
              v-show="isEdit"
              v-model="editcard.phoneNum"
              type="text"
              class="edit-input"
            >
          </li>
          <li>
            <span>邮箱</span>
            <span
              v-show="!isEdit"
              class="value"
            >
              <a :href="'mailto:'+card.email">{{ card.email }}
                <i class="icon iconfont icon-youjianduanxin" />
              </a>
            </span>
            <input
              v-show="isEdit"
              v-model="editcard.email"
              type="text"
              class="edit-input"
            >
          </li>
          <li>
            <span>地址</span>
            <span
              v-show="!isEdit"
              class="value"
            >
              <router-link :to="{path:'/Map',query: {address: card.address}}">{{ card.address }}
                <i class="icon iconfont icon-dingwei" />
              </router-link>
            </span>
            <input
              v-show="isEdit"
              v-model="editcard.address"
              type="text"
              class="edit-input"
            >
          </li>
          <li
            v-show="card.cardid=='self'?false:true"
            class="li-btn"
          >
            <span
              class="edit"
              @click="editOrcancel"
            >{{ isEdit?'取消':'编辑' }}</span>
            <span
              class="delete"
              @click="removeOrsave"
            >{{ isEdit?'保存':'删除' }}</span>
          </li>
          <li class="li-btn">
            <span
              class="share"
              @click="share"
            >分享</span>
          </li>
        </ul>
      </scroll>
      <div
        v-show="canremove"
        class="modalbg"
      >
        <div class="modal">
          <div class="title">确定要删除吗</div>
          <div class="btns">
            <div
              class="btn btncancel"
              @click="cencel"
            >取消</div>
            <div
              class="btn btnsave"
              @click="remove"
            >确定</div>
          </div>
        </div>
      </div>
      <modal
        :msg="msg"
        :md-show="mdShow"
        @closeMd="closeMd"
      />
      <div
        v-show="modalshare"
        class="modalshare"
      >
        <div class="shareContainer">
          <div class="shareItem shareItem-QQ">
            <i class="icon iconfont icon-QQ" />
            <span>分享到QQ</span>
          </div>
          <div class="shareItem shareItem-weixin">
            <i class="icon iconfont icon-weixin" />
            <span>分享到微信</span>
          </div>
          <div class="shareItem">
            <span>
              <router-link to="/Send">面对面分享</router-link>
            </span>
          </div>
          <div class="shareItem">
            <span>更多...</span>
          </div>
          <div class="shareItem shareItem-cancel">
            <span @click="closeShare">取消</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { emailCheck, phoneNumCheck, stringCheck } from 'common/js/util'
import axios from 'axios'
import scroll from 'base/scroll/scroll'
import modal from 'base/modal/modal'

const MIN_SCROLL = 50
const HEADER_HEIGHT = 250

export default {
  components: {
    scroll,
    modal
  },
  data() {
    return {
      scrollY: 0,
      isEdit: false,
      editcard: {},
      slide: 'slide',
      color: '#' + this.$route.query.color,
      canremove: false,
      modalshare: false,
      msg: '',
      mdShow: false
    }
  },
  computed: {
    ...mapGetters(['card']),
    userNameCharAt() {
      if (this.card) {
        return this.card.userName.charAt(0)
      }
    }
  },
  watch: {
    scrollY(newY) {
      if (-newY < HEADER_HEIGHT - MIN_SCROLL && newY < 0) {
        this.$refs.header.style.height = HEADER_HEIGHT + 'px'
        this.$refs.header.style.zIndex = 0
        this.$refs.header.style.transform = `scale(1)`
        this.$refs.layer.style.transform = `translate3d(0,${newY}px,0)`
        this.$refs.picname.style.transform = `translate3d(${newY /
          40 *
          9}px,${newY}px,0)`
      } else if (newY < 0) {
        this.$refs.header.style.height = MIN_SCROLL + 'px'
        this.$refs.header.style.zIndex = 10
        this.$refs.layer.style.transform = `translate3d(0,-190px,0)`
        this.$refs.picname.style.transform = `translate3d(-40px,-190px,0)`
      }
      if (newY > 0) {
        let height = HEADER_HEIGHT + newY
        let delta = height / HEADER_HEIGHT
        this.$refs.header.style.zIndex = 10
        this.$refs.header.style.transform = `scale(${delta})`
        this.$refs.layer.style.transform = `translate3d(0,0,0)`
        this.$refs.picname.style.transform = `translate3d(0,0,0)`
      }
    }
  },
  mounted() {
    this._getStart()
  },
  created() {
    this.listenScroll = true
    this.probetype = 3
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y
    },
    editOrcancel() {
      if (this.isEdit) {
        this.isEdit = false
      } else {
        this.editcard.key = this.card.key
        this.editcard.cardid = this.card.cardid
        this.editcard.userName = this.card.userName
        this.editcard.phoneNum = this.card.phoneNum
        this.editcard.email = this.card.email
        this.editcard.address = this.card.address
        this.isEdit = true
      }
    },
    cencel() {
      this.canremove = false
    },
    share() {
      this.modalshare = true
    },
    closeShare() {
      this.modalshare = false
    },
    remove() {
      axios
        .post('/users/removeCard', {
          loginUserEmail: this.$cookie.get('loginUserEmail'),
          cardId: this.card.cardid
        })
        .then(res => {
          if (res.data.status === '0') {
            this.setReFresh(true) // 重新加载CardList
            this.$router.push({ path: '/CardList' })
          } else {
            console.log(res.data)
          }
        })
    },
    removeOrsave() {
      if (this.isEdit) {
        if (!stringCheck(this.editcard.userName)) {
          this.msg = '姓名不能为空'
          this.mdShow = true
          return
        }
        if (!phoneNumCheck(this.editcard.phoneNum)) {
          this.msg = '手机号码不符合规范'
          this.mdShow = true
          return
        }
        if (!emailCheck(this.editcard.email)) {
          this.msg = '邮箱不符合规范'
          this.mdShow = true
          return
        }
        axios
          .post('/users/editCard', {
            loginUserEmail: this.$cookie.get('loginUserEmail'),
            card: this.editcard
          })
          .then(res => {
            if (res.data.status === '0') {
              this.setReFresh(true) // 重新加载CardList
              this.isEdit = false
              this.setCard(this.editcard)
            } else {
              console.log(res.data)
            }
          })
      } else {
        this.canremove = true
      }
    },
    _getStart() {
      if (!this.card.userName) {
        this.$router.push('/CardList')
        return
      }
      setTimeout(() => {
        this.$refs.scrolldetailul.style.height =
          this.$refs.scrolldetail.$el.offsetHeight + 250 - 50 + 'px'
      }, 20)
    },
    closeMd() {
      this.mdShow = false
    },
    ...mapMutations({
      setCard: 'SET_CARD_MUTATION',
      setReFresh: 'SET_REFRESH_MUTATION'
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.carddetail
  position fixed
  // 从父原则
  z-index 100
  top 0
  left 0
  right 0
  bottom 0
  background-color #eee

  .header
    position fixed
    top 0
    width 100%
    height 250px

    .picname
      position relative
      height 100%
      margin-left 30px

      .pic
        position absolute
        width 35px
        height 35px
        border-radius 17px
        background-color #fff
        top 200px
        left 20px
        font-size 20px
        line-height 35px
        text-align center
        border 1px solid #555
        color #fff

      .userName
        position absolute
        font-size 20px
        color #fff
        top 208px
        left 70px

  .bg-layer
    height 100%
    top 250px
    position relative
    background-color #eee

  .scrolldetail
    position fixed
    top 250px
    bottom 0
    width 100%

    .scrolldetailul
      li
        margin 0 40px
        height 60px
        line-height 60px
        display block
        border-bottom 1px solid #bbb
        padding 0 10px

        .value
          margin-left 40px

          i
            color #666
            float right
            margin-right 20px
            font-size 20px

        .edit-input
          width 160px
          margin-left 40px
          height 30px
          outline none
          font-size 16px
          border-radius 4px
          border 1px solid #aaa
          transition all 0.5s
          padding-left 10px

          &:focus
            border 1px solid $color-theme

      .li-btn
        margin-top 20px
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

        .share
          margin-top -10px
          border 1px solid #333
          width 160px
          border-radius 5px
          height 35px
          line-height 35px
          color #000

  .modalbg
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    background rgba(238, 238, 238, 0.5)
    animation comein 0.5s

    .modal
      position absolute
      top 50%
      left 50%
      width 80%
      transform translate(-50%, -50%)
      background-color #fff
      border-radius 6px
      border 1px solid $color-theme

      .title
        text-align center
        margin 0 20px
        padding 40px 10px
        font-size 20px
        border-bottom 1px solid #aaa

      .btns
        display flex
        justify-content space-around
        margin 15px 0px

        .btn
          width 60px
          height 30px
          font-size 18px
          color #fff
          line-height 30px
          border-radius 5px
          text-align center
          margin 0 auto
          float left
          background-color $color-theme

        .btncancel
          background-color #ec4c5d

  .modalshare
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    z-index 40
    background rgba(238, 238, 238, 0.5)
    animation comein 0.5s
    display flex
    align-items center
    justify-content center

    .shareContainer
      width 200px
      border 1px solid #000
      background-color #fff
      border-radius 10px

      .shareItem
        width 70%
        height 35px
        margin 0 auto
        margin-bottom 20px
        line-height 35px
        text-align center
        border 1px solid #000
        border-radius 10px
        font-size 16px

      .shareItem-QQ
        margin-top 20px

        i
          font-size 20px
          color #206cba

      .shareItem-weixin
        i
          font-size 20px
          color #62b900

      .shareItem-cancel
        background-color #ec4c5d
        color #fff
        width 50%

@keyframes comein
  from
    bottom -500px
    opacity 0.3

  to
    opacity 1

.slide-enter-active, .slide-leave-active
  transition all 0.3s

.slide-enter, .slide-leave-to
  opacity 0
  transform translate3d(100%, 0, 0)
</style>
