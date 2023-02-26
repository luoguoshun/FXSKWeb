<template>
  <div>
    <a-card :bordered="false">
      <a-row>
        <a-col span="24">
          <a-space>
            <a-date-picker @change="onChangeBegin" v-model="filter.startDate" placeholder="开始运送时间"/>
            <a-date-picker @change="onChangeEnd" v-model="filter.endDate" placeholder="结束运送时间"/>
            <a-input class="ant-input" v-model="filter.sendNo" placeholder="输入送检号"/>
            <a-select placeholder="选择类型" v-model="filter.sendStatus" style="width:100px">
              <a-select-option v-for="d in keyTypeDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
            </a-select>
            <a-button type="primary" icon="search" @click=" load()">查询</a-button>
            <a-divider type="vertical" />
            <a-button type="primary" icon="safety" @click="send()">一键运送</a-button>
            <a-button type="primary" icon="scan" :style="{ display: IsExpedientlyScan }" @click="scanSend()">扫码运送</a-button>
            <a-button type="default" icon="reload" @click="load(1, 10)">刷新</a-button>
            <Help :helpTitle="'运送操作说明'" :helpCode="'SendOperationHelp'" :content="''"/>
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
        @change="handleTableChange"
        @expand="expand"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
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
          <span slot="operation" slot-scope="text, record">
            <template>
              <a @click="trace(record)">轨迹</a>
              </a-popconfirm>
            </template>
          </span>
        </a-table>
      </a-table>
    </a-card>
    <a-modal
      v-model="scanVisible"
      :width="1300"
      dialogClass="sendscan"
      :centered="true"
      :destroyOnClose="true"
      :maskClosable="false"
      title="运送扫码确认"
      @ok="sendHandleOk">
      <ScanSendList :dataSource="scanData" :packageCount="packageCount" @changeData="changeData"/>
    </a-modal>
    <a-modal
      v-model="scanVisible2"
      :width="1300"
      dialogClass="sendscan"
      :centered="true"
      :destroyOnClose="true"
      :maskClosable="false"
      title="运送扫码确认"
      @ok="sendHandleOk">
      <ScanSend @childFn="parentFn"/>
    </a-modal>
    <a-modal
      v-model="visible"
      :destroyOnClose="true"
      :zIndex="99999"
      :centered="true"
      title="输入运送人的工号"
      @ok="handleOk">
      <a-input v-model="senderCode" ref="JobNo" @pressEnter="pressEnter"/>
    </a-modal>
  </div>
</template>

<script>
import { getSendPackages, getPackageSpecimens } from '@/api/submission/packaging'
import { sendPackages, getSendPackagesSpecimens } from '@/api/submission/send'
import { getUserByCode } from '@/api/other/other'
import Trace from '@/views/submission/speciment/Trace'
import ScanSendList from './ScanSendList'
import ScanSend from './ScanSend'
import moment from 'moment'
import { CheckField, JSONStringToObject, PromptBox } from '@/utils/util'
import { getDictByName } from '@/api/system/dictionary'
import storage from 'store'
import Help from '@/components/Help/HelpShowInfo'
import { getStrategyTemplate } from '@/api/system/strategy'
const data = []// 一级列表数据
const innerData = []
const columns = [
  { title: '送检号', dataIndex: 'SendNo', scopedSlots: { customRender: 'SendNo' } },
  { title: '打包编号', dataIndex: 'Id' },
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
  { title: '患者姓名', dataIndex: 'PatientName' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '离体时间', dataIndex: 'LeaveTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '固定时间', dataIndex: 'FixedTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '固定液', dataIndex: 'FixLiquid' },
  { title: '所属部位', dataIndex: 'PartName' },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
]
export default {
  components: {
    Trace,
    ScanSendList,
    ScanSend,
    Help
  },
  data () {
    return {
      data,
      scanData: [],
      packageCount: [],
      columns,
      innerData,
      innerColumns,
      selectedRowKeys: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      },
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
      devices: [],
      senderCode: '',
      visible: false,
      scanVisible: false,
      scanVisible2: false,
      IsExpedientlyScan: 'none',
      modalFlag: 'modal1',
      sendInfo: {},
      curExpandedRowKeys: []
    }
  },
  created: function () {
    // 当是外部链接访问，则默认打开新增窗口
    if (CheckField(storage.get('sendFlag')) === true) {
      this.scanSend()
    }
    this.load()
    this.loadConfig()
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    pressEnter (val) {
      this.handleOk()
    },
    // 标本扫码子组件回传函数
    changeData (data) {
      this.scanData = data
    },
    loadConfig () {
      getStrategyTemplate('Send').then(res => {
        this.strategys = JSONStringToObject(res.Content).property
        if (CheckField(this.strategys) && CheckField(this.strategys.ScanSend.visible)) {
          this.ScanSendVisible = this.strategys.ScanSend.visible
          this.IsExpedientlyScan = this.strategys.ScanSend.visible === true ? 'block' : 'none'
        }
      })
    },
    parentFn (payload) {
      this.scanData = payload
    },
    //展开时加载数据
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
    send () {
      const $this = this
      const data = this.data.filter(w => this.selectedRowKeys.includes(w.Id))
      if (!data || data.length === 0) {
        PromptBox('请先勾选要运送的记录', 'warning')
        return
      }
      const hasSendedData = data.some(function (item, index, array) {
          return item.ShippingStatus === '1' || item.ShippingStatus === '2'
      })
      if (hasSendedData) {
        PromptBox('当前勾选项中存在运送中或运送完成的记录，请检查', 'warning')
        return
      }
      this.$confirm({
        title: '信息',
        centered: true,
        content: `您确定要送出当前勾选的${data.length}个送检包吗？`,
        onOk () {
          return new Promise(resolve => {
            $this.loadSendSpeciments()
            resolve(true)
          })
        }
      })
    },
    scanSend () {
      this.scanVisible2 = true
      this.modalFlag = 'modal2'
    },
    sendHandleOk (e) {
      if (this.scanData.length === 0) {
        PromptBox('当前不存在运送标本', 'warning')
        return
      }
      const result = this.scanData.filter(f => f.IsConfirm === false)
      if (result.length > 0) {
        PromptBox('当前存在未确认标本', 'warning')
        return
      }
      const $this = this
      this.$confirm({
        title: '信息',
        centered: true,
        content: `您确定要送出吗？`,
        onOk () {
          return new Promise(resolve => {
            if ($this.userInfo.UserType === '运送人员') {
              $this.sendPush()
            } else {
              $this.visible = true
              $this.senderCode = ''
              setTimeout(() => {
                $this.$refs.JobNo.focus()
              }, 500)
            }
            resolve(true)
          })
        }
      })
    },
    handleOk (e) {
      if (this.senderCode === '') {
        PromptBox('请输入运送人员工号', 'warning')
        return
      }
      getUserByCode(this.senderCode, '运送人员').then(res => {
        if (res.ResultType === 1) {
          this.sendInfo = res.Data
          this.sendPush()
          this.visible = false
        } else {
          PromptBox(res.Message, 'warning')
        }
      })
    },
    sendPush () {
      const temp = []
      if (this.modalFlag === 'modal1') {
        const tempData = this.data.filter(w => this.selectedRowKeys.includes(w.Id))
        tempData.forEach(item => {
          temp.push({ 'Id': item.Id, 'SendNo': item.SendNo, 'ShipperId': this.sendInfo.Id, 'Shipper': this.sendInfo.UserName })
        })
      } else {
        this.scanVisible2 = false
        this.scanData.forEach(item => {
          let exist = false
          temp.forEach(item2 => {
            if (item.Id === item2.Id) {
              exist = true
            }
          })
          if (exist === false) {
            temp.push({ 'Id': item.Id, 'SendNo': item.SendNo, 'ShipperId': this.sendInfo.Id, 'Shipper': this.sendInfo.UserName })
          }
        })
      }
      this.sends(temp)
    },
    //发送送检包
    sends (temp) {
      sendPackages({ 'ObjectDTO': temp }).then(res => {
        if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
          PromptBox('发送成功！', 'success')
          this.scanVisible = false
          setTimeout(this.load(), 500)
        } else {
          PromptBox(res.Message, 'error')
        }
      })
    },
    //加载数据
    load() {
      this.selectedRowKeys = []
      const $this = this
      if (this.filter.endDate && this.filter.startDate && this.filter.endDate < this.filter.startDate) {
        PromptBox('结束时间不能大于开始时间', 'warning')
        return
      }
      getSendPackages(this.filter, this.pagination.current, this.pagination.pageSize)
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
    loadSendSpeciments () {
      const $this = this
      getSendPackagesSpecimens(this.selectedRowKeys.join(',')).then(res => {
        if (res.data) {
          $this.scanData = res.data.PagerData
          $this.packageCount = $this.selectedRowKeys.length
          $this.scanVisible = true;//打开运送标本中心
          $this.modalFlag = 'modal1'
        }
      })
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.load()
    },
    onSelectChange (selectedRowKeys, obj) {
      this.selectedRowKeys = selectedRowKeys
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
.sendscan .ant-modal-content .ant-modal-body{
  padding: 0;
}
</style>
