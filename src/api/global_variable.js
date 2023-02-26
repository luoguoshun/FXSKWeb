// import { getJson } from '@/utils/helper'
// import storage from 'store'
// const baseURL = 'http://localhost:61388/api'
// const baseURL = 'http://192.168.3.36:61388/api'
// const baseURL = 'http://10.18.0.28:61388/api'
// let baseURL = ''
// getJson(`urls.json`).then(res => {
//     baseURL = res.data.apiBaseUrl
//     storage.set('baseURL', baseURL)
// })

// const json = require(process.env.VUE_APP_API_BASE_URL)
// const baseURL = json['apiBaseUrl']
export default {
    selectedDevice: {},
    devices: []
}
