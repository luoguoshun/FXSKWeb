<template>
  <div id="appMR">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="基本信息">
        <!-- new row -->
        <a-row :span="24" class="a-row">
          <a-col :key="1" :span="3">
            <a-checkbox-group v-model="medicalRecord.IsUrgent">
              <a-checkbox value="0" name="type"> 紧急病例 </a-checkbox>
            </a-checkbox-group>
          </a-col>
          <a-col :key="2" :span="3">
            <a-checkbox-group v-model="medicalRecord.IsMergeSlide">
              <a-checkbox value="0" name="type"> 合片 </a-checkbox>
            </a-checkbox-group>
          </a-col>
          <a-col :key="3" :span="3">
            <a-checkbox-group v-model="medicalRecord.ContagionFlag">
              <a-checkbox value="0" name="type"> 是否传染源 </a-checkbox>
            </a-checkbox-group>
          </a-col>
          <a-col :key="4" :span="3">
            <a-checkbox-group v-model="medicalRecord.RapidParaffinFlag">
              <a-checkbox value="0" name="type"> 是否快速 </a-checkbox>
            </a-checkbox-group>
          </a-col>
          <a-col :key="5" :span="3">
            <a-checkbox-group v-model="medicalRecord.IsLarge">
              <a-checkbox value="0" name="type"> 是否大标本 </a-checkbox>
            </a-checkbox-group>
          </a-col>
        </a-row>
        <!-- new row -->
        <a-row :span="24" class="a-row">
          <a-col :key="6" :span="6" class="a-col">
            <strong> 送检类型</strong>
            <a-select show-search placeholder="送检类型" v-model="medicalRecord.PathologyCode" style="width: 80%">
              <a-select-option v-for="(d, index) in pathologyTypes" :key="d.value + index" :value="d.value">
                {{ d.text }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :key="7" :span="6" class="a-col">
            <strong> 病理号</strong>
            <a-input-search
              v-decorator="['note', { rules: [{ required: true, message: 'Please input your note!' }] }]"
              placeholder="病理号"
              @search="onSearch"
              v-model="medicalRecord.MrCode"
              required
            />
          </a-col>
          <a-col :key="8" :span="6" class="a-col">
            <strong> 原病理号</strong>
            <a-input-search placeholder="原病理号" @search="onSearch" v-model="medicalRecord.SrcMrCode" />
          </a-col>
          <a-col :key="9" :span="6" class="a-col">
            <strong> 患者姓名</strong>
            <a-input placeholder="患者姓名" v-model="medicalRecord.PatientName" />
          </a-col>
        </a-row>
        <!-- new row -->
        <a-row :span="24" class="a-row">
          <a-col :key="10" :span="6" class="a-col">
            <strong> 患者ID</strong>
            <a-input-search placeholder="患者ID" @search="onSearch" v-model="medicalRecord.PatientID" />
          </a-col>
          <a-col :key="11" :span="6" class="a-col">
            <strong> 性别</strong>
            <a-select default-value="1" v-model="medicalRecord.Sex">
              <a-select-option value="1"> 男 </a-select-option>
              <a-select-option value="2"> 女 </a-select-option>
              <a-select-option value="3"> 其他 </a-select-option>
            </a-select>
          </a-col>
          <a-col :key="12" :span="6" style="padding-left: 45px">
            <strong> 年龄</strong>
            <a-input v-model="medicalRecord.Age" style="width: 40px" /> <span>岁</span>
            <a-input v-model="medicalRecord.AgeMonths" style="width: 40px" /> <span>月</span>
            <a-input v-model="medicalRecord.AgeDays" style="width: 40px" /> <span style="width: 10px">日</span>
          </a-col>
          <a-col :key="13" :span="6" class="a-col">
            <strong> 住院号</strong>
            <a-input placeholder="住院号" v-model="medicalRecord.AdmissionNo" />
          </a-col>
        </a-row>
        <!-- new row -->
        <a-row :span="24" class="a-row">
          <a-col :key="14" :span="6" class="a-col">
            <strong> 门诊号</strong>
            <a-input placeholder="门诊号" v-model="medicalRecord.OutpatientNo" />
          </a-col>
          <a-col :key="15" :span="6" class="a-col">
            <strong> 来源</strong>
            <a-select default-value="0" v-model="medicalRecord.SourceType">
              <a-select-option value="0">门诊 </a-select-option>
              <a-select-option value="1"> 住院 </a-select-option>
              <a-select-option value="2"> 外院 </a-select-option>
              <a-select-option value="3"> 体检 </a-select-option>
              <a-select-option value="4"> 急诊 </a-select-option>
              <a-select-option value="5"> 其他 </a-select-option>
            </a-select>
          </a-col>
          <a-col :key="16" :span="12" class="a-col">
            <strong> 证件类型</strong>
            <a-input-group compact>
              <a-select style="width: 20%" default-value="0" v-model="medicalRecord.IDType">
                <a-select-option value="0"> 身份证 </a-select-option>
                <a-select-option value="1"> 港澳台通行证 </a-select-option>
                <a-select-option value="2"> 护照 </a-select-option>
                <a-select-option value="3"> 军官士兵证 </a-select-option>
                <a-select-option value="4"> 其它 </a-select-option>
              </a-select>
              <a-input style="width: 80%" placeholder="门诊号" v-model="medicalRecord.IDCard" />
            </a-input-group>
          </a-col>
        </a-row>
        <!-- new row -->
        <a-row :span="24" class="a-row">
          <a-col :key="17" :span="12" class="a-col">
            <strong> 患者地址</strong>
            <a-input placeholder="患者地址" @search="onSearch" v-model="medicalRecord.Address" />
          </a-col>
          <a-col :key="18" :span="6" class="a-col">
            <strong> 送检医院</strong>
            <a-select default-value="lhrmyy" v-model="medicalRecord.Hospital">
              <a-select-option v-for="(d, index) in HospitalData" :key="d.value + index" :value="d.value">
                {{ d.text }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :key="19" :span="6" class="">
            <strong> 院区</strong>
            <a-select style="width: 80%" default-value="0" v-model="medicalRecord.HospitalArea">
              <a-select-option value="dongyuanqu"> 东院区 </a-select-option>
              <a-select-option value="xiyuanqu"> 西院区 </a-select-option>
              <a-select-option value="beiyuanqu"> 北院区 </a-select-option>
              <a-select-option value="nanyuanqu"> 南院区 </a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <!-- new row -->
        <a-row :span="24" class="a-row">
          <a-col :key="20" :span="6" class="a-col">
            <strong> 送检科室</strong>
            <a-select default-value="1" v-model="medicalRecord.Code" @change="deptNameChange">
              <a-select-option v-for="(d, index) in departmentData" :key="d.value + index" :value="d.value">
                {{ d.text }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :key="21" :span="6" class="a-col">
            <strong> 送检时间</strong>
            <a-date-picker format="YYYY-MM-DD HH:mm" v-model="medicalRecord.SendTime" />
          </a-col>
          <a-col :key="23" :span="6" class="a-col">
            <strong> 送检医生</strong>
            <a-input placeholder="送检医生" v-model="medicalRecord.SendDoctorCode" />
          </a-col>
          <a-col :key="24" :span="6" class="a-col">
            <strong> 送检电话</strong>
            <a-input style="width: 40%" placeholder="送检医生电话" v-model="medicalRecord.SendMobile" />
          </a-col>
        </a-row>
        <!-- new row -->
        <a-row :span="24" class="a-row">
          <a-col :key="25" :span="6" class="a-col" v-if="ConditionalRenderCom('检查项目')">
            <strong> 检查项目</strong>
            <a-select default-value="" v-model="medicalRecord.CheckMethod" @change="examItemChange">
              <a-select-option v-for="(d, index) in examItemList" :key="d.value + index" :value="d.ExamItemCode">
                {{ d.ExamItemName }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :key="29" :span="6" class="a-col" v-if="ConditionalRenderCom('检查方法')">
            <strong> 检查方法</strong>
            <a-select default-value="" v-model="medicalRecord.CheckMethod">
              <a-select-option v-for="(d, index) in checkMethodList" :key="d.value + index" :value="d.MethodCode">
                {{ d.MethodName }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :key="26" :span="6" class="a-col" v-if="ConditionalRenderCom('组织类型')">
            <strong> 组织类型</strong>
            <a-select default-value="" v-model="medicalRecord.MaterialType">
              <a-select-option value="dabiaoben">大标本 </a-select-option>
              <a-select-option value="genzhi"> 根治 </a-select-option>
              <a-select-option value="pihu"> 皮肤 </a-select-option>
              <a-select-option value="xiaobiaoben"> 小标本 </a-select-option>
            </a-select>
          </a-col>
          <a-col :key="27" :span="4" v-if="ConditionalRenderCom('临床免疫组化收费状态')">
            <a-checkbox-group v-model="medicalRecord.IHCFeeFlag">
              <a-checkbox value="0" name="type"> 临床免疫组化收费状态 </a-checkbox>
            </a-checkbox-group>
          </a-col>
          <a-col :key="30" :span="8" class="a-col" v-if="ConditionalRenderCom('IHC项目收费数')">
            <strong> IHC项目收费</strong>
            <a-input placeholder="IHC项目收费数" v-model="medicalRecord.IHCPaySums" disabled />
          </a-col>
          <a-col :key="31" :span="12" class="a-col">
            <strong> 病史</strong>
            <a-textarea placeholder="请输入病史" allow-clear v-model="medicalRecord.BriefHistory" />
          </a-col>
          <a-col :key="32" :span="12" class="a-col">
            <strong> 临床诊断</strong>
            <a-textarea placeholder="临床诊断" allow-clear v-model="medicalRecord.ClinicalDiagnosis" />
          </a-col>
        </a-row>
        <!-- 标本表格 -->
        <a-button class="editable-add-btn" @click="handleAdd"> 添加 </a-button>
        <a-table bordered :data-source="specimendata" :columns="columns" :scroll="{ x: 1500 }">
          <template
            v-for="col in [
              'SpecimenName',
              'SpecimenType',
              'SortOrder',
              'PartId',
              'PartName',
              'LeaveTime',
              'FixedTime',
              'FixLiquid',
              'IsLiquid',
              'IsLarge',
              'FixedFlag',
              'NonStandardReason',
              'Remark',
              'OperatingRoomNo',
            ]"
            :slot="col"
            slot-scope="text, record, index"
          >
            <div :key="col" v-if="col === 'SpecimenName'">
              <a-select
                v-if="editable && text !== ''"
                show-search
                :allow-clear="true"
                :value="text"
                :show-arrow="true"
                style="width: 190px"
                mode="combobox"
                @change="(e) => handleChange(e, record, col)"
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
                @change="(e) => handleChange(e, record, col)"
                @search="specimenNameChange"
              >
                <a-select-option v-for="d in specimenNameType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
              <template v-else>
                {{ text }}
              </template>
            </div>
            <!-- <div :key="col" v-if="col === 'SpecimenType'">
              <a-input :value="text" :min="1" :max="9999" @change="(e) => handelCodeChange(e, record, col)" />
            </div> -->
            <div :key="col" v-if="col === 'SortOrder'">
              <a-input-number :value="text" :min="1" :max="9999" @change="(e) => handelCodeChange(e, record, col)" />
            </div>
            <div :key="col" v-if="col === 'PartName'">
              <a-input :value="text" @change="(e) => handleChange(e, record, col)" />
            </div>
            <div :key="col" v-if="col === 'LeaveTime'">
              <a-date-picker
                v-if="editable"
                :value="text"
                format="YYYY-MM-DD HH:mm"
                @blur="(e) => handleChange(e, record, 'LeaveTime')"
                @change="(e) => handelCodeChange(e, record, col)"
              >
              </a-date-picker>
              <template v-else>
                {{ text }}
              </template>
            </div>
            <div :key="col" v-if="col === 'FixedTime'">
              <a-date-picker
                v-if="editable"
                :value="text"
                format="YYYY-MM-DD HH:mm"
                @blur="(e) => handleChange(e, record, 'FixedTime')"
                @change="(e) => handelCodeChange(e, record, col)"
              >
              </a-date-picker>
              <template v-else>
                {{ text }}
              </template>
            </div>
            <div :key="col" v-if="col === 'FixLiquid'">
              <a-select
                v-if="editable"
                show-search
                placeholder="选择固定液"
                :value="text"
                style="width: 140px"
                @change="(e) => fixLiquidChange(e, index)"
              >
                <a-select-option v-for="d in fixLiquidType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
              <template v-else>
                {{ text }}
              </template>
            </div>
            <div :key="col" v-if="col === 'IsLiquid'">
              <a-select style="width: 80px" :value="text" @change="(e) => handleChange(e, record, col)">
                <a-select-option value="0"> 否 </a-select-option>
                <a-select-option value="1"> 是 </a-select-option>
              </a-select>
            </div>
            <div :key="col" v-if="col === 'IsLarge'" @change="(e) => handleChange(e, record, col)">
              <a-select style="width: 80px" :value="text">
                <a-select-option value="0"> 否 </a-select-option>
                <a-select-option value="1"> 是 </a-select-option>
              </a-select>
            </div>
            <div :key="col" v-if="col === 'FixedFlag'">
              <a-select style="width: 80px" :value="text" @change="(e) => handelCodeChange(e, record, col)">
                <a-select-option value="0"> 否 </a-select-option>
                <a-select-option value="1"> 是 </a-select-option>
              </a-select>
            </div>
            <div :key="col" v-if="col === 'NonStandardReason'">
              <a-input :value="text" @change="(e) => handleChange(e, record, col)" />
            </div>
            <div :key="col" v-if="col === 'Remark'">
              <a-input :value="text" @change="(e) => handleChange(e, record, col)" />
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <a-popconfirm v-if="specimendata.length" title="确定删除?" @confirm="() => onDelete(record.key)">
              <a-button type="danger" size="small"> 删除 </a-button>
            </a-popconfirm>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="2" tab="更多信息" force-render>
        <!-- new row -->
        <a-row :span="24" class="a-row">
          <a-col :key="32" :span="6" class="a-col">
            <strong> 住院流水号</strong>
            <a-input placeholder="住院流水号" v-model="medicalRecord.AdmissionSerialNo" />
          </a-col>
          <a-col :key="33" :span="6" class="a-col">
            <strong> 门诊流水号</strong>
            <a-input placeholder="门诊流水号" v-model="medicalRecord.OutpatientSerialNo" />
          </a-col>
          <a-col :key="34" :span="6" class="a-col">
            <strong> 病区</strong>
            <a-input placeholder="病区" v-model="medicalRecord.Ward" />
          </a-col>
          <a-col :key="35" :span="6" class="a-col">
            <strong> 床号</strong>
            <a-input style="width: 40%" placeholder="床号" v-model="medicalRecord.BedNo" />
          </a-col>
        </a-row>
        <!-- new row -->
        <a-row :span="24" class="a-row">
          <a-col :key="32" :span="6" class="a-col">
            <strong> 住院次</strong>
            <a-input placeholder="住院次" v-model="medicalRecord.VisitId" />
          </a-col>
          <a-col :key="33" :span="6" class="a-col">
            <strong> 月经标识</strong>
            <a-input placeholder="月经标识" v-model="medicalRecord.MenstrualFlag" />
          </a-col>
          <a-col :key="34" :span="7" class="a-col">
            <strong> 最后出经时间</strong>
            <a-date-picker format="YYYY-MM-DD HH:mm" v-model="medicalRecord.MenstrualTime" disabled :maxLength="100" />
          </a-col>
          <a-col :key="35" :span="5" class="a-col">
            <strong> 月经周期</strong>
            <a-input style="width: 40%" placeholder="月经周期" v-model="medicalRecord.MenstrualCycle" />
          </a-col>
        </a-row>
        <!-- new row -->
        <a-row :span="24" class="a-row">
          <a-col :key="1" :span="6" class="a-col">
            <strong> 加密等级</strong>
            <a-select style="width: 70%" default-value="1" v-model="medicalRecord.EncryptionLevel">
              <a-select-option value="1"> 不加密 </a-select-option>
              <a-select-option value="2"> 轻度加密 </a-select-option>
              <a-select-option value="3"> 重度加密 </a-select-option>
            </a-select>
          </a-col>
          <a-col :key="37" :span="3" class="a-col">
            <a-checkbox-group v-model="medicalRecord.IsMarriage">
              <a-checkbox value="10" name="type"> 婚否 </a-checkbox>
            </a-checkbox-group>
          </a-col>
          <a-col :key="38" :span="3" class="a-col">
            <a-checkbox-group v-model="medicalRecord.IsLeaveHospital">
              <a-checkbox value="0" name="type"> 是否出院 </a-checkbox>
            </a-checkbox-group>
          </a-col>
          <a-col :key="39" :span="3" class="a-col">
            <a-checkbox-group v-model="medicalRecord.IsLactation">
              <a-checkbox value="0" name="type"> 是否脯乳期 </a-checkbox>
            </a-checkbox-group>
          </a-col>
          <a-col :key="40" :span="3" class="a-col">
            <a-checkbox-group v-model="medicalRecord.HasRoutine">
              <a-checkbox value="10" name="type"> 是否有常规流程 </a-checkbox>
            </a-checkbox-group>
          </a-col>
        </a-row>
        <!-- new row -->
        <a-row :span="24" class="a-row">
          <a-col :key="33" :span="6" class="a-col">
            <strong> 手机号码</strong>
            <a-input placeholder="手机号码" v-model="medicalRecord.MobileNo" />
          </a-col>
          <a-col :key="42" :span="7" class="a-col">
            <strong> 电话号码</strong>
            <a-input v-model="medicalRecord.Telephone" />
          </a-col>
          <a-col :key="43" :span="5" class="a-col">
            <strong> 生日</strong>
            <a-date-picker format="YYYY-MM-DD HH:mm" v-model="medicalRecord.Birthday" />
          </a-col>
        </a-row>
        <!-- new row -->
        <a-row :span="24" class="a-row">
          <a-col :key="44" :span="6" class="a-col">
            <strong> 出院时间</strong>
            <a-date-picker format="YYYY-MM-DD HH:mm" v-model="medicalRecord.LeaveHospitalTime" />
          </a-col>
          <a-col :key="45" :span="3" class="a-col">
            <a-checkbox-group v-model="medicalRecord.Charged">
              <a-checkbox value="0" name="type"> 是否为收费 </a-checkbox>
            </a-checkbox-group>
          </a-col>
          <a-col :key="46" :span="6" class="a-col">
            <strong> 收费金额</strong>
            <a-input v-model="medicalRecord.CostAmount" disabled />
          </a-col>
          <a-col :key="47" :span="6" class="a-col">
            <strong> 收费方式</strong>
            <a-select style="width: 70%" default-value="0" v-model="medicalRecord.ChargeFlag">
              <a-select-option value="0"> 自费 </a-select-option>
              <a-select-option value="1"> 医保 </a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <!-- new row -->
        <a-row :span="24" class="a-row">
          <a-col :key="48" :span="8" class="a-col">
            <strong> 收费方式说明</strong>
            <a-input v-model="medicalRecord.ChargeFlagNote" />
          </a-col>
          <a-col :key="49" :span="8" class="a-col">
            <strong> 临床免疫组化项目</strong>
            <a-input v-model="medicalRecord.IHCFeeItem" disabled />
          </a-col>
          <a-col :key="51" :span="8" class="a-col">
            <strong> 传染性疾病检查</strong>
            <a-input v-model="medicalRecord.InfectiousExamResult" disabled />
          </a-col>
        </a-row>
        <!-- new row -->
        <a-row :span="24" class="a-row">
          <a-col :key="52" :span="12" class="a-col">
            <strong> 送检说明</strong>
            <a-textarea v-model="medicalRecord.InspectionRemark" />
          </a-col>
          <a-col :key="53" :span="12" class="a-col">
            <strong> 临床所见</strong>
            <a-textarea v-model="medicalRecord.Symptom" />
          </a-col>
        </a-row>
        <!-- new row -->
        <a-row :span="24" class="a-row">
          <a-col :key="54" :span="12" class="a-col">
            <strong> 主要检验检查</strong>
            <a-textarea v-model="medicalRecord.Examinations" />
          </a-col>
          <a-col :key="55" :span="12" class="a-col">
            <strong> 外院会诊原诊断结果 </strong>
            <a-textarea v-model="medicalRecord.DiagnosisConsultSrc" />
          </a-col>
        </a-row>
        <!-- new row -->
        <a-row :span="24" class="a-row">
          <a-col :key="56" :span="12" class="a-col">
            <strong> 备注</strong>
            <a-textarea v-model="medicalRecord.Remark" />
          </a-col>
          <a-col :key="57" :span="12" class="a-col">
            <strong> 外院会诊原诊断结果 </strong>
            <a-textarea v-model="medicalRecord.DiagnosisConsultSrc" />
          </a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
    <a-row :span="24" class="bottom-edit-row">
      <a-button type="primary" @click="savaMedicalRecord"> 保存 </a-button>
      <!-- <a-button type="primary"> 接收 </a-button>
      <a-button type="danger"> 拒收 </a-button> -->
    </a-row>
  </div>
</template>

<script>
//导入接口
import { getPathologyTypes } from '@/api/system/dictionary';
import { getDepartmentData } from '@/api/basics/department';
import { getSpecimenNames } from '@/api/submission/app';
import { saveMedicalRecord } from '@/api/examine/application';
import { getCheckPartData } from '@/api/basics/checkpart';
//导入工具类
import moment from 'moment';
import enums from '@/store/enum/enum';
import { CheckField, RandomString, PromptBox, StringToTime } from '@/utils/util';

//标本表格
const columns = [
  { title: '标本名称', dataIndex: 'SpecimenName', width: 220, scopedSlots: { customRender: 'SpecimenName' } },
  // { title: '标本类型', dataIndex: 'SpecimenType', width: 140, scopedSlots: { customRender: 'SpecimenType' } },
  { title: '排序', dataIndex: 'SortOrder', width: 140, scopedSlots: { customRender: 'SortOrder' } },
  { title: '部位', dataIndex: 'PartName', width: 140, scopedSlots: { customRender: 'PartName' } },
  { title: '离体时间', dataIndex: 'LeaveTime', width: 220, scopedSlots: { customRender: 'LeaveTime' } },
  { title: '固定时间', dataIndex: 'FixedTime', width: 220, scopedSlots: { customRender: 'FixedTime' } },
  { title: '固定液体', dataIndex: 'FixLiquid', width: 160, scopedSlots: { customRender: 'FixLiquid' } },
  { title: '是否液体', dataIndex: 'IsLiquid', width: 100, scopedSlots: { customRender: 'IsLiquid' } },
  { title: '是否大标本', dataIndex: 'IsLarge', width: 100, scopedSlots: { customRender: 'IsLarge' } },
  { title: '是否规范固定', dataIndex: 'FixedFlag', width: 100, scopedSlots: { customRender: 'FixedFlag' } },
  { title: '不规范原因', dataIndex: 'NonStandardReason', width: 200, scopedSlots: { customRender: 'NonStandardReason' } },
  { title: '备注', dataIndex: 'Remark', width: 200, scopedSlots: { customRender: 'Remark' } },
  { title: '编辑', dataIndex: 'operation', fixed: 'right', scopedSlots: { customRender: 'operation' } },
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
  components: {},
  data() {
    return {
      //病理记录
      medicalRecord: {
        Address: '', //患者地址1
        AdmissionNo: '', //住院号1
        AdmissionSerialNo: '', //住院流水号1
        Age: 0, //岁1
        AgeDays: 0, //日1
        AgeMonths: 0, //月1
        AgeYears: 0, //
        BedNo: '', //床号1
        Birthday: '', //生日1
        BriefHistory: '', //病史1
        CaseHostoryNo: null,
        ChargeFlag: '0', //收费方式 0自费，1医保
        ChargeFlagNote: '', //收费方式说明1
        Charged: [], //是否为收费1
        CheckMethod: '', //检查方法1
        ClinicalDiagnosis: '', //临床诊断1
        ClinicalDoctorAdviceWorkflowId: 0,
        ContagionFlag: [], //传染源1
        CostAmount: 0, //收费金额
        CreatedBy: 0, //--创建者
        CreatedTime: '', //--创建时间
        specimendata: null,
        DeptCode: '', //送检科室编号1
        DeptName: '', //送检科室名称1
        DiagnosisConsultSrc: '', //外院会诊原诊断结果
        DoctorAdviceItem: null,
        EncryptionLevel: '1', //加密等级
        ExamItemCode: '', //检擦项目代码1
        ExamItemName: '', //检擦项目名称1
        Examinations: '', //主要检验检查
        HasRoutine: [], //是否有常规流程1
        HealthCardNo: null,
        HisID: null,
        HisSheetId: null,
        Hospital: '', //送检医院1
        HospitalArea: '', //院区1
        IDCard: '', //身份证1
        IDType: '0', //证件类型1
        IHCFeeFlag: [], //临床免疫组化收费状态
        IHCFeeItem: '', //临床免疫组化项目1
        IHCPaySums: 0, //IHC项目收费数1
        InspectionRemark: '', //送检说明 1
        IsLactation: [], //是否脯乳期1
        IsLarge: [], ///是否大标本1
        IsLeaveHospital: [], //是否出院1
        IsMarriage: [], //婚否10未婚  20已婚  21初婚  22再婚  23复婚  30丧偶  40离婚  90未说明
        IsMergeSlide: [], //合片1
        IsUrgent: [], //紧急病例1
        LeaveHospitalTime: '', //出院时间1
        LimitTimeId: 0,
        MaterialType: '', //组织类型1
        MedicalCardNo: null,
        MedicalExamNo: null,
        MenstrualCycle: 30, //月经周期1
        MenstrualFlag: '0', //月经标识
        MenstrualTime: '', //最后出经时间1
        MobileNo: '', //手机号码
        MrCode: '', //病理号1
        OperatingFindings: null,
        OrderNo: null, //--
        OutpatientNo: '', //门诊号1
        OutpatientSerialNo: '', //门诊流水号1
        PathologyClass: '', //送检类型1
        PathologyCode: '', //送检类型编码1
        PatientID: '', //患者ID1
        PatientName: '', //患者姓名1
        PatientUniqueId: '',
        ProcessType: '0', //归档状态 0未归档，1已归档，2已借出，3已归还，4异常
        RapidParaffinFlag: [], //是否快速
        ReceiveAssistantId: 0,
        ReceiveAssistantName: null,
        //--接收人
        ReceiveId: 0,
        ReceiveName: '',
        ReceivedTime: '',
        //--
        Remark: '', //备注1
        ReqDateTime: '',
        SendDoctorCode: '', //送检医生
        SendDoctorName: '',
        SendMobile: '', //送检医生电话
        SendSpecimenAppCode: null,
        SendTime: '', //发送时间
        Sex: '', //性别1
        SourceType: '', //来源1 0门诊，1住院，2外院，3体检，4急诊，5其他
        SpellCode: '',
        SrcMrCode: '', //原病理号1
        SrcMrId: 0,
        Status: 0, //0保存，1已接收，2已撤销，3已暂停，4已拒收，5已删除，6已废弃，7已隐藏，9旧系统导入的数据
        Symptom: '', //临床所见
        Telephone: '', //手机号码
        VisitId: '', //住院次1
        Ward: '', //病区1
        Specimens: [],
      },
      //标本信息
      timer,
      columns: columns,
      specimendata: [],
      editable: true, //是否可编辑
      specimenNameType: [], //标本类型
      fixLiquidType: enums.FixLiquid, //固定液
      HospitalData: enums.HospitalData,
      departmentData: [],
      pathologyTypes: [],
      examItemList: [
        {
          ExamItemCode: '1E',
          ExamItemName: '手术标本检查与诊断（小）',
        },
        {
          ExamItemCode: '2E',
          ExamItemName: '常规项目',
        },
        {
          ExamItemCode: '3E',
          ExamItemName: '脱氧核糖核酸(DNA)测序',
        },
        {
          ExamItemCode: '4E',
          ExamItemName: 'FISH HER-2',
        },
      ], //检查项目
      checkMethodList: [
        {
          MethodCode: '1M',
          MethodName: '基因测序',
        },
        {
          MethodCode: '2E',
          MethodName: 'PCR荧光原位杂交发',
        },
        {
          MethodCode: '3E',
          MethodName: '循环肿瘤细胞',
        },
        {
          MethodCode: '4E',
          MethodName: '药物代谢基因检测',
        },
        {
          MethodCode: '5E',
          MethodName: 'PCR荧光探针法',
        },
      ], //检查方法
      partType:[],
    };
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
            // console.log(item.Name);
            // console.log(item.Content);
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
    //生成病理号
    onSearch(value) {},
    //根据送检类型条件渲染组件
    ConditionalRenderCom(comName) {
      switch (comName) {
        case '检查项目':
          return true;
        case '检查方法':
          if (this.medicalRecord.PathologyCode == 'Molecular') {
            return true;
          }
          return false;
        case '组织类型':
          if (this.medicalRecord.PathologyCode == 'Routine') {
            return true;
          }
          return false;
        case '临床免疫组化收费状态':
          if (this.medicalRecord.PathologyCode == 'Routine' || this.medicalRecord.PathologyCode == 'Frozen') {
            return true;
          }
          return false;
        case 'IHC项目收费数':
          if (this.medicalRecord.PathologyCode == 'Routine') {
            return true;
          }
          return false;
        default:
          break;
      }
      return false;
    },
    //送检科室改变
    deptNameChange(value) {
      this.departmentData.forEach((item) => {
        if (item.value == value) {
          this.medicalRecord.DeptName = item.text;
          return;
        }
      });
    },
    //检查项目改变
    examItemChange(value) {
      this.examItemList.forEach((item) => {
        if (item.ExamItemCode == value) {
          this.medicalRecord.ExamItemName = item.ExamItemName;
          return;
        }
      });
    },
    //#添加标本
    onDelete(key) {
      const specimendata = [...this.specimendata];
      this.specimendata = specimendata.filter((item) => item.key !== key);
    },
    //添加新的标本
    handleAdd() {
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
      const sortOrder = this.specimendata.length + 1;
      const newSpecimen = {
        key: key,
        CreatedBy: 0,
        FSamplingInfo: null,
        FixLiquid: '无需固定液',
        FixedFlag: '0',
        HisSheetId: '',
        HisSpecimenId: '',
        IsLiquid: '0',
        FixedTime: '',
        LeaveTime: '',
        LymphNodes: 0,
        LymphNodesMetastasis: 0,
        NonStandardReason: '',
        PartId: 0,
        PartName: '',
        Remark: '',
        SamplingInfo: '',
        SortOrder: sortOrder,
        specimenCode: specimenCode,
        SpecimenName: '',
        SpecimenType: '',
        IsLarge: '0',
      };
      this.specimendata.push(newSpecimen);
    },
    //标本表格值改变时
    handleChange(value, obj, column) {
      if (column === 'SpecimenName') {
        obj[column] = value;
        let isReapt = false;
        for (let i = 0; i < this.specimendata.length - 1; i++) {
          if (this.specimendata[i][column] == value) {
            isReapt = true;
            break;
          }
        }
        if (isReapt) {
          PromptBox('标本名字存在重复', 'warning', 'topRight', 2);
          return;
        }
      }
      if (column === 'NonStandardReason') {
        console.log(value.target.value);
        obj[column] = value.target.value;
      }
      if (column === 'Remark') {
        console.log(value.target.value);
        obj[column] = value.target.value;
      }
      if (column === 'PartName') {
        console.log(value.target.value);
        // this.partType.forEach((item) => {
        //   if (item.value === value) {
        //     exist = true;
        //     obj.PartId = value === undefined ? '' : value;
        //   }
        // });
        // if (exist === false && CheckField(value) === true) {
        //   this.partType.push({ value: value, text: value });
        //   obj.PartId = value === undefined ? '' : value;
        //   obj.PartName = value === undefined ? '' : value;
        // }
        obj[column] = value.target.value;
      }
      if (column === 'FixedTime' && this.medicalRecord.PathologyCode !== 'Frozen') {
        if (CheckField(obj.LeaveTime) && CheckField(value.target.value) && StringToTime(value.target.value) < StringToTime(obj.LeaveTime)) {
          PromptBox('固定时间不能小于离体时间', 'warning', 'topRight', 2);
          return;
        }
        CheckField(obj.Id) ? this.updateField(obj.Id, column, value.target.value) : this.updateField(obj.key, column, value.target.value);
      }
      if (column === 'LeaveTime') {
        CheckField(obj.Id) ? this.updateField(obj.Id, column, value.target.value) : this.updateField(obj.key, column, value.target.value);
      }
    },
    handelCodeChange(e, record, col) {
      record[col] = e;
    },
    //标本名字改变时
    specimenNameChange(val) {
      //获取到标本名字列表
      this.specimenNameType = [];
      getSpecimenNames(val).then((res) => {
        res.data.forEach((item) => {
          this.specimenNameType.push({ value: item.SpecimenName, text: item.SpecimenName });
        });
      });
    },
    updateField(id, fileName, fileValue) {
      this.specimendata.forEach((item) => {
        if (item.Id === id || item.key === id) {
          item[fileName] = fileValue;
        }
      });
    },
    fixLiquidChange(text, index) {
      index.FixLiquid = text;
    },
    ///####添加标本end

    //保存病理单
    savaMedicalRecord() {
      if (!this.specimendata.length || this.specimendata.length == 0) {
        PromptBox('请添加标本', 'warning', 'topRight', 2);
        return;
      }
      let isNUll = false;
      this.specimendata.forEach((item) => {
        if (item.SpecimenName == '' || !item.SpecimenName) {
          isNUll = true;
          return;
        }
      });
      if (isNUll) {
        PromptBox('请填写标本名称', 'warning', 'topRight', 2);
        return;
      }
      if (!this.medicalRecord.MrCode || this.medicalRecord.MrCode == '') {
        PromptBox('请输入正确的病理号', 'warning', 'topRight', 2);
        return;
      }
      if (!this.medicalRecord.PatientName || this.medicalRecord.PatientName == '') {
        PromptBox('请输入名字', 'warning', 'topRight', 2);
        return;
      }
      if (!this.medicalRecord.PathologyCode || this.medicalRecord.PathologyCode == '') {
        PromptBox('请选择送检类型', 'warning', 'topRight', 2);
        return;
      }
      if (!this.medicalRecord.Sex || this.medicalRecord.Sex == '') {
        PromptBox('请选择性别', 'warning', 'topRight', 2);
        return;
      }
      if (!this.medicalRecord.Age || this.medicalRecord.Age == '') {
        PromptBox('请输入年龄', 'warning', 'topRight', 2);
        return;
      }
      //格式数据转换
      this.medicalRecord.Specimens = this.specimendata;
      const medicalRecord = JSON.parse(JSON.stringify(this.medicalRecord));
      this.dataConversion(medicalRecord);
      saveMedicalRecord(medicalRecord).then((result) => {
        console.log(result);
        const { ResultType, HttpStatusCode, Message } = result;
        if (ResultType == 0) {
          PromptBox(Message, 'warning', 'topRight', 2);
        } else if (ResultType == 1) {
          PromptBox(Message, 'success', 'topRight', 2);
        } else if (ResultType == 2) {
          PromptBox(Message, 'error', 'topRight', 2);
        }
      });
    },
    dataConversion(medicalRecord) {
      medicalRecord.Specimens.forEach((item) => {
        this.moment(item.LeaveTime).format('YYYY-MM-DD HH:mm:ss');
        this.moment(item.LeaveTime).format('YYYY-MM-DD HH:mm:ss');
      });
      medicalRecord.Status = 0;
      medicalRecord.Charged = medicalRecord.Charged.length > 0 ? '1' : '0';
      medicalRecord.ContagionFlag = medicalRecord.ContagionFlag.length > 0 ? '1' : '0';
      medicalRecord.HasRoutine = medicalRecord.HasRoutine.length > 0 ? '1' : '0';
      medicalRecord.IHCFeeFlag = medicalRecord.IHCFeeFlag.length > 0 ? '1' : '0';
      medicalRecord.IsLactation = medicalRecord.IsLactation.length > 0 ? '1' : '0';
      medicalRecord.IsLarge = medicalRecord.IsLarge.length > 0 ? '1' : '0';
      medicalRecord.IsLeaveHospital = medicalRecord.IsLeaveHospital.length > 0 ? '1' : '0';
      medicalRecord.IsMergeSlide = medicalRecord.IsMergeSlide.length > 0 ? '1' : '0';
      medicalRecord.RapidParaffinFlag = medicalRecord.RapidParaffinFlag.length > 0 ? '1' : '0';
    },
  },
  created() {
    this.initialize();
  },
};
</script>

<style lang="less" scoped>
#appMR {
  width: 100%;
  .a-row {
    margin-bottom: 10px;
    .a-col {
      display: flex;
      flex-direction: row;
      overflow: hidden;
      //   border: 1px solid red;
      > :first-child {
        flex: 1;
        text-align: center;
        line-height: 30px;
        font-size: 13px;
      }
      > :last-child {
        flex: 3;
        // border: 1px solid red;
      }
    }
  }
  .bottom-edit-row {
    display: flex;
    flex-direction: row-reverse;
    .ant-btn {
      margin-right: 10px;
    }
  }
}
</style>
