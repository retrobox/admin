import Vue from 'vue'
import Router from 'vue-router'

import Index from './components/Index'
import Dashboard from './components/Dashboard'

//users
import Users from './components/Users'
import User from './components/User'

//shop
import ShopItems from './components/Shop/Items'
import ShopItem from './components/Shop/Item'
import ShopItemCreate from './components/Shop/ItemCreate.vue'
import ShopItemEdit from './components/Shop/ItemEdit.vue'
import ShopCategories from './components/Shop/Categories'
import ShopCategoriesOrder from './components/Shop/CategoriesOrder'
import ShopCategory from './components/Shop/Category'
import ShopCategoryEdit from './components/Shop/CategoryEdit.vue'
import ShopCategoryCreate from './components/Shop/CategoryCreate.vue'
import ShopOrders from './components/Shop/Orders.vue'
import Consoles from './components/Consoles.vue'

//Games
import Games from './components/Games/Games.vue'
import GameEditors from './components/Games/Editors.vue'
import GamePlatforms from './components/Games/Platforms.vue'
import GamePlatformCreate from './components/Games/PlatformCreate.vue'
import GamePlatformEdit from './components/Games/PlatformEdit.vue'
import GameTags from './components/Games/Tags.vue'

import NotFound from './components/NotFound'
import LogoutSuccessful from './components/LogoutSuccessful'
import Test from './components/Test'

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [{
    path: '/',
    name: 'Index',
    component: Index
  },
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/logout/success',
      name: 'LogoutSuccessful',
      component: LogoutSuccessful
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },

    //users
    {
      path: '/users',
      name: 'Users',
      component: Users
    },
    {
      path: '/user/:id',
      name: 'User',
      component: User
    },

    //shop
    {
      path: '/shop/items',
      name: 'ShopItems',
      component: ShopItems
    },
    {
      path: '/shop/category/:id/create',
      name: 'ShopItemCreate',
      component: ShopItemCreate
    },
    {
      path: '/shop/item/:id',
      name: 'ShopItem',
      component: ShopItem
    },
    {
      path: '/shop/item/:id/edit',
      name: 'ShopItemEdit',
      component: ShopItemEdit
    },
    {
      path: '/shop/categories',
      name: 'ShopCategories',
      component: ShopCategories
    },
    {
      path: '/shop/categories/order',
      name: 'ShopCategoriesOrder',
      component: ShopCategoriesOrder
    },
    {
      path: '/shop/category/create',
      name: 'ShopCategoryCreate',
      component: ShopCategoryCreate
    },
    {
      path: '/shop/category/:id/edit',
      name: 'ShopCategoryEdit',
      component: ShopCategoryEdit
    },
    {
      path: '/shop/category/:id',
      name: 'ShopCategory',
      component: ShopCategory
    },
    {
      path: '/shop/orders',
      name: 'ShopOrders',
      component: ShopOrders
    },

    //game collection
    {
      path: '/game/games',
      name: 'Games',
      component: Games
    },
    {
      path: '/game/editors',
      name: 'GameEditors',
      component: GameEditors
    },
    {
      path: '/game/tags',
      name: 'GameTags',
      component: GameTags
    },
    {
      path: '/game/platforms',
      name: 'GamePlatforms',
      component: GamePlatforms
    },
    {
      path: '/game/platforms/create',
      name: 'GamePlatformCreate',
      component: GamePlatformEdit
    },
    {
      path: '/game/platforms/:id/edit',
      name: 'GamePlatformEdit',
      component: GamePlatformEdit
    },
    // {
    //   path: '/game/platform',
    //   name: 'GamePlatforms',
    //   component: GamePlatforms
    // },
    // {
    //   path: '/game/media',
    //   name: 'GameMedias',
    //   component: GameMedias
    // }
    // shop console
    {
        path: '/consoles',
        name: 'Consoles',
        component: Consoles
    }
  ]
})
