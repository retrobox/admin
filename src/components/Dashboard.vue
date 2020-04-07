<template>
  <div>
    <div class="arrow-container">
      <v-icon class="arrow-back-icon">arrow_back</v-icon> Allez on choisit vite une ressource...
    </div>
    <div class="mt-3">
      <v-layout justify-center>
        <v-btn
          :loading="generateCacheLoading"
          :disabled="generateCacheLoading"
          color="primary"
          class="white--text"
          @click="generateCache"
        >
          <v-icon left dark>autorenew</v-icon>
          Generate shop cache
        </v-btn>
      </v-layout>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      icons: [],
      generateCacheLoading: false
    }
  },
  methods: {
    onMounted: function () {

    },
    generateCache: function () {
      this.generateCacheLoading = true
      this.$apitator
        .get(this, '/cache/shop/generate', {with_auth: true, alert_on_error: false, loading: false})
        .then(response => {
          this.generateCacheLoading = false
        })
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
