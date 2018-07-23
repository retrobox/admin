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

      <v-data-table
    :headers="headers"
    :items="categories"
    hide-actions
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <td>
        <span v-bind:class="{'font-weight-bold': props.item.is_admin}">{{ props.item.title }}</span>
      </td>
      <td>
        <flag :iso="props.item.flag" /></td>
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
              <v-list-tile @click="">
                <v-list-tile-action>
                </v-list-tile-action>

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
                        <flag :iso="viewCategory.flag" />
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
                     <v-list-tile-title>{{viewCategory.created_at}}</v-list-tile-title>
                     <v-list-tile-sub-title>Created at</v-list-tile-sub-title>
                   </v-list-tile-content>
                 </v-list-tile>

                  <v-list-tile @click="">
                    <v-list-tile-action>
                    </v-list-tile-action>

                    <v-list-tile-content>
                      <v-list-tile-title>{{viewCategory.updated_at}}</v-list-tile-title>
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
  </div>
</template>

<script>
    export default {
        data() {
            return {
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
                  sortable: false,
                  value: 'locale'
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
            fetchData: function(){
                this.$apitator.query(this, {
                    body: {
                      query:`query{getManyShopCategories{id,locale,created_at,updated_at,title,is_customizable}}`
                    }
                }).then((response) => {
                    this.categories = this.mapFlags(response.data.data.getManyShopCategories)
                })
            },
            mapFlags: function (val) {
              if (!Array.isArray(val)) {
                val = [val]
              }
              return val.map((item) => {
                switch (item.locale) {
                  case 'en':
                    item.flag = 'gb'
                    break;

                  default:
                    item.flag = item.locale
                }
                return item
              })
            },
            viewItem (item) {
              this.$apitator.query(this, {
                  body: {
                    query:`query($id: String!){getOneShopCategory(id: $id){id,locale,created_at,updated_at,title,is_customizable}}`,
                    variables: {
                      id: item.id
                    }
                  }
              }).then((response) => {
                  this.viewDialog = true
                  this.viewCategory = this.mapFlags(response.data.data.getOneShopCategory)[0]
              })
            },
            deleteCategory () {
              this.deleteCategoryDialog = false
              this.$apitator.query(this, {
                  body: {
                    query:`mutation($id: String!){destroyShopCategory(id: $id)}`,
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
            }
        },
        created() {
            this.$store.commit('SET_TITLE', 'Shop Categories')
            this.$store.commit('SET_LAYOUT', 'dashboard')
        }
    }
</script>
