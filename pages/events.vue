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
}
</script>

<style>
</style>