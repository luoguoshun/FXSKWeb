<template>
  <div>
    <a-card :bordered="false">
      <a-tabs default-active-key="2">
        <a-tab-pane key="1" tab="标本查询">
          <div id="components-form-demo-advanced-search">
            <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
              <a-form-item v-show="false" label="主键ID">
                <a-input v-decorator="['Id', { initialValue: 0 }]" disabled />
              </a-form-item>
              <a-row :gutter="24">
                <a-col
                  :key="1"
                  :span="4"
                  :style="{ display: 1 < count ? 'block' : 'none' }"
                >
                  <a-form-item label="住院号">
                    <a-input v-decorator="['AdmissionNum']" placeholder="输入值" />
                  </a-form-item>
                </a-col>
                <a-col
                  :key="3"
                  :span="4"
                  :style="{ display: 3 < count ? 'block' : 'none' }"
                >
                  <a-form-item label="登记科室">
                    <a-select
                      show-search
                      optionFilterProp="children"
                      v-decorator="['RegisterDeptName']"
                    >
                      <a-select-option v-for="d in departmentData" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col
                  :key="4"
                  :span="4"
                  :style="{ display: 4 < count ? 'block' : 'none' }"
                >
                  <a-form-item label="打包科室">
                    <a-select
                      show-search
                      optionFilterProp="children"
                      v-decorator="['PackageDeptName']"
                    >
                      <a-select-option v-for="d in departmentData" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col
                  :key="5"
                  :span="4"
                  :style="{ display: 5 < count ? 'block' : 'none'}"
                >
                  <a-form-item label="标本状态">
                    <a-select placeholder="选择类型" v-decorator="['NodeType']" >
                      <a-select-option v-for="d in nodeTypeDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col
                  :key="6"
                  :span="4"
                  :style="{ display: 6 < count ? 'block' : 'none' }"
                >
                  <a-form-item label="开始时间">
                    <a-date-picker placeholder="开始时间" v-decorator="['OperationStartTime']"/>
                  </a-form-item>
                </a-col>
                <a-col
                  :key="7"
                  :span="4"
                  :style="{ display: 7 < count ? 'block' : 'none' }"
                >
                  <a-form-item label="结束时间">
                    <a-date-picker placeholder="结束时间" v-decorator="['OperationEndTime']"/>
                  </a-form-item>
                </a-col>
                <a-col
                  :key="8"
                  :span="3"
                  :style="{ display: 8 < count ? 'block' : 'none'}"
                  style="padding-right:0px;"
                >
                  <a-form-item label="操作人员" span="2">
                    <a-select placeholder="选择类型" v-decorator="['OperatorType', { initialValue: '1' }]">
                      <a-select-option v-for="d in operatorTypeDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col
                  :key="9"
                  :span="4"
                  :style="{ display: 9 < count ? 'block' : 'none'}"
                  style="padding-left:0px;"
                >
                  <a-form-item span="4">
                    <a-input class="ant-input" placeholder="输入值" v-decorator="['OperatorValue']"/>
                  </a-form-item>
                </a-col>
                <a-col
                  :key="10"
                  :span="4"
                  :style="{ display: 10 < count ? 'block' : 'none' }"
                >
                  <a-form-item label="病人姓名">
                    <a-input v-decorator="['PatientName']" placeholder="输入值" />
                  </a-form-item>
                </a-col>
                <a-col
                  :key="11"
                  :span="4"
                  :style="{ display: 11 < count ? 'block' : 'none' }"
                >
                  <a-form-item label="病人ID">
                    <a-input v-decorator="['HisNo']" placeholder="输入值" />
                  </a-form-item>
                </a-col>
                <a-col
                  :key="12"
                  :span="7"
                  :style="{ display: 12 < count ? 'block' : 'none' }"
                >
                  <a-form-item label="诊疗卡号">
                    <a-input v-decorator="['MedicalCardNo']" placeholder="输入值" />
                  </a-form-item>
                </a-col>
                <a-col
                  :key="13"
                  :span="4"
                  :style="{ display: 13 < count ? 'block' : 'none' }"
                >
                  <a-form-item label="打包编号">
                    <a-input v-decorator="['SendNo']" placeholder="输入值" />
                  </a-form-item>
                </a-col>
                <a-col
                  :key="14"
                  :span="4"
                  :style="{ display: 14 < count ? 'block' : 'none' }"
                >
                  <a-form-item label="申请科室">
                    <a-select
                      show-search
                      optionFilterProp="children"
                      v-decorator="['DeptName']"
                    >
                      <a-select-option v-for="d in departmentData" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col
                  :key="15"
                  :span="4"
                  :style="{ display: 15 < count ? 'block' : 'none' }"
                >
                  <a-form-item label="门诊号">
                    <a-input v-decorator="['OutpatientNum']" placeholder="输入值" />
                  </a-form-item>
                </a-col>
                <a-col
                  :key="16"
                  :span="4"
                  :style="{ display: 16 < count ? 'block' : 'none' }"
                >
                  <a-form-item label="申请单号">
                    <a-input v-decorator="['AppNo']" placeholder="输入值" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24" :style="{ textAlign: 'right' }">
                  申请单数：<span style="font-weight:bold;color:red; margin-right:10px;">{{ AppOrderTotal }}</span>
                  标本数：<span style="font-weight:bold;color:red; margin-right:10px;">{{ SpecimenTotal }}</span>
                  <a-button type="primary" html-type="submit">
                    查询
                  </a-button>
                  <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
                    重置
                  </a-button>
                  <a-divider type="vertical" />
                  <a-button type="default" icon="reload" @click="load(1, 10)">刷新</a-button>
                  <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle">
                    折叠 <a-icon :type="expand ? 'up' : 'down'" />
                  </a>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <div style="margin: 10px 0"></div>
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
        </a-tab-pane>
        <a-tab-pane key="2" tab="快速查询">
          <a-row>
            <a-col :span="7">
            </a-col>
            <a-col :span="10">
              <div class="global-search-wrapper">
                <a-input-group>
                  <a-select size="large" style="width:130px;" v-model="keyType">
                    <a-select-option value="AdmissionNum">
                      住院号
                    </a-select-option>
                    <a-select-option value="OutpatientNum">
                      门诊号
                    </a-select-option>
                    <a-select-option value="PatientName">
                      患者姓名
                    </a-select-option>
                    <a-select-option value="AppNo">
                      申请单号
                    </a-select-option>
                    <a-select-option value="AppId">
                      申请单编号
                    </a-select-option>
                    <a-select-option value="SendNo">
                      打包号
                    </a-select-option>
                    <a-select-option value="SendId">
                      打包编号
                    </a-select-option>
                    <a-select-option value="SpecimenId">
                      标本编号
                    </a-select-option>
                  </a-select>
                  <a-input-search
                    v-model="key"
                    placeholder="请输入关键信息"
                    style="width:50%;"
                    size="large"
                    enter-button
                    @search="onSearch"
                  />
                </a-input-group>
              </div>
            </a-col>
            <a-col :span="7">
            </a-col>
          </a-row>
          <a-spin tip="加载数据中……" :spinning="loadIcon" style="margin-top:10px;">
            <div class="spin-content">
              <AppNoTemplate v-if="keyType === 'AppNo'" :record="sourceData"/>
              <AppNoTemplate v-if="keyType === 'AdmissionNum'" :record="sourceData"/>
              <AppNoTemplate v-if="keyType === 'OutpatientNum'" :record="sourceData"/>
              <AppNoTemplate v-if="keyType === 'PatientName'" :record="sourceData"/>
              <AppNoTemplate v-if="keyType === 'AppId'" :record="sourceData"/>
              <SpecimenIdTemplate v-if="keyType === 'SpecimenId'" :record="sourceData"/>
              <SendNoTemplate v-if="keyType === 'SendNo'" :record="sourceData"/>
              <SendNoTemplate v-if="keyType === 'SendId'" :record="sourceData"/>
            </div>
          </a-spin>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <a-modal
      title="查询结果"
      :visible="SDataVisible"
      :width="1000"
      @ok="SDataVisible = false"
      @cancel="SDataVisible = false"
    >
      <a-table :columns="sColumns" :pagination="false" :data-source="sData" style="max-height: 200px;overflow-y: scroll;">
        <template slot="PathologyCode" slot-scope="text">
          <span v-if="text==d.value" v-for="d in pathologyType" :key="d.value" :value="d.value">{{ d.text }}</span>
        </template>
        <span slot="operation" slot-scope="text, record">
          <template>
            <a @click="chooseOrder(record)">选择</a>
          </template>
        </span>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { getPageData, searchDataByKey } from '@/api/specimentrace/specimentrace'
import { BindPageTable, CheckField, PromptBox } from '@/utils/util'
import { getSpecimenStatus } from '@/api/submission/app'
import AppNoTemplate from './AppNoTemplate'
import SpecimenIdTemplate from './SpecimenIdTemplate'
import SendNoTemplate from './SendNoTemplate'
import Trace from './Trace'
import { getDepartmentData } from '@/api/basics/department'
import { getSubmissionTypes } from '@/api/system/workflow'
import moment from 'moment'
const data = []// 一级列表数据
const columns = [
  { title: '状态', dataIndex: 'NodeType', scopedSlots: { customRender: 'NodeType' } },
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '标本名称', dataIndex: 'SpecimenName' },
  { title: '送检类型', dataIndex: 'PathologyCode', scopedSlots: { customRender: 'PathologyCode' } },
  { title: '病人ID', dataIndex: 'HisNo' },
  { title: '病人姓名', dataIndex: 'PatientName' },
  { title: '离体时间', dataIndex: 'LeaveTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '固定时间', dataIndex: 'FixedTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '固定液', dataIndex: 'FixLiquid' },
  { title: '所属部位', dataIndex: 'PartName' },
  { title: '申请医生', dataIndex: 'DoctorName' },
  { title: '申请科室', dataIndex: 'DeptName' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '打包时间', dataIndex: 'PackageTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '创建时间', dataIndex: 'CreatedTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
]
const sData = []// 一级列表数据
const sColumns = [
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } },
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '送检类型', dataIndex: 'PathologyCode', scopedSlots: { customRender: 'PathologyCode' } },
  { title: '病人姓名', dataIndex: 'PatientName' },
  { title: '申请科室', dataIndex: 'DeptName' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '门诊号', dataIndex: 'OutpatientNum' },
  { title: '创建时间', dataIndex: 'CreatedTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } }
]
export default {
  components: {
    Trace,
    AppNoTemplate,
    SpecimenIdTemplate,
    SendNoTemplate
  },
  computed: {
    count () {
      return this.expand ? 17 : 8
    }
  },
  data () {
    return {
      sData,
      data,
      columns,
      sColumns,
      SpecimenTotal: 0,
      AppOrderTotal: 0,
      pathologyType: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      keyTypeDatas: [
        { value: '0', text: '申请单号' },
        { value: '1', text: '病人ID' },
        { value: '2', text: '患者姓名' },
        { value: '3', text: '门诊号' },
        { value: '4', text: '住院号' }
      ],
      nodeTypeDatas: [],
      departmentData: [{ value: '', text: '全部' }],
      operatorTypeDatas: [
        { value: '1', text: '操作者' },
        { value: '2', text: '操作者编号' }
      ],
      expand: false,
      loadIcon: false,
      SDataVisible: false,
      dataSource: [],
      key: '',
      keyType: '',
      sourceData: {},
      form: this.$form.createForm(this, { name: 'advanced_search' })
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
    onSearch (value) {
      if (CheckField(this.keyType) === false) {
        PromptBox('请选择查询类型！', 'warning')
        return
      }
      this.loadIcon = true
      searchDataByKey(this.key, this.keyType).then(res => {
        if (CheckField(res.data) === false) {
          PromptBox('不存在数据', 'warning')
          return
        }
        if (res.data.apps.length > 1) {
          this.SDataVisible = true
          this.sData = res.data.apps
          return
        }
        this.loadIcon = false
        this.sourceData = res.data
      })
    },
    chooseOrder (v) {
      this.SDataVisible = false
      searchDataByKey(v.AppNo, 'AppNo').then(res => {
        if (CheckField(res.data) === false) {
          PromptBox('不存在数据', 'warning')
          return
        }
        if (res.data.apps.length > 1) {
          this.SDataVisible = true
          this.sData = res.data.apps
          return
        }
        this.loadIcon = false
        this.sourceData = res.data
      })
    },
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
    handleSearch (e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        if (error) {
          PromptBox(error, 'error')
          return
        }
        this.load(1, 10, values)
      })
    },
    load (pageIndex, pageSize, parameter) {
      if (parameter === undefined) {
        parameter = { Id: 0 }
      }
      if (parameter.OperationStartTime !== undefined && parameter.OperationEndTime) {
        parameter.OperationEndTime = moment(parameter.OperationEndTime).format('YYYY-MM-DD 23:59:59')
        parameter.OperationStartTime = moment(parameter.OperationStartTime).format('YYYY-MM-DD 00:00:00')
        if (parameter.OperationStartTime > parameter.OperationEndTime) {
          PromptBox('结束时间不能小于开始时间', 'warning')
          return
        }
        console.log(parameter.OperationStartTime)
        console.log(parameter.OperationEndTime)
      }
      if (CheckField(parameter.OperationStartTime)) {
        parameter.OperationStartTime = moment(parameter.OperationStartTime).format('YYYY-MM-DD 00:00:00')
      }
      if (CheckField(parameter.OperationEndTime)) {
        parameter.OperationEndTime = moment(parameter.OperationEndTime).format('YYYY-MM-DD 23:59:59')
      }
      const $this = this
      const param = { 'ObjectDTO': parameter, 'PageIndex': pageIndex, 'pageSize': pageSize }
      getPageData(param).then((res) => {
        $this.data = BindPageTable(res.data)
        $this.SpecimenTotal = res.count
        $this.AppOrderTotal = res.appOrderCount
        $this.pagination.total = res.count
        $this.pagination.current = pageIndex
      })
    },
    handleTableChange (pagination, filters, sorter) {
      this.form.validateFields((error, values) => {
        if (error) {
          PromptBox(error, 'error')
          return
        }
        const pager = { ...this.pagination }
        pager.current = pagination.current
        this.pagination = pager
        this.load(pager.current, pager.pageSize, values)
      })
    },
    handleReset () {
      this.form.resetFields()
    },
    toggle () {
      this.expand = !this.expand
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
.spin-content {
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
  padding: 30px;
}
</style>
