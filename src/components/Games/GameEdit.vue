<template>
  <div>
    Edit a game
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
        this.fetchData();
      },
      fetchData: function () {

      },
      save: function () {
        
      }
    },
    created() {
      this.$store.commit('SET_TITLE', 'Create a game');
      this.$store.commit('SET_LAYOUT', 'dashboard')
    }
  }
</script>