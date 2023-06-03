<template>
  <div>
    <Header/>
    <div class="aside_box" style="">
      <Aside/>
      <router-view/>
      <Footer/>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Frame/Header";
import Aside from "@/components/Frame/Aside";
import Footer from "@/components/Frame/Footer";
export default {
  name: "Layout",
  components:{
    Footer,
    Aside,
    Header
  }
}
</script>

<style scoped>

</style>