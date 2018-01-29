import Vue from 'vue'
import Router from 'vue-router'
//import User from 'components/user/user'

Vue.use(Router);

const Recommend = () => import('components/recommend/recommend')
const Rank = () => import('components/rank/rank')
const Search = () => import('components/search/search')
const Singer = () => import('components/singer/singer')
const SingerDetail = () => import('components/singer-detail/singer-detail')
const Disc = () => import('components/disc/disc')
const TopList = () => import('components/top-list/top-list')


export default new Router({
  routes: [
    {
      path: '/',
      //重定向到一个地址
      redirect: '/recommend'
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':dissid',
          component: Disc
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':topid',
          component: TopList
        }
      ]
    }
    //{
    //  path: '/user',
    //  component: User
    //}
  ]
})
