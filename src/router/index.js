import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../components/Index.vue')
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../components/Test.vue')
  },
  {
    path: '/logout/success',
    name: 'LogoutSuccessful',
    component: () => import('../components/LogoutSuccessful.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../components/Dashboard.vue')
  },

  // users
  {
    path: '/users',
    name: 'Users',
    component: () => import('../components/Users.vue')
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('../components/User.vue')
  },

  // shop
  {
    path: '/shop/items',
    name: 'ShopItems',
    component: () => import('../components/Shop/Items.vue')
  },
  {
    path: '/shop/category/:id/create',
    name: 'ShopItemCreate',
    component: () => import('../components/Shop/ItemCreate.vue')
  },
  {
    path: '/shop/item/:id',
    name: 'ShopItem',
    component: () => import('../components/Shop/Item.vue')
  },
  {
    path: '/shop/item/:id/edit',
    name: 'ShopItemEdit',
    component: () => import('../components/Shop/ItemEdit.vue')
  },
  {
    path: '/shop/categories',
    name: 'ShopCategories',
    component: () => import('../components/Shop/Categories.vue')
  },
  {
    path: '/shop/categories/order',
    name: 'ShopCategoriesOrder',
    component: () => import('../components/Shop/CategoriesOrder.vue')
  },
  {
    path: '/shop/category/create',
    name: 'ShopCategoryCreate',
    component: () => import('../components/Shop/CategoryCreate.vue')
  },
  {
    path: '/shop/category/:id/edit',
    name: 'ShopCategoryEdit',
    component: () => import('../components/Shop/CategoryEdit.vue')
  },
  {
    path: '/shop/category/:id',
    name: 'ShopCategory',
    component: () => import('../components/Shop/Category.vue')
  },
  {
    path: '/shop/orders',
    name: 'ShopOrders',
    component: () => import('../components/Shop/Orders.vue')
  },

  // game collection
  {
    path: '/game/games',
    name: 'Games',
    component: () => import('../components/Games/Games.vue')
  },
  {
    path: '/game/editors',
    name: 'GameEditors',
    component: () => import('../components/Games/Editors.vue')
  },
  {
    path: '/game/tags',
    name: 'GameTags',
    component: () => import('../components/Games/Tags.vue')
  },
  {
    path: '/game/platforms',
    name: 'GamePlatforms',
    component: () => import('../components/Games/Platforms.vue')
  },
  {
    path: '/game/platforms/create',
    name: 'GamePlatformCreate',
    component: () => import('../components/Games/PlatformCreate.vue')
  },
  {
    path: '/game/platforms/:id/edit',
    name: 'GamePlatformEdit',
    component: () => import('../components/Games/PlatformEdit.vue')
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
    component: () => import('../components/Consoles.vue')
  },
  {
    path: '/console-images',
    name: 'ConsoleImages',
    component: () => import('../components/ConsoleImages.vue')
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }

  {
    path: '*',
    name: 'NotFound',
    component: () => import('../components/NotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
