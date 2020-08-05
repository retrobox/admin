<template>
  <div class="consoles">
    <v-data-table :headers="headers" :items="images" hide-default-footer class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <span class="px-3" v-if="images.length > 0">{{ images.length }} console image(s)</span>
          <v-spacer />
          <v-btn icon color="info" @click="fetchData()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn icon color="success" @click="openAddImageModal()">
            <v-icon>add</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.is_available="{ item }">
        <span
          v-if="item.is_available"
          class="green--text">
          PUBLIC
        </span>
        <span
          v-else
          class="red--text">
          PRIVATE
        </span>
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ item.created_at|subDate }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon small @click="viewImageDialog = true; toViewImage = item">
          <v-icon small>info</v-icon>
        </v-btn>
        <v-btn icon small @click="downloadImage(item)">
          <v-icon small>get_app</v-icon>
        </v-btn>
        <v-btn icon small color="info" @click="editImage(item)">
          <v-icon small>edit</v-icon>
        </v-btn>
        <v-btn icon small color="error" @click="openDestroyImageModal(item)">
          <v-icon small color="error">delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="viewImageDialog" max-width="500px">
      <v-card>
        <v-card-title>Image details</v-card-title>
        <v-card-text>
          <v-list two-line>
            <v-list-item @click="$copyText(toViewImage.id)" ripple>
              <v-list-item-action>
                <v-icon>label</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ toViewImage.id }}</v-list-item-title>
                <v-list-item-subtitle>API Id</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item @click="$copyText(toViewImage.version)" ripple>
              <v-list-item-action>
                <v-icon>label</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{toViewImage.version}}</v-list-item-title>
                <v-list-item-subtitle>Version slug</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="$copyText(toViewImage.console_version)" ripple>
              <v-list-item-action />
              <v-list-item-content>
                <v-list-item-title>{{ toViewImage.console_version }}</v-list-item-title>
                <v-list-item-subtitle>Console version</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="$copyText(toViewImage.software_version)" ripple>
              <v-list-item-action />
              <v-list-item-content>
                <v-list-item-title>{{ toViewImage.software_version }}</v-list-item-title>
                <v-list-item-subtitle>Software version</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item @click="$copyText(toViewImage.description)" ripple>
              <v-list-item-action>
                <v-icon>description</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ toViewImage.description }}</v-list-item-title>
                <v-list-item-subtitle>Description</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item @click="$copyText(toViewImage.size)" ripple>
              <v-list-item-action>
                <v-icon>attachment</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ toViewImage.size_formated }}</v-list-item-title>
                <v-list-item-subtitle>Size in megabytes</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item @click="$copyText(toViewImage.hash)" ripple>
              <v-list-item-action>
                <v-icon>fingerprint</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ toViewImage.hash }}</v-list-item-title>
                <v-list-item-subtitle>SHA-256 Hash</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <create-update :item="toViewImage" />
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click.stop="viewImageDialog = false">Close</v-btn>
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
            <v-text-field
              label="SHA-256 Hash"
              hint="Must be 64 characters long"
              persistent-hint
              v-model="toAddImage.hash" />
            <v-text-field
              class="mt-3"
              type="number"
              label="The image zip file size in megabytes"
              :hint="humanizeSize(toAddImage.size * 10 ** 6)"
              persistent-hint
              v-model="toAddImage.size" />
            <v-switch
              label="Mark the image as 'available'"
              hint="If true, the image will show up on the desktop app"
              persistent-hint
              v-model="toAddImage.is_available" />
            <v-textarea
              class="mt-3"
              label="Description"
              v-model="toAddImage.description" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" @click="storeImage()">Submit</v-btn>
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
            <v-text-field
              label="SHA-256 Hash"
              hint="Must be 64 characters long"
              persistent-hint
              v-model="toEditImage.hash" />
            <v-text-field
              class="mt-3"
              type="number"
              label="The image zip file size in megabytes"
              :hint="humanizeSize(toEditImage.size * 10**6)"
              persistent-hint
              v-model="toEditImage.size" />
            <v-switch
              label="Mark the image as 'available'"
              hint="If true, the image will show up on the desktop app"
              persistent-hint
              v-model="toEditImage.is_available" />
            <v-textarea
              class="mt-3"
              label="Description"
              v-model="toEditImage.description" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" @click="updateImage()">Save</v-btn>
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
          <v-btn text color="error" @click="destroyImage()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    toViewImage: {},
    viewImageDialog: false,
    images: [],
    headers: [
      {
        text: 'Id',
        align: 'left',
        sortable: false,
        value: 'id'
      },
      {
        text: 'Console version',
        align: 'left',
        sortable: false,
        value: 'console_version'
      },
      {
        text: 'Software version',
        align: 'left',
        sortable: false,
        value: 'software_version'
      },
      {
        text: 'Version',
        align: 'left',
        sortable: false,
        value: 'version'
      },
      {
        text: 'Public?',
        align: 'left',
        sortable: false,
        value: 'is_available'
      },
      {
        text: 'Created at',
        align: 'left',
        sortable: true,
        value: 'created_at'
      },
      { text: 'Actions', value: 'actions', sortable: false, align: 'right' }
    ],
    addImageModal: false,
    toAddImage: {
      console_version: '',
      software_version: ''
    },
    editImageModal: false,
    toEditImage: {},
    destroyImageModal: false,
    toDestroyImage: {},
    consoleVersions: []
  }),
  methods: {
    onMounted () {
      this.fetchData()
    },
    humanizeSize (bytes) {
      var thresh = 1000
      if (Math.abs(bytes) < thresh) {
        return bytes + ' B'
      }
      var units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      var u = -1
      do {
        bytes /= thresh
        ++u
      } while (Math.abs(bytes) >= thresh && u < units.length - 1)
      return bytes.toFixed(1) + ' ' + units[u]
    },
    fetchData () {
      this.$store.commit('SET_LOADING', true)
      this.$apitator
        .query(this, {
          body: {
            query: `query {
              getManyConsoleImages(all: true) {
                id
                console_version
                software_version
                version
                hash
                size
                is_available
                description
                url
                created_at
                updated_at
              }
            }`
          }
        })
        .then(response => {
          this.images = response.data.data.getManyConsoleImages.map(image => {
            image.size_formated = this.humanizeSize(image.size * 10 ** 6)
            return image
          })
        })
    },
    openAddImageModal () {
      this.$apitator
        .query(this, { body: { query: 'query { getConsoleVersions { id } }' } })
        .then(response => {
          this.consoleVersions = response.data.data.getConsoleVersions.map(version => {
            return { value: version.id, text: version.id }
          })
          this.toAddImage.console_version = this.consoleVersions[this.consoleVersions.length - 1].value
          this.addImageModal = true
        })
    },
    storeImage () {
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
              image: this.toAddImage
            }
          }
        })
        .then(response => {
          this.$store.commit('ADD_ALERT', {
            color: 'success',
            text: 'Created a console image!'
          })
          this.addImageModal = false
          this.fetchData()
        })
    },
    updateImage () {
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
                size: this.toEditImage.size,
                hash: this.toEditImage.hash,
                is_available: this.toEditImage.is_available,
                description: this.toEditImage.description
              }
            }
          }
        })
        .then(response => {
          this.$store.commit('ADD_ALERT', {
            color: 'success',
            text: 'Updated a console image!'
          })
          this.editImageModal = false
          this.fetchData()
        })
    },
    editImage (image) {
      this.editImageModal = true
      this.toEditImage = image
    },
    openDestroyImageModal (item) {
      this.destroyImageModal = true
      this.toDestroyImage = item
    },
    destroyImage () {
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
          text: 'Console image destroyed!'
        })
        this.fetchData()
      }).catch(() => {
        this.destroyImageModal = false
      })
    },
    downloadImage (image) {
      window.open(image.url, '_blank').focus()
    }
  },
  created () {
    this.$store.commit('SET_TITLE', 'Console images')
    this.$store.commit('SET_LAYOUT', 'dashboard')
  }
}
</script>
