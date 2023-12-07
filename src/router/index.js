import { createRouter, createWebHistory } from 'vue-router'
// import Index from '../views/Index.vue'
import Splash from '../views/Splash.vue'
// import IndexAll from '../views/GridViewsIndex.vue'
// import IndexAll from '../views/IndexAllList.vue'
// import EmptyView from '../views/EmptyView.vue'
// import Token from '../views/Token.vue'

const routes = [
  {
    path: '/',
    component: Splash, // import.meta.env.VITE_SPLASH ? Splash : Index,
    // children: [
    //   {
    //     path: '',
    //     name: 'home__index',
    //     component: IndexAll,
    //   },
    //   {
    //     path: 'yours',
    //     name: 'home__yours',
    //     component: () => import('../views/IndexYours.vue'),
    //   },
    //   {
    //     path: 'owners',
    //     name: 'home__collectors',
    //     component: () => import('../views/IndexCollectors.vue')
    //   },
    //   {
    //     path: ':address',
    //     name: 'home__collector',
    //     component: () => import('../views/IndexCollector.vue'),
    //   },
    // ]
  },
  // {
  //   path: '/tokens/:tokenId',
  //   name: 'token',
  //   component: () => import('../views/TokenOverlay.vue')
  // },
  // {
  //   path: '/web3connect',
  //   name: 'web3connect',
  //   component: () => import('../components/Web3Connect.vue')
  // }
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
