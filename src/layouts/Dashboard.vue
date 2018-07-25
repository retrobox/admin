<template>
    <v-content>
        <div>
            <v-navigation-drawer
                    fixed
                    v-model="drawer"
                    app
            >
                <v-list dense>
                    <v-list-tile :to="nav.indexRoute"
                                 v-for="nav in $store.state.nav" v-bind:data="nav"
                                 v-bind:key="nav.title"
                                 ripple
                                 exact>
                        <v-list-tile-action>
                            <v-icon>{{ nav.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ nav.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>
            <v-toolbar :color="$store.state.current_color" fixed app>
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
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
                <v-btn icon @click.stop="toolbar_dialog_logout = true">
                    <v-icon>exit_to_app</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid transition="fade-transition" class="dashboard-container">
                <v-fade-transition mode="out-in" :key="$store.state.loading">
                  <div v-show="$store.state.loading == false">
                    <router-view ref="router_view" ></router-view>
                  </div>
                </v-fade-transition>

                <v-fade-transition mode="out-in" :key="$store.state.loading">
                    <div v-if="$store.state.loading == true && $store.state.loading_type == 'normal'">
                        <v-container fluid fill-height style="height: 80vh;">
                            <v-layout align-center justify-center>
                                <v-progress-circular indeterminate color="primary"
                                                     size="50"></v-progress-circular>
                            </v-layout>
                        </v-container>
                    </div>
                </v-fade-transition>
            </v-container>
            <v-dialog v-model="toolbar_dialog_logout" max-width="500px">
                <v-card>
                    <v-card-title>
                        Êtes vous sûr de vous déconnecter ?
                    </v-card-title>
                    <v-card-actions>
                        <v-btn color="primary" flat @click.stop="toolbar_dialog_logout = false">Annuler</v-btn>
                        <v-btn color="error" flat @click.stop="logout()">Se déconnecter</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </v-content>
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
        mounted() {
          this.$refs.router_view.onMounted()
        },
        methods: {
            logout: function () {
                this.$cookie.delete('user_token', {domain: process.env.COOKIE_DOMAIN})
                this.$router.push({'name': 'LogoutSuccessful'})
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
