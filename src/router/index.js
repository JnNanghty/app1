import {createRouter, createWebHashHistory} from "vue-router";
import Layout from "@/Layout/Layout";
import Curriculum from "@/views/curriculum/Curriculum";
import HomePage from "@/views/home/HomePage";
import Patrol from '@/views/patrol/Patrol'
import SystemSettingHome from '@/views/systemSetting/SystemSettingHome'
import ClassroomBorrow from '@/views/classroomBorrow/ClassroomBorrow'
import ClassroomBorrowDetail from '@/views/classroomBorrow/ClassroomBorrowDetail'
import Repair from '@/views/repair/Repair'
import Attendance from '@/views/attendance/Attendance'
import ExamMode from '@/views/specialMode/ExamMode'
import ProgrammeMode from '@/views/specialMode/ProgrammeMode'
import Information from "@/views/information/Information";


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
      path: '/systemSettingHome',
      name: 'SystemSettingHome',
      component: SystemSettingHome
    }, {
      path: '/classroomBorrow',
      name: 'ClassroomBorrow',
      component: ClassroomBorrow
    }, {
      path: '/classroomBorrowDetail',
      name: 'ClassroomBorrowDetail',
      component: ClassroomBorrowDetail
    }, {
      path: '/repair',
      name: 'Repair',
      component: Repair
    }]
  },
  {
    path: '/attendance',
    name: 'Attendance',
    component: Attendance
  }, {
    path: '/examMode',
    name: 'ExamMode',
    component: ExamMode
  }, {
    path: '/programmeMode',
    name: 'ProgrammeMode',
    component: ProgrammeMode
  }, {
    path: '/information',
    name: 'Information',
    component: Information
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
