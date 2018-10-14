<template>
  <div id="app">
    <keep-alive include="CardList,Event">
      <router-view/>
    </keep-alive>
    <tab v-if="!$route.meta.fullScreen" />
    <github id="github"/>
  </div>
</template>

<script>
import tab from "@/components/Tab/Tab";
import github from '@/base/github/github';

export default {
  components: {
    tab,
    github
  }
};
</script>

<style lang="stylus">
html, body, #app
  width 100%
  height 100%
#github
  position fixed
  top 0
  right 60px
  z-index 999
</style>
