<template>
  <v-main>
    <v-container fill-height v-if="$store.state.loading" class="d-flex justify-center align-center">
      <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
    </v-container>
    <v-container fluid fill-height v-show="$store.state.loading == false">
      <v-layout align-center justify-center>
        <router-view ref="router_view"/>
      </v-layout>
    </v-container>
  </v-main>
</template>
<script>
export default {
  data: () => ({
    drawer: null
  }),
  props: {
    source: String
  },
  mounted () {
    this.$refs.router_view.onMounted()
  }
}
</script>
