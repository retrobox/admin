<template>
    <v-app :dark="$store.state.is_dark">
        <component v-bind:is="layout" ref="template_child"></component>

        <v-snackbar
                :right="true"
                :bottom="false"
                :top="true"
                :color="$store.state.alert.color"
                :multi-line="true"
                :vertical="true"
                v-model="$store.state.alert.enabled"
        >
            {{ $store.state.alert.text }}
            <v-btn flat @click="$store.commit('DISABLE_ALERT', false)">Fermer</v-btn>
        </v-snackbar>
    </v-app>
</template>

<script>
    import Center from './layouts/Center.vue'
    import Dashboard from './layouts/Dashboard.vue'
    import Default from './layouts/Default.vue'

    export default {
        computed: {
            layout () {
                return this.$store.getters.layout
            }
        },
        components: {
            'center': Center,
            'dashboard': Dashboard,
            'default': Default
        }
    }
</script>
