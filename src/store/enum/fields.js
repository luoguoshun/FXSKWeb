const ApplyFields = [
  { value: 'AppNo', text: '申请单代码' },
  { value: 'Id', text: '申请单编号Id' },
  { value: 'PatientName', text: '患者姓名' },
  { value: 'Age', text: '患者年龄' },
  { value: 'AgeType', text: '患者年龄类型' },
  { value: 'Sex', text: '患者性别' },
  { value: 'SendDepartment', text: '送检科室' },
  { value: 'OutpatientNum', text: '门诊号' },
  { value: 'AdmissionNum', text: '住院号' },
  { value: 'HisNo', text: '病人Id' },
  { value: 'ExamItem', text: '检查项目' },
  { value: 'PathologyCode', text: '送检类型' },
  { value: 'AppDoctor', text: '送检医生' }
]
const SpecimenFields = [
  { value: 'SpecimenName', text: '标本名称' },
  { value: 'Id', text: '标本编号Id' },
  { value: 'SpecimenCode', text: '标本序号' },
  { value: 'SpecimenType', text: '标本类型' },
  { value: 'LeaveTime', text: '离体时间' },
  { value: 'FixedTime', text: '固定时间' },
  { value: 'FixLiquid', text: '固定液' },
  { value: 'PartName', text: '部位名称' }
]
const PackagingFields = [
  { value: 'SendNo', text: '打包号' },
  { value: 'Id', text: '打包Id' },
  { value: 'DeptName', text: '送检科室' },
  { value: 'SpecimenCount', text: '标本总数量' },
  { value: 'OperatingRoomNo', text: '手术间' },
  { value: 'Total', text: '申请单总数' }
]
export default {
  SpecimenFields,
  ApplyFields,
  PackagingFields
}
