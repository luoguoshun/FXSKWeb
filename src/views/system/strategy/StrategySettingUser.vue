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
    >
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
    </a-table>
  </div>
</template>

<script>
import { getStrategyData, delStrategy } from '@/api/system/strategy'
import Edit from './StrategySettingUserEdit'

const data = []// 一级列表数据
const columns = [
  { title: '用户名称', dataIndex: 'EmployeeName', width: 350 },
  { title: '策略模板', dataIndex: 'TemplateName', width: 250 },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
]
export default {
  name: 'StrategySettingUser',
  components: {
    Edit
  },
  data () {
    return {
      data,
      columns
    }
  },
  created: function () {
    this.load()
  },
  computed: {
  },
  methods: {
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
          title: '新增策略',
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
      delStrategy(record.Id)
      .then((res) => {
        if (res.HttpStatusCode === 200 && res.ResultType === 1) {
          this.$message.success('操作成功！', 2)
          // Mark：定时提交成功一秒钟后刷新列表，防止数据未刷新
          this.load()
        } else {
          this.$message.error(res.Message, 2)
        }
      })
      .catch((error) => {
        this.$message.error(error, 2)
      })
    },
    load () {
      getStrategyData('', 'user')
      .then((res) => {
        res.data.forEach((item, index) => {
          item.key = index + 1
        })
        this.data = res.data
      })
    }
  }
}
</script>
