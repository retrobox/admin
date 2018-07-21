<template>
  <div class="user">
      dsqdsq
  </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        created() {
            this.$store.commit('SET_TITLE', 'Users')
            this.$store.commit('SET_LAYOUT', 'dashboard')
        }
    }
</script>