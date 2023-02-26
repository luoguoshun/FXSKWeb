<template>
  <div>
    <div id="components-form-demo-advanced-search">
      <!-- 搜索条件 -->
      <a-row :span="24" class="a-row">
        <a-col :key="0" :span="6">
          <a-input-group compact>
            <a-select placeholder="选择类型" v-model="query.type" style="width: 30%">
              <a-select-option v-for="d in keyTypeDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
            </a-select>
            <a-input
              style="width: 65%"
              class="ant-input"
              v-model="query.keys"
              placeholder="输入关键字值"
              @keypress.13.native="search"
            />
          </a-input-group>
        </a-col>

        <a-col :key="1" :span="2">
          <a-date-picker v-model="query.startDate" placeholder="开始时间" />
        </a-col>
        <a-col :key="2" :span="2"> <a-date-picker v-model="query.endDate" placeholder="结束时间" /></a-col>
        <a-col :key="3" :span="4">
          <span style="width: 60px">送检类型</span>
          <a-select show-search placeholder="送检类型" v-model="query.pathologyType" >
            <a-select-option v-for="(d, index) in pathologyType" :key="d.value + index" :value="d.value">
              {{ d.text }}
            </a-select-option>
          </a-select>
        </a-col>
        <!-- <a-col :key="14" :span="4">
          <span>手术室</span>
          <a-select show-search optionFilterProp="children" v-model="query.department" style="width: 150px">
            <a-select-option v-for="d in departmentData" :key="d.value" :value="d.value">
              {{ d.text }}
            </a-select-option>
          </a-select>
        </a-col> -->
      </a-row>
      <!-- 操作按钮 -->
      <a-row :span="12" class="operation-row">
        <a-button type="primary" icon="search" @click="search()" style="margin-right: 10px">查询</a-button>
        <a-button type="primary" icon="plus" @click="add()" style="margin-right: 10px">新建</a-button>
        <a-button type="default" icon="reload" @click="reLoad()" style="margin-right: 10px">刷新</a-button>
      </a-row>
    </div>
    <!-- 数据表格 -->
    <a-card :bordered="false">
      <a-table
        ref="table"
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :rowKey="(record, index) => index"
        :scroll="{ x: 1500 }"
        @change="handleTableChange"
      >
        <template slot="Status" slot-scope="text">
          <span v-if="text == 0">
            <span class="ant-badge-status-dot ant-badge-status-default"></span>
            <span class="ant-badge-status-text">未提交</span>
          </span>
          <span v-if="text == 1">
            <span class="ant-badge-status-dot ant-badge-status-processing"></span>
            <span class="ant-badge-status-text">已提交</span>
          </span>
          <span v-if="text == 2">
            <span class="ant-badge-status-dot ant-badge-status-waring"></span
            ><span class="ant-badge-status-text"> 退回 </span>
          </span>
        </template>
        <template slot="Sex" slot-scope="text">
          <span v-if="text == 0" class="ant-badge-status-text" style="color: #096dd9">男</span>
          <span v-else-if="text == 1" class="ant-badge-status-text" style="color: #f198aa">女</span>
        </template>
        <template slot="PathologyCode" slot-scope="text">
          <span v-for="(d, index) in pathologyType" :key="d.value + index + ''" :value="d.value">
            <span v-if="text == d.value">{{ d.text }}</span>
          </span>
        </template>
        <template slot="Department" slot-scope="text">
          <span v-for="(d, index) in departmentData" :key="d.value + index" :value="d.value">
            <span v-if="text == d.value">{{ d.text }}</span>
          </span>
        </template>
        <template slot="Age" slot-scope="text, record">
          <span>{{ record.AgeYear }}岁{{ record.AgeMonth }}月{{ record.AgeDay }}日</span>
        </template>
        <span slot="operation" slot-scope="text, record">
          <template>
            <a @click="printSpecimenList(record)">标本列表</a>
            <a-divider type="vertical" />
            <a @click="editNew(record)">修改（新）</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确定删除数据?"
              ok-text="是"
              cancel-text="否"
              @confirm="del(record)"
              style="color: #f50"
            >
              <a type="primary" href="#">删除</a>
            </a-popconfirm>
          </template>
        </span>
        <span slot="num" slot-scope="text, record, index">
          {{ (pagination.current - 1) * pagination.pageSize + parseInt(index) + 1 }}
        </span>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import { defineComponent, message } from 'vue';
//导入接口
import { getPathologyTypes } from '@/api/system/dictionary';
import { getOrderData, delOrder } from '@/api/test/application';
import { getDepartmentData } from '@/api/basics/department';
import { getStrategyTemplate } from '@/api/system/strategy';
import moment from 'moment';
import { CheckField, JSONStringToObject, ObjectToJSONString, PromptBox } from '@/utils/util';
//导入组件
import PrintEdit from '@/views/submission/print/Edit';
import Edit2 from '@/views/submission/app/Edit2';
import AddEdit from '@/views/submission/app/Edit';
import EditNew from '@/views/submission/app/EditNew';
import { printSpecimenLabel } from '@/api/submission/precheck';
import storage from 'store';
const columns = [
  { title: '申请单号', dataIndex: 'AppNo', fixed: 'left' },
  { title: '原申请单号', dataIndex: 'OllAppOrder' },
  { title: '患者姓名', dataIndex: 'PatientName' },
  { title: '年龄', dataIndex: 'Age', scopedSlots: { customRender: 'Age' } },
  { title: '性别', dataIndex: 'Sex', scopedSlots: { customRender: 'Sex' } },
  { title: '病人ID', dataIndex: 'HisNo' },
  { title: '门诊号', dataIndex: 'OutpatientNum' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '标本数量', dataIndex: 'SpecimenTotal' },
  { title: '标本科室', dataIndex: 'SendDepartmentName' },
  { title: '送检类型', dataIndex: 'PathologyCode', scopedSlots: { customRender: 'PathologyCode' } },
  {
    title: '录入时间',
    dataIndex: 'CreatedTime',
    //生成复杂数据的渲染函数
    customRender: (val) => {
      return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '';
    },
  },
  { title: '状态', dataIndex: 'Status', key: 'Status', scopedSlots: { customRender: 'Status' } },
  { title: '操作', key: 'key', fixed: 'right', width: 180, scopedSlots: { customRender: 'operation' } },
];
export default defineComponent({
  components: {
    PrintEdit: PrintEdit,
    AddEdit: AddEdit,
    Edit2: Edit2,
    EditNew: EditNew,
  },
  data() {
    return {
      data: [],
      columns,
      AddEdit,
      //分页
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
      },
      pathologyType: [], //送检类型
      departmentData: [], //部门信息
      sendDepartmentData: [],
      keyTypeDatas: [
        { value: '1', text: '病人ID' },
        { value: '2', text: '住院号' },
        { value: '3', text: '门诊号' },
        { value: '4', text: '患者姓名' },
        { value: '5', text: '扫码' },
        { value: '6', text: '申请单号' },
        { value: '7', text: '手腕码' },
      ],
      expand: true,
      //搜索条件
      query: {
        keys: '',
        type: '1',
        startDate: '',
        endDate: '',
        pathologyType: '',
        feeIhcFlag: '',
        department: '1102060010000',
        sendDepartment: '',
      },
      strategys: {},
      loading: false,
    };
  },
  computed: {
    expandCount: function () {
      return this.expand ? 15 : 11;
    },
  },
  methods: {
    //初始化数据
    initialize() {
      //获取送检类型列表
      getPathologyTypes().then((res) => {
        if (CheckField(res)) {
          this.pathologyType = [];
          res.forEach((item) => {
            this.pathologyType.push({ text: item.Name, value: item.Content });
          });
        }
      });
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
      //获取策略模板
      getStrategyTemplate('AppList').then((res) => {
        const a = JSONStringToObject(res.Content);
        if (CheckField(a) && CheckField(a.property.IsFeeIhcFlag)) {
          this.query.IsFeeIhcFlag = a.property.IsFeeIhcFlag.visible;
        }
        if (CheckField(a) && CheckField(a.property.Department)) {
          this.query.Department = a.property.Department.visible;
        }
      });
    },
    search() {
      if (this.startDate > this.endDate) {
        message.warning('结束时间不能小于开始时间');
        return;
      }
      this.query.startDate = CheckField(this.query.startDate)
        ? moment(this.query.startDate).format('YYYY-MM-DD 00:00:01')
        : null;
      this.query.endDate = CheckField(this.query.endDate)
        ? moment(this.query.endDate).format('YYYY-MM-DD 23:59:59')
        : null;
      this.pagination.current = 1;
      this.load();
    },
    //加载数据
    load() {
      getOrderData(this.pagination, this.query).then((res) => {
        const _mainData = [];
        res.data.forEach((item, index) => {
          item.key = index + 100;
          item.SpecimenTotal = item.Specimens.length;
          _mainData.push(item);
        });
        // 如果是扫码查询不存在申请单信息则是新增操作
        if (CheckField(this.code) && res && res.data.length === 0) {
          message.warning('不存在该住院号/门诊号信息');
          this.code = '';
          this.reLoad();
        }
        this.data = _mainData;
        this.pagination.total = res.count;
      });
    },
    //重置条件
    reLoad() {
      this.query = {
        keys: '',
        type: '1',
        startDate: '',
        endDate: '',
        pathologyType: '',
        feeIhcFlag: '',
        department: '',
        sendDepartment: '',
      };
      this.load();
    },
    add() {
      const $this = this;
      this.model = this.$dialog(
        this.AddEdit,
        // component props
        {
          record: {
            strategys: this.strategys,
          },
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
    //删除申请
    del(record) {
      delOrder(record.Id)
        .then((res) => {
          if (res.HttpStatusCode === 200 && res.ResultType === 1) {
            PromptBox('操作成功！', 'success', 'topRight', 2);
            // Mark：定时提交成功一秒钟后刷新列表，防止数据未刷新
            this.load();
          } else {
            PromptBox(res.Message, 'error', 'topRight', 2);
          }
        })
        .catch((error) => {
          PromptBox(res.Message, 'error', 'topRight', 2);
        });
    },
    //页码改变的回调
    handleTableChange(pagination) {
      this.pagination['current'] = pagination.current;
      this.load();
    },
    //加载标本列表页面
    printSpecimenList(record) {
      const $this = this;
      this.$dialog(
        PrintEdit,
        // component props
        {
          record,
          //传入事件
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
  },
  created() {
    this.initialize();
    this.search();
    // 获取申请单策略
    this.getStrategyConfig(() => {
      // 当是外部链接访问，则默认打开新增窗口
      if (CheckField(storage.get('flag')) === true) {
        this.add();
      }
    });
  },
});
</script>
<style>
* {
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
  /* 元素的总高度和宽度包含内边距和边框 */
}

#components-form-demo-advanced-search > .a-row {
  margin-bottom: 10px;
}
.operation-row {
  display: flex;
  flex-direction: row-reverse;
}
</style>
