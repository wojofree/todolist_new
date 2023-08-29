import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "about" */ '../views/home/HomeView')
    },
    {
        path: '/login',
        name: 'LoginView',
        component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
    },
    {
        path: '/register',
        name: 'RegisterView',
        component: () => import(/* webpackChunkName: "about" */ '../views/RegisterView.vue')
    },
    {
        path: '/reset',
        name: 'ChangePassword',
        component: () => import(/* webpackChunkName: "about" */ '../views/ChangePassword.vue')
    },
    {
        path: '/tasks',
        name: 'MyTasks',
        component: () => import(/* webpackChunkName: "about" */ '../views/myTasks/MyTasksView.vue')
    },
    {
        path: '/test',
        name: 'test',
        component: () => import(/* webpackChunkName: "about" */ '../views/test.vue')
    },

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
