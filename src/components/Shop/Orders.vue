<template>
  <div class="orders">
    <v-data-table :headers="headers" :items="orders" hide-default-footer class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-btn icon color="info" @click="fetchData()">
            <v-icon>refresh</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.user="{ item }">
        <div v-if="item.user !== null">
          <v-avatar size="20" class="mr-2">
            <img :src="item.user.last_avatar" alt="">
          </v-avatar>
          {{ item.user.last_username }}
        </div>
      </template>
      <template v-slot:item.way="{ item }">
        {{ item.way|capitalize }}
      </template>
      <template v-slot:item.status="{ item }">
        {{ item.status|capitalize }}
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ item.created_at|subDate }}
      </template>
      <template v-slot:item.total="{ item }">
        € {{ item.total_price }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          icon small
          @click="viewOrderDialog(item)">
          <v-icon small>info</v-icon>
        </v-btn>
        <v-btn
          icon small color="info"
          @click="viewOrderEdit(item)">
          <v-icon small>edit</v-icon>
        </v-btn>
        <v-btn
          icon small color="error"
          @click="openDestroyOrderModal(item)">
          <v-icon small>delete</v-icon>
        </v-btn>
        <v-tooltip top v-if="item.bill_url != null">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              icon small
              @click="openBill(item)">
              <v-icon small>receipt</v-icon>
            </v-btn>
          </template>
          <span>Open bill (or receipt)</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>
          Edit order #"{{editOrder.id}}"
        </v-card-title>
        <v-card-text>
          <!-- <form v-if="editOrder.status === 'payed' || editOrder.status === 'shipped'">
            <v-switch
              label="Is shipped ?"
              v-model="to_edit_shipped">

            </v-switch>
          </form>
          <div v-if="editOrder.status !== 'payed'">
            No actions available
          </div>
           -->
           <b>
             ⚠️ PLEASE BE CAREFUL, BY CHANGING THE STATUS TO SHIPPED YOU WILL SEND AN EMAIL TO CUSTOMER ⚠️
           </b>
           <br>
           <br>
          <v-select
            :items="selectStatus"
            v-model="editOrder.status"
            label="Status"
          ></v-select>
          <v-text-field
            label="Shipping id (or shipping tracking link)"
            v-model="editOrder.shipping_id"
            :disabled="editOrder.status === 'payed'"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" text @click.stop="editDialog=false">Close</v-btn>
          <v-spacer />
          <v-btn color="primary" text @click.stop="saveEditOrder()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="viewDialog" max-width="500px">
      <v-card>
        <v-card-text>
          <v-list two-line>
            <v-list-item @click="$copyText(viewOrder.id)" ripple>
              <v-list-item-action>
                <v-icon>label</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{viewOrder.id}}</v-list-item-title>
                <v-list-item-subtitle>API Id</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item>
              <v-list-item-action>
                <v-icon>list</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Sub total</v-list-item-title>
                <v-list-item-subtitle>€ {{viewOrder.sub_total_price}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-icon>local_shipping</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Shipping price</v-list-item-title>
                <v-list-item-subtitle>€ {{viewOrder.total_shipping_price}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Shipping method</v-list-item-title>
                <v-list-item-subtitle>
                  {{ viewOrder.shipping_method|capitalize }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-icon>attach_money</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Total</v-list-item-title>
                <v-list-item-subtitle>€ {{viewOrder.total_price}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item>
              <v-list-item-action>
                <v-icon>payment</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Payment method</v-list-item-title>
                <v-list-item-subtitle>{{viewOrder.way|capitalize}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item>
              <v-list-item-action>
                <v-icon>info</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Status</v-list-item-title>
                <v-list-item-subtitle>{{viewOrder.status|capitalize}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item class="auto-height" v-if="viewOrder.note !== null && viewOrder.note !== ''">
              <v-list-item-action>
                <v-icon>speaker_notes</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Order note</v-list-item-title>
                <v-list-item-subtitle>
                  {{viewOrder.note}}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item>
              <v-list-item-action>
                <v-icon>shopping_cart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Items</v-list-item-title>
                <v-list-item-subtitle>Total of {{ viewOrder.items_count }} item(s)
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-for="(item, key) in viewOrder.items" :key="key">
              <v-list-item-action/>
              <v-list-item-content>
                <v-list-item-title>{{item.title}}</v-list-item-title>
                <v-list-item-subtitle>
                  € {{item.price}}
                  <span v-if="item.version !== null && item.version.length > 0">, {{item.version}}</span>
                  <span
                    v-if="item.pivot.shop_item_custom_option_storage !== null && item.pivot.shop_item_custom_option_storage.length > 0">, {{item.pivot.shop_item_custom_option_storage}} Gb</span>
                  <span
                    v-if="item.pivot.shop_item_custom_option_color !== null && item.pivot.shop_item_custom_option_color.length > 0">, <span
                    :style="'color:'+item.pivot.shop_item_custom_option_color">{{item.pivot.shop_item_custom_option_color}}</span></span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item>
              <v-list-item-action>
                <v-icon>account_circle</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Customer name
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{viewOrder.user.first_name}} {{viewOrder.user.last_name}}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-icon>location_on</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  First Address line
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{viewOrder.user.address_first_line}}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              v-if="viewOrder.user.address_second_line !== undefined && viewOrder.user.address_second_line !== null && viewOrder.user.address_second_line !== ''">
              <v-list-item-action/>
              <v-list-item-content>
                <v-list-item-title>
                  Second Address line
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{viewOrder.user.address_second_line}}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-action/>
              <v-list-item-content>
                <v-list-item-title>
                  City
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{viewOrder.user.address_postal_code}} {{viewOrder.user.address_city}}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              v-if="viewOrder.user.address_country !== undefined && viewOrder.user.address_country !== null && viewOrder.user.address_country !== ''">
              <v-list-item-action/>
              <v-list-item-content>
                <v-list-item-title>
                  Country
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{viewOrder.user.address_country}}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <create-update :item="viewOrder"/>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click.stop="viewDialog=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="destroyOrderModal" max-width="500px">
      <v-card>
        <v-card-title>
          Do you REALLY REALLY WANT TO DESTROY THIS ORDER ???
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="error" @click="destroyOrder()">
            Destroy
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    viewDialog: false,
    viewOrder: {
      user: {},
      shipping_method: ''
    },
    editDialog: false,
    editOrder: {},
    orders: [],
    headers: [
      {
        text: 'Id',
        align: 'left',
        sortable: false,
        value: 'id'
      },
      {
        text: 'Items',
        align: 'left',
        sortable: true,
        value: 'items_count'
      },
      {
        text: 'Ordered by',
        align: 'left',
        sortable: false,
        value: 'user'
      },
      {
        text: 'Method',
        align: 'left',
        sortable: true,
        value: 'way'
      },
      {
        text: 'Status',
        align: 'left',
        sortable: true,
        value: 'status'
      },
      {
        text: 'Created at',
        align: 'left',
        sortable: true,
        value: 'created_at'
      },
      {
        text: 'Total',
        align: 'left',
        sortable: false,
        value: 'total'
      },
      {
        text: 'Actions',
        align: 'left',
        value: 'actions',
        sortable: false
      }
    ],
    destroyOrderModal: false,
    toDestroyOrder: {},
    selectStatus: [
      { text: 'Payed', value: 'payed' },
      { text: 'Shipped', value: 'shipped' }
      // ,{ text: "Being prepared", value: "prepared" }
    ]
  }),
  filters: {
    capitalize (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  methods: {
    onMounted () {
      this.fetchData()
      this.verifyQueryParams()
    },
    fetchData () {
      this.$apitator.query(this, {
        body: {
          query: `query {
            getManyShopOrders {
              id
              items_count
              total_price
              way
              status
              bill_url
              created_at
              updated_at
              user { id, last_username, last_avatar }
            }
          }`
        }
      }).then((response) => {
        this.orders = response.data.data.getManyShopOrders
      })
    },
    viewOrderDialog (item) {
      this.fetchOrder(item).then((item) => {
        this.viewOrder = item
        this.viewDialog = true
      })
    },
    viewOrderEdit (item) {
      this.fetchOrder(item).then((item) => {
        this.editOrder = item
        this.editDialog = true
      })
    },
    fetchOrder (item) {
      return new Promise((resolve) => {
        this.$apitator.query(this, {
          body: {
            query: `query($id: String!){
              getOneShopOrder(id: $id){
                id
                items_count
                status
                way
                total_shipping_price
                total_price
                sub_total_price
                shipping_id
                shipping_method
                created_at
                updated_at
                on_way_id
                status
                note
                user {
                  first_name
                  last_name
                  last_username
                  last_avatar
                  last_locale
                  last_email
                  address_first_line
                  address_second_line
                  address_postal_code
                  address_city
                  address_country
                }
                items {
                  id,
                  title,
                  price,
                  version,
                  pivot {
                    shop_item_custom_option_storage
                    shop_item_custom_option_color
                  }
                }
              }
            }`,
            variables: { id: item.id }
          }
        }).then((response) => {
          resolve(response.data.data.getOneShopOrder)
        })
      })
    },
    saveEditOrder () {
      this.editDialog = false
      this.$apitator.query(this, {
        body: {
          query: `mutation ($order: ShopOrderUpdateInput) {
            updateShopOrder(order: $order)
          }`,
          variables: {
            order: {
              id: this.editOrder.id,
              status: this.editOrder.status,
              shipping_id: this.editOrder.shipping_id
            }
          }
        }
      }).then(() => {
        this.fetchData()
        this.$store.commit('ADD_ALERT', {
          color: 'success',
          text: 'Order saved!'
        })
      })
    },
    verifyQueryParams () {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('id') !== null) {
        this.fetchOrder({ id: urlParams.get('id') }).then((item) => {
          this.viewOrder = item
          this.viewDialog = true
        })
      }
    },
    openBill (item) {
      window.open(item.bill_url).focus()
    },
    openDestroyOrderModal (item) {
      this.destroyOrderModal = true
      this.toDestroyOrder = item
    },
    destroyOrder () {
      this.$apitator.query(this, {
        body: {
          query: `mutation($id: ID!){
            destroyShopOrder(id: $id)
          }`,
          variables: {
            id: this.toDestroyOrder.id
          }
        }
      }).then((response) => {
        this.destroyOrderModal = false
        this.$store.commit('ADD_ALERT', {
          color: 'info',
          text: 'Order destroyed!'
        })
        this.fetchData()
      }).catch(() => {
        this.destroyOrderModal = false
      })
    }
  },
  created () {
    this.$store.commit('SET_TITLE', 'Shop orders')
    this.$store.commit('SET_LAYOUT', 'dashboard')
    this.verifyQueryParams()
  }
}
</script>

<style>
.auto-height .v-list__item {
  height: auto !important;
  padding-top: 1em !important;
  padding-bottom: 1em !important;
}
/* are you sure?? */
.auto-height .v-list__item__subtitle {
  overflow: inherit;
  white-space: inherit;
}
</style>
