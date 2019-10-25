<template>
<div class="users">
  <v-layout align-center justify-end row fill-height>
    <v-btn icon @click="fetchData()">
      <v-icon>refresh</v-icon>
    </v-btn>
  </v-layout>

  <v-data-table :headers="headers" :items="users" hide-actions class="elevation-1">
    <template slot="items" slot-scope="props">
      <td><v-avatar
          :tile="false"
          :size="30"
        >
          <img :src="props.item.last_avatar" alt="avatar">
        </v-avatar></td>
      <td>
        <span v-bind:class="{'font-weight-bold': props.item.is_admin}">{{ props.item.last_username }}</span>
      </td>
      <td>{{ props.item.last_email }}</td>
      <td>{{ props.item.id }}</td>
      <td class="justify-end align-center layout px-2">
          <v-btn
          icon
          small
          @click="viewItem(props.item)">
            <v-icon
            small
            >
              info
            </v-icon>
          </v-btn>
          <v-btn
          icon
          small
          @click="editItem(props.item)">
            <v-icon
            small
            >
              edit
            </v-icon>
          </v-btn>
          <v-btn
          icon
          small
          @click="openDestroyUser(props.item)">
            <v-icon
            small
            >
              delete
            </v-icon>
          </v-btn>
        </td>
    </template>
  </v-data-table>
  <v-dialog v-model="editDialog" max-width="500px">
    <v-card>
      <v-card-title>
        Edit user: "{{editUser.last_username}}"
      </v-card-title>
      <v-card-text>
        <form>
          <v-checkbox v-model="editUser.is_admin" label="Is admin ?"></v-checkbox>
        </form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red" flat @click.stop="editDialog=false">Close</v-btn>
        <v-btn color="primary" flat @click.stop="editSubmit()">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="viewDialog" max-width="500px">
    <v-card>
      <v-card-text>
        <v-layout justify-center row fill-height>
          <v-avatar :tile="false" :size="80" class="mb-4 mt-4">
            <img :src="viewUser.last_avatar" alt="avatar">
          </v-avatar>
        </v-layout>
        <v-list two-line>
          <div v-if="viewUser.last_email != null">
            <v-list-tile @click="">
              <v-list-tile-action>
                <v-icon>mail</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{viewUser.last_email}}</v-list-tile-title>
                <v-list-tile-sub-title>Last email</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider inset></v-divider>
          </div>

          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>label</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{viewUser.last_username}}</v-list-tile-title>
              <v-list-tile-sub-title>Last username</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="$copyText(viewUser.id)" ripple>
            <v-list-tile-action />

            <v-list-tile-content>
              <v-list-tile-title>{{viewUser.id}}</v-list-tile-title>
              <v-list-tile-sub-title>API Id</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile @click="$copyText(viewUser.last_user_agent)" ripple>
            <v-list-tile-action>
              <v-icon>settings_applications</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{viewUser.last_user_agent}}</v-list-tile-title>
              <v-list-tile-sub-title>Last user agent</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>https</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                <span v-if="viewUser.is_admin">
                   Administrator
                </span>
                <span v-else>
                   Not a administrator
                </span>
              </v-list-tile-title>
              <v-list-tile-sub-title>Is admin ?</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile @click="$copyText(viewUser.last_ip)" ripple>
            <v-list-tile-action>
              <v-icon>location_on</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                <span v-if="viewUser.last_ip == null">
                  Unknown
                </span>
                <span v-else>
                  {{viewUser.last_ip}}
                </span>
              </v-list-tile-title>
              <v-list-tile-sub-title>Last ip</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>update</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{viewUser.created_at}}</v-list-tile-title>
              <v-list-tile-sub-title>Register at</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="">
            <v-list-tile-action>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>
                <span v-if="viewUser.last_login_at == null">
                  Never logged
                </span>
                <span v-else>
                  {{viewUser.last_login_at}}
                </span>
              </v-list-tile-title>
              <v-list-tile-sub-title>Last login at</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" flat @click.stop="viewDialog=false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="destroyUserModal" max-width="500px">
    <v-card>
      <v-card-title>
        Do you REALLY REALLY WANT TO DESTROY THIS USER ACCOUNT ???
      </v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn flat color="error" @click="destroyUser()">
          Destroy
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      viewDialog: false,
      viewUser: {},
      editDialog: false,
      editUser: {},
      users: [],
      headers: [{
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
        {
          text: 'Id',
          align: 'left',
          sortable: false,
          value: 'last_email'
        },
        { text: 'Actions', value: 'id', sortable: false, align: 'right' }
      ],
      destroyUserModal: false
    }
  },
  methods: {
    onMounted: function() {
      this.fetchData()
    },
    fetchData: function() {
      this.$apitator.query(this, {
        body: {
          query: `query{getManyUsers{id,last_username,last_email,last_avatar,is_admin}}`
        }
      }).then((response) => {
        this.users = response.data.data.getManyUsers
      })
    },
    viewItem(item) {
      this.$apitator.query(this, {
        body: {
          query: `query($id: String!){getOneUser(id: $id){id,last_username,last_email,last_avatar,last_ip,last_user_agent,is_admin,created_at,last_login_at}}`,
          variables: {
            id: item.id
          }
        }
      }).then((response) => {
        this.viewUser = response.data.data.getOneUser
        this.viewDialog = true
      })
    },
    editItem(item) {
      this.$apitator.query(this, {
        body: {
          query: `query($id: String!){getOneUser(id: $id){id,last_username,is_admin}}`,
          variables: {
            id: item.id
          }
        }
      }).then((response) => {
        this.editUser = response.data.data.getOneUser
        this.editDialog = true
      })
    },
    editSubmit() {
      this.editDialog = false
      this.$apitator.query(this, {
        body: {
          query: `mutation($user: UserUpdateInput!){updateUser(user: $user)}`,
          variables: {
            user: {
              id: this.editUser.id,
              is_admin: this.editUser.is_admin
            }
          }
        }
      }).then((response) => {
        this.$store.commit('ADD_ALERT', {
          color: 'success',
          text: "User updated!"
        })
        this.fetchData()
      }).catch(() => {
        this.editDialog = true
      })
    },
    openDestroyUser(user) {
      this.destroyUserModal = true
      this.toDestroyUser = user
    },
    destroyUser() {
      alert('REALLYYLLY?')
      this.$apitator.query(this, {
        body: {
          query: `mutation($id: ID!){
            destroyUser(id: $id)
          }`,
          variables: {
            id: this.toDestroyUser.id
          }
        }
      }).then((response) => {
        this.$store.commit('ADD_ALERT', {
          color: 'info',
          text: "User Destroyed!"
        })
        this.fetchData()
      }).catch(() => {
        this.destroyUserModal = false
      })
    }
  },
  created() {
    this.$store.commit('SET_TITLE', 'Users')
    this.$store.commit('SET_LAYOUT', 'dashboard')
  }
}
</script>
