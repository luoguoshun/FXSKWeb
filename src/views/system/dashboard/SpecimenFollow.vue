<template>
  <a-card title="进行中的任务" id="datawarning">
    <a-table
      rowKey="Id"
      :columns="columns"
      :pagination="pagination"
      :data-source="followWorkData"
      size="small"
      @change="handleTableChange">
      <template slot="PathologyCode" slot-scope="text">
        <span v-if="text==d.value" v-for="d in pathologyType" :key="d.value" :value="d.value">{{ d.text }}</span>
      </template>
      <template slot="RelativeTime" slot-scope="text">
        <span style="font-weight: bold; color:red;">{{ text }}</span>
      </template>
      <template slot="NodeType" slot-scope="text">
        <span v-if="text==d.value" v-for="d in nodeTypeDatas" :key="d.value" :value="d.value">{{ d.text }}</span>
      </template>
      <span slot="operation" slot-scope="text, record">
        <template>
          <a @click="trace(record)">追踪</a>
          </a-popconfirm>
        </template>
      </span>
    </a-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { getSpecimenFollowData } from '@/api/system/workplace'
import enums from '@/store/enum/enum'
import Trace from '@/views/submission/speciment/Trace'
import { getSpecimenStatus } from '@/api/submission/app'
import { getSubmissionTypes } from '@/api/system/workflow'
const columns = [
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '患者姓名', dataIndex: 'PatientName' },
  { title: '送检类型', dataIndex: 'PathologyCode', scopedSlots: { customRender: 'PathologyCode' } },
  { title: '标本名称', dataIndex: 'SpecimenName' },
  { title: '停留环节', dataIndex: 'NodeType', scopedSlots: { customRender: 'NodeType' } },
  { title: '时间差', dataIndex: 'RelativeTime', scopedSlots: { customRender: 'RelativeTime' } },
  { title: '操作时间', dataIndex: 'OperatingTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '操作', dataIndex: 'operation', scopedSlots: { customRender: 'operation' } }]
export default {
  components: {
    Trace
  },
  data () {
    return {
      columns,
      followWorkData: [],
      nodeTypeDatas: [],
      pathologyType: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      }
    }
  },
  computed: {
  },
  beforeCreate () {
  },
  created () {
    getSubmissionTypes().then(res => {
      res.forEach(element => {
        this.pathologyType.push({
          value: element.Content,
          text: element.Name
        })
      })
    })
    this.loadData()
    this.getSpecimenStatus()
  },
  mounted () {
  },
  methods: {
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
          maskClosable: true
        })
    },
    loadData () {
      this.followWorkData = []
      getSpecimenFollowData(this.pagination).then(res => {
        if (res && res.PagerData) {
          res.PagerData.forEach((element, index) => {
            element.RelativeTime = moment(element.OperatingTime).startOf('minute').fromNow()
            this.followWorkData.push(element)
          })
          this.pagination.total = res.TotalCount
        }
      })
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.loadData()
    }
  }
}
</script>
