import { CheckField, JSONStringToObject } from '@/utils/util'
import { pick } from 'lodash'
let $this
function initializeForm (e) {
  $this = e
  return e.$form.createForm(e, {
    onFieldsChange: (_, changedFields) => {
      e.$emit('change', changedFields)
    },
    mapPropsToFields: () => {
      return {
        username: e.$form.createFormField({
          value: e.username
        })
      }
    },
    onValuesChange: (_, values) => {
      if (CheckField(values.Id) === false && Object.keys(values).length > 0) {
        const b = values[Object.keys(values)[0]]
        const a = Object.keys(values)[0] + 'Event("' + b + '")'
        try {
          if (typeof(eval(a)) === 'function') {
            eval(a)
          }
        } catch (e) {

        }
      }
    }
  })
}
// 重新加载
function ReLoadForm () {
  $this.form.setFieldsValue(pick($this.record, $this.fields))
}
// 送检类型值改变事件
function PathologyCodeEvent (e) {
  const examItem = $this.examItemType.filter(f => f.type === e)
  if (e === 'Frozen') {
    $this.record.ExamItem = examItem[0].value
  } else {
    $this.record.ExamItem = ''
  }
  ReLoadForm()
}
// #region 字段属性值变化触发事件
function FieldChange (e, field, param) {
  $this = e
  this[field + 'Change'](param['DeptCode'])
}
// 送检科室属性值触发事件
function SendDepartmentChange (DeptCode) {
  let _sendDeptStrategy = $this.sendDeptStrategys.filter(f => f.DeptCode === DeptCode || f.DeptName === DeptCode)
  // 如果没有存在特殊配置，则恢复默认策略
  if (_sendDeptStrategy.length <= 0) {
    $this.strategys = JSON.parse(JSON.stringify($this.strategysCopy))
    return
  }
  _sendDeptStrategy = JSONStringToObject(_sendDeptStrategy[0].Content)
  const a = JSONStringToObject(_sendDeptStrategy.property.SendDepartment.adaptive)
  for (var e in a['change']) {
    $this.strategys.property[e].required = a['change'][e].required
  }
}
// #endregion
export default {
  FieldChange, SendDepartmentChange
}