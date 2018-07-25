<template>
<div class="item">
  <v-layout align-center justify-end row fill-height>
    <v-btn icon @click="fetchData()">
      <v-icon>refresh</v-icon>
    </v-btn>
  </v-layout>
  <v-card class="mb-4">
    <v-card-text>
      <v-list two-line>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>label</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{item.title}}</v-list-tile-title>
            <v-list-tile-sub-title>Name</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="">
          <v-list-tile-action />
          <v-list-tile-content>
            <v-list-tile-title>{{item.id}}</v-list-tile-title>
            <v-list-tile-sub-title>API Id</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="">
          <v-list-tile-action />
          <v-list-tile-content>
            <v-list-tile-title>
              {{item.version}}
            </v-list-tile-title>
            <v-list-tile-sub-title>Version</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="">
          <v-list-tile-action />
          <v-list-tile-content>
            <v-list-tile-title>
              <span v-if="item.show_version">Show version</span>
              <span v-else>Don't show version</span>
            </v-list-tile-title>
            <v-list-tile-sub-title>Show version ?</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="">
          <v-list-tile-action />
          <v-list-tile-content>
            <v-list-tile-title>
              {{item.slug}}
            </v-list-tile-title>
            <v-list-tile-sub-title>Slug</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider inset></v-divider>

        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>palette</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              <span v-if="item.category.is_customizable">Customizable</span>
              <span v-else>
                    Not customizable
                </span>
            </v-list-tile-title>
            <v-list-tile-sub-title>Is customizable ?</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider inset></v-divider>

        <v-list-tile ripple @click="$router.push({name:'ShopCategory', params: {id: item.category.id}})">
          <v-list-tile-action>
            <v-icon>view_list</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{item.category.title}}
            </v-list-tile-title>
            <v-list-tile-sub-title>Category</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider inset></v-divider>

        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>local_shipping</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              <span v-if="item.weight != null">{{item.weight}}</span>
              <span v-else>
                  No weight set
                </span>
            </v-list-tile-title>
            <v-list-tile-sub-title>Weight (g)</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider inset></v-divider>

        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>monetization_on</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{item.price}}
            </v-list-tile-title>
            <v-list-tile-sub-title>Price (€)</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider inset></v-divider>

        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>description</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{item.description_short}}
            </v-list-tile-title>
            <v-list-tile-sub-title>Short description</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider inset></v-divider>

        <create-update :item="item" />
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn color="blue" flat @click="$router.push({name: 'ShopItemEdit'})">
        <v-icon class="mr-2">edit</v-icon> Edit</v-btn>
      <v-btn color="red" flat @click="deleteItemDialog = true">
        <v-icon class="mr-2">delete</v-icon> Delete</v-btn>
    </v-card-actions>
  </v-card>

  <v-container grid-list-xl text-xs-center>
    <h2 class="display-1 mt-2 mb-5">Thumbnail</h2>
    <v-layout class="" row wrap justify-center>
      <v-flex xs12 md6 xl4>
        <v-card>
          <v-card-media :src="item.image" height="200px"></v-card-media>
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
          <v-card-media :src="image.url" height="200px"></v-card-media>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn icon @click="deleteImageDialog=true; toDeleteImage=image">
              <v-icon>delete</v-icon>
            </v-btn>
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
        <v-btn color="primary" flat @click.stop="deleteItemDialog=false">Close</v-btn>
        <v-btn color="red" flat @click.stop="deleteItem()">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deleteImageDialog" max-width="500px">
    <v-card>
      <v-card-title>
        Really want to delete this image ?
      </v-card-title>
      <v-card-actions>
        <v-btn color="primary" flat @click.stop="deleteImageDialog=false">Close</v-btn>
        <v-btn color="red" flat @click.stop="deleteImage()">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      deleteItemDialog: false,
      deleteImageDialog: false,
      toDeleteImage: false,
      item: {
        category: {}
      }
    }
  },
  methods: {
    onMounted: function() {
      this.fetchData()
    },
    fetchData: function() {
      this.$apitator.query(this, {
        body: {
          query: `query($id: String!){
            getOneShopItem(id: $id){
              id,
              description_short,
              description_long,
              created_at,
              updated_at,
              title,
              slug,
              price,
              weight,
              image,
              version,
              show_version,
              images{id, url, is_main},
              category{id, title, is_customizable}
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
    deleteItem() {
      this.deleteItemDialog = false
      this.$apitator.query(this, {
        body: {
          query: `mutation($id: String!){destroyShopItem(id: $id)}`,
          variables: {
            id: this.item.id
          }
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
    deleteImage() {
      this.deleteImageDialog = false
      this.$apitator.query(this, {
        body: {
          query: `mutation($id: String!){destroyShopImage(id: $id)}`,
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
  created() {
    this.$store.commit('SET_TITLE', 'Shop Item view details')
    this.$store.commit('SET_LAYOUT', 'dashboard')
  }
}
</script>
