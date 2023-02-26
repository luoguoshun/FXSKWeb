import axios from 'axios'
import JSZipUtils from 'jszip-utils'
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import { saveAs } from 'file-saver'
const path = require('path')

export function createCaptcha (len, domId) {
    if (!len) len = 4
    let code = ''
    var chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'I', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    for (var i = 0; i < len; i++) {
        var charIndex = Math.floor(Math.random() * chars.length)
        code += chars[charIndex]
    }
    if (domId) fillCanvas(domId, code)
    return code
}
export function createDomCaptcha (id, len) {
    if (!len) len = 4
    let code = ''
    var chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'I', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    for (var i = 0; i < len; i++) {
        var charIndex = Math.floor(Math.random() * chars.length)
        code += chars[charIndex]
    }
    if (id) fillCanvas(id, code)
    return code
}
export function fillCanvas (id, code) {
    var canvas = document.getElementById(id)
    if (canvas) {
        var ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, 1000, 1000)
        ctx.font = "80px 'Hiragino Sans GB'"
        ctx.fillStyle = '#E8DFE8'
        ctx.fillText(code, 0, 100)
    }
}

/**
 * 获取超时数量
 * @param {array} data 超时数组
 * @param {number} day 天数
 * @param {boolean} isLarge 是否大于
 */
export function getTimeoutCount (data, day, isLarge) {
    if (!data || data.length === 0) return 0
    const list = isLarge ? data.filter(m => m.UseTime > day && m.UseTimeUnit === '日')
      : data.filter(m => m.UseTime === day && m.UseTimeUnit === '日')
    return list && list.length > 0 ? list.map(m => m.Total).reduce((x, y) => x + y) : 0
}

/**
 * 获取数组某字段的总和
 * @param {array} array 数组
 * @param {string} field 字段名
 */
export function getArrayFieldSum (array, field) {
    if (!array || array.length === 0) return 0
    return array.map(m => m[field]).reduce((x, y) => x + y)
}

/**
 * 将base64转换成ArrayBuffer
 * @param {String} dataURL base64内容
 */
export function base64DataURLToArrayBuffer (dataURL) {
    const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/
    if (!base64Regex.test(dataURL)) {
        return false
    }
    const stringBase64 = dataURL.replace(base64Regex, '')
    let binaryString
    if (typeof window !== 'undefined') {
        binaryString = window.atob(stringBase64)
    } else {
        binaryString = Buffer.from(stringBase64, 'base64').toString('binary')
    }
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
        const ascii = binaryString.charCodeAt(i)
        bytes[i] = ascii
    }
    return bytes.buffer
}

/**
 * 导出word
 * @param {String} templateName docx模板名称（模板默认存放在public/templates/下）
 * @param {Object} wordData docx模板数据
 * @param {Array} imgSize 图片大小数组[宽,高]
 */
export function exportWord (templateName, wordData, imgSize) {
    var ImageModule = require('docxtemplater-image-module-free')
    const templatePath = path.join(__dirname, 'templates/' + templateName + '.docx')
    JSZipUtils.getBinaryContent(templatePath, function (error, content) {
        if (error) throw error

        const opts = {}
        opts.centered = true
        opts.fileType = 'docx'
        opts.getImage = (tag) => {
            return base64DataURLToArrayBuffer(tag)
        }
        opts.getSize = () => { // 图片宽和高
            return imgSize && imgSize.length === 2 && imgSize[0] > 0 && imgSize[1] > 0 ? imgSize : [600, 300]
        }

        const zip = new PizZip(content)
        const doc = new Docxtemplater()
        doc.attachModule(new ImageModule(opts))
        doc.loadZip(zip)
        doc.setData({
            ...wordData
        })
        try {
            doc.render()
        } catch (error) {
            // var e = {
            //     message: error.message,
            //     name: error.name,
            //     stack: error.stack,
            //     properties: error.properties
            // }
            throw error
        }

        var out = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        })
        saveAs(out, `${templateName}-${(new Date()).valueOf()}.docx`)
    })
}

/**
 * 通过axios获取json（可以是本地json文件）
 * @param {*} url 访问路径
 * @returns json
 */
export const getJson = function (url) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: url,
        dataType: 'json',
        crossDomain: true,
        cache: false
      }).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
}
