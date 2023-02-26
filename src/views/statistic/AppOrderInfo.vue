<template>
  <div>
    <a-card :bordered="false">
      <a-row>
        <a-col span="24">
          <a-space>
            <a-date-picker v-model="filters.startDate" placeholder="开始时间"/>
            <a-date-picker v-model="filters.endDate" placeholder="结束时间"/>
            <a-select
              show-search
              optionFilterProp="children"
              v-model="filters.department"
              style="width: 150px"
            >
              <a-select-option v-for="d in departmentData" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
            </a-select>
            <a-button type="primary" icon="search" @click="search()">查询</a-button>
            <a-divider type="vertical" />
            <a-button type="primary" icon="export" @click="exportFile()">导出</a-button>
            <a-button type="primary" icon="printer" @click="printJson()">打印</a-button>
            申请单总数：<a-tag color="cyan">{{ AppOrderTotal }}</a-tag>
            标本总数：<a-tag color="green">{{ SpecimenTotal }}</a-tag>
            <span></span>
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
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
        class="components-table-demo-nested">
        <template slot="Status" slot-scope="text">
          <span v-if="text==0"><span class="ant-badge-status-dot ant-badge-status-default"></span><span class="ant-badge-status-text">未提交</span></span>
          <span v-if="text==1"><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">已提交</span></span>
          <span v-if="text==2"><span class="ant-badge-status-dot ant-badge-status-waring"></span><span class="ant-badge-status-text">退回</span></span>
        </template>
        <template slot="Sex" slot-scope="text">
          <span v-if="text==0"><span class="ant-badge-status-text" style="color:#096dd9;">男</span></span>
          <span v-if="text==1"><span class="ant-badge-status-text" style="color:#f198aa;">女</span></span>
        </template>
        <template slot="PathologyCode" slot-scope="text">
          <span v-if="text==d.value" v-for="d in pathologyType" :key="d.value" :value="d.value">{{ d.text }}</span>
        </template>
        <template slot="Department" slot-scope="text">
          <span v-if="text==d.value" v-for="d in departmentDatas":key="d.value" :value="d.value">{{ d.text }}</span>
        </template>
        <span slot="operation" slot-scope="text, record">
          <template>
            <a v-if="record.PathologyCode == 'Frozen' && record.ApplyAppendAppNo == null" @click="routineApply(record)">常规申请</a>
            <a-divider v-if="record.PathologyCode == 'Frozen' && record.ApplyAppendAppNo == null" type="vertical" />
            <a @click="print(record)">标本列表</a>
            <a-divider type="vertical" />
            <a @click="preview(record)">预览</a>
            <a-divider type="vertical" />
            <a @click="edit(record)">修改</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确定删除数据?"
              ok-text="是"
              cancel-text="否"
              @confirm="del(record)"
              style="color:#f50"
            >
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </span>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { getOrderData } from '@/api/statistic/statistic'
import { CheckField } from '@/utils/util'
import moment from 'moment'
import { getDepartmentData } from '@/api/basics/department'
import { exportJsonToExcel } from '@/utils/xlsx/Export2Excel'
import printJS from 'print-js'

const data = []// 一级列表数据
const columns = [
  { title: '科室', dataIndex: 'Department' },
  { title: '门诊号', dataIndex: 'OutpatientNum' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '申请编号', dataIndex: 'Id' },
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '患者姓名', dataIndex: 'PatientName' },
  { title: '年龄', dataIndex: 'Age' },
  { title: '录入时间', dataIndex: 'ReqDateTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '标本名', dataIndex: 'SpecimenNames' },
  { title: '标本总数', dataIndex: 'SpecimenTotal' }
]
export default {
  data () {
    return {
      data,
      columns,
      departmentData: [{ 'value': '', 'text': '全部科室' }],
      filters: {
        department: '',
        startDate: '',
        endDate: ''
      },
      pagination: {
        // pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        current: 1,
        total: 0,
        showSizeChanger: true,
        showTotal: (total, range) => ` 共 ${total} 条`,
        onShowSizeChange: (current, pageSize) => {
          this.pagination.pageSize = pageSize
          this.load()
        }
      },
      selectedRowKeys: [],
      code: '',
      loading: false,
      AppOrderTotal: 0,
      SpecimenTotal: 0
    }
  },
  mounted () {
    this.load()
  },
  computed: {
  },
  created: function () {
    this.getDepartmentData()
  },
  methods: {
    async printJson () {
      this.pagination.pageSize = 99999
      getOrderData(this.pagination, this.filters).then((res) => {
        res.data.AppData.forEach(f => {
          if (CheckField(f.OutpatientNum) === false) {
            f.OutpatientNum = ''
          }
          if (CheckField(f.AdmissionNum) === false) {
            f.AdmissionNum = ''
          }
          f.ReqDateTime = moment(f.ReqDateTime).format('YYYY-MM-DD HH:mm:ss')
        })
        const list = res.data.AppData
        print(list)
      })
      function print (datas) {
        printJS({
          printable: datas,
          properties: [
            {
              field: 'Id',
              displayName: '申请编号',
              columnSize: 1
            },
            {
              field: 'Department',
              displayName: '科室',
              columnSize: 1
            },
            {
              field: 'OutpatientNum',
              displayName: '门诊号',
              columnSize: 1
            },
            {
              field: 'AdmissionNum',
              displayName: '住院号',
              columnSize: 1
            },
            {
              field: 'AppNo',
              displayName: '申请单号',
              columnSize: 1
            },
            {
              field: 'PatientName',
              displayName: '患者姓名',
              columnSize: 1
            },
            {
              field: 'Age',
              displayName: '年龄',
              columnSize: 1
            },
            {
              field: 'ReqDateTime',
              displayName: '录入时间',
              columnSize: 1
            },
            {
              field: 'SpecimenNames',
              displayName: '标本名',
              columnSize: 1
            },
            {
              field: 'SpecimenTotal',
              displayName: '标本总数',
              columnSize: 1
            }
          ],
          type: 'json',
          header: '',
          gridStyle: 'border: 2px solid #000000;',
          gridHeaderStyle: 'color: #000000; border: 2px solid #000000;'
        })
      }
    },
    sizeChange () {
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
    search () {
      if (this.startDate > this.endDate) {
          this.$message.warning('结束时间不能小于开始时间', 2)
          return
      }
      this.filters.startDate = CheckField(this.filters.startDate) ? moment(this.filters.startDate).format('YYYY-MM-DD 00:00:00') : null
      this.filters.endDate = CheckField(this.filters.endDate) ? moment(this.filters.endDate).format('YYYY-MM-DD 23:59:59') : null
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.load()
    },
    load () {
      getOrderData(this.pagination, this.filters)
      .then((res) => {
        const _mainData = []
        res.data.AppData.forEach((item, index) => {
          item.key = index + 1
          _mainData.push(item)
        })
        this.AppOrderTotal = res.data.AppOrderTotal
        this.SpecimenTotal = res.data.SpecimenTotal
        this.data = _mainData
        this.pagination.total = res.data.AppOrderTotal
        // LoadTableCss()
      })
    },
    exportFile () {
      this.pagination.pageSize = 99999
      getOrderData(this.pagination, this.filters).then((res) => {
        const excelHeader = ['科室', '门诊号', '住院号', '申请单号', '患者姓名', '年龄', '录入时间', '标本名', '标本总数']
        const filterVal = ['Department', 'OutpatientNum', 'AdmissionNum', 'AppNo', 'PatientName', 'Age', 'ReqDateTime', 'SpecimenNames', 'SpecimenTotal']
        res.data.AppData.forEach(f => {
          if (CheckField(f.OutpatientNum) === false) {
            f.OutpatientNum = ''
            f.ReqDateTime = moment(f.ReqDateTime).format('YYYY-MM-DD HH:mm:ss')
          }
        })
        const list = res.data.AppData
        const data = formatJson(filterVal, list)
        exportJsonToExcel(excelHeader, data, '科室送检信息')
        function formatJson (filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => v[j]))
        }
      })
    },
    onSelectChange (selectedRowKeys, obj) {
      this.packagingData = []
      this.selectedRowKeys = selectedRowKeys
      selectedRowKeys.forEach(item => {
        this.data.forEach(obj => {
          if (item === obj.Id) {
            this.packagingData.push(obj)
          }
        })
      })
    },
    handleTableChange (pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.load()
    }
  }
}
</script>
