<template>
  <div>
    View a game
  </div>
</template>
<script>
  export default {
    data() {
      return {
        game: {}
      }
    },
    methods: {
      onMounted: function () {
        this.fetchData()
      },
      fetchData: function () {
      }
    },
    created() {
      this.$store.commit('SET_TITLE', 'Game');
      this.$store.commit('SET_LAYOUT', 'dashboard')
    }
  }
</script>