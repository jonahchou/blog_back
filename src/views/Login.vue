<template>
  <div class="main">
    <div class="login">
      <p>Login</p>
      <input type="text" v-model="form.username" placeholder="用户名">
      <input type="password" v-model="form.password" placeholder="密码" @keyup.enter.native="login">
      <input type="submit" class="btn" :loading="loading" @click="login" value="登  录">
    </div>
  </div>
</template>

<script>
import request from "@/utils/request"
import router from "@/router";
export default {
  name: "Login",
  data() {
    return{
      loading: false,
      form:{
        username: "",
        password: ""
      }
    }
  },
  methods: {
    login() {
      this.loading = true
      request.post('/user/login', this.form).then(res => {
        debugger
        if (res.code == 'success') {
          this.$message.success(res.msg);
          sessionStorage.setItem('Token', res.data.token);
          sessionStorage.setItem("userName", res.data.username);
          router.push({
            path:'/LiuYao'
          });
        }else{
          this.$message.error(res.msg)
        }
      }).catch((err) =>{
        this.$message({
          type:"error",
          message:"登录异常" + err
        })
      }).finally(()=>{
        this.loading = false
      });
    }
  }
}
</script>

<style scoped>
*{
  user-select: none;
  /* 无法选中，整体感更强 */
}
.main{
  height: 100%;
  background: url('../assets/区区咲太.png') no-repeat;
  background-size: cover;
  background-attachment: fixed;
}
.login{
  opacity: 0.8;
  position: absolute;
  top: 50%;
  margin-top: -200px;
  left: 50%;
  margin-left: -200px;
  /* absolute居中的一种方法 */
  background-color: whitesmoke;
  width: 400px;
  height: 400px;
  border-radius: 25px;
  text-align: center;
  padding: 5px 40px;
  box-sizing: border-box;
  /* 这样padding就不会影响大小 */
}

p{
  font-size: 42px;
  font-weight: 600;
}

input{
  background-color: whitesmoke;
  width: 100%;
  height: 48px;
  margin-bottom: 10px;
  border: none;
  border-bottom: 2px solid silver;
  /* 下面的会覆盖上面的步伐 */
  outline: none;
  font-size: 22px;
}

.btn{
  background-color: #59c2c5;
  width: 38%;
  height: 48px;
  border-radius: 8px;
  margin-top: 40px;
  font-size: 28px;
  font-weight: 600;
  color: white;
}
.btn:hover{
  background-color: #59c2a0;
}
</style>