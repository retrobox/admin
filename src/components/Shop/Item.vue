<template>
<div class="item">
  <v-card class="mb-4">
    <v-card-text>
      <v-toolbar flat>
        <v-spacer />
        <v-btn icon color="info" @click="fetchData()">
          <v-icon>refresh</v-icon>
        </v-btn>
      </v-toolbar>
      <v-list two-line>
        <v-list-item>
          <v-list-item-action>
            <v-icon>label</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
            <v-list-item-subtitle>Name</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="$copyText(item.id)" ripple>
          <v-list-item-action />
          <v-list-item-content>
            <v-list-item-title>{{item.id}}</v-list-item-title>
            <v-list-item-subtitle>API Id</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action />
          <v-list-item-content>
            <v-list-item-title>
              <span v-if="item.version == null || item.version == ''">Unknown</span>
              <span v-else>{{item.version}}</span>
            </v-list-item-title>
            <v-list-item-subtitle>Version</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action />
          <v-list-item-content>
            <v-list-item-title>
              <span v-if="item.identifier == null || item.identifier == ''">Unknown</span>
              <span v-else>{{item.identifier}}</span>
            </v-list-item-title>
            <v-list-item-subtitle>Identifier</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action />
          <v-list-item-content>
            <v-list-item-title>
              <span v-if="item.show_version">Show version</span>
              <span v-else>Don't show version</span>
            </v-list-item-title>
            <v-list-item-subtitle>Show version ?</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action />
          <v-list-item-content>
            <v-list-item-title>
              <span v-if="item.allow_indexing">Allow indexing</span>
              <span v-else>Don't allow indexing</span>
            </v-list-item-title>
            <v-list-item-subtitle>Allow indexing ?</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action />
          <v-list-item-content>
            <v-list-item-title>
              {{item.slug}}
            </v-list-item-title>
            <v-list-item-subtitle>Slug</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item>
          <v-list-item-action>
            <v-icon>palette</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <span v-if="item.category.is_customizable">Customizable</span>
              <span v-else>
                    Not customizable
                </span>
            </v-list-item-title>
            <v-list-item-subtitle>Is customizable ?</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item ripple @click="$router.push({name:'ShopCategory', params: {id: item.category.id}})">
          <v-list-item-action>
            <v-icon>view_list</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{item.category.title}}
            </v-list-item-title>
            <v-list-item-subtitle>Category</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item>
          <v-list-item-action>
            <v-icon>local_shipping</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <span v-if="item.weight != null">{{item.weight}}</span>
              <span v-else>
                  No weight set
                </span>
            </v-list-item-title>
            <v-list-item-subtitle>Weight (g)</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item>
          <v-list-item-action>
            <v-icon>monetization_on</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{item.price}}
            </v-list-item-title>
            <v-list-item-subtitle>Price (€)</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item>
          <v-list-item-action>
            <v-icon>description</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{item.description_short}}
            </v-list-item-title>
            <v-list-item-subtitle>Short description</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <create-update :item="item" />
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn color="blue" text @click="$router.push({name: 'ShopItemEdit'})">
        <v-icon class="mr-2">edit</v-icon> Edit
      </v-btn>
      <v-spacer />
      <v-btn color="red" text @click="deleteItemDialog = true">
        <v-icon class="mr-2">delete</v-icon> Delete
      </v-btn>
    </v-card-actions>
  </v-card>

  <v-container grid-list-xl text-xs-center>
    <h2 class="display-1 mt-2 mb-5">Thumbnail</h2>
    <v-layout class="" row wrap justify-center>
      <v-flex xs12 md6 xl4>
        <v-card>
          <v-img :src="item.image" height="200px"></v-img>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn icon target="_blank" :href="item.image">
              <v-icon>open_in_new</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
  <v-container grid-list-xl text-xs-center>
    <h2 class="display-1 mb-5">Images</h2>
    <v-layout class="" row wrap>
      <v-flex xs12 md6 xl4 v-for="image in item.images" :key="image.id" class="mb-3">
        <v-card>
          <v-img :src="image.url" height="200px"></v-img>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn icon target="_blank" :href="image.url">
              <v-icon>open_in_new</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

  <v-dialog v-model="deleteItemDialog" max-width="500px">
    <v-card>
      <v-card-title>
        Really want to delete "{{item.title}}" ?
      </v-card-title>
      <v-card-actions>
        <v-btn color="primary" text @click.stop="deleteItemDialog=false">Close</v-btn>
        <v-btn color="red" text @click.stop="deleteItem()">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
export default {
  data: () => ({
    deleteItemDialog: false,
    deleteImageDialog: false,
    toDeleteImage: false,
    item: {
      category: {}
    }
  }),
  methods: {
    onMounted () {
      this.fetchData()
    },
    fetchData () {
      this.$apitator.query(this, {
        body: {
          query: `query ($id: String!) {
            getOneShopItem (id: $id) {
              id,
              description_short,
              description_long,
              created_at,
              updated_at,
              title,
              slug,
              price,
              weight,
              identifier,
              image,
              version,
              show_version,
              allow_indexing,
              images {id, url, is_main},
              category {id, title, is_customizable}
            }
          }`,
          variables: {
            id: this.$route.params.id
          }
        }
      }).then((response) => {
        this.item = response.data.data.getOneShopItem
      })
    },
    deleteItem () {
      this.deleteItemDialog = false
      this.$apitator.query(this, {
        body: {
          query: `mutation ($id: String!) {
            destroyShopItem(id: $id)
          }`,
          variables: { id: this.item.id }
        }
      }).then((response) => {
        this.$store.commit('ADD_ALERT', {
          color: 'info',
          text: 'Deleted a item!'
        })
        this.$router.push({
          name: 'ShopCategory',
          params: {
            id: this.item.category.id
          }
        })
      })
    },
    deleteImage () {
      this.deleteImageDialog = false
      this.$apitator.query(this, {
        body: {
          query: `mutation ($id: String!) {
            destroyShopImage(id: $id)
          }`,
          variables: {
            id: this.toDeleteImage.id
          }
        }
      }).then((response) => {
        this.$store.commit('ADD_ALERT', {
          color: 'info',
          text: 'Deleted a image!'
        })
        this.fetchData()
      })
    }
  },
  created () {
    this.$store.commit('SET_TITLE', 'Shop Item view details')
    this.$store.commit('SET_LAYOUT', 'dashboard')
  }
}
</script>
