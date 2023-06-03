<template>
  <div style="overflow-x: hidden">
    <el-menu
        style="
        width: calc(100vw * 0.15);
        height: calc(100vh - 50px);
        color: #ffffff;
        background-color: #2b3d4d;
        border-right: 0px;
        text-align: center
      "
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        active-text-color="#f2f3f4"
        text-color="#c1c6ca"
        active-background-color="#3fa0fa !important"
        background-color="#2b3d4d"
        @select="handleSelect"
    >
      <el-menu-item index="/LiuYao" style="display: flex;justify-content: space-around;font-size: large">
        六爻
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name:"Aside",
  methods:{
    handleSelect(key, keyPath) {
      console.log(this.$route.path)
      // this.$router.push({
      //   path: "/BlackPage",
      //   query: {
      //     lastRoutePath: key,
      //   },
      // });
    },
  }
}
</script>

<style scoped>

</style>