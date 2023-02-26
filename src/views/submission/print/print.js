
import { FormartDataTemplet, PromptBox } from '@/utils/util'

export function printLabel ($this, printObj, printLableTemplateContent) {
  timeoutPrint(printObj, 0)
  // 定时打印机标本标签，如果一次性全部发送给打印机，标签打印不按顺序
  function timeoutPrint (data, i) {
    window.setTimeout(function () {
      const printData = FormartDataTemplet(printLableTemplateContent, data[i])
      $this.GLOBAL.selectedDevice.send(printData, undefined, errorCallback)
      // 如果下个索引超出了当前标本列表长度则不继续打印
      if ((i + 1) < data.length) {
        timeoutPrint(data, i + 1)
      }
    }, 500)
  }
  function errorCallback (errorMessage) {
    if (errorMessage === 'Failed to write to device') {
      PromptBox('Error: 请检查打印机连接是否正确！', 'warning', 'topRight', 2)
    }
  }
}
