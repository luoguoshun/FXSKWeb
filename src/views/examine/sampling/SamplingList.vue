<template>
    <div id="Sampling">
      <div class="left-div">
        <a-row :span="24" class="a-row">
          <a-col :key="1" :span="12">
            <strong style="width: 60px"> 病理号</strong>
            <a-input v-model="mrCode" placeholder="病理号" style="width: 80%"></a-input>
          </a-col>
          <a-col :key="2" :span="12">
            <strong style="width: 60px"> 材料状态</strong>
            <a-select show-search placeholder="材料状态" v-model="sampledFlag" style="width: 80%">
              <a-select-option value="4"> 所有 </a-select-option>
              <a-select-option value="3"> 待取材 </a-select-option>
              <a-select-option value="2"> 已取材 </a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row :span="24" class="a-row">
          <a-col :key="3" :span="12"
            ><strong style="width: 60px"> 送检时间</strong>
            <a-range-picker show-time format="YYYY/MM/DD HH:mm:ss" v-model="appTimes" style="width: 80%" />
          </a-col>
          <a-col :key="4" :span="12">
            <strong style="width: 60px"> 送检类型</strong>
            <a-select show-search placeholder="送检类型" v-model="pathologyCode" style="width: 80%">
              <a-select-option v-for="(d, index) in pathologyTypes" :key="d.value + index" :value="d.value">
                {{ d.text }}
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <!-- 数据表格 -->
        <a-table ref="tableData" size="small" :columns="columns" :data-source="samplingData" :rowKey="(record, index) => record.Id" :scroll="{ x: 1500 }" bordered>
          <template slot="Status" slot-scope="text">
            <a-tag :color="getStatusTabColor(text)['color']"> {{ getStatusTabColor(text)['text'] }} </a-tag>
          </template>
        </a-table>
      </div>
      <div class="rigth-div"></div>
    </div>
</template>

<script>
import { getSamplingInfoList } from '@/api/examine/sampling';
//导入接口
import { getPathologyTypes } from '@/api/system/dictionary';
import { getDepartmentData } from '@/api/basics/department';
import { getCheckPartData } from '@/api/basics/checkpart';
//导入工具类
import moment from 'moment';
import enums from '@/store/enum/enum';
import { CheckField, RandomString, PromptBox, StringToTime } from '@/utils/util';

const columns = [
  { title: '病理号', dataIndex: 'MrCode', width: 80 },
  { title: '患者姓名', dataIndex: 'PatientName', width: 80 },
  { title: '送检类型', dataIndex: 'PathologyClass', width: 80, scopedSlots: { customRender: 'PathologyCode' } },
  {
    title: '接收时间',
    dataIndex: 'ReceivedTime',
    width: 80,
    //生成复杂数据的渲染函数
    customRender: (val) => {
      return val ? moment(val).format('YYYY-MM-DD') : '';
    },
  },
  {
    title: '取材时间',
    dataIndex: 'SamplingTime',
    width: 80,
    //生成复杂数据的渲染函数
    customRender: (val) => {
      return val ? moment(val).format('YYYY-MM-DD') : '';
    },
  },
  { title: '状态', dataIndex: 'Status', width: 80, key: 'Status', scopedSlots: { customRender: 'Status' } },
];
export default {
  components: {},
  data() {
    return {
      columns: columns,
      DoctorData: enums.DoctorData, //医生信息
      pathologyTypes: [], //检查类型
      sendDepartmentData: [], //科室信息
      partType: [], //检查部位信息
      samplingData: [], //
      mrCode: '',
      sampledFlag: '', //
      pathologyCode: '', //送检类型
      appTimes: [], //接收时间范围
    };
  },
  //计算属性
  computed: {
    startReceiveTime: function () {
      return this.appTimes ? moment(this.appTimes[0]).format('YYYY-MM-DD HH:mm:ss') : null;
    },
    endReceiveTime: function () {
      return this.appTimes ? moment(this.appTimes[1]).format('YYYY-MM-DD HH:mm:ss') : null;
    },
  },
  methods: {
    moment,
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
            if (index > 20) {
              return;
            }
            if (result == -1) {
              this.departmentData.push(obj);
            }
          });
        }
      });
      //获取检查部位列表
      getCheckPartData().then((res) => {
        res.data.forEach((item) => {
          if (item.ParentId !== 0) {
            this.partType.push({ value: item.Id.toString(), text: item.Content });
          }
        });
      });
    },
    //加载数据
    load() {
      getSamplingInfoList(this.mrCode, this.sampledFlag, this.startReceiveTime, this.endReceiveTime, this.pathologyCode).then((result) => {
        this.samplingData = result;
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
#Sampling {
  display: flex;
  flex-direction: row;
  .left-div {
    // width: 300px;
    height: 200px;
    flex: 2;
    border: 1px solid black;
  }
  .rigth-div {
    flex: 4;
    border: 1px solid rgb(228, 18, 18);
  }
}
</style>
