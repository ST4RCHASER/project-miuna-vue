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
    <el-menu-item index="0" @click="activeIndex = 0; push('/dashboard')">ชื่อแอปๆๆๆๆๆ</el-menu-item>
    <el-menu-item index="1" @click="activeIndex = 1; push('/events')">กิจกรรม</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  methods: {
    push(name){
      this.$router.push(name)
    }
  }
}
</script>

<style>
</style>