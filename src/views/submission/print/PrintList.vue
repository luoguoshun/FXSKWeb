<template>
  <div>
    <a-card :bordered="false">
      <div id="components-form-demo-advanced-search">
        <a-row :span="24">
          <a-space class="ant-advanced-search-form">
            <a-col :key="1" :span="4" :style="{ display: 1 < count() ? 'block' : 'none' }">
              <a-input-group compact style="width: 300px">
                <a-select placeholder="选择类型" v-model="filters.type" style="width: 35%">
                  <a-select-option v-for="d in keyTypeDatas" :key="d.value" :value="d.value">{{
                    d.text
                  }}</a-select-option>
                </a-select>
                <a-input
                  style="width: 65%"
                  class="ant-input"
                  v-model="filters.keys"
                  placeholder="输入关键字值"
                  @keypress.13.native="search"
                />
              </a-input-group>
            </a-col>
            <a-col :key="11" :span="4" :style="{ display: 11 < count() ? 'block' : 'none' }">
              <a-select
                show-search
                placeholder="送检类型"
                option-filter-prop="children"
                style="width: 200px"
                v-model="filters.pathologyType"
              >
                <a-select-option v-for="d in pathologyType" :key="d.value" :value="d.value">
                  {{ d.text }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :key="12" :span="4" :style="{ display: 12 < count() ? 'block' : 'none' }">
              <a-date-picker style="width: 120px" v-model="filters.startDate" placeholder="开始时间" />
            </a-col>
            <a-col :key="13" :span="4" :style="{ display: 13 < count() ? 'block' : 'none' }">
              <a-date-picker style="width: 120px" v-model="filters.endDate" placeholder="结束时间" />
            </a-col>
            <a-col :key="14" :span="4" :style="{ display: 14 < count() ? 'block' : 'none' }">
              <a-select show-search optionFilterProp="children" v-model="filters.department" style="width: 150px">
                <a-select-option v-for="d in departmentData" :key="d.value" :value="d.value">{{
                  d.text
                }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :key="15" :span="4" :style="{ display: 15 < count() ? 'block' : 'none' }">
              <a-select show-search optionFilterProp="children" v-model="filters.sendDepartment" style="width: 150px">
                <a-select-option v-for="d in sendDepartmentData" :key="d.value" :value="d.value">{{
                  d.text
                }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :key="5" :span="4" :style="{ display: 5 < count() ? 'block' : 'none' }">
              <a-button type="primary" icon="search" @click="search()">查询</a-button>
            </a-col>
            <a-col :key="6" :span="4" :style="{ display: 6 < count() ? 'block' : 'none' }">
              <a-button type="default" icon="reload" @click="load()">刷新</a-button>
            </a-col>
            <a-col :key="7" :span="4" :style="{ display: 7 < count() ? 'block' : 'none' }">
              <Help :helpTitle="'预检打印操作说明'" :helpCode="'PrintOperationHelp'" :content="''" />
            </a-col>
            <a-col :key="8" :span="4" :style="{ display: 8 < count() ? 'block' : 'none' }">
              <a :style="{ display: 'block', width: '50px', fontSize: '12px' }" @click="toggle">
                折叠 <a-icon :type="expand ? 'up' : 'down'" />
              </a>
            </a-col>
          </a-space>
        </a-row>
      </div>
      <div style="margin: 10px 0"></div>
      <a-table
        :columns="columns"
        :rowKey="(record, index) => index"
        ref="tableref"
        :data-source="data"
        :pagination="pagination"
        :expandedRowKeys="curExpandedRowKeys"
        @change="handleTableChange"
        @expand="expand"
        class="components-table-demo-nested"
      >
        <template slot="Status" slot-scope="text">
          <span v-if="text == 0"
            ><span class="ant-badge-status-dot ant-badge-status-default"></span
            ><span class="ant-badge-status-text">未提交</span></span
          >
          <span v-if="text == 1"
            ><span class="ant-badge-status-dot ant-badge-status-processing"></span
            ><span class="ant-badge-status-text">已提交</span></span
          >
          <span v-if="text == 2"
            ><span class="ant-badge-status-dot ant-badge-status-waring"></span
            ><span class="ant-badge-status-text">退回</span></span
          >
        </template>
        <template slot="Sex" slot-scope="text">
          <span v-if="text == 0"><span class="ant-badge-status-text" style="color: #096dd9">男</span></span>
          <span v-if="text == 1"><span class="ant-badge-status-text" style="color: #f198aa">女</span></span>
        </template>
        <template slot="PathologyCode" slot-scope="text">
          <span v-for="(d, index) in pathologyType" :key="d.value + index + ''" :value="d.value">
            <span v-if="text == d.value">{{ d.text }}</span>
          </span>
        </template>
        <template slot="Department" slot-scope="text">
          <span v-for="(d, index) in departmentDatas" :key="d.value + index + ''" :value="d.value">
            <span v-if="text == d.value">{{ d.text }}</span>
          </span>
        </template>
        <template slot="Age" slot-scope="text, record">
          <span>{{ record.AgeYear }}岁{{ record.AgeMonth }}月{{ record.AgeDay }}日</span>
        </template>
        <span slot="operation" slot-scope="text, record">
          <template>
            <a @click="edit(record)">标本列表</a>
            <!-- <a-divider type="vertical" />
            <a @click="progress(record)" style="color:blue;">进度</a> -->
          </template>
        </span>
        <a-table slot="expandedRowRender" :columns="innerColumns" :data-source="innerData" :pagination="false">
          <span slot="operation" slot-scope="text, record">
            <template>
              <a @click="trace(record)">轨迹</a>
            </template>
          </span>
        </a-table>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { getOrderData, getOrderSpecimens } from '@/api/submission/app';
import moment from 'moment';
import PrintEdit from '@/views/submission/print/Edit';
import Progress from '@/views/submission/app/Progress';
import Trace from '@/views/submission/speciment/Trace';
import { CheckField } from '@/utils/util';
import Help from '@/components/Help/HelpShowInfo';
import { getSubmissionTypes } from '@/api/system/workflow';
import { getHisReqTypeByIp } from '@/api/system/hisReqConfig';
const data = []; // 一级列表数据
const innerData = [];
//customRender 提供复杂的函数渲染
const columns = [
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '原申请单号', dataIndex: 'OllAppOrder' },
  { title: '状态', dataIndex: 'Status', key: 'Status', scopedSlots: { customRender: 'Status' } },
  { title: '患者姓名', dataIndex: 'PatientName' },
  { title: '送检类型', dataIndex: 'PathologyCode', scopedSlots: { customRender: 'PathologyCode' } },
  { title: '姓名', dataIndex: 'UserName' },
  { title: '年龄', dataIndex: 'Age', scopedSlots: { customRender: 'Age' } },
  { title: '性别', dataIndex: 'Sex', scopedSlots: { customRender: 'Sex' } },
  { title: '病人ID', dataIndex: 'HisNo', key: 'HisNo' },
  { title: '门诊号', dataIndex: 'OutpatientNum' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '标本数量', dataIndex: 'SpecimenTotal' },
  {
    title: '录入时间',
    dataIndex: 'CreatedTime',
    customRender: (val) => {
      return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '';
    },
  },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } },
];
const innerColumns = [
  { title: '标本编号', dataIndex: 'Id' },
  { title: '标本名称', dataIndex: 'SpecimenName' },
  {
    title: '离体时间',
    dataIndex: 'LeaveTime',
    customRender: (val) => {
      return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '';
    },
  },
  {
    title: '固定时间',
    dataIndex: 'FixedTime',
    customRender: (val) => {
      return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '';
    },
  },
  { title: '固定液', dataIndex: 'FixLiquid' },
  { title: '所属部位', dataIndex: 'PartName' },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } },
];
export default {
  components: {
    PrintEdit,
    Progress,
    Trace,
    Help,
  },
  data() {
    return {
      count: function () {
        return this.expands ? 15 : 10;
      },
      expands: false,
      data,
      innerData,
      columns,
      innerColumns,
      filters: {
        keys: '',
        type: '2',
        startDate: '',
        endDate: '',
        pathologyType: '',
        feeIhcFlag: '',
        department: '',
        sendDepartment: '',
      },
      departmentData: [{ value: '', text: '操作科室' }],
      sendDepartmentData: [{ value: '', text: '送检科室' }],
      pathologyType: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
      },
      keyTypeDatas: [
        { value: '1', text: '病人ID' },
        { value: '2', text: '住院号' },
        { value: '3', text: '门诊号' },
        { value: '4', text: '患者姓名' },
        { value: '5', text: '扫码' },
        { value: '6', text: '申请单号' },
        { value: '7', text: '手腕码' },
      ],
      curExpandedRowKeys: [],
    };
  },
  created: function () {
    this.load();
    getSubmissionTypes().then((res) => {
      res.forEach((element) => {
        this.pathologyType.push({
          value: element.Content,
          text: element.Name,
        });
      });
    });
    getHisReqTypeByIp().then((res) => {
      if (CheckField(res.Data)) {
        this.filters.type = res.Data.ReqType;
      }
    });
  },
  computed: {},
  methods: {
    expand(expanded, record) {
      if (this.curExpandedRowKeys.length > 0 && this.curExpandedRowKeys[0] === record.key) {
        this.curExpandedRowKeys = [];
      } else {
        this.curExpandedRowKeys = [record.key];
        getOrderSpecimens(record.Id).then((res) => {
          res.data.forEach((item, index) => {
            item.key = index + 1;
          });
          this.innerData = res.data;
        });
      }
    },
    edit(record) {
      const $this = this;
      this.$dialog(
        PrintEdit,
        // component props
        {
          record,
          on: {
            ok() {},
            cancel() {},
            close() {
              // Mark：定时提交成功一秒钟后刷新列表，防止数据未刷新
              setTimeout(() => {
                $this.load();
              }, 500);
            },
          },
        },
        // modal props
        {
          title: '标本列表',
          width: '95%',
          centered: true,
          maskClosable: false,
          dialogClass: 'printModel',
          footer: '',
          bodyStyle: {
            height: '600px',
          },
        },
      );
    },
    progress(record) {
      this.$dialog(
        Progress,
        // component props
        {
          record,
          on: {
            ok() {},
            cancel() {},
            close() {},
          },
        },
        // modal props
        {
          title: '申请单进度',
          width: 1000,
          centered: true,
          maskClosable: true,
          footer: '',
        },
      );
    },
    trace(record) {
      this.$dialog(
        Trace,
        // component props
        {
          record,
          on: {
            ok() {},
            cancel() {},
            close() {},
          },
        },
        // modal props
        {
          title: '标本轨迹',
          width: 1000,
          centered: true,
          maskClosable: true,
          footer: '',
        },
      );
    },
    search() {
      if (this.startDate && this.endDate && this.startDate > this.endDate) {
        this.$message.warning('结束时间不能小于开始时间', 2);
        return;
      }
      this.filters.startDate = CheckField(this.filters.startDate)
        ? moment(this.filters.startDate).format('YYYY-MM-DD 00:00:01')
        : null;
      this.filters.endDate = CheckField(this.filters.endDate)
        ? moment(this.filters.endDate).format('YYYY-MM-DD 23:59:59')
        : null;
      this.load();
    },
    load() {
      getOrderData(this.pagination, this.filters).then((res) => {
        const _mainData = [];
        res.data.forEach((item, index) => {
          item.key = index + 1;
          item.SpecimenTotal = item.Specimens.length;
          _mainData.push(item);
        });
        this.data = _mainData;
        this.pagination.total = res.count;
      });
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.load();
    },
    toggle() {
      this.expands = !this.expands;
    },
  },
};
</script>
<style>
.printModel .ant-table-content {
  min-height: 450px;
}
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
