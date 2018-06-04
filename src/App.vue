<template>
  <div id="app">
    <keep-alive include="CardList,Event">
      <router-view></router-view>
    </keep-alive>
    <tab></tab>
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

<style lang="stylus" scoped>
</style>

