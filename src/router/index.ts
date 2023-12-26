import {createRouter, createWebHistory} from 'vue-router'
import AppView from "@/views/AppView.vue";
import LoginView from "../views/LoginView.vue";
import PanelView from "@/views/PanelView.vue";
import App from "@/App.vue";
import MyOrderView from "@/views/MyOrderView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            id: 'home',
            component: AppView
        },
        {
            path: '/about',
            id: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue')
        },
        {
            path: '/login',
            id: 'login',
            component: () => import('@/views/LoginView.vue')
        },
        {
            path: '/panel',
            id: 'panel',
            component: () => import('@/views/PanelView.vue'),
            children: [
                {
                    path: 'order',
                    component: () => import('@/views/MyOrderView.vue'),
                    children: [
                        {
                            path: ':filter',
                            component: () => import('@/components/Orders/AllOrder.vue'),
                            props: true
                        }
                    ]
                },
                {
                    path: 'add-proc',
                    component: () => import('@/components/AddProcure.vue'),
                },
                {
                    path: 'add-sale',
                    component: () => import('@/components/AddSale.vue'),
                },
                {
                    path: 'add-sale',
                    component: () => import('@/components/AddSale.vue'),
                },
                {
                    path: 'count',
                    component: () => import('@/components/GetCount.vue'),
                },
                {
                    path: 'express',
                    component: () => import('@/components/ShouHouFaHuo.vue'),
                },
                {
                    path: 'add-ticket',
                    component: () => import('@/components/AddTicket.vue'),
                },
                {
                    path: 'inventory-list',
                    component: () => import('@/components/InventoryList.vue'),
                },
                {
                    path: 'procure-list',
                    component: () => import('@/components/ProcureList.vue'),
                },
                {
                    path: 'sales-list',
                    component: () => import('@/components/SalesList.vue'),
                },
                {
                    path: 'ticket-list',
                    component: () => import('@/components/TicketList.vue'),
                },
                {
                    path: 'wait_for_ship',
                    component: () => import('@/components/Orders/WaitForOperate.vue')
                },
                {
                    path: 'vieworder/:order_id',
                    component: () => import('@/components/Orders/ShowOrder.vue'),
                    props: true
                },
            ],
        }
    ]
})

export default router
