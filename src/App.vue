<template>
  <v-app>
    <component v-bind:is="layout" ref="template_child"></component>

    <v-snackbar
      bottom
      :right="!$vuetify.breakpoint.mobile"
      :vertical="$vuetify.breakpoint.mobile"
      :color="$store.state.alert.color"
      v-model="$store.state.alert.enabled"
      :timeout="3500"
    >
      {{ $store.state.alert.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="$store.commit('DISABLE_ALERT')"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import Center from './layouts/Center.vue'
import Dashboard from './layouts/Dashboard.vue'
import Default from './layouts/Default.vue'

export default {
  created () {
    const preference = window.localStorage.getItem('__retrobox_admin_theme') === 'true'
    this.$vuetify.theme.dark = preference == null ? true : preference
  },
  watch: {
    '$vuetify.theme.dark' (val) {
      window.localStorage.setItem('__retrobox_admin_theme', val)
    }
  },
  computed: {
    layout () {
      return this.$store.getters.layout
    }
  },
  components: {
    center: Center,
    dashboard: Dashboard,
    default: Default
  }
}
</script>
