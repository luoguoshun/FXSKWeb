<template>
  <div>
    <a-card :bordered="false">
      <a-tabs default-active-key="2">
        <a-tab-pane key="1">
          <span slot="tab">
            基本信息
          </span>
          <a-form :form="form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
            <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
            <a-form-item v-show="false" label="主键ID">
              <a-input v-decorator="['Id']" disabled />
            </a-form-item>
            <a-row>
              <a-col :span="7">
                <a-form-item label="患者姓名">
                  <a-input v-decorator="['PatientName', { initialValue: formData.PatientName }]" />
                </a-form-item>
              </a-col>
              <a-col :span="1"></a-col>
              <a-col :span="5">
                <a-input-group compact>
                  <a-form-item label="年龄">
                    <a-input
                      v-decorator="['Age', { initialValue: formData.Age }]"
                    />
                  </a-form-item>
                </a-input-group>
              </a-col>
              <a-col :span="2">
                <a-form-item label="">
                  <a-select style="bottom: 1px;" v-decorator="['AgeType', {initialValue: (Number(formData.AgeType) >= 0 ? Number(formData.AgeType) : '0')}]">
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
              </a-col>
              <a-col :span="1"></a-col>
              <a-col :span="7">
                <a-form-item label="性别">
                  <a-radio-group name="Sex" v-decorator="['Sex', {initialValue: (Number(formData.Sex) >= 0 ? Number(formData.Sex):0)}]">
                    <a-radio :value="0">
                      男
                    </a-radio>
                    <a-radio :value="1">
                      女
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="7">
                <a-form-item label="民族">
                  <a-select v-decorator="['Nation', {initialValue: formData.Nation}]" >
                    <a-select-option v-for="d in nationType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="1"></a-col>
              <a-col :span="7">
                <a-form-item label="手机号">
                  <a-input v-decorator="['MobileNo', {initialValue: formData.MobileNo}]" />
                </a-form-item>
              </a-col>
              <a-col :span="1"></a-col>
              <a-col :span="7">
                <a-form-item label="身份证">
                  <a-input v-decorator="['IDCard', {initialValue: formData.IDCard}]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="7">
                <a-form-item label="病人ID">
                  <a-input v-decorator="['HisNo', {initialValue: formData.HisNo}]" />
                </a-form-item>
              </a-col>
              <a-col :span="1"></a-col>
              <a-col :span="7">
                <a-form-item label="家属姓名">
                  <a-input v-decorator="['KinName', {initialValue: formData.KinName}]" />
                </a-form-item>
              </a-col>
              <a-col :span="1"></a-col>
              <a-col :span="7">
                <a-form-item label="家属手机号">
                  <a-input v-decorator="['KinMobile', {initialValue: formData.KinMobile}]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="7">
                <a-form-item label="门诊号">
                  <a-input v-decorator="['OutpatientNum', {initialValue: formData.OutpatientNum}]" />
                </a-form-item>
              </a-col>
              <a-col :span="1"></a-col>
              <a-col :span="7">
                <a-form-item label="住院号">
                  <a-input v-decorator="['AdmissionNum', {initialValue: formData.AdmissionNum}]" />
                </a-form-item>
              </a-col>
              <a-col :span="1"></a-col>
              <a-col :span="7">
                <a-form-item label="床号">
                  <a-input v-decorator="['BedNo', {initialValue: formData.BedNo}]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="7">
                <a-form-item label="送检类型">
                  <a-select v-decorator="['PathologyCode', {initialValue: formData.PathologyCode}]" >
                    <a-select-option v-for="d in pathologyCodeType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="1"></a-col>
              <a-col :span="7">
                <a-form-item label="检查项目">
                  <a-input v-decorator="['ExamItem', {initialValue: formData.ExamItem}]" />
                  <!-- <a-select v-decorator="['ExamItem', {rules: [{required: true, message: '请选择送检项目'}]}, {initialValue: formData.ExamItem}]" >
                    <a-select-option v-for="d in examItemType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
                  </a-select> -->
                </a-form-item>
              </a-col>
              <a-col :span="1"></a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="临床诊断" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
                  <a-textarea v-decorator="['ClinicalDiagnosis', {initialValue: formData.ClinicalDiagnosis}]"></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="病史" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
                  <a-textarea v-decorator="['BriefHistory', {initialValue: formData.BriefHistory}]"></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
            <a-divider />
            <a-row>
              <a-col :span="7">
                <a-form-item label="手术室">
                  <a-input v-decorator="['OperatingRoom', {initialValue: formData.OperatingRoom}]" />
                </a-form-item>
              </a-col>
              <a-col :span="1"></a-col>
              <a-col :span="7">
                <a-form-item label="手术间">
                  <a-input v-decorator="['OperatingRoomNo', {initialValue: formData.OperatingRoomNo}]" />
                </a-form-item>
              </a-col>
              <a-col :span="1"></a-col>
              <a-col :span="7">
                <a-form-item label="台号">
                  <a-input v-decorator="['OperatingNo', {initialValue: formData.OperatingNo}]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="7">
                <a-form-item label="手术类型">
                  <a-input v-decorator="['SurgeryType', {initialValue: formData.SurgeryType}]" />
                </a-form-item>
              </a-col>
              <a-col :span="1"></a-col>
              <a-col :span="7">
                <a-form-item label="开始时间">
                  <a-date-picker v-decorator="['OperatingStartTime', {initialValue: formData.OperatingStartTime}]" show-time placeholder="开始时间" />
                </a-form-item>
              </a-col>
              <a-col :span="1"></a-col>
              <a-col :span="7">
                <a-form-item label="结束时间">
                  <a-date-picker v-decorator="['OperatingEndTime', {initialValue: formData.OperatingEndTime}]" show-time placeholder="结束时间" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="术中所见" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
                  <a-textarea v-decorator="['SurgicalDesc', {initialValue: formData.SurgicalDesc}]"></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" force-render>
          <span slot="tab">
            标本列表
            (<span style="color:red;font-weight: bold;font-size:15px;">{{ specimentCount }}</span>)
          </span>
          <a-table
            :columns="columns"
            rowKey="Id"
            :data-source="data"
            :pagination="pagination"
            @change="handleTableChange"
            class="components-table-demo-nested">
          </a-table>
        </a-tab-pane>
        <a-input v-model="doctorCode" slot="tabBarExtraContent" style="width:200px;" placeholder="请输入医生工号" />
      </a-tabs>
    </a-card>
  </div>
</template>
<script>
import pick from 'lodash.pick'
import moment from 'moment'
import { getAppOrderItem } from '@/api/submission/app'
import { getUserByCode } from '@/api/other/other'
import { submitApp } from '@/api/submission/submit'
import enums from '@/store/enum/enum'
import { getSubmissionTypes } from '@/api/system/workflow'
const data = []// 一级列表数据
const columns = [
  { title: '标本名称', dataIndex: 'SpecimenName' },
  { title: '离体时间', dataIndex: 'LeaveTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '固定时间', dataIndex: 'FixedTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '固定液', dataIndex: 'FixLiquid' },
  { title: '所属部位', dataIndex: 'PartName' }
]
export default {
  name: 'Edit',
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      layout: 'horizontal',
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 17
      },
      doctorCode: '',
      form: this.$form.createForm(this),
      nationType: enums.nationType,
      pathologyCodeType: [],
      examItemType: [],
      formData: {},
      specimentCount: 0,
      data,
      columns,
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      }
    }
  },
  created () {
    getSubmissionTypes().then(res => {
      res.forEach(element => {
        this.pathologyCodeType.push({
          value: element.Content,
          text: element.Name
        })
      })
    })
  },
  mounted () {
    const $this = this
    this.$nextTick(() => {
      getAppOrderItem(this.record.AppId).then(res => {
        if (res.data.OperatingStartTime) {
          res.data.OperatingStartTime = moment(res.data.OperatingStartTime)
        }
        if (res.data.OperatingEndTime) {
          res.data.OperatingEndTime = moment(res.data.OperatingEndTime)
        }
        this.formData = res.data
        this.data = res.data.Specimens
        this.specimentCount = res.data.Specimens.length
        $this.form.setFieldsValue(pick(res.data))
      })
    })
  },
  computed: {
  },
  methods: {
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.load(pager.current, pager.pageSize, this.Status)
    },
    onOk () {
      const $this = this
      return new Promise(resolve => {
        const $resolve = resolve
        if ($this.doctorCode === '') {
          $this.$message.warning('医生工号不能为空', 2)
          $resolve(false)
          return
        }
        this.$confirm({
          title: '提交申请',
          content: '确定提交申请单标本',
          centered: true,
          onOk () {
            var list = $this.formData.Specimens
            if (list && list.length > 0) {
              getUserByCode($this.doctorCode, '医生').then(res => {
                if (res.HttpStatusCode === 200 && res.ResultType === 1) {
                  var user = res.Data
                  var dto = { 'Id': $this.formData.Id, 'OperatorId': user.Id, 'Operator': user.UserName, 'Order': $this.formData, 'Specimens': list }
                  dto.Order.AppDoctor = user.UserCode
                  submitApp(dto).then(res => {
                    if (res.HttpStatusCode === 200 && res.ResultType === 1) {
                      $this.$message.success(res.Message, 2)
                      return new Promise(resolve => {
                        setTimeout(() => {
                          resolve(true)
                          $resolve(true)
                        }, 1000)
                      })
                    } else {
                      $this.$message.warning(res.Message, 2)
                      $resolve(false)
                    }
                  })
                } else {
                  $this.$message.warning(res.Message, 2)
                  $resolve(false)
                }
              })
            } else {
              $this.$message.warning('不存在需要提交的标本', 2)
              $resolve(false)
            }
          },
          onCancel () {}
        })
      })
    }
  }
}
</script>
