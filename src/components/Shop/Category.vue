<template>
<div class="category">
  <div>
    <v-card class="mb-4">
      <v-card-text>
        <v-list two-line>
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>label</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{category.title}}</v-list-tile-title>
              <v-list-tile-sub-title>Name</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="">
            <v-list-tile-action />
            <v-list-tile-content>
              <v-list-tile-title>{{category.id}}</v-list-tile-title>
              <v-list-tile-sub-title>API Id</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>palette</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                <span v-if="category.is_customizable">Customizable</span>
                <span v-else>
                    Not customizable
                </span>
              </v-list-tile-title>
              <v-list-tile-sub-title>Is customizable ?</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>flag</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                <flag :iso="category.locale | flag" />
              </v-list-tile-title>
              <v-list-tile-sub-title>Locale</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>update</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{category.created_at}}</v-list-tile-title>
              <v-list-tile-sub-title>Created at</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="">
            <v-list-tile-action>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{category.updated_at}}</v-list-tile-title>
              <v-list-tile-sub-title>Updated at</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue" flat @click="$router.push({name: 'ShopCategoryEdit'})">
          <v-icon class="mr-2">edit</v-icon> Edit</v-btn>
        <v-btn color="red" flat @click="deleteCategoryDialog = true; toDeleteCategory = category">
          <v-icon class="mr-2">delete</v-icon> Delete</v-btn>
      </v-card-actions>
    </v-card>
  </div>
  <v-layout align-center justify-end row fill-height>
    <v-tooltip top>
      <v-btn icon @click="$router.push({name: 'ShopItemCreate', params: {id: category.id}})" slot="activator">
        <v-icon>add</v-icon>
      </v-btn>
      <span>Create a item in this category</span>
    </v-tooltip>
    <v-btn icon @click="fetchData()">
      <v-icon>refresh</v-icon>
    </v-btn>
  </v-layout>

  <v-data-table :headers="headers" :items="category.items" hide-actions class="elevation-1">
    <template slot="items" slot-scope="props">
      <td>
        {{props.item.title}}
      </td>
      <td>
        {{props.item.version}}
      </td>
      <td>
        {{props.item.price}}
      </td>
      <td class="justify-center align-center layout px-0">
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
          @click="toDeleteItem=props.item; deleteItemDialog=true">
            <v-icon
            small
            >
              delete
            </v-icon>
          </v-btn>
        </td>
    </template>
  </v-data-table>
  <v-dialog v-model="viewDialog" max-width="500px">
    <v-card>
      <v-card-text>
        <v-list two-line>

          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>label</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{toViewItem.title}}</v-list-tile-title>
              <v-list-tile-sub-title>Name</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="">
            <v-list-tile-action />
            <v-list-tile-content>
              <v-list-tile-title>{{toViewItem.id}}</v-list-tile-title>
              <v-list-tile-sub-title>API Id</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="">
            <v-list-tile-action />
            <v-list-tile-content>
              <v-list-tile-title>{{toViewItem.version}}</v-list-tile-title>
              <v-list-tile-sub-title>Version</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="">
            <v-list-tile-action />
            <v-list-tile-content>
              <v-list-tile-title>
                <span v-if="toViewItem.show_version">Show version</span>
                <span v-else>Don't show version</span>
              </v-list-tile-title>
              <v-list-tile-sub-title>Version</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>local_shipping</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                <span v-if="toViewItem.weight != null">{{toViewItem.weight}}</span>
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
                {{toViewItem.price}}
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
                {{toViewItem.description_short}}
              </v-list-tile-title>
              <v-list-tile-sub-title>Short description</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile>
            <v-list-tile-action>
              <v-icon>update</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{toViewItem.created_at | humanizeMoment}}</v-list-tile-title>
              <v-list-tile-sub-title>Created at</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-action>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{toViewItem.updated_at | humanizeMoment}}</v-list-tile-title>
              <v-list-tile-sub-title>Updated at</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" flat @click.stop="viewDialog=false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="deleteCategoryDialog" max-width="500px">
    <v-card>
      <v-card-title>
        Really want to delete "{{toDeleteCategory.title}}" ?
      </v-card-title>
      <v-card-actions>
        <v-btn color="primary" flat @click.stop="deleteCategoryDialog=false">Close</v-btn>
        <v-btn color="red" flat @click.stop="deleteCategory()">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="deleteItemDialog" max-width="500px">
    <v-card>
      <v-card-title>
        Really want to delete "{{toDeleteItem.title}}" ?
      </v-card-title>
      <v-card-actions>
        <v-btn color="primary" flat @click.stop="deleteItemDialog=false">Close</v-btn>
        <v-btn color="red" flat @click.stop="deleteItem()">Delete</v-btn>
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
      viewDialog: false,
      toViewItem: {},
      deleteCategoryDialog: false,
      toDeleteCategory: {},
      deleteItemDialog: false,
      toDeleteItem: {},
      category: {},
      headers: [{
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'title'
        },
        {
          text: 'Version',
          align: 'left',
          sortable: false,
          value: 'version'
        },
        {
          text: 'Price',
          align: 'left',
          sortable: false,
          value: 'price'
        }
      ],
    }
  },
  methods: {
    onMounted: function() {
      this.fetchData()
    },
    fetchData: function() {
      this.$apitator.query(this, {
        body: {
          query: `query($id: String!){getOneShopCategory(id: $id){id,locale,created_at,updated_at,title,is_customizable,items{title, price, version, id}}}`,
          variables: {
            id: this.$route.params.id
          }
        }
      }).then((response) => {
        this.category = response.data.data.getOneShopCategory
        this.category.created_at = moment(this.category.created_at).fromNow()
        this.category.updated_at = moment(this.category.updated_at).fromNow()
      })
    },
    viewItem(item) {
      this.$apitator.query(this, {
        body: {
          query: `query ($id: String!){getOneShopItem(id: $id){title, price, version, id, weight, description_short, image, created_at, updated_at}}`,
          variables: {
            id: item.id
          }
        }
      }).then((response) => {
        this.toViewItem = response.data.data.getOneShopItem
        this.viewDialog = true
      })
    },
    deleteCategory() {
      this.deleteCategoryDialog = false
      this.$apitator.query(this, {
        body: {
          query: `mutation($id: String!){destroyShopCategory(id: $id)}`,
          variables: {
            id: this.$route.params.id
          }
        }
      }).then((response) => {
        this.$store.commit('ADD_ALERT', {
          color: 'info',
          text: 'Deleted a category!'
        })
        this.$router.push({
          name: 'ShopCategories'
        })
      })
    },
    deleteItem() {
      this.deleteItemDialog = false
      this.$apitator.query(this, {
        body: {
          query: `mutation($id: String!){destroyShopItem(id: $id)}`,
          variables: {
            id: this.toDeleteItem.id
          }
        }
      }).then((response) => {
        this.$store.commit('ADD_ALERT', {
          color: 'info',
          text: 'Deleted a item!'
        })
        this.fetchData()
      })
    }
  },
  created() {
    this.$store.commit('SET_TITLE', 'Shop Category view details')
    this.$store.commit('SET_LAYOUT', 'dashboard')
  }
}
</script>
