<template>
  <div>
    rendered
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  mounted () {
    this.$store.commit('SET_LAYOUT', 'center')
  },
  methods: {
    hello () {
    }
  },
  created () {
  }
}
</script>
