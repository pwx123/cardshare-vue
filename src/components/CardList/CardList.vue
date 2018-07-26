<template>
  <div class="cardlist">
    <div class="header">
      <span>名片夹</span>
      <i
        class="icon iconfont icon-search"
        @click="showSearch"
      />
    </div>
    <listview
      v-show="loginUserEmail"
      ref="listview"
      :data="cardList"
      :isloading="loading"
      class="list"
      @select="setDetailCard"
    />
    <router-link
      v-show="!loginUserEmail"
      class="loginbtn"
      to="/Login"
    >立刻登陆</router-link>
    <router-link
      v-show="!cardList.length&&loginUserEmail"
      class="addbtn"
      to="/AddCard"
    >添加第一张名片</router-link>
    <btn
      v-show="loginUserEmail"
      class="btn"
    />
  </div>
</template>

<script>
import scroll from "base/scroll/scroll";
import listview from "base/listview/listview";
import Btn from "components/Btn/Btn";

import axios from "axios";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "CardList",
  components: {
    scroll,
    listview,
    Btn
  },
  data() {
    return {
      cardList: [],
      loginUserEmail: "",
      loading: false,
      user: {},
      issearch: false,
      userMsg: ""
    };
  },
  computed: {
    ...mapGetters(["refresh"])
  },
  mounted() {
    if (this.$cookie.get("loginUserEmail")) {
      this._getCardList();
    }
  },
  activated() {
    this.loginUserEmail = this.$cookie.get("loginUserEmail");
    if (this.refresh) {
      this._getCardList();
    }
  },
  methods: {
    _getCardList() {
      this.loading = true;
      axios
        .post("/users/getCardList", {
          loginUserEmail: this.$cookie.get("loginUserEmail")
        })
        .then(res => {
          this.loading = false;
          if (res.data.status === "0") {
            if (res.data.result) {
              this.cardList = this._sortCardList(res.data.result);
              this.loading = false;
              this._getUserMsg();
            }
          } else {
            console.log(res.data);
            this.loading = false;
          }
        });
    },
    _getUserMsg() {
      axios.post("/users/getUserMsg").then(res => {
        if (res.data.status === "0") {
          if (res.data.result) {
            this.user = res.data.result.user;
            localStorage.setItem(
              "userMsg",
              JSON.stringify(res.data.result.user)
            );
            this.cardList.unshift({
              items: [
                {
                  cardid: "self",
                  email: this.user.loginUserEmail,
                  phoneNum: this.user.phoneNum,
                  userName: this.user.userName,
                  // TODO:修改
                  address: "北京"
                }
              ],
              title: "我"
            });
            this.setCardList(this.cardList);
          }
          this.loading = false;
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
        path: "/Search"
      });
    },
    ...mapMutations({
      setCard: "SET_CARD_MUTATION",
      setReFresh: "SET_REFRESH_MUTATION",
      setCardList: "SET_CARDLIST_MUTATION"
    })
  },
  beforeRouteLeave(to, from, next) {
    this.setReFresh(false);
    next();
  },
  beforeRouteEnter(to, from, next) {
    // 解决手机键盘弹起better-sroll失效的问题
    next(vm => {
      vm.$refs.listview.refresh();
    });
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.cardlist
  width 100%

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
      position absolute
      right 15px

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
