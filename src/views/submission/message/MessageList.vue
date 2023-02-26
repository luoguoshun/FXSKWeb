<template>
  <div>
    <a-card :bordered="false">
      <template>
        <div>
          <a-tabs default-active-key="unread" @change="callback">
            <a-tab-pane key="all" tab="全部信息">
            </a-tab-pane>
            <a-tab-pane key="read" tab="已读信息" force-render>
            </a-tab-pane>
            <a-tab-pane key="unread" tab="未读信息">
            </a-tab-pane>
          </a-tabs>
        </div>
      </template>
      <a-form :form="form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="4">
            <a-form-item label="病理类型">
              <a-select placeholder="全部" v-decorator="['PathologyCode']">
                <a-select-option v-for="d in pathologyCodeType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="病人姓名">
              <a-input class="ant-input" v-decorator="['PatientName']" placeholder="输入病人姓名"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="病理号">
              <a-input class="ant-input" v-decorator="['MrCode']" placeholder="输入病理号"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="申请单号">
              <a-input class="ant-input" v-decorator="['HisSheetId']" placeholder="输入申请单号"/>
            </a-form-item>
          </a-col>
          </a-col>
          <a-col :span="4">
            <a-form-item label="发布时间">
              <a-date-picker @change="onChangeBegin" v-decorator="['StartTimeIssued']" placeholder="开始时间"/>
            </a-form-item>
          </a-col>
          <a-col :span="3">
            <a-form-item label="">
              <a-date-picker @change="onChangeEnd" v-decorator="['EndTimeIssued']" placeholder="结束时间"/>
            </a-form-item>
          </a-col>
          <a-col :span="1">
            <a-form-item label="">
              <a-button type="primary" icon="search" @click="search()">查询</a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-space>
              <a-form-item label="">
                <a-button type="primary" icon="rollback" @click="resetFields()">重置</a-button>
              </a-form-item>
              <a-form-item label="">
                <a-button type="default" icon="reload" @click="load()">刷新</a-button>
              </a-form-item>
              <a-form-item label="">
                <a-button type="default" :disabled="disabled" icon="pushpin" @click="mark('read')">标记已读</a-button>
              </a-form-item>
              <a-form-item label="">
                <a-button type="default" :disabled="disabled" icon="check" @click="mark('all')">全部已读</a-button>
              </a-form-item>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
      <div style="margin: 10px 0"></div>
      <a-table
        :columns="columns"
        rowKey="Id"
        :data-source="data"
        :pagination="pagination"
        @change="handleTableChange"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        class="components-table-demo-nested">
        <template slot="HisSheetId" slot-scope="text, record">
          <a style="font-weight: bold; color:#1890ff;" @click="readReport(record)">{{ text }}</a>
        </template>
        <template slot="OllAppOrder" slot-scope="text, record">
          <a style="font-weight: bold; color:#1890ff;" @click="readReport(record)">{{ text }}</a>
        </template>
        <template slot="ReadingTime" slot-scope="text">
          <span v-if="text==0"><span class="ant-badge-status-dot ant-badge-status-default"></span><span class="ant-badge-status-text">禁用</span></span>
          <span v-if="text==1"><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">启用</span></span>
        </template>
        <span slot="operation" slot-scope="text, record">
          <template>
            <a @click="readReport(record)">查看报告</a>
          </template>
        </span>
      </a-table>
    </a-card>
    <a-modal v-model="visible" title="病理报告" wrapClassName="reportModal">
      <iframe
        class="reportContent"
        src=""
        style="width:100%;height:100%;"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        allowtransparency="yes"
      />
    </a-modal>
  </div>
</template>

<script>
import { getReportMassage, getReportInfo, setPathologyReportReading } from '@/api/system/message'
import enums from '@/store/enum/enum'
import moment from 'moment'
import { PromptBox } from '@/utils/util'
import { getSubmissionTypes } from '@/api/system/workflow'
const data = []// 一级列表数据
const columns = [
  { title: '申请单号', dataIndex: 'HisSheetId', scopedSlots: { customRender: 'HisSheetId' } },
  { title: '原申请单号', dataIndex: 'OllAppOrder' },
  { title: '病理号', dataIndex: 'MrCode' },
  { title: '病人姓名', dataIndex: 'PatientName' },
  { title: '病人年龄', dataIndex: 'Age' },
  { title: '病理类型', dataIndex: 'PathologyClass' },
  { title: '发布时间', dataIndex: 'TimeIssued', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '诊断结果', dataIndex: 'Diagnosis' },
  { title: '是否阅读', key: 'ReadingTime', scopedSlots: { customRender: 'ReadingTime' } },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
]
export default {
  components: {

  },
  data () {
    return {
      layout: 'horizontal',
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 17
      },
      visible: false,
      disabled: false,
      data,
      columns,
      selectedRowKeys: [],
      form: this.$form.createForm(this),
      pathologyCodeType: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      ReadingType: 'unread',
      filter: {
        PatientName: '',
        HisSheetId: '',
        MrCode: '',
        PathologyCode: '',
        StartTimeIssued: '',
        EndTimeIssued: ''
      }
    }
  },
  created: function () {
    this.load()
    getSubmissionTypes().then(res => {
      res.forEach(element => {
        this.pathologyCodeType.push({
          value: element.Content,
          text: element.Name
        })
      })
    })
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    mark (type) {
      const $this = this
      if (type === 'read' && this.selectedRowKeys.length === 0) {
        PromptBox('请选择需要标记的记录', 'warning')
        return
      }
      if (type === 'all' && this.data.length === 0) {
        PromptBox('当前没有未阅读的报告', 'warning')
        return
      }
      setPathologyReportReading({ 'Type': type, Ids: this.selectedRowKeys }).then(res => {
        if (res.HttpStatusCode === 200 && res.ResultType === 1) {
          PromptBox(res.Message, 'success')
          $this.load()
        } else {
          PromptBox(res.Message, 'warning')
        }
      })
    },
    resetFields () {
      this.form.resetFields()
      this.search()
    },
    callback (key) {
      if (key === 'read') {
        this.disabled = true
      } else {
        this.disabled = false
      }
      this.ReadingType = key
      this.search()
    },
    search () {
      const $this = this
      this.form.validateFields((error, values) => {
        if (error) {
          PromptBox(error, 'error')
          return
        }
        if (values.StartTimeIssued !== undefined) {
          values.StartTimeIssued = moment(values.StartTimeIssued).format('YYYY-MM-DD HH:mm:ss')
        }
        if (values.EndTimeIssued !== undefined) {
          values.EndTimeIssued = moment(values.EndTimeIssued).format('YYYY-MM-DD HH:mm:ss')
        }
        $this.filter = values
        $this.filter.ReadingType = $this.ReadingType
        $this.load()
      })
    },
    load () {
      const dto = { 'ObjectDTO': this.filter, 'PageIndex': this.pagination.current, 'PageSize': this.pagination.pageSize }
      getReportMassage(dto).then(res => {
        if (res && res.data) {
          const _mainData = []
          res.data.forEach((item, index) => {
            item.key = index + 1
            _mainData.push(item)
          })
          this.data = _mainData
          this.pagination.total = res.count
        } else {
          PromptBox(res.Message, 'warning')
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
      this.filter.StartTimeIssued = date
    },
    onChangeEnd (date) {
      this.filter.EndTimeIssued = date
    },
    readReport (obj) {
      // this.visible = true
      getReportInfo(obj.HisSheetId).then(res => {
        window.open(res)
        // const dom = document.getElementsByClassName('reportModal')
        // const reportContent = document.getElementsByClassName('reportContent')[0]
        // const modal = dom[0].childNodes[0]
        // const content = modal.childNodes[1]
        // const width = document.body.offsetWidth
        // const height = document.body.offsetHeight
        // modal.style.setProperty('left', 0)
        // modal.style.setProperty('width', `${width - 300}px`)
        // modal.style.setProperty('height', `${height - 200}px`)
        // content.style.setProperty('width', `${width - 300}px`)
        // content.style.setProperty('height', `${height - 200}px`)
        // reportContent.style.setProperty('width', `${width - 350}px`)
        // reportContent.style.setProperty('height', `${height - 370}px`)
        // reportContent.setAttribute('src', res)
      })
    }
  }
}
</script>
