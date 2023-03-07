<template>
  <a-card :bordered="false" id="Sampling">
    <a-row :span="24" class="a-row">
      <a-col :key="1" :span="6">
        <strong style="width: 60px"> 病理号</strong>
        <a-input v-model="mrCode" placeholder="病理号" style="width: 80%"></a-input>
      </a-col>
      <a-col :key="2" :span="6">
        <strong style="width: 60px"> 材料状态</strong>
        <a-select show-search placeholder="材料状态" v-model="sampledFlag" style="width: 80%">
          <a-select-option value="4"> 所有 </a-select-option>
          <a-select-option value="3"> 待取材 </a-select-option>
          <a-select-option value="2"> 已取材 </a-select-option>
        </a-select>
      </a-col>
      <a-col :key="3" :span="6">
        <strong style="width: 60px"> 送检时间</strong>
        <a-range-picker show-time format="YYYY-MM-DD HH:mm:ss" v-model="appTimes" style="width: 80%" />
      </a-col>
      <a-col :key="4" :span="6">
        <strong style="width: 60px"> 送检类型</strong>
        <a-select show-search placeholder="送检类型" v-model="pathologyCode" style="width: 80%">
          <a-select-option v-for="(d, index) in pathologyTypes" :key="d.value + index" :value="d.value">
            {{ d.text }}
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <div class="space"></div>
    <a-row :span="24" class="a-row">
      <a-button type="primary" icon="search" @click="search()" style="margin-right: 10px">查询</a-button>
      <a-button type="default" icon="reload" @click="reLoad()" style="margin-right: 10px">重置</a-button>
    </a-row>
    <div class="space"></div>
    <!-- 标本数据表格 -->
    <a-table
      ref="tableData"
      size="small"
      :columns="columns"
      :data-source="samplingData"
      :rowKey="(record, index) => record.key"
      :scroll="{ x: 1500 }"
      bordered
      :pagination="false"
    >
      <template slot="SampledFlag" slot-scope="text">
        <a-tag :color="getStatusTabColor(text)['color']"> {{ getStatusTabColor(text)['text'] }} </a-tag>
      </template>
      <template slot="PathologyCode" slot-scope="text">
        <span v-for="d in pathologyTypes" :key="d.value">
          <span v-if="text == d.value">{{ d.text }}</span>
        </span>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-button type="primary" ghost @click="getDetail(text, record)" size="small"> 详情 </a-button>
      </template>
    </a-table>
    <!-- 信息抽屉 -->
    <a-drawer title="详细信息" :width="900" :visible="visible" @close="drawerOnClose">
      <a-row :span="24" class="a-row">
        <a-button type="primary" size="small" @click="saveSamplingTask('Save')" style="margin-right: 10px"> 保存 </a-button>
        <a-button type="primary" size="small" @click="saveSamplingTask('Confirm')" :disabled="samplingTask.SampledFlag == '2' ? true : false">
          确认取材
        </a-button>
      </a-row>
      <a-row :span="24" class="a-row">
        <a-col :key="10" :span="8" style="display: flex; flex-direction: column" class="col-action">
          <strong> 取材医生</strong>
          <a-select v-model="samplingTask.SamplingDoctorId" style="width: 80%" @change="(value) => onSelectionchange(value, 'SamplingDoctorId')">
            <a-select-option v-for="(d, index) in DoctorData" :key="d.DoctorId + index + 'D'" :value="d.Id">
              {{ d.DoctorName }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :key="11" :span="8" style="display: flex; flex-direction: column" class="col-action">
          <strong> 描写医生</strong>
          <a-select v-model="samplingTask.WritingDoctorId" style="width: 80%" @change="(value) => onSelectionchange(value, 'WritingDoctorId')">
            <a-select-option v-for="(d, index) in DoctorData" :key="d.DoctorId + index + 'C'" :value="d.Id">
              {{ d.DoctorName }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row :span="24" class="a-row">
        <a-col :key="12" :span="8" class="col-action">
          <strong> 描写带教老师</strong>
          <a-select v-model="samplingTask.TeacherIdWriting" style="width: 80%" @change="(value) => onSelectionchange(value, 'TeacherIdWriting')">
            <a-select-option v-for="(d, index) in DoctorData" :key="d.DoctorId + index + 'B'" :value="d.Id">
              {{ d.DoctorName }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :key="13" :span="8" class="col-action">
          <strong> 取材带教老师</strong>
          <a-select v-model="samplingTask.TeacherId" style="width: 80%" @change="(value) => onSelectionchange(value, 'TeacherId')">
            <a-select-option v-for="(d, index) in DoctorData" :key="d.DoctorId + index + 'A'" :value="d.Id">
              {{ d.DoctorName }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <!-- 信息描写 -->
      <a-descriptions layout="horizontal" :column="5" style="margin-top: 10px">
        <a-descriptions-item label="送检类型">
          <strong>{{ medicalRecord.PathologyClass }}</strong>
        </a-descriptions-item>
        <a-descriptions-item label="病理号">
          <strong>{{ medicalRecord.MrCode }}</strong>
        </a-descriptions-item>
        <a-descriptions-item label="患者姓名">
          <strong>{{ medicalRecord.PatientName }}</strong>
        </a-descriptions-item>
        <a-descriptions-item label="性别">
          <strong>{{ medicalRecord.Sex == '1' ? '男' : '女' }}</strong>
        </a-descriptions-item>
        <a-descriptions-item label="传染源">
          <strong>{{ medicalRecord.ContagionFlag == '1' ? '是' : '否' }}</strong>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions layout="horizontal" :column="5">
        <a-descriptions-item label="患者ID">
          <strong>{{ medicalRecord.ParentId }}</strong>
        </a-descriptions-item>
        <a-descriptions-item label="送检医生">
          <strong>{{ medicalRecord.SendDoctorName }}</strong>
        </a-descriptions-item>
        <a-descriptions-item label="院区">
          <strong>{{ medicalRecord.HospitalArea }}</strong>
        </a-descriptions-item>
        <a-descriptions-item label="送检科室">
          <strong>{{ medicalRecord.DeptName }}</strong>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions layout="horizontal" :column="3">
        <a-descriptions-item label="门诊号">
          <strong>{{ medicalRecord.OutpatientNo }}</strong>
        </a-descriptions-item>
        <a-descriptions-item label="送检时间">
          <strong>{{ moment(medicalRecord.SendTime).format('YYYY-MM-DD HH:mm:ss') }}</strong>
        </a-descriptions-item>
        <a-descriptions-item label="接收时间">
          <strong>{{ moment(medicalRecord.ReceivedTime).format('YYYY-MM-DD HH:mm:ss') }}</strong>
        </a-descriptions-item>
      </a-descriptions>
      <!-- 标本信息 -->
      <a-table :columns="SpecimenColumns" :data-source="specimenData" bordered :pagination="false" size="small" :customRow="handleClickRow">
        <template slot="SamplingInfo" slot-scope="text, record">
          <a-input :value="text" @change="(e) => handleChange(e, record, 'SamplingInfo')" />
        </template>
      </a-table>
      <div class="space"></div>
      <!-- 操作 -->
      <a-row :span="24" style="margin-top: 10px">
        <a-col :key="14" :span="4" class="col-action">
          <strong> 标本名称</strong>
          <a-select placeholder="" v-model="specimenId" style="width: 100%" @change="specimenOnchange">
            <a-select-option v-for="(d, index) in specimenData" :key="d.SpecimenName + index + 'A'" :value="d.Id">
              {{ d.SpecimenName }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :key="15" :span="2" class="col-action">
          <strong>字母</strong>
          <a-select placeholder="" v-model="wordSequenceNumber" style="width: 100%">
            <a-select-option value="A">A</a-select-option>
            <a-select-option value="B">B</a-select-option>
            <a-select-option value="C">C</a-select-option>
          </a-select>
        </a-col>
        <a-col :key="16" :span="2" class="col-action">
          <strong>起始号</strong>
          <a-input-number :min="1" :max="10" v-model="startNumber" style="width: 100%" />
        </a-col>
        <a-col :key="17" :span="4" class="col-action">
          <strong>数量</strong>
          <a-input-number :min="1" :max="10" v-model="amount" style="width: 100%" />
        </a-col>
        <a-col :key="18" :span="4" class="col-action">
          <strong>打印通道</strong>
          <a-select placeholder="" v-model="printChannel" style="width: 100%">
            <a-select-option value="default">默认通道</a-select-option>
            <a-select-option value="Channel1">通道一</a-select-option>
            <a-select-option value="Channel2">通道二</a-select-option>
            <a-select-option value="Channel3">通道三</a-select-option>
          </a-select>
        </a-col>
        <a-col :key="19" :span="4" style="padding: 25px 0px 0px 5px">
          <a-button type="primary" ghost @click="generateBox()" size="small" :disabled="samplingTask.SampledFlag == '2' ? true : false">
            生成
          </a-button>
          <a-button type="danger" ghost @click="deleteBox()" size="small" :disabled="samplingTask.SampledFlag == '2' ? true : false"> 删除 </a-button>
        </a-col>
      </a-row>
      <!-- 包埋盒信息信息 -->
      <a-table
        :columns="BoxColumns"
        :data-source="boxData"
        bordered
        :pagination="false"
        size="small"
        :rowKey="(record, index) => record.SonCode"
        :row-selection="{ selectedRowKeys: selectedBoxRowKeys, onChange: onSelectBoxChange }"
      >
        <template slot="SpecimenDesc" slot-scope="text, record">
          <a-input :value="text" @change="(e) => handleChange(e, record, 'SpecimenDesc')" />
        </template>
        <template slot="Remark" slot-scope="text, record">
          <a-input :value="text" @change="(e) => handleChange(e, record, 'Remark')" />
        </template>
        <template slot="IsTuoGai" slot-scope="text, record">
          <a-checkbox-group @change="(e) => handleChange(e, record, 'IsTuoGai')">
            <a-checkbox :value="0" name="type"> 脱钙 </a-checkbox>
          </a-checkbox-group>
        </template>
        <template slot="MaterialQuantity" slot-scope="text, record">
          <a-input-number :value="text" :min="1" :max="9999" @change="(e) => handleChange(e, record, 'MaterialQuantity')" />
        </template>
      </a-table>
    </a-drawer>
  </a-card>
</template>

<script>

import { getSamplingInfoList, createBoxs, getBoxListBySepecimenId, saveSamplingTask, deleteBoxs } from '@/api/examine/sampling';
//导入接口
import { getPathologyTypes } from '@/api/system/dictionary';
import { getDepartmentData } from '@/api/basics/department';
import { getCheckPartData } from '@/api/basics/checkpart';
import { getSpecimensByMrId } from '@/api/examine/application';
//导入工具类
import moment from 'moment';
import enums from '@/store/enum/enum';
import { CheckField, RandomString, PromptBox, StringToTime, TimeToString } from '@/utils/util';

const columns = [
  { title: '病理号', dataIndex: 'MrCode', width: 80 },
  { title: '患者姓名', dataIndex: 'PatientName', width: 80 },
  { title: '送检类型', dataIndex: 'PathologyCode', width: 80, scopedSlots: { customRender: 'PathologyCode' } },
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
  { title: '状态', dataIndex: 'SampledFlag', width: 80, scopedSlots: { customRender: 'SampledFlag' } },
  { title: '操作', key: 'key', fixed: 'right', width: 120, scopedSlots: { customRender: 'operation' } },
];
const SpecimenColumns = [
  { title: '排序', width: 50, dataIndex: 'SortOrder' },
  { title: '标本名称', dataIndex: 'SpecimenName' },
  // { title: '标本类型', dataIndex: 'SpecimenType', width: 140, scopedSlots: { customRender: 'SpecimenType' } },
  { title: '是否规范固定', dataIndex: 'FixedFlag', scopedSlots: { customRender: 'FixedFlag' } },
  { title: '肉眼可见', dataIndex: 'SamplingInfo', scopedSlots: { customRender: 'SamplingInfo' } },
];
const BoxColumns = [
  { title: '标本编号', width: 80, dataIndex: 'SpecimenId' },
  { title: '标本名称', dataIndex: 'SpecimenName' },
  { title: '标本描述', dataIndex: 'SpecimenDesc', width: 140, scopedSlots: { customRender: 'SpecimenDesc' } },
  { title: '子号', dataIndex: 'SonCode' },
  { title: '备注', dataIndex: 'Remark', scopedSlots: { customRender: 'Remark' } },
  { title: '脱钙', dataIndex: 'IsTuoGai', scopedSlots: { customRender: 'IsTuoGai' } },
  { title: '块材数', dataIndex: 'MaterialQuantity', scopedSlots: { customRender: 'MaterialQuantity' } },
];

export default {
  components: {},
  data() {
    return {
      columns: columns,
      SpecimenColumns: SpecimenColumns,
      BoxColumns: BoxColumns,
      DoctorData: enums.DoctorData, //医生信息
      pathologyTypes: [], //检查类型
      sendDepartmentData: [], //科室信息
      partType: [], //检查部位信息
      samplingData: [], //
      mrCode: '',
      sampledFlag: '4', //
      pathologyCode: '', //送检类型
      appTimes: [], //接收时间范围
      visible: false,
      //病理记录的详细信息
      medicalRecord: {
        MrCode: '',
        PatientName: '',
        Age: 0, //岁1
        Sex: '',
        PathologyClass: '', //送检类型1
        PathologyCode: '', //送检类型编码1
        ClinicalDiagnosis: '', //临床诊断1
        PatientID: '', //患者ID1
        SendDoctorCode: '', //送检医生编码
        SendDoctorName: '', //送检医生
        AdmissionNo: '', //住院号1
        HospitalArea: '', //院区1
        ReceivedTime: '', //接收时间
        DeptCode: '', //送检科室编号1
        DeptName: '', //送检科室名称1
        SendTime: '', //发送时间
        ContagionFlag: '', //传染源
        OutpatientNo: '', //门诊号1
      },
      specimenData: [],
      samplingTask: {
        SamplingTaskId: '', //取材任务编号
        MrId: '', //病理单编号
        WorkflowId: 0, //流程ID
        SamplingDoctorId: '', //取材医生ID
        SamplingDoctor: '', //取材医生
        SamplingTime: null, //取材时间
        WritingDoctorId: '', //描写医生ID
        WritingDoctorName: '', //描写医生
        TeacherId: '', // 取材带教老师ID
        TeacherName: '', // 取材带教老师
        TeacherIdWriting: '', //描写带教老师Id
        TeacherNameWriting: '', //描写带教老师
      },
      specimenId: '',
      specimenName: '',
      wordSequenceNumber: 'A', //包埋盒字号开头字母
      startNumber: 1, //起始号
      amount: 1, //数量
      printChannel: '', //打印通道
      boxData: [], //包埋盒数据
      selectedBoxRowKeys: [],
      selectedBoxRows: [],
    };
  },
  //计算属性
  computed: {
    startReceiveTime: function () {
      return this.appTimes.length != 0 ? moment(this.appTimes[0]).format('YYYY-MM-DD HH:mm:ss') : null;
    },
    endReceiveTime: function () {
      return this.appTimes.length != 0 ? moment(this.appTimes[1]).format('YYYY-MM-DD HH:mm:ss') : null;
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
    /**
     * @description: 加载数据
     * @return {*}
     */
    load() {
      getSamplingInfoList(this.mrCode, this.sampledFlag, this.startReceiveTime, this.endReceiveTime, this.pathologyCode).then((result) => {
        const _mainData = [];
        result.data.forEach((item, index) => {
          //设置每一条记录的key值
          let isOnly = true;
          let key = '';
          do {
            key = RandomString(32);
            const sampling = this.samplingData.filter((w) => w.key === key);
            if (sampling.length !== 0) {
              isOnly = false;
            }
          } while (isOnly === false);
          item.key = key;
          _mainData.push(item);
        });
        this.samplingData = _mainData;
      });
    },
    /**
     * @description: 根据病例Id加载标本列表
     * @return {*}
     * @param {*} MrId 病例Id
     */
    LoadSpecimens(MrId) {
      this.specimenData = [];
      if (MrId === undefined) {
        return;
      }
      getSpecimensByMrId(MrId).then((res) => {
        const _mainData = [];
        res.forEach((item, index) => {
          //设置每一条记录的key值
          let isOnly = true;
          let key = '';
          do {
            key = RandomString(32);
            const specimen = this.specimenData.filter((w) => w.key === key);
            if (specimen.length !== 0) {
              isOnly = false;
            }
          } while (isOnly === false);
          item.key = key;
          _mainData.push(item);
        });
        this.specimenData = _mainData;
      });
    },
    /**
     * @description: 根据条件搜索
     * @return {*}
     */
    search() {
      if (this.startReceiveTime > this.endReceiveTime) {
        PromptBox('结束时间不能小于开始时间', 'warning');
        return;
      }
      this.load();
    },
    /**
     * @description: 重置条件
     * @return {*}
     */
    reLoad() {
      this.mrCode = '';
      this.sampledFlag = '';
      this.pathologyCode = '';
      this.appTimes = [];
      this.load();
    },
    /**
     * @description: 根据任务单获取相应的Tab标签颜色
     * @return {*}
     * @param {*} value 任务单的状态
     */
    getStatusTabColor(value) {
      switch (value) {
        case '2':
          return {
            color: 'green',
            text: '已取材',
          };
        default:
          return {
            color: 'orange',
            text: '待取材',
          };
      }
    },
    /**
     * @description: 打开病理详情框
     * @return {*}
     * @param {*} text
     * @param {*} record 点击行数据
     */
    getDetail(text, record) {
      //初始化数据
      this.medicalRecord.MrId = record.MrId;
      this.medicalRecord.MrCode = record.MrCode;
      this.medicalRecord.ContagionFlag = record.ContagionFlag;
      this.medicalRecord.PatientName = record.PatientName;
      this.medicalRecord.Age = record.Age; //岁1
      this.medicalRecord.Sex = record.Sex; //性别1
      this.medicalRecord.PathologyClass = record.PathologyClass; //送检类型1
      this.medicalRecord.PathologyCode = record.PathologyCode; //送检类型编码1
      this.medicalRecord.ClinicalDiagnosis = record.ClinicalDiagnosis; //临床诊断1
      this.medicalRecord.PatientID = record.PatientID; //患者ID1
      this.medicalRecord.SendDoctorCode = record.SendDoctorCode; //送检医生编码
      this.medicalRecord.SendDoctorName = record.SendDoctorName; //送检医生
      this.medicalRecord.AdmissionNo = record.AdmissionNo; //住院号1
      this.medicalRecord.OutpatientNo = record.OutpatientNo; //院区1
      this.medicalRecord.HospitalArea = record.HospitalArea; //
      this.medicalRecord.ReceivedTime = record.ReceivedTime; //接收时间
      this.medicalRecord.DeptCode = record.DeptCode; //送检科室编号1
      this.medicalRecord.DeptName = record.DeptName; //送检科室名称1
      this.medicalRecord.SendTime = record.SendTime; //发送时间
      this.samplingTask.MrId = record.MrId;
      this.samplingTask.SamplingTaskId = record.SamplingTaskId;
      this.samplingTask.SampledFlag = record.SampledFlag;
      this.samplingTask.SamplingDoctorId = record.SamplingDoctorId;
      this.samplingTask.WritingDoctorId = record.WritingDoctorId;
      this.samplingTask.TeacherId = record.TeacherId;
      this.samplingTask.TeacherIdWriting = record.TeacherIdWriting;
      this.samplingTask.SamplingDoctor = record.SamplingDoctor;
      this.samplingTask.WritingDoctor = record.WritingDoctor;
      this.samplingTask.TeacherName = record.TeacherName;
      this.samplingTask.TeacherNameWriting = record.TeacherNameWriting;
      this.boxData = [];
      this.specimenId = '';
      this.specimenName = '';
      this.LoadSpecimens(record.MrId);
      this.visible = true;
    },
    //关闭抽屉
    drawerOnClose() {
      this.visible = false;
    },
    /**
     * @description: 医生下拉框的数据改变时。获取医生相应的名字
     * @return {*}
     * @param {*} value 回调值
     * @param {*} type 医生类别
     */
    onSelectionchange(value, type) {
      let name = '';
      this.DoctorData.forEach((item) => {
        if (item['Id'] == value) {
          name = item['DoctorName'];
          return;
        }
      });
      console.log(name);
      switch (type) {
        //取材医生
        case 'SamplingDoctorId':
          this.samplingTask.SamplingDoctor = name;
          break;
        //描写医生
        case 'WritingDoctorId':
          this.samplingTask.WritingDoctorName = name;
          break;
        //描写带教老师
        case 'TeacherIdWriting':
          this.samplingTask.TeacherNameWriting = name;
          break;
        //取材带教老师
        case 'TeacherId':
          // this.samplingTask.TeacherId = parseInt(this.samplingTask.TeacherId);
          this.samplingTask.TeacherName = name;
          break;
      }
    },
    /**
     * @description: 描写和取材保存、确认功能
     * @return {*}
     * @param {*} operateType Save为确认 Confirm 为取材
     */
    saveSamplingTask(operateType) {
      saveSamplingTask(this.samplingTask, this.specimenData, this.boxData, operateType).then((result) => {
        const { ResultType, HttpStatusCode, Message } = result;
        if (ResultType == 1 && HttpStatusCode == 200) {
          PromptBox(Message, 'success');
          this.load();
          return;
        }
        PromptBox(Message, 'error');
      });
    },
    /**
     * @description: 表中可编辑行的数据改变时操作
     * @return {*}
     * @param {*} e input表单为 事件 CheckBox input-Number为返回值
     * @param {*} record 当前行的数据
     * @param {*} key 键值
     */
    handleChange(e, record, key) {
      switch (key) {
        case 'SamplingInfo':
          record[key] = e.target.value;
          break;
        case 'SpecimenDesc':
          record[key] = e.target.value;
          break;
        case 'Remark':
          record[key] = e.target.value;
          break;
        case 'IsTuoGai':
          record[key] = e.length > 0 ? '1' : '0';
          break;
        case 'MaterialQuantity':
          record[key] = e;
          break;
        default:
          break;
      }
    },
    /**
     * @description: 点击标本数据获取到相应的包埋盒
     * @return {*}
     * @param {*} record 当前行的数据
     * @param {*} index 点击行的索引
     **/
    handleClickRow(record, index) {
      return {
        on: {
          click: () => {
            this.specimenId = record.Id;
            this.specimenName = record.SpecimenName;
            this.loadBoxListBySepecimenId(this.specimenId, this.medicalRecord.MrCode);
          },
        },
      };
    },
    specimenOnchange() {
      this.specimenData.forEach((item) => {
        if (item.Id == this.specimenId) {
          this.specimenName = item.SpecimenName;
          return;
        }
      });
    },
    //生成包埋盒
    generateBox() {
      if (this.specimenId == null || this.specimenId == '') {
        PromptBox('请选择标本', 'warning');
        return;
      }
      if (this.amount == 0 || this.amount == '') {
        PromptBox('请选择包埋盒数量', 'warning');
        return;
      }
      //添加到包埋盒数组中
      for (let i = 1; i <= this.amount; i++) {
        const SonCode = this.createSonCode(i);
        const box = {
          MrId: this.medicalRecord.MrId,
          SpecimenId: this.specimenId,
          SpecimenName: this.specimenName,
          SamplingTaskId: 0, //领取任务Id
          MrCode: this.medicalRecord.MrCode,
          SonCode: SonCode,
          Alias: '',
          BoxMrCode: this.medicalRecord.MrCode,
          MaterialSign: '未标记',
          MaterialSignUnit: '',
          IsFrozen: '0',
          SpecimenDesc: '',
          SamplingDoctorId: 0,
          SamplingDoctor: '',
          SamplingFlag: '0',
          SamplingTime: null,
          IsAppend: '0', //是否追加
          IsTuoGai: [], //是否脱钙
          DebitStatus: '0',
          IsValid: '0', //1合法  0不合法(为0表示虚拟的数据)
          Remark: '',
          TeacherId: this.samplingTask.TeacherId, //带教老师
          TeacherName: this.samplingTask.TeacherName,
          MaterialQuantity: 1,
        };
        this.boxData.push(box);
      }
      createBoxs(this.boxData).then((res) => {
        console.log(res);
      });
    },
    //通过标本编号获取包埋盒信息
    loadBoxListBySepecimenId(specimentId, mrCode) {
      this.boxData = [];
      getBoxListBySepecimenId(specimentId, mrCode).then((res) => {
        const _mainData = [];
        res.forEach((item, index) => {
          //设置每一条记录的key值
          let isOnly = true;
          let key = '';
          do {
            key = RandomString(32);
            const boxData = this.boxData.filter((w) => w.key === key);
            if (boxData.length !== 0) {
              isOnly = false;
            }
          } while (isOnly === false);
          item.key = key;
          _mainData.push(item);
        });
        this.boxData = _mainData;
      });
    },
    //选中数据
    onSelectBoxChange(selectedBoxRowKeys, selectedBoxRows) {
      this.selectedBoxRowKeys = [];
      for (const iterator of selectedBoxRows) {
        // this.selectedBoxRows.push({ Id: iterator.Id, Status: iterator.Status });
      }
      this.selectedBoxRowKeys = selectedBoxRowKeys;
    },
    //移除包埋盒
    deleteBox() {
      deleteBoxs(this.specimenId, this.medicalRecord.MrId, this.selectedBoxRowKeys).then((result) => {
        const { ResultType, HttpStatusCode, Message } = result;
        if (ResultType == 1 && HttpStatusCode == 200) {
          PromptBox(Message, 'success');
          this.loadBoxListBySepecimenId(this.specimenId, this.medicalRecord.MrCode);
          return;
        }
        PromptBox(Message, 'error');
      });
    },
    /**
     * @description: 生成子号
     * @return {*}
     * @param {*} i 下标
     */
    createSonCode(i) {
      let SonCode = '';
      if (this.boxData.length || this.boxData.length !== 0) {
        //获取最后一个包埋盒子号
        SonCode = this.boxData[this.boxData.length - 1]['SonCode'];
        //不超过十个(中间数为0)
        if (parseInt(SonCode[1]) == 0) {
          if (parseInt(SonCode[SonCode.length - 1]) + 1 == 10) {
            //刚好超过十个盒子
            SonCode = this.wordSequenceNumber + '10';
          } else {
            SonCode = this.wordSequenceNumber + '0' + (parseInt(SonCode[SonCode.length - 1]) + 1); //获取子号的最后一个字符串
          }
        } else {
          //去掉第一个字母(直接把后面的数字加1)
          SonCode = this.wordSequenceNumber + (parseInt(SonCode.slice(1)) + 1);
        }
      } else {
        SonCode = this.startNumber < 10 ? this.wordSequenceNumber + '0' + i : (SonCode = this.wordSequenceNumber + i);
      }
      return SonCode;
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
  .space {
    height: 15px;
  }
  .col-action {
    display: flex;
    flex-direction: column;
    border: 1px solid red;
  }
}
</style>
