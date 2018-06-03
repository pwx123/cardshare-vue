<template>
  <div class="cardlist">
    <div class="header">
      <span>名片夹</span>
      <i class="icon iconfont icon-search" @click="showSearch"></i>
    </div>
    <listview :data="cardList" :loading="loading" @select="setDetailCard" v-show="loginUserEmail" class="list" ref="listview">
    </listview>
    <router-link class="loginbtn" v-show="!loginUserEmail" to="/Login">立刻登陆</router-link>
    <router-link class="addbtn" v-show="!cardList.length&&loginUserEmail" to="/AddCard">添加第一张名片</router-link>
    <btn class="btn" v-show="loginUserEmail"></btn>
  </div>
</template>

<script>
import scroll from "base/scroll/scroll";
import listview from "base/listview/listview";
import loading from "base/loading/loading";
import Btn from "components/Btn/Btn";

import axios from "axios";
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      cardList: [],
      loginUserEmail: "",
      loading: true,
      user: {},
      issearch: false
    };
  },
  mounted() {
    if (this.$cookie.get("loginUserEmail")) {
      this.loginUserEmail = this.$cookie.get("loginUserEmail");
      this._getCardList();
      this._getUserMsg();
    }
  },
  methods: {
    _getCardList() {
      axios
        .post("/users/getCardList", {
          loginUserEmail: this.$cookie.get("loginUserEmail")
        })
        .then(res => {
          if (res.data.status == 0) {
            if (res.data.result) {
              this.cardList = this._sortCardList(res.data.result);
            }
            this.loading = false;
          } else {
            console.log(res.data);
            this.loading = false;
          }
        });
    },
    _getUserMsg() {
      axios.post("/users/getUserMsg").then(res => {
        if (res.data.status == 0) {
          if (res.data.result) {
            this.user = res.data.result;
          }
        } else {
          console.log(res.data);
        }
      });
    },
    _sortCardList(list) {
      let map = {};
      list.forEach((item, index) => {
        const key = item.key;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(item);
      });
      let res = [];
      for (let key in map) {
        let val = map[key];
        res.push(val);
      }
      for (let i = 0; i < res.length; i++) {
        res[i].items.sort((a, b) => {
          return a.userName.localeCompare(b.userName, "zh");
        });
      }
      res.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return res;
    },
    setDetailCard(card, color) {
      this.setCard(card);
      this.$router.push({
        path: "/CardDetail",
        query: {
          color: color
        }
      });
    },
    showSearch() {
      this.$router.push({
        path: "/Search",
        query: { cardList: this.cardList }
      });
    },
    ...mapMutations({
      setCard: "SET_CARD_MUTATION",
      setReFresh: "SET_REFRESH_MUTATION"
    })
  },
  computed: {
    ...mapGetters(["refresh"])
  },
  activated() {
    this.loginUserEmail = this.$cookie.get("loginUserEmail");
    if (this.refresh) {
      this._getCardList();
    }
  },
  beforeRouteLeave(to, from, next) {
    this.setReFresh(false);
    next();
  },
  beforeRouteEnter(to, from, next) {
    //解决手机键盘弹起better-sroll失效的问题
    if (from.path == "/Search" || from.path == "/CardDetail") {
      next(vm => {
        vm.$refs.listview.refresh();
      });
    }
    next();
  },
  components: {
    scroll,
    loading,
    listview,
    Btn
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.cardlist
  width 100%

  .header
    background-color $color-theme
    width 100%
    height 44px
    line-height 44px
    padding-left 15px
    color #fff
    font-size 18px
    border-bottom 1px solid #fff
    position relative

    i
      font-weight bold
      position absolute
      right 30px

  .list
    position fixed
    top 45px
    bottom 51px
    left 0
    right 0

  .loginbtn
    position absolute
    width 110px
    height 40px
    line-height 40px
    text-align center
    font-weight 540
    font-size 18px
    border-radius 5px
    color #fff
    background-color $color-theme
    left 50%
    top 50%
    transform translate(-50%, -50%)

  .addbtn
    position absolute
    width 210px
    height 40px
    line-height 40px
    text-align center
    font-weight 540
    font-size 18px
    border-radius 5px
    color #fff
    background-color $color-theme
    left 50%
    top 50%
    transform translate(-50%, -50%)

  .btn
    position absolute
    right 20px
    bottom 80px
</style>

