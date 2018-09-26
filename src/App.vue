<template>
  <div id="app">
    <keep-alive include="CardList,Event">
      <router-view/>
    </keep-alive>
    <tab v-if="!$route.meta.fullScreen" />
  </div>
</template>

<script>
import tab from "@/components/Tab/Tab";

export default {
  components: {
    tab
  }
};
</script>

<style lang="stylus">
html, body, #app
  width 100%
  height 100%
</style>
