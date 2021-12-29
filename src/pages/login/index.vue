<template>
 <div class="login">
<!--  <div style="padding:30px 0px 0px 120px;"><img src="../../assets/image/login-logo.png"/></div>-->
   <div class="content">
     <div class="fs-30 ta-c">欢迎登录</div>
     <div class="fs-12 ta-c mt-30">通过您的用户账号密码登录</div>
     <div class="mt-10"><input type="text" class="login-input" v-model="username" placeholder="请输入您的用户账号"/></div>
     <div class="mt-20"><input type="password" class="login-input" v-model="password" placeholder="请输入登录密码"/></div>
     <div class="erro">{{erro}}</div>
     <div class="login-btn" @click="submit">登录</div>
   </div>
 </div>
</template>

<script>
import {Cookie} from '../../api/util'
export default {
  name: 'index',
  data () {
    return {
      password: '',
      username: '',
      erro: ''
    }
  },
  methods: {
    submit () {
      if (this.username === '') {
        this.erro = '*用户账号不可为空'
      } else if (this.password === '') {
        this.erro = '*密码不可为空'
      } else {
        let param = {
          password: this.password,
          userName: this.username
        }
        this.$axios('post', '/sys/login', param).then((res) => {
          if (res.code === 200) {
            this.erro = ''
            Cookie.set('token', res.data.token)
            sessionStorage.setItem('username', res.data.userName)
            // sessionStorage.setItem('id', res.data.id)
            // sessionStorage.setItem('roleId', res.data.roleId)
            this.$router.push({path: '/'})
          } else {
            this.$message({
              type: 'info',
              message: res.msg
            })
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.login{
  width: 100%;
  height: 100%;
  background-image: url("../../assets/image/login-bg.jpeg");
  background-size: 100% 100%;
  min-width: 1200px;
  overflow: auto;
}
.content{
  position: absolute;
  right: 160px;
  top: 208px;
  background: rgb(38, 38, 184);
}
  .login-input{
    border: none;
    background: #2627b8;
    color: rgba(255,255,255,.6);
    border-bottom: 1px solid rgba(255,255,255,.6);
    width: 410px;
    line-height: 34px;
    height: 34px;
    font-size: 12px;
    outline: none;
    margin-top: 20px;
  }
.login-input::-webkit-input-placeholder {
  color: rgba(255,255,255,.6);
}
  .fs-12{
    font-size: 12px;
    color: rgba(255,255,255,.6);
  }
  .fs-30{
    font-size: 30px;
    letter-spacing:5px;
    color: rgb(255,255,255);
  }
  .login-btn{
    width: 410px;
    line-height: 48px;
    text-align: center;
    background: #005CDB;
    box-shadow: 0 8px 16px 0 rgba(0,92,219,0.18);
    border-radius: 5px;
    color: white;
    margin-top: 60px;
    letter-spacing:10px;
  }
  .erro{
    color: white;margin-top: 20px;
  }
</style>
