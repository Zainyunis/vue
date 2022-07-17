import Vue from 'vue'
import VueRouter from 'vue-router'

import Content from "../components/Content";
import NotFount from "../views/NotFount";
//const Login = resolve => require(['@/components/Login'], resolve)
import Login from "../views/Login";
import Manager from "../components/Manager";
import Register from "../views/Register";
import User from "../views/User";
import Home from "../views/Home";
import Person from "../views/Person";
import Title from "../views/Title";
import Goods from "../views/Goods";
import Bin from "../views/Bin";
import House from "../views/House";
import Shelf from "../views/Shelf";
import test from "../three/test";
import Task from "../views/Task";
import test2 from "../three/test2";

Vue.use(VueRouter)

const routes = [
  {
      //路径
      path:'/content',
      name:'content',
      //跳转的主键
      component:Content
    },{
      path:'/',
      redirect:'/Login',
    },{
      path:'/Login',
      name:'登录',
      component:Login
    },{
      path:'/Register',
      name:'注册',
      component:Register
    },{
      path:'/manager',
      component:Manager,
      children:[
        {path:'user',component:User},
        {path:'home',component:Home},
        {path:'person',component:Person},
        {path:'title',component:Title},
        {path:'goods',component:Goods},
        {path:'bin',component:Bin},
        {path:'house',component:House},
        {path:'shelf',component:Shelf},
        {path:'task',component:Task},
        {path:'test',component:test2}
      ]
    },
    {
      path:'/test',
      component:test
    },
    {
      path:'*',
      component:NotFount
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//访问前检查是否登录了
router.beforeEach((to,from,next)=>{
  // console.log('to:' + to.path)
  if (to.path === '/Login' || to.path === '/Register') {
    console.log('to:' + to.path)
    localStorage.removeItem("user")
    next()
  } else {
    let user = localStorage.getItem('user')
    if (!user) {
      next({ path: '/Login' })
    } else {
      next()
    }
  }
})
export default router
