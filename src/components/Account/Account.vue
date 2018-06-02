<template>
  <div class="account">
    <div class="header" @click="login">
      <div class="name">{{name}}</div>
      <i class="icon iconfont icon-jiantouyou"></i>
    </div>
    <div class="list setting first">
      <i class="icon iconfont icon-setting"></i>
      <span>设置</span>
    </div>
    <div class="list quit" v-show="isshow" @click="quit">
      <i class="icon iconfont icon-tuichu"></i>
      <span>退出登陆</span>
    </div>
    <div class="list about">
      <i class="icon iconfont icon-about"></i>
      <span>关于</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    login() {
      if (!this.isshow) {
        this.$router.push({ path: "/Login" });
      } else {
        console.log(this.name);
      }
    },
    quit() {
      this.$cookie.delete("loginUserEmail");
      this.$router.push({ path: "/Login" });
    }
  },
  computed: {
    name() {
      return this.$cookie.get("loginUserEmail")
        ? this.$cookie.get("loginUserEmail")
        : "登陆/注册";
    },
    isshow() {
      return this.$cookie.get("loginUserEmail") ? true : false;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.header
  width 100%
  height 100px
  position relative
  background-color $color-theme

  .name
    color #fff
    line-height 100px
    margin-left 30px
    font-size 20px
    font-weight 500

  i
    position absolute
    right 20px
    font-size 20px
    top 40px
    color #fff

.list
  height 38px
  line-height 28px
  border-bottom 1px solid #aaa
  margin 10px 20px 0px 20px
  padding 0 20px 0 20px

  span
    margin-left 10px

.first
  padding-top 10px
  border-top 1px solid #aaa
</style>

