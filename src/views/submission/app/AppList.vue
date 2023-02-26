<template>
  <div>
    <a-card :bordered="false">
      <div id="components-form-demo-advanced-search">
        <a-row :span="24">
          <a-space class="ant-advanced-search-form">
            <a-col :key="0" :span="4" :style="{ display: 0 < count() ? 'block' : 'none' }">
              <a-input-group compact style="width: 230px">
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
            <a-col :key="14" :span="4" :style="{ display: 14 < count() ? 'block' : 'none' }">
              <span v-if="this.searchStrategys.IsFeeIhcFlag" style="width: 100px; display: block">是否免疫组化：</span>
            </a-col>
            <a-col :key="15" :span="4" :style="{ display: 15 < count() ? 'block' : 'none' }">
              <a-select v-if="this.searchStrategys.IsFeeIhcFlag" v-model="filters.feeIhcFlag" style="width: 80px">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="Y">是</a-select-option>
                <a-select-option value="N">否</a-select-option>
              </a-select>
            </a-col>
            <a-col :key="16" :span="4" :style="{ display: 16 < count() ? 'block' : 'none' }">
              <a-select
                v-if="this.searchStrategys.Department"
                show-search
                optionFilterProp="children"
                v-model="filters.department"
                style="width: 150px"
              >
                <a-select-option v-for="d in departmentData" :key="d.value" :value="d.value">{{
                  d.text
                }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :key="17" :span="4" :style="{ display: 17 < count() ? 'block' : 'none' }">
              <a-select
                v-if="this.searchStrategys.Department"
                show-search
                optionFilterProp="children"
                v-model="filters.sendDepartment"
                style="width: 150px"
              >
                <a-select-option v-for="d in sendDepartmentData" :key="d.value" :value="d.value">{{
                  d.text
                }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :key="11" :span="4" :style="{ display: 11 < count() ? 'block' : 'none' }">
              <a-date-picker style="width: 120px" v-model="filters.startDate" placeholder="开始时间" />
            </a-col>
            <a-col :key="12" :span="4" :style="{ display: 12 < count() ? 'block' : 'none' }">
              <a-date-picker style="width: 120px" v-model="filters.endDate" placeholder="结束时间" />
            </a-col>
            <a-col :key="13" :span="4" :style="{ display: 13 < count() ? 'block' : 'none' }">
              <a-select
                show-search
                placeholder="送检类型"
                option-filter-prop="children"
                style="width: 150px"
                v-model="filters.pathologyType"
              >
                <a-select-option v-for="d in pathologyType" :key="d.value" :value="d.value">{{
                  d.text
                }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :key="6" :span="4" :style="{ display: 6 < count() ? 'block' : 'none' }">
              <a-button type="primary" icon="search" @click="search()">查询</a-button>
            </a-col>
            <a-col :key="7" :span="4" :style="{ display: 7 < count() ? 'block' : 'none' }">
              <a-button type="primary" icon="plus" @click="add()">新建</a-button>
            </a-col>
            <a-col :key="8" :span="4" :style="{ display: 8 < count() ? 'block' : 'none' }">
              <a-button type="default" icon="reload" @click="reLoad()">刷新</a-button>
            </a-col>
            <a-col :key="9" :span="4" :style="{ display: 9 < count() ? 'block' : 'none' }">
              <Help :helpTitle="'申请单操作说明'" :helpCode="'ApplyOperationHelp'" :content="''" />
            </a-col>
            <a-col :key="10" :span="4" :style="{ display: 10 < count() ? 'block' : 'none' }">
              <a :style="{ display: 'block', width: '50px', fontSize: '12px' }" @click="toggle">
                折叠 <a-icon :type="expand ? 'up' : 'down'" />
              </a>
            </a-col>
          </a-space>
        </a-row>
      </div>
      <div style="margin: 10px 0" tabindex="0" id="apply_main"></div>
      <a-table
        :columns="columns"
        rowKey="Id"
        :data-source="data"
        :pagination="pagination"
        @change="handleTableChange"
        class="components-table-demo-nested"
      >
        <template slot="Status" slot-scope="text">
          <span v-if="text == 0"
            ><span class="ant-badge-status-dot ant-badge-status-default"></span>
            <span class="ant-badge-status-text">未提交</span></span
          >
          <span v-if="text == 1"
            ><span class="ant-badge-status-dot ant-badge-status-processing"></span>
            <span class="ant-badge-status-text">已提交</span></span
          >
          <span v-if="text == 2">
            <span class="ant-badge-status-dot ant-badge-status-waring"></span
            ><span class="ant-badge-status-text"> 退回 </span>
          </span>
        </template>
        <template slot="Sex" slot-scope="text">
          <span v-if="text == 0"> <span class="ant-badge-status-text" style="color: #096dd9">男</span></span>
          <span v-if="text == 1"><span class="ant-badge-status-text" style="color: #f198aa">女</span></span>
        </template>
        <template slot="PathologyCode" slot-scope="text">
          <span v-for="d in pathologyType" :key="d.value" :value="d.value" v-if="text == d.value">{{ d.text }}</span>
        </template>
        <template slot="Age" slot-scope="text, record">
          <span>{{ record.AgeYear }}岁{{ record.AgeMonth }}月{{ record.AgeDay }}日</span>
        </template>
        <template slot="Department" slot-scope="text">
          <span v-if="text == d.value" v-for="d in departmentDatas" :key="d.value" :value="d.value">
            {{ d.text }}
          </span>
        </template>
        <span slot="operation" slot-scope="text, record">
          <template>
            <a @click="print(record)">标本列表</a>
            <a-divider type="vertical" />
            <a @click="preview(record)">预览打印</a>
            <a-divider type="vertical" />
            <a @click="edit(record)">修改</a>
            <!-- <a-divider type="vertical" />
            <a @click="editNew(record)">修改（新）</a> -->
            <a-divider type="vertical" />
            <a-popconfirm
              title="确定删除数据?"
              ok-text="是"
              cancel-text="否"
              @confirm="del(record)"
              style="color: #f50"
            >
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </span>
      </a-table>
      <k-form-build id="form" ref="kfb" :value="jsonData" :dynamicData="dynamicData" style="display: none" />
    </a-card>
  </div>
</template>

<script>
import { getOrderData, delOrder } from '@/api/submission/app';
import { CheckField, JSONStringToObject, ObjectToJSONString, PromptBox } from '@/utils/util';
import moment from 'moment';
import Edit2 from './Edit2';
import Edit1 from './Edit';
import EditNew from './EditNew';
import { Scaner } from '@/utils/scan';
import PrintEdit from '@/views/submission/print/Edit';
import Preview from './PreviewNew';
import storage from '@/store';
import { getStrategyTemplate } from '@/api/system/strategy';
import ComponentInitializer from '@/core/components/componentRegistrar';
import { getTemplateByCode } from '@/api/system/pageTemplate';
import Print from '@/utils/print';
import Help from '@/components/Help/HelpShowInfo';
import { getPathologyTypes } from '@/api/system/dictionary';
import { getHisReqTypeByIp } from '@/api/system/hisReqConfig';
import { getDepartmentData } from '@/api/basics/department';
const data = []; // 一级列表数据
const columns = [
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '原申请单号', dataIndex: 'OllAppOrder' },
  { title: '患者姓名', dataIndex: 'PatientName' },
  { title: '年龄', dataIndex: 'Age', scopedSlots: { customRender: 'Age' } },
  { title: '性别', dataIndex: 'Sex', scopedSlots: { customRender: 'Sex' } },
  { title: '病人ID', dataIndex: 'HisNo', key: 'HisNo' },
  { title: '门诊号', dataIndex: 'OutpatientNum' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '标本数量', dataIndex: 'SpecimenTotal' },
  { title: '标本科室', dataIndex: 'SendDepartmentName' },
  { title: '送检类型', dataIndex: 'PathologyCode', scopedSlots: { customRender: 'PathologyCode' } },
  {
    title: '录入时间',
    dataIndex: 'CreatedTime',
    customRender: (val) => {
      return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '';
    },
  },
  { title: '状态', dataIndex: 'Status', key: 'Status', scopedSlots: { customRender: 'Status' } },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } },
];
const Edit = Edit1;
export default {
  components: {
    Edit1,
    Edit2,
    EditNew,
    Preview,
    PrintEdit,
    Help,
  },
  data() {
    return {
      count: function () {
        return this.expand ? 15 : 11;
      },
      expand: false,
      Edit,
      strategys: {},
      searchStrategys: {
        IsFeeIhcFlag: true,
        Department: true,
      },
      data,
      columns,
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
      pathologyType: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
      },
      departmentData: [{ value: '', text: '操作科室' }],
      sendDepartmentData: [{ value: '', text: '送检科室' }],
      keyTypeDatas: [
        { value: '1', text: '病人ID' },
        { value: '2', text: '住院号' },
        { value: '3', text: '门诊号' },
        { value: '4', text: '患者姓名' },
        { value: '5', text: '扫码' },
        { value: '6', text: '申请单号' },
        { value: '7', text: '手腕码' },
      ],
      jsonData: {
        list: [],
        config: {},
      },
      dynamicData: {
        Specimens: [],
      },
      code: '',
      loading: false,
      model: null,
    };
  },
  created: function () {
    ComponentInitializer();
    // 注册扫描器，并回调
    Scaner(this.scanCallBack);
    // 初始化
    this.load();
    // 获取申请单策略
    this.getStrategyConfig(() => {
      // 当是外部链接访问，则默认打开新增窗口
      if (CheckField(storage.get('flag')) === true) {
        this.add();
      }
    });
    this.initialize();
  },
  mounted() {
    document.getElementById('apply_main').focus();
  },
  computed: {},
  methods: {
    initialize() {
      getStrategyTemplate('AppList').then((res) => {
        const a = JSONStringToObject(res.Content);
        if (CheckField(a) && CheckField(a.property.IsFeeIhcFlag)) {
          this.searchStrategys.IsFeeIhcFlag = a.property.IsFeeIhcFlag.visible;
        }
        if (CheckField(a) && CheckField(a.property.Department)) {
          this.searchStrategys.Department = a.property.Department.visible;
        }
      });
      getPathologyTypes().then((res) => {
        if (CheckField(res)) {
          res.forEach((item) => {
            this.pathologyType.push({ text: item.Name, value: item.Content });
          });
        }
      });
      getTemplateByCode('Preview').then((res) => {
        this.jsonData = JSONStringToObject(res.data.Content);
      });
      getHisReqTypeByIp().then((res) => {
        if (CheckField(res.Data)) {
          this.filters.type = res.Data.ReqType;
        }
      });
      getDepartmentData().then((res) => {
        //获取部门列表
        getDepartmentData().then((res) => {
          if (res.data !== null) {
            this.sendDepartmentData = this.departmentData = [];
            res.data.forEach((item, index) => {
              const obj = { value: item.DeptCode, text: item.DeptName };
              const result = this.departmentData.findIndex((item) => {
                return item.value == obj.value || item.text == obj.text;
              });
              if (result == -1) {
                this.departmentData.push(obj);
              }
            });
          }
        });
      });
    },
    preview(record) {
      const _temp = ObjectToJSONString(record);
      const _tempObj = JSONStringToObject(_temp);
      switch (_tempObj.AgeType) {
        case '0':
          _tempObj.Age = _tempObj.Age + '岁';
          break;
        case '1':
          _tempObj.Age = _tempObj.Age + '月';
          break;
        case '2':
          _tempObj.Age = _tempObj.Age + '日';
          break;
      }
      switch (_tempObj.Sex) {
        case '0':
          _tempObj.Sex = '男';
          break;
        case '1':
          _tempObj.Sex = '女';
          break;
      }
      const _pathologyType = this.pathologyType.filter((f) => f.value === _tempObj.PathologyCode);
      if (CheckField(_pathologyType) && _pathologyType.length > 0) {
        _tempObj.PathologyCode = _pathologyType[0].text;
      }
      this.dynamicData.Specimens = _tempObj.Specimens;
      this.$refs.kfb.setData(_tempObj);
      setTimeout(() => {
        // 这里由于将表单打印模板隐藏起来，需要对其进行克隆，然后将克隆dom设为可视，最后进行打印
        const a = document.getElementsByClassName('ant-form-item-control-wrapper');
        a.forEach((item) => {
          item.style.float = 'none';
          item.style.display = 'block';
        });
        const b = document.getElementsByClassName('grid-row');
        b[0].setAttribute('style', 'border: 1px solid #e8e8e8');
        const dom = document.getElementById('form');
        const dom2 = dom.cloneNode(true);
        dom2.setAttribute('style', 'display: block;');
        Print(dom2);
      }, 500);
    },
    //获取策略配置
    getStrategyConfig(callBack) {
      getStrategyTemplate('AppEdit').then((res) => {
        if (CheckField(res.Content) === false) {
          PromptBox('请设置默认策略', 'error');
          return;
        }
        this.strategys = res.Content;
        // 如果是非静态模板则使用动态模板页面
        if (CheckField(this.strategys) && res.TargetCode !== 'Static') {
          this.Edit = EditNew;
        }
        callBack();
      });
    },
    childFormCallBack() {
      location.reload();
    },
    scanCallBack(code) {
      this.code = code;
      this.filters.type = '5';
      this.filters.keys = code;
      this.load();
    },
    preview1(record) {
      this.$dialog(
        Preview,
        // component props
        {
          record,
        },
        // modal props
        {
          title: '申请单预览',
          width: 1000,
          centered: true,
          maskClosable: false,
          footer: '',
        },
      );
    },
    print(record) {
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
    apply(record) {
      const $this = this;
      this.$dialog(
        this.Edit,
        // component props
        {
          record,
          on: {
            ok() {},
            cancel() {},
            close() {
              setTimeout(() => {
                $this.reLoad();
              }, 100);
              $this.code = '';
            },
          },
        },
        // modal props
        {
          title: '新增申请单',
          width: 1000,
          centered: true,
          maskClosable: false,
        },
      );
    },
    add() {
      const $this = this;
      this.model = this.$dialog(
        this.Edit,
        // component props
        {
          record: { strategys: this.strategys },
          parentObj: $this,
          on: {
            ok() {
              setTimeout(() => {
                $this.load();
              }, 500);
            },
            cancel() {
              storage.remove('flag');
            },
            close() {
              storage.remove('flag');
            },
          },
        },
        // modal props
        {
          title: '新增申请单',
          width: 1000,
          centered: true,
          maskClosable: false,
          confirmLoading: this.loading,
          destroyOnClose: true,
        },
      );
    },
    addNew() {
      const $this = this;
      this.model = this.$dialog(
        EditNew,
        // component props
        {
          record: {},
          parentObj: $this,
          on: {
            ok() {
              setTimeout(() => {
                $this.load();
              }, 500);
            },
            cancel() {},
            close() {},
          },
        },
        // modal props
        {
          title: '新增申请单',
          width: 1000,
          centered: true,
          maskClosable: false,
          confirmLoading: this.loading,
          destroyOnClose: true,
        },
      );
    },
    editNew(record) {
      const $this = this;
      this.model = this.$dialog(
        EditNew,
        // component props
        {
          record,
          parentObj: $this,
          on: {
            ok() {
              setTimeout(() => {
                $this.load();
              }, 500);
            },
            cancel() {},
            close() {
              // Mark：定时提交成功一秒钟后刷新列表，防止数据未刷新
              setTimeout(() => {
                $this.load();
              }, 1000);
            },
          },
        },
        // modal props
        {
          title: '新增申请单',
          width: 1000,
          centered: true,
          maskClosable: false,
          confirmLoading: this.loading,
          destroyOnClose: true,
        },
      );
    },
    edit(record) {
      record.strategys = this.strategys;
      const $this = this;
      this.$dialog(
        this.Edit,
        // component props
        {
          record,
          editMark: 'yes',
          on: {
            ok() {
              // Mark：定时提交成功一秒钟后刷新列表，防止数据未刷新
              setTimeout(() => {
                $this.load();
              }, 1000);
            },
            cancel() {
              storage.remove('flag');
            },
            close() {
              storage.remove('flag');
              $this.getStrategyConfig();
              // Mark：定时提交成功一秒钟后刷新列表，防止数据未刷新
              setTimeout(() => {
                $this.load();
              }, 1000);
            },
          },
        },
        // modal props
        {
          title: '编辑申请单',
          width: 1000,
          centered: true,
          maskClosable: false,
          destroyOnClose: true,
        },
      );
    },
    del(record) {
      delOrder(record.Id)
        .then((res) => {
          if (res.HttpStatusCode === 200 && res.ResultType === 1) {
            PromptBox('操作成功！', 'success', 'topRight', 2);
            this.load();
          } else {
            PromptBox(res.Message, 'error', 'topRight', 2);
          }
        })
        .catch((error) => {
          PromptBox(res.Message, 'error', 'topRight', 2);
        });
    },
    search() {
      if (this.startDate > this.endDate) {
        PromptBox('结束时间不能小于开始时间', 'warning');
        return;
      }
      this.filters.startDate = CheckField(this.filters.startDate)
        ? moment(this.filters.startDate).format('YYYY-MM-DD 00:00:01')
        : null;
      this.filters.endDate = CheckField(this.filters.endDate)
        ? moment(this.filters.endDate).format('YYYY-MM-DD 23:59:59')
        : null;
      this.pagination.current = 1;
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
        // 如果是扫码查询不存在申请单信息则是新增操作
        if (CheckField(this.code) && res && res.data.length === 0) {
          PromptBox('不存在该住院号/门诊号信息', 'warning');
          this.code = '';
          this.reLoad();
          // this.apply({ 'Code': this.code, 'IsAppendApply': false })
        }
        this.data = _mainData;
        this.pagination.total = res.count;
        // LoadTableCss()
      });
    },
    reLoad() {
      this.filters = {
        keys: '',
        type: '1',
        startDate: '',
        endDate: '',
        pathologyType: '',
      };
      this.load();
    },
    handleTableChange(pagination) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.load();
    },
    toggle() {
      this.expand = !this.expand;
    },
  },
};
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
