<template>
  <div>
    <EventActivity v-if="activeIndex == 1 || true" />
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