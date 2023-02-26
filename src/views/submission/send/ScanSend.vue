<template>
  <a-card :bordered="false">
    <a-space>
      打包数：<a-tag color="orange">{{ packageTotal }}</a-tag>
      申请单数：<a-tag color="#2db7f5">{{ appOrderTotal }}</a-tag>
      未确认数：<a-tag color="#f50">{{ notConfirm }}</a-tag>
      已确认数：<a-tag color="#87d068">{{ isConfirm }}</a-tag>
      <a-input-search
        placeholder="输入打包号"
        v-model="code"
        style="width:200px; bottom: 0;"
        enter-button
        @search="onSearch" />
      <span style="color:crimson;">（打包号格式为“--打包编号”）</span>
    </a-space>
    <div style="margin: 10px 0"></div>
    <a-table
      :columns="scanColumns"
      rowKey="Id"
      :data-source="dataSource"
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
import { GetPackageSpecimensBySendId } from '@/api/submission/packaging'
import { PromptBox } from '@/utils/util'
const scanColumns = [
  { title: '是否已采集', dataIndex: 'IsConfirm', scopedSlots: { customRender: 'IsConfirm' } },
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '患者姓名', dataIndex: 'PatientName' },
  { title: '年龄', dataIndex: 'Age' },
  { title: '病人ID', dataIndex: 'HisNo', key: 'HisNo' },
  { title: '打包编号', dataIndex: 'Id' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '标本编号', dataIndex: 'SpecimenId' },
  { title: '标本名称', dataIndex: 'SpecimenName' },
  { title: '离体时间', dataIndex: 'LeaveTime', scopedSlots: { customRender: 'LeaveTime' } },
  { title: '固定时间', dataIndex: 'FixedTime', scopedSlots: { customRender: 'FixedTime' } },
  { title: '固定液', dataIndex: 'FixLiquid', scopedSlots: { customRender: 'FixLiquid' } }
]
export default {
  name: 'ScanSend',
  data () {
    return {
      dataSource: [],
      scanColumns,
      code: '',
      notConfirm: 0,
      isConfirm: 0,
      appOrderTotal: 0,
      packageTotal: 0,
      Ids: [],
      AppNos: [],
      PackageIds: []
    }
  },
  mounted () {
    // 初始化浏览器打印事件
    BrowserPrintInit(this)
    // 初始化扫描枪事件
    Scaner(this.scanCallBack)
    this.dataSource = []
  },
  methods: {
    scanCallBack (code) {
      this.code = ''
      this.scan(code)
    },
    scan (code) {
      let id = 0
      // 打包号
      if (code.toString().indexOf('--') === 0) {
        id = Number(code.substring(2))
        GetPackageSpecimensBySendId(id).then(res => {
          if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
            res.Data.forEach(item => {
              item.IsConfirm = true
              if (this.isInArray(this.Ids, item.SpecimenId) === false) {
                this.Ids.push(item.SpecimenId)
                this.dataSource.push(item)
                this.isConfirm += 1
                this.$emit('childFn', this.dataSource)
              }
              // 更新申请单数量
              res.Data.forEach(item => {
                if (this.AppNos.filter(f => f === item.AppNo).length === 0) {
                  this.AppNos.push(item.AppNo)
                }
              })
              this.appOrderTotal = this.AppNos.length
              // 更新包裹数量
              res.Data.forEach(item => {
                if (this.PackageIds.filter(f => f === item.Id).length === 0) {
                  this.PackageIds.push(item.Id)
                }
              })
              this.packageTotal = this.PackageIds.length
            })
          } else {
            PromptBox(res.Message, 'error')
          }
        })
      } else if (code.toString().indexOf('-') === 0) {
        PromptBox('当前码为标本码，请扫描打包码', 'warning')
        return
      }
    },
    onSearch () {
      this.scan(this.code)
    },
    isInArray (arr, val) {
        var i, iLen
        if (!(arr instanceof Array) || arr.length === 0) {
            return false
        }
        if (typeof Array.prototype.indexOf === 'function') {
            return !!~arr.indexOf(val)
        }
        for (i = 0, iLen = arr.length; i < iLen; i++) {
            if (val === arr[i]) {
                return true
            }
        }
        return false
    }
  }
}
</script>
