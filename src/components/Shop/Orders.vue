<template>
    <div class="categories">
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
                    <v-avatar size="20" class="mr-2"><img :src="props.item.user.last_avatar" alt=""></v-avatar>
                    {{props.item.user.last_username}}
                </td>
                <td>
                    {{props.item.way|capitalize}}
                </td>
                <td>
                    {{props.item.status|capitalize}}
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
                </td>
            </template>
        </v-data-table>
        <v-dialog v-model="editDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    Edit order #"{{editOrder.id}}"
                </v-card-title>
                <v-card-text>
                    <form v-if="editOrder.status === 'payed'">
                        <v-switch
                                label="Is shipped ?"
                                v-model="to_edit_shipped">

                        </v-switch>
                    </form>
                    <div v-if="editOrder.status !== 'payed'">
                        No actions available
                    </div>
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
                                    <span v-if="item.pivot.shop_item_custom_option_storage !== null && item.pivot.shop_item_custom_option_storage.length > 0">, {{item.pivot.shop_item_custom_option_storage}} Gb</span>
                                    <span v-if="item.pivot.shop_item_custom_option_color !== null && item.pivot.shop_item_custom_option_color.length > 0">, <span
                                            :style="'color:'+item.pivot.shop_item_custom_option_color">{{item.pivot.shop_item_custom_option_color}}</span></span>
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
    </div>
</template>

<script>
    export default {
        data() {
            return {
                viewDialog: false,
                viewOrder: {},
                editDialog: false,
                editOrder: {},
                to_edit_shipped: false,
                orders: [],
                headers: [
                    {
                        text: 'Id',
                        align: 'left',
                        sortable: false,
                        value: 'id'
                    },
                    {
                        text: 'Items count',
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
                this.fetchData()
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
                                    created_at
                                    updated_at
                                    on_way_id
                                    status
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
                if (this.to_edit_shipped) {
                    this.editOrder.status = 'shipped';
                    this.to_edit_shipped = false
                }
                this.$apitator.query(this, {
                    body: {
                        query: `mutation ($order: ShopOrderUpdateInput) {
                            updateShopOrder(order: $order)
                        }`,
                        variables: {
                            order: {
                                id: this.editOrder.id,
                                status: this.editOrder.status
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
            }
        },
        created() {
            this.$store.commit('SET_TITLE', 'Shop orders');
            this.$store.commit('SET_LAYOUT', 'dashboard')
        }
    }
</script>
