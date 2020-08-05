<template>
  <div>
    <router-view />
  </div>
</template>
<script>
export default {
  data: () => ({
    drawer: null
  }),
  props: {
    source: String
  }
}
</script>
