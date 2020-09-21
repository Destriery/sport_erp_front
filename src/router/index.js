import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/events',
    name: 'events',
    component: () => import('../views/Events.vue')
  },
  {
    path: '/events/:eventId',
    name: 'event',
    component: () => import('../views/Event.vue')
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import('../views/Tasks.vue')
  },
  {
    path: '/tasks/:taskId',
    name: 'task',
    component: () => import('../views/Task.vue')
  },
  {
    path: '/event_places',
    name: 'event_places',
    component: () => import('../views/EventPlaces.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
