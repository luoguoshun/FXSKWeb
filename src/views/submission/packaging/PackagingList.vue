<template>
  <div>
    <a-card :bordered="false">
      <a-tabs default-active-key="2" @change="callback">
        <!-- 已经打包的数据 -->
        <a-tab-pane key="1" tab="已打包">
          <a-row>
            <a-col span="24">
              <a-space>
                <a-date-picker @change="onChangeBegin" v-model="filter.startDate" placeholder="开始运送时间" />
                <a-date-picker @change="onChangeEnd" v-model="filter.endDate" placeholder="结束运送时间" />
                <a-input class="ant-input" v-model="filter.sendNo" placeholder="输入送检号" />
                <a-select placeholder="选择类型" v-model="filter.sendStatus" style="width: 100px">
                  <a-select-option v-for="d in keyTypeDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
                </a-select>
                <a-button type="primary" icon="search" @click="packLoad()">查询</a-button>
                <a-divider type="vertical" />
                <a-button type="primary" icon="printer" @click="printOrder()">打印清单</a-button>
                <a-button type="default" icon="printer" @click="printLabel()">打印标签</a-button>
                <a-button type="primary" icon="printer" @click="print()">打印申请单</a-button>
                <a-button type="default" icon="reload" @click="load(1, 10)">刷新</a-button>
              </a-space>
            </a-col>
          </a-row>
          <div style="margin: 10px 0"></div>
          <a-table
            :columns="packColumns"
            rowKey="Id"
            :data-source="packData"
            :pagination="pagination2"
            :expandedRowKeys="curExpandedRowKeys"
            @change="handleTableChange2"
            @expand="expand"
            :row-selection="{ selectedRowKeys: selectedRowKeys2, onChange: onSelectChange2 }"
            class="components-table-demo-nested"
          >
            <template slot="ShippingStatus" slot-scope="text">
              <span v-if="text == 0"
                ><span class="ant-badge-status-dot ant-badge-status-default"></span><span class="ant-badge-status-text">未运送</span></span
              >
              <span v-if="text == 1"
                ><span class="ant-badge-status-dot ant-badge-status-success"></span><span class="ant-badge-status-text">运送中</span></span
              >
              <span v-if="text == 2"
                ><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">已送达</span></span
              >
              <span v-if="text == 3"
                ><span class="ant-badge-status-dot ant-badge-status-error"></span><span class="ant-badge-status-text">退回</span></span
              >
            </template>
            <template slot="SendNo" slot-scope="text">
              <a style="font-weight: bold; color: #1890ff">{{ text }}</a>
            </template>
            <span slot="operation" slot-scope="text, record">
              <template>
                <a @click="edit(record)">标本列表</a>
                <a-divider type="vertical" />
                <a @click="progress(record)" style="color: blue">进度</a>
              </template>
            </span>
            <!-- 嵌套子表格 -->
            <a-table slot="expandedRowRender" :columns="innerColumns" :data-source="innerData" :pagination="false">
              <span slot="operation" slot-scope="text, record">
                <template>
                  <a @click="trace(record)">轨迹</a>
                </template>
              </span>
            </a-table>
          </a-table>
        </a-tab-pane>
        <!-- 未打包的数据 -->
        <a-tab-pane key="2" tab="未打包" force-render>
          <div id="notpack_main" ref="Table">
            <a-table
              :columns="columns"
              rowKey="Id"
              :pagination="false"
              :data-source="data"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
              @change="handleTableChange"
              class="components-table-demo-nested"
            >
              <template slot="IsConfirm" slot-scope="text">
                <span v-if="text === false"
                  ><span class="ant-badge-status-dot ant-badge-status-default"></span><span class="ant-badge-status-text">否</span></span
                >
                <span v-if="text === true"
                  ><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">是</span></span
                >
              </template>
              <template slot="Sex" slot-scope="text">
                <span v-if="text == 0"><span class="ant-badge-status-text" style="color: #096dd9">男</span></span>
                <span v-if="text == 1"><span class="ant-badge-status-text" style="color: #f198aa">女</span></span>
              </template>
              <template slot="AppNo" slot-scope="text, row">
                <a v-if="row.AppStatus === '0'" style="font-weight: bold; color: red" @click="submit()">{{ text }}</a>
                <a v-else style="font-weight: bold; color: #1890ff">{{ text }}</a>
              </template>
              <template slot="LeaveTime" slot-scope="text">
                <span v-if="text === null" style="font-weight: bold; color: red">离体时间异常</span>
                <span v-else>{{ moment(text).format('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
              <template slot="FixedTime" slot-scope="text">
                <span v-if="text === null" style="font-weight: bold; color: red">固定时间异常</span>
                <span v-else>{{ moment(text).format('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
              <template slot="PathologyCode" slot-scope="text">
                <span v-for="d in pathologyType" :key="d.value" :value="d.value">
                  <span v-if="text == d.value">{{ d.text }}</span>
                </span>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
        <a-space slot="tabBarExtraContent">
          <!-- <a-alert message="如果扫描无反应，请用鼠标点击此区域" banner /> -->
          申请单数：<a-tag color="#2db7f5">{{ appOrderTotal }}</a-tag> 未确认数：<a-tag color="#f50">{{ notConfirm }}</a-tag> 已确认数：<a-tag
            color="#87d068"
            >{{ isConfirm }}</a-tag
          >
          <a-input-search ref="No" placeholder="输入住院号或标本号" v-model="No" style="width: 200px; bottom: 0" enter-button @search="onSearch" />
          <a-input v-model="UnitedSubmitterCode" v-if="UnitedSubmitterCodeVisible" style="width: 150px" placeholder="打包人工号1" />
          <a-input v-model="SubmitterCode" v-if="UnitedSubmitterCodeVisible" style="width: 150px" placeholder="打包人工号2" />
          <a-button type="primary" icon="check" @click="packaging()">一键打包</a-button>
          <Help :helpTitle="'打包操作说明'" :helpCode="'PackageOperationHelp'" :content="''" />
        </a-space>
      </a-tabs>
      <div style="margin: 10px 0; position: absolute; z-index: -9999">
        <div ref="print" id="print_main"></div>
      </div>
    </a-card>
    <!-- <k-form-build id="form" ref="kfb" :value="jsonData" :dynamicData="dynamicData" style="display:none;"/> -->
  </div>
</template>

<script>
import { getSendPackages, createPackage, getPackageSpecimens, GetAppSpecimensByNo, GetPackgedPrintInfo } from '@/api/submission/packaging';
import Trace from '@/views/submission/speciment/Trace';
import { getSpecimens } from '@/api/other/other';
import { BrowserPrintInit } from '@/utils/BrowserPrint.js';
import moment from 'moment';
import { Scaner } from '@/utils/scan';
import { getPrintLabelTemplate } from '@/api/submission/precheck';
import Help from '@/components/Help/HelpShowInfo';
import { getAppOrderNewsForPrint } from '@/api/submission/app';
import { getTemplateByCode } from '@/api/system/pageTemplate';
import { CheckField, JSONStringToObject, ObjectToJSONString, FormartDataTemplet, PromptBox } from '@/utils/util';
import Print from '@/utils/print';
import { getPathologyTypes } from '@/api/system/dictionary';
import ComponentInitializer from '@/core/components/componentRegistrar';
import { getStrategyTemplate } from '@/api/system/strategy';

const data = []; // 一级列表数据
const packData = []; // 一级列表数据
const innerData = [];
const columns = [
  { title: '申请单号', dataIndex: 'AppNo', scopedSlots: { customRender: 'AppNo' } },
  { title: '是否确认', dataIndex: 'IsConfirm', scopedSlots: { customRender: 'IsConfirm' } },
  { title: '送检类型', dataIndex: 'PathologyCode', scopedSlots: { customRender: 'PathologyCode' } },
  { title: '患者姓名', dataIndex: 'PatientName' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '性别', dataIndex: 'Sex', scopedSlots: { customRender: 'Sex' } },
  { title: '标本编号', dataIndex: 'Id' },
  { title: '标本名称', dataIndex: 'SpecimenName' },
  { title: '离体时间', dataIndex: 'LeaveTime', scopedSlots: { customRender: 'LeaveTime' } },
  { title: '固定时间', dataIndex: 'FixedTime', scopedSlots: { customRender: 'FixedTime' } },
  { title: '固定液', dataIndex: 'FixLiquid' },
  { title: '手术间', dataIndex: 'OperatingRoomNo' },
  { title: '所属部位', dataIndex: 'PartName' },
];
// 运送状态（0未运送，1运送中，2已送达，3退回）
const packColumns = [
  { title: '送检号', dataIndex: 'SendNo', scopedSlots: { customRender: 'SendNo' } },
  { title: '状态', dataIndex: 'ShippingStatus', scopedSlots: { customRender: 'ShippingStatus' } },
  { title: '申请单数量', dataIndex: 'AppOrderTotal' },
  { title: '标本数量', dataIndex: 'SpecimenCount' },
  {
    title: '开始时间',
    dataIndex: 'ShippingStartTime',
    customRender: (val) => {
      return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '';
    },
  },
  {
    title: '结束时间',
    dataIndex: 'ShippingEndTime',
    customRender: (val) => {
      return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '';
    },
  },
  { title: '科室', dataIndex: 'DeptName' },
  { title: '打包人', dataIndex: 'Submitter' },
  { title: '运送人', dataIndex: 'Shipper' },
  { title: '打包时间', dataIndex: 'CreatedTime' },
  { title: '备注', dataIndex: 'Remark' },
];
const innerColumns = [
  { title: '标本名称', dataIndex: 'SpecimenName' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
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
    Trace,
    Help,
  },
  data() {
    return {
      data,
      columns,
      packData, //
      packColumns,
      innerData,
      innerColumns,
      selectedRowKeys: [],
      selectedRowKeys2: [],//选中标本行集合
      packagingData: [],
      packagingData2: [],
      pagination2: {
        pageSize: 10,
        current: 1,
        total: 0,
      },
      filter: {
        sendNo: '',
        sendStatus: '',
        startDate: '',
        isSend: true,
        endDate: '',
      },
      keyTypeDatas: [
        { value: '', text: '请选择' },
        { value: '0', text: '未运送' },
        { value: '1', text: '运送中' },
        { value: '2', text: '已完成' },
        { value: '3', text: '退回' },
      ],
      selectedDevice: {},
      devices: [],
      No: '',
      isConfirm: 0,
      notConfirm: 0,
      appOrderTotal: 0,
      packScanData: [],
      printLableTemplateApply: '',
      pathologyType: [],
      jsonData: {
        list: [],
        config: {},
      },
      dynamicData: {
        Specimens: [],
      },
      UnitedSubmitterCode: '',
      SubmitterCode: '',
      UnitedSubmitterCodeVisible: false,
      strategys: {},
      curExpandedRowKeys: [],
      lastScanTime: null,
    };
  },
  created: function () {
    ComponentInitializer();
    // 初始化扫码枪
    // Scaner(this.scanCallBack)
    this.data = [];
    this.initialize();
    this.packLoad();
    this.loadConfig();
  },
  computed: {},
  beforeRouteEnter(to, form, next) {
    // 切换页面的时候重新加载扫码
    next((vm) => {
      // 初始化扫码枪
      Scaner(vm.scanCallBack);
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.No.focus();
    });
    // 初始化浏览器打印事件
    BrowserPrintInit(this);
  },
  methods: {
    initialize() {
      //获取病理类型
      getPathologyTypes().then((res) => {
        if (CheckField(res)) {
          res.forEach((item) => {
            this.pathologyType.push({ text: item.Name, value: item.Content });
          });
        }
      });
      //获取模板代码
      getTemplateByCode('Preview').then((res) => {
        this.jsonData = JSON.parse(res.data.Content);
      });
      //获取策略模板
      getStrategyTemplate('Packaging').then((res) => {
        this.strategys = JSONStringToObject(res.Content).property;
        if (CheckField(this.strategys) && CheckField(this.strategys.UnitedSubmitter.visible)) {
          this.UnitedSubmitterCodeVisible = this.strategys.UnitedSubmitter.visible;
        }
      });
    },
    print() {
      const $this = this;
      if (this.selectedRowKeys2.length === 0) {
        PromptBox('请选择打印项', 'warning');
        return;
      }
      getAppOrderNewsForPrint($this.selectedRowKeys2.join(',')).then((res) => {
        _tempPrint(res.data, 0);
      });
      function _tempPrint(data, i) {
        window.setTimeout(() => {
          const _tempData = data[i];
          $this.dynamicData.Specimens = _tempData.Specimens;
          const _temp = ObjectToJSONString(_tempData);
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
          const _pathologyType = $this.pathologyType.filter((f) => f.value === _tempObj.PathologyCode);
          if (CheckField(_pathologyType) && _pathologyType.length > 0) {
            _tempObj.PathologyCode = _pathologyType[0].text;
          }
          $this.$refs.kfb.reset();
          $this.$refs.kfb.setData(_tempObj);
          setTimeout(() => {
            // 这里由于将表单打印模板隐藏起来，需要对其进行克隆，然后将克隆dom设为可视，最后进行打印
            const dom = document.getElementById('form');
            const dom2 = dom.cloneNode(true);
            dom2.setAttribute('style', 'display: block;');
            Print(dom2);
          }, 500);
          // 如果下个索引超出了当前标本列表长度则不继续打印
          if (i + 1 < data.length) {
            _tempPrint(data, i + 1);
          }
        }, 500);
      }
    },
    loadConfig() {
      getPrintLabelTemplate('Routine', 'Packaging').then((res) => {
        if (res && res.Data) {
          this.printLableTemplateApply = res.Data.Templet;
        }
      });
    },
    moment,
    onSearch() {
      this.scan(this.No);
    },
    refreshScanTotal(isReload = false) {
      let _isScanTotal = 0;
      let _isNotScanTotal = 0;
      this.data.forEach((item, index) => {
        if (item.IsConfirm) {
          _isScanTotal += 1;
        } else {
          _isNotScanTotal += 1;
        }
      });
      this.isConfirm = _isScanTotal;
      this.notConfirm = _isNotScanTotal;
      if (this.notConfirm === 0 && isReload === false) {
        PromptBox('所有标本都完成确认', 'success', 'bottomRight');
        this.data.forEach((item) => {
          this.selectedRowKeys.push(item.Id);
          this.packagingData.push(item);
        });
      }
      // 更新申请单数量
      const _tempOrder = [];
      this.data.forEach((item) => {
        if (_tempOrder.filter((f) => f === item.AppNo).length === 0) {
          _tempOrder.push(item.AppNo);
        }
      });
      this.appOrderTotal = _tempOrder.length;
    },
    callback(key) {
      if (key === 1) {
        this.load();
      } else {
        this.packLoad();
      }
    },
    //展开记录时加载标本信息
    expand(expanded, record) {
      if (this.curExpandedRowKeys.length > 0 && this.curExpandedRowKeys[0] === record.Id) {
        this.curExpandedRowKeys = [];
      } else {
        this.curExpandedRowKeys = [record.Id];
        getPackageSpecimens(record.Id).then((res) => {
          res.data.forEach((item, index) => {
            item.key = index + 1;
          });
          this.innerData = res.data;
        });
      }
    },
    //打包
    packaging() {
      if (this.selectedRowKeys.length === 0) {
        PromptBox('请选择要打包的记录', 'warning', 'bottomRight');
        return;
      }
      const pdata = this.packagingData.filter((w) => w.IsConfirm === false);
      if (pdata && pdata.length >= 1) {
        PromptBox('存在未确认的记录，请检查', 'warning', 'bottomRight');
        return;
      }
      if (CheckField(this.strategys) && CheckField(this.strategys.UnitedSubmitter.required) && CheckField(this.UnitedSubmitterCode) === false) {
        PromptBox('请输入打包人工号1', 'warning', 'bottomRight');
        return;
      }
      if (CheckField(this.strategys) && CheckField(this.strategys.Submitter.required) && CheckField(this.SubmitterCode) === false) {
        PromptBox('请输入打包人工号2', 'warning', 'bottomRight');
        return;
      }
      //打包数组去重
      const _tempData = [];
      this.packagingData.forEach((item) => {
        if (_tempData.filter((w) => w.Id === item.Id).length === 0) {
          _tempData.push(item);
        }
      });
      this.packagingData = _tempData;
      const $this = this;
      this.$confirm({
        title: '标本打包',
        content: '确定打包标本',
        centered: true,
        onOk() {
          createPackage({ Specimens: $this.packagingData, UnitedSubmitterCode: $this.UnitedSubmitterCode, SubmitterCode: $this.SubmitterCode }).then(
            (res) => {
              if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
                PromptBox('操作成功！', 'success', 'bottomRight');
                const _tempData = $this.data.filter((w) => !$this.selectedRowKeys.includes(w.Id));
                $this.printLabel2();//打印未打印的标签
                $this.data = _tempData;
                $this.refreshScanTotal(true);
                // #region 清理数据
                $this.appOrderTotal = 0;
                $this.notConfirm = 0;
                $this.isConfirm = 0;
                $this.data = [];
                $this.packagingData = [];
                $this.selectedRowKeys2 = [];
                $this.selectedRowKeys = [];
                // #endregion
                return new Promise((resolve) => {
                  setTimeout(() => {
                    resolve(true);
                  }, 1000);
                });
              } else {
                PromptBox(res.Message, 'error', 'bottomRight');
                return new Promise((resolve) => {
                  resolve(true);
                });
              }
            },
          );
        },
      });
    },
    scanCallBack(code) {
      this.scan(code);
    },
    scan(code) {
      this.No = '';
      // #region 对扫描枪短时间重复扫描进行处理
      if (this.lastScanTime === null) {
        this.lastScanTime = new Date().valueOf();
      } else {
        const nowScanTime = new Date().valueOf();
        if (nowScanTime - this.lastScanTime < 50) {
          return;
        }
        this.lastScanTime = nowScanTime;
      }
      // #endregion
      let id = 0;
      const $this = this;
      // 申请单号
      if (code.toString().indexOf('---') === 0) {
        this.loadScanDataByNo(code, (data) => {
          data.forEach((item) => {
            item.IsConfirm = true;
            // this.updateField(item.Id, 'IsConfirm', true)
          });
          this.refreshScanTotal();
        });
        return;
      } else if (code.toString().indexOf('--') === 0) {
        return;
      } else if (code.toString().indexOf('-') === 0) {
        id = Number(code.substring(1));
        if (this.data.filter((w) => w.Id === id).length === 0) {
          this.loadScanDataByNo(code, (data) => {
            data = data[0];
            this.packScanData.push(data.AdmissionNum);
            this.packScanData.push(data.OutpatientNum);
            this.updateField(id, 'IsConfirm', true);
            this.refreshScanTotal();
          });
        } else {
          this.updateField(id, 'IsConfirm', true);
          this.refreshScanTotal();
        }
      } else {
        id = Number(code);
        if (id < 1) return;
        this.loadScanDataByNo(code, (data) => {
          data = data[0];
          if ($this.packScanData.filter((f) => f === data.AdmissionNum).length === 0) {
            $this.packScanData.push(data.AdmissionNum);
          }
          if ($this.packScanData.filter((f) => f === data.OutpatientNum).length === 0) {
            $this.packScanData.push(data.OutpatientNum);
          }
        });
        return;
      }
    },
    loadScanDataByNo(code, callBack) {
      const $this = this;
      GetAppSpecimensByNo(code).then((res) => {
        console.log(res);
        if (res.code === -1 && res.Message === '该申请单未缴费') {
          PromptBox(res.Message, 'warning', 'bottomRight');
          return;
        }
        if (res.code === -1) {
          PromptBox(res.Message, 'warning', 'bottomRight');
          return;
        }
        if (res && res.data && res.data.length === 0) {
          PromptBox(`申请单编号【${code}】已打包`, 'warning', 'bottomRight');
          return;
        }
        res.data.forEach((item, index) => {
          item.key = index + 1;
          if ($this.data.filter((w) => w.Id === item.Id).length === 0) {
            $this.data.push(item);
          }
        });
        // $this.$refs.No.blur()
        callBack(res.data);
      });
    },
    updateField(id, fileName, fileValue) {
      if (this.data.filter((w) => w.Id === id && w.IsConfirm === true).length > 0) {
        PromptBox('该标本已确认', 'warning', 'bottomRight');
        return;
      }
      let _index = 0;
      this.data.forEach((item, index) => {
        if (item.Id === id) {
          _index = index;
          item[fileName] = fileValue;
        }
      });
      const _tempObj = this.data[_index];
      for (let i = _index - 1; i >= 0; i--) {
        this.data[i + 1] = this.data[i];
      }
      this.data[0] = _tempObj;
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
    //打包数据加载
    packLoad() {
      const $this = this;
      if (this.filter.endDate && this.filter.startDate && this.filter.endDate < this.filter.startDate) {
        PromptBox('结束时间不能小于开始时间', 'warning', 'bottomRight');
        return;
      }
      getSendPackages(this.filter, this.pagination2.current, this.pagination2.pageSize).then((res) => {
        const _mainData = [];
        res.data.forEach((item, index) => {
          item.key = index + 1;
          _mainData.push(item);
        });
        $this.packData = _mainData;
        $this.pagination2.total = res.count;
      });
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.load();
    },
    handleTableChange2(pagination, filters, sorter) {
      const pager = { ...this.pagination2 };
      pager.current = pagination.current;
      this.pagination2 = pager;
      this.packLoad();
    },
    //选中要打包的数据
    onSelectChange(selectedRowKeys, obj) {
      this.packagingData = [];
      this.selectedRowKeys = selectedRowKeys;
      selectedRowKeys.forEach((item) => {
        this.data.forEach((obj) => {
          if (item === obj.Id) {
            this.packagingData.push(obj);
          }
        });
      });
    },
    onSelectChange2(selectedRowKeys2, obj) {
      this.packagingData2 = [];
      this.selectedRowKeys2 = selectedRowKeys2;
      selectedRowKeys2.forEach((item) => {
        this.packData.forEach((obj) => {
          if (item === obj.Id) {
            this.packagingData2.push(obj);
          }
        });
      });
    },
    onChangeBegin(date) {
      this.filter.startDate = date;
    },
    onChangeEnd(date) {
      this.filter.endDate = date;
    },
    printLabel() {
      this.printLabelTemp(this.selectedRowKeys2.join(','), 'packag');
    },
    printLabel2() {
      this.printLabelTemp(this.selectedRowKeys.join(','), 'unPackag');
    },
    printLabelTemp(ids, type) {
      const $this = this;
      GetPackgedPrintInfo(ids, type).then((res) => {
        if (res.data.Data.length > 0) {
          setTimeout(() => {
            printTimer($this, res.data.Data, 0);
          }, 500);
        }
      });
      function printTimer($this, data, index) {
        const item = data[index];
        var printData =
          '^XA^CW1,E:SIMSUN.FNT^CI28' +
          '^FO20,20^A1,30,30^FD' +
          item.SendNo +
          '[' +
          item.Total +
          ']^FS' +
          '^FO20,55^A1,30,30^FD' +
          item.DeptName +
          '^FS' +
          '^FO20,90^A1,30,30^FD标本数=' +
          item.SpecimenCount +
          '^FS' +
          '^FO20,120^A1,30,30^FD第' +
          item.OperatingRoomNo +
          '手术间^FS' +
          '^FO220,30^BQN,3,4^FDMM,A' +
          ('--' + item.Id) +
          '^FS' +
          '^FO220,125^A1,30,30^FD' +
          ('--' + item.Id) +
          '^FS' +
          '^PQ1^XZ';
        if ($this.printLableTemplateApply !== '') {
          const tempObj = $this.printLableTemplateApply;
          printData = FormartDataTemplet(tempObj, item);
        }
        if (CheckField(printData)) {
          $this.GLOBAL.selectedDevice.send(printData, undefined, errorCallback);
        }
        if (index + 1 < data.length) {
          setTimeout(() => {
            printTimer($this, data, index + 1);
          }, 1000);
        }
      }
      function errorCallback(errorMessage) {
        if (errorMessage === 'Failed to write to device') {
          PromptBox('请检查打印机连接是否正确！', 'warning');
        }
      }
    },
    printOrder() {
      const $this = this;
      if (this.selectedRowKeys2.length === 0) {
        PromptBox('请先勾选要打印的记录', 'warning');
        return;
      }
      getSpecimens({ Ids: this.selectedRowKeys2 }).then((res) => {
        for (let i = 0; i < $this.selectedRowKeys2.length; ++i) {
          const data = $this.packData.filter((w) => w.Id === $this.selectedRowKeys2[i])[0];
          const ShippingStartTime = data.ShippingStartTime === null ? '' : data.ShippingStartTime;
          const Shipper = data.Shipper === null ? '' : data.Shipper;
          const htmltemp =
            '<table class="layui-table">' +
            '<tr><td colspan="2"><span style="color:#000">送检号：</span>' +
            data.SendNo +
            '</td><td colspan="2"><span style="color:#000">开始时间：</span>' +
            ShippingStartTime +
            '</td><td><span style="color:#000">运送人：</span>' +
            Shipper +
            '</td></tr>' +
            '<tbody>';
          $this.PrintSpecimens(data.Id, res, htmltemp);
        }
      });
    },
    PrintSpecimens(pid, data, htmltemp) {
      htmltemp =
        htmltemp +
        '<tr style="background-color:gray; color:#000"><td>标本名称</td><td>离体时间</td><td>固定时间</td><td>固定液</td><td>所属部位</td></tr>';
      for (let i = 0; i < data.length; ++i) {
        if (pid !== data[i].SendId) {
          continue;
        }
        const LeaveTime = data[i].LeaveTime == null ? '' : data[i].LeaveTime;
        const FixedTime = data[i].FixedTime == null ? '' : data[i].FixedTime;
        const FixLiquid = data[i].FixLiquid == null ? '' : data[i].FixLiquid;
        const PartName = data[i].PartName == null ? '' : data[i].PartName;
        htmltemp =
          htmltemp +
          '<tr><td>' +
          data[i].SpecimenName +
          '</td><td>' +
          moment(LeaveTime).format('YYYY-MM-DD HH:mm:ss') +
          '</td><td>' +
          moment(FixedTime).format('YYYY-MM-DD HH:mm:ss') +
          '</td><td>' +
          FixLiquid +
          '</td><td>' +
          PartName +
          '</td></tr>';
      }
      htmltemp = htmltemp + '</tbody></table>';
      const tempNode = document.createElement('div');
      tempNode.innerHTML = htmltemp;
      this.$print(tempNode);
    },
  },
};
</script>
<style>
.ant-tabs-extra-content {
  line-height: 0;
}
</style>
