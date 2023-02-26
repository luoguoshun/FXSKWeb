<template>
  <div>
    <a-card :bordered="false">
      <a-table
        :columns="columns"
        rowKey="Id"
        :pagination="false"
        :data-source="data"
        class="components-table-demo-nested">
        <template slot="NodeType" slot-scope="text">
          <span v-if="text==d.value" v-for="d in nodeTypeDatas":key="d.value" :value="d.value">{{ d.text }}</span>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { getOrderTrackingNodes } from '@/api/submission/app'
import enums from '@/store/enum/enum'
import moment from 'moment'
const data = []// 一级列表数据
const columns = [
  { title: '节点类型', dataIndex: 'NodeType', scopedSlots: { customRender: 'NodeType' } },
  { title: '操作人', dataIndex: 'Operator' },
  { title: '记录时间', dataIndex: 'CreatedTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '备注', dataIndex: 'Remark' }
]
export default {
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  components: {
  },
  data () {
    return {
      data,
      columns,
      nodeTypeDatas: enums.NodeTypeDatas
    }
  },
  created: function () {
    this.load()
  },
  computed: {
  },
  methods: {
    load () {
      getOrderTrackingNodes(this.record.Id)
      .then((res) => {
        const _mainData = []
        res.data.forEach((item, index) => {
          item.key = index + 1
          _mainData.push(item)
        })
        this.data = _mainData
      })
    }
  }
}
</script>
