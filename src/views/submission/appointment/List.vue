<template>
  <div>
    <a-card :bordered="false">
      <a-row>
        <a-col span="24">
          <a-space>
            <a-date-picker v-model="filters.startDate" placeholder="开始时间"/>
            <a-date-picker v-model="filters.endDate" placeholder="结束时间"/>
            <a-input-group compact style="width:300px;">
              <a-select placeholder="选择类型" v-model="filters.type" style="width: 35%">
                <a-select-option v-for="d in keyTypeDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
              <a-input style="width: 65%" class="ant-input" v-model="filters.keys" placeholder="输入关键字值" @keypress.13.native="search"/>
            </a-input-group>
            <a-button type="primary" icon="search" @click="search()">查询</a-button>
          </a-space>
        </a-col>
      </a-row>
      <div style="margin: 10px 0" tabindex="0" id="apply_main"></div>
      <a-table
        :columns="columns"
        rowKey="Id"
        ref="tableref"
        :data-source="data"
        :pagination="pagination"
        @change="handleTableChange"
        class="components-table-demo-nested">
        <template slot="Sex" slot-scope="text">
          <span v-if="text==0"><span class="ant-badge-status-text" style="color:#096dd9;">男</span></span>
          <span v-if="text==1"><span class="ant-badge-status-text" style="color:#f198aa;">女</span></span>
        </template>
        <template slot="PathologyCode" slot-scope="text">
          <span v-if="text==d.value" v-for="d in pathologyType" :key="d.value" :value="d.value">{{ d.text }}</span>
        </template>
        <template slot="Age" slot-scope="text, record">
          <span>{{ record.AgeYear }}岁{{ record.AgeMonth }}月{{ record.AgeDay }}日</span>
        </template>
        <template slot="Department" slot-scope="text">
          <span v-if="text==d.value" v-for="d in departmentDatas":key="d.value" :value="d.value">{{ d.text }}</span>
        </template>
        <span slot="operation" slot-scope="text, record">
          <template>
            <a @click="edit(record)">查看</a>
          </template>
        </span>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { getAppointmentOrderData } from '@/api/submission/app'
import { CheckField } from '@/utils/util'
import { getPathologyTypes } from '@/api/system/dictionary'
import moment from 'moment'
import Edit from './Preview.vue'
import { getStrategyTemplate } from '@/api/system/strategy'
const data = []// 一级列表数据
const columns = [
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '患者姓名', dataIndex: 'PatientName' },
  { title: '年龄', dataIndex: 'Age', scopedSlots: { customRender: 'Age' } },
  { title: '性别', dataIndex: 'Sex', scopedSlots: { customRender: 'Sex' } },
  { title: '病人ID', dataIndex: 'HisNo', key: 'HisNo' },
  { title: '门诊号', dataIndex: 'OutpatientNum' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '标本数量', dataIndex: 'SpecimenTotal' },
  { title: '标本科室', dataIndex: 'SendDepartmentName' },
  { title: '送检类型', dataIndex: 'PathologyCode', scopedSlots: { customRender: 'PathologyCode' } },
  { title: '录入时间', dataIndex: 'CreatedTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '预约日期', dataIndex: 'AppointmentTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD') : '' } },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
]
export default {
  components: {
    Edit
  },
  data () {
    return {
      data,
      columns,
      keyTypeDatas: [
        { value: '1', text: '病人ID' },
        { value: '2', text: '住院号' },
        { value: '3', text: '门诊号' },
        { value: '4', text: '患者姓名' },
        { value: '6', text: '申请单号' }
      ],
      filters: {
        keys: '',
        type: '1',
        startDate: '',
        endDate: '',
        pathologyType: 'appointment'
      },
      pathologyType: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      moment,
      strategys: {}
    }
  },
  created: function () {
    this.initialize()
    this.load()
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    initialize () {
      getStrategyTemplate('AppEdit').then(res => {
        this.strategys = res.Content
      })
      getPathologyTypes().then(res => {
        if (CheckField(res)) {
          res.forEach(item => {
            this.pathologyType.push({ text: item.Name, value: item.Content })
          })
        }
      })
    },
    search () {
      this.load()
    },
    load () {
      getAppointmentOrderData(this.pagination, this.filters)
      .then((res) => {
        const _mainData = []
        res.data.forEach((item, index) => {
          item.key = index + 1
          item.SpecimenTotal = item.Specimens.length
          _mainData.push(item)
        })
        // 如果是扫码查询不存在申请单信息则是新增操作
        if (CheckField(this.code) && res && res.data.length === 0) {
          PromptBox('不存在该住院号/门诊号信息', 'warning')
          this.code = ''
          this.reLoad()
          // this.apply({ 'Code': this.code, 'IsAppendApply': false })
        }
        this.data = _mainData
        this.pagination.total = res.count
      })
    },
    handleTableChange (pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.load()
    },
    edit (record) {
      record.strategys = this.strategys
      const $this = this
      this.$dialog(Edit,
        // component props
        {
          record,
          editMark: 'yes',
          on: {
            ok () {
              // Mark：定时提交成功一秒钟后刷新列表，防止数据未刷新
              setTimeout(() => {
                $this.load()
              }, 1000)
            },
            cancel () {
            },
            close () {
              // Mark：定时提交成功一秒钟后刷新列表，防止数据未刷新
              setTimeout(() => {
                $this.load()
              }, 1000)
            }
          }
        },
        // modal props
        {
          title: '预约申请单',
          width: 1000,
          centered: true,
          maskClosable: false,
          destroyOnClose: true,
          footer: false
        })
    }
  }
}
</script>
