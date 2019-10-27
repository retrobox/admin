<template>
  <div class="consoles">
    <v-layout align-center justify-space-between row fill-height>
      <div class="px-3">
        <span v-if="consoles.length > 0">{{ consoles.length }} console(s)</span>
      </div>
      <v-layout align-center justify-end row fill-height>
        <v-btn icon @click="fetchData()">
          <v-icon>refresh</v-icon>
        </v-btn>
        <v-btn icon @click="openAddConsoleModal()">
          <v-icon>add</v-icon>
        </v-btn>
      </v-layout>
    </v-layout>

    <v-data-table :headers="headers" :items="consoles" hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td>
          <v-avatar size="20" class="mr-2">
            <img :src="props.item.user.last_avatar" alt />
          </v-avatar>
          {{ props.item.user.last_username }}
        </td>
        <td>{{ props.item.storage }}</td>
        <td :style="'color:' + props.item.color">{{ props.item.color }}</td>
        <td>{{ props.item.created_at }}</td>
        <td class="justify-end align-center layout px-2">
          <v-btn icon small @click="viewConsoleDialog = true; toViewConsole = props.item">
            <v-icon small>info</v-icon>
          </v-btn>
          <v-btn icon small @click="editConsole(props.item)">
            <v-icon small>edit</v-icon>
          </v-btn>
          <v-tooltip top v-if="props.item.order !== null">
            <v-btn
              slot="activator"
              icon
              small
              @click="$router.push({ name: 'ShopOrders', query: { id: props.item.order.id }})"
            >
              <v-icon small>receipt</v-icon>
            </v-btn>
            <span>Open the order in which this console was ordered</span>
          </v-tooltip>
          <v-btn icon small @click="openDestroyConsoleModal(props.item)">
            <v-icon small color="error">delete</v-icon>
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
              <v-list-tile-action />
              <v-list-tile-content>
                <v-list-tile-title :style="'color:' + toViewConsole.color">{{toViewConsole.color}}</v-list-tile-title>
                <v-list-tile-sub-title>Color</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-action />
              <v-list-tile-content>
                <v-list-tile-title>{{toViewConsole.storage}}</v-list-tile-title>
                <v-list-tile-sub-title>Storage (Gb)</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-action />
              <v-list-tile-content>
                <v-list-tile-title>{{toViewConsole.version}}</v-list-tile-title>
                <v-list-tile-sub-title>Version</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <create-update :item="toViewConsole" />
            <v-tooltip top>
              <v-list-tile slot="activator" ripple>
                <v-list-tile-action />
                <v-list-tile-content>
                  <v-list-tile-title>
                    <span
                      v-if="toViewConsole.first_boot_at !== null"
                    >{{ toViewConsole.first_boot_at | fromNow }}</span>
                    <span v-if="toViewConsole.first_boot_at === null">Never</span>
                  </v-list-tile-title>
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
    <v-dialog v-model="addConsoleModal" max-width="500px">
      <v-card>
        <v-card-title>Manually add a console</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field label="ID" v-model="toAddConsole.id" />
            <v-select :items="colors" label="Color" v-model="toAddConsole.color"></v-select>
            <v-select :items="storage" label="Size" v-model="toAddConsole.storage"></v-select>
            <v-select :items="consoleVersions" label="Version" v-model="toAddConsole.version"></v-select>
            <v-text-field label="User id" v-model="toAddConsole.user_id" />
            <v-text-field label="Order id (optional)" v-model="toAddConsole.order_id" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="primary" @click="storeConsole()">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editConsoleModal" max-width="500px">
      <v-card>
        <v-card-title>Edit a console</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field disabled label="ID" v-model="toEditConsole.id" />
            <v-select :items="colors" label="Color" v-model="toEditConsole.color"></v-select>
            <v-select :items="storage" label="Size" v-model="toEditConsole.storage"></v-select>
            <v-select :items="consoleVersions" label="Version" v-model="toEditConsole.version"></v-select>
            <v-text-field label="User id" v-model="toEditConsole.user_id" />
            <v-text-field label="Order id" v-model="toEditConsole.order_id" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="primary" @click="updateConsole()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="destroyConsoleModal" max-width="500px">
      <v-card>
        <v-card-title>DO YOU REALLY REALLY WANT DESTROY THIS FUCKING CONSOLE ??</v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn flat color="error" @click="destroyConsole()">Yes</v-btn>
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
          text: "Id",
          align: "left",
          sortable: true,
          value: "id"
        },
        {
          text: "User",
          align: "left",
          sortable: false
        },
        {
          text: "Storage",
          align: "left",
          sortable: false,
          value: "storage"
        },
        {
          text: "Color",
          align: "left",
          sortable: false,
          value: "color"
        },
        {
          text: "Created at",
          align: "left",
          sortable: true,
          value: "created_at"
        },
        { text: "Actions", value: "id", sortable: false, align: "right" }
      ],
      addConsoleModal: false,
      storage: [{ text: "16Gb", value: '16' }, { text: "32Gb", value: '32' }],
      colors: [
        { text: "Red", value: "#ff4c4c" },
        { text: "Yellow", value: "#ffff66" },
        { text: "Green", value: "#68ff66" },
        { text: "Blue", value: "#6666ff" },
        { text: "Black", value: "#4c4c4c" }
      ],
      toAddConsole: {
        id: "",
        storage: '16',
        color: "#ff4c4c",
        user_id: "",
        order_id: ""
      },
      editConsoleModal: false,
      toEditConsole: {},
      destroyConsoleModal: false,
      toDestroyConsole: {},
      consoleVersions: []
    };
  },
  methods: {
    onMounted: function() {
      this.fetchData();
    },
    fetchData: function() {
      this.$store.commit("SET_LOADING", true);
      this.$apitator
        .query(this, {
          body: {
            query: `query {
              getManyConsoles (all: true, orderBy: "created_at", orderDir: "desc") {
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
                version
                first_boot_at
                created_at
                updated_at
              }
            }`
          }
        })
        .then(response => {
          this.consoles = response.data.data.getManyConsoles;
        });
    },
    openAddConsoleModal: function() {
      this.$apitator
        .query(this, {
          body: {
            query: `query {
              getConsoleVersions {
                id
              }
            }`
          }
        })
        .then(response => {
          this.consoleVersions = response.data.data.getConsoleVersions.map(version => {
            return { value: version.id, text: version.id }
          })
          this.toAddConsole.version = this.consoleVersions[this.consoleVersions.length - 1].value
          this.addConsoleModal = true
        })
    },
    storeConsole: function() {
      this.$apitator
        .query(this, {
          body: {
            query: `mutation ($console: ConsoleStoreInput!) {
              storeConsole(console: $console) {
                id,
                saved
              }
            }`,
            variables: {
              console: {
                id: this.toAddConsole.id,
                color: this.toAddConsole.color,
                storage: this.toAddConsole.storage,
                user_id: this.toAddConsole.user_id,
                order_id: this.toAddConsole.order_id
              }
            }
          }
        })
        .then(response => {
          this.$store.commit("ADD_ALERT", {
            color: "success",
            text: "Created a console!"
          });
          this.addConsoleModal = false;
          this.fetchData();
        });
    },
    updateConsole: function() {
      this.$apitator
        .query(this, {
          body: {
            query: `mutation ($console: ConsoleUpdateInput!) {
              updateConsole(console: $console)
            }`,
            variables: {
              console: {
                id: this.toEditConsole.id,
                color: this.toEditConsole.color,
                storage: this.toEditConsole.storage,
                version: this.toEditConsole.version,
                user_id: this.toEditConsole.user_id,
                order_id: this.toEditConsole.order_id
              }
            }
          }
        })
        .then(response => {
          this.$store.commit("ADD_ALERT", {
            color: "success",
            text: "Updated a console!"
          });
          this.editConsoleModal = false;
          this.fetchData();
        });
    },
    editConsole: function(console) {
      this.$store.commit("SET_LOADING", true);
      this.$apitator
        .query(this, {
          body: {
            query: `query($id: String!){
              getOneConsole (id: $id) {
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
                version
                first_boot_at
                created_at
                updated_at
              }
              getConsoleVersions {
                id
              }
            }`,
            variables: {
              id: console.id
            }
          }
        })
        .then(response => {
          this.toEditConsole = response.data.data.getOneConsole;
          this.toEditConsole.storage = response.data.data.getOneConsole.storage;
          this.toEditConsole.user_id = response.data.data.getOneConsole.user.id;
          this.toEditConsole.version = response.data.data.getOneConsole.version;
          this.consoleVersions = response.data.data.getConsoleVersions.map(version => {
            return { value: version.id, text: version.id }
          });
          if (response.data.data.getOneConsole.order !== null) {
            this.toEditConsole.order_id = response.data.data.getOneConsole.order.id;
          }
        });
      this.editConsoleModal = true;
    },
    openDestroyConsoleModal(item) {
      this.destroyConsoleModal = true
      this.toDestroyConsole = item
    },
    destroyConsole() {
      this.$apitator.query(this, {
        body: {
          query: `mutation($id: ID!){
            destroyConsole(id: $id)
          }`,
          variables: {
            id: this.toDestroyConsole.id
          }
        }
      }).then((response) => {
        this.destroyConsoleModal = false
        this.$store.commit('ADD_ALERT', {
          color: 'info',
          text: "Console destroyed!"
        })
        this.fetchData()
      }).catch(() => {
        this.destroyConsoleModal = false
      })
    }
  },
  created() {
    this.$store.commit("SET_TITLE", "Consoles");
    this.$store.commit("SET_LAYOUT", "dashboard");
  }
};
</script>
