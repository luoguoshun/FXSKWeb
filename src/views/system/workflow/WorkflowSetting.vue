<template>
  <div>
    <div style="margin-bottom: 16px">
      <a-space>
        <a-button type="primary" icon="plus" @click="add()">新建</a-button>
        <a-button type="default" icon="reload" @click="load()">刷新</a-button>
      </a-space>
    </div>
    <a-table
      :pagination="false"
      :columns="columns"
      rowKey="Id"
      :data-source="data"
      class="components-table-demo-nested"
      :expandedRowKeys="curExpandedRowKeys"
      @expand="expand">
      <template slot="Status" slot-scope="text">
        <span v-if="text==0"><span class="ant-badge-status-dot ant-badge-status-default"></span><span class="ant-badge-status-text">禁用</span></span>
        <span v-if="text==1"><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">启用</span></span>
      </template>
      <template slot="IsDefault" slot-scope="text">
        <span v-if="text==0"><span class="ant-badge-status-dot ant-badge-status-default"></span><span class="ant-badge-status-text">否</span></span>
        <span v-if="text==1"><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">是</span></span>
      </template>
      <span slot="operation" slot-scope="text, record">
        <template>
          <a @click="edit(record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除数据?"
            ok-text="是"
            cancel-text="否"
            @confirm="del(record)"
            style="color:#f50"
          >
            <a href="#">删除</a>
          </a-popconfirm>
        </template>
      </span>
      <a-table slot="expandedRowRender" rowKey="Id" :columns="innerColumns" :data-source="innerData" :pagination="false">
        <template slot="Status" slot-scope="text">
          <span v-if="text==0"><span class="ant-badge-status-dot ant-badge-status-default"></span><span class="ant-badge-status-text">禁用</span></span>
          <span v-if="text==1"><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">启用</span></span>
        </template>
      </a-table>
    </a-table>
  </div>
</template>

<script>
import { getMainFlow, getChildFlow, delFlow } from '@/api/system/workflow'
import Edit from '@/views/system/workflow/Edit'

const data = []// 一级列表数据
const innerData = []
const columns = [
  { title: '流程名称', dataIndex: 'WorkflowName' },
  { title: '代码', dataIndex: 'WorkflowCode' },
  { title: '状态', dataIndex: 'Status', scopedSlots: { customRender: 'Status' } },
  { title: '默认流程', dataIndex: 'IsDefault', scopedSlots: { customRender: 'IsDefault' } },
  { title: '备注', dataIndex: 'Remark' },
  { title: '操作', scopedSlots: { customRender: 'operation' } }
]
const innerColumns = [
  { title: '流程节点名称', dataIndex: 'WorkflowName' },
  { title: '代码', dataIndex: 'WorkflowCode' },
  { title: '状态', dataIndex: 'Status', scopedSlots: { customRender: 'Status' } },
  { title: '顺序', dataIndex: 'SortOrder' }
]
export default {
  name: 'WorkflowSetting',
  components: {
    Edit
  },
  data () {
    return {
      data,
      confirmLoading: false,
      columns,
      innerColumns,
      innerData,
      curExpandedRowKeys: []
    }
  },
  created: function () {
    this.load()
  },
  computed: {
  },
  methods: {
    getChildNode (record) {
      getChildFlow(record.Id)
      .then((res) => {
        res.forEach((item, index) => {
          item.key = index + 1
        })
        this.innerData = res
      })
    },
    expand (expanded, record) {
      if (this.curExpandedRowKeys.length > 0 && this.curExpandedRowKeys[0] === record.Id) {
        this.curExpandedRowKeys = []
      } else {
        this.curExpandedRowKeys = [record.Id]
        this.getChildNode(record)
      }
    },
    add () {
      const $this = this
      this.dialogObj = this.$dialog(Edit,
        // component props
        {
          record: {},
          on: {
            ok () {
              // Mark：定时提交成功一秒钟后刷新列表，防止数据未刷新
              setTimeout(() => {
                $this.load()
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
          title: '新增流程',
          width: 700,
          centered: true,
          maskClosable: false,
          keyboard: true
        })
    },
    edit (record) {
      const $this = this
      this.$dialog(Edit,
        // component props
        {
          record,
          on: {
            ok () {
              // Mark：定时提交成功一秒钟后刷新列表，防止数据未刷新
              setTimeout(() => {
                $this.load()
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
          title: '编辑流程',
          width: 700,
          centered: true,
          maskClosable: false,
          keyboard: true
        })
    },
    del (record) {
      delFlow(record.Id)
      .then((res) => {
        if (res.HttpStatusCode === 200 && res.ResultType === 1) {
          this.$message.success('操作成功！', 2)
          // Mark：定时提交成功一秒钟后刷新列表，防止数据未刷新
          this.load()
          this.nodeLoad()
        } else {
          this.$message.error(res.Message, 2)
        }
      })
      .catch((error) => {
        this.$message.error(error, 2)
      })
    },
    load () {
      getMainFlow()
      .then((res) => {
        res.forEach((item, index) => {
          item.key = index + 1
        })
        this.data = res
      })
    }
  }
}
</script>
