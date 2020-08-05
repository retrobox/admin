<template>
  <div class="category">
    <div>
      <v-card class="mb-4">
        <v-card-text>
          <v-list two-line>
            <v-list-item>
              <v-list-item-action>
                <v-icon>label</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{category.title}}</v-list-item-title>
                <v-list-item-subtitle>Name</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="$copyText(category.id)" ripple>
              <v-list-item-action />
              <v-list-item-content>
                <v-list-item-title>{{category.id}}</v-list-item-title>
                <v-list-item-subtitle>API Id</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item>
              <v-list-item-action>
                <v-icon>palette</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  <span v-if="category.is_customizable">Customizable</span>
                  <span v-else>Not customizable</span>
                </v-list-item-title>
                <v-list-item-subtitle>Is customizable ?</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item>
              <v-list-item-action>
                <v-icon>flag</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  <flag :iso="category.locale | flag" />
                </v-list-item-title>
                <v-list-item-subtitle>Locale</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <create-update :item="category" />
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue" text @click="$router.push({name: 'ShopCategoryEdit'})">
            <v-icon class="mr-2">edit</v-icon>Edit
          </v-btn>
          <v-spacer />
          <v-btn color="red" text @click="deleteCategoryDialog = true; toDeleteCategory = category">
            <v-icon class="mr-2">delete</v-icon>Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <v-data-table :headers="headers" :items="category.items" hide-default-footer class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <span>{{ category.items_count }} items</span>
          <v-spacer />
          <v-btn icon color="info" @click="fetchData()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn
            icon color="success"
            @click="$router.push({ name: 'ShopItemCreate', params: { id: category.id } })"
          >
            <v-icon>add</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon small @click="viewItem(item)">
          <v-icon small>info</v-icon>
        </v-btn>
        <v-btn
          icon small
          @click="$router.push({ name: 'ShopItem', params: { id: item.id } })">
          <v-icon small>view_list</v-icon>
        </v-btn>
        <v-btn
          icon small color="info"
          @click="$router.push({ name: 'ShopItemEdit', params: { id: item.id } })"
        >
          <v-icon small>edit</v-icon>
        </v-btn>
        <v-btn
          icon small color="error"
          @click="toDeleteItem = item; deleteItemDialog = true">
          <v-icon small>delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="viewDialog" max-width="500px">
      <v-card>
        <v-card-text>
          <v-list two-line>
            <v-list-item>
              <v-list-item-action>
                <v-icon>label</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{toViewItem.title}}</v-list-item-title>
                <v-list-item-subtitle>Name</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="$copyText(toViewItem.id)" ripple>
              <v-list-item-action />
              <v-list-item-content>
                <v-list-item-title>{{toViewItem.id}}</v-list-item-title>
                <v-list-item-subtitle>API Id</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action />
              <v-list-item-content>
                <v-list-item-title>{{toViewItem.version}}</v-list-item-title>
                <v-list-item-subtitle>Version</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action />
              <v-list-item-content>
                <v-list-item-title>
                  <span v-if="toViewItem.show_version">Show version</span>
                  <span v-else>Don't show version</span>
                </v-list-item-title>
                <v-list-item-subtitle>Version</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action />
              <v-list-item-content>
                <v-list-item-title>
                  <span v-if="toViewItem.allow_indexing">Allow indexing</span>
                  <span v-else>Don't allow indexing</span>
                </v-list-item-title>
                <v-list-item-subtitle>Allow indexing ?</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item>
              <v-list-item-action>
                <v-icon>local_shipping</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  <span v-if="toViewItem.weight != null">{{toViewItem.weight}}</span>
                  <span v-else>No weight set</span>
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
                <v-list-item-title>{{toViewItem.price}}</v-list-item-title>
                <v-list-item-subtitle>Price (€)</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item>
              <v-list-item-action>
                <v-icon>description</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{toViewItem.description_short}}</v-list-item-title>
                <v-list-item-subtitle>Short description</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <create-update :item="toViewItem" />
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" text @click.stop="viewDialog=false">Close</v-btn>
          <v-spacer />
          <v-btn
            color="primary" text
            @click.stop="$router.push({name: 'ShopItem', params: {id: toViewItem.id}})">
            More details
          </v-btn>
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
    <v-dialog v-model="deleteItemDialog" max-width="500px">
      <v-card>
        <v-card-title>Really want to delete "{{toDeleteItem.title}}" ?</v-card-title>
        <v-card-actions>
          <v-btn color="primary" text @click.stop="deleteItemDialog=false">Close</v-btn>
          <v-spacer />
          <v-btn color="red" text @click.stop="deleteItem()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    viewDialog: false,
    toViewItem: {},
    deleteCategoryDialog: false,
    toDeleteCategory: {},
    deleteItemDialog: false,
    toDeleteItem: {},
    category: {},
    headers: [
      {
        text: 'Name',
        align: 'left',
        sortable: false,
        value: 'title'
      },
      {
        text: 'Identifier',
        align: 'left',
        sortable: false,
        value: 'identifier'
      },
      {
        text: 'Price',
        align: 'left',
        sortable: false,
        value: 'price'
      },
      {
        text: 'Actions',
        align: 'right',
        value: 'actions',
        sortable: false
      }
    ]
  }),
  methods: {
    onMounted () {
      this.fetchData()
    },
    fetchData () {
      this.$apitator
        .query(this, {
          body: {
            query: `query ($id: String!) {
              getOneShopCategory (id: $id) {
                id, locale, created_at, updated_at, items_count, title,
                is_customizable,
                items { title, price, version, identifier, id }
              }
            }`,
            variables: { id: this.$route.params.id }
          }
        })
        .then((response) => {
          this.category = response.data.data.getOneShopCategory
        })
    },
    viewItem (item) {
      this.$apitator
        .query(this, {
          body: {
            query: `query ($id: String!) {
              getOneShopItem (id: $id) {
                title, price, version, id, weight, description_short, image, created_at, updated_at, show_version, allow_indexing
              }
            }`,
            variables: { id: item.id }
          }
        })
        .then((response) => {
          this.toViewItem = response.data.data.getOneShopItem
          this.viewDialog = true
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
            variables: { id: this.$route.params.id }
          }
        })
        .then((response) => {
          this.$store.commit('ADD_ALERT', {
            color: 'info',
            text: 'Deleted a category!'
          })
          this.$router.push({ name: 'ShopCategories' })
        })
    },
    deleteItem () {
      this.deleteItemDialog = false
      this.$apitator
        .query(this, {
          body: {
            query: `mutation ($id: String!) {
              destroyShopItem (id: $id)
            }`,
            variables: { id: this.toDeleteItem.id }
          }
        })
        .then((response) => {
          this.$store.commit('ADD_ALERT', {
            color: 'info',
            text: 'Deleted a item!'
          })
          this.fetchData()
        })
    }
  },
  created () {
    this.$store.commit('SET_TITLE', 'Shop Category view details')
    this.$store.commit('SET_LAYOUT', 'dashboard')
  }
}
</script>
