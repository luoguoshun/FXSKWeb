<template>
  <a-table
    :columns="columns"
    rowKey="Id"
    :data-source="data"
    :pagination="false"
    class="components-table-demo-nested">
    <span slot="operation" slot-scope="text, sdata">
      <template>
        <!-- <a @click="print()">恢复</a>
        <a-divider type="vertical" /> -->
        <a @click="print(sdata)">打印</a>
      </template>
    </span>
  </a-table>
</template>

<script>
import { printLabel } from './print'
import { BrowserPrintInit } from '@/utils/BrowserPrint.js'
import { getPrintLabelTemplate } from '@/api/submission/precheck'
const columns = [
  { title: '标本名称', dataIndex: 'SpecimenName' },
  { title: '离体时间', dataIndex: 'LeaveTime' },
  { title: '固定时间', dataIndex: 'FixedTime' },
  { title: '固定液', dataIndex: 'FixLiquid' },
  { title: '所属部位', dataIndex: 'PartName' },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
]
export default {
  components: {
  },
  props: {
    data: {
      type: Array,
      default: null
    },
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      columns,
      printLableTemplateContent: ''
    }
  },
  created: function () {
    // 加载标本标签打印模板
    getPrintLabelTemplate(this.record.PathologyCode).then(res => {
      this.printLableTemplateContent = res.Data.Templet 
    })
  },
  computed: {
  },
  mounted () {
    // 初始化浏览器打印事件
    BrowserPrintInit(this)
  },
  methods: {
    print (data) {
      printLabel(this, [data], this.printLableTemplateContent)
    }
  }
}
</script>
<style>
.ant-popover-message > .anticon{
  display: none;
}
.ant-popover-message-title {
  padding: 0;
}
</style>