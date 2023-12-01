import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'
// import IndexAll from '../views/GridViewsIndex.vue'
import IndexAll from '../views/IndexAllList.vue'
import EmptyView from '../views/EmptyView.vue'
// import Token from '../views/Token.vue'

const routes = [
  {
    path: '/',
    component: Index,
    children: [
      {
        path: '',
        name: 'home__index',
        component: IndexAll,
      },
      {
        path: 'yours',
        name: 'home__yours',
        component: EmptyView,
        children: [
          {
            path: 'tokens/:tokenId',
            name: 'yours__token',
            component: () => import('../views/TokenOverlay.vue')
          }
        ]
      },
      {
        path: ':address',
        name: 'home__collector',
        component: EmptyView,
        children: [
          {
            path: 'tokens/:tokenId',
            name: 'collector__token',
            component: () => import('../views/TokenOverlay.vue')
          }
        ]
      },
      {
        path: 'owners',
        name: 'home__owners',
        component: EmptyView
      }
    ],
    // children: [
    //   {
    //     path: '',
    //     name: 'home',
    //     redirect: import.meta.env.VITE_SOLD_OUT ? '/sneks' : '/mint'
    //   },
    //   {
    //     path: 'mint',
    //     name: 'mint',
    //     component: Mint
    //   },
    //   {
    //     path: 'sneks',
    //     name: 'sneks',
    //     component: () => import('../views/Sneks.vue'),
    //     children: [
    //       {
    //         path: '',
    //         name: 'sneks-index',
    //         component: () => import('../views/SneksIndex.vue'), // lazy loading but not required
    //         // children: [
    //         //   {
    //         //     path: ':tokenId',
    //         //     name: 'sneks-index-token',
    //         //     component: () => import('../views/Token.vue')
    //         //   }
    //         // ]
    //       },
    //       {
    //         path: 'yours',
    //         name: 'sneks-yours',
    //         component: () => import('../views/SneksProfile.vue')
    //       },
    //       {
    //         path: ':address',
    //         name: 'sneks-profile',
    //         component: () => import('../views/SneksProfile.vue')
    //       }
    //     ]
    //   },
    //   {
    //     path: 'bites',
    //     name: 'bites',
    //     component: () => import('../views/Bites.vue'),
    //   },
    //   {
    //     path: 'faq',
    //     name: 'faq',
    //     component: () => import('../views/FAQ.vue')
    //   },
    // ],
  },
  {
    path: '/tokens/:tokenId',
    name: 'token',
    component: () => import('../views/TokenOverlay.vue')
  },
  {
    path: '/web3connect',
    name: 'web3connect',
    component: () => import('../components/Web3Connect.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    } else if (savedPosition) {
      // if (to.name === 'mints' && savedPosition) {
      //   // wait for page transition
      //   return new Promise((resolve, reject) => {
      //     setTimeout(() => resolve(savedPosition), 800)
      //   })
      // }
      return savedPosition
    } else {
      // don't scroll to top on user tab changes...
      // const isSameAddress = to.params.address && to.params.address === from.params.address
      // const isSameNetwork = to.query.network && to.query.network === from.query.network
      // if (isSameAddress || isSameNetwork) {
      //   return
      // }
      if (to.name.split('_')[0] === from.name.split('_')[0]) {
        return
      }
      // scroll to top
      return { top: 0 }
    }
  }
})

export default router
