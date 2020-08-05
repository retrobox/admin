<template>
<div class="games">
  <v-layout align-center justify-end row fill-height>
    <v-btn icon @click="fetchData()">
      <v-icon>refresh</v-icon>
    </v-btn>
  </v-layout>
  <!-- Show -->
</div>
</template>

<script>
export default {
  data: () => ({
    games: [],
    headers: [
      {
        text: 'Avatar',
        align: 'left',
        sortable: false,
        value: 'last_avatar'
      },
      {
        text: 'Username',
        align: 'left',
        sortable: false,
        value: 'last_username'
      },
      {
        text: 'Email',
        align: 'left',
        sortable: false,
        value: 'last_email'
      },
      { text: 'Actions', value: 'id', sortable: false, align: 'right' }
    ]
  }),
  methods: {
    onMounted () {
      this.fetchData()
    },
    fetchData () {
      this.$store.commit('SET_LOADING', true)
      // this.$apitator.query(this, {
      //   body: {
      //     query: `query{getMa{id,last_username,last_email,last_avatar,is_admin}}`
      //   }
      // }).then((response) => {
      //   this.users = response.data.data.getManyUsers
      // })
    }
  },
  created () {
    this.$store.commit('SET_TITLE', 'Games')
    this.$store.commit('SET_LAYOUT', 'dashboard')
  }
}
</script>
