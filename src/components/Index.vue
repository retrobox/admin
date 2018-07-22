<template>
  <div>
    <div class="error" v-if="$store.state.loading == false">
        Error:
        <span v-if="error == 'not-logged'">
            Not logged in
        </span>
        <span v-if="error == 'not-admin'">
            Not a administrator
        </span>
        <span v-if="error == 'unknown'">
            Unknown, open your console
        </span>
    </div>
  </div>
</template>

<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                error: ""
            }
        },
        mounted() {
            this.$store.commit('SET_LAYOUT', 'center')
        },
        methods: {
            onMounted: function () {
              this.$apitator.get(this, '/account/info', {with_auth: true, alert_on_error: false})
              .then((response) => {
                  if (!response.data.data.user.is_admin) {
                      this.error = 'not-admin'
                  }else{
                    this.$router.push({name: 'Dashboard'})
                  }
              }).catch((error) => {
                console.log(error);
                if (error.response) {
                  if (error.response.status == 401) {
                    this.error = 'not-logged'
                  }
                }else{
                  this.error = 'unknown'
                }
              })
            }
        }
    }
</script>
