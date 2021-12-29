<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {}
  }
}
</script>

<style lang="stylus">
html, body, #app {
  height: 100%
  font-size :14px;
  overflow hidden;
  margin:0;
  font-family: PingFangSC-Semibold;
}
</style>
