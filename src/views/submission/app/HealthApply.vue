<template>
  <div>
    <k-form-build
      id="form"
      ref="kfb" 
      :value="jsonData"
      :dynamicData="dynamicData"
      @change="handleChange"
    />
  </div>
</template>
<script>
import moment from 'moment'
import storage from 'store'
import ComponentInitializer from '@/core/components/componentRegistrar'
import ExamItemTemplate from '@/views/submission/app/ExamItemTemplate.vue'
import { CheckField, CheckResponseResult, JSONStringToObject, RandomString } from '@/utils/util'
import enums from '@/store/enum/enum'
import { loadDataForAppOrderEdit, saveOrder } from '@/api/submission/app'
import { getCheckItemData } from '@/api/basics/checkitem'
import { getStrategyTemplate } from '@/api/system/strategy'

export default {
  name: 'EditNew',
  components: {
    ExamItemTemplate
  },
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      jsonData: {
        list: [
        ],
        config: {
        }
      },
      moment,
      dynamicData: {
        pathologyCodeType: [],
        doctors: [],
        nationType: [],
        departmentType: [],
        editData: this.record,
        examItemType: [],
        examItemTemplate: [],
        showExamItemTemplate: this.showExamItemTemplate
      }
    }
  },
  beforeCreate: function () {
  },
  created: function () {
    getStrategyTemplate('Health').then(res => {
      this.jsonData = JSONStringToObject(res.Content)
    })
    
    ComponentInitializer()
    this.loadConfig()
    // this.initialize()
  },
  mounted () {
  },
  methods: {
    loadConfig () {
      enums.nationType.forEach(item => {
        this.dynamicData.nationType.push({ value: item.value, label: item.text })
      })
      // 一次性把所有相关预加载数据查询并返回
      loadDataForAppOrderEdit().then(res => {
        if (CheckResponseResult(res)) {
          res.Data.ExamItems.forEach(item => {
            this.dynamicData.examItemType.push({ value: item.ItemName, text: item.ItemName, type: item.PathologyCode })
          })
          this.HisUrl = res.Data.HisUrl
          res.Data.Departments.forEach(item => {
            this.dynamicData.departmentType.push({ value: item.DeptCode, text: item.DeptName })
          })
          res.Data.Doctors.forEach(item => {
            this.dynamicData.doctors.push({ value: item.UserCode, text: item.UserName })
          })
          // this.FixLiquid = res.Data.DefaultLiquid
          // res.Data.Specimens.forEach(item => {
          //   this.specimenNameType.push({ value: item.SpecimenName, text: item.SpecimenName })
          // })
          res.Data.SubmissionTypes.forEach(element => {
            this.dynamicData.pathologyCodeType.push({
              value: element.Content,
              text: element.Name
            })
          })
          this.dynamicData.examItemTemplate.push({ text: '请选择检查项目模板', value: '0' })
          res.Data.PageTemplates.forEach(item => {
            if (item.TargetCode === 'ApplyExamItem') {
              this.dynamicData.examItemTemplate.push({ text: item.Name, value: item.Code })
            }
          })
        }
      })
    },
    initialize () {
      // #region 初始格式化字段值
      if (CheckField(this.record) && this.record.Id !== 0) {
        this.getExamItemData(this.record.PathologyCode)
        this.record.IsMenstrualTime = true
        // 对多个项目情况下进行初始化处理
        // if (CheckField(this.record.ExamItem) && this.record.ExamItem.indexOf('|') >= 0) {
        //   this.record.ExamItem = this.record.ExamItem.split('|')
        // } else {
        //   const _temp = []
        //   _temp.push(this.record.ExamItem)
        //   this.record.ExamItem = _temp
        // }
        // 对多个标本类型情况下进行初始化处理
        // if (CheckField(this.record.SpecimenType) && this.record.SpecimenType.indexOf('|') >= 0) {
        //   this.record.SpecimenType = this.record.SpecimenType.split('|')
        // } else {
        //   const _temp = []
        //   _temp.push(this.record.SpecimenType)
        //   this.record.SpecimenType = _temp
        // }
        // 对多个宫颈项目情况下进行初始化处理
        if (CheckField(this.record.SpecimenTypeItem) && this.record.SpecimenTypeItem.indexOf('|') >= 0) {
          this.record.SpecimenTypeItem = this.record.SpecimenTypeItem.split('|')
        } else if (CheckField(this.record.SpecimenTypeItem) && !Array.isArray(this.record.SpecimenTypeItem)) {
          const _temp = []
          _temp.push(this.record.SpecimenTypeItem)
          this.record.SpecimenTypeItem = _temp
        }
      } else {
        this.getExamItemData('Routine')
      }
      // #endregion
      this.jsonData = JSONStringToObject(this.record.strategys)
      if (CheckField(this.record)) {
        setTimeout(() => {
          this.$refs.kfb.setData(this.record)
        }, 500)
      }
    },
    handleChange (value, key) {
      switch (key) {
        case 'FeeIhcFlag':
          this.feeIhcChange(value, key)
          break
        case 'PathologyCode':
          this.pathologyCodeChange(value, key)
          break
        case 'ExamItem':
          this.examItemChange(value, key)
          break
        case 'ExamItemTemplateCode':
          this.examItemTemplateChange(value, key)
          break
      }
    },
    showExamItemTemplate () {
      if (CheckField(this.record.ExamItemTemplate) === false && CheckField(this.record.ExamItemTemplateCode) === false) {
        return
      }
      const $this = this
      this.$dialog(ExamItemTemplate,
      {
        record: this.record,
        parentObj: $this,
        on: {
          ok () {
          },
          cancel () {
          },
          close () {
          }
        }
      },
      // modal props
      {
        title: '检查项目明细',
        width: 1000,
        centered: true,
        maskClosable: false,
        destroyOnClose: true
      })
    },
    examItemTemplateChange (value, key) {
      if (value === '0') {
        return
      }
      this.record.ExamItemTemplateCode = value
      const $this = this
      this.$dialog(ExamItemTemplate,
        {
          record: { ExamItemTemplateCode: value},
          parentObj: $this,
          on: {
            ok () {
            },
            cancel () {
            },
            close () {
            }
          }
        },
        // modal props
        {
          title: '检查项目明细',
          width: 1000,
          centered: true,
          maskClosable: false,
          destroyOnClose: true
        })
    },
    examItemChange (value, key) {
      if (CheckField(this.dynamicData.examItemType) && this.dynamicData.examItemType.length > 0) {
        const _temp = this.dynamicData.examItemType.filter(f => f.title === value)
        this.record.CostAmount = _temp[0].costAmount
        this.$refs.kfb.setData(this.record)
      }
    },
    pathologyCodeChange (value, key) {
      if (CheckField(this.dynamicData.pathologyCodeType) && this.dynamicData.pathologyCodeType.length > 0) {
        const _temp = this.dynamicData.pathologyCodeType.filter(f => f.value === value)
        this.record.PathologyCode = _temp[0].value
        this.record.ExamItem = ''
      }
      this.getExamItemData(value)
      this.$refs.kfb.setData(this.record)
    },
    feeIhcChange (value, key) {
      const list = this.$refs.kfb.$options.propsData.value
      if (key === 'FeeIhcFlag' && value === 'Y') {
        this.getField(list, 'FeeIhcItem', true)
      } else {
        this.getField(list, 'FeeIhcItem', false)
      }
    },
    getExamItemData (val) {
      const _temp = []
      getCheckItemData().then((res) => {
        if (res.data !== null) {
          res.data.forEach(item => {
            if (item.PathologyCode === val) {
              _temp.push({ value: item.ItemName, title: item.ItemName, key: RandomString(32), target: item.PathologyCode, costAmount: item.CostAmount })
            }
          })
          this.dynamicData.examItemType = _temp
        }
      })
    },
    getField (obj, targetName, targetValue, index) {
      if (CheckField(obj.list)) {
        obj.list.forEach(item => {
          if (item.model === targetName) {
            item.rules[0].required = targetValue
            this.callBack(index)
            return
          }
          if (CheckField(item.columns)) {
            item.columns.forEach(item2 => {
              this.getField(item2, targetName, targetValue, index)
            })
          }
        })
      }
    },
    onOk (obj) {
      return new Promise(resolve => {
        this.$refs.kfb.getData().then(values => {
          // #region 提交前对提交数据做格式化
          if (CheckField(values.ExamItem) === false) {
            values.ExamItem = this.record.ExamItem
          }
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
          // if (Object.prototype.toString.call(this.record.ExamItem) === '[object Array]') {
          //   values.ExamItem = this.record.ExamItem.join('|')
          // }
          // if (CheckField(this.record.SpecimenType) && Object.prototype.toString.call(this.record.SpecimenType) === '[object Array]') {
          //   values.SpecimenType = this.record.SpecimenType.join('|')
          // }
          if (CheckField(values.SpecimenTypeItem) && Object.prototype.toString.call(values.SpecimenTypeItem) === '[object Array]') {
            values.SpecimenTypeItem = values.SpecimenTypeItem.join('|')
          } else if (CheckField(values.SpecimenTypeItem) === false) {
            values.SpecimenTypeItem = ''
          }
          values.Id = this.record.Id
          values.Status = this.record.Status
          if (CheckField(values.MenstrualTime) === false) {
            values.MenstrualTime = this.record.MenstrualTime
          }
          values.ExamItemTemplate = this.record.ExamItemTemplate
          // #endregion
          saveOrder(values).then((res) => {
            if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
              this.$message.success('操作成功！', 2)
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
        }).catch((e) => {
          const obj = this.$refs.kfb.$options.propsData.value
          const targetName = this.getCheckField(e)
          obj.list[0].columns.forEach((item, index) => {
            this.getField(item, targetName, false, index)
          })
          resolve(false)
        })
      })
    },
    getCheckField (e) {
      for (const i in e) {
        return i
      }
    },
    callBack (res) {
      console.log(res)
    },
    onCancel () {
      return new Promise(resolve => {
        resolve(true)
      })
    },
    examItemTemplateCallBack (val) {
      this.record.ExamItemTemplate = val
    }
  }
}
</script>
