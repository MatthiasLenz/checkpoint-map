import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import CheckpointMap from '@/components/CheckpointMap'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/map',
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
