<template>
  <v-main>
    <v-app-bar
      :color="$store.state.current_color"
      app
      clipped-right>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-fade-transition mode="out-in">
        <v-toolbar-title :key="$store.state.title">
          {{ $store.state.title }}
        </v-toolbar-title>
      </v-fade-transition>
      <v-spacer></v-spacer>
      <!--
      <v-btn icon @click.stop="toolbar_dialog_modules = true">
          <v-icon>apps</v-icon>
      </v-btn>-->
      <v-btn v-if="$store.state.loading == true && $store.state.loading_type == 'normal'" icon loading />
      <v-btn icon @click.stop="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon>invert_colors</v-icon>
      </v-btn>
      <v-btn icon @click.stop="toolbar_dialog_logout = true">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      fixed
      v-model="drawer"
      app
    >
      <v-list dense>
        <template v-for="(module, index) in $store.state.nav">
          <v-list-group
            :key="index + '1'"
            v-if="module.subNav !== false"
            :prepend-icon="module.icon"
          >
            <v-list-item-content  slot="activator">
              <v-list-item-title>{{ module.title }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item
              v-for="subItem in module.subNav" v-bind:data="subItem"
              v-bind:key="subItem.id"
              :to="subItem.indexRoute"
              ripple>
              <v-list-item-action>
                <v-icon></v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ subItem.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            :to="module.indexRoute"
            ripple
            exact
            :key="index + '2'"
            v-if="module.subNav === false">
            <v-list-item-action>
              <v-icon>{{ module.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ module.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-container fluid transition="fade-transition" class="dashboard-container">
      <router-view ref="router_view"></router-view>
      <!-- <v-fade-transition mode="out-in" :key="$store.state.loading">
        <div v-show="$store.state.loading == false">
        </div>
      </v-fade-transition> -->
      <!-- <v-fade-transition mode="out-in" :key="$store.state.loading">
        <div v-if="$store.state.loading == true && $store.state.loading_type == 'normal'">
          <v-container fluid fill-height style="height: 80vh;">
            <v-layout align-center justify-center>
              <v-progress-circular indeterminate color="primary"
                size="50"></v-progress-circular>
            </v-layout>
          </v-container>
        </div>
      </v-fade-transition> -->
    </v-container>
    <v-dialog v-model="toolbar_dialog_logout" max-width="500px">
      <v-card>
        <v-card-title>
          Do you really want to logout ?
        </v-card-title>
        <v-card-actions>
          <v-btn color="primary" text @click.stop="toolbar_dialog_logout = false">Cancel</v-btn>
          <v-spacer />
          <v-btn color="error" text @click.stop="logout()">Logout</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>
<script>
export default {
  data: () => ({
    drawer: null,
    toolbar_dialog_modules: false,
    toolbar_dialog_logout: false
  }),
  props: {
    source: String
  },
  watch: {
    '$route' (to, from) {
      setTimeout(() => {
        this.$refs.router_view.onMounted()
      }, 1)
    }
  },
  mounted () {
    this.$refs.router_view.onMounted()
  },
  methods: {
    logout () {
      this.$cookie.delete('user_token', { domain: process.env.COOKIE_DOMAIN })
      this.$router.push({ name: 'LogoutSuccessful' })
    }
  }
}
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: 2s;
}

.fade-enter-active {
  transition-delay: 2s;
}

.fade-enter, .fade-leave-active {
  opacity: 0
}

@media (max-width: 700px) {
}
</style>
