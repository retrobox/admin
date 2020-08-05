<template>
  <div class="categories">
    <v-data-table :headers="headers" :items="categories" hide-default-footer class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer />
          <v-btn icon @click="$router.push({name: 'ShopCategoriesOrder'})">
            <v-icon>import_export</v-icon>
          </v-btn>
          <v-btn icon color="info" @click="fetchData()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn icon color="success" @click="$router.push({name: 'ShopCategoryCreate'})">
            <v-icon>add</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.locale="{ item }">
        <flag :iso="item.locale | flag" />
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          icon small
          @click="viewItem(item)">
          <v-icon small>info</v-icon>
        </v-btn>
        <v-btn
          icon small
          @click="$router.push({ name: 'ShopCategory', params: { id: item.id } })"
        >
          <v-icon small>view_list</v-icon>
        </v-btn>
        <v-btn
          icon small color="info"
          @click="$router.push({ name: 'ShopCategoryEdit', params: { id: item.id } })"
        >
          <v-icon small>edit</v-icon>
        </v-btn>
        <v-btn
          icon small color="error"
          @click="deleteCategoryDialog = true; toDeleteCategory = item"
        >
          <v-icon small>delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="viewDialog" max-width="500px">
      <v-card>
        <v-card-title>Category details</v-card-title>
        <v-card-text>
          <v-list>
            <v-divider />

            <v-list-item>
              <v-list-item-icon>
                <v-icon>label</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ viewCategory.title }}</v-list-item-title>
                <v-list-item-subtitle>Name</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="$copyText(viewCategory.id)" ripple>
              <v-list-item-icon />
              <v-list-item-content>
                <v-list-item-title>{{viewCategory.id}}</v-list-item-title>
                <v-list-item-subtitle>API Id</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider />

            <v-list-item>
              <v-list-item-icon>
                <v-icon>palette</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  <span v-if="viewCategory.is_admin">Customizable</span>
                  <span v-else>Not customizable</span>
                </v-list-item-title>
                <v-list-item-subtitle>Is customizable ?</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider />

            <v-list-item>
              <v-list-item-icon>
                <v-icon>flag</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ viewCategory.locale }}
                </v-list-item-title>
                <v-list-item-subtitle>Locale</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider />

            <create-update :item="viewCategory" />

            <v-divider />
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click.stop="viewDialog=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteCategoryDialog" max-width="500px">
      <v-card>
        <v-card-title>Really want to delete "{{toDeleteCategory.title}}" ?</v-card-title>
        <v-card-actions>
          <v-btn color="primary" text @click.stop="deleteCategoryDialog=false">Close</v-btn>
          <v-spacer />
          <v-btn color="red" text @click.stop="deleteCategory()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    viewDialog: false,
    viewCategory: {},
    categories: [],
    headers: [
      {
        text: 'Name',
        align: 'left',
        sortable: false,
        value: 'title'
      },
      {
        text: 'Locale',
        align: 'left',
        sortable: true,
        value: 'locale'
      },
      {
        text: 'Items',
        align: 'left',
        sortable: true,
        value: 'items_count'
      },
      {
        text: 'Actions',
        align: 'left',
        value: 'actions',
        sortable: false
      }
    ],
    deleteCategoryDialog: false,
    toDeleteCategory: ''
  }),
  methods: {
    onMounted () {
      this.fetchData()
    },
    fetchData () {
      this.$apitator
        .query(this, {
          body: {
            query: `query {
              getManyShopCategories {
                id,locale,items_count,created_at,updated_at,title,is_customizable
              }
            }`
          }
        })
        .then((response) => {
          this.categories = response.data.data.getManyShopCategories
        })
    },
    viewItem (item) {
      this.$apitator
        .query(this, {
          body: {
            query: `query ($id: String!) {
              getOneShopCategory (id: $id) {
                id,locale,created_at,updated_at,title,is_customizable
              }
            }`,
            variables: { id: item.id }
          }
        })
        .then((response) => {
          this.viewDialog = true
          this.viewCategory = response.data.data.getOneShopCategory
        })
    },
    deleteCategory () {
      this.deleteCategoryDialog = false
      this.$apitator
        .query(this, {
          body: {
            query: `mutation ($id: String!) {
              destroyShopCategory(id: $id)
            }`,
            variables: { id: this.toDeleteCategory.id }
          }
        })
        .then((response) => {
          this.$store.commit('ADD_ALERT', {
            color: 'info',
            text: 'Deleted a category!'
          })
          this.fetchData()
        })
    }
  },
  created () {
    this.$store.commit('SET_TITLE', 'Shop Categories')
    this.$store.commit('SET_LAYOUT', 'dashboard')
  }
}
</script>
