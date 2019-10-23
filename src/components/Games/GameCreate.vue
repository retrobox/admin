<template>
  <div>
    Create a game
  </div>
</template>
<script>
  export default {
    data() {
      return {
        
      }
    },
    methods: {
      onMounted: function () {},
      save: function () {
        
      }
    },
    created() {
      this.$store.commit('SET_TITLE', 'Create a game');
      this.$store.commit('SET_LAYOUT', 'dashboard')
    }
  }
</script>