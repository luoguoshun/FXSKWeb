const Scan = (callBack) => {
  let code = ''
  let lastTime
  let nextTime
  let lastCode
  let nextCode
  document.onkeypress = function (e) {
    nextCode = e.which
    nextTime = new Date().getTime()
    if (lastCode === null && lastTime === null) {
    } else if (lastCode != null && lastTime != null && nextTime - lastTime <= 30) {
        code += String.fromCharCode(lastCode)
    } else if (lastCode !== null && lastTime !== null && nextTime - lastTime > 1000) {
        code = ''// 超时清空
    }
    lastCode = nextCode
    lastTime = nextTime
    if (e.code === 'Enter' && code !== '') {
      callBack(code)
      code = ''
    }
  }
}
const Scaner = Scan
export { Scaner }
