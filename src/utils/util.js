import moment from 'moment';
import Vue from '@/main';
export function timeFix() {
  const time = new Date();
  const hour = time.getHours();
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好';
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了'];
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents');
  event.initEvent('resize', true, true);
  event.eventType = 'message';
  window.dispatchEvent(event);
}

export function handleScrollHeader(callback) {
  let timer = 0;

  let beforeScrollTop = window.pageYOffset;
  callback = callback || function () {};
  window.addEventListener(
    'scroll',
    (event) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        let direction = 'up';
        const afterScrollTop = window.pageYOffset;
        const delta = afterScrollTop - beforeScrollTop;
        if (delta === 0) {
          return false;
        }
        direction = delta > 0 ? 'down' : 'up';
        callback(direction);
        beforeScrollTop = afterScrollTop;
      }, 50);
    },
    false,
  );
}

export function isIE() {
  const bw = window.navigator.userAgent;
  const compare = (s) => bw.indexOf(s) >= 0;
  const ie11 = (() => 'ActiveXObject' in window)();
  return compare('MSIE') || ie11;
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
  if (id === '') {
    return;
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id));
  }, timeout);
}
// 绑定表格数据
export function BindPageTable(sourceData) {
  const _mainData = [];
  sourceData.forEach((item, index) => {
    item.key = index + 1;
    _mainData.push(item);
  });
  return _mainData;
}
// 随机生成字符串
export function RandomString(e) {
  if (!e) {
    e = 32;
  }
  const t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const a = t.length;
  let n = '';
  for (let i = 0; i < e; i++) {
    n += t.charAt(Math.floor(Math.random() * a));
  }
  return n;
}
export function TimeToString(time) {
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
}
export function StringToTime(timeStr, format = 'yyyy-MM-DD HH:mm:00') {
  return moment(timeStr).format(format);
}
export function LoadNowTime(format = 'yyyy-MM-DD 00:00:00') {
  const nowdate = moment(Date.now()).format(format);
  return nowdate;
}
export function LoadNowTimeAdd(type, value, format = 'yyyy-MM-DD HH:mm:00') {
  const nowdate = moment(Date.now()).add(value, type).format(format);
  return nowdate;
}
export function TimeIncrement(original, type, value, format = 'yyyy-MM-DD HH:mm:00') {
  return moment(original).add(value, type).format(format);
}
/**
 * 验证字段是否为null或undefined或''
 */
export function CheckField(field) {
  if (
    field === null ||
    field === 'null' ||
    field === undefined ||
    field === 'undefined' ||
    field === '' ||
    field === false ||
    field === 'N' ||
    field.length === 0
  ) {
    return false;
  }
  return true;
}
export function CheckResponseResult(res) {
  if (res.HttpStatusCode === 200 && res.ResultType === 1) {
    return true;
  }
  PromptBox('请求数据失败，请检查日志', 'warning');
  return false;
}
export function LoadTableCss() {
  const clientHeight = document.body.clientHeight;
  document.getElementsByClassName('ant-table')[0].style.height = clientHeight - 360 + 'px';
}
/**
 * 将对象转成JSON格式字符串
 */
export function ObjectToJSONString(obj) {
  return JSON.stringify(obj);
}
/**
 * 将JSON格式字符串转成对象
 */
export function JSONStringToObject(json) {
  return JSON.parse(json);
}
/**
 * 动态替换数据模板
 */
export function FormartDataTemplet(templet, obj) {
  const keys = [];
  const arr = templet.match(/\$\{(.*?)\}/g);
  for (const key in arr) {
    const s = arr[key].replace('${', '').replace('}', '');
    keys.push(s);
  }
  for (let i = 0; i < keys.length; i++) {
    var key = keys[i];
    const value = obj[key];
    templet = templet.replace('${' + key + '}', value);
  }
  return templet;
}
export function CalculateAge(birthday) {
  const ages = [0, 0, 0];
  let strDate1 = birthday + ' 00:00:00.0';
  const date = new Date();
  let strDate2 = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 00:00:00.0';
  strDate1 = strDate1.substring(0, strDate1.lastIndexOf('.')).replace(/-/g, '/');
  strDate2 = strDate2.substring(0, strDate2.lastIndexOf('.')).replace(/-/g, '/');
  //去掉毫秒 把-替换成/ 如果不替换转成时间戳类型火狐会出问题
  const date1 = Date.parse(strDate1);
  const date2 = Date.parse(strDate2);
  const day = Math.ceil((date2 - date1) / (60 * 60 * 1000 * 24));
  // let age = ''// 真实年龄
  const year = Math.floor(day / 365);
  const y = day % 365;
  const month = Math.floor(y / 30);
  const d = Math.floor((day % 365) % 30);
  ages[0] = year;
  ages[1] = month;
  ages[2] = d;
  return ages;
}
/**
 *
 * @param {*} message 显示信息
 * @param {*} type 显示类型（success、error、warning）
 * @param {*} duration 停留时间
 */
export function PromptBox(message, type, placement = 'topRight', duration = 2, title = '提示') {
  Vue.$notification[type]({
    message: title,
    description: message,
    placement,
  });
  // if (type === 'success') {
  //   Vue.$message.success(message, duration)
  // } else if (type === 'error') {
  //   Vue.$message.error(message, duration)
  // } else if (type === 'warning') {
  //   Vue.$message.warning(message, duration)
  // }
}
