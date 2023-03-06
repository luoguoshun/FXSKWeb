<template>
  <div>
    <a-card :bordered="false" id="appprint">
      <div :style="{ overflow: 'hidden', position: 'relative' }">
        <a-space>
          <a-button type="primary" icon="plus" @click="addSpecimen" :disabled="btnDisabled"> 新增 </a-button>
          <a-popconfirm placement="rightBottom" ok-text="是" cancel-text="否" @confirm="delSpecimen" :disabled="btnDisabled">
            <template slot="title">
              <p>是否删除</p>
            </template>
            <a-button type="danger" icon="delete" :disabled="btnDisabled"> 删除 </a-button>
          </a-popconfirm>
          <a-button type="primary" @click="saveSpecimen" :disabled="btnDisabled"> 保存 </a-button>
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
          <a-select show-search :value="FixLiquid" style="width: 150px" @change="(e) => handleChange(e, -1, 'AllFixLiquid')" :disabled="btnDisabled">
            <a-select-option v-for="d in fixLiquidType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
          </a-select>
        </a-space>
        <div style="margin: 10px 0"></div>
        <a-table
          :scroll="{ y: 400 }"
          :columns="specimenColumns"
          :data-source="specimendata"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          class="components-table-demo-nested"
        >
          <template
            v-for="col in ['SpecimenCode', 'SpecimenName', 'PartId', 'LeaveTime', 'FixedTime', 'FixLiquid', 'OperatingRoomNo']"
            :slot="col"
            slot-scope="text, index"
          >
            <div :key="col" v-if="col === 'SpecimenCode'">
              <a-input-number style="width: 50px" :value="text" :min="1" :max="9999" @change="(e) => handelCodeChange(e, index, col)" />
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
                <a-select-option v-for="d in specimenNameType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
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
                <a-select-option v-for="d in specimenNameType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
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
                <a-select-option v-for="d in fixLiquidType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
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
            <div :key="col" v-if="col === 'SamplingInfo'">
              {{ record.SamplingInfo }}
            </div>
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>
<script>
import { updateLeaveTime, updateFixedTime } from '@/api/submission/collect';
import { getSpecimenNames } from '@/api/submission/app';
import { delSpecimens } from '@/api/submission/precheck';
import { getCheckPartData } from '@/api/basics/checkpart';
import { RandomString, StringToTime, CheckField, LoadNowTime, TimeToString, PromptBox } from '@/utils/util';
import { getDictByName } from '@/api/system/dictionary';
import enums from '@/store/enum/enum';
import moment from 'moment';
//---------------
import { getSpecimensByMrId, saveSpecimens } from '@/api/examine/application';

const specimenColumns = [
  { title: '标本名称', dataIndex: 'SpecimenName', width: 170, scopedSlots: { customRender: 'SpecimenName' } },
  { title: '标本类型', dataIndex: 'SpecimenType', width: 55, scopedSlots: { customRender: 'SpecimenCode' } },
  { title: '离体时间', dataIndex: 'LeaveTime', width: 130, scopedSlots: { customRender: 'LeaveTime' } },
  { title: '固定时间', dataIndex: 'FixedTime', width: 130, scopedSlots: { customRender: 'FixedTime' } },
  { title: '固定液', dataIndex: 'FixLiquid', width: 130, scopedSlots: { customRender: 'FixLiquid' } },
  { title: '部位', dataIndex: 'PartId', scopedSlots: { customRender: 'PartId' }, width: 150 },
  { title: '取材描述', dataIndex: 'SamplingInfo', scopedSlots: { customRender: 'SamplingInfo' }, width: 70 },
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
  data() {
    return {
      timer,
      btnDisabled: false,
      specimendata: [],
      specimenColumns,
      selectedRowKeys: [],
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
    this.getCheckPartList();
    this.getSpecimenNames('');
    this.LoadSpecimens();
    this.specimendata = [];
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
    getCheckPartList() {
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
      getSpecimensByMrId(this.record.Id).then((res) => {
        const _mainData = [];
        res.forEach((item, index) => {
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
        console.log(this.specimendata);
      });
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
        if (CheckField(obj.LeaveTime) && CheckField(value.target.value) && StringToTime(value.target.value) < StringToTime(obj.LeaveTime)) {
          PromptBox('固定时间不能小于离体时间', 'warning', 'topRight', 2);
          return;
        }
        CheckField(obj.Id) ? this.updateField(obj.Id, column, value.target.value) : this.updateField(obj.key, column, value.target.value);
      }
      if (column === 'LeaveTime') {
        CheckField(obj.Id) ? this.updateField(obj.Id, column, value.target.value) : this.updateField(obj.key, column, value.target.value);
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
    updateField(id, fileName, fileValue) {
      this.specimendata.forEach((item) => {
        if (item.Id === id || item.key === id) {
          item[fileName] = fileValue;
        }
      });
    },
    updateTime(methodName, item, type) {
      if (methodName === 'UpdateFixedTime' && this.record.PathologyCode !== 'Frozen') {
        if (CheckField(item.LeaveTime) && CheckField(item.FixedTime) && StringToTime(item.LeaveTime) > StringToTime(item.FixedTime)) {
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
        id: 0,
        key: key,
        MrId: this.record.Id,
        FixedTime: this.AllFixedTime,
        LeaveTime: this.AllLeaveTime,
        FixLiquid: this.FixLiquid,
        SpecimenName: '',
        SpecimenCode: specimenCode,
        PartId: '',
        PartName: '',
      });
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
    //保存标本（
    saveSpecimen() {
      let _isRepetition = false; //检查标本是否重名
      let _repetitionName = '';
      let _isLess = false;
      this.specimendata.forEach((item) => {
        if (this.specimendata.filter((w) => w.SpecimenName === item.SpecimenName).length > 1) {
          _repetitionName = item.SpecimenName;
          _isRepetition = true;
        }
        if (item.FixedTime < item.LeaveTime) {
          _isLess = true;
        }
      });
      if (_isRepetition) {
        PromptBox(`标本：【${_repetitionName}】存在重复名称`, 'warning');
        return;
      }
      if (_isLess) {
        PromptBox(`标本存在固定时间小于离体时间`, 'warning');
        return;
      }
      // 对没有操作的时间恢复成null状态
      this.specimendata.forEach((item, index) => {
        if (CheckField(item.FixedTime) === true && item.FixedTime.toString().indexOf('00:00:00') >= 0) {
          this.specimendata[index].FixedTime = null;
        }
        if (CheckField(item.LeaveTime) === true && item.LeaveTime.toString().indexOf('00:00:00') >= 0) {
          this.specimendata[index].LeaveTime = null;
        }
      });
      saveSpecimens(this.specimendata).then((res) => {
        if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
          // this.specimendata = [];
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
            // this.specimendata.push(item);
          });
          if (this.record.PathologyCode === 'Frozen') {
            this.specimendata.forEach((item, i) => {
              this.specimendata[i].FixedTime = null;
            });
          }
          PromptBox('操作成功！', 'success', 'topRight', 2);
        } else {
          PromptBox(res.Message, 'warning', 'topRight', 2);
        }
      });
    },
  },
};
</script>
<style>
#appprint .ant-card-body {
  padding: 0;
}
</style>
