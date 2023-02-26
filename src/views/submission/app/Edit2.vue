<template>
  <a-form
    :disabled="record.IsAppendApply"
    class="applyedit"
    :form="form"
    :layout="layout"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
    <a-form-item v-show="false" label="主键ID">
      <a-input v-decorator="['Id', { initialValue: record.Id }]" disabled />
    </a-form-item>
    <a-form-item v-show="false" label="状态">
      <a-input v-decorator="['Status', { initialValue: record.Status }]" disabled />
    </a-form-item>
    <a-form-item v-show="false" label="HisId">
      <a-input v-decorator="['HisID', {initialValue: record.HisID}]" disabled/>
    </a-form-item>
    <a-form-item v-show="false" label="ReqDateTime">
      <a-input v-decorator="['ReqDateTime', {initialValue: record.ReqDateTime}]" disabled/>
    </a-form-item>
    <a-row>
      <a-col :span="8">
        <a-input-group compact>
          <a-select v-model="keyType" style="width:25%;">
            <a-select-option value="1">
              病人ID
            </a-select-option>
            <a-select-option value="2">
              住院号
            </a-select-option>
            <a-select-option value="3">
              门诊号
            </a-select-option>
          </a-select>
          <a-input-search
            :disabled="record.IsAppendApply"
            v-model="key"
            style="width:75%;top:0px;"
            placeholder="输入病人ID\住院号\门诊号"
            enter-button
            @search="onSearch"
          />
        </a-input-group>
      </a-col>
      <a-col :span="14">
        <a-button-group v-if="visible">
          <a-button type="default" @click="LastInfo()" style="margin-right:5px;margin-left:5px;"><a-icon type="left" /></a-button>
          <a-button type="default" @click="NextInfo()" style="margin-right:5px;"><a-icon type="right" /></a-button>
          <span>总条数：{{ total }},第{{ index + 1 }}条</span>
        </a-button-group>
        <span style="color:crimson;">（可输入病人ID、门诊号或住院号获取患者基本信息）</span>
      </a-col>
    </a-row>
    <a-divider />
    <a-collapse v-model="activeKey">
      <a-collapse-panel key="1" header="患者信息">
        <a-row>
          <a-col :span="7">
            <a-form-item label="患者姓名">
              <a-input :disabled="record.IsAppendApply" v-decorator="['PatientName', {rules: [{required: this.strategys.PatientName.required, message: '请输入患者姓名'}]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7" style="margin-left:15px;">
            <a-input-group compact>
              <a-form-item label="年龄" style="width:75%;">
                <a-input :disabled="record.IsAppendApply" v-decorator="['Age', {rules: [{required: this.strategys.Age.required, message: '请输入患者年龄'}]}]" />
              </a-form-item>
              <a-form-item label="" style="width:25%;">
                <a-select :disabled="record.IsAppendApply" v-decorator="['AgeType', {initialValue: (Number(record.AgeType) >= 0 ? record.AgeType : '0')}]">
                  <a-select-option value="0">
                    岁
                  </a-select-option>
                  <a-select-option value="1">
                    月
                  </a-select-option>
                  <a-select-option value="2">
                    天
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-input-group>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="性别">
              <a-radio-group :disabled="record.IsAppendApply" name="Sex" v-decorator="['Sex', {rules: [{required: this.strategys.Sex.required, message: '请选择性别'}]}]">
                <a-radio value="0">
                  男
                </a-radio>
                <a-radio value="1">
                  女
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="7">
            <a-form-item label="民族">
              <a-select :disabled="record.IsAppendApply" v-decorator="['Nation', {rules: [{required: this.strategys.Nation.required, message: '请输入民族'}]}, {initialValue: record.Nation}]" >
                <a-select-option v-for="d in nationType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="手机号">
              <a-input :disabled="record.IsAppendApply" v-decorator="['MobileNo', {rules: [{required: this.strategys.MobileNo.required, message: '请输入手机号'}]}, {initialValue: record.MobileNo}]" />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="身份证">
              <a-input :disabled="record.IsAppendApply" v-decorator="['IDCard', {rules: [{required: this.strategys.IDCard.required, message: '请输入身份证'}]}, {initialValue: record.IDCard}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="7">
            <a-form-item label="病人ID">
              <a-input :disabled="record.IsAppendApply" v-decorator="['HisNo', {initialValue: record.HisNo}]" />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="家属姓名">
              <a-input :disabled="record.IsAppendApply" v-decorator="['KinName', {initialValue: record.KinName}]" />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="家属手机号">
              <a-input :disabled="record.IsAppendApply" v-decorator="['KinMobile', {initialValue: record.KinMobile}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="7">
            <a-form-item label="门诊号">
              <a-input :disabled="record.IsAppendApply" v-decorator="['OutpatientNum', {rules: [{required: this.strategys.OutpatientNum.required, message: '请输入门诊号'}]}, {initialValue: record.OutpatientNum}]" />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="住院号">
              <a-input :disabled="record.IsAppendApply" v-decorator="['AdmissionNum', {rules: [{required: this.strategys.AdmissionNum.required, message: '请输入住院号'}]}, {initialValue: record.AdmissionNum}]" />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="床号">
              <a-input :disabled="record.IsAppendApply" v-decorator="['BedNo', {rules: [{required: this.strategys.BedNo.required, message: '请输入床号'}]}, {initialValue: record.BedNo}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="this.strategys.MenstrualTime.visible">
          <a-col :span="7">
            <a-form-item label="末次月经">
              <a-date-picker :disabled="record.IsAppendApply" v-decorator="['MenstrualTime', {rules: [{required: this.strategys.MenstrualTime.required, message: '请选择末次月经'}]}, {initialValue: record.MenstrualTime}]" show-time placeholder="末次月经" />
            </a-form-item>
          </a-col>
          <a-col :span="7">
            <a-form-item label="" class="flag" style="margin-left:10px;">
              <a-checkbox v-model="IsMenstrualTime" @change="changeMenstraul">否
              </a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
        </a-row>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="检查信息">
        <a-row>
          <a-col :span="7">
            <a-form-item label="送检类型">
              <a-select :disabled="record.IsAppendApply" @change="pathologyCodeTypeChange" v-decorator="['PathologyCode', {rules: [{required: this.strategys.PathologyCode.required, message: '请输入送检类型'}]}, {initialValue: record.PathologyCode}]" >
                <a-select-option v-for="d in pathologyCodeType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="送检医生">
              <a-select show-search option-filter-prop="children" :disabled="record.IsAppendApply" v-decorator="['AppDoctor', {rules: [{required: this.strategys.AppDoctor.required, message: '请输入送检医生'}]}, {initialValue: record.AppDoctor}]" >
                <a-select-option v-for="d in doctors" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="送检科室">
              <a-select show-search option-filter-prop="children" :disabled="record.IsAppendApply" v-decorator="['SendDepartment', {rules: [{required: this.strategys.SendDepartment.required, message: '请输入送检科室'}]}, {initialValue: record.SendDepartment}]" >
                <a-select-option v-for="d in departmentType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="检查项目" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <a-tree-select
                :disabled="record.IsAppendApply"
                show-search
                v-decorator="['ExamItem', {rules: [{required: this.strategys.ExamItem.required, message: '请输入检查项目'}]}, {initialValue: record.ExamItem }]"
                style="width: 100%"
                :tree-data="examItemType"
                tree-checkable
                search-placeholder="Please select"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-input-group>
              <a-form-item label="标本类型" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
                <a-tree-select
                  :disabled="record.IsAppendApply"
                  show-search
                  v-decorator="['SpecimenType', {rules: [{required: this.strategys.SpecimenType.required, message: '请输入检查项目'}]}, {initialValue: record.SpecimenType }]"
                  style="width: 100%"
                  :tree-data="specimenTypes"
                  tree-checkable
                  search-placeholder=""
                />
              </a-form-item>
              <a-form-item label="标本类型其它" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
                <a-input v-decorator="['SpecimenTypeOther']" />
              </a-form-item>
            </a-input-group>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-input-group>
              <a-form-item label="宫颈涂片填写项" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
                <a-tree-select
                  :disabled="record.IsAppendApply"
                  show-search
                  v-decorator="['SpecimenTypeItem', {rules: [{required: this.strategys.SpecimenTypeItem.required, message: '请输入检查项目'}]}, {initialValue: record.SpecimenTypeItem }]"
                  style="width: 100%"
                  :tree-data="gjtp"
                  tree-checkable
                  search-placeholder=""
                />
              </a-form-item>
              <a-form-item label="宫颈涂片其它" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
                <a-input v-decorator="['SpecimenTypeItemOther']" />
              </a-form-item>
            </a-input-group>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="7">
            <a-form-item label="原申请单">
              <a-input :disabled="true" v-decorator="['OllAppOrder', {initialValue: record.AppNo}]" />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="3">
            <a-form-item label="" class="flag">
              <a-checkbox v-decorator="['ContagionFlag', {rules: [{required: this.strategys.ContagionFlag.required, message: '请选择是否传染源'}], valuePropName: 'checked', initialValue: this.toBoolear(record.ContagionFlag)}]">是否传染源
              </a-checkbox>
            </a-form-item>
          </a-col>
          <a-col :span="7">
            <a-form-item label="" class="flag">
              <a-radio-group @change="feeIhcFlagChange" name="radioGroup" v-decorator="['FeeIhcFlag', {rules: [{required: this.strategys.FeeIhcFlag.required, message: '请选择是否免疫组化'}], initialValue: record.FeeIhcFlag}]">
                <a-radio value="Y">
                  是
                </a-radio>
                <a-radio value="N">
                  否（是否免疫组化）
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
        </a-row>
        <a-row>
          <a-col :span="7">
            <a-form-item label="项目费用">
              <a-input :disabled="record.IsAppendApply" v-decorator="['CostAmount', {rules: [{required: this.strategys.CostAmount.required, message: '请输入项目费用'}]}, {initialValue: record.CostAmount}]" />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="" class="flag">
              <a-checkbox v-decorator="['IsPay', {rules: [{required: this.strategys.IsPay.required, message: '请选择是否缴费'}], valuePropName: 'checked', initialValue: record.IsPay === 'N'}]">未缴费
              </a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="免疫组化" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
              <a-textarea :disabled="record.IsAppendApply" v-decorator="['FeeIhcItem', {rules: [{required: this.strategys.FeeIhcItem.required, message: '请输入免疫组化项目'}]}, {initialValue: record.FeeIhcItem}]"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="临床诊断" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
              <a-textarea :disabled="record.IsAppendApply" v-decorator="['ClinicalDiagnosis', {rules: [{required: this.strategys.ClinicalDiagnosis.required, message: '请输入临床诊断'}]}, {initialValue: record.ClinicalDiagnosis}]"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="病史" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
              <a-textarea :disabled="record.IsAppendApply" v-decorator="['BriefHistory', {rules: [{required: this.strategys.BriefHistory.required, message: '请输入病史'}]}, {initialValue: record.BriefHistory}]"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="手术信息">
        <a-row>
          <a-col :span="7">
            <a-form-item label="手术室">
              <a-input :disabled="record.IsAppendApply" v-decorator="['OperatingRoom', {rules: [{required: this.strategys.OperatingRoom.required, message: '请输入手术室'}]}, {initialValue: record.OperatingRoom}]" />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="手术间">
              <a-input :disabled="record.IsAppendApply" v-decorator="['OperatingRoomNo', {rules: [{required: this.strategys.OperatingRoomNo.required, message: '请输入手术间'}]}, {initialValue: record.OperatingRoomNo}]" />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="台号">
              <a-input :disabled="record.IsAppendApply" v-decorator="['OperatingNo', {rules: [{required: this.strategys.OperatingNo.required, message: '请输入台号'}]}, {initialValue: record.OperatingNo}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="7">
            <a-form-item label="手术类型">
              <a-input :disabled="record.IsAppendApply" v-decorator="['SurgeryType', {rules: [{required: this.strategys.SurgeryType.required, message: '请选择手术类型'}]}, {initialValue: record.SurgeryType}]" />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="开始时间">
              <a-date-picker :disabled="record.IsAppendApply" v-decorator="['OperatingStartTime', {rules: [{required: this.strategys.OperatingStartTime.required, message: '请选择开始时间'}]}, {initialValue: record.OperatingStartTime}]" show-time placeholder="开始时间" />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="7">
            <a-form-item label="结束时间">
              <a-date-picker :disabled="record.IsAppendApply" v-decorator="['OperatingEndTime', {rules: [{required: this.strategys.OperatingEndTime.required, message: '请选择结束时间'}]}, {initialValue: record.OperatingEndTime}]" show-time placeholder="结束时间" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="术中所见" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
              <a-textarea :disabled="record.IsAppendApply" v-decorator="['SurgicalDesc', {rules: [{required: this.strategys.SurgicalDesc.required, message: '请输入术中所见'}]}, {initialValue: record.SurgicalDesc}]"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-collapse-panel>
    </a-collapse>
    <div style="margin: 10px 0"></div>
    <a-row v-if="this.strategys.Specimens.visible">
      <div>
        <a-space>
          <a-button type="primary" icon="plus" @click="addSpecimen">
            新增
          </a-button>
          <a-popconfirm placement="rightBottom" ok-text="是" cancel-text="否" @confirm="delSpecimen">
            <template slot="title">
              <p>是否删除</p>
            </template>
            <a-button type="danger" icon="delete">
              删除
            </a-button>
          </a-popconfirm>
          <a-input
            :value="AllLeaveTime"
            placeholder="输入离体时间"
            @focus="e => focusEvent(e, 'AllLeaveTime')"
            @keyup="e => onChange(e, -1, 'AllLeaveTime')"
            @blur="e => handleChange(e, -1, 'AllLeaveTime')"
            @pressEnter="e => handleChange(e, -1, 'AllLeaveTime')"
          />
          <a-input
            :value="AllFixedTime"
            placeholder="输入固定时间"
            @focus="e => focusEvent(e, 'AllFixedTime')"
            @keyup="e => onChange(e, -1, 'AllFixedTime')"
            @blur="e => handleChange(e, -1, 'AllFixedTime')"
            @pressEnter="e => handleChange(e, -1, 'AllFixedTime')"
          />
          <a-select show-search :value="FixLiquid" style="width:150px;" @change="e => handleChange(e, -1, 'AllFixLiquid')">
            <a-select-option v-for="d in fixLiquidType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
          </a-select>
          <!-- <span style="color:crimson;">（统一修改时间后需要点击保存/打印进行存储）</span> -->
        </a-space>
        <div style="margin: 10px 0"></div>
        <a-table
          :scroll="{ y: 400 }"
          :columns="specimenColumns"
          :data-source="SpecimenData"
          :pagination="false"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          @change="handleTableChange"
          class="components-table-demo-nested">
          <template
            v-for="col in ['SpecimenName', 'PartId', 'LeaveTime', 'FixedTime', 'FixLiquid', 'OperatingRoom']"
            :slot="col"
            slot-scope="text, index2"
          >
            <div :key="col" v-if="col==='SpecimenName'">
              <a-select
                v-if="editable && text !== ''"
                placeholder=""
                :value="text"
                style="width: 150px;"
                mode="combobox"
                @change="e => handleChange(e, index2, col)"
              >
                <a-select-option v-for="d in specimenNameType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
              <a-select
                v-else-if="editable && text ===''"
                mode="combobox"
                style="width: 150px"
                placeholder=""
                :value="undefined"
                @change="e => handleChange(e, index2, col)"
              >
                <a-select-option v-for="d in specimenNameType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
              <template v-else>
                {{ text }}
              </template>
            </div>
            <div :key="col" v-if="col==='LeaveTime'">
              <a-input
                v-if="editable && text!==''"
                :value="text"
                placeholder="输入离体时间"
                @focus="e => focusEvent(e, 'LeaveTime')"
                @keyup="e => onChange(e, index2, 'LeaveTime')"
                @blur="e => handleChange(e, index2, 'LeaveTime')"
                @pressEnter="e => handleChange(e, index2, 'LeaveTime')"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
            <div :key="col" v-if="col==='FixedTime'">
              <a-input
                v-if="editable && text!==''"
                :value="text"
                placeholder="选择固定时间"
                @focus="e => focusEvent(e, 'FixedTime')"
                @keyup="e => onChange(e, index2, 'FixedTime')"
                @blur="e => handleChange(e, index2, 'FixedTime')"
                @pressEnter="e => handleChange(e, index2, 'FixedTime')"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
            <div :key="col" v-if="col==='FixLiquid'">
              <a-select
                v-if="editable && text!==''"
                show-search
                placeholder="选择固定液"
                :value="text"
                style="width:150px;"
                @change="e => fixLiquidChange(e, index2)"
              >
                <a-select-option v-for="d in fixLiquidType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>
        </a-table>
      </div>
    </a-row>
    <a-modal
      v-model="OrderListVisible"
      :centered="true"
      width="1000px"
      title="申请单列表"
    >
      <template slot="footer">
        <a-button @click="continuAdd">手动增加</a-button>
      </template>
      <template slot="footer">
        <a-button @click="continuHisAdd">His调取</a-button>
      </template>
      <a-alert :message="alertMessage" type="success" />
      <a-table
        :columns="Columns"
        :data-source="Data"
      >
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
import pick from 'lodash.pick'
import enums from '@/store/enum/enum'
import moment from 'moment'
import storage from 'store'
import { UpdateField } from '@/utils/dataFormat'
import { getCheckItemData, insertCheckItem } from '@/api/basics/checkitem'
import { saveOrder, getHisInfo, getSpecimenNames } from '@/api/submission/app'
import { GetHISURL } from '@/api/common/util'
import { getDepartmentData, saveDepartment } from '@/api/basics/department'
import { getDictByName } from '@/api/system/dictionary'
import { getDoctors, saveSysUser } from '@/api/system/user'
import { delSpecimens } from '@/api/submission/precheck'
import { RandomString, CheckField, StringToTime, LoadNowTimeAdd, JSONStringToObject } from '@/utils/util'
import { getHisReqTypeByIp } from '@/api/system/hisReqConfig'
import { taskRun } from '@/api/system/login'
import { getStrategyTemplate } from '@/api/system/strategy'
import { getSubmissionTypes } from '@/api/system/workflow'

const specimenTypes = [
  { 'title': '痰', 'value': '痰', key: 1 },
  { 'title': '支气管刷检/灌洗液', 'value': '支气管刷检/灌洗液', key: 2 },
  { 'title': '胃冲洗液', 'value': '胃冲洗液', key: 3 },
  { 'title': '胸腔积液', 'value': '胸腔积液', key: 4 },
  { 'title': '腹腔积液/腹腔冲洗液', 'value': '腹腔积液/腹腔冲洗液', key: 5 },
  { 'title': '脑脊液', 'value': '脑脊液', key: 6 },
  { 'title': '尿/膀胱冲洗液', 'value': '尿/膀胱冲洗液', key: 7 },
  { 'title': '针吸细胞学涂片', 'value': '针吸细胞学涂片', key: 8 },
  { 'title': '宫颈涂片/阴道残端', 'value': '宫颈涂片/阴道残端', key: 9 },
  { 'title': '其它', 'value': '', key: 10 }
]
const gjtp = [
  { 'title': '注射/口服避孕药', 'value': '注射/口服避孕药', key: 1 },
  { 'title': '宫内节育器', 'value': '宫内节育器', key: 2 },
  { 'title': '怀孕', 'value': '怀孕', key: 3 },
  { 'title': '产后四个月', 'value': '产后四个月', key: 4 },
  { 'title': '哺乳期', 'value': '哺乳期', key: 5 },
  { 'title': '手术后', 'value': '手术后', key: 6, children: [ { 'title': '子宫切除术', 'value': '子宫切除术', key: 61 }, { 'title': '宫颈切除/Leep术', 'value': '宫颈切除/Leep术', key: 62 }, { 'title': '卵巢切除', 'value': '卵巢切除', key: 63 } ] },
  { 'title': '不正常流血', 'value': '不正常流血', key: 7 },
  { 'title': 'HPV感染', 'value': 'HPV感染', key: 8 },
  { 'title': '其它', 'value': '', key: 9 }
]
const fields = ['Id', 'Status', 'SpecimenType', 'SpecimenTypeItem', 'Nation', 'SpecimenTypeOther', 'SpecimenTypeItemOther', 'CostAmount', 'PatientName', 'PathologyCode', 'FeeIhcFlag', 'ExamItem', 'FeeIhcItem', 'Age', 'Sex', 'MobileNo', 'IDCard', 'HisNo', 'KinName', 'KinMobile', 'OutpatientNum', 'AdmissionNum', 'BedNo', 'ClinicalDiagnosis',
'BriefHistory', 'OperatingRoom', 'OperatingRoomNo', 'HisID', 'ReqDateTime', 'OperatingNo', 'MenstrualTime', 'SurgeryType', 'OperatingStartTime', 'OperatingEndTime', 'SurgicalDesc', 'SendDepartment', 'AppDoctor', 'OllAppOrder']
const Data = []
const Columns = [
  { title: '患者名称', dataIndex: 'PatientName' },
  { title: '患者Id', dataIndex: 'HisNo' },
  { title: '开单时间', dataIndex: 'ReqDateTime' },
  { title: '检查项目', dataIndex: 'ExamItem' },
  { title: '标本', dataIndex: 'SendMaterial' },
  { title: '送检医生', dataIndex: 'DoctorName' },
  { title: '送检科室', dataIndex: 'DepartmentName' },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
]
const specimenColumns = [
  { title: '序号', width: 55, customRender: (t, r, index) => (index + 1) },
  { title: '标本名称', dataIndex: 'SpecimenName', width: 130, scopedSlots: { customRender: 'SpecimenName' } },
  { title: '离体时间', dataIndex: 'LeaveTime', width: 130, scopedSlots: { customRender: 'LeaveTime' } },
  { title: '固定时间', dataIndex: 'FixedTime', width: 130, scopedSlots: { customRender: 'FixedTime' } },
  { title: '固定液', dataIndex: 'FixLiquid', width: 130, scopedSlots: { customRender: 'FixLiquid' } }
]
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
  allMinuteVal: ''
}
export default {
  name: 'Edit2',
  props: {
    record: {
      type: Object,
      default: null
    },
    editMark: {
      type: String,
      default: null
    },
    parentObj: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      strategys: {},
      keyType: '3',
      key: '',
      index: 0,
      total: 1,
      patientData: [],
      Data,
      Columns,
      gjtp,
      specimenTypes,
      specimenColumns,
      specimenNameType: [],
      editable: true,
      OrderListVisible: false,
      visible: false,
      IsMenstrualTime: false,
      layout: 'horizontal',
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 17
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
      AllLeaveTime: '',
      AllFixedTime: '',
      timer,
      HisUrl: '',
      HisReqType: '2',
      alertMessage: '当前【标本追溯系统】该门诊号/住院号存在下列申请单',
      flag: 'his'
    }
  },
  created () {
    // 表单策略初始化
    this.strategys = this.record.strategys
    // 编辑状态的表单初始化
    if (this.editMark === 'yes') {
      storage.remove('flag')
      this.strategys.MenstrualTime.required = false
      this.IsMenstrualTime = true
      // 对多个项目情况下进行初始化处理
      if (CheckField(this.record.ExamItem) && this.record.ExamItem.indexOf('|') >= 0) {
        this.record.ExamItem = this.record.ExamItem.split('|')
      }
      if (CheckField(this.record.SpecimenType) && this.record.SpecimenType.indexOf('|') >= 0) {
        this.record.SpecimenType = this.record.SpecimenType.split('|')
      }
      if (CheckField(this.record.SpecimenTypeItem) && this.record.SpecimenTypeItem.indexOf('|') >= 0) {
        this.record.SpecimenTypeItem = this.record.SpecimenTypeItem.split('|')
      }
    } else {
      for (var key in this.strategys) {
        this.record[key] = this.strategys[key].default
      }
    }
    if (CheckField(this.record.ExamItem) === false) {
      this.record.ExamItem = null
    }
    if (CheckField(this.record.SpecimenType) === false) {
      this.record.SpecimenType = null
    }
    if (CheckField(this.record.SpecimenTypeItem) === false) {
      this.record.SpecimenTypeItem = null
    }
    // 外部链接初始化
    if (CheckField(storage.get('flag')) === true) {
      getStrategyTemplate('AppEdit').then(res => {
        this.strategys = JSONStringToObject(res.Content)
      })
      taskRun().then(res => {})
      this.record.AppDoctor = storage.get('name')
      this.record.SendDepartment = storage.get('dept')
      this.keyType = storage.get('type')
      this.key = storage.get('number')
      this.onSearch()
    }
    // 默认离体时间为当前，固定时间为离体时间后15分钟
    this.AllLeaveTime = LoadNowTimeAdd('minute', 0)
    this.AllFixedTime = LoadNowTimeAdd('minute', 15)
    // 初始化组件项信息
    this.getCheckItemData('Routine')
    this.getHisUrl()
    this.getDepartmentData()
    this.getDoctors()
    this.getDefaultFixLiquid()
    this.getSpecimenNames()
    this.loadConfig()
    this.getSubmissionTypes()
    this.SpecimenData = []
  },
  mounted () {
    const $this = this
    this.$nextTick(() => {
      // #region 对时间进行格式化
      if (CheckField(this.record) && CheckField(this.record.OperatingStartTime)) {
        this.record.OperatingStartTime = moment(this.record.OperatingStartTime)
      }
      if (CheckField(this.record) && CheckField(this.record.OperatingEndTime)) {
        this.record.OperatingEndTime = moment(this.record.OperatingEndTime)
      }
      // #endregion

      // #region 不存在Id状态值，则表单项默认状态
      if (this.record.Id === undefined) {
        this.record.PathologyCode = 'Routine'
        this.getDictByName(() => {
          $this.form.setFieldsValue(pick($this.record, fields))
        })
      } else {
        this.record.Specimens.forEach(item => {
          item.key = RandomString(32)
        })
        this.SpecimenData = this.record.Specimens
      }
      // #endregion

      // #region 如果存在住院号则自动查询
      if (CheckField(this.record) && CheckField(this.record.Code)) {
        this.keyType = '2'
        this.key = this.record.Code
        this.record.IsAppendApply = false
        this.getPatientInfoByHis()
      }
      // #endregion
      this.form.setFieldsValue(pick(this.record, fields))
    })
  },
  methods: {
    pathologyCodeTypeChange (val) {
      this.getCheckItemData(val)
    },
    getSubmissionTypes () {
      getSubmissionTypes().then(res => {
        res.forEach(element => {
          this.pathologyCodeType.push({
            value: element.Content,
            text: element.Name
          })
        })
      })
    },
    feeIhcFlagChange (val) {
      if (val.target.value === 'Y') {
        this.strategys.FeeIhcItem.required = true
      } else {
        this.strategys.FeeIhcItem.required = false
      }
    },
    loadConfig () {
      if (CheckField(storage.get('type')) === false) {
        getHisReqTypeByIp().then(res => {
          if (res.Data) {
            this.keyType = res.Data.ReqType
          } else {
            getDictByName('申请单His默认查询类型').then(res => {
              if (CheckField(res.data)) {
                this.keyType = res.data
                this.HisReqType = res.data
              }
            })
          }
        })
      }
    },
    changeMenstraul (obj) {
      if (obj.target.checked) {
        this.strategys.MenstrualTime.required = false
      } else {
        this.strategys.MenstrualTime.required = true
      }
    },
    // 继续增加申请单（在本地存在申请单的情况下）
    continuAdd () {
      this.OrderListVisible = false
      this.record.Id = null
      this.keyType = this.HisReqType
    },
    continuHisAdd () {
      this.OrderListVisible = false
      this.record.Id = null
      this.keyType = CheckField(storage.get('type')) ? storage.get('type') : this.keyType
      this.getPatientInfoByHis('his')
    },
    getSpecimenNames () {
      getSpecimenNames().then((res) => {
        res.data.forEach(item => {
          this.specimenNameType.push({ value: item.SpecimenName, text: item.SpecimenName })
        })
      })
    },
    updateTime (methodName, item, type) {
      if (methodName === 'UpdateFixedTime' && this.record.PathologyCode !== 'Frozen') {
          if (CheckField(item.LeaveTime) && CheckField(item.FixedTime) && StringToTime(item.LeaveTime) > StringToTime(item.FixedTime)) {
            this.$message.warning('固定时间不能小于离体时间', 2)
          } else if (item.FixedTime !== '' && (item.FixLiquid === null || typeof (item.FixLiquid) === 'undefined')) {
            this.$message.warning('常规送检固定液不能为空', 2)
            UpdateField(this.SpecimenData, item.Id, 'FixedTime', '')
          } else if (item.FixedTime === '' && type === 'hand') {
            // 手动固定清空
            UpdateField(this.SpecimenData, item.Id, 'FixedTime', '')
          } else {
            // 固定
            UpdateField(this.SpecimenData, item.Id, 'FixedTime', item.FixedTime)
          }
      } else if (methodName === 'UpdateLeaveTime') {
          // 离体
          UpdateField(this.SpecimenData, item.Id, 'LeaveTime', item.LeaveTime)
      }
    },
    onChange (e, obj, column) {
      this.timer.total += 1
      if (this.timer.minute === false && this.timer.total >= 2) {
          this.timer.minute = true
          this.setInputSelection(e.target, 14, 16) // 分钟 将被选中
      } else if (this.timer.second === false && this.timer.total >= 4) {
          this.timer.second = true
          this.setInputSelection(e.target, 17, 19) // 秒钟 将被选中
      }
    },
    handleChange (value, obj, column) {
      let exist = false
      if (column === 'SpecimenName') {
        this.SpecimenData.forEach(item => {
          if (item.key === obj.key) {
            item.SpecimenName = value === undefined ? '' : value
            exist = true
          }
        })
        if (exist === false) {
          obj.SpecimenName = value === undefined ? '' : value
        }
      }
      if (column === 'FixedTime' && this.record.PathologyCode !== 'Frozen') {
        if (CheckField(obj.LeaveTime) && CheckField(value.target.value) && StringToTime(value.target.value) < StringToTime(obj.LeaveTime)) {
          this.$message.warning('固定时间不能小于离体时间', 2)
          return
        }
        CheckField(obj.Id) ? UpdateField(this.SpecimenData, obj.Id, column, value.target.value) : UpdateField(this.SpecimenData, obj.key, column, value.target.value)
      }
      if (column === 'LeaveTime') {
        CheckField(obj.Id) ? UpdateField(this.SpecimenData, obj.Id, column, value.target.value) : UpdateField(this.SpecimenData, obj.key, column, value.target.value)
      }
      if (column === 'AllLeaveTime') {
          UpdateField(this.SpecimenData, 0, 'LeaveTime', value.target.value)
      }
      if (column === 'AllFixedTime') {
          UpdateField(this.SpecimenData, 0, 'FixedTime', value.target.value)
      }
      if (column === 'AllFixLiquid') {
        this.FixLiquid = value
        UpdateField(this.SpecimenData, 0, 'FixLiquid', value)
      }
    },
    // 鼠标焦点进入input触发事件
    focusEvent (e, type) {
      timer.hour = false
      timer.minute = false
      timer.second = false
      timer.minuteValue = ''
      this.setInputSelection(e.target, 11, 13) // 小时 将被选中
      timer.total = 0
    },
    // 响应focusEvent事件，触发后会对input指定内容进行选中
    setInputSelection (input, startPos, endPos) {
      if (typeof input.selectionStart !== 'undefined') {
          input.selectionStart = startPos
          input.selectionEnd = endPos
      } else if (document.selection && document.selection.createRange) {
          // IE branch
          input.select()
          var range = document.selection.createRange()
          range.collapse(true)
          range.moveEnd('character', endPos)
          range.moveStart('character', startPos)
          range.select()
      }
    },
    getDefaultFixLiquid () {
      getDictByName('默认固定液').then(res => {
        if (res.data && res.data.length > 0) {
          this.FixLiquid = res.data
        }
      })
    },
    fixLiquidChange (text, index) {
      index.FixLiquid = text
    },
    addSpecimen () {
      let isOnly = true
      let key = ''
      do {
        key = RandomString(32)
        const specimen = this.SpecimenData.filter(w => w.key === key)
        if (specimen.length !== 0) {
          isOnly = false
        }
      } while (isOnly === false)
      this.SpecimenData.push({ key: key, 'OperatingRoom': this.record.OperatingRoom, 'AppId': this.AppId, 'FixedTime': LoadNowTimeAdd('minute', 15), 'LeaveTime': LoadNowTimeAdd('minute', 0), 'FixLiquid': this.FixLiquid, 'SpecimenName': '', 'PartId': '', 'PartName': '' })
      this.pagination2.total = this.SpecimenData.length
    },
    delSpecimen () {
      const sData = this.SpecimenData.filter(f => this.selectedRowKeys.includes(f.key) && CheckField(f.Id) === true)
      const ids = []
      if (sData.length === 0) {
        const tempData = this.SpecimenData.filter(f => !this.selectedRowKeys.includes(f.key))
        this.SpecimenData = tempData
      } else {
        sData.forEach(item => {
          ids.push(item.Id)
        })
        delSpecimens({ 'ids': ids }).then(res => {
          if (res.HttpStatusCode === 200 && res.ResultType === 1) {
            this.$message.success('操作成功！', 2)
            const _tempData = this.SpecimenData.filter(w => !this.selectedRowKeys.includes(w.key))
            this.SpecimenData = _tempData
          } else {
            this.$message.error(res.Message, 2)
          }
        })
      }
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination2 }
      pager.current = pagination.current
      this.pagination2 = pager
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    checkOrder (code) {
      this.record = null
      this.record = code
      this.loadPatientInfo(code)
      this.OrderListVisible = false
    },
    toBoolear (val) {
      if (CheckField(val) === false) {
        return false
      }
      if (val === false) {
        return false
      } else if (val === 'N') {
        return false
      } else {
        return true
      }
    },
    getDoctors () {
      getDoctors().then(res => {
        if (res.Data !== null) {
          res.Data.forEach(item => {
            this.doctors.push({ value: item.UserCode, text: item.UserName })
          })
        }
      })
    },
    getDictByName (callback) {
      const $this = this
      getDictByName('默认申请科室').then(res => {
        if (res.data && res.data.length > 0) {
          $this.record.Department = res.data
          callback()
        }
      })
    },
    getDepartmentData () {
      const $this = this
      getDepartmentData().then(res => {
        if (res.data !== null) {
          res.data.forEach(item => {
            $this.departmentType.push({ value: item.DeptCode, text: item.DeptName })
          })
        }
      })
    },
    getCheckItemData (val) {
      const _temp = []
      getCheckItemData().then((res) => {
        if (res.data !== null) {
          res.data.forEach(item => {
            if (item.PathologyCode === val) {
              _temp.push({ value: item.ItemName, title: item.ItemName, key: RandomString(32), target: item.PathologyCode })
            }
          })
        }
      })
      this.examItemType = _temp
    },
    onSearch () {
      this.getPatientInfoByHis()
    },
    getPatientInfoByHis (flag) {
      const $this = this
      getHisInfo(this.keyType, this.key, flag).then((res) => {
        if (res === null || res.data === null) {
          $this.$message.warning('该号码不存在记录，请检查！')
          return
        }
        this.flag = res.flag
        if (res.flag === 'his') {
          this.alertMessage = '当前【His系统】该门诊号/住院号存在下列申请单'
        } else {
          this.alertMessage = '当前【标本追溯系统】该门诊号/住院号存在下列申请单'
        }
        // 如果本地不存在数据则自动查询His,这里注意防止死循环
        if (res && res.data.length === 0 && flag === 'local') {
          this.keyType = storage.get('type')
          this.onSearch()
        }
        if (res && res.data.length > 0) {
          res.data.forEach((item) => {
            // #region 对时间进行格式化
            if (CheckField(item.OperatingStartTime) === true) {
              item.OperatingStartTime = moment(item.OperatingStartTime)
            } else {
              item.OperatingStartTime = ''
            }
            if (CheckField(item.OperatingEndTime) === true) {
              item.OperatingEndTime = moment(item.OperatingEndTime)
            } else {
              item.OperatingEndTime = ''
            }
          })
          $this.Data = res.data
          $this.OrderListVisible = true
        } else {
          $this.$message.warning('该号码不存在记录，请检查！')
        }
      }).catch(res => {
        if (!CheckField(res)) {
          $this.$message.error('该住院号患者不存在', 1)
          return
        }
        $this.$message.error(res, 1)
      })
    },
    loadPatientInfo (_data) {
      if (CheckField(_data.Id) === true && _data.Id !== 0) {
        this.strategys.MenstrualTime.required = false
        this.IsMenstrualTime = true
      }
      // #region 判断HIS获取的病人信息对应的送检科室是否存在病理送检系统中
      if (this.departmentType.filter(w => w.value === _data.DepartmentName).length <= 0) {
        const _fieldData = { 'DeptCode': CheckField(_data.DepartmentName) === false ? '' : _data.DepartmentName, 'DeptName': CheckField(_data.DepartmentName) === false ? '' : _data.DepartmentName, 'DeptPRO': 0, 'ValidState': 1 }
        saveDepartment(_fieldData).then(res => {
          if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
            this.departmentType.push({ value: _data.DepartmentName, text: _data.DepartmentName })
            this.loadFormData(_data)
          }
        })
      } else {
        this.loadFormData(_data)
      }
      // #endregion
      // #region 判断HIS获取的病人信息对应的医生是否存在病理送检系统中
      if (this.doctors.filter(w => w.value === _data.DoctorCode).length <= 0) {
        var _fieldData = { 'LoginName': CheckField(_data.DoctorCode) === false ? '' : _data.DoctorCode, 'LoginPwd': CheckField(_data.DoctorCode) === false ? '' : _data.DoctorCode, 'UserCode': CheckField(_data.DoctorCode) === false ? '' : _data.DoctorCode, 'Department': CheckField(_data.Department) === false ? '' : _data.Department, 'UserName': CheckField(_data.DoctorName) === false ? '' : _data.DoctorName, 'UserType': '医生', 'Status': 1, 'Remark': '通过HIS接口获取申请单时创建，该用户尚未配置角色' }
        saveSysUser(_fieldData).then(res => {
          if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
            this.doctors.push({ value: _data.DoctorCode, text: _data.DoctorName })
            this.loadFormData(_data)
          }
        })
      } else {
        this.loadFormData(_data)
      }
      // #endregion
      // #region 判断His获取的检查项目是否存在
      if (this.examItemType.filter(w => w.value === _data.ExamItem).length <= 0) {
        const examItem = { 'ItemCode': _data.ExamItem, 'ItemName': _data.ExamItem }
        insertCheckItem(examItem).then((res) => {
          if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
            this.examItemType.push({ value: _data.ExamItem, title: _data.ExamItem, key: RandomString(32) })
            this.loadFormData(_data)
          }
        }).catch(error => {
            this.$message.error(error.$message, 2)
        })
      } else {
        this.loadFormData(_data)
      }
      // #endregion
    },
    loadFormData (data) {
      if (data.OperatingStartTime !== undefined && data.OperatingStartTime !== '') {
        data.OperatingStartTime = moment(data.OperatingStartTime)
      }
      if (data.OperatingEndTime !== undefined && data.OperatingEndTime !== '') {
        data.OperatingEndTime = moment(data.OperatingEndTime)
      }
      // #region 格式化标本列表
      this.SpecimenData = []
      if (this.flag === 'local' && data.Specimens.length > 0) {
        this.SpecimenData = data.Specimens
        this.SpecimenData.forEach(item => {
          item.key = RandomString(32)
        })
      }
      if (data.SendMaterial !== null && data.SendMaterial !== undefined && data.SendMaterial.length > 0) {
        var specimens = data.SendMaterial.split('|')
        specimens.forEach((item, index) => {
            if (CheckField(item) === true) {
              const key = RandomString(32)
              this.SpecimenData.push({ key: key, 'OperatingRoom': this.record.OperatingRoom, 'AppId': this.AppId, 'FixedTime': LoadNowTimeAdd('minute', 15), 'LeaveTime': LoadNowTimeAdd('minute', 0), 'FixLiquid': this.FixLiquid, 'SpecimenName': item, 'PartId': '', 'PartName': '' })
            }
        })
      }
      // #endregion
      if (this.flag === 'his') {
        data.AppDoctor = data.DoctorCode
        data.SendDepartment = data.DepartmentName
        // 对表单中空状态的项进行默认赋值
        for (var item in this.strategys) {
          const a = data[item]
          if (CheckField(a) === false) {
            data[item] = this.strategys[item].default
          }
        }
      }
      this.form.setFieldsValue(pick(data, fields))
    },
    getHisUrl () {
      GetHISURL().then((item) => {
        this.HisUrl = item.data
      })
    },
    onOk () {
      return new Promise(resolve => {
        this.form.validateFields((errors, values) => {
          if (!errors) {
            if (values.OperatingStartTime) {
              values.OperatingStartTime = moment(values.OperatingStartTime).format('YYYY-MM-DD HH:mm:ss')
            }
            if (values.OperatingEndTime) {
              values.OperatingEndTime = moment(values.OperatingEndTime).format('YYYY-MM-DD HH:mm:ss')
            }
            if (values.MenstrualTime) {
              values.MenstrualTime = moment(values.MenstrualTime).format('YYYY-MM-DD HH:mm:ss')
            }
            values.Specimens = this.SpecimenData
            this.$parent.$parent.$refs.footer.childNodes[0].childNodes[1].disabled = true
            // 多检查项目情况下处理
            if (Object.prototype.toString.call(values.ExamItem) === '[object Array]') {
              values.ExamItem = values.ExamItem.join('|')
            }
            if (CheckField(values.SpecimenType) && Object.prototype.toString.call(values.SpecimenType) === '[object Array]') {
              values.SpecimenType = values.SpecimenType.join('|')
            }
            if (CheckField(values.SpecimenTypeItem) && Object.prototype.toString.call(values.SpecimenTypeItem) === '[object Array]') {
              values.SpecimenTypeItem = values.SpecimenTypeItem.join('|')
            }
            saveOrder(values).then((res) => {
              if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
                this.$message.success('操作成功！', 2)
                if (CheckField(storage.get('flag'))) {
                  storage.remove('flag')
                  storage.remove('dept')
                  storage.remove('name')
                  storage.remove('type')
                  storage.remove('number')
                }
                setTimeout(() => {
                  resolve(true)
                }, 500)
              } else {
                if (res.Message === '该门诊号或住院号存在记录') {
                  res.Data.forEach((item) => {
                    item.Department = item.SendDepartment
                    item.DoctorCode = item.AppDoctor
                  })
                  this.Data = res.Data
                  this.patientData = res.Data
                  this.OrderListVisible = true
                }
                this.$message.warning(res.Message, 2)
                this.$parent.$parent.$refs.footer.childNodes[0].childNodes[1].disabled = false
                resolve(false)
              }
            }).catch(error => {
                this.$message.error(error.$message, 2)
                this.$parent.$parent.$refs.footer.childNodes[0].childNodes[1].disabled = false
                resolve(false)
            })
          }
        })
      })
    },
    onCancel () {
      this.sourceData = []
      this.targetKeys = []
      return new Promise(resolve => {
        resolve(true)
      })
    },
    LastInfo () {
      if (this.index === 0) {
        return
      }
      this.index = this.index - 1
      this.loadPatientInfo(this.patientData[this.index])
    },
    NextInfo () {
      if ((this.index + 1) === this.total) {
        return
      }
      this.index = this.index + 1
      this.loadPatientInfo(this.patientData[this.index])
    }
  }
}
</script>
<style>
.applyedit .ant-divider{
  margin: 5px 0;
}
.flag .ant-col-17 { width:100%;}
.applyedit .ant-row .ant-form-item{
 margin-bottom:5px;
}
.ant-modal-footer {
  z-index: 999999;
  position: sticky;
  bottom: 0px;
  background-color: #ffffff
}
</style>
