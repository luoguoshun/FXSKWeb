/**
 * 该文档只能存放固定不变或者只有开发人员添加的字典数据
 */
const nationType = [
  { value: '0', text: '汉族' },
  { value: '1', text: '壮族' },
  { value: '2', text: '满族' },
  { value: '3', text: '回族' },
  { value: '4', text: '苗族' },
  { value: '5', text: '维吾尔族' },
  { value: '6', text: '土家族' },
  { value: '7', text: '彝族' },
  { value: '8', text: '蒙古族' },
  { value: '9', text: '藏族' },
  { value: '10', text: '布依族' },
  { value: '11', text: '侗族' },
  { value: '12', text: '瑶族' },
  { value: '13', text: '朝鲜族' },
  { value: '14', text: '白族' },
  { value: '15', text: '哈尼族' },
  { value: '16', text: '哈萨克族' },
  { value: '17', text: '黎族' },
  { value: '18', text: '傣族' },
  { value: '19', text: '畲族' },
  { value: '20', text: '僳僳族' },
  { value: '21', text: '仡佬族' },
  { value: '22', text: '东乡族' },
  { value: '23', text: '拉祜族' },
  { value: '24', text: '水族' },
  { value: '25', text: '佤族' },
  { value: '26', text: '纳西族' },
  { value: '27', text: '羌族' },
  { value: '28', text: '土族' },
  { value: '29', text: '仫佬族' },
  { value: '30', text: '锡伯族' },
  { value: '31', text: '柯尔克孜族' },
  { value: '32', text: '达翰尔族' },
  { value: '33', text: '景颇族' },
  { value: '34', text: '毛南族' },
  { value: '35', text: '撒拉族' },
  { value: '36', text: '布朗族' },
  { value: '37', text: '塔吉克族' },
  { value: '38', text: '阿昌族' },
  { value: '39', text: '普米族' },
  { value: '40', text: '鄂温克族' },
  { value: '41', text: '怒族' },
  { value: '42', text: '京族' },
  { value: '43', text: '基诺族' },
  { value: '44', text: '德昂族' },
  { value: '45', text: '保安族' },
  { value: '46', text: '俄罗斯族' },
  { value: '47', text: '裕固族' },
  { value: '48', text: '乌孜别克族' },
  { value: '49', text: '门巴族' },
  { value: '50', text: '鄂伦春族' },
  { value: '51', text: '独龙族' },
  { value: '52', text: '塔塔尔族' },
  { value: '53', text: '赫哲族' },
  { value: '54', text: '高山族' },
  { value: '55', text: '珞巴族' }
]
const NodeTypeDatas = [
  { value: '0', text: '申请录入' },
  { value: '1', text: '标本采集' },
  { value: '2', text: '确认申请' },
  { value: '3', text: '运送中' },
  { value: '4', text: '完成' },
  { value: '5', text: '退回' },
  { value: '6', text: '标本打包' }
]
const FixLiquid = [
  { value: '无需固定液', text: '无需固定液' },
  { value: '10%福尔马林溶液', text: '10%福尔马林溶液' },
  { value: '95%的乙醇', text: '95%的乙醇' },
  { value: 'AAF', text: 'AAF' },
  { value: 'Helly', text: 'Helly' },
  { value: 'Bouin', text: 'Bouin' },
  { value: 'Susa', text: 'Susa' },
  { value: 'Zamboni', text: 'Zamboni' },
  { value: 'Zenker', text: 'Zenker' }
]
const PrintTarget = [
  { value: 'Apply', text: '申请单标签' },
  { value: 'Specimen', text: '标本标签' },
  { value: 'Packaging', text: '打包标签' }
]
const PrintTemplateTarget = [
  { value: 'Apply', text: '申请单' },
  { value: 'Specimen', text: '标本' },
  { value: 'Packaging', text: '打包' }
]
const ObjectType = [
  { value: 'bool', text: '布尔' },
  { value: 'string', text: '字符串' },
  { value: 'number', text: '数字' }
]
const MapType = [
  { value: 'Dept', text: '科室' }
]
const MapValueType = [
  { value: 'string', text: '字符串' },
  { value: 'json', text: 'Json' },
  { value: 'xml', text: 'XML' }
]
export default {
  nationType,
  NodeTypeDatas,
  FixLiquid,
  PrintTarget,
  PrintTemplateTarget,
  ObjectType,
  MapType,
  MapValueType
}
