<template>
  <div>
    <v-main>
      <v-container fill-height>
        <v-layout
          justify-center
          align-center
        >
          <v-flex text-xs-center>
            <h1>Déconnexion réussi :)</h1>
            <h3>On espère ne jamais vous revoir</h3>
            <p>lel</p>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </div>
</template>

<script>
export default {
  created () {
    this.$store.commit('SET_LAYOUT', 'center')
  }
}
</script>
