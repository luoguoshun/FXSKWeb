<template>
  <a-card :bordered="false" id="appListNew">
    <a-row :span="24" class="a-row">
      <a-col :key="1" :span="6">
        <strong style="width: 60px"> 送检类型</strong>
        <a-select show-search placeholder="送检类型" v-model="queryForm.pathologyCode" style="width: 80%">
          <a-select-option v-for="(d, index) in pathologyTypes" :key="d.value + index" :value="d.value">
            {{ d.text }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :key="2" :span="6">
        <strong style="width: 60px"> 送检时间</strong>
        <a-range-picker show-time format="YYYY/MM/DD HH:mm:ss" v-model="queryForm.appTimes" @change="pickerOnChange" style="width: 80%"
      /></a-col>
    </a-row>
    <div class="space"></div>
    <a-row :span="24" class="a-row">
      <a-col :key="3" :span="6">
        <strong style="width: 60px"> 患者姓名</strong>
        <a-input v-model="queryForm.patientName" placeholder="患者姓名" style="width: 80%"></a-input>
      </a-col>
      <a-col :key="4" :span="6">
        <strong style="width: 60px"> 病理号</strong>
        <a-input v-model="queryForm.mrCode" placeholder="病理号" style="width: 80%"></a-input>
      </a-col>
      <a-col :key="5" :span="6">
        <strong style="width: 60px"> 患者Id</strong>
        <a-input v-model="queryForm.patienId" placeholder="患者id" style="width: 80%"></a-input>
      </a-col>
      <a-col :key="6" :span="6">
        <strong style="width: 60px"> 送检医院</strong>
        <a-select style="width: 80%;" v-model="queryForm.hospital">
          <a-select-option v-for="(d, index) in HospitalData" :key="d.value + index" :value="d.value">
            {{ d.text }}
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <div class="space"></div>
    <a-row :span="24" class="edit-bar">
      <a-button type="primary" icon="search" @click="search()" style="margin-right: 10px">查询</a-button>
      <a-button type="default" icon="reload" @click="reLoad()" style="margin-right: 10px">重置</a-button>
      <a-button type="primary" icon="plus" @click="add()" style="margin-right: 10px">新建</a-button>
      <a-button type="primary" icon="plus" @click="receive()" style="margin-right: 10px">接收</a-button>
    </a-row>
    <!-- 数据表格 -->
    <a-card :bordered="false">
      <a-table
        ref="tableData"
        :columns="columns"
        :data-source="tableData"
        :pagination="pagination"
        :rowKey="(record, index) => record.Id"
        :scroll="{ x: 1500 }"
        bordered
        @change="handleTableChange"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <template slot="Status" slot-scope="text">
          <a-tag :color="getStatusTabColor(text)['color']"> {{ getStatusTabColor(text)['text'] }} </a-tag>
        </template>
        <template slot="Sex" slot-scope="text">
          <span v-if="text == 0" class="ant-badge-status-text" style="color: #096dd9">男</span>
          <span v-else-if="text == 1" class="ant-badge-status-text" style="color: #f198aa">女</span>
        </template>
        <template slot="Department" slot-scope="text">
          <span v-for="(d, index) in departmentData" :key="d.value + index" :value="d.value">
            <span v-if="text == d.value">{{ d.text }}</span>
          </span>
        </template>
        <span slot="operation" slot-scope="text, record">
          <template>
            <a @click="printSpecimenList(record)">标本列表</a>
            <!-- <a-divider type="vertical" />
            <a @click="editNew(record)">修改（新）</a>
            <a-divider type="vertical" /> -->
            <!-- <a-popconfirm title="确定删除数据?" ok-text="是" cancel-text="否" @confirm="del(record)" style="color: #f50">
              <a type="primary" href="#">删除</a>
            </a-popconfirm> -->
          </template>
        </span>
        <span slot="num" slot-scope="text, record, index">
          {{ (pagination.current - 1) * pagination.pageSize + parseInt(index) + 1 }}
        </span>
      </a-table>
    </a-card>
  </a-card>
</template>

<script>
//导入接口
import { getPathologyTypes } from '@/api/system/dictionary';
import { getDepartmentData } from '@/api/basics/department';
import { getMedicalRecordList, receiveMedicalRecord } from '@/api/examine/application';
//导入工具类
import moment from 'moment';
import { CheckField, PromptBox } from '@/utils/util';
import enums from '@/store/enum/enum';
//导入组件
import specimenList from '@/views/examine/components/specimenList';
import appMR from '@/views/examine/components/appMR';
const columns = [
  { title: '病理号', dataIndex: 'MrCode' },
  { title: '原病理号', dataIndex: 'SrcMrCode' },
  { title: '患者姓名', dataIndex: 'PatientName' },
  { title: '年龄', dataIndex: 'Age', scopedSlots: { customRender: 'Age' } },
  { title: '性别', dataIndex: 'Sex', scopedSlots: { customRender: 'Sex' } },
  { title: '病人ID', dataIndex: 'PatientID' },
  { title: '送检医院', dataIndex: 'Hospital' },
  { title: '门诊号', dataIndex: 'OutpatientNum' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '送检医生', dataIndex: 'SendDoctorName' },
  { title: '送检类型', dataIndex: 'PathologyClass', scopedSlots: { customRender: 'PathologyCode' } },
  {
    title: '录入时间',
    dataIndex: 'CreatedTime',
    width: 200,
    //生成复杂数据的渲染函数
    customRender: (val) => {
      return val ? moment(val).format('YYYY-MM-DD') : '';
    },
  },
  { title: '状态', dataIndex: 'Status', key: 'Status', scopedSlots: { customRender: 'Status' } },
  { title: '操作', key: 'key', fixed: 'right', width: 120, scopedSlots: { customRender: 'operation' } },
];
export default {
  components: {
    specimenList: specimenList,
    appMR: appMR,
  },
  data() {
    return {
      columns,
      tableData: [],
      //分页
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
      },
      queryForm: {
        mrCode: '',
        pathologyCode: '',
        patientName: '',
        patienId: '',
        hospital: '',
        appTimes: [],
      },
      pathologyTypes: [], //送检类型
      departmentData: [], //科室信息
      selectedRowKeys: [],
      selectedRows: [],
      HospitalData: enums.HospitalData,
    };
  },
  mounted() {},
  methods: {
    //初始化数据
    initialize() {
      //获取送检类型列表
      getPathologyTypes().then((res) => {
        if (CheckField(res)) {
          this.getPathologyTypes = [];
          res.forEach((item) => {
            this.pathologyTypes.push({ text: item.Name, value: item.Content });
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
    },
    pickerOnChange(value) {
      console.log(moment(value[0]['_d']));
      console.log(moment(value[1]['_d']));
    },
    //加载数据
    load() {
      const queryParameters = {
        ...this.queryForm,
        page: this.pagination.current,
        row: this.pagination.pageSize,
      };
      getMedicalRecordList(queryParameters).then((res) => {
        this.tableData = res.data;
        this.pagination.total = res.count;
      });
    },
    //根据病理单状态获取相应的他把标签颜色
    getStatusTabColor(value) {
      switch (value) {
        case 0:
          return {
            color: 'blue',
            text: '保存',
          };
        case 1:
          return {
            color: 'green',
            text: '已接收',
          };
        case 2:
          return {
            color: 'pink',
            text: '已撤销',
          };
        case 3:
          return {
            color: 'cyan',
            text: '已暂停',
          };
        case 4:
          return {
            color: 'red',
            text: '已拒收',
          };
        case 5:
          return {
            color: 'red',
            text: '已删除',
          };
        case 6:
          return {
            color: 'orange',
            text: '已废弃',
          };
        case 7:
          return {
            color: 'purple',
            text: '已隐藏',
          };
        case 8:
          return {
            color: 'blue',
            text: '旧系统导入的数据',
          };
        default:
          return '';
      }
    },
    //查找数据
    search() {
      this.load();
    },
    reLoad() {
      this.queryForm.mrCode = '';
      this.pathologyCode = '';
      this.patientName = '';
      this.patienId = '';
      this.hospital = '';
      this.appTimes = [];
      this.load();
    },
    //加载标本列表页面
    printSpecimenList(record) {
      const $this = this;
      this.$dialog(
        specimenList,
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
    //页码改变的回调
    handleTableChange(pagination) {
      this.pagination['current'] = pagination.current;
      this.load();
    },
    //打开新建模态框
    add() {
      const $this = this;
      this.$dialog(
        appMR, //component
        {
          //event handler
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
          title: '病例详情',
          width: '80%',
          top: '10px',
          centered: true,
          maskClosable: false,
          dialogClass: 'printModel',
          footer: '',
          bodyStyle: {
            height: '800px',
            width: '100%',
          },
          dialogStyle: {
            top: '20px',
          },
        },
      );
    },
    //选中数据
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRows = [];
      for (const iterator of selectedRows) {
        this.selectedRows.push({ Id: iterator.Id, Status: iterator.Status });
      }
      this.selectedRowKeys = selectedRowKeys;
    },
    receive() {
      if (this.selectedRowKeys.length == 0) {
        PromptBox('请选择病理单', 'warning');
        return;
      }
      let isOk = false;
      this.selectedRows.forEach((item) => {
        if (item.Status != 0) {
          isOk = true;
          return;
        }
      });
      if (isOk) {
        PromptBox('请选择保存的病理单', 'warning');
        return;
      }
      receiveMedicalRecord(this.selectedRowKeys).then((res) => {
        const { ResultType, HttpStatusCode, Message } = res;
        if (ResultType == 0) {
          PromptBox(Message, 'warning', 'topRight', 2);
        } else if (ResultType == 1) {
          PromptBox(Message, 'success', 'topRight', 2);
          this.reLoad();
        } else if (ResultType == 2) {
          PromptBox(Message, 'error', 'topRight', 2);
        }
      });
    },
  },
  created() {
    this.initialize();
    this.load();
  },
};
</script>

<style lang="less" scoped>
#appListNew {
  .space {
    height: 15px;
  }
}
</style>
