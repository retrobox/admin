<template>
<div class="categories">
  <v-layout align-center justify-end row fill-height>
    <v-btn icon @click="$router.push({name: 'ShopCategoryCreate'})">
      <v-icon>add</v-icon>
    </v-btn>
    <v-btn icon @click="fetchData()">
      <v-icon>refresh</v-icon>
    </v-btn>
  </v-layout>

  <v-data-table :headers="headers" :items="categories" hide-actions class="elevation-1">
    <template slot="items" slot-scope="props">
      <td>
        <span v-bind:class="{'font-weight-bold': props.item.is_admin}">{{ props.item.title }}</span>
      </td>
      <td>
        <flag :iso="props.item.locale | flag" />
      </td>
      <td>
        {{ props.item.order }}
      </td>
      <td class="justify-end align-center layout px-2">

        <v-btn
        icon
        small
        @click="down(props.item)">
          <v-icon
          small
          >
            arrow_downward
          </v-icon>
        </v-btn>

        <v-btn
        icon
        small
        @click="up(props.item)">
          <v-icon
          small
          >
            arrow_upward
          </v-icon>
        </v-btn>
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
          @click="$router.push({name: 'ShopCategory', params: {id: props.item.id}})">
            <v-icon
            small
            >
              view_list
            </v-icon>
          </v-btn>
          <v-btn
          icon
          small
          @click="$router.push({name: 'ShopCategoryEdit', params: {id: props.item.id}})">
            <v-icon
            small
            >
              edit
            </v-icon>
          </v-btn>
          <v-btn
          icon
          small
          @click="deleteCategoryDialog = true; toDeleteCategory = props.item">
            <v-icon
            small
            >
              delete
            </v-icon>
          </v-btn>
        </td>
    </template>
  </v-data-table>

  <v-layout align-center justify-end row fill-height class="mt-2">
    <v-btn @click="$router.push({name: 'ShopCategories'})" ripple>
      Cancel
    </v-btn>
    <v-btn @click="submit()" ripple color="primary">
      Submit
    </v-btn>
  </v-layout>

  <v-dialog v-model="viewDialog" max-width="500px">
    <v-card>
      <v-card-text>
        <v-list two-line>
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>label</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{viewCategory.title}}</v-list-tile-title>
              <v-list-tile-sub-title>Name</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="$copyText(viewCategory.id)" ripple>
            <v-list-tile-action />
            <v-list-tile-content>
              <v-list-tile-title>{{viewCategory.id}}</v-list-tile-title>
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
                <span v-if="viewCategory.is_admin">Customizable</span>
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
                <flag :iso="viewCategory.locale | flag" />
              </v-list-tile-title>
              <v-list-tile-sub-title>Locale</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

          <create-update :item="viewCategory" />
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
</div>
</template>

<script>
export default {
  data() {
    return {
      viewDialog: false,
      viewCategory: {},
      categories: [],
      headers: [{
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'title'
        },
        {
          text: 'Locale',
          align: 'left',
          sortable: false,
          value: 'locale'
        },
        {
          text: 'Order',
          align: 'left',
          sortable: true,
          value: 'order'
        },
        {
          text: 'Actions',
          align: 'right',
          value: 'id',
          sortable: false
        }
      ],
      deleteCategoryDialog: false,
      toDeleteCategory: ""
    }
  },
  methods: {
    onMounted: function() {
      this.fetchData()
    },
    fetchData: function() {
      this.$apitator.query(this, {
        body: {
          query: `query{getManyShopCategories(orderBy: "order", orderDir: "asc"){id,locale,order,items_count,created_at,updated_at,title,is_customizable}}`
        }
      }).then((response) => {
        this.categories = response.data.data.getManyShopCategories

        this.categories = this.categories.map((item, index) => {
          if (
            this.categories.filter((item) => {
              return item.order == 0
            }).length > 1
          ) {
            item.order = index
          }
          return item
        })
      })
    },
    viewItem(item) {
      this.$apitator.query(this, {
        body: {
          query: `query($id: String!){getOneShopCategory(id: $id){id,locale,created_at,updated_at,title,is_customizable}}`,
          variables: {
            id: item.id
          }
        }
      }).then((response) => {
        this.viewDialog = true
        this.viewCategory = response.data.data.getOneShopCategory
      })
    },
    deleteCategory() {
      this.deleteCategoryDialog = false
      this.$apitator.query(this, {
        body: {
          query: `mutation($id: String!){destroyShopCategory(id: $id)}`,
          variables: {
            id: this.toDeleteCategory.id
          }
        }
      }).then((response) => {
        this.$store.commit('ADD_ALERT', {
          color: 'info',
          text: 'Deleted a category!'
        })
        this.fetchData()
      })
    },
    up(item) {
      var index = this.categories.indexOf(item)
      if (item.order > 0) {
        var toReplace = this.categories.indexOf(this.categories.filter((_item) => {
          return _item.order == item.order - 1
        })[0])
        var order = this.categories[toReplace].order
        this.categories[toReplace].order = item.order
        item.order = order
      }
    },
    down(item) {
      var index = this.categories.indexOf(item)
      if (item.order < this.categories.length - 1) {
        var toReplace = this.categories.indexOf(this.categories.filter((_item) => {
          return _item.order == item.order + 1
        })[0])
        var order = this.categories[toReplace].order
        this.categories[toReplace].order = item.order
        item.order = order
      }
    },
    submit(item) {
      this.$apitator.query(this, {
          body: {
            query:`mutation($categories: [ShopCategoryUpdateOrderInput]!){updateShopCategoriesOrder(categories: $categories)}`,
            variables: {
              categories: this.categories.map((item) => {
                return {
                  id: item.id,
                  order: item.order
                }
              })
            }
          }
      }).then((response) => {
        this.$store.commit('ADD_ALERT', {
          color: 'success',
          text: 'Updated the order!'
        })
        this.categories = []
        this.fetchData()
      })
    }
  },
  created() {
    this.$store.commit('SET_TITLE', 'Order shop categories')
    this.$store.commit('SET_LAYOUT', 'dashboard')
  }
}
</script>