<template>
  <div class="orders">
    <v-layout align-center justify-end row fill-height>
      <v-btn icon @click="fetchData()">
        <v-icon>refresh</v-icon>
      </v-btn>
    </v-layout>

    <v-data-table :headers="headers" :items="orders" hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>
          {{props.item.id}}
        </td>
        <td>
          {{props.item.items_count}}
        </td>
        <td>
          <div v-if="props.item.user !== null">
            <v-avatar size="20" class="mr-2"><img :src="props.item.user.last_avatar" alt=""></v-avatar>
            {{props.item.user.last_username}}
          </div>
        </td>
        <td>
          {{props.item.way|capitalize}}
        </td>
        <td>
          {{props.item.status|capitalize}}
        </td>
        <td>
          {{props.item.created_at|subDate}}
        </td>
        <td>
          € {{props.item.total_price}}
        </td>
        <td class="justify-end align-center layout px-2">
          <v-btn
            icon
            small
            @click="viewOrderDialog(props.item)">
            <v-icon
              small
            >
              info
            </v-icon>
          </v-btn>
          <v-btn
            icon
            small
            @click="viewOrderEdit(props.item)">
            <v-icon
              small
            >
              edit
            </v-icon>
          </v-btn>
          <v-tooltip top v-if="props.item.bill_url != null">
            <v-btn
              slot="activator" 
              icon
              small
              @click="openBill(props.item)">
              <v-icon
                small
              >
                receipt
              </v-icon>
            </v-btn>
            <span>Open bill (or receipt)</span>
          </v-tooltip>
          <v-btn
            icon
            small
            @click="openDestroyOrderModal(props.item)">
            <v-icon
              color="error"
              small
            >
              delete
            </v-icon>
          </v-btn>
        </td>
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
          <v-btn color="red" flat @click.stop="editDialog=false">Close</v-btn>
          <v-btn color="primary" flat @click.stop="saveEditOrder()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="viewDialog" max-width="500px">
      <v-card>
        <v-card-text>
          <v-list two-line>
            <v-list-tile @click="$copyText(viewOrder.id)" ripple>
              <v-list-tile-action>
                <v-icon>label</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{viewOrder.id}}</v-list-tile-title>
                <v-list-tile-sub-title>API Id</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon>list</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Sub total</v-list-tile-title>
                <v-list-tile-sub-title>€ {{viewOrder.sub_total_price}}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon>local_shipping</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Shipping price</v-list-tile-title>
                <v-list-tile-sub-title>€ {{viewOrder.total_shipping_price}}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-action>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Shipping method</v-list-tile-title>
                <v-list-tile-sub-title>
                  {{ viewOrder.shipping_method|capitalize }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon>attach_money</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Total</v-list-tile-title>
                <v-list-tile-sub-title>€ {{viewOrder.total_price}}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon>payment</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Payment method</v-list-tile-title>
                <v-list-tile-sub-title>{{viewOrder.way|capitalize}}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon>info</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Status</v-list-tile-title>
                <v-list-tile-sub-title>{{viewOrder.status|capitalize}}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile class="auto-height" v-if="viewOrder.note !== null && viewOrder.note !== ''">
              <v-list-tile-action>
                <v-icon>speaker_notes</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Order note</v-list-tile-title>
                <v-list-tile-sub-title>
                  {{viewOrder.note}}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon>shopping_cart</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Items</v-list-tile-title>
                <v-list-tile-sub-title>Total of {{viewOrder.items_count}} item(s)
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile v-for="(item, key) in viewOrder.items" :key="key">
              <v-list-tile-action/>
              <v-list-tile-content>
                <v-list-tile-title>{{item.title}}</v-list-tile-title>
                <v-list-tile-sub-title>
                  € {{item.price}}
                  <span v-if="item.version !== null && item.version.length > 0">, {{item.version}}</span>
                  <span
                    v-if="item.pivot.shop_item_custom_option_storage !== null && item.pivot.shop_item_custom_option_storage.length > 0">, {{item.pivot.shop_item_custom_option_storage}} Gb</span>
                  <span
                    v-if="item.pivot.shop_item_custom_option_color !== null && item.pivot.shop_item_custom_option_color.length > 0">, <span
                    :style="'color:'+item.pivot.shop_item_custom_option_color">{{item.pivot.shop_item_custom_option_color}}</span></span>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon>account_circle</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Customer name
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{viewOrder.user.first_name}} {{viewOrder.user.last_name}}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon>location_on</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  First Address line
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{viewOrder.user.address_first_line}}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile
              v-if="viewOrder.user.address_second_line !== undefined && viewOrder.user.address_second_line !== null && viewOrder.user.address_second_line !== ''">
              <v-list-tile-action/>
              <v-list-tile-content>
                <v-list-tile-title>
                  Second Address line
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{viewOrder.user.address_second_line}}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-action/>
              <v-list-tile-content>
                <v-list-tile-title>
                  City
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{viewOrder.user.address_postal_code}} {{viewOrder.user.address_city}}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile
              v-if="viewOrder.user.address_country !== undefined && viewOrder.user.address_country !== null && viewOrder.user.address_country !== ''">
              <v-list-tile-action/>
              <v-list-tile-content>
                <v-list-tile-title>
                  Country
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{viewOrder.user.address_country}}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <create-update :item="viewOrder"/>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" flat @click.stop="viewDialog=false">Close</v-btn>
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
          <v-btn flat color="error" @click="destroyOrder()">
            Destroy
          </v-btn>
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
            value: ''
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
            value: ''
          },
          {
            text: 'Actions',
            align: 'right',
            value: 'id',
            sortable: false
          }
        ],
        destroyOrderModal: false,
        toDestroyOrder: {},
        selectStatus: [
          { text: "Payed", value: "payed" },
          { text: "Shipped", value: "shipped" }
          //,{ text: "Being prepared", value: "prepared" }
        ]
      }
    },
    filters: {
      capitalize: function (value) {
        if (!value) return '';
        value = value.toString();
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    },
    methods: {
      onMounted: function () {
        this.fetchData();
        this.verifyQueryParams();
      },
      fetchData: function () {
        this.$apitator.query(this, {
          body: {
            query: `query{
              getManyShopOrders{
                id
                items_count
                total_price
                way
                status
                bill_url
                created_at
                updated_at
                user{id, last_username, last_avatar}
              }
            }`
          }
        }).then((response) => {
          this.orders = response.data.data.getManyShopOrders
        })
      },
      viewOrderDialog(item) {
        this.fetchOrder(item).then((item) => {
          this.viewOrder = item;
          this.viewDialog = true
        })
      },
      viewOrderEdit: function (item) {
        this.fetchOrder(item).then((item) => {
          this.editOrder = item;
          this.editDialog = true
        })
      },
      fetchOrder: function (item) {
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
              variables: {
                id: item.id
              }
            }
          }).then((response) => {
            resolve(response.data.data.getOneShopOrder)
          })
        })
      },
      saveEditOrder: function () {
        this.editDialog = false;
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
          this.fetchData();
          this.$store.commit('ADD_ALERT', {
            color: 'success',
            text: 'Order saved!'
          });
        })
      },
      verifyQueryParams: function () {
        let urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('id') !== null) {
          this.fetchOrder({id: urlParams.get('id')}).then((item) => {
            this.viewOrder = item;
            this.viewDialog = true
          })
        }
      },
      openBill: function (item) {
        window.open(item.bill_url).focus()
      },
      openDestroyOrderModal: function (item) {
        this.destroyOrderModal = true
        this.toDestroyOrder = item
      },
      destroyOrder: function () {
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
            text: "Order destroyed!"
          })
          this.fetchData()
        }).catch(() => {
          this.destroyOrderModal = false
        })
      }
    },
    created() {
      this.$store.commit('SET_TITLE', 'Shop orders');
      this.$store.commit('SET_LAYOUT', 'dashboard');
      this.verifyQueryParams();
    }
  }
</script>

<style>
.auto-height .v-list__tile {
  height: auto !important;
  padding-top: 1em !important;
  padding-bottom: 1em !important;
}
.auto-height .v-list__tile__sub-title {
  overflow: inherit;
  white-space: inherit;
}
</style>