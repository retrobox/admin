'use strict'

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        layout: 'default',
        loading: false,
        _loading: {
          full: false,
          dashboard: false,
          dialog: false
        },
        loading_type: 'normal',
        title: 'No title',
        http_api_error: 0,
        current_module: {},
        is_dark: true,
        router_view_show: true,
        alert: {
            color: '',
            text: '',
            enabled: false
        },
        nav: [
            {
                title: "Dashboard",
                icon: "home",
                indexRoute: { name: "Dashboard" }
            },
            {
                title: "Users",
                icon: "account_circle",
                indexRoute: { name: "Users" }
            },
            {
                title: "Shop",
                icon: "shopping_cart",
                indexRoute: { name: "ShopCategories" }
            }
        ]
    },
    mutations: {
        SET_LAYOUT (state, payload) {
            state.layout = payload
        },

        SET_LOADING (state, payload) {
            state.loading = payload
            if (state.loading_type == 'normal') {
                if (payload){
                    state.router_view_show = false
                }
                if(payload == false){
                    state.router_view_show = true
                }
            }else{
                state.router_view_show = true
            }
        },

        SET_LOADING_TYPE (state, payload) {
            state.loading_type = payload
        },

        SET_TITLE (state, payload) {
            document.title = payload + " - Retrobox's administration web app"
            state.title = payload
        },

        ADD_HTTP_API_ERROR (state) {
            state.http_api_error = state.http_api_error + 1
        },

        SET_HTTP_API_ERROR (state, payload) {
            state.http_api_error = payload
        },

        ADD_ALERT (state, payload) {
            state.alert = {
                color: payload.color,
                text: payload.text,
                enabled: true
            }
        },

        SET_CURRENT_MODULE (state, payload) {
            state.current_module = payload
        },

        DISABLE_ALERT (state, payload) {
            state.alert.enabled = payload
        }
    },
    getters: {
        layout (state) {
            return state.layout
        },
        loading (state) {
            return state.loading
        },
        http_api_error (state) {
            return state.http_api_error
        },
        title (state) {
            return state.title
        },
        modules (state) {
            return state.modules
        }
    },
})
