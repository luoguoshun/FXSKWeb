<template>
  <div>
    <a-card :bordered="false">
      <a-alert message="通过设置离体和接收时间间隔，从而筛选超过间隔的异常标本信息" banner style="margin-bottom:10px;"/>
      <a-form class="ant-advanced-search-form">
        <a-form-item v-show="false" label="主键ID">
          <a-input v-decorator="['Id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-row :gutter="24">
          <a-col :span="4">
            <a-form-item label="时间间隔(分钟)">
              <a-input-number v-model="intervalTime" :min="1" />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="打包科室">
              <a-select v-model="packageDepartment">
                <a-select-option v-for="d in departmentData" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="4">
            <a-form-item label="标本状态">
              <a-select placeholder="选择类型" v-model="specimenStatus" >
                <a-select-option v-for="d in nodeTypeDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col> -->
          <a-col :span="4">
            <a-form-item label="开始时间">
              <a-date-picker placeholder="开始时间" v-model="startTime"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="结束时间">
              <a-date-picker placeholder="结束时间" v-model="endTime"/>
            </a-form-item>
          </a-col>
        </a-row> 
        <a-row>
          <a-col :span="24" :style="{ textAlign: 'right' }">
            标本数：<span style="font-weight:bold;color:red; margin-right:10px;">{{ SpecimenTotal }}</span>
            <a-button type="primary" @click="handleSearch">
              查询
            </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
              重置
            </a-button>
            <a-divider type="vertical" />
            <a-button type="primary" icon="export" @click="exportFile()">导出</a-button>
            <a-divider type="vertical" />
            <a-button type="default" icon="reload" @click="load(1, 10)">刷新</a-button>
          </a-col>
        </a-row>
      </a-form>
      <div style="margin: 10px 0"></div>
      <a-spin tip="加载中..." :spinning="loading">
        <div class="spin-content">
          <a-table
            :columns="columns"
            rowKey="Id"
            :data-source="data"
            :pagination="pagination"
            @change="handleTableChange"
            class="components-table-demo-nested">
            <template slot="NodeType" slot-scope="text">
              <span v-if="text==d.value" v-for="d in nodeTypeDatas" :style="{ color: d.color }" :key="d.value" :value="d.value">{{ d.text }}</span>
            </template>
            <template slot="PathologyCode" slot-scope="text">
              <span v-if="text==d.value" v-for="d in pathologyType" :key="d.value" :value="d.value">{{ d.text }}</span>
            </template>
            <span slot="operation" slot-scope="text, record">
              <template>
                <a @click="trace(record)">轨迹</a>
                </a-popconfirm>
              </template>
            </span>
          </a-table>  
        </div>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import { getSpecimenReceivePager } from '@/api/specimentrace/specimentrace'
import { CheckField, PromptBox } from '@/utils/util'
import { getSpecimenStatus } from '@/api/submission/app'
import Trace from '@/views/submission/speciment/Trace'
import { getDepartmentData } from '@/api/basics/department'
import { getSubmissionTypes } from '@/api/system/workflow'
import { exportJsonToExcel } from '@/utils/xlsx/Export2Excel'
import moment from 'moment'
const data = []// 一级列表数据
const columns = [
  { title: '状态', dataIndex: 'NodeType', scopedSlots: { customRender: 'NodeType' } },
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '标本名称', dataIndex: 'SpecimenName' },
  { title: '病人姓名', dataIndex: 'PatientName' },
  { title: '时间间隔', dataIndex: 'IntervalTime', customRender: (val) => { 
    const day = Math.floor(val / (60 * 24))
    const residueMinute = val % (60 * 24)
    const hour = Math.floor(residueMinute / 60)
    const minute = residueMinute % 60
    
    return `${day}天${hour}小时${minute}分钟`
   }  },
  { title: '离体时间', dataIndex: 'LeaveTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '接收时间', dataIndex: 'ReceiveTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '打包科室', dataIndex: 'PackageDeptName' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '离体操作人', dataIndex: 'Operator' },
  { title: '接收操作人', dataIndex: 'Operator2' },
  { title: '打包时间', dataIndex: 'PackageTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '创建时间', dataIndex: 'CreatedTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
]
export default {
  components: {
    Trace
  },
  computed: {
    count () {
      return this.expand ? 17 : 8
    }
  },
  data () {
    return {
      data,
      columns,
      intervalTime: 0,
      packageDepartment: '',
      specimenStatus: null,
      SpecimenTotal: 0,
      AppOrderTotal: 0,
      startTime: null,
      endTime: null,
      pathologyType: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      nodeTypeDatas: [],
      departmentData: [{ value: '', text: '全部' }],
      key: '',
      keyType: '',
      loading: false
    }
  },
  created: function () {
    this.getDepartmentData()
    this.getSpecimenStatus()
    getSubmissionTypes().then(res => {
      res.forEach(element => {
        this.pathologyType.push({
          value: element.Content,
          text: element.Name
        })
      })
    })
    this.load(1, 10)
  },
  methods: {
    getRandomInt (max, min = 0) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    getDepartmentData () {
      const $this = this
      getDepartmentData().then(res => {
        if (res.data !== null) {
          res.data.forEach(item => {
            $this.departmentData.push({ value: item.DeptCode, text: item.DeptName })
          })
        }
      })
    },
    getSpecimenStatus () {
      getSpecimenStatus().then((res) => {
          this.nodeTypeDatas.push({ value: '', text: '全部' })
        Object.keys(res.data).forEach(element => {
          if (element === '退回') {
            this.nodeTypeDatas.push({ value: res.data[element], text: element, color: 'red' })
          } else {
            this.nodeTypeDatas.push({ value: res.data[element], text: element, color: '#000000a6' })
          }
        })
      })
    },
    handleSearch (e) {
      this.load(1, 10)
    },
    load (pageIndex, pageSize, parameter) {
      this.loading = true
      if (parameter === undefined) {
        parameter = { Id: 0 }
      }
      parameter.DeptName = this.packageDepartment
      parameter.IntervalTime = this.intervalTime
      if (CheckField(this.startTime)) {
        parameter.OperationStartTime = moment(this.startTime).format('YYYY-MM-DD 00:00:00')
      }
      if (CheckField(this.endTime)) {
        parameter.OperationEndTime = moment(this.endTime).format('YYYY-MM-DD 23:59:59')
      }
      parameter.NodeType = this.specimenStatus
      const $this = this
      const param = { 'ObjectDTO': parameter, 'PageIndex': pageIndex, 'pageSize': pageSize }
      getSpecimenReceivePager(param).then((res) => {
        this.loading = false
        $this.data = res.data
        $this.SpecimenTotal = res.count
        $this.AppOrderTotal = res.appOrderCount
        $this.pagination.total = res.count
        $this.pagination.current = pageIndex
      })
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.load(pager.current, pager.pageSize)
    },
    exportFile () {
      this.loading = true
      const parameter = {}
      if (parameter === undefined) {
        parameter = { Id: 0 }
      }
      parameter.DeptName = this.packageDepartment
      parameter.IntervalTime = this.intervalTime
      if (CheckField(this.startTime)) {
        parameter.OperationStartTime = moment(this.startTime).format('YYYY-MM-DD 00:00:00')
      }
      if (CheckField(this.endTime)) {
        parameter.OperationEndTime = moment(this.endTime).format('YYYY-MM-DD 23:59:59')
      }
      parameter.NodeType = this.specimenStatus
      const param = { 'ObjectDTO': parameter, 'PageIndex': 1, 'pageSize': 99999 }
      getSpecimenReceivePager(param).then((res) => {
        this.loading = false
        const excelHeader = ['打包科室', '门诊号', '住院号', '申请单号', '患者姓名', '年龄', '录入时间', '标本名','固定操作人','接收操作人', '固定时间', '接收时间', '时间间隔']
        const filterVal = ['PackageDeptName', 'OutpatientNum', 'AdmissionNum', 'AppNo', 'PatientName', 'Age', 'ReqDateTime', 'SpecimenNames', 'Operator', 'Operator2', 'LeaveTime', 'ReceiveTime', 'IntervalTime']
        res.data.forEach(f => {
          if (CheckField(f.OutpatientNum) === false) {
            f.OutpatientNum = ''
            f.ReqDateTime = moment(f.ReqDateTime).format('YYYY-MM-DD HH:mm:ss')
          }
          const day = Math.floor(f.IntervalTime / (60 * 24))
          const residueMinute = f.IntervalTime % (60 * 24)
          const hour = Math.floor(residueMinute / 60)
          const minute = residueMinute % 60
          f.IntervalTime = `${day}天${hour}小时${minute}分钟`
        })
        const list = res.data
        const data = formatJson(filterVal, list)
        exportJsonToExcel(excelHeader, data, '标本固定异常信息')
        function formatJson (filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => v[j]))
        }
      })
    },
    handleReset () {
      this.form.resetFields()
    },
    toggle () {
      this.expand = !this.expand
    },
    trace (record) {
      this.$dialog(Trace,
        // component props
        {
          record,
          on: {
            ok () {
            },
            cancel () {
            },
            close () {
            }
          }
        },
        // modal props
        {
          title: '标本轨迹',
          width: 1000,
          centered: true,
          maskClosable: true,
          footer: ''
        })
    }
  }
}
</script>
<style>
.ant-advanced-search-form {
  padding: 24px;
  background: #fbfbfb;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}

#components-form-demo-advanced-search .ant-form {
  max-width: none;
}
#components-form-demo-advanced-search .search-result-list {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding-top: 80px;
}
</style>
