<template>
  <div>
    <a-card :bordered="false">
      <a-row>
        <a-col span="24">
          <a-space>
            <a-date-picker @change="onChangeBegin" v-model="filter.startDate" placeholder="开始运送时间" :format="'YYYY-MM-DD 00:00:01'"/>
            <a-date-picker @change="onChangeEnd" v-model="filter.endDate" placeholder="结束运送时间" :format="'YYYY-MM-DD 23:59:59'"/>
            <a-input class="ant-input" v-model="filter.sendNo" placeholder="输入送检号"/>
            <a-select placeholder="选择类型" v-model="filter.sendStatus" style="width:100px">
              <a-select-option v-for="d in keyTypeDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
            </a-select>
            <a-button type="primary" icon="search" @click="load()">查询</a-button>
            <a-divider type="vertical" />
            <a-input v-model="VerifySendNo" v-if="VerifySenderVisible" style="width:150px" placeholder="打包号" />
            <a-input v-model="VerifySender" v-if="VerifySenderVisible" style="width:110px" placeholder="运送人员工号" />
            <a-button type="primary" icon="check" v-if="VerifySenderVisible" @click="verify()">核实</a-button>
            <a-divider type="vertical" />
            <a-button type="primary" icon="check" @click="receive()">扫码接收</a-button>
            <a-button type="default" icon="reload" @click="load(1, 10)">刷新</a-button>
            <Help :helpTitle="'接收操作说明'" :helpCode="'ReceiveOperationHelp'" :content="''"/>
          </a-space>
        </a-col>
      </a-row>
      <div style="margin: 10px 0"></div>
      <a-table
        :columns="columns"
        rowKey="Id"
        :data-source="data"
        :pagination="pagination"
        :expandedRowKeys="curExpandedRowKeys"
        @expand="expand"
        @change="handleTableChange"
        class="components-table-demo-nested">
        <template slot="ShippingStatus" slot-scope="text">
          <span v-if="text==0"><span class="ant-badge-status-dot ant-badge-status-default"></span><span class="ant-badge-status-text">未运送</span></span>
          <span v-if="text==1"><span class="ant-badge-status-dot ant-badge-status-success"></span><span class="ant-badge-status-text">运送中</span></span>
          <span v-if="text==2"><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">已送达</span></span>
          <span v-if="text==3"><span class="ant-badge-status-dot ant-badge-status-error"></span><span class="ant-badge-status-text">退回</span></span>
        </template>
        <template slot="SendNo" slot-scope="text">
          <a style="font-weight: bold; color:#1890ff;">{{ text }}</a>
        </template>
        <a-table
          slot="expandedRowRender"
          :columns="innerColumns"
          :data-source="innerData"
          :pagination="false"
        >
          <template slot="OperatingTime" slot-scope="text">
            <span v-if="text==null"><span class="ant-badge-status-dot ant-badge-status-default"></span><span class="ant-badge-status-text">未接收</span></span>
            <span v-else><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">已接收</span></span>
          </template>
          <span slot="operation" slot-scope="text, record">
            <template>
              <a @click="trace(record)">轨迹</a>
              </a-popconfirm>
            </template>
          </span>
        </a-table>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { getyReceiveSendPackages, verifySender } from '@/api/submission/receive'
import { getPackageSpecimens } from '@/api/submission/packaging'
import Trace from '@/views/submission/speciment/Trace'
import Edit from './EditNew'
import Help from '@/components/Help/HelpShowInfo'
import moment from 'moment'
import { getStrategyTemplate } from '@/api/system/strategy'
import { CheckField, JSONStringToObject, PromptBox } from '@/utils/util'
const data = []// 一级列表数据
const innerData = []
const columns = [
  { title: '送检号', dataIndex: 'SendNo', scopedSlots: { customRender: 'SendNo' } },
  { title: '状态', dataIndex: 'ShippingStatus', scopedSlots: { customRender: 'ShippingStatus' } },
  { title: '申请单数量', dataIndex: 'AppOrderTotal' },
  { title: '标本数量', dataIndex: 'SpecimenCount' },
  { title: '开始时间', dataIndex: 'ShippingStartTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '结束时间', dataIndex: 'ShippingEndTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '运送人', dataIndex: 'Shipper' },
  { title: '备注', dataIndex: 'Remark' }
]
const innerColumns = [
  { title: '标本名称', dataIndex: 'SpecimenName' },
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '是否接收', dataIndex: 'ReceiveOperatingTime', scopedSlots: { customRender: 'OperatingTime' } },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '离体时间', dataIndex: 'LeaveTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '固定时间', dataIndex: 'FixedTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '固定液', dataIndex: 'FixLiquid' },
  { title: '所属部位', dataIndex: 'PartName' },
  { title: '接收时间', dataIndex: 'OperatingTime' },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
]
export default {
  components: {
    Edit,
    Trace,
    Help
  },
  data () {
    return {
      data,
      columns,
      innerData,
      innerColumns,
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      selectedRowKeys: [],
      filter: {
        sendNo: '',
        sendStatus: '',
        startDate: '',
        isSend: true,
        endDate: ''
      },
      keyTypeDatas: [
        { value: '', text: '请选择' },
        { value: '0', text: '未运送' },
        { value: '1', text: '运送中' },
        { value: '2', text: '已完成' },
        { value: '3', text: '退回' }
      ],
      VerifySendNo: '',
      VerifySender: '',
      VerifySenderVisible: '',
      VerifySenderVisibleVisible: false,
      curExpandedRowKeys: []
    }
  },
  created: function () {
    this.load()
    this.localConfig()
  },
  mounted () {
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    verify () {
      if (CheckField(this.VerifySender) === false) {
        PromptBox('运送人员工号不能为空', 'warning')
        return
      }
      if (CheckField(this.VerifySendNo) === false) {
        PromptBox('打包号不能为空', 'warning')
        return
      }
      verifySender(this.VerifySender, this.VerifySendNo).then(res => {
        if (res.HttpStatusCode === 200 && res.ResultType === 1) {
          PromptBox(res.Message, 'success')
        } else {
          PromptBox(res.Message, 'warning')
        }
      })
    },
    localConfig () {
      getStrategyTemplate('Receive').then(res => {
        this.strategys = JSONStringToObject(res.Content).property
        if (CheckField(this.strategys) && CheckField(this.strategys.VerifySender.visible)) {
          this.VerifySenderVisible = this.strategys.VerifySender.visible
        }
      })
    },
    expand (expanded, record) {
      if (this.curExpandedRowKeys.length > 0 && this.curExpandedRowKeys[0] === record.Id) {
        this.curExpandedRowKeys = []
      } else {
        this.curExpandedRowKeys = [record.Id]
        getPackageSpecimens(record.Id).then((res) => {
          res.data.forEach((item, index) => {
            item.key = index + 1
          })
          this.innerData = res.data
        })
      }
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
    },
    receive () {
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
              setTimeout(() => {
                $this.load(1, 10)
              }, 500)
            }
          }
        },
        // modal props
        {
          title: '扫码接收',
          width: 1600,
          centered: true,
          dialogClass: 'receiveDialog',
          maskClosable: false,
          footer: ''
        })
    },
    load () {
      const $this = this
      if (this.filter.endDate && this.filter.startDate && this.filter.endDate < this.filter.startDate) {
        PromptBox('结束时间不能小于开始时间', 'warning')
        return
      }
      getyReceiveSendPackages(this.filter, this.pagination.current, this.pagination.pageSize)
      .then((res) => {
        const _mainData = []
        res.data.forEach((item, index) => {
          item.key = index + 1
          _mainData.push(item)
        })
        $this.data = _mainData
        $this.pagination.total = res.count
      })
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.load()
    },
    onChangeBegin (date) {
      this.filter.startDate = date
    },
    onChangeEnd (date) {
      this.filter.endDate = date
    },
    reLoad () {
      this.load()
    }
  }
}
</script>
<style>
  .receiveDialog .ant-modal-body{
    padding: 0;
  }
</style>
