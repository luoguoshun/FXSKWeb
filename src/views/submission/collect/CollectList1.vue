<template>
  <div>
    <a-card :bordered="false">
      <a-row>
        <a-col span="24">
          <a-space>
            <a-radio-group v-model="Status" @change="statusChange">
              <a-radio-button value="all">
                全部
              </a-radio-button>
              <a-radio-button value="y">
                已采集
              </a-radio-button>
              <a-radio-button value="n">
                未采集
              </a-radio-button>
            </a-radio-group>
            <a-divider type="vertical" />
            <a-button type="default" icon="reload" @click="reLoad()">刷新</a-button>
            <a-button type="primary" icon="scan" @click="scan()">扫码采集</a-button>
          </a-space>
        </a-col>
      </a-row>
      <div style="margin: 10px 0"></div>
      <a-table
        :columns="columns"
        rowKey="Id"
        :data-source="data"
        :pagination="pagination"
        @change="handleTableChange"
        class="components-table-demo-nested">
        <template slot="AppStatus" slot-scope="text">
          <span v-if="text==='0'"><span class="ant-badge-status-dot ant-badge-status-default"></span><span class="ant-badge-status-text">未提交</span></span>
          <span v-if="text==='1'"><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">已提交</span></span>
          <span v-if="text==='2'"><span class="ant-badge-status-dot ant-badge-status-waring"></span><span class="ant-badge-status-text">退回</span></span>
        </template>
        <template slot="Sex" slot-scope="text">
          <span v-if="text==0"><span class="ant-badge-status-text" style="color:#096dd9;">男</span></span>
          <span v-if="text==1"><span class="ant-badge-status-text" style="color:#f198aa;">女</span></span>
        </template>
        <template slot="IsConfirm" slot-scope="text">
          <span v-if="text===true"><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">是</span></span>
          <span v-if="text===false"><span class="ant-badge-status-text" style="color:red;">否</span></span>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { getSpecimenCollectData } from '@/api/submission/collect'
import moment from 'moment'
import Edit from './Edit'
const data = []// 一级列表数据
const columns = [
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '是否已采集', dataIndex: 'IsConfirm', scopedSlots: { customRender: 'IsConfirm' } },
  { title: '患者姓名', dataIndex: 'PatientName' },
  { title: '状态', dataIndex: 'AppStatus', scopedSlots: { customRender: 'AppStatus' } },
  { title: '年龄', dataIndex: 'Age' },
  { title: '性别', dataIndex: 'Sex', scopedSlots: { customRender: 'Sex' } },
  { title: '病人ID', dataIndex: 'HisNo', key: 'HisNo' },
  { title: '门诊号', dataIndex: 'OutpatientNum' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '标本名称', dataIndex: 'SpecimenName' },
  { title: '离体时间', dataIndex: 'LeaveTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '固定时间', dataIndex: 'FixedTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '固定液', dataIndex: 'FixLiquid' },
  { title: '所属部位', dataIndex: 'PartName' }
]
export default {
  components: {
    Edit
  },
  data () {
    return {
      data,
      columns,
      Status: 'n',
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      }
    }
  },
  created: function () {
    this.load(1, 10, 'n')
  },
  computed: {
  },
  methods: {
    statusChange (obj) {
      this.load(1, 10, obj.target.value)
    },
    scan () {
      const $this = this
      this.$dialog(Edit,
        // component props
        {
          record: {},
          on: {
            ok () {
            },
            cancel () {
            },
            close () {
              // Mark：定时提交成功一秒钟后刷新列表，防止数据未刷新
              setTimeout(() => {
                $this.load(1, 10, 'n')
              }, 500)
            }
          }
        },
        // modal props
        {
          title: '扫描采集',
          width: 1500,
          centered: true,
          maskClosable: false,
          dialogClass: 'collectDialog',
          footer: ''
        })
    },
    reLoad () {
      this.Status = 'n'
      this.load(1, 10, 'n')
    },
    load (pageIndex, pageSize, status) {
      getSpecimenCollectData(pageIndex, pageSize, status)
      .then((res) => {
        const _mainData = []
        res.data.forEach((item, index) => {
          item.key = index + 1
          _mainData.push(item)
        })
        this.data = _mainData
        this.pagination.total = res.count
        this.pagination.current = pageIndex
      })
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.load(pager.current, pager.pageSize, this.Status)
    },
    onChangeBegin () {
    },
    onChangeEnd () {
    }
  }
}
</script>
<style>
  .collectDialog .ant-modal-body{
    padding: 0;
  }
</style>
