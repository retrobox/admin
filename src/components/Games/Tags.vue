<template>
  <div class="tags">
    <v-layout align-center justify-end row fill-height>
      <v-btn icon @click="fetchData()">
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-btn icon @click="createTagDialog = true">
        <v-icon>add</v-icon>
      </v-btn>
    </v-layout>

    <v-data-table
      :headers="headers"
      :items="tags"
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
            @click="toEditTag = props.item; editTagDialog = true">
            <v-icon
              small
            >
              edit
            </v-icon>
          </v-btn>
          <v-btn
            icon
            small
            @click="toDeleteTag = props.item; deleteTagDialog = true">
            <v-icon
              small
            >
              delete
            </v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="createTagDialog" max-width="500px">
      <v-card>
        <v-card-title>
          Create a tag
        </v-card-title>
        <v-card-text>
          <form>
            <v-text-field
              required
              label="Name"
              v-model="toCreateTag.name">
            </v-text-field>
            <v-textarea
              label="Description"
              v-model="toCreateTag.description">
            </v-textarea>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" flat @click.stop="createTagDialog = false">Close</v-btn>
          <v-btn color="primary" flat @click.stop="createTag()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editTagDialog" max-width="500px">
      <v-card>
        <v-card-title>
          Edit "{{ toEditTag.id }}" tag
        </v-card-title>
        <v-card-text>
          <form>
            <v-text-field
              required
              label="Name"
              v-model="toEditTag.name">
            </v-text-field>
            <v-textarea
              label="Description"
              v-model="toEditTag.description">
            </v-textarea>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" flat @click.stop="editTagDialog = false">Close</v-btn>
          <v-btn color="primary" flat @click.stop="saveTag()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteTagDialog" max-width="500px">
      <v-card>
        <v-card-title>
          Really want to delete "{{ toDeleteTag.name }}" ?
        </v-card-title>
        <v-card-actions>
          <v-btn color="primary" flat @click.stop="deleteTagDialog = false">Close</v-btn>
          <v-btn color="red" flat @click.stop="deleteTag()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tags: [],
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
        deleteTagDialog: false,
        toDeleteTag: {},
        createTagDialog: false,
        toCreateTag: {
          name: '',
          description: ''
        },
        editTagDialog: false,
        toEditTag: {
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
              getManyGameTags{
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
          this.tags = response.data.data.getManyGameTags
        })
      },
      deleteTag: function () {
        this.deleteTagDialog = false;
        this.$apitator.query(this, {
          body: {
            query: `mutation($id: ID!){destroyGameTag(id: $id)}`,
            variables: {
              id: this.toDeleteTag.id
            }
          }
        }).then(() => {
          this.$store.commit('ADD_ALERT', {
            color: 'info',
            text: 'Deleted a game tag!'
          });
          this.fetchData()
        })
      },
      saveTag: function () {
        if (this.toEditTag.name !== ''){
          if (this.toEditTag.description == null) {
            this.toEditTag.description = ''
          }
          this.editTagDialog = false;
          this.$apitator.query(this, {
            body: {
              query:`mutation($tag: GameTagUpdateInput!){
                updateGameTag(tag: $tag)
              }`,
              variables: {
                tag: {
                  id: this.toEditTag.id,
                  name: this.toEditTag.name,
                  description: this.toEditTag.description
                }
              }
            }
          }).then(() => {
            this.$store.commit('ADD_ALERT', {
              color: 'success',
              text: 'Saved a tag!'
            });
            this.fetchData();
          })
        }
      },
      createTag: function () {
        if (this.toCreateTag.name !== ''){
          this.createTagDialog = false;
          this.$apitator.query(this, {
            body: {
              query:`mutation($tag: GameTagStoreInput!){
              storeGameTag(tag: $tag){id,saved}
            }`,
              variables: {
                tag: {
                  name: this.toCreateTag.name,
                  description: this.toCreateTag.description
                }
              }
            }
          }).then(() => {
            this.$store.commit('ADD_ALERT', {
              color: 'success',
              text: 'Added a tag!'
            });
            this.fetchData();
          })
        }
      }
    },
    created() {
      this.$store.commit('SET_TITLE', 'Game Tags');
      this.$store.commit('SET_LAYOUT', 'dashboard')
    }
  }
</script>
