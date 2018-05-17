<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" key="list"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" key="other">
    </router-view>
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

