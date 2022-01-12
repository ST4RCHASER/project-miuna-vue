<template>
  <div style="color: black;">
    <h2>Please select a page to view.</h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
    }
  },
  created: function () {
    if (!this.$cookies.get('auth')) {
      this.$router.push('/login')
    }
  },
}
</script>

<style>
</style>