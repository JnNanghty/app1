import router from './router'

let goHomeTimeout = null;
document.addEventListener('click', () => {
  if (router.currentRoute.value.name !== 'ExamMode' && router.currentRoute.value.name !== 'ProgrammeMode' && router.currentRoute.value.name !== 'Home') {
    console.log('set goHomeTimeout');
    if (goHomeTimeout) {
      clearTimeout(goHomeTimeout);
    }
    goHomeTimeout = setTimeout(() => {
      router.push({name: 'Home'});
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
  // 非首页状态（及从首页离开） 3分钟回到首页  考试模式和节目模式除外！！！ 3 * 60 * 1,000 = 180,000
  if (from.name === 'Home' && to.name !== 'ExamMode' && to.name !== 'ProgrammeMode') {
    if (goHomeTimeout) {
      clearTimeout(goHomeTimeout);
    }
    goHomeTimeout = setTimeout(() => {
      router.push({name: 'Home'});
      clearTimeout(goHomeTimeout);
      goHomeTimeout = null;
    }, 18e4);
  }
  if (to.name === 'Home') {
    if (goHomeTimeout) clearTimeout(goHomeTimeout);
    goHomeTimeout = null;
  }
  next();
});