<template>
  <div>
    <v-content>
      <v-container fill-height>
        <v-layout
                justify-center
                align-center
        >
          <v-flex text-xs-center>
            <h1>404</h1>
            <h3>Nan mais please</h3>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>
<script>
export default {
  created(){
    this.$store.commit('SET_LAYOUT', 'center')
  }
}
</script>
