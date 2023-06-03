import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/Layout'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component:()=>import('../views/Login')
    },
    {
        path: '/',
        name: 'Layout',
        component: Layout,
        redirect: '/LiuYao',
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: '/LiuYao',
                name: "LiuYao",
                component:()=>import('@/views/LiuYao')
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})
router.beforeEach((to, from, next) => {

    if (to.path.startsWith('/login')) {
        window.sessionStorage.removeItem('Token')
        next()
    } else {
        console.log('1')
        let user = window.sessionStorage.getItem('Token')
        if (!user) {
            next({
                path: '/login'
            })
        } else {
            next()
        }
    }
});
export default router;