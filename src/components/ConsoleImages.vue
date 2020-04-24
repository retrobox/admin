<template>
  <div class="consoles">
    <v-layout align-center justify-space-between row fill-height>
      <div class="px-3">
        <span v-if="images.length > 0">{{ images.length }} console image(s)</span>
      </div>
      <v-layout align-center justify-end row fill-height>
        <v-btn icon @click="fetchData()">
          <v-icon>refresh</v-icon>
        </v-btn>
        <v-btn icon @click="openAddImageModal()">
          <v-icon>add</v-icon>
        </v-btn>
      </v-layout>
    </v-layout>

    <v-data-table :headers="headers" :items="images" hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.console_version }}</td>
        <td>{{ props.item.software_version }}</td>
        <td>{{ props.item.version }}</td>
        <td>{{ props.item.created_at|subDate }}</td>
        <td class="justify-end align-center layout px-2">
          <v-btn icon small @click="viewImageDialog = true; toViewImage = props.item">
            <v-icon small>info</v-icon>
          </v-btn>
          <v-btn icon small @click="editImage(props.item)">
            <v-icon small>edit</v-icon>
          </v-btn>
          <v-btn icon small @click="downloadImage(props.item)">
            <v-icon small>get_app</v-icon>
          </v-btn>
          <v-btn icon small @click="openDestroyImageModal(props.item)">
            <v-icon small color="error">delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="viewImageDialog" max-width="500px">
      <v-card>
        <v-card-text>
          <v-list two-line>
            <v-list-tile @click="$copyText(toViewImage.id)" ripple>
              <v-list-tile-action>
                <v-icon>label</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{toViewImage.id}}</v-list-tile-title>
                <v-list-tile-sub-title>API Id</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile @click="$copyText(toViewImage.version)" ripple>
              <v-list-tile-action>
                <v-icon>label</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{toViewImage.version}}</v-list-tile-title>
                <v-list-tile-sub-title>Version slug</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile @click="$copyText(toViewImage.console_version)" ripple>
              <v-list-tile-action />
              <v-list-tile-content>
                <v-list-tile-title>{{toViewImage.console_version}}</v-list-tile-title>
                <v-list-tile-sub-title>Console version</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile @click="$copyText(toViewImage.software_version)" ripple>
              <v-list-tile-action />
              <v-list-tile-content>
                <v-list-tile-title>{{toViewImage.software_version}}</v-list-tile-title>
                <v-list-tile-sub-title>Software version</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile @click="$copyText(toViewImage.description)" ripple>
              <v-list-tile-action>
                <v-icon>description</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{toViewImage.description}}</v-list-tile-title>
                <v-list-tile-sub-title>Description</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <create-update :item="toViewImage" />
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" flat @click.stop="viewImageDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addImageModal" max-width="500px">
      <v-card>
        <v-card-title>Create a new version</v-card-title>
        <v-card-text>
          <v-form>
            <v-select 
              :items="consoleVersions"
              label="Console version"
              v-model="toAddImage.console_version" />
            <v-text-field 
              label="Software version"
              v-model="toAddImage.software_version" />
            <v-textarea
              label="Description"
              v-model="toAddImage.description" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="primary" @click="storeImage()">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editImageModal" max-width="500px">
      <v-card>
        <v-card-title>Edit a console image</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field disabled label="ID" v-model="toEditImage.id" />
            <v-text-field 
              label="Software version"
              v-model="toEditImage.software_version" />
            <v-textarea
              label="Description"
              v-model="toEditImage.description" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="primary" @click="updateImage()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="destroyImageModal" max-width="500px">
      <v-card>
        <v-card-title>Do you really want to destroy this version?</v-card-title>
        <v-card-text>
          <b>Please be careful, because this can really break things</b>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn flat color="error" @click="destroyImage()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toViewImage: {},
      viewImageDialog: false,
      images: [],
      headers: [
        {
          text: "Id",
          align: "left",
          sortable: false,
          value: "id"
        },
        {
          text: "Console version",
          align: "left",
          sortable: false
        },
        {
          text: "Software version",
          align: "left",
          sortable: false,
          value: "storage"
        },
        {
          text: "Version",
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
      addImageModal: false,
      toAddImage: {
        console_version: "",
        software_version: ""
      },
      editImageModal: false,
      toEditImage: {},
      destroyImageModal: false,
      toDestroyImage: {},
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
              getManyConsoleImages {
                id
                console_version
                software_version
                version
                description
                created_at
                updated_at
              }
            }`
          }
        })
        .then(response => {
          this.images = response.data.data.getManyConsoleImages;
        });
    },
    openAddImageModal: function() {
      this.$apitator
        .query(this, { body: { query: `query { getConsoleVersions { id } }` } })
        .then(response => {
          this.consoleVersions = response.data.data.getConsoleVersions.map(version => {
            return { value: version.id, text: version.id }
          })
          this.toAddImage.console_version = this.consoleVersions[this.consoleVersions.length - 1].value
          this.addImageModal = true
        })
    },
    storeImage: function() {
      this.$apitator
        .query(this, {
          body: {
            query: `mutation ($image: ConsoleImageStoreInput!) {
              storeConsoleImage(image: $image) {
                id,
                saved
              }
            }`,
            variables: {
              image: {
                console_version: this.toAddImage.console_version,
                software_version: this.toAddImage.software_version,
                description: this.toAddImage.description
              }
            }
          }
        })
        .then(response => {
          this.$store.commit("ADD_ALERT", {
            color: "success",
            text: "Created a console image!"
          });
          this.addImageModal = false;
          this.fetchData();
        });
    },
    updateImage: function() {
      this.$apitator
        .query(this, {
          body: {
            query: `mutation ($image: ConsoleImageUpdateInput!) {
              updateConsoleImage(image: $image)
            }`,
            variables: {
              image: {
                id: this.toEditImage.id,
                software_version: this.toEditImage.software_version,
                description: this.toEditImage.description
              }
            }
          }
        })
        .then(response => {
          this.$store.commit("ADD_ALERT", {
            color: "success",
            text: "Updated a console image!"
          });
          this.editImageModal = false;
          this.fetchData();
        });
    },
    editImage: function(image) {
      this.editImageModal = true;
      this.toEditImage = image;
    },
    openDestroyImageModal(item) {
      this.destroyImageModal = true
      this.toDestroyImage = item
    },
    destroyImage() {
      this.$apitator.query(this, {
        body: {
          query: `mutation($id: ID!){
            destroyConsoleImage(id: $id)
          }`,
          variables: {
            id: this.toDestroyImage.id
          }
        }
      }).then((response) => {
        this.destroyImageModal = false
        this.$store.commit('ADD_ALERT', {
          color: 'info',
          text: "Console image destroyed!"
        })
        this.fetchData()
      }).catch(() => {
        this.destroyImageModal = false
      })
    },
    downloadImage(image) {
      console.log(image)
    }
  },
  created() {
    this.$store.commit("SET_TITLE", "Console images");
    this.$store.commit("SET_LAYOUT", "dashboard");
  }
};
</script>
