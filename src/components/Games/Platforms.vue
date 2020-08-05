<template>
  <div class="platforms">
    <v-data-table :headers="headers" :items="platforms" hide-default-footer class="elevation-1">
      <!-- <td>{{ props.item.name }}</td>
        <td>{{ props.item.short }}</td>
        <td>{{ props.item.manufacturer }}</td>
        <td>{{ props.item.released_at }}</td> -->
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer />
          <v-btn icon color="info" @click="fetchData()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn icon color="add" @click="$router.push({name: 'GamePlatformCreate'})">
            <v-icon>add</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          icon small color="info"
          @click="$router.push({ name: 'GamePlatformEdit', params: { id: item.id } })"
        >
          <v-icon small>edit</v-icon>
        </v-btn>
        <v-btn
          icon small color="error"
          @click="toDeletePlatform = item; deletePlatformDialog = true"
        >
          <v-icon small>delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="deletePlatformDialog" max-width="500px">
      <v-card>
        <v-card-title>Really want to delete "{{ toDeletePlatform.name }}" ?</v-card-title>
        <v-card-actions>
          <v-btn color="primary" text @click.stop="deletePlatformDialog = false">Close</v-btn>
          <v-spacer />
          <v-btn color="red" text @click.stop="deletePlatform()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      platforms: [],
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {
          text: 'Short',
          align: 'left',
          sortable: false,
          value: 'short'
        },
        {
          text: 'Manufacturer',
          align: 'left',
          sortable: false,
          value: 'manufacturer'
        },
        {
          text: 'Released at',
          align: 'left',
          sortable: true,
          value: 'released_at'
        },
        { text: 'Actions', value: 'actions', sortable: false, align: 'left' }
      ],
      toDeletePlatform: '',
      deletePlatformDialog: false
    }
  },
  methods: {
    onMounted () {
      this.fetchData()
    },
    fetchData () {
      this.$apitator
        .query(this, {
          body: {
            query: `query {
              getManyGamePlatforms {
                id
                name
                short
                released_at
                manufacturer
                created_at
                updated_at
              }
            }`
          }
        })
        .then((response) => {
          this.platforms = response.data.data.getManyGamePlatforms
        })
    },
    deletePlatform () {
      this.deletePlatformDialog = false
      this.$apitator
        .query(this, {
          body: {
            query: `mutation($id: ID!){
              destroyGamePlatform(id: $id)
            }`,
            variables: { id: this.toDeletePlatform.id }
          }
        })
        .then(() => {
          this.$store.commit('ADD_ALERT', {
            color: 'info',
            text: 'Deleted a game platform!'
          })
          this.fetchData()
        })
    }
  },
  created () {
    this.$store.commit('SET_TITLE', 'Platforms')
    this.$store.commit('SET_LAYOUT', 'dashboard')
  }
}
</script>
