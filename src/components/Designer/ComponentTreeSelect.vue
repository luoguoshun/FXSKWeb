<template>
  <a-tree-select
    show-search
    style="width: 100%"
    :tree-data="sourceData"
    tree-checkable
    search-placeholder="Please select"
    :value="valueData"
    @change="change"
    @focus="focus"
  />
</template>
<script>

import { CheckField, JSONStringToObject, ObjectToJSONString } from '@/utils/util'

const specimenTypes = [
  { 'title': '痰', 'value': '痰', key: 1 },
  { 'title': '支气管刷检/灌洗液', 'value': '支气管刷检/灌洗液', key: 2 },
  { 'title': '胃冲洗液', 'value': '胃冲洗液', key: 3 },
  { 'title': '胸腔积液', 'value': '胸腔积液', key: 4 },
  { 'title': '腹腔积液/腹腔冲洗液', 'value': '腹腔积液/腹腔冲洗液', key: 5 },
  { 'title': '脑脊液', 'value': '脑脊液', key: 6 },
  { 'title': '尿/膀胱冲洗液', 'value': '尿/膀胱冲洗液', key: 7 },
  { 'title': '针吸细胞学涂片', 'value': '针吸细胞学涂片', key: 8 },
  { 'title': '宫颈涂片/阴道残端', 'value': '宫颈涂片/阴道残端', key: 9 }
]
const gjtp = [
  { 'title': '注射/口服避孕药', 'value': '注射/口服避孕药', key: 1 },
  { 'title': '宫内节育器', 'value': '宫内节育器', key: 2 },
  { 'title': '怀孕', 'value': '怀孕', key: 3 },
  { 'title': '产后四个月', 'value': '产后四个月', key: 4 },
  { 'title': '哺乳期', 'value': '哺乳期', key: 5 },
  { 'title': '手术后', 'value': '手术后', key: 6, children: [ { 'title': '子宫切除术', 'value': '子宫切除术', key: 61 }, { 'title': '宫颈切除/Leep术', 'value': '宫颈切除/Leep术', key: 62 }, { 'title': '卵巢切除', 'value': '卵巢切除', key: 63 } ] },
  { 'title': '不正常流血', 'value': '不正常流血', key: 7 },
  { 'title': 'HPV感染', 'value': 'HPV感染', key: 8 }
]
export default {
  name: 'TreeSelect',
  props: {
    record: {
      type: Object,
      require: true,
      default: () => {}
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      specimenTypes,
      gjtp,
      sourceData: [],
      valueData: [],
      targetName: ''
    }
  },
  created: function () {
    this.targetName = this.record.model
    switch (this.record.model) {
      // case 'ExamItem':
      //   this.sourceData = this.$attrs.dynamicData.examItemType
      //   break
      // case 'SpecimenType':
      //   this.sourceData = specimenTypes
      //   break
      case 'SpecimenTypeItem':
        this.sourceData = gjtp
        break
    }
    if (CheckField(this.$attrs.dynamicData.editData['SpecimenTypeItem'])) {
      const _temp = ObjectToJSONString(this.$attrs.dynamicData.editData['SpecimenTypeItem'])
      this.valueData = JSONStringToObject(_temp)
    }
  },
  methods: {
    focus (val) {
      // if (this.targetName === 'ExamItem') {
      //   this.sourceData = this.$attrs.dynamicData.examItemType
      // }
    },
    change (obj) {
      this.valueData = obj
      this.$attrs.dynamicData.editData['SpecimenTypeItem'] = obj
    }
  }
}
</script>
