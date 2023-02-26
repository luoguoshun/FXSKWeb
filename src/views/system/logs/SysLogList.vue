<template>
  <div>
    <a-card :bordered="false">
      <a-row>
        <a-col :span="24">
          <a-space>
            <a-input class="ant-input" v-model="keys" placeholder="关键字输入" @keypress.13.native="search"/>
            <a-button type="primary" icon="search" @click="search()">查询</a-button>
            <a-divider type="vertical" />
            <a-button type="default" icon="reload" @click="load()">刷新</a-button>
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
        <template slot="LogKeyType" slot-scope="text">
          <span v-if="text==d.value" v-for="d in nodeTypeDatas" :style="{ color: d.color }" :key="d.value" :value="d.value">{{ d.text }}</span>
        </template>
        <template slot="Sex" slot-scope="text">
          <span v-if="text==0"><span class="ant-badge-status-text" style="color:#096dd9;">男</span></span>
          <span v-if="text==1"><span class="ant-badge-status-text" style="color:#f198aa;">女</span></span>
        </template>
        <span slot="operation" slot-scope="text, record">
          <template>
            <a @click="read(record)">查看</a>
          </template>
        </span>
      </a-table>
    </a-card>
    <a-modal v-model="visible" title="日志详情">
      <json-viewer :value="logContent" :expand-depth="4" copyable sort></json-viewer>
    </a-modal>
  </div>
</template>

<script>
import { getSysLogData } from '@/api/system/log'
import { getSpecimenStatus } from '@/api/submission/app'
import { JSONStringToObject } from '@/utils/util'

const data = []// 一级列表数据
const columns = [
  // { title: '业务类型', dataIndex: 'LogType', key: 'LogType' },
  { title: '关键字', dataIndex: 'LogKey', key: 'LogKey' },
  { title: '关键字类型', dataIndex: 'LogKeyType', key: 'LogKeyType', scopedSlots: { customRender: 'LogKeyType' } },
  { title: '操作人Id', dataIndex: 'UserId', key: 'UserId' },
  { title: '操作人', dataIndex: 'UserName', key: 'UserName' },
  { title: '客户端', dataIndex: 'TerminalInfo', key: 'TerminalInfo' },
  { title: '操作时间', dataIndex: 'CreatedTime', key: 'CreatedTime' },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
]
export default {
  components: {
  },
  data () {
    return {
      data,
      columns,
      keys: '',
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      nodeTypeDatas: [],
      visible: false,
      logContent: ''
    }
  },
  created: function () {
    this.getSpecimenStatus()
    this.load()
  },
  computed: {
  },
  methods: {
    search () {
      this.pagination.current = 1
      this.load()
    },
    getSpecimenStatus () {
      this.nodeTypeDatas.push({ value: '申请单增加', text: '申请单增加' })
      this.nodeTypeDatas.push({ value: '申请单修改', text: '申请单修改' })
      this.nodeTypeDatas.push({ value: '申请单删除', text: '申请单删除' })
      this.nodeTypeDatas.push({ value: '删除标本', text: '删除标本' })
      getSpecimenStatus().then((res) => {
        Object.keys(res.data).forEach(element => {
          if (element === '退回') {
            this.nodeTypeDatas.push({ value: res.data[element], text: element, color: 'red' })
          } else {
            this.nodeTypeDatas.push({ value: res.data[element], text: element, color: '#000000a6' })
          }
        })
      })
    },
    read (r) {
      this.visible = true
      this.logContent = JSONStringToObject(r.LogContent)
    },
    load () {
      getSysLogData(this.keys, this.pagination).then((res) => {
        const _mainData = []
        res.data.forEach((item, index) => {
          item.key = index + 1
          _mainData.push(item)
        })
        this.data = _mainData
        this.pagination.total = res.count
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
