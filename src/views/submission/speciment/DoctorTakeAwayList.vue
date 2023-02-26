<template>
  <div>
    <a-card :bordered="false">
      <a-row>
        <a-col span="24">
          <a-space>
            <a-date-picker v-model="filters.startDate" placeholder="开始时间"/>
            <a-date-picker v-model="filters.endDate" placeholder="结束时间"/>
            
            <a-input-group compact style="width:300px;">
              <a-input
                style="width: 65%"
                class="ant-input"
                v-model="filters.code"
                placeholder="输入住院号"
                @keypress.13.native="search"
              />
            </a-input-group>
            <a-button type="primary" icon="search" @click="search()">查询</a-button>
            <a-divider type="vertical" />
            <a-button type="default" icon="reload" @click="load()">刷新</a-button>
            <a-divider type="vertical" />
            <Help :helpTitle="'预检打印操作说明'" :helpCode="'PrintOperationHelp'" :content="''"/>
          </a-space>
        </a-col>
      </a-row>
      <div style="margin: 10px 0"></div>
      <a-table
        :columns="columns"
        rowKey="key"
        ref="tableref"
        :data-source="data"
        :pagination="pagination"
        @change="handleTableChange"
        class="components-table-demo-nested">
        <!-- <a-table
          slot="expandedRowRender"
          :columns="innerColumns"
          :data-source="innerData"
          :pagination="false"
        >
          <span slot="operation" slot-scope="text, record">
            <template>
              <a @click="trace(record)">轨迹</a>
              </a-popconfirm>
            </template>
          </span>
        </a-table> -->
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { getDoctorTakeAway, getDoctorTakeAwayItem } from '@/api/submission/app'
import moment from 'moment'
import Progress from '@/views/submission/app/Progress'
import Trace from '@/views/submission/speciment/Trace'
import { CheckField } from '@/utils/util'
import Help from '@/components/Help/HelpShowInfo'
import { getSubmissionTypes } from '@/api/system/workflow'
import { getHisReqTypeByIp } from '@/api/system/hisReqConfig'
const data = []// 一级列表数据
const innerData = []
const columns = [
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '医生姓名', dataIndex: 'DoctorCode' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '患者姓名', dataIndex: 'PatientName' },
  { title: '标本名称', dataIndex: 'SpecimenName' },
  { title: '操作时间', dataIndex: 'CreatedTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } }
]
const innerColumns = [
  { title: '标本名称', dataIndex: 'SpecimenName' }
]
export default {
  components: {
    Progress,
    Trace,
    Help
  },
  data () {
    return {
      data,
      innerData,
      columns,
      innerColumns,
      filters: {
        code: '',
        startDate: '',
        endDate: ''
      },
      departmentData: [{ 'value': '', 'text': '操作科室' }],
      sendDepartmentData: [{ 'value': '', 'text': '送检科室' }],
      pathologyType: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      keyTypeDatas: [
        { value: '1', text: '病人ID' },
        { value: '2', text: '住院号' },
        { value: '3', text: '门诊号' },
        { value: '4', text: '患者姓名' },
        { value: '5', text: '扫码' },
        { value: '6', text: '申请单号' },
        { value: '7', text: '手腕码' }
      ],
      curExpandedRowKeys: []
    }
  },
  created: function () {
    this.load()
    getSubmissionTypes().then(res => {
      res.forEach(element => {
        this.pathologyType.push({
          value: element.Content,
          text: element.Name
        })
      })
    })
    getHisReqTypeByIp().then(res => {
      if (CheckField(res.Data)) {
        this.filters.type = res.Data.ReqType
      }
    })
  },
  computed: {
  },
  methods: {
    expand (expanded, record) {
      if (this.curExpandedRowKeys.length > 0 && this.curExpandedRowKeys[0] === record.key) {
        this.curExpandedRowKeys = []
      } else {
        this.curExpandedRowKeys = [record.key]
        getDoctorTakeAwayItem(record.Id).then((res) => {
          res.Data.forEach((item, index) => {
            item.key = index + 1
          })
          this.innerData = res.Data
        })
      }
    },
    search () {
      if (this.startDate && this.endDate && (this.startDate > this.endDate)) {
          this.$message.warning('结束时间不能小于开始时间', 2)
          return
      }
      this.filters.startDate = CheckField(this.filters.startDate) ? moment(this.filters.startDate).format('YYYY-MM-DD 00:00:01') : null
      this.filters.endDate = CheckField(this.filters.endDate) ? moment(this.filters.endDate).format('YYYY-MM-DD 23:59:59') : null
      this.load()
    },
    load () {
      getDoctorTakeAway(this.pagination, this.filters)
      .then((res) => {
        const _mainData = []
        res.PagerData.forEach((item, index) => {
          item.key = index + 1
          _mainData.push(item)
        })
        this.data = _mainData
        this.pagination.total = res.TotalCount
      })
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.load()
    }
  }
}
</script>
<style>
.printModel .ant-table-content{
  min-height: 450px;
}
</style>
