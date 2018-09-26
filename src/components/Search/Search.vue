<template>
  <transition name="slide">
    <div class="search">
      <div class="searchInput">
        <input
          v-model="search"
          type="text"
          @keyup="searchCard"
        >
      </div>
      <scroll
        :data="searchList"
        class="searchList"
      >
        <ul class="cardList">
          <div
            v-show="!searchList.length"
            class="noSearch"
          >暂无结果</div>
          <li
            v-for="(item,index) in searchList"
            :key="index"
            class="card"
            @click="setDetailCard(item,index)"
          >
            <div class="items">
              <div class="item username">
                <span>姓名:</span>
                <span v-html="item.userName" />
              </div>
              <div class="item phoneNum">
                <span>电话:</span>
                <span v-html="item.phoneNum" />
              </div>
              <div class="item email">
                <span>邮箱:</span>
                <span v-html="item.email" />
              </div>
              <div class="item address">
                <span>地址:</span>
                <span v-html="item.address" />
              </div>
            </div>
          </li>
        </ul>
      </scroll>
      <div class="cancelSearch">
        <router-link
          to="/CardList"
          tag="div"
          class="cancel"
        >取消</router-link>
      </div>
    </div>
  </transition>

</template>

<script>
import scroll from "base/scroll/scroll";
import { mapGetters, mapMutations } from "vuex";
export default {
  components: {
    scroll
  },
  data() {
    return {
      searchList: [],
      search: "",
      timeOut: undefined,
      colorList: [
        "e91e63",
        "74cb58",
        "42a5f5",
        "2979ff",
        "4caf50",
        "ffeb3b",
        "cddc39"
      ]
    };
  },
  computed: {
    ...mapGetters({ dataList: "cardList" })
  },
  mounted() {
    if (!this.dataList[0].items) {
      // 刷新dataList数据丢失 返回CardList
      this.$router.push({ path: "/CardList" });
    }
  },
  methods: {
    searchCard() {
      clearTimeout(this.timeOut);
      if (this.search.length === 0) {
        this.searchList = [];
        return;
      }
      this.timeOut = setTimeout(() => {
        this._searchList(this.dataList);
      }, 400);
    },
    setDetailCard(card, index) {
      var newcard = this._getCard(card.cardid);
      this.setCard(newcard);
      this.$router.push({
        path: "/CardDetail",
        query: {
          color: this.colorList[index % 7]
        }
      });
    },
    _getCard(cardId) {
      for (let i = 0; i < this.dataList.length; i++) {
        for (let j = 0; j < this.dataList[i].items.length; j++) {
          if (this.dataList[i].items[j]["cardid"] === cardId) {
            return this.dataList[i].items[j];
          }
        }
      }
    },
    _searchList(dataList) {
      this.searchList = [];
      for (let i = 0; i < dataList.length; i++) {
        for (let j = 0; j < dataList[i].items.length; j++) {
          var flag = 0;
          var searchCard = Object.assign({}, dataList[i].items[j]);
          var userName = this._setIndexOf(
            dataList[i].items[j]["userName"],
            this.search
          );

          var phoneNum = this._setIndexOf(
            dataList[i].items[j]["phoneNum"],
            this.search
          );

          var email = this._setIndexOf(
            dataList[i].items[j]["email"],
            this.search
          );
          var address = this._setIndexOf(
            dataList[i].items[j]["address"],
            this.search
          );
          if (userName) {
            searchCard["userName"] = userName;
            flag = 1;
          }
          if (phoneNum) {
            searchCard["phoneNum"] = phoneNum;
            flag = 1;
          }
          if (email) {
            searchCard["email"] = email;
            flag = 1;
          }
          if (address) {
            searchCard["address"] = address;
            flag = 1;
          }
          if (flag) {
            this.searchList.push(searchCard);
          }
          searchCard = null;
        }
      }
    },
    _setIndexOf(value, search) {
      var indexs = [];
      var flag = 0;
      var index = 0;
      while (flag !== -1) {
        flag = value.indexOf(search, index);
        if (flag !== -1) {
          indexs.push(flag);
        }
        index = flag + search.length;
        if (flag !== -1) {
          indexs.push(index);
        }
      }
      if (indexs.length === 0) {
        return false;
      } else {
        return this._setHighLight(value, indexs);
      }
    },
    _setHighLight(value, indexs) {
      var leftStr = "<span style='color:red'>";
      var rightStr = "</span>";
      var valueArr = [...value];
      var count = 0;
      for (let i = 0; i < indexs.length; i += 2) {
        valueArr.splice(indexs[i] + count++, 0, leftStr);
        valueArr.splice(indexs[i + 1] + count++, 0, rightStr);
      }
      return valueArr.join("");
    },
    ...mapMutations({
      setCard: "SET_CARD_MUTATION"
    })
  }
};
</script>

<style lang="stylus" scoped>
.search
  position fixed
  // 从父原则
  z-index 100
  top 0
  left 0
  right 0
  bottom 0
  background-color #eee

  .cancelSearch
    position absolute
    height 36px
    line-height 36px
    text-align center
    bottom 20px
    width 100%

    .cancel
      background-color #ec4c5d
      margin 0 auto
      border-radius 5px
      width 35%
      font-size 18px
      color #fff

  .searchInput
    width 90%
    margin 0 auto
    margin-top 5px
    height 40px

    input
      width 100%
      height 100%
      font-size 16px
      padding 0 20px
      border-radius 4px
      box-sizing border-box
      outline 0
      border 1px solid #bfcbd9
      transition 0.5s border-color
      appearance none

      &:focus
        border-color #20a0ff

  .searchList
    position fixed
    top 50px
    left 0
    right 0
    bottom 70px
    width 100%
    overflow hidden

    .noSearch
      height 30px
      text-align center
      line-height 30px

    .cardList
      width 90%
      margin 0 auto
      border-radius 4px
      background-color #fff
      border 1px solid #eee

    .items
      margin 10px 10px
      border-bottom 1px solid #999

      .item
        margin 5px 10px

      .address
        margin-bottom 10px

.slide-enter-active, .slide-leave-active
  transition all 0.3s

.slide-enter, .slide-leave-to
  opacity 0
  transform translate3d(100%, 0, 0)
</style>
