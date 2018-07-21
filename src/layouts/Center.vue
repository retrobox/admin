<template>
    <v-content>
        <v-container fill-height v-if="$store.state.loading">
            <v-layout
                justify-center
                align-center
            >
                <v-flex text-xs-center>
                    <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
                </v-flex>
            </v-layout>
        </v-container>
        <v-container fluid fill-height v-show="$store.state.loading == false">
            <v-layout align-center justify-center>
                <router-view ref="router_view"/>
            </v-layout>
        </v-container>
    </v-content>
</template>
<script>
    export default {
        data: () => ({
            drawer: null
        }),
        props: {
            source: String
        },
        mounted() {
            this.$refs.router_view.onMounted()
        }
    }
</script>
