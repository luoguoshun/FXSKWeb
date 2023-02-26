
import KFormDesign from 'k-form-design'
import Title from '@/components/Designer/ComponentDemo'
import Lable from '@/components/Designer/ComponentLable'
import TreeSelect from '@/components/Designer/ComponentTreeSelect'
import Menstrual from '@/components/Designer/ComponentMenstrual'
import TextArea from '@/components/Designer/ComponentTextArea'
import Img from '@/components/Designer/ComponentImg'
import Table from '@/components/Designer/ComponentTable'

let list = []
function Registrar (type, label, component, DataType) {
  let DataTypes
  switch (DataType) {
    case 'Array':
      DataTypes = []
      break
    default:
      DataTypes = ''
      break
  }
  const _component = {
    type: type, // 组件类型
    label: label, // 组件名称
    component: component, // 组件
    options: {
      defaultValue: DataTypes, // 可选值
      multiple: false, // 可选值
      disabled: false, // 可选值
      width: '100%',
      clearable: true, // 可选值
      placeholder: '请选择', // 可选值
      showSearch: false // 可选值
    },
    model: '', // 可选值
    key: '',
    rules: [ // 可选值
      {
        required: false,
        message: '必填项'
      }
    ]
  }
  list.push(_component)
}
export default function ComponentInitializer () {
  list = []
  Registrar('ReportTitle', '报告单头部', Title)
  Registrar('TextLable', '文本标签', Lable)
  Registrar('TreeSelect', '树形下拉框', TreeSelect, 'Array')
  Registrar('Menstrual', '末次月经组件', Menstrual)
  Registrar('TextArea', '文本框', TextArea)
  Registrar('Img', '图片', Img)
  Registrar('Table', '标本表格', Table)
  // KFormDesign.setConfig({
  //   title: '自定义字段',
  //   list: list
  // })
}
