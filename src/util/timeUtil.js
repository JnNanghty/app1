/**
 * @description 将小于10的数字前面加0
 * @param {number} num
 * @return string '05' '36'
 * */
function one2two(num) {
  if (num < 10) {
    return '0' + num;
  }
  return '' + num;
}

/**
 * @description 格式化当前时间
 * @param {Date | Number} time 时间
 * @return string '11:25'
 * */
function formatTime(time) {
  const _time = new Date(time);
  let result = '';
  const _hour = _time.getHours();
  const _minute = _time.getMinutes();
  if (isNaN(_hour)) {
    return 'NaN';
  }
  result = `${one2two(_hour)}:${one2two(_minute)}`;
  return result;
}

/**
 * @description 格式化当前日期
 * @param {Date | Number} time 时间
 * @return string '2021-02-31'
 * */
function formatDate(time) {
  const _time = new Date(time);
  let result = '';
  const _year = _time.getFullYear();
  const _month = _time.getMonth() + 1;
  const _day = _time.getDate();
  if (isNaN(_year)) {
    return 'NaN';
  }
  result = `${_year}.${one2two(_month)}.${one2two(_day)}`;
  return result;
}

/**
 * @description 获取当前星期几
 * @param {Date | Number} time 时间
 * @return string '星期三'
 * */
function getCurrentDay(time) {
  const simplifyNumberArray = ['日', '一', '二', '三', '四', '五', '六'];
  const _time = new Date(time);
  let result = '周';
  const week = _time.getDay();
  return result + simplifyNumberArray[week];
}

/**
 * @description 获取当前时间的年月日星期小时分钟秒
 *
 * */
function getNowTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const week = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  const currentSource = hour * 60 + minute;

  return {year, month, day, week, hour, minute, second, currentSource};
}

/**
 * @description 将 source 转换成 时间 770 => '12:50'
 * */
function sourceToTime(source) {
  const h = Math.floor(source / 60)
  const m = source % 60;
  return one2two(h) + ':' + one2two(m);
}

export default {
  getNowTime,
  one2two,
  formatTime,
  formatDate,
  getCurrentDay,
  sourceToTime
}
