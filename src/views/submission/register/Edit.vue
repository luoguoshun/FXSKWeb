<template>
  <div>
    <a-card :bordered="false">
      <a-space>
        <a-input v-model="RegisterCode" v-if="RegisterCodeVisible" placeholder="确认人" />
        <!-- <ScanCode @scan="scan" :isConfirm="isConfirm" :notConfirm="notConfirm" /> -->
        未确认数：<a-tag color="#f50">{{ notConfirm }}</a-tag>
        已确认数：<a-tag color="#87d068">{{ isConfirm }}</a-tag>
        <a-input-search
          ref="No"
          placeholder="输入住院号或标本号"
          v-model="No"
          style="width:200px; bottom: 0;"
          enter-button
          @search="onSearch"
        />
        <a-button type="danger" @click="clearData">清空</a-button>
      </a-space>
      <div style="margin: 10px 0"></div>
      <a-table
        :columns="columns"
        rowKey="Id"
        :data-source="data"
        :pagination="pagination"
        @change="handleTableChange"
        class="components-table-demo-nested">
        <template slot="IsConfirm" slot-scope="text">
          <span v-if="text===true"><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">是</span></span>
          <span v-if="text==false"><span class="ant-badge-status-text" style="color:red;">否</span></span>
        </template>
        <template slot="Sex" slot-scope="text">
          <span v-if="text==0"><span class="ant-badge-status-text" style="color:#096dd9;">男</span></span>
          <span v-if="text==1"><span class="ant-badge-status-text" style="color:#f198aa;">女</span></span>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model="OrderListVisible"
      :centered="true"
      width="1000px"
      title="申请单列表"
    >
      <a-table
        :columns="columns2"
        :data-source="data2"
      >
        <template slot="Sex" slot-scope="text">
          <span v-if="text==0"><span class="ant-badge-status-text" style="color:#096dd9;">男</span></span>
          <span v-if="text==1"><span class="ant-badge-status-text" style="color:#f198aa;">女</span></span>
        </template>
        <span slot="operation" slot-scope="text, record">
          <template>
            <a @click="checkOrder(record)">选择</a>
          </template>
        </span>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { scanCheckInSpecimens } from '@/api/submission/register'
import { getAppSpecimensById, getAppSpecimensByOneId } from '@/api/submission/collect'
import Edit from './Edit'
import moment from 'moment'
import { Scaner } from '@/utils/scan'
import ScanCode from '@/components/ScanCode/ScanCode'
import { getStrategyTemplate } from '@/api/system/strategy'
import { CheckField, JSONStringToObject, PromptBox } from '@/utils/util'
const data = []// 一级列表数据
const columns = [
  { title: '是否确认', dataIndex: 'IsConfirm', scopedSlots: { customRender: 'IsConfirm' } },
  { title: '标本编码', dataIndex: 'Id' },
  { title: '标本名称', dataIndex: 'SpecimenName' },
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '手腕码', dataIndex: 'InpatientWristCode' },
  { title: '开单时间', dataIndex: 'ReqDateTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '患者姓名', dataIndex: 'PatientName' },
  { title: '病人ID', dataIndex: 'HisNo', key: 'HisNo' },
  { title: '所属部位', dataIndex: 'PartName' },
  { title: '离体时间', dataIndex: 'LeaveTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '固定时间', dataIndex: 'FixedTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '固定液', dataIndex: 'FixLiquid' },
  { title: '性别', dataIndex: 'Sex', scopedSlots: { customRender: 'Sex' } },
  { title: '门诊号', dataIndex: 'OutpatientNum' },
  { title: '住院号', dataIndex: 'AdmissionNum' }
]
const data2 = []
const columns2 = [
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '手腕码', dataIndex: 'InpatientWristCode' },
  { title: '开单时间', dataIndex: 'ReqDateTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '患者姓名', dataIndex: 'PatientName' },
  { title: '性别', dataIndex: 'Sex', scopedSlots: { customRender: 'Sex' } },
  { title: '门诊号', dataIndex: 'OutpatientNum' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
]
export default {
  components: {
    Edit,
    ScanCode
  },
  data () {
    return {
      data,
      data2,
      columns,
      columns2,
      allData: [],
      pageSize: 10,
      current: 1,
      total: 0,
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      isConfirm: 0,
      notConfirm: 0,
      OrderListVisible: false,
      RegisterCodeVisible: false,
      RegisterCode: '',
      No: ''
    }
  },
  created: function () {
    this.data = []
    Scaner(this.scanCallBack)
    this.initialize()
  },
  computed: {
  },
  methods: {
    initialize () {
      getStrategyTemplate('Register').then(res => {
        const strategy = JSONStringToObject(res.Content).property
        if (CheckField(strategy) && CheckField(strategy.RegisterCode.visible)) {
          this.RegisterCodeVisible = strategy.RegisterCode.visible
        }
      })
    },
    onSearch () {
      this.scan(this.No)
    },
    scanCallBack (code) {
      this.No = ''
      this.scan(code)
    },
    scan (code) {
      this.No = ''
      if (this.RegisterCodeVisible === true && CheckField(this.RegisterCode) === false) {
        PromptBox('请输入确认人工号', 'warning')
        return
      }
      const type = 'specimenId'
      const $this = this
      let id
      if (code.indexOf('-') === 0) {
        id = Number(code.substring(1))
      } else if (this.data.length > 0) {
        // 判断是否存在未确认的标本
        if (code.indexOf('-') < 0) {
          return
        }
        // 判断无效码
        id = Number(code.substring(1))
        if (id < 1) {
          return
        }
      } else {
        id = code
      }
      // 首次有效扫码读取标本下的申请单的所有标本信息
      if (!this.inArrayExt(id)) {
          this.loadData(id, type)
      } else {
         // 后续标本采集状态更新
          this.scanCollect(id, function () {
              $this.updateField(id, 'IsConfirm', true)
              $this.refreshScanTotal()
          }, false)
      }
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
      }
    },
    clearData () {
      this.data = []
      this.refreshScanTotal()
    },
    loadData (id, type = 'wristCode') {
      const $this = this
      if (type === 'specimenId') {
        getAppSpecimensByOneId(id, '登记').then(res => {
          if (res.HttpStatusCode === 200 && res.ResultType === 0) {
            PromptBox(res.Message, 'warning')
            return
          }
          if (res.HttpStatusCode === 200 && res.ResultType === 1 && res.Data.length === 0) {
            PromptBox('该申请单状态未能进行确认', 'warning')
            return
          }
          res.data = res.Data
          if (res.data && res.data.length > 0) {
            const obj = res.data.filter(w => w.AllowOperating === false)
            if (obj.length > 0) {
              let warnStr = ''
              obj.forEach(item => {
                warnStr += `编号为【${item.Id}】的标本未进行【${item.LastSpecimenStatus}】\n`
              })
              PromptBox(warnStr, 'warning')
            }
            this.loadOrderSpecimens(res.data)
          }
          // 第一个标本动态更新状态
          this.scanCollect(id, function () {
              $this.updateField(id, 'IsConfirm', true)
              $this.refreshScanTotal()
          }, false)
        })
      } else {
        getAppSpecimensById(id).then(res => {
          if (res.HttpStatusCode === 200 && res.data.length === 0) {
            PromptBox('该申请单还不能进行确认', 'warning')
            return
          }
          if (res.data && res.data.length > 0) {
            const _temp = []
            this.allData = res.data
            res.data.forEach(item => {
              if (_temp.filter(f => f.AppNo === item.AppNo).length === 0) {
                _temp.push(item)
              }
            })
            if (_temp.length > 1) {
              this.OrderListVisible = true
              this.data2 = _temp
            } else {
              this.loadOrderSpecimens(res.data)
            }
          }
        })
      }
    },
    loadOrderSpecimens (data) {
      data.forEach((item, index) => {
        if (!this.inArrayExt(item.Id)) {
          if (!item.LeaveTime || item.LeaveTime === 'null') item.LeaveTime = ''
          if (!item.FixedTime || item.FixedTime === 'null') item.FixedTime = ''
          this.data.push(item)
        }
      })
    },
    checkOrder (data) {
      const _temp = []
      this.allData.forEach(item => {
        if (item.AppNo === data.AppNo) {
          _temp.push(item)
        }
      })
      this.loadOrderSpecimens(_temp)
      this.OrderListVisible = false
      this.data2 = []
      this.allData = []
    },
    getDataItem (id) {
      let result = {}
      this.data.forEach(item => {
        if (item.Id === id) {
          result = item
        }
      })
      return result
    },
    inArrayExt (id) {
      let ext = false
      this.data.forEach(item => {
        if (id === item.Id) {
          ext = true
        }
      })
      return ext
    },
    updateField (id, fileName, fileValue) {
      const dataSource = [...this.data]
      let _index = 0
      dataSource.forEach((item, index) => {
        if (item.Id === id) {
          _index = index
          item[fileName] = fileValue
        }
      })
      const _tempObj = dataSource[_index]
      for (let i = (_index - 1); i >= 0; i--) {
        dataSource[i + 1] = dataSource[i]
      }
      dataSource[0] = _tempObj
      this.data = dataSource
    },
    scanCollect (id, callback, isFirstScan) {
      var isScanFinish = true
      this.data.forEach((item, index) => {
        if (item.IsConfirm === false) {
          isScanFinish = false
        }
      })
      if (isScanFinish && isFirstScan === false) {
          PromptBox('该申请单已经扫描完毕', 'success')
          return
      }
      scanCheckInSpecimens({ 'Id': id, 'Register': this.RegisterCode }).then(res => {
        if (res.HttpStatusCode === 200 && res.ResultType === 1) {
          callback()
        } else {
          PromptBox(res.Message, 'warning')
        }
      })
    },
    reLoad () {
      this.Status = 'n'
      this.load(1, 10, 'n')
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.load(pager.current, pager.pageSize)
    },
    onChangeBegin () {
    },
    onChangeEnd () {
    }
  }
}
</script>
