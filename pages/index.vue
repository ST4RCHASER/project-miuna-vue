<template>
  <Tutorial />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage',
  created: function () {
    if(this.$cookies.get('auth')) {
      this.$router.push('/dashboard')
    }else {
      this.$router.push('/login')
    }
  },
})
</script>
