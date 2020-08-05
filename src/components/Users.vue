<template>
<div class="users">
  <v-data-table :headers="headers" :items="users" hide-default-footer class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-spacer></v-spacer>
        <v-btn icon color="info" @click="fetchData()">
          <v-icon>refresh</v-icon>
        </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.id="{ item }">
      <span>{{ item.id }}</span>
    </template>
    <template v-slot:item.avatar="{ item }">
      <v-avatar
        :item="false"
        :size="30"
      >
        <img :src="item.last_avatar" alt="avatar">
      </v-avatar>
    </template>
    <template v-slot:item.username="{ item }">
      <span v-bind:class="{'font-weight-bold': item.is_admin}">{{ item.last_username }}</span>
    </template>
    <template v-slot:item.email="{ item }">
      <span>{{ item.last_email }}</span>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn icon small @click="viewItem(item)">
        <v-icon small>info</v-icon>
      </v-btn>
      <v-btn icon small @click="editItem(item)">
        <v-icon small>edit</v-icon>
      </v-btn>
      <v-btn icon small @click="openDestroyUser(item)">
        <v-icon small>delete</v-icon>
      </v-btn>
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
        <v-btn
          color="red" text
          @click.stop="editDialog=false">Close</v-btn>
        <v-btn
          color="primary" text
          @click.stop="editSubmit()">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="viewDialog" max-width="500px">
    <v-card>
      <v-card-text>
        <v-layout justify-center row fill-height>
          <v-avatar :item="false" :size="150" class="mb-4 mt-4">
            <img :src="viewUser.last_avatar" alt="avatar">
          </v-avatar>
        </v-layout>
        <v-list two-line>
          <v-divider></v-divider>
          <template v-if="viewUser.last_email != null">
            <v-list-item>
              <v-list-item-action>
                <v-icon>mail</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ viewUser.last_email }}</v-list-item-title>
                <v-list-item-subtitle>Last email</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </template>

          <v-list-item>
            <v-list-item-action>
              <v-icon>label</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ viewUser.last_username }}</v-list-item-title>
              <v-list-item-subtitle>Last username</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="$copyText(viewUser.id)" ripple>
            <v-list-item-action />

            <v-list-item-content>
              <v-list-item-title>{{ viewUser.id }}</v-list-item-title>
              <v-list-item-subtitle>API Id</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="$copyText(viewUser.last_user_agent)" ripple>
            <v-list-item-action>
              <v-icon>settings_applications</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ viewUser.last_user_agent }}</v-list-item-title>
              <v-list-item-subtitle>Last user agent</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-action>
              <v-icon>https</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                <span v-if="viewUser.is_admin">
                   Administrator
                </span>
                <span v-else>
                   Not a administrator
                </span>
              </v-list-item-title>
              <v-list-item-subtitle>Is admin ?</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="$copyText(viewUser.last_ip)" ripple>
            <v-list-item-action>
              <v-icon>location_on</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                <span v-if="viewUser.last_ip == null">
                  Unknown
                </span>
                <span v-else>
                  {{viewUser.last_ip}}
                </span>
              </v-list-item-title>
              <v-list-item-subtitle>Last ip</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-action>
              <v-icon>update</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{viewUser.created_at}}</v-list-item-title>
              <v-list-item-subtitle>Register at</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-action />

            <v-list-item-content>
              <v-list-item-title>
                <span v-if="viewUser.last_login_at == null">
                  Never logged
                </span>
                <span v-else>
                  {{viewUser.last_login_at}}
                </span>
              </v-list-item-title>
              <v-list-item-subtitle>Last login at</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary" text
          @click.stop="viewDialog=false">
          Close
        </v-btn>
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
        <v-btn text color="error" @click="destroyUser()">
          Destroy
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
export default {
  data: () => ({
    viewDialog: false,
    viewUser: {},
    editDialog: false,
    editUser: {},
    users: [],
    headers: [
      {
        text: 'Id',
        align: 'left',
        sortable: false,
        value: 'id'
      },
      {
        text: 'Avatar',
        align: 'left',
        sortable: false,
        value: 'avatar'
      },
      {
        text: 'Username',
        align: 'left',
        sortable: false,
        value: 'username'
      },
      {
        text: 'Email',
        align: 'left',
        sortable: false,
        value: 'email'
      },
      { text: 'Actions', value: 'actions', sortable: false, align: 'right' }
    ],
    destroyUserModal: false
  }),
  methods: {
    onMounted () {
      this.fetchData()
    },
    fetchData () {
      this.$apitator.query(this, {
        body: {
          query: `query {
            getManyUsers {
              id, last_username, last_email, last_avatar, is_admin
            }
          }`
        }
      }).then((response) => {
        this.users = response.data.data.getManyUsers
      })
    },
    viewItem (item) {
      this.$apitator.query(this, {
        body: {
          query: `query ($id: String!) {
              getOneUser (id: $id) { 
                id, last_username, last_email, last_avatar, last_ip, last_user_agent, is_admin,
                created_at, last_login_at
              }
            }`,
          variables: {
            id: item.id
          }
        }
      }).then((response) => {
        this.viewUser = response.data.data.getOneUser
        this.viewDialog = true
      })
    },
    editItem (item) {
      this.$apitator.query(this, {
        body: {
          query: `query ($id: String!) {
            getOneUser (id: $id) { id, last_username, is_admin }
          }`,
          variables: {
            id: item.id
          }
        }
      }).then((response) => {
        this.editUser = response.data.data.getOneUser
        this.editDialog = true
      })
    },
    editSubmit () {
      this.editDialog = false
      this.$apitator.query(this, {
        body: {
          query: `mutation ($user: UserUpdateInput!) {
            updateUser (user: $user)
          }`,
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
          text: 'User updated!'
        })
        this.fetchData()
      }).catch(() => {
        this.editDialog = true
      })
    },
    openDestroyUser (user) {
      this.destroyUserModal = true
      this.toDestroyUser = user
    },
    destroyUser () {
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
        this.destroyUserModal = false
        this.$store.commit('ADD_ALERT', {
          color: 'info',
          text: 'User Destroyed!'
        })
        this.fetchData()
      }).catch(() => {
        this.destroyUserModal = false
      })
    }
  },
  created () {
    this.$store.commit('SET_TITLE', 'Users')
    this.$store.commit('SET_LAYOUT', 'dashboard')
  }
}
</script>
