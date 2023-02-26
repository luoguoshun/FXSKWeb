<template>
  <a-card :bordered="false" class="scanSendEdit">
    <a-space>
      打包数：<a-tag color="orange">{{ packageTotal }}</a-tag>
      申请单数：<a-tag color="#2db7f5">{{ appOrderTotal }}</a-tag>
      未确认数：
      <a-popconfirm placement="top" ok-text="Yes" cancel-text="No">
        <template slot="title">
          <a-table :columns="notScanColumns" :data-source="notScanData" :pagination="false" :scroll="{ x: 800, y: 400 }">
          </a-table>
        </template>
        <a-tag color="#f50" @click="showNotScan">{{ notConfirm }}</a-tag>
      </a-popconfirm>
      已确认数：<a-tag color="#87d068">{{ isConfirm }}</a-tag>
      <a-input-search placeholder="输入打包号/标本号" v-model="code" style="width:200px; bottom: 0;" enter-button @search="onSearch" />
      <span style="color:crimson;">（打包号格式为--打包编号”，标本号格式为“-标本编号”）</span>
    </a-space>
    <div style="margin: 10px 0"></div>
    <a-table
      :columns="columns"
      rowKey="Id"
      :data-source="data"
      :pagination="false"
      class="components-table-demo-nested">
      <template slot="IsConfirm" slot-scope="text">
        <span v-if="text===true"><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">是</span></span>
        <span v-if="text===false"><span class="ant-badge-status-text" style="color:red;">否</span></span>
      </template>
      <template slot="LeaveTime" slot-scope="text">
        <span v-if="text">{{ text }}</span>
        <span v-else-if="text === null" style="font-weight: bold; color:red;">{{ text ? text : '离体时间异常' }}</span>
      </template>
      <template slot="FixedTime" slot-scope="text">
        <span v-if="text">{{ text }}</span>
        <span v-else-if="text === null" style="font-weight: bold; color:red;">{{ text ? text : '固定时间异常' }}</span>
      </template>
    </a-table>
  </a-card>
</template>
<script>
import { BrowserPrintInit } from '@/utils/BrowserPrint.js'
import { Scaner } from '@/utils/scan'
import { JSONStringToObject, ObjectToJSONString, PromptBox } from '@/utils/util'
const data = []
const columns = [
  { title: '是否已采集', dataIndex: 'IsConfirm', scopedSlots: { customRender: 'IsConfirm' } },
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '患者姓名', dataIndex: 'PatientName' },
  { title: '年龄', dataIndex: 'Age' },
  { title: '病人ID', dataIndex: 'HisNo', key: 'HisNo' },
  { title: '打包编号', dataIndex: 'SendId' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '标本编号', dataIndex: 'Id' },
  { title: '标本名称', dataIndex: 'SpecimenName' },
  { title: '离体时间', dataIndex: 'LeaveTime', scopedSlots: { customRender: 'LeaveTime' } },
  { title: '固定时间', dataIndex: 'FixedTime', scopedSlots: { customRender: 'FixedTime' } },
  { title: '固定液', dataIndex: 'FixLiquid', scopedSlots: { customRender: 'FixLiquid' } }
]
const notScanData = []
const notScanColumns = [
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '患者姓名', dataIndex: 'PatientName' },
  { title: '病人ID', dataIndex: 'HisNo', key: 'HisNo' },
  { title: '打包编号', dataIndex: 'SendId' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '标本名称', dataIndex: 'SpecimenName' },
]
export default {
  name: 'ScanSendList',
  props: {
    packageCount: {
      type: Number,
      default: 0
    },
    dataSource: {
      type: [Object, Array],
      default: () => {}
    }
  },
  data () {
    return {
      notScanData,
      data,
      notScanColumns,
      columns,
      code: '',
      notConfirm: 0,
      isConfirm: 0,
      packageTotal: 0,
      appOrderTotal: 0
    }
  },
  mounted () {
    this.packageTotal = this.packageCount
    this.data = this.dataSource
    // 初始化浏览器打印事件
    BrowserPrintInit(this)
    // 初始化扫描枪事件
    Scaner(this.scanCallBack)
    this.refreshScanTotal()
  },
  methods: {
    showNotScan () {
      this.notScanData = this.data.filter(f => f.IsConfirm === false)
    },
    scanCallBack (code) {
      this.code = ''
      this.scan(code)
    },
    scan (code) {
      let id = 0
      // 打包号
      if (code.toString().indexOf('--') === 0) {
        id = Number(code.substring(2))
        var _scanSends = this.data.filter(f => f.SendId === id)
        if (_scanSends.length === 0) {
          PromptBox('该打包编号不存在', 'warning')
          return
        }
        _scanSends.forEach(item => {
            this.updateField(item.Id, 'IsConfirm', true)
        })
        this.refreshScanTotal()
      } else if (code.toString().indexOf('-') === 0) {
        id = Number(code.substring(1))
        if (this.data.filter(w => w.Id === id).length === 0) {
          PromptBox('该标本不在列表中', 'warning')
          return
        }
        if (this.data.filter(w => w.Id === id && w.IsConfirm === true).length > 0) {
          PromptBox('该标本已确认', 'warning')
          return
        }
        if (id > 0) {
          if (this.data.filter(w => w.Id === id)) {
            this.updateField(id, 'IsConfirm', true)
            this.refreshScanTotal()
          }
        }
      }
    },
    updateField (id, fileName, fileValue) {
      if (this.data.filter(w => w.Id === id && w.IsConfirm === true).length > 0) {
        PromptBox('该标本已确认', 'warning')
        return
      }
      let _index = 0
      this.data.forEach((item, index) => {
        if (item.Id === id) {
          _index = index
          item[fileName] = fileValue
        }
      })
      const _tempObj = this.data[_index]
      for (let i = (_index - 1); i >= 0; i--) {
        this.data[i + 1] = this.data[i]
      }
      this.data[0] = _tempObj
      const _tempData = ObjectToJSONString(this.data)
      this.data = []
      this.data = JSONStringToObject(_tempData)
    },
    onSearch () {
      this.scan(this.code)
    },
    refreshScanTotal (isReload = false) {
      let _isScanTotal = 0
      let _isNotScanTotal = 0
      this.data.forEach((item, index) => {
          if (item.IsConfirm) {
            _isScanTotal += 1
          } else {
            _isNotScanTotal += 1
          }
      })
      this.isConfirm = _isScanTotal
      this.notConfirm = _isNotScanTotal
      if (this.notConfirm === 0 && isReload === false) {
        PromptBox('所有标本都完成确认', 'success')
        this.$emit('changeData', this.data)
      }
      // 更新申请单数量
      const _tempOrder = []
      this.data.forEach(item => {
        if (_tempOrder.filter(f => f === item.AppNo).length === 0) {
          _tempOrder.push(item.AppNo)
        }
      })
      this.appOrderTotal = _tempOrder.length
    }
  }
}
</script>
<style>
.ant-popover-buttons{
  display: none;
}
.scanSendEdit .ant-divider{
  margin: 5px 0;
}
.flag .ant-col-17 { width:100%;}
.scanSendEdit .ant-row .ant-form-item{
 margin-bottom:5px;
}
.ant-modal-footer {
  z-index: 999999;
  position: sticky;
  bottom: 0px;
  background-color: #ffffff
}
</style>
