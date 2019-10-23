<template>
  <div class="editors">
    <v-layout align-center justify-end row fill-height>
      <v-btn icon @click="fetchData()">
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-btn icon @click="createEditorDialog = true">
        <v-icon>add</v-icon>
      </v-btn>
    </v-layout>

    <v-data-table
      :headers="headers"
      :items="editors"
      hide-actions
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>
          <span>{{ props.item.name }}</span>
        </td>
        <td>
          {{ props.item.games_count }}
        </td>
        <td>
          {{ props.item.created_at }}
        </td>
        <td class="justify-end align-center layout px-2">
          <v-btn
            icon
            small
            @click="toEditEditor = props.item; editEditorDialog = true">
            <v-icon
              small
            >
              edit
            </v-icon>
          </v-btn>
          <v-btn
            icon
            small
            @click="toDeleteEditor = props.item; deleteEditorDialog = true">
            <v-icon
              small
            >
              delete
            </v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="createEditorDialog" max-width="500px">
      <v-card>
        <v-card-title>
          Create a editor
        </v-card-title>
        <v-card-text>
          <form>
            <v-text-field
              required
              label="Name"
              v-model="toCreateEditor.name">
            </v-text-field>
            <v-textarea
              label="Description"
              v-model="toCreateEditor.description">
            </v-textarea>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" flat @click.stop="createEditorDialog = false">Close</v-btn>
          <v-btn color="primary" flat @click.stop="createEditor()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editEditorDialog" max-width="500px">
      <v-card>
        <v-card-title>
          Edit "{{ toEditEditor.id }}" editor
        </v-card-title>
        <v-card-text>
          <form>
            <v-text-field
              required
              label="Name"
              v-model="toEditEditor.name">
            </v-text-field>
            <v-textarea
              label="Description"
              v-model="toEditEditor.description">
            </v-textarea>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" flat @click.stop="editEditorDialog = false">Close</v-btn>
          <v-btn color="primary" flat @click.stop="saveEditor()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteEditorDialog" max-width="500px">
      <v-card>
        <v-card-title>
          Really want to delete "{{ toDeleteEditor.name }}" ?
        </v-card-title>
        <v-card-actions>
          <v-btn color="primary" flat @click.stop="deleteEditorDialog = false">Close</v-btn>
          <v-btn color="red" flat @click.stop="deleteEditor()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        editors: [],
        headers: [
          {
            text: 'Name',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          {
            text: 'Games count',
            align: 'left',
            sortable: true,
            value: 'games_count'
          },
          {
            text: 'Created at',
            align: 'left',
            sortable: true,
            value: 'created_at'
          },
          {text: 'Actions', value: 'id', sortable: false, align: 'right'}
        ],
        deleteEditorDialog: false,
        toDeleteEditor: {},
        createEditorDialog: false,
        toCreateEditor: {
          name: '',
          description: ''
        },
        editEditorDialog: false,
        toEditEditor: {
          name: '',
          description: ''
        }
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
            query: `query{
              getManyGameEditors{
                id
                name
                description
                games_count
                created_at
                updated_at
              }
            }`
          }
        }).then((response) => {
          this.editors = response.data.data.getManyGameEditors
        })
      },
      deleteEditor: function () {
        this.deleteEditorDialog = false;
        this.$apitator.query(this, {
          body: {
            query: `mutation($id: ID!){
              destroyGameEditor(id: $id)
            }`,
            variables: {
              id: this.toDeleteEditor.id
            }
          }
        }).then(() => {
          this.$store.commit('ADD_ALERT', {
            color: 'info',
            text: 'Deleted a game editor!'
          });
          this.fetchData()
        })
      },
      saveEditor: function () {
        if (this.toEditEditor.name !== ''){
          if (this.toEditEditor.description == null) {
            this.toEditEditor.description = ''
          }
          this.editEditorDialog = false;
          this.$apitator.query(this, {
            body: {
              query: `mutation($editor: GameEditorUpdateInput!){
                updateGameEditor(editor: $editor)
              }`,
              variables: {
                editor: {
                  id: this.toEditEditor.id,
                  name: this.toEditEditor.name,
                  description: this.toEditEditor.description
                }
              }
            }
          }).then(() => {
            this.$store.commit('ADD_ALERT', {
              color: 'success',
              text: 'Saved a editor!'
            });
            this.fetchData();
          })
        }
      },
      createEditor: function () {
        if (this.toCreateEditor.name !== ''){
          this.createEditorDialog = false;
          this.$apitator.query(this, {
            body: {
              query:`mutation($editor: GameEditorStoreInput!){
              storeGameEditor(editor: $editor){id,saved}
            }`,
              variables: {
                editor: {
                  name: this.toCreateEditor.name,
                  description: this.toCreateEditor.description
                }
              }
            }
          }).then(() => {
            this.$store.commit('ADD_ALERT', {
              color: 'success',
              text: 'Added a editor!'
            });
            this.fetchData();
          })
        }
      }
    },
    created() {
      this.$store.commit('SET_TITLE', 'Game Editors');
      this.$store.commit('SET_LAYOUT', 'dashboard')
    }
  }
</script>
