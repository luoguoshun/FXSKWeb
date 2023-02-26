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
            <a-select
              show-search
              optionFilterProp="children"
              v-model="filter.department"
              style="width: 150px"
            >
              <a-select-option v-for="d in departmentData" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
            </a-select>
            <a-button type="primary" icon="search" @click="Search()">查询</a-button>
            <a-divider type="vertical" />
            <a-button type="default" icon="reload" @click="load(1, 10)">刷新</a-button>
            <a-button type="primary" icon="printer" @click="print()">打印申请单</a-button>
            申请单总数：<a-tag color="cyan">{{ AppOrderTotal }}</a-tag>
            标本总数：<a-tag color="green">{{ SpecimenTotal }}</a-tag>
          </a-space>
        </a-col>
      </a-row>
      <div style="margin: 10px 0"></div>
      <a-table
        :columns="packColumns"
        rowKey="Id"
        :data-source="packData"
        :pagination="pagination"
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
    <k-form-build id="form" ref="kfb" :value="jsonData" :dynamicData="dynamicData" style="display:none;"/>
  </div>
</template>

<script>
import { getPackageSpecimens } from '@/api/submission/packaging'
import { getSendPacks } from '@/api/statistic/statistic'
import Trace from '@/views/submission/speciment/Trace'
import moment from 'moment'
import Help from '@/components/Help/HelpShowInfo'
import { getAppOrderNewsForPrint } from '@/api/submission/app'
import { getTemplateByCode } from '@/api/system/pageTemplate'
import { CheckField, JSONStringToObject, ObjectToJSONString } from '@/utils/util'
import Print from '@/utils/print'
import { getPathologyTypes } from '@/api/system/dictionary'
import ComponentInitializer from '@/core/components/componentRegistrar'
import { getDepartmentData } from '@/api/basics/department'
const countnum = 6
const packData = []// 一级列表数据
const packColumns = [
  { title: '送检号', dataIndex: 'SendNo', scopedSlots: { customRender: 'SendNo' } },
  { title: '状态', dataIndex: 'ShippingStatus', scopedSlots: { customRender: 'ShippingStatus' } },
  { title: '申请单数量', dataIndex: 'AppOrderTotal' },
  { title: '标本数量', dataIndex: 'SpecimenCount' },
  { title: '开始时间', dataIndex: 'ShippingStartTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '结束时间', dataIndex: 'ShippingEndTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '科室', dataIndex: 'DeptName' },
  { title: '打包人', dataIndex: 'Submitter' },
  { title: '运送人', dataIndex: 'Shipper' },
  { title: '打包时间', dataIndex: 'CreatedTime' },
  { title: '备注', dataIndex: 'Remark' }
]
const innerData = []
const innerColumns = [
  { title: '标本名称', dataIndex: 'SpecimenName' },
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
    Help
  },
  data () {
    return {
      countnum,
      packData,
      packColumns,
      innerData,
      innerColumns,
      selectedRowKeys: [],
      packagingData: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      filter: {
        sendNo: '',
        sendStatus: '',
        startDate: '',
        endDate: '',
        department: ''
      },
      keyTypeDatas: [
        { value: '', text: '请选择' },
        { value: '0', text: '未运送' },
        { value: '1', text: '已运送' },
        { value: '2', text: '已接收' }
      ],
      pathologyType: [],
      jsonData: {
        list: [
        ],
        config: {
        }
      },
      dynamicData: {
        Specimens: []
      },
      printList: [],
      departmentData: [{ 'value': '', 'text': '全部科室' }],
      AppOrderTotal: 0,
      SpecimenTotal: 0
    }
  },
  created: function () {
    this.data = []
    ComponentInitializer()
    this.initialize()
    this.packLoad()
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    initialize () {
      getPathologyTypes().then(res => {
        if (CheckField(res)) {
          res.forEach(item => {
            this.pathologyType.push({ text: item.Name, value: item.Content })
          })
        }
      })
      getTemplateByCode('Preview').then(res => {
        this.jsonData = JSONStringToObject(res.data.Content)
      })
      getDepartmentData().then(res => {
        if (res.data !== null) {
          res.data.forEach(item => {
            this.departmentData.push({ value: item.DeptCode, text: item.DeptName })
          })
        }
      })
    },
    print () {
      const $this = this
      if (this.selectedRowKeys.length === 0) {
        $this.$message.warning('请选择打印项', 2)
        return
      }
      getAppOrderNewsForPrint($this.selectedRowKeys.join(',')).then(res => {
        _tempPrint(res.data, 0)
      })
      function _tempPrint (data, i) {
        window.setTimeout(() => {
          const _tempData = data[i]
          $this.dynamicData.Specimens = _tempData.Specimens
          const _temp = ObjectToJSONString(_tempData)
          const _tempObj = JSONStringToObject(_temp)
          _tempObj.Null = ''
          switch (_tempObj.AgeType) {
            case '0':
              _tempObj.Age = _tempObj.Age + '岁'
              break
            case '1':
              _tempObj.Age = _tempObj.Age + '月'
              break
            case '2':
              _tempObj.Age = _tempObj.Age + '日'
              break
          }
          switch (_tempObj.Sex) {
            case '0':
              _tempObj.Sex = '男'
              break
            case '1':
              _tempObj.Sex = '女'
              break
          }
          switch (_tempObj.ContagionFlag) {
            case 'Y':
              _tempObj.ContagionFlag = '是'
              break
            case 'N':
              _tempObj.ContagionFlag = '否'
              break
          }
          _tempObj.MenstrualTime = _tempObj.MenstrualTime === null ? '' : moment(_tempObj.MenstrualTime).format('YYYY-MM-DD')
          const _pathologyType = $this.pathologyType.filter(f => f.value === _tempObj.PathologyCode)
          if (CheckField(_pathologyType) && _pathologyType.length > 0) {
            _tempObj.PathologyCode = _pathologyType[0].text
          }
          $this.dynamicData.Specimens = _tempObj.Specimens
          $this.$refs.kfb.reset()
          $this.$refs.kfb.setData(_tempObj)
          setTimeout(() => {
            // 这里由于将表单打印模板隐藏起来，需要对其进行克隆，然后将克隆dom设为可视，最后进行打印
            const dom = document.getElementById('form')
            const b = document.getElementsByClassName('ant-form-item-label')
            b.forEach(item => {
              item.style.clear = 'both'
            })
            const c = document.getElementsByClassName('ant-form-item-control-wrapper')
            c.forEach(item => {
              item.style.float = 'none'
            })
            const d = document.getElementsByClassName('ant-form-item')
            d.forEach(item => {
              item.style.padding = '0px'
            })
            const a = document.getElementsByClassName('grid-row')
            a[0].setAttribute('style', 'border: 1px solid #e8e8e8')
            const dom2 = dom.cloneNode(true)
            dom2.setAttribute('style', 'display: block;')
            // $this.printEveryItem(dom2)
            Print(dom2)
          }, 500)
          // 如果下个索引超出了当前标本列表长度则不继续打印
          if ((i + 1) < data.length) {
            _tempPrint(data, i + 1)
          }
        }, 500)
      }
    },
    // 打印每项
    printEveryItem(dom) {
      const LODOP = getLodop() // 调用getLodop获取LODOP对象
      LODOP.PRINT_INIT('')
      var style = '<link href="' + process.env.BASE_URL + 'print.css?' + Date.parse(new Date()) +' type="text/css" rel="stylesheet">'
      var html = '<head>' + style + '</head><body>' + dom.innerHTML + '</body>'
      LODOP.ADD_PRINT_HTM(20, 20, '100%', '100%', '<!DOCTYPE html>'+ html)
      // LODOP.PRINT()
      LODOP.PREVIEW()
    },
    loadPrinter () {
      const LODOP = getLodop()
      if (!LODOP) return
      // 获取打印机个数
      const count = LODOP.GET_PRINTER_COUNT()
      const printValue = LODOP.GET_PRINTER_NAME(-1) // 获取默认打印机
      this.printList = Array(count).fill(null).map((...args) => {
          if (printValue === LODOP.GET_PRINTER_NAME(args[1])){
              this.printDefault = args[1]
          }
          return {
              value: args[1], // args[1]为数组索引
              label: LODOP.GET_PRINTER_NAME(args[1]) // 获取打印机名称
          }
      })
    },
    moment,
    onSearch () {
      this.scan(this.No)
    },
    expand (expanded, record) {
      getPackageSpecimens(record.Id).then((res) => {
        res.data.forEach((item, index) => {
          item.key = index + 1
        })
        this.innerData = res.data
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
          maskClosable: true,
          footer: ''
        })
    },
    Search () {
      this.pagination.current = 1
      this.pagination.total = 0
      this.packLoad()
    },
    packLoad () {
      const $this = this
      this.AppOrderTotal = 0
      this.SpecimenTotal = 0
      if (this.filter.endDate && this.filter.startDate && this.filter.endDate < this.filter.startDate) {
        this.$message.warning('结束时间不能小于开始时间', 2)
        return
      }
      getSendPacks(this.pagination, this.filter).then((res) => {
        const _mainData = []
        res.sendPackages.PagerData.forEach((item, index) => {
          item.key = index + 1
          _mainData.push(item)
        })
        $this.AppOrderTotal = res.AppTotal
        $this.SpecimenTotal = res.SpecimenTotal
        $this.packData = _mainData
        $this.pagination.total = res.sendPackages.TotalCount
      })
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.packLoad()
    },
    onSelectChange (selectedRowKeys, obj) {
      this.packagingData = []
      this.selectedRowKeys = selectedRowKeys
      selectedRowKeys.forEach(item => {
        this.packData.forEach(obj => {
          if (item === obj.Id) {
            this.packagingData.push(obj)
          }
        })
      })
    },
    onChangeBegin (date) {
      this.filter.startDate = CheckField(date) ? moment(date).format('YYYY-MM-DD 00:00:00') : null
    },
    onChangeEnd (date) {
      this.filter.endDate = CheckField(date) ? moment(date).format('YYYY-MM-DD 23:59:59') : null
    }
  }
}
</script>
<style>
.ant-tabs-extra-content{
  line-height: 0;
}
</style>
