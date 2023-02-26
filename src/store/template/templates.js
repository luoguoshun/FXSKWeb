const Apptemplate = {
  Name: '',
  Code: 'AppEdit',
  Remark: '',
  Status: 1,
  IsDefault: 1,
  property: {
    'PatientName': {
      ZNName: '患者姓名',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'Age': {
      ZNName: '年龄',
      required: false,
      visible: true,
      type: 'number',
      default: '',
      adaptive: ''
    },
    'Sex': {
      ZNName: '性别',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'Nation': {
      ZNName: '民族',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'Address': {
      ZNName: '地址',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'MobileNo': {
      ZNName: '手机号码',
      required: false,
      visible: true,
      type: 'number',
      default: '',
      adaptive: ''
    },
    'IDCard': {
      ZNName: '身份证',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'OutpatientNum': {
      ZNName: '门诊号',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'AdmissionNum': {
      ZNName: '住院号',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'BedNo': {
      ZNName: '床号',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'PathologyCode': {
      ZNName: '送检类型',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'ExamItem': {
      ZNName: '检查项目',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'SendDepartment': {
      ZNName: '送检科室',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'AppDoctor': {
      ZNName: '送检医生',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'ContagionFlag': {
      ZNName: '是否传染源',
      required: false,
      visible: true,
      type: 'bool',
      default: '',
      adaptive: ''
    },
    'SendTarget': {
      ZNName: '送检目标',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'ContagionItem': {
      ZNName: '传染源',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'ContagionOther': {
      ZNName: '传染源其它',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'FeeIhcFlag': {
      ZNName: '是否免疫组化',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'CostAmount': {
      ZNName: '项目费用',
      required: false,
      visible: true,
      type: 'number',
      default: '',
      adaptive: ''
    },
    'IsPay': {
      ZNName: '未缴费',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'FeeIhcItem': {
      ZNName: '免疫组化',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'ClinicalDiagnosis': {
      ZNName: '临床诊断',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'BriefHistory': {
      ZNName: '病史',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'OperatingRoom': {
      ZNName: '手术室',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'OperatingRoomNo': {
      ZNName: '手术间',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'OperatingNo': {
      ZNName: '台号',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'SurgeryType': {
      ZNName: '手术类型',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'OperatingStartTime': {
      ZNName: '开始时间',
      required: false,
      visible: true,
      type: 'datetime',
      default: '',
      adaptive: ''
    },
    'OperatingEndTime': {
      ZNName: '结束时间',
      required: false,
      visible: true,
      type: 'datetime',
      default: '',
      adaptive: ''
    },
    'SurgicalDesc': {
      ZNName: '术中所见',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'MenstrualTime': {
      ZNName: '末次月经',
      required: false,
      visible: true,
      type: 'datetime',
      default: '',
      adaptive: ''
    },
    'Specimens': {
      ZNName: '标本列表',
      required: false,
      visible: true,
      type: 'list',
      default: '',
      adaptive: ''
    },
    'SpecimenType': {
      ZNName: '标本类型',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'SpecimenTypeItem': {
      ZNName: '宫颈涂片项',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'InpatientWristCode': {
      ZNName: '手腕码',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'InpatientWristCode2': {
      ZNName: '手腕码2',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'ExamItemTemplateCode': {
      ZNName: '送检项目明细',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'AgeYear': {
      ZNName: '岁',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'AgeMonth': {
      ZNName: '月',
      required: false,
      visible: true,
      type: 'string',
      default: '0',
      adaptive: ''
    },
    'AgeDay': {
      ZNName: '日',
      required: false,
      visible: true,
      type: 'string',
      default: '0',
      adaptive: ''
    },
    'HisNo': {
      ZNName: '病人ID',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'KinName': {
      ZNName: '家属姓名',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'KinMobile': {
      ZNName: '家属手机号',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'Symptom': {
      ZNName: '症状体征',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'Examinations': {
      ZNName: '主要化验',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'Appointment': {
      ZNName: '送检预约',
      required: false,
      visible: true,
      type: 'bool',
      default: false,
      adaptive: ''
    },
    'RapidParaffinFlag': {
      ZNName: '快速石蜡',
      required: false,
      visible: true,
      type: 'bool',
      default: false,
      adaptive: ''
    },
    'TackAway': {
      ZNName: '外带申请单',
      required: false,
      visible: true,
      type: 'bool',
      default: false,
      adaptive: ''
    }
  },
  behaviorProperty: {
    'FillLeaveTime': {
      ZNName: '填充离体时间',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'FillFixedTime': {
      ZNName: '填充固定时间',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'AppointmentDate': {
      ZNName: '预约日期',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'AppointmentTime': {
      ZNName: '预约时间',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'SurgicalDescRemind': {
      ZNName: '术中所见提醒',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    }
  }
}
const PrintTemplate = {
  Name: '',
  Code: 'Print',
  Remark: '',
  Status: 1,
  IsDefault: 1,
  property: {
    'FixedTime': {
      ZNName: '固定时间',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    }
  },
  behaviorProperty: {
    'FillLeaveTime': {
      ZNName: '填充离体时间',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'FillFixedTime': {
      ZNName: '填充固定时间',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'IsAutoIncrement': {
      ZNName: '是否自动增加时间',
      required: true,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'AutoIncrementValue': {
      ZNName: '自动增加时间量',
      required: true,
      visible: true,
      type: 'string',
      default: '1',
      adaptive: ''
    },
    'DoctorTackAway': {
      ZNName: '医生带走标本',
      required: false,
      visible: false,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'DoctorTackAwayUseCA': {
      ZNName: '医生带走标本启用CA',
      required: false,
      visible: false,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'PrinterType': {
      ZNName: '打印机品牌',
      required: true,
      visible: true,
      type: 'string',
      default: 'zebra',
      adaptive: ''
    }
  }
}
const PackagingTemplate = {
  Name: '',
  Code: 'Packaging',
  Remark: '',
  Status: 1,
  IsDefault: 1,
  property: {
    'UnitedSubmitter': {
      ZNName: '联合打包',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'Submitter': {
      ZNName: '打包人员',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    }
  },
  behaviorProperty: {
  }
}
const RegisterTemplate = {
  Name: '',
  Code: 'Register',
  Remark: '',
  Status: 1,
  IsDefault: 1,
  property: {
    'RegisterCode': {
      ZNName: '标本确认',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    }
  },
  behaviorProperty: {
  }
}
const SendTemplate = {
  Name: '',
  Code: 'Send',
  Remark: '',
  Status: 1,
  IsDefault: 1,
  property: {
    'ScanSend': {
      ZNName: '扫码运行',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    }
  },
  behaviorProperty: {
  }
}
const AppListTemplate = {
  Name: '',
  Code: 'AppList',
  Remark: '',
  Status: 1,
  IsDefault: 1,
  property: {
    'IsFeeIhcFlag': {
      ZNName: '免疫组化',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'Department': {
      ZNName: '部门',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    }
  },
  behaviorProperty: {
  }
}
const ReceiveTemplate = {
  Name: '',
  Code: 'Receive',
  Remark: '',
  Status: 1,
  IsDefault: 1,
  property: {
    'VerifySender': {
      ZNName: '验证运送人',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    },
    'ForbidModifyApply': {
      ZNName: '接收禁止修改申请单',
      required: false,
      visible: true,
      type: 'string',
      default: '',
      adaptive: ''
    }
  },
  behaviorProperty: {
  }
}
const templateLocal = [
  { 'text': 'AppEdit', value: Apptemplate },
  { 'text': 'Packaging', value: PackagingTemplate },
  { 'text': 'Receive', value: ReceiveTemplate },
  { 'text': 'Print', value: PrintTemplate },
  { 'text': 'AppList', value: AppListTemplate },
  { 'text': 'Register', value: RegisterTemplate },
  { 'text': 'Send', value: SendTemplate }
]
export {
  templateLocal
}
