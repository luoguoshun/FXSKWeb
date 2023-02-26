<template>
  <div>
    <div style="margin-bottom: 16px">
      <a-space>
        <a-button type="primary" icon="plus" @click="nodeAdd()">新建</a-button>
        <a-button type="default" icon="reload" @click="nodeLoad()">刷新</a-button>
      </a-space>
    </div>
    <a-table
      :pagination="false"
      :columns="nodeColumns"
      :data-source="nodeData"
      class="components-table-demo-nested">
      <template slot="Status" slot-scope="text">
        <span v-if="text==0"><span class="ant-badge-status-dot ant-badge-status-default"></span><span class="ant-badge-status-text">禁用</span></span>
        <span v-if="text==1"><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">启用</span></span>
      </template>
      <span slot="operation" slot-scope="text, record">
        <template>
          <a @click="nodeEdit(record)">修改</a>
          <!-- <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除数据?"
            ok-text="是"
            cancel-text="否"
            @confirm="del(record)"
            style="color:#f50"
          >
            <a href="#">删除</a>
          </a-popconfirm> -->
        </template>
      </span>
    </a-table>
  </div>
</template>

<script>
import { getFlowNode } from '@/api/system/workflow'
import NodeEdit from '@/views/system/workflow/NodeEdit'

const nodeData = []// 一级列表数据

const nodeColumns = [
  { title: '流程名称', dataIndex: 'WorkflowName' },
  { title: '代码', dataIndex: 'WorkflowCode' },
  { title: '标本状态', dataIndex: 'SpecimenStatus' },
  { title: '排序', dataIndex: 'SortOrder' },
  { title: '状态', dataIndex: 'Status', scopedSlots: { customRender: 'Status' } },
  { title: '备注', dataIndex: 'Remark' },
  { title: '操作', scopedSlots: { customRender: 'operation' } }
]
export default {
  name: 'WorkflowNodeSetting',
  components: {
  },
  data () {
    return {
      nodeColumns,
      nodeData
    }
  },
  created: function () {
    this.load()
  },
  computed: {
  },
  methods: {
    load () {
      getFlowNode()
      .then((res) => {
        res.forEach((item, index) => {
          item.key = index + 1
        })
        this.nodeData = res
      })
    },
    nodeAdd () {
      const $this = this
      this.$dialog(NodeEdit,
        // component props
        {
          record: {},
          on: {
            ok () {
              // Mark：定时提交成功一秒钟后刷新列表，防止数据未刷新
              setTimeout(() => {
                $this.nodeLoad()
              }, 500)
            },
            cancel () {
            },
            close () {
            }
          }
        },
        // modal props
        {
          title: '新增节点',
          width: 700,
          centered: true,
          maskClosable: false,
          keyboard: true
        })
    },
    nodeEdit (record) {
      const $this = this
      this.$dialog(NodeEdit,
        // component props
        {
          record,
          on: {
            ok () {
              // Mark：定时提交成功一秒钟后刷新列表，防止数据未刷新
              setTimeout(() => {
                $this.nodeLoad()
              }, 500)
            },
            cancel () {
            },
            close () {
            }
          }
        },
        // modal props
        {
          title: '编辑节点',
          width: 700,
          centered: true,
          maskClosable: false,
          keyboard: true
        })
    }
  }
}
</script>
