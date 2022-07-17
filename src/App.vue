<template>
  <div id="app">
    <!--   <h1>hello</h1>-->
    <!--    <router-link to="/main">首页</router-link>-->
    <!--    <router-link to="/content">内容</router-link>-->
    <!--    页面展示-->
    <router-view></router-view>
  </div>
</template>

<script>
 import Content from "./components/Content";
export default {
  name: 'App',

}
</script>

<style>

</style>
