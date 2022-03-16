import {createRouter, createWebHashHistory} from "vue-router";
import Layout from "@/Layout/Layout";
import Curriculum from "@/views/curriculum/Curriculum";
import HomePage from "@/views/home/HomePage";
import Patrol from '@/views/patrol/Patrol'
import SystemSettingHome from '@/views/systemSetting/SystemSettingHome'
import ClassroomBorrow from '@/views/classroomBorrow/ClassroomBorrow'
import Repair from '@/views/repair/Repair'
import ExamMode from '@/views/specialMode/ExamMode'
import ProgrammeMode from '@/views/specialMode/ProgrammeMode'
import Information from "@/views/information/Information";
import Auth from "@/components/authPage/Auth";
import Open from "@/views/open/Open";


const routes = [
  {
    path: '/',
    name: 'App',
    redirect: '/home',
    component: Layout,
    children: [{
      path: 'home',
      name: 'Home',
      component: HomePage
    }, {
      path: 'curriculum',
      name: 'Curriculum',
      component: Curriculum
    }, {
      path: 'patrol',
      name: 'Patrol',
      component: Patrol
    }, {
      path: '/classroomBorrow',
      name: 'ClassroomBorrow',
      component: ClassroomBorrow
    }, {
      path: '/repair',
      name: 'Repair',
      component: Repair
    }, {
      path: '/auth',
      name: 'Auth',
      component: Auth
    }, {
      path: '/open',
      name: 'Open',
      component: Open
    }, {
      path: '/information',
      name: 'Information',
      component: Information
    }]
  }, {
    path: '/systemSettingHome',
    name: 'SystemSettingHome',
    component: SystemSettingHome
  }, {
    path: '/examMode',
    name: 'ExamMode',
    component: ExamMode
  }, {
    path: '/programmeMode',
    name: 'ProgrammeMode',
    component: ProgrammeMode
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
