import Vue from 'vue'
import Router from 'vue-router'
import CheckpointMap from '@/components/CheckpointMap'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Map',
      component: CheckpointMap
    }
    /* ,
    {
      path: '/map',
      name: 'CheckpointMap',
      component: CheckpointMap
    } */
  ]
})
