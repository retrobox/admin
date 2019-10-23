<template>
  <div class="consoles">
    <v-layout align-center justify-space-between row fill-height>
      <div class="px-3">
        <span v-if="consoles.length > 0">{{ consoles.length }} console(s)</span>
      </div>
      <v-btn icon @click="fetchData()">
        <v-icon>refresh</v-icon>
      </v-btn>
    </v-layout>

    <v-data-table :headers="headers" :items="consoles" hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>
          {{ props.item.id }}
        </td>
        <td>
          <v-avatar size="20" class="mr-2"><img :src="props.item.user.last_avatar" alt=""></v-avatar>
          {{ props.item.user.last_username }}
        </td>
        <td>
          {{ props.item.storage }}
        </td>
        <td :style="'color:' + props.item.color">
          {{ props.item.color }}
        </td>
        <td>
          {{ props.item.created_at }}
        </td>
        <td class="justify-end align-center layout px-2">
          <v-btn
            icon
            small
            @click="viewConsoleDialog = true; toViewConsole = props.item">
            <v-icon
              small
            >
              info
            </v-icon>
          </v-btn>
          <v-btn
            icon
            small
            @click="viewOrderEdit(props.item)">
            <v-icon
              small
            >
              edit
            </v-icon>
          </v-btn>
          <v-btn
            icon
            small
            @click="$router.push({ name: 'ShopOrders', query: { id: props.item.order.id }})">
            <v-icon
              small
            >
              receipt
            </v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="viewConsoleDialog" max-width="500px">
      <v-card>
        <v-card-text>
          <v-list two-line>
            <v-list-tile @click="$copyText(toViewConsole.id)" ripple>
              <v-list-tile-action>
                <v-icon>label</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{toViewConsole.id}}</v-list-tile-title>
                <v-list-tile-sub-title>API Id</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-action/>
              <v-list-tile-content>
                <v-list-tile-title :style="'color:' + toViewConsole.color">{{toViewConsole.color}}</v-list-tile-title>
                <v-list-tile-sub-title>Color</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-action/>
              <v-list-tile-content>
                <v-list-tile-title>{{toViewConsole.storage}}</v-list-tile-title>
                <v-list-tile-sub-title>Storage (Gb)</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <create-update :item="toViewConsole"/>
            <v-tooltip top>
              <v-list-tile slot="activator" @click="" ripple>
                <v-list-tile-action/>
                <v-list-tile-content>
                  <v-list-tile-title><span v-if="toViewConsole.first_boot_at !== null">{{ toViewConsole.first_boot_at | fromNow }}</span>
                    <span v-if="toViewConsole.first_boot_at === null">Never</span></v-list-tile-title>
                  <v-list-tile-sub-title>First boot at</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <span v-if="toViewConsole.first_boot_at !== null">{{ toViewConsole.first_boot_at }}</span>
              <span v-if="toViewConsole.first_boot_at === null">Never</span>
            </v-tooltip>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" flat @click.stop="viewConsoleDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        toViewConsole: {},
        viewConsoleDialog: false,
        consoles: [],
        headers: [
          {
            text: 'Id',
            align: 'left',
            sortable: true,
            value: 'id'
          },
          {
            text: 'User',
            align: 'left',
            sortable: false
          },
          {
            text: 'Storage',
            align: 'left',
            sortable: false,
            value: 'storage'
          },
          {
            text: 'Color',
            align: 'left',
            sortable: false,
            value: 'color'
          },
          {
            text: 'Created at',
            align: 'left',
            sortable: true,
            value: 'created_at'
          },
          {text: 'Actions', value: 'id', sortable: false, align: 'right'}
        ]
      }
    },
    methods: {
      onMounted: function () {
        this.fetchData()
      },
      fetchData: function () {
        this.$store.commit('SET_LOADING', true);
        this.$apitator.query(this, {
          body: {
            query: `query {
              getManyConsoles (all: true) {
                id
                color
                storage
                user {
                  id
                  last_username
                  last_email
                  last_avatar
                }
                order {
                  id
                  created_at
                }
                first_boot_at
                created_at
                updated_at
              }
            }`
          }
        }).then((response) => {
          this.consoles = response.data.data.getManyConsoles
        })
      }
    },
    created() {
      this.$store.commit('SET_TITLE', 'Consoles');
      this.$store.commit('SET_LAYOUT', 'dashboard')
    }
  }
</script>
