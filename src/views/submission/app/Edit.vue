<template>
  <!-- 注释：v-decorator虽然以V开头但是他并不是vue自定义的组件（ant-design-vue）
  获取表单数据时使用v-decorator方式去给每个项注册，这样不仅可以通过组件去拉取表单数据，同时对必填项做**校验 ** -->
  <a-form
    :disabled="record.IsAppendApply"
    class="applyedit"
    ref="appNoEdit"
    :form="form"
    :layout="layout"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
    <!-- <a-form-item v-show="false" label="主键ID">
      <a-input v-decorator="['Id', { initialValue: record.Id }]" disabled />
    </a-form-item>
    <a-form-item v-show="false" label="状态">
      <a-input v-decorator="['Status', { initialValue: record.Status }]" disabled />
    </a-form-item>
    <a-form-item v-show="false" label="HisId">
      <a-input v-decorator="['HisID', { initialValue: record.HisID }]" disabled />
    </a-form-item>
    <a-form-item v-show="false" label="ReqDateTime">
      <a-input v-decorator="['ReqDateTime', { initialValue: record.ReqDateTime }]" disabled />
    </a-form-item>
    <a-form-item v-show="false" label="HisSheetId">
      <a-input v-decorator="['HisSheetId', { initialValue: record.HisSheetId }]" disabled />
    </a-form-item>
    <a-form-item v-show="false" label="MzNo">
      <a-input v-decorator="['MzNo', { initialValue: record.MzNo }]" disabled />
    </a-form-item>
    <a-form-item v-show="false" label="ZyNo">
      <a-input v-decorator="['ZyNo', { initialValue: record.ZyNo }]" disabled />
    </a-form-item>
    <a-form-item v-show="false" label="Birthday">
      <a-input v-decorator="['Birthday']" disabled />
    </a-form-item> -->
   
    <!-- 基础条件 -->
    <a-row>
      <a-col :span="8">
        <a-input-group compact>
          <a-select v-model="keyType" style="width: 25%">
            <a-select-option value="1"> 病人ID </a-select-option>
            <a-select-option value="2"> 住院号 </a-select-option>
            <a-select-option value="3"> 门诊号 </a-select-option>
            <a-select-option value="7"> 手腕码 </a-select-option>
          </a-select>
          <a-input-search
            :disabled="record.IsAppendApply"
            v-model="key"
            style="width: 75%; top: 0px"
            placeholder="输入病人ID\住院号\门诊号"
            enter-button
            @search="onSearch"
          />
        </a-input-group>
      </a-col>
      <a-col :span="4">
        <a-form-item label="" v-if="this.strategys.property.Appointment.visible">
          <a-checkbox
            style="margin-left: 10px"
            v-decorator="[
              'Appointment',
              {
                rules: [{ required: this.strategys.property.Appointment.required }],
                valuePropName: 'checked',
              },
            ]"
            @change="changeAppointment"
          >
            冰冻预约
          </a-checkbox>
        </a-form-item>
      </a-col>
      <a-col :span="6" v-if="appointmentVisible">
        <a-form-item label="预约日期" v-if="this.strategys.property.Appointment.visible">
          <a-date-picker
            v-decorator="[
              'AppointmentDate',
              {
                rules: [
                  {
                    required: this.strategys.behaviorProperty.AppointmentDate.required,
                    message: '请选择预约日期',
                  },
                ],
                valuePropName: 'checked',
              },
            ]"
            :value="AppointmentDate"
            placeholder="预约日期"
            @change="onAppointmentDateChange"
          />
        </a-form-item>
      </a-col>
      <a-col :span="6" v-if="appointmentVisible">
        <a-form-item label="" v-if="this.strategys.property.Appointment.visible">
          <a-input
            style="width: 60px"
            placeholder="输入预约时间"
            draggable="true"
            :value="AppointmentTime"
            @click="inputClick"
            @keyup="(e) => inputChange(e)"
            @blur="(e) => blurChange(e, 0, 'AppointmentTime')"
            @pressEnter="(e) => blurChange(e, 0, 'AppointmentTime')"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-divider />
   <!-- 信息搜集 --> 
    <a-collapse v-model="activeKey">
      <a-collapse-panel key="1" header="患者信息">
        <a-row>
          <a-col :span="7">
            <a-form-item label="患者姓名">
              <a-input
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'PatientName',
                  {
                    rules: [
                      {
                        required: this.strategys.property.PatientName.required,
                        message: '请输入患者姓名',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-input-group compact>
              <a-form-item label="年龄">
                <a-input
                  style="width: 35%"
                  :disabled="record.IsAppendApply"
                  v-decorator="[
                    'AgeYear',
                    {
                      rules: [{ required: this.strategys.property.AgeYear.required, message: '岁' }],
                    },
                  ]"
                  default-value=""
                  addon-after="岁"
                />
                <a-input
                  style="width: 35%"
                  :disabled="record.IsAppendApply"
                  v-decorator="[
                    'AgeMonth',
                    {
                      rules: [{ required: this.strategys.property.AgeMonth.required, message: '月' }],
                    },
                  ]"
                  default-value="0"
                  addon-after="月"
                />
                <a-input
                  style="width: 30%"
                  :disabled="record.IsAppendApply"
                  v-decorator="[
                    'AgeDay',
                    {
                      rules: [{ required: this.strategys.property.AgeDay.required, message: '日' }],
                    },
                  ]"
                  default-value="0"
                  addon-after="日"
                />
              </a-form-item>
            </a-input-group>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="性别">
              <a-radio-group
                :disabled="record.IsAppendApply"
                name="Sex"
                v-decorator="[
                  'Sex',
                  {
                    rules: [{ required: this.strategys.property.Sex.required, message: '请选择性别' }],
                  },
                ]"
              >
                <a-radio :value="'0'"> 男 </a-radio>
                <a-radio :value="'1'"> 女 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="7">
            <a-form-item label="民族">
              <a-select
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'Nation',
                  {
                    rules: [{ required: this.strategys.property.Nation.required, message: '请输入民族' }],
                  },
                  { initialValue: record.Nation },
                ]"
              >
                <a-select-option v-for="d in nationType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="手机号">
              <a-input
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'MobileNo',
                  {
                    rules: [
                      {
                        required: this.strategys.property.MobileNo.required,
                        message: '请输入手机号',
                      },
                    ],
                  },
                  { initialValue: record.MobileNo },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="身份证">
              <a-input
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'IDCard',
                  {
                    rules: [
                      {
                        required: this.strategys.property.IDCard.required,
                        message: '请输入身份证',
                      },
                    ],
                  },
                  { initialValue: record.IDCard },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="地址" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
              <a-input
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'Address',
                  {
                    rules: [{ required: this.strategys.property.Address.required, message: '请输入地址' }],
                  },
                  { initialValue: record.Address },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="7">
            <a-form-item label="病人ID">
              <a-input
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'HisNo',
                  {
                    rules: [{ required: this.strategys.property.HisNo.required, message: '请输入病人ID' }],
                  },
                  { initialValue: record.HisNo },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="家属姓名">
              <a-input
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'KinName',
                  {
                    rules: [
                      {
                        required: this.strategys.property.KinName.required,
                        message: '请输入家属姓名',
                      },
                    ],
                  },
                  { initialValue: record.KinName },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="家属手机号">
              <a-input
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'KinMobile',
                  {
                    rules: [
                      {
                        required: this.strategys.property.KinMobile.required,
                        message: '请输入家属手机号',
                      },
                    ],
                  },
                  { initialValue: record.KinMobile },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="7">
            <a-form-item label="门诊号">
              <a-input
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'OutpatientNum',
                  {
                    rules: [
                      {
                        required: this.strategys.property.OutpatientNum.required,
                        message: '请输入门诊号',
                      },
                    ],
                  },
                  { initialValue: record.OutpatientNum },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="住院号">
              <a-input
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'AdmissionNum',
                  {
                    rules: [
                      {
                        required: this.strategys.property.AdmissionNum.required,
                        message: '请输入住院号',
                      },
                    ],
                  },
                  { initialValue: record.AdmissionNum },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="床号">
              <a-input
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'BedNo',
                  {
                    rules: [{ required: this.strategys.property.BedNo.required, message: '请输入床号' }],
                  },
                  { initialValue: record.BedNo },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="this.strategys.property.MenstrualTime.visible">
          <a-col :span="7">
            <a-form-item label="手腕码">
              <a-input
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'InpatientWristCode',
                  {
                    rules: [
                      {
                        required: this.strategys.property.InpatientWristCode.required,
                        message: '请输入手腕码',
                      },
                    ],
                  },
                  { initialValue: record.InpatientWristCode },
                ]"
                show-time
                placeholder="手腕码"
              />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="末次月经">
              <a-date-picker
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'MenstrualTime',
                  {
                    rules: [
                      {
                        required: this.strategys.property.MenstrualTime.required,
                        message: '请选择末次月经',
                      },
                    ],
                  },
                  { initialValue: record.MenstrualTime },
                ]"
                show-time
                placeholder="末次月经"
              />
            </a-form-item>
          </a-col>
          <a-col :span="3">
            <a-form-item label="" class="flag" style="margin-left: 10px">
              <a-checkbox v-model="IsMenstrualTime" @change="changeMenstraul">否 </a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="this.strategys.property.TackAway.visible">
          <a-col :span="3">
            <a-form-item label="" class="flag" style="margin-left: 10px">
              <a-checkbox @change="changeTackAway">外带申请单 </a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="检查信息">
        <a-row>
          <a-col :span="7">
            <a-form-item label="送检类型">
              <a-select
                @change="pathologyCodeChange"
                :disabled="record.IsAppendApply"
                id="PathologyCode"
                v-decorator="[
                  'PathologyCode',
                  {
                    rules: [
                      {
                        required: this.strategys.property.PathologyCode.required,
                        message: '请输入送检类型',
                      },
                    ],
                  },
                  { initialValue: record.PathologyCode },
                ]"
              >
                <a-select-option v-for="d in pathologyCodeType" :key="d.value" :value="d.value">{{
                  d.text
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="检查项目">
              <a-select
                mode="combobox"
                :allow-clear="true"
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'ExamItem',
                  {
                    rules: [
                      {
                        required: this.strategys.property.ExamItem.required,
                        message: '请输入检查项目',
                      },
                    ],
                  },
                  { initialValue: record.ExamItem },
                ]"
              >
                <a-select-option v-for="d in examItemType" :key="d.value" :value="d.value">{{
                  d.text
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="申请科室">
              <a-select
                show-search
                option-filter-prop="children"
                @change="(e) => fieldsChange(e, 'SendDepartment')"
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'SendDepartment',
                  {
                    rules: [
                      {
                        required: this.strategys.property.SendDepartment.required,
                        message: '请输入送检科室',
                      },
                    ],
                  },
                  { initialValue: record.SendDepartment },
                ]"
              >
                <a-select-option v-for="d in departmentType" :key="d.value" :value="d.value">{{
                  d.text
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="7">
            <a-form-item label="申请医生">
              <a-select
                show-search
                option-filter-prop="children"
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'AppDoctor',
                  {
                    rules: [
                      {
                        required: this.strategys.property.AppDoctor.required,
                        message: '请输入送检医生',
                      },
                    ],
                  },
                  { initialValue: record.AppDoctor },
                ]"
              >
                <a-select-option v-for="d in doctors" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="原申请单">
              <a-input :disabled="true" v-decorator="['OllAppOrder', { initialValue: record.AppNo }]" />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="4" v-if="this.strategys.property.FeeIhcFlag.visible">
            <a-form-item label="" class="flag">
              <a-radio-group
                @change="feeIhcFlagChange"
                name="radioGroup"
                v-decorator="[
                  'FeeIhcFlag',
                  {
                    rules: [
                      {
                        required: this.strategys.property.FeeIhcFlag.required,
                        message: '请选择是否免疫组化',
                      },
                    ],
                    initialValue: record.FeeIhcFlag,
                  },
                ]"
              >
                <a-radio value="Y"> 是 </a-radio>
                <a-radio value="N"> 否（是否免疫组化） </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="7">
            <a-form-item label="项目费用">
              <a-input
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'CostAmount',
                  {
                    rules: [
                      {
                        required: this.strategys.property.CostAmount.required,
                        message: '请输入项目费用',
                      },
                    ],
                  },
                  { initialValue: record.CostAmount },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="是否缴费">
              <a-radio-group
                :disabled="record.IsAppendApply"
                name="IsPay"
                v-decorator="[
                  'IsPay',
                  {
                    rules: [
                      {
                        required: this.strategys.property.IsPay.required,
                        message: '请选择是否缴费',
                      },
                    ],
                  },
                ]"
              >
                <a-radio value="Y"> 已缴费 </a-radio>
                <a-radio value="N"> 未缴费 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="3" v-if="this.strategys.property.RapidParaffinFlag.visible">
            <a-form-item label="" class="flag">
              <a-checkbox
                v-decorator="[
                  'RapidParaffinFlag',
                  {
                    rules: [
                      {
                        required: this.strategys.property.RapidParaffinFlag.required,
                        message: '是否快速石蜡',
                      },
                    ],
                    valuePropName: 'checked',
                    initialValue: this.toBoolear(record.RapidParaffinFlag),
                  },
                ]"
              >
                快速石蜡
              </a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row> </a-row>
        <a-row v-if="this.strategys.property.ContagionFlag.visible">
          <a-col :span="8">
            <a-form-item label="">
              <a-radio-group
                @change="contagionFlagChange"
                name="radioGroup"
                v-decorator="[
                  'ContagionFlag',
                  {
                    rules: [
                      {
                        required: this.strategys.property.ContagionFlag.required,
                        pattern: new RegExp(a),
                        message: '请选择是否传染源',
                      },
                    ],
                    initialValue: record.ContagionFlag,
                  },
                ]"
              >
                是否传染源：<a-radio value="Y"> 是 </a-radio>
                <a-radio value="N"> 否 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="8" v-if="this.strategys.property.ContagionItem.default.length > 0">
            <a-form-item label="">
              <a-checkbox-group
                v-decorator="[
                  'ContagionItem',
                  { initialValue: record.Contagion !== null ? record.Contagion.split('|') : [] },
                ]"
                :disabled="record.IsAppendApply || configData.contagionItemEditable === false"
                name="checkboxgroup"
                :options="this.strategys.property.ContagionItem.default.split('|')"
                @change="contagionItemChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="">
              <a-input
                :disabled="record.IsAppendApply || configData.contagionOtherEditable === false"
                v-decorator="['ContagionOther']"
                @blur="ContagionOtherBlur"
                placeholder="其它传染"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="this.strategys.property.ExamItemTemplateCode.visible">
          <a-col :span="7">
            <a-form-item label="项目明细">
              <a-select
                @change="examItemTemplateChange"
                show-search
                v-decorator="[
                  'ExamItemTemplateCode',
                  {
                    rules: [
                      {
                        required: this.strategys.property.ExamItemTemplateCode.required,
                        message: '请输入送检项目明细',
                      },
                    ],
                  },
                  { initialValue: record.ExamItemTemplateCode },
                ]"
              >
                <a-select-option v-for="d in examItemTemplate" :key="d.value" :value="d.value">{{
                  d.text
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="">
              <a-button type="default" @click="showExamItemTemplate"> 编辑 </a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="this.strategys.property.FeeIhcItem.visible">
          <a-col :span="24">
            <a-form-item label="免疫组化" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
              <a-textarea
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'FeeIhcItem',
                  {
                    rules: [
                      {
                        required: this.strategys.property.FeeIhcItem.required,
                        message: '请输入免疫组化项目',
                      },
                    ],
                  },
                  { initialValue: record.FeeIhcItem },
                ]"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="临床诊断" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
              <a-textarea
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'ClinicalDiagnosis',
                  {
                    rules: [
                      {
                        required: this.strategys.property.ClinicalDiagnosis.required,
                        message: '请输入临床诊断',
                      },
                    ],
                  },
                  { initialValue: record.ClinicalDiagnosis },
                ]"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="this.strategys.property.Symptom.visible">
          <a-col :span="24">
            <a-form-item label="症状体征" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
              <a-textarea
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'Symptom',
                  {
                    rules: [
                      {
                        required: this.strategys.property.Symptom.required,
                        message: '请输入症状体征',
                      },
                    ],
                  },
                  { initialValue: record.Symptom },
                ]"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="this.strategys.property.Examinations.visible">
          <a-col :span="24">
            <a-form-item label="主要化验" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
              <a-textarea
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'Examinations',
                  {
                    rules: [
                      {
                        required: this.strategys.property.Examinations.required,
                        message: '请输入主要化验',
                      },
                    ],
                  },
                  { initialValue: record.Examinations },
                ]"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="病史" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
              <a-textarea
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'BriefHistory',
                  {
                    rules: [
                      {
                        required: this.strategys.property.BriefHistory.required,
                        message: '请输入病史',
                      },
                    ],
                  },
                  { initialValue: record.BriefHistory },
                ]"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="送检目的" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
              <a-textarea
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'SendTarget',
                  {
                    rules: [
                      {
                        required: this.strategys.property.SendTarget.required,
                        message: '请输入送检目的',
                      },
                    ],
                  },
                  { initialValue: record.SendTarget },
                ]"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="手术信息">
        <a-row>
          <a-col :span="7">
            <a-form-item label="手术室">
              <a-input
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'OperatingRoom',
                  {
                    rules: [
                      {
                        required: this.strategys.property.OperatingRoom.required,
                        message: '请输入手术室',
                      },
                    ],
                  },
                  { initialValue: record.OperatingRoom },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="手术间">
              <a-input
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'OperatingRoomNo',
                  {
                    rules: [
                      {
                        required: this.strategys.property.OperatingRoomNo.required,
                        message: '请输入手术间',
                      },
                    ],
                  },
                  { initialValue: record.OperatingRoomNo },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="台号">
              <a-input
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'OperatingNo',
                  {
                    rules: [
                      {
                        required: this.strategys.property.OperatingNo.required,
                        message: '请输入台号',
                      },
                    ],
                  },
                  { initialValue: record.OperatingNo },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="7">
            <a-form-item label="手术类型">
              <a-input
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'SurgeryType',
                  {
                    rules: [
                      {
                        required: this.strategys.property.SurgeryType.required,
                        message: '请选择手术类型',
                      },
                    ],
                  },
                  { initialValue: record.SurgeryType },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="开始时间">
              <a-date-picker
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'OperatingStartTime',
                  {
                    rules: [
                      {
                        required: this.strategys.property.OperatingStartTime.required,
                        message: '请选择开始时间',
                      },
                    ],
                  },
                  { initialValue: record.OperatingStartTime },
                ]"
                show-time
                placeholder="开始时间"
              />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="结束时间">
              <a-date-picker
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'OperatingEndTime',
                  {
                    rules: [
                      {
                        required: this.strategys.property.OperatingEndTime.required,
                        message: '请选择结束时间',
                      },
                    ],
                  },
                  { initialValue: record.OperatingEndTime },
                ]"
                show-time
                placeholder="结束时间"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="术中所见" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
              <a-textarea
                :disabled="record.IsAppendApply"
                v-decorator="[
                  'SurgicalDesc',
                  {
                    rules: [
                      {
                        required: this.strategys.property.SurgicalDesc.required,
                        message: '请输入术中所见',
                      },
                    ],
                  },
                  { initialValue: record.SurgicalDesc },
                ]"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-collapse-panel>
    </a-collapse>
    <div style="margin: 10px 0"></div>

    <!-- 输入标本信息 -->
    <a-row v-if="this.strategys.property.Specimens.visible">
      <div>
        <!-- 操作按钮 -->
        <a-space>
          <a-button type="primary" icon="plus" @click="addSpecimen"> 新增 </a-button>
          <a-popconfirm placement="rightBottom" ok-text="是" cancel-text="否" @confirm="delSpecimen">
            <template slot="title">
              <p>是否删除</p>
            </template>
            <a-button type="danger" icon="delete"> 删除 </a-button>
          </a-popconfirm>
          <a-input
            :value="LeaveTime"
            draggable="true"
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
          >
            <a-select-option v-for="d in fixLiquidType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
          </a-select>
        </a-space>
        <div style="margin: 10px 0"></div>
        <!-- 标本表格 -->
        <a-table
          :scroll="{ y: 400 }"
          :columns="specimenColumns"
          :data-source="SpecimenData"
          :pagination="false"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          @change="handleTableChange"
          class="components-table-demo-nested"
        >
          <template
            v-for="col in [
              'SpecimenCode',
              'SpecimenName',
              'PartId',
              'LeaveTime',
              'FixedTime',
              'FixLiquid',
              'OperatingRoom',
            ]"
            :slot="col"
            slot-scope="text, index2"
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
                placeholder=""
                :allow-clear="true"
                :value="text"
                :show-arrow="true"
                style="width: 150px"
                mode="combobox"
                @change="(e) => handleChange(e, index2, col)"
                @search="specimenNameChange"
              >
                <a-select-option v-for="d in specimenNameType" :key="d.value" :value="d.value">{{
                  d.text
                }}</a-select-option>
              </a-select>
              <a-select
                v-else-if="editable && text === ''"
                mode="combobox"
                style="width: 150px"
                :allow-clear="true"
                placeholder=""
                :show-arrow="true"
                :value="undefined"
                @change="(e) => handleChange(e, index2, col)"
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
                v-if="editable"
                :value="text"
                placeholder="输入离体时间"
                @focus="(e) => focusEvent(e, 'LeaveTime')"
                @keyup="(e) => onChange(e, index2, 'LeaveTime')"
                @blur="(e) => handleChange(e, index2, 'LeaveTime')"
                @pressEnter="(e) => handleChange(e, index2, 'LeaveTime')"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
            <div :key="col" v-if="col === 'FixedTime'">
              <a-input
                v-if="editable"
                :value="text"
                placeholder="选择固定时间"
                @focus="(e) => focusEvent(e, 'FixedTime')"
                @keyup="(e) => onChange(e, index2, 'FixedTime')"
                @blur="(e) => handleChange(e, index2, 'FixedTime')"
                @pressEnter="(e) => handleChange(e, index2, 'FixedTime')"
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
                @change="(e) => fixLiquidChange(e, index2)"
              >
                <a-select-option v-for="d in fixLiquidType" :key="d.value" :value="d.value">{{
                  d.text
                }}</a-select-option>
              </a-select>
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>
        </a-table>
      </div>
    </a-row>
    <a-modal v-model="OrderListVisible" :centered="true" width="1000px" title="申请单列表">
      <template slot="footer">
        <a-button @click="continuAdd">手动增加</a-button>
      </template>
      <template slot="footer">
        <a-button @click="continuHisAdd">His调取</a-button>
      </template>
      <a-alert :message="alertMessage" type="success" />
      <a-table :columns="Columns" :data-source="Data">
        <span slot="operation" slot-scope="text, record2">
          <template>
            <a @click="checkOrder(record2)">选择</a>
          </template>
        </span>
      </a-table>
    </a-modal>
  </a-form>
</template>
<script>
/**
 * 送检类型为“冰冻”情况下，标本的固定时间为空，固定液也不需要
 */
import pick from 'lodash.pick';
import enums from '@/store/enum/enum';
import moment from 'moment';
import storage from 'store';
import { UpdateField } from '@/utils/dataFormat';
import { insertCheckItem } from '@/api/basics/checkitem';
import { saveOrder, getHisInfo, getSpecimenNames, checkAppOrder, loadDataForAppOrderEdit } from '@/api/submission/app';
import { saveDepartment } from '@/api/basics/department';
import { getDictByName } from '@/api/system/dictionary';
import { saveSysUser } from '@/api/system/user';
import { delSpecimens } from '@/api/submission/precheck';
import {
  RandomString,
  CheckField,
  StringToTime,
  LoadNowTimeAdd,
  JSONStringToObject,
  LoadNowTime,
  CalculateAge,
  PromptBox,
  CheckResponseResult,
} from '@/utils/util';
import { taskRun } from '@/api/system/login';
import { getStrategyTemplate } from '@/api/system/strategy';
import { templateLocal } from '@/store/template/templates';
import ExamItemTemplate from '@/views/submission/app/ExamItemTemplate.vue';
import applyEvent from './js/Apply';

const fields = [
  'Id',
  'Status',
  'Birthday',
  'HisSheetId',
  'MzNo',
  'ZyNo',
  'RapidParaffinFlag',
  'Address',
  'AgeYear',
  'AgeMonth',
  'AgeDay',
  'Appointment',
  'AppointmentDate',
  'IsPay',
  'Nation',
  'CostAmount',
  'InpatientWristCode',
  'PatientName',
  'PathologyCode',
  'FeeIhcFlag',
  'ExamItem',
  'FeeIhcItem',
  'Age',
  'Sex',
  'MobileNo',
  'IDCard',
  'HisNo',
  'KinName',
  'KinMobile',
  'OutpatientNum',
  'AdmissionNum',
  'BedNo',
  'ClinicalDiagnosis',
  'BriefHistory',
  'OperatingRoom',
  'OperatingRoomNo',
  'HisID',
  'ExamItemTemplateCode',
  'Symptom',
  'Examinations',
  'ReqDateTime',
  'OperatingNo',
  'MenstrualTime',
  'SurgeryType',
  'OperatingStartTime',
  'OperatingEndTime',
  'SurgicalDesc',
  'SendDepartment',
  'AppDoctor',
  'OllAppOrder',
  'SendTarget',
  'Contagion',
  'ContagionOther',
  'SendTarget',
];
const Data = [];
const Columns = [
  { title: '患者名称', dataIndex: 'PatientName' },
  { title: '患者Id', dataIndex: 'HisNo' },
  { title: '开单时间', dataIndex: 'ReqDateTime' },
  { title: '检查项目', dataIndex: 'ExamItem' },
  { title: '标本', dataIndex: 'SendMaterial' },
  { title: '送检医生', dataIndex: 'DoctorName' },
  { title: '送检科室', dataIndex: 'DepartmentName' },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } },
];
const specimenColumns = [
  // { title: '编号', dataIndex: 'SpecimenCode', width: 55, scopedSlots: { customRender: 'SpecimenCode' } },
  {
    title: '标本名称',
    dataIndex: 'SpecimenName',
    width: 130,
    scopedSlots: { customRender: 'SpecimenName' },
  },
  {
    title: '离体时间',
    dataIndex: 'LeaveTime',
    width: 130,
    scopedSlots: { customRender: 'LeaveTime' },
  },
  {
    title: '固定时间',
    dataIndex: 'FixedTime',
    width: 130,
    scopedSlots: { customRender: 'FixedTime' },
  },
  {
    title: '固定液',
    dataIndex: 'FixLiquid',
    width: 130,
    scopedSlots: { customRender: 'FixLiquid' },
  },
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
  name: 'Edit1',
  components: {
    ExamItemTemplate,
  },
  props: {
    record: {
      type: Object,
      default: null,
    },
    editMark: {
      type: String,
      default: null,
    },
    parentObj: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      a: /^[N]+$/,
      configData: {
        contagionItemEditable: true,
        contagionOtherEditable: true,
        contagionFlag: true,
        contagionItem: [],
        contagion: [],
      },
      appointmentVisible: false,
      fields,
      templateLocal,
      strategys: {},
      strategysCopy: {},
      sendDeptStrategys: {},
      receiveStrategys: {},
      keyType: '3',
      key: '',
      index: 0,
      total: 1,
      patientData: [],
      Data,
      Columns,
      specimenColumns,
      specimenNameType: [],
      editable: true,
      OrderListVisible: false,
      IsMenstrualTime: false,
      layout: 'horizontal',
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 17,
      },
      activeKey: [1, 2, 3],
      form: this.$form.createForm(this),
      nationType: enums.nationType,
      pathologyCodeType: [],
      examItemType: [],
      departmentType: [],
      doctors: [],
      SpecimenData: [],
      selectedRowKeys: [],
      fixLiquidType: enums.FixLiquid,
      FixLiquid: null,
      LeaveTime: '',
      FixedTime: '',
      AllLeaveTime: '',
      AllFixedTime: '',
      AppointmentTime: '',
      AppointmentTimeRestrict: '',
      AppointmentDate: '',
      timer,
      HisUrl: '',
      HisReqType: '2',
      alertMessage:
        '当前【标本追溯系统】该门诊号/住院号存在下列申请单，如需新增申请单请按右下角的”HIS调取“重新选择申请单',
      flag: 'his',
      examItemTemplate: [],
    };
  },
  beforeCreate() {},
  created() {
    // #region 把当前策略和最新策略模板进行对比，并把缺失的补充默认
    if (CheckField(this.record.strategys)) {
      this.strategys = JSONStringToObject(this.record.strategys);
      const _propertys = this.templateLocal.filter((f) => f.text === 'AppEdit')[0].value.property;
      for (var item in _propertys) {
        const a = this.strategys.property[item];
        if (CheckField(a) === false) {
          this.strategys.property[item] = _propertys[item];
        }
        this.strategys.property[item].type = _propertys[item].type;
      }
      this.strategysCopy = JSON.parse(JSON.stringify(this.strategys));
    }
    // #endregion
    // #region 编辑状态的表单初始化
    if (this.editMark === 'yes') {
      storage.remove('flag');
      this.strategys.property.MenstrualTime.required = false;
      this.IsMenstrualTime = true;
    } else {
      for (var key in this.strategys.property) {
        this.record[key] = this.strategys.property[key].default;
      }
    }
    // #endregion
    // #region 外部链接初始化
    if (CheckField(storage.get('flag')) === true) {
      getStrategyTemplate('AppEdit').then((res) => {
        this.strategys = JSONStringToObject(res.Content);
        if (this.editMark === 'yes') {
          storage.remove('flag');
          this.strategys.property.MenstrualTime.required = false;
          this.IsMenstrualTime = true;
        }
      });
      taskRun().then((res) => {});
      this.record.AppDoctor = storage.get('name');
      this.record.SendDepartment = storage.get('dept');
      this.keyType = storage.get('type');
      this.key = storage.get('number');
      this.onSearch();
    }
    // #endregion
    // 默认离体时间为当前，固定时间为离体时间后15分钟
    if (CheckField(this.strategys.behaviorProperty.FillLeaveTime.required)) {
      this.LeaveTime = LoadNowTimeAdd('minute', this.strategys.behaviorProperty.FillLeaveTime.default, 'HH:mm');
      this.AllLeaveTime = LoadNowTimeAdd('minute', this.strategys.behaviorProperty.FillLeaveTime.default);
    }
    if (CheckField(this.strategys.behaviorProperty.FillFixedTime.required)) {
      this.FixedTime = LoadNowTimeAdd('minute', this.strategys.behaviorProperty.FillFixedTime.default, 'HH:mm');
      this.AllFixedTime = LoadNowTimeAdd('minute', this.strategys.behaviorProperty.FillFixedTime.default);
    }
    this.AppointmentTime = LoadNowTimeAdd('minute', 0, 'HH:mm');
    // 初始化组件项信息
    this.loadConfig();
    this.SpecimenData = [];
  },
  mounted() {
    const $this = this;
    this.$nextTick(() => {
      // #region 对时间进行格式化
      if (CheckField(this.record) && CheckField(this.record.OperatingStartTime)) {
        this.record.OperatingStartTime = moment(this.record.OperatingStartTime);
      }
      if (CheckField(this.record) && CheckField(this.record.OperatingEndTime)) {
        this.record.OperatingEndTime = moment(this.record.OperatingEndTime);
      }
      // #endregion

      // #region 不存在Id状态值，则表单项默认状态
      if (CheckField(this.record.Id) === false) {
        this.record.PathologyCode = 'Routine';
        this.getDictByName(() => {
          $this.form.setFieldsValue(pick($this.record, this.fields));
        });
      } else {
        this.record.Specimens.forEach((item) => {
          item.key = RandomString(32);
        });
        this.SpecimenData = this.record.Specimens;
      }
      // #endregion

      // #region 感染源
      if (CheckField(this.record.Id) === false) {
        this.record.Contagion = '';
      } else {
        if (this.record.ContagionFlag === 'N') {
          this.configData.contagionOtherEditable = false;
          this.configData.contagionItemEditable = false;
        }
      }
      // #endregion

      // #region 如果存在住院号则自动查询
      if (CheckField(this.record) && CheckField(this.record.Code)) {
        this.keyType = '2';
        this.key = this.record.Code;
        this.record.IsAppendApply = false;
        this.getPatientInfoByHis();
      }
      // #endregion
      // 预约初始化
      if (CheckField(this.record.Appointment)) {
        this.record.Appointment = this.toBoolear(this.record.Appointment);
        this.record.AppointmentDate = StringToTime(this.record.AppointmentTime, 'yyyy-MM-DD');
        this.AppointmentDate = StringToTime(this.record.AppointmentTime, 'yyyy-MM-DD');
        this.AppointmentTime = StringToTime(this.record.AppointmentTime, 'HH:mm');
        this.strategys.behaviorProperty.AppointmentDate.required = true;
      } else {
        this.record.Appointment = false;
        this.strategys.behaviorProperty.AppointmentDate.required = false;
      }
      this.form.setFieldsValue(pick(this.record, this.fields));
    });
  },
  methods: {
    loadConfig() {
      // 一次性把所有相关预加载数据查询并返回
      loadDataForAppOrderEdit().then((res) => {
        if (CheckResponseResult(res)) {
          res.Data.ExamItems.forEach((item) => {
            this.examItemType.push({
              value: item.ItemName,
              text: item.ItemName,
              type: item.PathologyCode,
            });
          });
          this.HisUrl = res.Data.HisUrl;
          res.Data.Departments.forEach((item) => {
            this.departmentType.push({ value: item.DeptCode, text: item.DeptName });
          });
          res.Data.Doctors.forEach((item) => {
            this.doctors.push({ value: item.UserCode, text: item.UserName });
          });
          this.FixLiquid = res.Data.DefaultLiquid;
          res.Data.Specimens.forEach((item) => {
            this.specimenNameType.push({ value: item.SpecimenName, text: item.SpecimenName });
          });
          res.Data.SubmissionTypes.forEach((element) => {
            this.pathologyCodeType.push({
              value: element.Content,
              text: element.Name,
            });
          });
          if (CheckField(storage.get('type')) === false) {
            if (res.Data.HisReqTypeConfig) {
              this.keyType = res.Data.HisReqTypeConfig.ReqType;
            } else {
              this.keyType = res.Data.DefaultHisReqTypeConfig;
              this.HisReqType = res.Data.DefaultHisReqTypeConfig;
            }
          }
          this.examItemTemplate.push({ text: '请选择检查项目模板', value: '0' });
          res.Data.PageTemplates.forEach((item) => {
            if (item.TargetCode === 'ApplyExamItem') {
              this.examItemTemplate.push({ text: item.Name, value: item.Code });
            }
          });
          this.receiveStrategys = JSONStringToObject(res.Data.StrategyTemplate.Content);
          this.sendDeptStrategys = res.Data.StrategyTemplates;
          this.AppointmentTimeRestrict = res.Data.AppointmentTimeRestrict;
        }
      });
    },
    fieldsChange(e, filedName) {
      applyEvent.FieldChange(this, filedName, { DeptCode: e });
    },
    handelCodeChange(e, index, col) {
      index[col] = e;
    },
    showExamItemTemplate() {
      if (
        CheckField(this.record.ExamItemTemplate) === false &&
        CheckField(this.record.ExamItemTemplateCode) === false
      ) {
        return;
      }
      const $this = this;
      this.$dialog(
        ExamItemTemplate,
        {
          record: this.record,
          parentObj: $this,
          on: {
            ok() {},
            cancel() {},
            close() {},
          },
        },
        // modal props
        {
          title: '检查项目明细',
          width: 1000,
          centered: true,
          maskClosable: false,
          destroyOnClose: true,
        },
      );
    },
    examItemTemplateChange(value, key) {
      if (value === '0') {
        return;
      }
      this.record.ExamItemTemplateCode = value;
      const $this = this;
      this.$dialog(
        ExamItemTemplate,
        {
          record: { ExamItemTemplateCode: value },
          parentObj: $this,
          on: {
            ok() {},
            cancel() {},
            close() {},
          },
        },
        // modal props
        {
          title: '检查项目明细',
          width: 1000,
          centered: true,
          maskClosable: false,
          destroyOnClose: true,
        },
      );
    },
    examItemTemplateCallBack(val) {
      this.record.ExamItemTemplate = val;
    },
    pathologyCodeChange(a, b) {
      if (a === 'Frozen') {
        this.SpecimenData.forEach((item) => {
          item.FixedTime = '';
        });
      }
      this.record.PathologyCode = a;
    },
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
    blurChange(value, obj, column) {
      this.timer.total = 0;
      this.timer.minute = false;
      const _time = LoadNowTime(`yyyy-MM-DD ${value.target.value}:00`);
      let exist = false;
      if (column === 'AppointmentTime') {
        this.AppointmentTime = value.target.value;
        this.record.AppointmentTime = this.AppointmentDate + ' ' + this.AppointmentTime;
        if (
          StringToTime(this.record.AppointmentTime, 'yyyy-MM-DD HH:mm') <
          StringToTime(LoadNowTime('yyyy-MM-DD HH:mm'), 'yyyy-MM-DD HH:mm')
        ) {
          PromptBox('预约日期不能小于当前日期', 'warning');
          return;
        }
      }
      if (column === 'SpecimenName') {
        this.SpecimenData.forEach((item) => {
          if (item.key === obj.key) {
            item.SpecimenName = value === undefined ? '' : value;
            exist = true;
          }
        });
        if (exist === false) {
          obj.SpecimenName = value === undefined ? '' : value;
        }
      }
      if (column === 'FixedTime' && this.record.PathologyCode !== 'Frozen') {
        if (CheckField(obj.LeaveTime) && CheckField(_time) && StringToTime(_time) < StringToTime(obj.LeaveTime)) {
          PromptBox('固定时间不能小于离体时间', 'warning');
          return;
        }
        CheckField(obj.Id)
          ? UpdateField(this.SpecimenData, obj.Id, column, _time)
          : UpdateField(this.SpecimenData, obj.key, column, _time);
      }
      if (column === 'LeaveTime') {
        CheckField(obj.Id)
          ? UpdateField(this.SpecimenData, obj.Id, column, _time)
          : UpdateField(this.SpecimenData, obj.key, column, _time);
      }
      if (column === 'AllLeaveTime') {
        UpdateField(this.SpecimenData, 0, 'LeaveTime', _time);
      }
      if (column === 'AllFixedTime') {
        UpdateField(this.SpecimenData, 0, 'FixedTime', _time);
      }
      if (column === 'AllFixLiquid') {
        this.FixLiquid = value;
        UpdateField(this.SpecimenData, 0, 'FixLiquid', value);
      }
    },
    feeIhcFlagChange(val) {
      if (val.target.value === 'Y') {
        this.strategys.property.FeeIhcItem.required = true;
      } else {
        this.strategys.property.FeeIhcItem.required = false;
      }
    },
    contagionFlagChange(val) {
      if (val.target.value === 'Y') {
        this.configData.contagionOtherEditable = true;
        this.configData.contagionItemEditable = true;
        this.configData.contagionFlag = true;
      } else {
        this.configData.contagionOtherEditable = false;
        this.configData.contagionItemEditable = false;
        this.configData.contagionFlag = false;
      }
      this.checkContagion();
    },
    changeMenstraul(obj) {
      if (obj.target.checked) {
        this.strategys.property.MenstrualTime.required = false;
      } else {
        this.strategys.property.MenstrualTime.required = true;
      }
    },
    checkContagion() {
      if (
        (CheckField(this.configData.contagionItem) || CheckField(this.record.ContagionOther)) &&
        this.configData.contagionOtherEditable &&
        this.configData.contagionFlag
      ) {
        this.a = /^[Y]+$/;
      } else if (this.configData.contagionFlag === false) {
        this.form.setFieldsValue({ ContagionItem: [], ContagionOther: '', ContagionFlag: 'N' });
        this.a = /^[N]+$/;
      }
    },
    contagionItemChange(v) {
      this.configData.contagionItem = v;
      this.checkContagion();
    },
    ContagionOtherBlur(v) {
      this.record.ContagionOther = v.target.value;
      this.checkContagion();
    },
    changeTackAway(obj) {
      if (obj.target.checked) {
        this.strategys.property.PathologyCode.required = false;
        this.strategys.property.ExamItem.required = false;
        this.strategys.property.SendDepartment.required = false;
        this.strategys.property.AppDoctor.required = false;
        this.strategys.property.FeeIhcFlag.required = false;
        this.strategys.property.IsPay.required = false;
        this.strategys.property.RapidParaffinFlag.required = false;
        this.strategys.property.CostAmount.required = false;
        this.strategys.property.FeeIhcItem.required = false;
        this.strategys.property.ClinicalDiagnosis.required = false;
        this.strategys.property.BriefHistory.required = false;
      } else {
        this.strategys = JSONStringToObject(this.record.strategys);
      }
    },
    changeAppointment(obj) {
      if (obj.target.checked) {
        this.strategys.behaviorProperty.AppointmentDate.required = true;
        this.strategys.behaviorProperty.AppointmentTime.required = true;
        // this.strategys.property.OperatingStartTime.required = true
        this.appointmentVisible = true;
      } else {
        this.strategys.behaviorProperty.AppointmentDate.required = false;
        this.strategys.behaviorProperty.AppointmentTime.required = false;
        // this.strategys.property.OperatingStartTime.required = false
        this.appointmentVisible = false;
        this.AppointmentDate = '';
      }
    },
    // 继续增加申请单（在本地存在申请单的情况下）
    continuAdd() {
      this.OrderListVisible = false;
      this.record.Id = null;
      this.keyType = this.HisReqType;
    },
    continuHisAdd() {
      this.OrderListVisible = false;
      this.record.Id = null;
      this.keyType = CheckField(storage.get('type')) ? storage.get('type') : this.keyType;
      this.getPatientInfoByHis('his');
    },
    getSpecimenNames(v) {
      this.specimenNameType = [];
      getSpecimenNames(v).then((res) => {
        res.data.forEach((item) => {
          this.specimenNameType.push({ value: item.SpecimenName, text: item.SpecimenName });
        });
      });
    },
    specimenNameChange(v) {
      this.getSpecimenNames(v);
    },
    updateTime(methodName, item, type) {
      if (methodName === 'UpdateFixedTime' && this.record.PathologyCode !== 'Frozen') {
        if (
          CheckField(item.LeaveTime) &&
          CheckField(item.FixedTime) &&
          StringToTime(item.LeaveTime) > StringToTime(item.FixedTime)
        ) {
          PromptBox('固定时间不能小于离体时间', 'warning');
        } else if (item.FixedTime !== '' && (item.FixLiquid === null || typeof item.FixLiquid === 'undefined')) {
          PromptBox('常规送检固定液不能为空', 'warning');
          UpdateField(this.SpecimenData, item.Id, 'FixedTime', '');
        } else if (item.FixedTime === '' && type === 'hand') {
          // 手动固定清空
          UpdateField(this.SpecimenData, item.Id, 'FixedTime', '');
        } else {
          // 固定
          UpdateField(this.SpecimenData, item.Id, 'FixedTime', item.FixedTime);
        }
      } else if (methodName === 'UpdateLeaveTime') {
        // 离体
        UpdateField(this.SpecimenData, item.Id, 'LeaveTime', item.LeaveTime);
      }
    },
    onAppointmentDateChange(e, v) {
      this.AppointmentDate = v;
      this.record.AppointmentTime = this.AppointmentDate + ' ' + this.AppointmentTime;
      if (
        StringToTime(this.record.AppointmentTime, 'yyyy-MM-DD HH:mm') <
        StringToTime(LoadNowTime('yyyy-MM-DD HH:mm'), 'yyyy-MM-DD HH:mm')
      ) {
        this.AppointmentDate = undefined;
        this.record.AppointmentDate = undefined;
        this.$nextTick(() => {
          this.form.setFieldsValue({
            AppointmentDate: null,
          });
        });
        PromptBox('预约日期不能小于当前日期', 'warning');
        return;
      }
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
    },
    handleChange(value, obj, column) {
      let exist = false;
      if (column === 'SpecimenName') {
        this.SpecimenData.forEach((item) => {
          if (item.key === obj.key) {
            item.SpecimenName = value === undefined ? '' : value;
            exist = true;
          }
        });
        if (exist === false) {
          obj.SpecimenName = value === undefined ? '' : value;
        }
      }
      if (column === 'FixedTime' && this.record.PathologyCode !== 'Frozen') {
        if (
          CheckField(obj.LeaveTime) &&
          CheckField(value.target.value) &&
          StringToTime(value.target.value) < StringToTime(obj.LeaveTime)
        ) {
          PromptBox('固定时间不能小于离体时间', 'warning');
          return;
        }
        CheckField(obj.Id)
          ? UpdateField(this.SpecimenData, obj.Id, column, value.target.value)
          : UpdateField(this.SpecimenData, obj.key, column, value.target.value);
      }
      if (column === 'LeaveTime') {
        CheckField(obj.Id)
          ? UpdateField(this.SpecimenData, obj.Id, column, value.target.value)
          : UpdateField(this.SpecimenData, obj.key, column, value.target.value);
      }
      if (column === 'AllLeaveTime') {
        UpdateField(this.SpecimenData, 0, 'LeaveTime', value.target.value);
      }
      if (column === 'AllFixedTime') {
        UpdateField(this.SpecimenData, 0, 'FixedTime', value.target.value);
      }
      if (column === 'AllFixLiquid') {
        this.FixLiquid = value;
        UpdateField(this.SpecimenData, 0, 'FixLiquid', value);
      }
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
    addSpecimen() {
      let specimenCode = '1';
      let i = 1;
      this.SpecimenData.forEach((item) => {
        if (item.SpecimenCode > i) {
          i = Number(item.SpecimenCode);
        }
        specimenCode = i + 1;
      });
      let isOnly = true;
      let key = '';
      let fixedTime = this.AllFixedTime;
      let fixLiquid = this.FixLiquid;
      do {
        key = RandomString(32);
        const specimen = this.SpecimenData.filter((w) => w.key === key);
        if (specimen.length !== 0) {
          isOnly = false;
        }
      } while (isOnly === false);
      if (this.record.PathologyCode === 'Frozen') {
        fixedTime = '';
        fixLiquid = '';
      }
      this.SpecimenData.push({
        SpecimenCode: specimenCode,
        key: key,
        OperatingRoom: this.record.OperatingRoom,
        AppId: this.AppId,
        FixedTime: fixedTime,
        LeaveTime: this.AllLeaveTime,
        FixLiquid: fixLiquid,
        SpecimenName: '',
        PartId: '',
        PartName: '',
      });
      // this.pagination.total = this.SpecimenData.length
    },
    orderSpecimens() {
      if (this.SpecimenData.length === 0) {
        return;
      }
      const isAllNotPrint = true;
      this.SpecimenData.forEach((item) => {
        if (item.OperatingTime !== null) {
          isAllNotPrint = false;
        }
      });
      if (isAllNotPrint) {
        let i = 1;
        this.SpecimenData.forEach((item) => {
          item.SpecimenCode = i.toString();
          i = i + 1;
        });
      }
    },
    delSpecimen() {
      const sData = this.SpecimenData.filter((f) => this.selectedRowKeys.includes(f.key) && CheckField(f.Id) === true);
      const ids = [];
      if (sData.length === 0) {
        const tempData = this.SpecimenData.filter((f) => !this.selectedRowKeys.includes(f.key));
        this.SpecimenData = tempData;
        this.orderSpecimens();
      } else {
        sData.forEach((item) => {
          ids.push(item.Id);
        });
        delSpecimens({ ids: ids }).then((res) => {
          if (res.HttpStatusCode === 200 && res.ResultType === 1) {
            PromptBox('操作成功！', 'success');
            const _tempData = this.SpecimenData.filter((w) => !this.selectedRowKeys.includes(w.key));
            this.SpecimenData = _tempData;
            this.orderSpecimens();
          } else {
            PromptBox(res.Message, 'error');
          }
        });
      }
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    checkOrder(code) {
      this.record = null;
      this.record = code;
      this.loadPatientInfo(code);
      this.OrderListVisible = false;
    },
    toBoolear(val) {
      if (CheckField(val) === false) {
        return false;
      }
      if (val === false) {
        return false;
      } else if (val === 'N') {
        return false;
      } else {
        return true;
      }
    },
    getDictByName(callback) {
      const $this = this;
      getDictByName('默认申请科室').then((res) => {
        if (res.data && res.data.length > 0) {
          $this.record.Department = res.data;
          callback();
        }
      });
    },
    onSearch() {
      this.getPatientInfoByHis();
    },
    getPatientInfoByHis(flag) {
      const $this = this;
      getHisInfo(this.keyType, this.key, flag)
        .then((res) => {
          if (res === null || res.data === null) {
            PromptBox('该号码不存在记录，请检查！', 'warning');
            return;
          }
          res.data = res.data.Data;
          this.flag = res.flag;
          if (res.flag === 'his') {
            this.alertMessage = '当前【His系统】该门诊号/住院号存在下列申请单';
          } else {
            this.alertMessage =
              '当前【标本追溯系统】该门诊号/住院号存在下列申请单，如需新增申请单请按右下角的”HIS调取“重新选择申请单';
          }
          // 如果本地不存在数据则自动查询His,这里注意防止死循环
          if (res && res.data.length === 0 && flag === 'local') {
            this.keyType = storage.get('type');
            this.onSearch();
          }
          if (res && res.data.length > 0) {
            res.data.forEach((item) => {
              // #region 对时间进行格式化
              if (CheckField(item.OperatingStartTime) === true) {
                item.OperatingStartTime = moment(item.OperatingStartTime);
              } else {
                item.OperatingStartTime = '';
              }
              if (CheckField(item.OperatingEndTime) === true) {
                item.OperatingEndTime = moment(item.OperatingEndTime);
              } else {
                item.OperatingEndTime = '';
              }
            });
            $this.Data = res.data;
            $this.OrderListVisible = true;
          } else {
            PromptBox('该号码不存在记录，请检查！', 'warning');
          }
        })
        .catch((res) => {
          if (!CheckField(res)) {
            PromptBox('该住院号患者不存在', 'error');
            return;
          }
          PromptBox(res, 'error');
        });
    },
    loadPatientInfo(_data) {
      if (CheckField(_data.Id) === true && _data.Id !== 0) {
        this.strategys.property.MenstrualTime.required = false;
        this.IsMenstrualTime = true;
      }
      if (CheckField(_data.ExamItem)) {
        const _examItem = this.examItemType.filter((w) => w.text === _data.ExamItem);
        if (_examItem.length > 0) {
          _data.PathologyCode = _examItem[0].type;
        }
      }
      // #region 判断HIS获取的病人信息对应的送检科室是否存在病理送检系统中
      if (
        this.departmentType.filter((w) => w.value === _data.Department || w.value === _data.DepartmentName).length <= 0
      ) {
        const _fieldData = {
          PID: -1,
          DeptCode: CheckField(_data.Department) === false ? _data.DepartmentName : _data.Department,
          DeptName: CheckField(_data.DepartmentName) === false ? '' : _data.DepartmentName,
          DeptPRO: 0,
          ValidState: 1,
        };
        saveDepartment(_fieldData).then((res) => {
          console.log(res);
          if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
            this.departmentType.push({ value: _data.Department, text: _data.DepartmentName });
            this.loadFormData(_data);
          }
        });
      } else {
        this.loadFormData(_data);
      }
      // #endregion

      // #region 判断HIS获取的病人信息对应的医生是否存在病理送检系统中
      if (this.doctors.filter((w) => w.value === _data.DoctorCode).length <= 0) {
        var _fieldData = {
          LoginName: CheckField(_data.DoctorCode) === false ? '' : _data.DoctorCode,
          LoginPwd: CheckField(_data.DoctorCode) === false ? '' : _data.DoctorCode,
          UserCode: CheckField(_data.DoctorCode) === false ? '' : _data.DoctorCode,
          Department: CheckField(_data.Department) === false ? '' : _data.Department,
          UserName: CheckField(_data.DoctorName) === false ? '' : _data.DoctorName,
          UserType: '医生',
          Status: 1,
          Remark: '通过HIS接口获取申请单时创建，该用户尚未配置角色',
        };
        console.log(_fieldData);
        saveSysUser(_fieldData).then((res) => {
          if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
            this.doctors.push({ value: _data.DoctorCode, text: _data.DoctorName });
            this.loadFormData(_data);
          }
        });
      } else {
        this.loadFormData(_data);
      }
      // #endregion

      // #region 判断His获取的检查项目是否存在
      if (this.examItemType.filter((w) => w.value === _data.ExamItemCode).length <= 0) {
        const _examItemCode = CheckField(_data.ExamItemCode) === true ? _data.ExamItemCode : _data.ExamItem;
        const examItem = { ItemCode: _examItemCode, ItemName: _data.ExamItem };
        insertCheckItem(examItem)
          .then((res) => {
            if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
              this.examItemType.push({ value: _data.ExamItem, text: _data.ExamItem });
              this.loadFormData(_data);
            }
          })
          .catch((error) => {
            PromptBox(error.$message, 'error');
          });
      } else {
        this.loadFormData(_data);
      }
      // #endregion
    },
    loadFormData(data) {
      if (CheckField(data.IDCard) && data.IDCard.length === 18) {
        const ages = CalculateAge(
          data.IDCard.substr(6, 4) + '-' + data.IDCard.substr(10, 2) + '-' + data.IDCard.substr(12, 2),
        );
        if (CheckField(ages)) {
          data.AgeYear = ages[0];
          data.AgeMonth = ages[1];
          data.AgeDay = ages[2];
        }
      }
      if (CheckField(data.Birthday) && data.Birthday.indexOf('Date') >= 0 && CheckField(data.Birthday)) {
        data.Birthday = new Date(parseInt(data.Birthday.substr(6, 13))).toLocaleDateString();
        console.log(data.Birthday);
      }
      if (CheckField(data.PathologyCode) === false) {
        data.PathologyCode = this.strategys.property.PathologyCode.default;
      }
      if (data.OperatingStartTime !== undefined && data.OperatingStartTime !== '') {
        data.OperatingStartTime = moment(data.OperatingStartTime);
      }
      if (data.OperatingEndTime !== undefined && data.OperatingEndTime !== '') {
        data.OperatingEndTime = moment(data.OperatingEndTime);
      }
      if (data.Sex === 1 || data.Sex === '1' || data.Sex === '女') {
        data.Sex = '1';
      } else {
        data.Sex = '0';
      }
      // #region 格式化标本列表
      this.SpecimenData = [];
      if (this.flag === 'local' && data.Specimens.length > 0) {
        this.SpecimenData = data.Specimens;
        let no = 1;
        this.SpecimenData.forEach((item) => {
          item.key = RandomString(32);
          item.SpecimenCode = no;
          no += 1;
        });
      }
      data.SendMaterialsInPosition = [];
      if (
        data.SendMaterialInPosition !== null &&
        data.SendMaterialInPosition !== undefined &&
        data.SendMaterialInPosition.length > 0
      ) {
        data.SendMaterialInPosition = data.SendMaterialInPosition.replace(/,/g, '|'); // 深圳儿童医院需要先把分隔标本符“,”替换成统一的“|”
        data.SendMaterialsInPosition = data.SendMaterialInPosition.split('|');
      }
      if (data.SendMaterial !== null && data.SendMaterial !== undefined && data.SendMaterial.length > 0) {
        data.SendMaterial = data.SendMaterial.replace(/,/g, '|'); // 深圳儿童医院需要先把分隔标本符“,”替换成统一的“|”
        var specimens = data.SendMaterial.split('|');
        let no = 1;
        specimens.forEach((item, index) => {
          if (CheckField(item) === true) {
            const key = RandomString(32);
            this.SpecimenData.push({
              key: key,
              SpecimenCode: no,
              OperatingRoom: this.record.OperatingRoom,
              AppId: this.AppId,
              FixedTime: this.AllFixedTime,
              LeaveTime: this.AllLeaveTime,
              FixLiquid: this.FixLiquid,
              SpecimenName: item,
              PartId: '',
              PartName: CheckField(data.SendMaterialsInPosition[index]) ? data.SendMaterialsInPosition[index] : '',
            });
            no += 1;
          }
        });
      }
      // #endregion
      if (this.flag === 'his') {
        data.AppDoctor = data.DoctorCode;
        data.SendDepartment = data.Department;
        // 对表单中空状态的项进行默认赋值
        for (var item in this.strategys.property) {
          const a = data[item];
          if (CheckField(a) === false) {
            data[item] = this.strategys.property[item].default;
          }
        }
      }
      this.fieldsChange(data.SendDepartment, 'SendDepartment');
      if (CheckField(data.Contagion) === false) {
        data.Contagion = '';
      }
      this.form.setFieldsValue(pick(data, fields));
    },
    async onOk() {
      const $this = this;
      // #region 提醒功能
      function doubleAfter2seconds() {
        if (
          $this.strategys.behaviorProperty.SurgicalDescRemind.required &&
          CheckField($this.form.getForm().getFieldValue('SurgicalDesc')) === false
        ) {
          return new Promise((resolve, reject) => {
            $this.$confirm({
              title: '提示',
              content: '【术中所见】没有填写是否继续',
              onOk() {
                resolve(true);
              },
              onCancel() {
                resolve(false);
              },
            });
          });
        }
      }
      const result = await doubleAfter2seconds();
      if (result === false) {
        return;
      }
      // #endregion
      return new Promise((resolve) => {
        this.form.validateFields((errors, values) => {
          if (!errors) {
            if (values.OperatingStartTime) {
              values.OperatingStartTime = moment(values.OperatingStartTime).format('YYYY-MM-DD HH:mm:ss');
            }
            if (values.OperatingEndTime) {
              values.OperatingEndTime = moment(values.OperatingEndTime).format('YYYY-MM-DD HH:mm:ss');
            }
            if (values.MenstrualTime) {
              values.MenstrualTime = moment(values.MenstrualTime).format('YYYY-MM-DD HH:mm:ss');
            }
            if (CheckField(this.record.AppointmentTime)) {
              values.AppointmentTime = this.record.AppointmentTime;
              if (CheckField(this.AppointmentTimeRestrict)) {
                const days = this.AppointmentTimeRestrict.split('-');
                days.forEach((data) => {
                  const dayOfTheWeek = moment(this.record.AppointmentTime).format('dddd');
                  const ccc = data.split('&');
                  if (ccc[0] === dayOfTheWeek) {
                    if (ccc.length > 1) {
                      if (
                        moment(this.record.AppointmentTime).format('LTS') > moment('1999-01-01 ' + ccc[1]).format('LTS')
                      ) {
                        PromptBox(`您预约的时间不在工作时间，特殊情况请直接联系病理科！`, 'warning');
                        isCheck = false;
                        return;
                      }
                    } else {
                      PromptBox(`您预约的时间不在工作时间，特殊情况请直接联系病理科！`, 'warning');
                      isCheck = false;
                      return;
                    }
                  }
                });
              }
            }
            values.Contagion = CheckField(values.ContagionItem) ? values.ContagionItem.join('|') : '';
            values.Specimens = this.SpecimenData;
            values.Specimens.forEach((item) => {
              if (
                CheckField(item.FixedTime) &&
                CheckField(item.LeaveTime) &&
                StringToTime(item.LeaveTime) > StringToTime(item.FixedTime)
              ) {
                PromptBox(`【${item.SpecimenName}】离体时间大于固定时间`, 'warning');
                isCheck = false;
                return;
              }
            });
            this.$parent.$parent.$refs.footer.childNodes[0].childNodes[1].disabled = true;
            values.examItemTemplate = this.record.ExamItemTemplate;
            if (
              CheckField(this.record.Id) &&
              this.record.AllowModify === '0' &&
              CheckField(this.receiveStrategys) &&
              this.receiveStrategys.ForbidModifyApply.required === true
            ) {
              resolve(false);
              PromptBox('该申请单已经接收不允许修改', 'warning');
              return;
            }
            if (values.PathologyCode !== 'Frozen') {
              values.Appointment = false;
              values.AppointmentDate = '';
            }
            if (CheckField(values.Id) === false && CheckField(values.Appointment)) {
              checkAppOrder(values).then((res) => {
                if (res.data && res.data.HttpStatusCode === 200 && res.data.ResultType === 0) {
                  this.$confirm({
                    title: '提示',
                    content: res.data.Message,
                    okText: '是',
                    okType: 'warning',
                    cancelText: '否',
                    onOk() {
                      save(values);
                    },
                    onCancel() {
                      resolve(true);
                    },
                  });
                } else {
                  save(values);
                }
              });
            } else {
              save(values);
            }
            function save(values) {
              saveOrder(values)
                .then((res) => {
                  if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
                    PromptBox('操作成功！', 'success');
                    if (CheckField(storage.get('flag'))) {
                      storage.remove('flag');
                      storage.remove('dept');
                      storage.remove('name');
                      storage.remove('type');
                      storage.remove('number');
                    }
                    setTimeout(() => {
                      resolve(true);
                    }, 500);
                  } else {
                    if (res.Message === '该门诊号或住院号存在记录') {
                      res.Data.forEach((item) => {
                        item.Department = item.SendDepartment;
                        item.DoctorCode = item.AppDoctor;
                      });
                      this.Data = res.Data;
                      this.patientData = res.Data;
                      this.OrderListVisible = true;
                    }
                    PromptBox(res.Message, 'warning');
                    $this.$parent.$parent.$refs.footer.childNodes[0].childNodes[1].disabled = false;
                    resolve(false);
                  }
                })
                .catch((error) => {
                  PromptBox(error.$message, 'error');
                  $this.$parent.$parent.$refs.footer.childNodes[0].childNodes[1].disabled = false;
                  resolve(false);
                });
            }
          }
        });
      });
    },
    onCancel() {
      this.sourceData = [];
      this.targetKeys = [];
      return new Promise((resolve) => {
        resolve(true);
      });
    },
    LastInfo() {
      if (this.index === 0) {
        return;
      }
      this.index = this.index - 1;
      this.loadPatientInfo(this.patientData[this.index]);
    },
    NextInfo() {
      if (this.index + 1 === this.total) {
        return;
      }
      this.index = this.index + 1;
      this.loadPatientInfo(this.patientData[this.index]);
    },
    changeActivekey() {
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.record, this.fields));
      });
    },
  },
};
</script>
<style>
.ant-input-group-addon {
  padding: 0 2px;
}
.applyedit .ant-divider {
  margin: 5px 0;
}
.flag .ant-col-17 {
  width: 100%;
}
.applyedit .ant-row .ant-form-item {
  margin-bottom: 5px;
}
.ant-modal-footer {
  z-index: 999999;
  position: sticky;
  bottom: 0px;
  background-color: #ffffff;
}
</style>
