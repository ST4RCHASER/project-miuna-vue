<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="0" @click="activeIndex = 0; push('/dashboard')"><img class="logo" src="/logo_1.png" /></el-menu-item>
    <el-menu-item index="1" @click="activeIndex = 1; push('/events')"><i class="nav-icon el-icon-s-order"></i>กิจกรรม</el-menu-item>
    <el-submenu style="float: right;" index="2-4">
      <template  slot="title"><i class="nav-icon el-icon-s-custom"></i> {{username}}</template>
      <el-menu-item index="2-4-1" @click="logout()"><i class="nav-icon el-icon-back"></i> ออกจากระบบ</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  methods: {
    push(name){
      this.$router.push(name)
    },
    logout() {
      //Clear all cookie and push to login page
      this.$cookies.remove('token')
      this.$cookies.remove('auth')
      this.$cookies.remove('username')
      this.push('/login')
    }
  },
  data() {
    return {
      username: '',
    }
  },
  mounted() {
    this.username = this.$cookies.get('username')
  },
}
</script>

<style>
.logo{
  width: 20px;
  height: auto;
  justify-self: center;
  text-align: center;
}
.nav-icon {
  margin-top: -4px;
  margin-right: 4px;
  font-size: 16px;
}
</style>