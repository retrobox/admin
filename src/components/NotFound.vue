<template>
  <div class="d-flex justify-center align-center flex-column">
    <h1>404</h1>
    <h3>Nan mais please</h3>
  </div>
</template>

<script>
export default {
  created () {
    this.$store.commit('SET_LAYOUT', 'center')
    this.$store.commit('SET_TITLE', 'Page not found')
  },
  methods: {
    onMounted () {}
  }
}
</script>
