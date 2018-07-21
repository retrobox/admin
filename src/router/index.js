import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Dashboard from '@/components/Dashboard'
import Users from '@/components/Users'
import User from '@/components/User'
import ShopItems from '@/components/Shop/Items'
import ShopItem from '@/components/Shop/Item'
import ShopCategories from '@/components/Shop/Categories'
import ShopCategory from '@/components/Shop/Category'
import ShopCategoryEdit from '@/components/Shop/CategoryEdit.vue'
import ShopCategoryCreate from '@/components/Shop/CategoryCreate.vue'
import NotFound from '@/components/NotFound'
import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
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
      path: '*',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
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
    {
      path: '/shop/items',
      name: 'ShopItems',
      component: ShopItems
    },
    {
      path: '/shop/item/:id',
      name: 'ShopItem',
      component: ShopItem
    },
    {
      path: '/shop/categories',
      name: 'ShopCategories',
      component: ShopCategories
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
    }
  ]
})
