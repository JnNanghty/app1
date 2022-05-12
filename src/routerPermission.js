import router from './router'
import ls from "@/store/ls";

let goHomeTimeout = null;
document.addEventListener('click', () => {
  if (router.currentRoute.value.name !== 'ExamMode' && router.currentRoute.value.name !== 'ProgrammeMode' && router.currentRoute.value.name !== 'Home') {
    console.log('set goHomeTimeout');
    if (goHomeTimeout) {
      clearTimeout(goHomeTimeout);
    }
    goHomeTimeout = setTimeout(() => {
      let isExamMode = ls.get('isExamMode');
      if (isExamMode) {
        router.push({name: 'ExamMode'})
      } else {
        router.push({name: 'Home'});
      }
      clearTimeout(goHomeTimeout);
      goHomeTimeout = null;
    }, 18e4);
  } else {
    console.log('clear goHomeTimeout');
    if (goHomeTimeout) {
      clearTimeout(goHomeTimeout);
      goHomeTimeout = null;
    }
  }
})
router.beforeEach((to, from, next) => {
  // 只要去的不是 首页 考试 节目 就3分钟回来 3 * 60 * 1,000 = 180,000
  if (to.name !== 'Home' && to.name !== 'ExamMode' && to.name !== 'ProgrammeMode') {
    if (goHomeTimeout) {
      clearTimeout(goHomeTimeout);
    }
    goHomeTimeout = setTimeout(() => {
      let isExamMode = ls.get('isExamMode');
      if (isExamMode) {
        router.push({name: 'ExamMode'})
      } else {
        router.push({name: 'Home'});
      }
      clearTimeout(goHomeTimeout);
      goHomeTimeout = null;
    }, 18e4);
  } else {
    if (goHomeTimeout) clearTimeout(goHomeTimeout);
    goHomeTimeout = null;
  }
  next();
});