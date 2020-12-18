export const formatTime = (date, fmt) => {
  if (!date) {
    return
  }
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (!fmt) {
    fmt = 'yyyy-MM-dd HH:mm:ss'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/**
* 深拷贝
* @param {*} obj 拷贝对象(object or array)
* @param {*} cache 缓存数组
*/
export const deepCopy = (obj, cache = []) => {
  // typeof [] => 'object'
  // typeof {} => 'object'
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  // 如果传入的对象与缓存的相等, 则递归结束, 这样防止循环
  /**
   * 类似下面这种
   * var a = {b:1}
   * a.c = a
   * 资料: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
   */
  const hit = cache.filter(c => c.original === obj)[0]
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  // 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
  cache.push({
    original: obj,
    copy
  })
  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

export const mapToForm = (map) => {
  let formData = new FormData();
  Object.keys(map).forEach(item => {
    formData.append(item, map[item])
  })
  return formData
}

// 删除空对象 删除'', null, undefined
export const compactObj = (obj, fn) => {
  for (var i in obj) {
    if (typeof obj[i] === 'object') {
      compactObj(obj[i], fn)
    }
    if (fn(obj[i])) {
      delete obj[i]
    }
  }
}

export const isEmpty = (foo) => {
  if (typeof foo === 'object') {
    for (var i in foo) {
      return false
    }
    return true
  } else {
    return foo === '' || foo === null || foo === undefined
  }
}

export const formatLocationOrigin = (url) => {
  const origin = window.location.origin
  const reg = /localhost/g
  if (reg.test(origin)) {
    url = url.replace('http://dev.localcards.gov.vbooster.cn', '')
  } else {
    url = url.replace(origin, '')
  }
  return url
}

export const needlim = (url = "") => {
  if (!url) {
    return ''
  }
  const httpReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
  const isDev = process.env.NODE_ENV == "development";
  const origin = window.location.origin;
  if (httpReg.test(url)) {
    return url;
  } else {
    if (!/^\//.test(url)) url = "/" + url;
    if (isDev) {
      return `http://dev.localcards.gov.vbooster.cn${url}`;
    } else {
      return `${origin}${url}`;
    }
  }
}

// 判断连续整数
export const isContinuityNum = (array) => {
  var i = array[0];
  var isContinuation = true;
  for (var e in array) {
    if (array[e] != i) {
      isContinuation = false;
      break;
    }
    i++;
  }
  return isContinuation;
}
// 判断浏览器类型
export function getBrowser () {
  const userAgent = navigator.userAgent
  if (userAgent.indexOf('OPR') > -1) {
    return 'Opera'
  }
  if (userAgent.indexOf('Firefox') > -1) {
    return 'FF'
  }
  if (userAgent.indexOf('Trident') > -1) {
    return 'IE'
  }
  if (userAgent.indexOf('Edge') > -1) {
    return 'Edge'
  }
  if (userAgent.indexOf('Chrome') > -1) {
    return 'Chrome'
  }
  if (userAgent.indexOf('Safari') > -1) {
    return 'Safari'
  }
}