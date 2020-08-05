<template>
  <div class="tags">
    <v-data-table :headers="headers" :items="tags" hide-default-footer class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer />
          <v-btn icon color="info" @click="fetchData()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn icon color="success" @click="createTagDialog = true">
            <v-icon>add</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          icon small color="info"
          @click="toEditTag = item; editTagDialog = true">
          <v-icon small>edit</v-icon>
        </v-btn>
        <v-btn
          icon small color="error"
          @click="toDeleteTag = item; deleteTagDialog = true">
          <v-icon small>delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="createTagDialog" max-width="500px">
      <v-card>
        <v-card-title>Create a tag</v-card-title>
        <v-card-text>
          <form>
            <v-text-field required label="Name" v-model="toCreateTag.name"></v-text-field>
            <v-textarea label="Description" v-model="toCreateTag.description"></v-textarea>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" text @click.stop="createTagDialog = false">Close</v-btn>
          <v-spacer />
          <v-btn color="primary" text @click.stop="createTag()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editTagDialog" max-width="500px">
      <v-card>
        <v-card-title>Edit "{{ toEditTag.id }}" tag</v-card-title>
        <v-card-text>
          <form>
            <v-text-field required label="Name" v-model="toEditTag.name"></v-text-field>
            <v-textarea label="Description" v-model="toEditTag.description"></v-textarea>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" text @click.stop="editTagDialog = false">Close</v-btn>
          <v-spacer />
          <v-btn color="primary" text @click.stop="saveTag()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteTagDialog" max-width="500px">
      <v-card>
        <v-card-title>Really want to delete "{{ toDeleteTag.name }}" ?</v-card-title>
        <v-card-actions>
          <v-btn color="primary" text @click.stop="deleteTagDialog = false">Close</v-btn>
          <v-spacer />
          <v-btn color="red" text @click.stop="deleteTag()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
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
      { text: 'Actions', value: 'actions', sortable: false, align: 'right' }
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
  }),
  methods: {
    onMounted () {
      this.fetchData()
    },
    fetchData () {
      this.$store.commit('SET_LOADING', true)
      this.$apitator
        .query(this, {
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
        })
        .then((response) => {
          this.tags = response.data.data.getManyGameTags
        })
    },
    deleteTag () {
      this.deleteTagDialog = false
      this.$apitator
        .query(this, {
          body: {
            query: `mutation ($id: ID!) {
              destroyGameTag(id: $id)
            }`,
            variables: { id: this.toDeleteTag.id }
          }
        })
        .then(() => {
          this.$store.commit('ADD_ALERT', {
            color: 'info',
            text: 'Deleted a game tag!'
          })
          this.fetchData()
        })
    },
    saveTag () {
      if (this.toEditTag.name !== '') {
        if (this.toEditTag.description == null) {
          this.toEditTag.description = ''
        }
        this.editTagDialog = false
        this.$apitator
          .query(this, {
            body: {
              query: `mutation($tag: GameTagUpdateInput!){
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
          })
          .then(() => {
            this.$store.commit('ADD_ALERT', {
              color: 'success',
              text: 'Saved a tag!'
            })
            this.fetchData()
          })
      }
    },
    createTag () {
      if (this.toCreateTag.name !== '') {
        this.createTagDialog = false
        this.$apitator
          .query(this, {
            body: {
              query: `mutation($tag: GameTagStoreInput!){
                storeGameTag(tag: $tag){id,saved}
              }`,
              variables: {
                tag: {
                  name: this.toCreateTag.name,
                  description: this.toCreateTag.description
                }
              }
            }
          })
          .then(() => {
            this.$store.commit('ADD_ALERT', {
              color: 'success',
              text: 'Added a tag!'
            })
            this.fetchData()
          })
      }
    }
  },
  created () {
    this.$store.commit('SET_TITLE', 'Game Tags')
    this.$store.commit('SET_LAYOUT', 'dashboard')
  }
}
</script>
