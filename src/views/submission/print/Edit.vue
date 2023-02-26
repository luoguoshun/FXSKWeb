<template>
  <div>
    <a-card :bordered="false" id="appprint">
      <div :style="{ overflow: 'hidden', position: 'relative' }">
        <a-space>
          <a-button type="primary" icon="plus" @click="addSpecimen" :disabled="btnDisabled"> 新增 </a-button>
          <a-popconfirm
            placement="rightBottom"
            ok-text="是"
            cancel-text="否"
            @confirm="delSpecimen"
            :disabled="btnDisabled"
          >
            <template slot="title">
              <p>是否删除</p>
            </template>
            <a-button type="danger" icon="delete" :disabled="btnDisabled"> 删除 </a-button>
          </a-popconfirm>
          <a-button type="primary" @click="saveSpecimen" :disabled="btnDisabled"> 保存 </a-button>
          <a-button type="default" icon="printer" @click="print()" :disabled="btnDisabled">打印</a-button>
          <a-button type="default" icon="printer" @click="AppOrderPrint()" :style="{ display: btnAppDisabled }">
            打印申请单标签
          </a-button>
          <a-button type="default" icon="reload" @click="reLoad()">刷新</a-button>
          <a-input
            :value="LeaveTime"
            draggable="true"
            :disabled="btnDisabled"
            placeholder="输入离体时间"
            style="width: 60px"
            @click="inputClick"
            @keyup="(e) => inputChange(e)"
            @blur="(e) => blurChange(e, -1, 'AllLeaveTime')"
            @pressEnter="(e) => blurChange(e, -1, 'AllLeaveTime')"
          />
          <a-input
            :value="FixedTime"
            draggable="true"
            :disabled="btnDisabled"
            placeholder="输入固定时间"
            style="width: 60px"
            @click="inputClick"
            @keyup="(e) => inputChange(e)"
            @blur="(e) => blurChange(e, -1, 'AllFixedTime')"
            @pressEnter="(e) => blurChange(e, -1, 'AllFixedTime')"
          />
          <a-select
            show-search
            :value="FixLiquid"
            style="width: 150px"
            @change="(e) => handleChange(e, -1, 'AllFixLiquid')"
            :disabled="btnDisabled"
          >
            <a-select-option v-for="d in fixLiquidType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
          </a-select>
          <a-input v-if="doctorTakeAwayDisabled" placeholder="外带医生姓名" v-model="DoctorCode" />
          <a-button v-if="doctorTakeAwayDisabled" type="primary" @click="DoctorTakeAway">外带</a-button>
          <a-popconfirm placement="bottom" ok-text="Yes" cancel-text="No">
            <template slot="title">
              <TakeAwayList :record="record" :data="TakeAwayList" v-if="DoctorTakeAwayVisible" />
            </template>
            <a-button v-if="doctorTakeAwayDisabled" type="primary" @click="ShowDoctorTakeAway">已外带列表</a-button>
          </a-popconfirm>
        </a-space>
        <div style="margin: 10px 0"></div>
        <a-table
          :scroll="{ y: 400 }"
          :columns="specimenColumns"
          :data-source="specimendata"
          :pagination="false"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          @change="handleTableChange"
          class="components-table-demo-nested"
        >
          <template slot="Status" slot-scope="text">
            <span v-if="text == null">
              <span class="ant-badge-status-dot ant-badge-status-default"></span>
              <span class="ant-badge-status-text">未打印</span>
            </span>
            <span v-if="text != null"
              ><span class="ant-badge-status-dot ant-badge-status-processing"></span>
              <span class="ant-badge-status-text">已打印</span>
            </span>
          </template>
          <template
            v-for="col in [
              'SpecimenCode',
              'SpecimenName',
              'PartId',
              'LeaveTime',
              'FixedTime',
              'FixLiquid',
              'OperatingRoomNo',
            ]"
            :slot="col"
            slot-scope="text, index"
          >
            <div :key="col" v-if="col === 'SpecimenCode'">
              <a-input-number
                style="width: 50px"
                :value="text"
                :min="1"
                :max="9999"
                @change="(e) => handelCodeChange(e, index, col)"
              />
            </div>
            <div :key="col" v-if="col === 'SpecimenName'">
              <a-select
                v-if="editable && text !== ''"
                show-search
                placeholder=""
                :allow-clear="true"
                :value="text"
                :show-arrow="true"
                style="width: 190px"
                mode="combobox"
                @focus="handleFocus"
                @change="(e) => handleChange(e, index, col)"
                @search="specimenNameChange"
              >
                <a-select-option v-for="d in specimenNameType" :key="d.value" :value="d.value">{{
                  d.text
                }}</a-select-option>
              </a-select>
              <a-select
                v-else-if="editable && text === ''"
                show-search
                mode="combobox"
                :allow-clear="true"
                :show-arrow="true"
                style="width: 190px"
                placeholder=""
                :value="undefined"
                @focus="handleFocus"
                @change="(e) => handleChange(e, index, col)"
                @search="specimenNameChange"
              >
                <a-select-option v-for="d in specimenNameType" :key="d.value" :value="d.value">{{
                  d.text
                }}</a-select-option>
              </a-select>
              <template v-else>
                {{ text }}
              </template>
            </div>
            <div :key="col" v-if="col === 'LeaveTime'">
              <a-input
                v-if="editable && text !== ''"
                :value="text"
                style="width: 150px"
                placeholder="输入离体时间"
                draggable="true"
                @focus="(e) => focusEvent(e, 'LeaveTime')"
                @keyup="(e) => onChange(e, index, 'LeaveTime')"
                @blur="(e) => handleChange(e, index, 'LeaveTime')"
                @pressEnter="(e) => handleChange(e, index, 'LeaveTime')"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
            <div :key="col" v-if="col === 'FixedTime'">
              <a-input
                v-if="editable && text !== ''"
                :value="text"
                style="width: 150px"
                placeholder="选择固定时间"
                draggable="true"
                @focus="(e) => focusEvent(e, 'FixedTime')"
                @keyup="(e) => onChange(e, index, 'FixedTime')"
                @blur="(e) => handleChange(e, index, 'FixedTime')"
                @pressEnter="(e) => handleChange(e, index, 'FixedTime')"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
            <div :key="col" v-if="col === 'FixLiquid'">
              <a-select
                v-if="editable && text !== ''"
                show-search
                placeholder="选择固定液"
                :value="text"
                style="width: 150px"
                @change="(e) => fixLiquidChange(e, index)"
              >
                <a-select-option v-for="d in fixLiquidType" :key="d.value" :value="d.value">{{
                  d.text
                }}</a-select-option>
              </a-select>
              <template v-else>
                {{ text }}
              </template>
            </div>
            <div :key="col" v-if="col === 'PartId'">
              <a-select
                v-if="editable && text !== null"
                mode="combobox"
                style="width: 150px"
                placeholder="输入部位"
                :value="toPartName(text)"
                optionFilterProp="children"
                @keyup="(e) => onChange(e, index, 'PartId')"
                @blur="(e) => handleChange(e, index, 'PartId')"
                @change="(e) => handleChange(e, index, col)"
              >
                <a-select-option v-for="d in partType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
              <a-select
                v-else-if="editable && text === null"
                mode="combobox"
                style="width: 150px"
                placeholder="输入部位"
                :value="toPartName(text)"
                optionFilterProp="children"
                @keyup="(e) => onChange(e, index, 'PartId')"
                @blur="(e) => handleChange(e, index, 'PartId')"
                @change="(e) => handleChange(e, index, col)"
              >
                <a-select-option v-for="d in partType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
              <template v-else>
                {{ toPartName(text) }}
              </template>
            </div>
            <div :key="col" v-if="col === 'OperatingRoomNo'">
              {{ record.OperatingRoomNo }}
            </div>
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>
<script>
import { defineComponent, message } from 'vue';
import { updateLeaveTime, updateFixedTime } from '@/api/submission/collect';
import {
  getOrderSpecimens,
  getSpecimenNames,
  doctorTakeAway,
  getDoctorTakeAwaySpecimens,
  getToken,
} from '@/api/submission/app';
import { saveSpecimens, delSpecimens, getPrintLabelTemplate } from '@/api/submission/precheck';
import { getCheckPartData } from '@/api/basics/checkpart';
import {
  RandomString,
  StringToTime,
  CheckField,
  LoadNowTime,
  TimeToString,
  JSONStringToObject,
  FormartDataTemplet,
  PromptBox,
  LoadNowTimeAdd,
  TimeIncrement,
} from '@/utils/util';
import { BrowserPrintInit } from '@/utils/BrowserPrint.js';
import { getDictByName } from '@/api/system/dictionary';
import enums from '@/store/enum/enum';
import moment from 'moment';
import { getStrategyTemplate } from '@/api/system/strategy';
import { getSubmissionTypes } from '@/api/system/workflow';
import TakeAwayList from './TakeAwayList';
import { printLabel } from './print';
import { printSpecimenLabel } from '@/api/submission/precheck';
import caApi from './szCA';

const specimendata = []; // 标本列表
const specimenColumns = [
  { title: '状态', dataIndex: 'OperatingTime', width: 80, scopedSlots: { customRender: 'Status' } },
  { title: '标本名称', dataIndex: 'SpecimenName', width: 170, scopedSlots: { customRender: 'SpecimenName' } },
  { title: '编号', dataIndex: 'SpecimenCode', width: 55, scopedSlots: { customRender: 'SpecimenCode' } },
  { title: '离体时间', dataIndex: 'LeaveTime', width: 130, scopedSlots: { customRender: 'LeaveTime' } },
  { title: '固定时间', dataIndex: 'FixedTime', width: 130, scopedSlots: { customRender: 'FixedTime' } },
  { title: '固定液', dataIndex: 'FixLiquid', width: 130, scopedSlots: { customRender: 'FixLiquid' } },
  { title: '部位', dataIndex: 'PartId', scopedSlots: { customRender: 'PartId' }, width: 150 },
  { title: '手术间', dataIndex: 'OperatingRoomNo', scopedSlots: { customRender: 'OperatingRoomNo' }, width: 70 },
];
const timer = {
  hour: false,
  minute: false,
  second: false,
  total: 0,
  allHour: false,
  allMinute: false,
  allSecond: false,
  allTotal: 0,
  minuteVal: '',
  allMinuteVal: '',
};
export default {
  props: {
    record: {
      type: Object,
      default: null,
    },
  },
  components: {
    TakeAwayList,
  },
  data() {
    return {
      timer,
      CASrc: '',
      btnDisabled: false,
      btnAppDisabled: 'none',
      doctorTakeAwayDisabled: false,
      DoctorTakeAwayVisible: false,
      specimendata,
      specimenColumns,
      pagination: {
        pageSize: 6,
        current: 1,
        total: 0,
      },
      selectedRowKeys: [],
      filters: {
        keys: '',
        type: '1',
      },
      keyTypeDatas: [
        { value: '0', text: '申请单号' },
        { value: '1', text: '病人ID' },
        { value: '2', text: '患者姓名' },
        { value: '3', text: '门诊号' },
        { value: '4', text: '住院号' },
      ],
      editable: true,
      specimenNameType: [],
      partType: [],
      printLableTemplateContent: '',
      printLableTemplateApply: '',
      fixLiquidType: enums.FixLiquid,
      FixLiquid: null,
      AllLeaveTime: '',
      AllFixedTime: '',
      MaxTime: '',
      LeaveTime: '',
      FixedTime: '',
      LeaveToFixedTime: '0',
      strategys: {},
      pathologyCodeType: [],
      DoctorCode: '',
      TakeAwayList: [],
    };
  },
  created: function () {
    // 冰冻不需要固定液
    if (this.record.PathologyCode !== 'Frozen') {
      getDictByName('默认固定液').then((res) => {
        if (res.data && res.data.length > 0) {
          this.FixLiquid = res.data;
        }
      });
    }
    getDictByName('CA地址').then((res) => {
      if (res.data && res.data.length > 0) {
        this.CASrc = res.data;
      }
    });
    this.getCheckPartData();
    this.getSpecimenNames('');
    this.LoadSpecimens();
    this.specimendata = [];
    this.loadConfig();
    this.LeaveTime = LoadNowTime('HH:mm');
    this.FixedTime = LoadNowTime('HH:mm');
    this.AllLeaveTime = LoadNowTime();
    this.AllFixedTime = LoadNowTime();
  },
  computed: {},
  mounted() {
    if (this.record.Id !== undefined) {
      if (this.record.Status === '1') {
        getDictByName('继续增加标本').then((res) => {
          if (res.data && res.data.length > 0) {
            this.editable = res.data === '1';
            this.btnDisabled = res.data === '0';
          }
        });
      }
    }
    // 初始化浏览器打印事件
    BrowserPrintInit(this);
    this.initWebSocket();
  },
  methods: {
    handleFocus(e, a) {},
    inputClick(e) {
      const input = e.target;
      if (input.selectionStart <= 2) {
        input.selectionStart = 0;
        input.selectionEnd = 2;
      } else if (input.selectionStart >= 3 && input.selectionStart <= 5) {
        input.selectionStart = 3;
        input.selectionEnd = 5;
      }
    },
    inputChange(e) {
      this.timer.total += 1;
      if (this.timer.minute === false && this.timer.total > 1) {
        this.timer.minute = true;
        this.setInputSelection(e.target, 3, 5); // 分钟 将被选中
      }
    },
    handelCodeChange(e, index, col) {
      index[col] = e;
    },
    blurChange(value, obj, column) {
      this.timer.total = 0;
      this.timer.minute = false;
      const _time = LoadNowTime(`yyyy-MM-DD ${value.target.value}:00`);
      let exist = false;
      if (column === 'SpecimenName') {
        this.specimendata.forEach((item) => {
          if (item.key === obj.key) {
            item.SpecimenName = value === undefined ? '' : value;
            exist = true;
          }
        });
        if (exist === false) {
          obj.SpecimenName = value === undefined ? '' : value;
        }
      }
      if (column === 'PartId') {
        this.partType.forEach((item) => {
          if (item.value === value) {
            exist = true;
            obj.PartId = value === undefined ? '' : value;
          }
        });
        if (exist === false) {
          obj.PartId = '';
          obj.PartName = value === undefined ? '' : value;
        }
      }
      if (column === 'FixedTime' && this.record.PathologyCode !== 'Frozen') {
        if (CheckField(obj.LeaveTime) && CheckField(_time) && StringToTime(_time) < StringToTime(obj.LeaveTime)) {
          PromptBox('固定时间不能小于离体时间', 'warning', 'topRight', 2);
          return;
        }
        CheckField(obj.Id) ? this.updateField(obj.Id, column, _time) : this.updateField(obj.key, column, _time);
      }
      if (column === 'LeaveTime') {
        CheckField(obj.Id) ? this.updateField(obj.Id, column, _time) : this.updateField(obj.key, column, _time);
      }
      if (column === 'AllLeaveTime') {
        this.specimendata.forEach((item) => {
          this.updateField(item.Id, 'LeaveTime', _time);
        });
      }
      if (column === 'AllFixedTime') {
        this.specimendata.forEach((item) => {
          this.updateField(item.Id, 'FixedTime', _time);
        });
      }
      if (column === 'AllFixLiquid') {
        this.FixLiquid = value;
        this.specimendata.forEach((item) => {
          this.updateField(item.Id, 'FixLiquid', value);
        });
      }
    },
    moment,
    customRender: function (t, r, index) {
      return parseInt(index) + 1;
    },
    loadConfig() {
      getDictByName('是否开启打印申请单标签').then((res) => {
        if (CheckField(res.data)) {
          this.btnAppDisabled = res.data === '1' ? 'block' : 'none';
        }
      });
      // 加载申请单标签打印模板
      getPrintLabelTemplate(this.record.PathologyCode, 'Apply').then((res) => {
        if (res.Data == null) {
          PromptBox('未获取到申请单标签打印模板', 'error');
          return;
        }
        this.printLableTemplateApply = res.Data.Templet;
      });
      // 加载标本标签打印模板
      getPrintLabelTemplate(this.record.PathologyCode).then((res) => {
        if (res.Data == null) {
          PromptBox('未获取到标本标签打印模板', 'error');
          return;
        }
        this.printLableTemplateContent = res.Data.Templet;
      });
      getDictByName('固定离体时间差').then((res) => {
        if (res && res.data) {
          this.LeaveToFixedTime = res.data;
        }
      });

      getSubmissionTypes().then((res) => {
        res.forEach((element) => {
          this.pathologyCodeType.push({
            value: element.Content,
            text: element.Name,
          });
        });
      });
      const $this = this;
      getStrategyTemplate('Print').then((res) => {
        $this.strategys = JSONStringToObject(res.Content);
        // 默认离体时间为当前，固定时间为离体时间后15分钟
        if (CheckField(this.strategys.behaviorProperty.FillLeaveTime.required)) {
          $this.LeaveTime = LoadNowTimeAdd('minute', this.strategys.behaviorProperty.FillLeaveTime.default, 'HH:mm');
          $this.AllLeaveTime = LoadNowTimeAdd('minute', this.strategys.behaviorProperty.FillLeaveTime.default);
        }
        if (CheckField(this.strategys.behaviorProperty.FillFixedTime.required)) {
          $this.FixedTime = LoadNowTimeAdd('minute', this.strategys.behaviorProperty.FillFixedTime.default, 'HH:mm');
          $this.AllFixedTime = LoadNowTimeAdd('minute', this.strategys.behaviorProperty.FillFixedTime.default);
        }
        if (CheckField(this.strategys.behaviorProperty.IsAutoIncrement.required)) {
          $this.AllLeaveTime = LoadNowTimeAdd('minute', 0);
          this.MaxTime = LoadNowTimeAdd('minute', this.strategys.behaviorProperty.AutoIncrementValue.default);
          $this.AllFixedTime = this.MaxTime;
        }
        if (CheckField(this.strategys.behaviorProperty.DoctorTackAway.visible)) {
          this.doctorTakeAwayDisabled = this.strategys.behaviorProperty.DoctorTackAway.visible;
        }
      });
    },
    // 动作策略
    strategyHandle(val) {
      if (val !== undefined) {
        this.MaxTime = TimeIncrement(val, 'minute', this.strategys.behaviorProperty.AutoIncrementValue.default);
      } else if (CheckField(this.strategys.behaviorProperty.IsAutoIncrement.required)) {
        this.MaxTime = TimeIncrement(
          this.MaxTime,
          'minute',
          this.strategys.behaviorProperty.AutoIncrementValue.default,
        );
      }
      this.AllLeaveTime = this.MaxTime;
      this.MaxTime = TimeIncrement(this.MaxTime, 'minute', this.strategys.behaviorProperty.AutoIncrementValue.default);
      this.AllFixedTime = this.MaxTime;
    },
    // 鼠标焦点进入input触发事件
    focusEvent(e, type) {
      timer.hour = false;
      timer.minute = false;
      timer.second = false;
      timer.minuteValue = '';
      this.setInputSelection(e.target, 11, 13); // 小时 将被选中
      timer.total = 0;
    },
    // 响应focusEvent事件，触发后会对input指定内容进行选中
    setInputSelection(input, startPos, endPos) {
      if (typeof input.selectionStart !== 'undefined') {
        input.selectionStart = startPos;
        input.selectionEnd = endPos;
      } else if (document.selection && document.selection.createRange) {
        // IE branch
        input.select();
        var range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd('character', endPos);
        range.moveStart('character', startPos);
        range.select();
      }
    },
    fixLiquidChange(text, index) {
      index.FixLiquid = text;
    },
    reLoad() {
      this.specimendata = [];
      this.LoadSpecimens();
    },
    toPartName(pId) {
      if (pId === '' || pId == null) {
        return undefined;
      }
      let name = '';
      this.partType.forEach((item) => {
        if (item.value === pId.toString()) {
          name = item.text;
        }
      });
      return name;
    },
    getCheckPartData() {
      getCheckPartData().then((res) => {
        res.data.forEach((item) => {
          if (item.ParentId !== 0) {
            this.partType.push({ value: item.Id.toString(), text: item.Content });
          }
        });
      });
    },
    //获取到标本名字列表
    getSpecimenNames(val) {
      this.specimenNameType = [];
      getSpecimenNames(val).then((res) => {
        res.data.forEach((item) => {
          this.specimenNameType.push({ value: item.SpecimenName, text: item.SpecimenName });
        });
      });
    },
    //标本名字改变时
    specimenNameChange(v) {
      this.getSpecimenNames(v);
    },
    //加载标本列表
    LoadSpecimens() {
      if (this.record.Id === undefined) {
        return;
      }
      getOrderSpecimens(this.record.Id).then((res) => {
        const _mainData = [];
        res.data.forEach((item, index) => {
          //设置每一条记录的key值
          let isOnly = true;
          let key = '';
          do {
            key = RandomString(32);
            const specimen = this.specimendata.filter((w) => w.key === key);
            if (specimen.length !== 0) {
              isOnly = false;
            }
          } while (isOnly === false);
          item.key = key;
          //格式化时间
          if (!CheckField(item.LeaveTime)) {
            item.LeaveTime = LoadNowTime();
          } else {
            item.LeaveTime = TimeToString(item.LeaveTime);
          }
          if (!CheckField(item.FixedTime)) {
            item.FixedTime = LoadNowTime();
          } else {
            item.FixedTime = TimeToString(item.FixedTime);
          }
          _mainData.push(item);
        });
        this.specimendata = _mainData;
        // this.orderSpecimens()
        this.ConfigOperation();
        this.pagination.total = this.specimendata.length;
        this.pagination.current = 1;
      });
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
    },
    onChange(e, obj, column) {
      this.timer.total += 1;
      if (this.timer.minute === false && this.timer.total >= 2) {
        this.timer.minute = true;
        this.setInputSelection(e.target, 14, 16); // 分钟 将被选中
      } else if (this.timer.second === false && this.timer.total >= 4) {
        this.timer.second = true;
        this.setInputSelection(e.target, 17, 19); // 秒钟 将被选中
      }
      if (column === 'PartId') {
        // console.log(e)
      }
    },
    handleChange(value, obj, column) {
      let exist = false;
      if (column === 'SpecimenName') {
        this.specimendata.forEach((item) => {
          if (item.key === obj.key) {
            item.SpecimenName = value === undefined ? '' : value;
            exist = true;
          }
        });
        if (exist === false) {
          obj.SpecimenName = value === undefined ? '' : value;
        }
      }
      if (column === 'PartId') {
        this.partType.forEach((item) => {
          if (item.value === value) {
            exist = true;
            obj.PartId = value === undefined ? '' : value;
          }
        });
        if (exist === false && CheckField(value) === true) {
          this.partType.push({ value: value, text: value });
          obj.PartId = value === undefined ? '' : value;
          obj.PartName = value === undefined ? '' : value;
        }
      }
      if (column === 'FixedTime' && this.record.PathologyCode !== 'Frozen') {
        if (
          CheckField(obj.LeaveTime) &&
          CheckField(value.target.value) &&
          StringToTime(value.target.value) < StringToTime(obj.LeaveTime)
        ) {
          PromptBox('固定时间不能小于离体时间', 'warning', 'topRight', 2);
          return;
        }
        CheckField(obj.Id)
          ? this.updateField(obj.Id, column, value.target.value)
          : this.updateField(obj.key, column, value.target.value);
        this.strategyHandle(value.target.value);
      }
      if (column === 'LeaveTime') {
        CheckField(obj.Id)
          ? this.updateField(obj.Id, column, value.target.value)
          : this.updateField(obj.key, column, value.target.value);
        this.strategyHandle(value.target.value);
      }
      if (column === 'AllLeaveTime') {
        this.specimendata.forEach((item) => {
          this.updateField(item.Id, 'LeaveTime', value.target.value);
        });
      }
      if (column === 'AllFixedTime') {
        this.specimendata.forEach((item) => {
          this.updateField(item.Id, 'FixedTime', value.target.value);
        });
      }
      if (column === 'AllFixLiquid') {
        this.FixLiquid = value;
        this.specimendata.forEach((item) => {
          this.updateField(item.Id, 'FixLiquid', value);
        });
      }
    },
    getDataItem(id) {
      let result = {};
      this.specimendata.forEach((item) => {
        if (item.Id === id) {
          result = item;
        }
      });
      return result;
    },
    updateField(id, fileName, fileValue) {
      this.specimendata.forEach((item) => {
        if (item.Id === id || item.key === id) {
          item[fileName] = fileValue;
        }
      });
    },
    updateTime(methodName, item, type) {
      if (methodName === 'UpdateFixedTime' && this.record.PathologyCode !== 'Frozen') {
        if (
          CheckField(item.LeaveTime) &&
          CheckField(item.FixedTime) &&
          StringToTime(item.LeaveTime) > StringToTime(item.FixedTime)
        ) {
          PromptBox('固定时间不能小于离体时间', 'warning', 'topRight', 2);
          return;
        } else if (item.FixedTime !== '' && (item.FixLiquid === null || typeof item.FixLiquid === 'undefined')) {
          PromptBox('常规送检固定液不能为空', 'warning', 'topRight', 2);
          this.updateField(item.Id, 'FixedTime', '');
          return;
        } else if (item.FixedTime === '' && type === 'hand') {
          // 手动固定清空
          this.updateField(item.Id, 'FixedTime', '');
        } else {
          // 固定
          this.updateField(item.Id, 'FixedTime', item.FixedTime);
        }
      } else if (methodName === 'UpdateLeaveTime') {
        // 离体
        this.updateField(item.Id, 'LeaveTime', item.LeaveTime);
      }
      switch (methodName) {
        case 'UpdateFixedTime':
          updateFixedTime({ ObjectDTO: item }).then((res) => {});
          break;
        case 'UpdateLeaveTime':
          updateLeaveTime({ ObjectDTO: item }).then((res) => {});
          break;
      }
    },
    inArrayExt(id) {
      let ext = false;
      this.specimendata.forEach((item) => {
        if (id === item.Id) {
          ext = true;
        }
      });
      return ext;
    },
    //选中行记录
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //新增标本信息
    addSpecimen() {
      let specimenCode = '1'; //标本编号
      let i = 1;
      //  Number() 函数把对象的值转换为数字。
      // 如果对象的值无法转换为数字，那么函数返回 NaN。
      this.specimendata.forEach((item) => {
        if (item.SpecimenCode > i) {
          i = Number(item.SpecimenCode);
        }
        specimenCode = i + 1;
      });
      let isOnly = true;
      let key = '';
      do {
        key = RandomString(32);
        const specimen = this.specimendata.filter((w) => w.key === key);
        if (specimen.length !== 0) {
          isOnly = false;
        }
      } while (isOnly === false);
      this.specimendata.push({
        key: key,
        OperatingRoomNo: this.record.OperatingRoomNo,
        AppId: this.record.Id,
        FixedTime: this.AllFixedTime,
        LeaveTime: this.AllLeaveTime,
        FixLiquid: this.FixLiquid,
        SpecimenName: '',
        SpecimenCode: specimenCode,
        PartId: '',
        PartName: '',
      });

      this.ConfigOperation();
      this.pagination.total = this.specimendata.length;
      this.strategyHandle();
    },
    delSpecimen() {
      const sData = this.specimendata.filter((f) => this.selectedRowKeys.includes(f.key) && CheckField(f.Id) === true);
      const ids = [];
      if (sData.length === 0) {
        const tempData = this.specimendata.filter((f) => !this.selectedRowKeys.includes(f.key));
        this.specimendata = tempData;
      } else {
        sData.forEach((item) => {
          ids.push(item.Id);
        });
        delSpecimens({ ids: ids, appNo: this.record.AppNo }).then((res) => {
          if (res.HttpStatusCode === 200 && res.ResultType === 1) {
            PromptBox('操作成功！', 'success', 'topRight', 2);
            const _tempData = this.specimendata.filter((w) => !this.selectedRowKeys.includes(w.key));
            this.specimendata = _tempData;
            this.orderSpecimens();
          } else {
            PromptBox(res.Message, 'error', 'topRight', 2);
          }
        });
      }
    },
    orderSpecimens() {
      if (this.specimendata.length === 0) {
        return;
      }
      const isAllNotPrint = true;
      this.specimendata.forEach((item) => {
        if (item.OperatingTime !== null) {
          isAllNotPrint = false;
        }
      });
      if (isAllNotPrint) {
        let i = 1;
        this.specimendata.forEach((item) => {
          item.SpecimenCode = i.toString();
          i = i + 1;
        });
      }
    },
    //保存标本（数据库没有DiagnosisReport表）
    saveSpecimen() {
      const $this = this;
      let _isRepetition = false; //检查标本是否重名
      let _repetitionName = '';
      this.specimendata.forEach((item) => {
        if (this.specimendata.filter((w) => w.SpecimenName === item.SpecimenName).length > 1) {
          _repetitionName = item.SpecimenName;
          _isRepetition = true;
        }
      });
      if (_isRepetition) {
        PromptBox(`标本：【${_repetitionName}】存在重复名称`, 'warning');
        return;
      }
      SaveOperation();
      function SaveOperation() {
        // 对没有操作的时间恢复成null状态
        $this.specimendata.forEach((item, index) => {
          if (CheckField(item.FixedTime) === true && item.FixedTime.toString().indexOf('00:00:00') >= 0) {
            $this.specimendata[index].FixedTime = null;
          }
          if (CheckField(item.LeaveTime) === true && item.LeaveTime.toString().indexOf('00:00:00') >= 0) {
            $this.specimendata[index].LeaveTime = null;
          }
        });
        saveSpecimens({ ObjectDTO: $this.specimendata }).then((res) => {
          if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
            $this.specimendata = [];
            res.Data.Specimens.forEach((item, index) => {
              item.key = RandomString(32);
              if (item.LeaveTime === null) {
                item.LeaveTime = LoadNowTime();
              } else {
                item.LeaveTime = TimeToString(item.LeaveTime);
              }
              if (item.FixedTime === null) {
                item.FixedTime = LoadNowTime();
              } else {
                item.FixedTime = TimeToString(item.FixedTime);
              }
              $this.specimendata.push(item);
            });
            $this.ConfigOperation();
            PromptBox('操作成功！', 'success', 'topRight', 2);
          } else {
            PromptBox(res.Message, 'warning', 'topRight', 2);
          }
        });
      }
    },
    AppOrderPrint() {
      const $this = this;
      const obj = this.specimendata.filter((f) => CheckField(f.OperatingTime) === false);
      if (obj.length > 0) {
        PromptBox('当前存在未打印标本标签', 'warning', 'topRight', 2);
        return;
      }
      this.record.SpecimenTotal = this.specimendata.length;
      var printData =
        '^XA^CW1,E:SIMSUN.FNT^CI28' +
          '^FO20,20^A1,25,25^FD' +
          this.record.AppNo +
          '^FS' +
          '^FO20,55^A1,25,25^FD患者姓名：' +
          this.record.PatientName +
          '^FS' +
          '^FO20,90^A1,25,25^FD送检科室：' +
          this.record.SendDepartmentName +
          '^FS' +
          '^FO20,125^A1,25,25^FD标本总数：' +
          this.record.SpecimenTotal +
          '^FS' +
          '^FO20,155^A1,25,25^FD门诊号：' +
          CheckField(this.record.OutpatientNum) ===
        false
          ? ''
          : this.record.OutpatientNum +
            '^FS' +
            '^FO280,30^BQN,3,4^FDMM,A' +
            ('---' + this.record.Id) +
            '^FS' +
            '^FO280,125^A1,25,25^FD' +
            ('---' + this.record.Id) +
            '^FS' +
            '^PQ1^XZ';
      if (this.printLableTemplateApply !== '') {
        const tempObj = this.printLableTemplateApply;
        const tempPathologyCode = this.record.PathologyCode; // 防止只能打印一次，打印后将送检类型还原为编码
        if (CheckField(this.record)) {
          this.record.OutpatientNum = CheckField(this.record.OutpatientNum) === false ? '' : this.record.OutpatientNum;
          this.record.AdmissionNum = CheckField(this.record.AdmissionNum) === false ? '' : this.record.AdmissionNum;
          const _temp = this.pathologyCodeType.filter((f) => f.value === this.record.PathologyCode);
          this.record.PathologyCode = CheckField(_temp) ? _temp[0].text : '';
        }
        printData = FormartDataTemplet(tempObj, this.record);
        this.record.PathologyCode = tempPathologyCode;
      }
      console.log(printData);
      $this.GLOBAL.selectedDevice.send(printData, undefined, errorCallback);
      function errorCallback(errorMessage) {
        if (errorMessage === 'Failed to write to device') {
          PromptBox('Error: 请检查打印机连接是否正确！', 'warning', 'topRight', 2);
        }
      }
    },
    ConfigOperation() {
      //?
      if (this.record.PathologyCode === 'Frozen') {
        this.specimendata.forEach((item, i) => {
          this.specimendata[i].FixedTime = null;
        });
      }
    },
    DoctorTakeAway() {
      if (
        CheckField(this.strategys.behaviorProperty.DoctorTackAwayUseCA.required) &&
        this.strategys.behaviorProperty.DoctorTackAwayUseCA.required
      ) {
        if (CheckField(this.DoctorCode) === false) {
          PromptBox('请输入医生姓名', 'warning', 'topRight', 2);
          return;
        }
        var obj = {
          Specimens: [],
          Code: this.DoctorCode,
          Key: '',
        };
        obj.Specimens = this.specimendata.filter((f) => this.selectedRowKeys.includes(f.key));
        doctorTakeAway(obj).then((res) => {
          if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
            PromptBox('操作成功！', 'success', 'topRight', 2);
            this.reLoad();
          } else {
            PromptBox(res.Message, 'warning', 'topRight', 2);
          }
        });
      } else {
        if (this.selectedRowKeys.length === 0) {
          PromptBox('请选择需要带走的标本', 'warning', 'topRight', 2);
          return;
        }

        const array = this.CASrc.split('|');
        //可配置在字典值里面
        const req = {
          url: array[0], //接口地址
          businessOrgCode: array[1], //组织机构代码
          businessSystemCode: array[2], //业务系统编码
          businessSystemAppID: array[3], //业务系统唯一标识
        };
        //同步，这里会等待中间件完成登录
        const loginResult = caApi.SZWJ_LoginByComponents(req);
        console.log(loginResult, 'CA登录结果');
        if (loginResult.statusCode != 0) {
          PromptBox('CA中间件登录失败', 'warning', 'topRight', 2);
          return;
        }

        //验证登录并获取token
        req.authority = loginResult.eventValue.authority; //授权服务器
        req.signCert = loginResult.eventValue.signCert; //base64 编码格式证书
        req.boundValue = loginResult.eventValue.boundValue; //登录签名值
        req.authServerAddr = loginResult.eventValue.authServerAddr; //授权服务器

        //从后台获取CA Token
        getToken(req).then((res) => {
          //if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
          if (!res) {
            PromptBox('CA获取不到Token', 'warning', 'topRight', 2);
            return;
          }

          req.token = res;
          const imgResult = caApi.SZWJ_GetPicBySN(req);
          if (imgResult.statusCode != 0) {
            PromptBox('CA中间件获取签名图像失败', 'warning', 'topRight', 2);
            return;
          }
          var imgStr = imgResult.eventValue.dictionary[0].signFlow;
          this.DoctorCode = imgResult.eventValue.dictionary[0].signName;
          var obj = {
            Specimens: [],
            Code: this.DoctorCode,
            Key: imgStr,
          };
          obj.Specimens = this.specimendata.filter((f) => this.selectedRowKeys.includes(f.key));
          doctorTakeAway(obj).then((res) => {
            if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
              PromptBox('操作成功！', 'success', 'topRight', 2);
              this.reLoad();
            } else {
              PromptBox(res.Message, 'warning', 'topRight', 2);
            }
          });
        });
      }
    },
    ShowDoctorTakeAway() {
      getDoctorTakeAwaySpecimens(this.record.Id).then((res) => {
        this.DoctorTakeAwayVisible = true;
        this.TakeAwayList = res.Data;
        this.InitializePrinterObj(this.TakeAwayList);
      });
    },
    //打印标本标签
    print() {
      if (this.selectedRowKeys.length==0) {
        PromptBox('请选择需要打印的标本', 'warning', 'topRight', 2);
        return;
      }
      const $this = this;
      const printObj = this.specimendata.filter((item) => this.selectedRowKeys.includes(item.key));
      console.log(this.specimendata);
      this.CheckPrintField('print', () => {
        // 对没有操作的时间恢复成null状态
        printObj.forEach((item, index) => {
          if (!CheckField(item.FixedTime) || item.FixedTime.toString().indexOf('00:00:00') >= 0) {
            printObj[index].FixedTime = null;
          }
          if (!CheckField(item.LeaveTime) || item.LeaveTime.toString().indexOf('00:00:00') >= 0) {
            printObj[index].LeaveTime = null;
          }
        });
        printSpecimenLabel({ ObjectDTO: printObj, isPrint: true }).then((res) => {
          if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
            PromptBox('操作成功！', 'success', 'topRight', 2);
            res.Data.Specimens.forEach((item, index) => {
              if ($this.partType.filter((f) => f.value === item.PartId).length === 0) {
                $this.partType.push({ value: item.PartId, text: item.PartName });
              }
              item.key = RandomString(32);
              if (item.LeaveTime === null) {
                item.LeaveTime = moment(Date.now()).format('yyyy-MM-DD 00:00:00');
              } else {
                item.LeaveTime = moment(item.LeaveTime).format('yyyy-MM-DD HH:mm:ss');
              }
              if (item.FixedTime === null) {
                item.FixedTime = moment(Date.now()).format('yyyy-MM-DD 00:00:00');
              } else {
                item.FixedTime = moment(item.FixedTime).format('yyyy-MM-DD HH:mm:ss');
              }
              $this.specimendata.push(item);
            });
            $this.reLoad();
            $this.ConfigOperation();
            $this.record.Department = res.Data.Department;
            $this.InitializePrinterObj(res.Data.Specimens);
            $this.printLabelFactory($this, res.Data.Specimens);
          } else {
            PromptBox(res.Message, 'warning', 'topRight', 2);
            $this.reLoad();
          }
        });

        // #region 把打印的数据从列表中去除
        const tempObj = [];
        this.specimendata.forEach((item) => {
          let ext = false;
          printObj.forEach((element) => {
            if (element.key === item.key) {
              ext = true;
            }
          });
          if (ext === false) {
            tempObj.push(item);
          }
        });
        this.specimendata = tempObj;
        // #endregion
      });
    },
    // 打印工厂方法
    printLabelFactory($this, data) {
      // 这里如果优化了自动更新功能这里判断考虑需要优化
      if (CheckField(this.strategys.behaviorProperty.PrinterType)) {
        if (this.strategys.behaviorProperty.PrinterType.default === 'zebra') {
          printLabel($this, data, $this.printLableTemplateContent);
        } else if (this.strategys.behaviorProperty.PrinterType.default === '新北洋') {
          this.websocketsend(JSON.stringify(data));
        }
      } else {
        printLabel($this, data, $this.printLableTemplateContent);
      }
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
      this.initWebSocket();
    },
    initWebSocket() {
      //初始化weosocket
      const wsuri = 'ws://127.0.0.1:8888/';
      this.websock = new WebSocket(wsuri);
      console.log(this.websock);
    },
    // 打印对象初始化
    InitializePrinterObj(specimens) {
      specimens.forEach((specimen) => {
        specimen.SpecimenCode = CheckField(specimen.SpecimenCode) ? specimen.SpecimenCode : '';
        specimen.AdmissionNum = CheckField(this.record.AdmissionNum) ? this.record.AdmissionNum : '';
        specimen.Total = specimens.length;
        specimen.PartName = CheckField(specimen.PartName) === false ? '' : specimen.PartName;
        specimen.AppCode = this.record.AppNo;
        specimen.LeaveTime = StringToTime(specimen.LeaveTime, 'HH:mm').toString();
        specimen.FixedTime = StringToTime(specimen.FixedTime, 'HH:mm').toString();
        specimen.OutpatientNum = this.record.OutpatientNum === null ? '' : this.record.OutpatientNum;
        specimen.PatientName = this.record.PatientName;
        specimen.Sex = this.record.Sex.toString() === '0' ? '男' : '女';
        specimen.Age = this.record.Age;
        specimen.AgeYear = CheckField(this.record.AgeYear) ? this.record.AgeYear : '';
        specimen.AgeMonth = CheckField(this.record.AgeMonth) ? this.record.AgeMonth : '';
        specimen.AgeDay = CheckField(this.record.AgeDay) ? this.record.AgeDay : '';
        specimen.Department = this.record.Department;
        specimen.OperatingRoom = this.record.OperatingRoom === null ? '' : this.record.OperatingRoom;
        specimen.OperatingRoomNo = this.record.OperatingRoomNo === null ? '' : this.record.OperatingRoomNo;
        specimen.BedNo = this.record.BedNo === null ? '' : this.record.BedNo;
        specimen.Contagion = this.record.Contagion === null ? '' : this.record.Contagion;
        specimen.ContagionOther = this.record.ContagionOther === null ? '' : this.record.ContagionOther;
        specimen.PathologyCode = this.pathologyCodeType.filter((f) => f.value === this.record.PathologyCode)[0].text;
      });
    },
    // 检查打印对象字段内容是否合规
    CheckPrintField(type, callback) {
      let _isRepetition = false;
      let _repetitionName = '';
      let _timeSpaceError = false;
      let _specimenName = '';
      //检查离体时间是否小于固定时间
      //检查是否存在重复名称
      this.specimendata.forEach((item) => {
        if (this.specimendata.filter((w) => w.SpecimenName === item.SpecimenName).length > 1) {
          _repetitionName = item.SpecimenName;
          _isRepetition = true;
        }
        if (moment(item.LeaveTime) >= moment(item.FixedTime)) {
          _timeSpaceError = true;
          _specimenName = item.SpecimenName;
        }
      });
      if (_timeSpaceError) {
        PromptBox(`【${_specimenName}】离体时间必须小于固定时间`, 'warning', 'topRight', 2);
        return;
      }
      if (_isRepetition) {
        PromptBox(`标本：【${_repetitionName}】存在重复名称`, 'warning', 'topRight', 2);
        return;
      }
      if (type === 'print' && this.selectedRowKeys.length === 0) {
        PromptBox('请选择需要打印的标本', 'warning', 'topRight', 2);
        return;
      }
      if (type === 'save' && this.specimendata.length === 0) {
        PromptBox('没有需要保存的标本', 'warning', 'topRight', 2);
        return;
      }
      const _tempSpecimen = this.specimendata.filter(
        (w) =>
          this.selectedRowKeys.includes(w.key) &&
          (!CheckField(w.LeaveTime) || w.LeaveTime.toString().indexOf('00:00:00') >= 0),
      );
      if (_tempSpecimen.length > 0) {
        PromptBox(`标本“${_tempSpecimen[0].SpecimenName}”离体时间不能为空`, 'warning', 'topRight', 2);
        return;
      }
      if (this.record.PathologyCode !== 'Frozen') {
        const _tempSpecimen2 = this.specimendata.filter(
          (w) => this.selectedRowKeys.includes(w.key) && w.FixedTime.toString().indexOf('00:00:00') >= 0,
        );
        if (this.strategys.property.FixedTime.required === true && _tempSpecimen2.length > 0) {
          PromptBox(`标本“${_tempSpecimen2[0].SpecimenName}”常规送检固定时间不能为空`, 'warning', 'topRight', 2);
          return;
        }
        const _tempSpecimen3 = this.specimendata.filter((w) => CheckField(w.FixLiquid) === false);
        if (_tempSpecimen3.length > 0) {
          PromptBox(`标本“${_tempSpecimen3[0].SpecimenName}”固定液不能为空`, 'warning', 'topRight', 2);
          return;
        }
        const _tempSpecimen = this.specimendata.filter(
          (w) => this.selectedRowKeys.includes(w.key) && (!CheckField(w.FixLiquid) || w.FixLiquid === '无需固定液'),
        );
        if (this.strategys.property.FixedTime.required === true && _tempSpecimen.length > 0) {
          this.$confirm({
            title: '警告',
            content: `标本“${_tempSpecimen[0].SpecimenName}”没有选择合适的固定液，是否继续打印！`,
            onOk() {
              return new Promise((resolve, reject) => {
                callback();
                resolve();
              }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {},
          });
        }
        if (this.LeaveToFixedTime !== '0') {
          for (let i = 0; i < this.specimendata.length; i++) {
            const item = this.specimendata[i];
            const leaveTime = moment(item.LeaveTime);
            const fixedTime = moment(item.FixedTime);
            const diffTime = fixedTime.diff(leaveTime, 'minute');
            if (Number(diffTime) > Number(this.LeaveToFixedTime)) {
              PromptBox(
                `标本${item.SpecimenName}固定时间距离离体时间超过${this.LeaveToFixedTime}分钟`,
                'warning',
                'topRight',
                2,
              );
              return;
            }
          }
        }
        callback();
      } else {
        callback();
      }
    },
  },
};
</script>
<style>
#appprint .ant-card-body {
  padding: 0;
}
</style>
