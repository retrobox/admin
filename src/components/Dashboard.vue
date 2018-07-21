<template>
  <div class="arrow-container">
      <v-icon class="arrow-back-icon">arrow_back</v-icon> Allez on choisit vite une ressource...
  </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        methods: {
            onMounted: function () {
            }
        },
        created() {
            this.$store.commit('SET_TITLE', 'Dashboard')
            this.$store.commit('SET_LAYOUT', 'dashboard')
        }
    }
</script>

<style>
.arrow-container {
    display: flex;
    align-items: center
}
.arrow-back-icon {
    margin-right: 15px;
}
</style>
