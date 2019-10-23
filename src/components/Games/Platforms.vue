<template>
  <div class="platforms">
    <v-layout align-center justify-end row fill-height>
      <v-btn icon @click="fetchData()">
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-btn icon @click="$router.push({name: 'GamePlatformCreate'})">
        <v-icon>add</v-icon>
      </v-btn>
    </v-layout>

    <v-data-table
      :headers="headers"
      :items="platforms"
      hide-actions
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>
          {{ props.item.name }}
        </td>
        <td>
          {{ props.item.short }}
        </td>
        <td>
          {{ props.item.manufacturer }}
        </td>
        <td>
          {{ props.item.released_at }}
        </td>
        <td class="justify-end align-center layout px-2">
          <v-btn
            icon
            small
            @click="$router.push({name: 'GamePlatformEdit', params: {id: props.item.id}})">
            <v-icon
              small
            >
              edit
            </v-icon>
          </v-btn>
          <v-btn
            icon
            small
            @click="toDeletePlatform = props.item; deletePlatformDialog = true">
            <v-icon
              small
            >
              delete
            </v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="deletePlatformDialog" max-width="500px">
      <v-card>
        <v-card-title>
          Really want to delete "{{ toDeletePlatform.name }}" ?
        </v-card-title>
        <v-card-actions>
          <v-btn color="primary" flat @click.stop="deletePlatformDialog = false">Close</v-btn>
          <v-btn color="red" flat @click.stop="deletePlatform()">Delete</v-btn>
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
          {text: 'Actions', value: 'id', sortable: false, align: 'right'}
        ],
        toDeletePlatform: '',
        deletePlatformDialog: false
      }
    },
    methods: {
      onMounted: function() {
        this.fetchData()
      },
      fetchData: function() {
        this.$apitator.query(this, {
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
        }).then((response) => {
          this.platforms = response.data.data.getManyGamePlatforms
        })
      },
      deletePlatform: function () {
        this.deletePlatformDialog = false;
        this.$apitator.query(this, {
          body: {
            query: `mutation($id: ID!){
              destroyGamePlatform(id: $id)
            }`,
            variables: {
              id: this.toDeletePlatform.id
            }
          }
        }).then(() => {
          this.$store.commit('ADD_ALERT', {
            color: 'info',
            text: 'Deleted a game platform!'
          });
          this.fetchData()
        })
      }
    },
    created() {
      this.$store.commit('SET_TITLE', 'Platforms');
      this.$store.commit('SET_LAYOUT', 'dashboard')
    }
  }
</script>
