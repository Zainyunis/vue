<template>
  <h1>内容</h1>
</template>

<script>
export default {
  name: "Content",

  //进入路由之前，相当于过滤器
  beforeRouteEnter:(to,from,next)=>{
    //console.log("进入");
    next();
  },
  //离开路由前
  beforeRouteLeave:(to,from,next)=>{
    //console.log("退出");
    next();
  }
}
</script>

<style scoped>

</style>
