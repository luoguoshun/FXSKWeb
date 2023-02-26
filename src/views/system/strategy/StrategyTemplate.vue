<template>
  <div>
    <div style="margin-bottom: 16px">
      <a-space>
        <a-button type="primary" icon="plus" @click="add()">新建</a-button>
        <a-button type="default" icon="reload" @click="load()">刷新</a-button>
        <Help :helpTitle="'策略配置操作说明'" :helpCode="'StrategyOperationHelp'" :content="''"/>
      </a-space>
    </div>
    <a-table
      :pagination="false"
      :columns="columns"
      rowKey="Id"
      :data-source="data"
    >
      <template slot="Status" slot-scope="text">
        <span v-if="text==0"><span class="ant-badge-status-dot ant-badge-status-default"></span><span class="ant-badge-status-text">禁用</span></span>
        <span v-if="text==1"><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">启用</span></span>
      </template>
      <template slot="IsDefault" slot-scope="text, record">
        <a-switch v-if="text === 1" checked-children="开" un-checked-children="关" default-checked @change="(a, b) => templateChange(a, b, record)" />
        <a-switch v-if="text === 0" checked-children="开" un-checked-children="关" @change="(a, b) => templateChange(a, b, record)" />
      </template>
      <template slot="TargetCode" slot-scope="text">
        <span v-if="text === 'Static'">静态模板</span>
        <span v-else>动态模板</span>
      </template>
      <span slot="operation" slot-scope="text, record">
        <template>
          <a @click="copy(record)">复制</a>
          <a-divider type="vertical" />
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
import { getStrategyTemplateData, delStrategyTemplate, saveStrategyTemplate, updStrategyDefault } from '@/api/system/strategy'
import Edit from './StrategyTemplateEdit'
import { CheckField, RandomString } from '@/utils/util'
import Help from '@/components/Help/HelpShowInfo'

const data = []// 一级列表数据
const columns = [
  { title: '策略名称', dataIndex: 'Name' },
  { title: '代码', dataIndex: 'Code' },
  { title: '模板类型', dataIndex: 'TargetCode', scopedSlots: { customRender: 'TargetCode' } },
  { title: '状态', dataIndex: 'Status', scopedSlots: { customRender: 'Status' } },
  { title: '默认策略', dataIndex: 'IsDefault', scopedSlots: { customRender: 'IsDefault' } },
  { title: '操作', scopedSlots: { customRender: 'operation' } }
]
export default {
  name: 'StrategyTemplate',
  components: {
    Edit,
    Help
  },
  data () {
    return {
      data,
      confirmLoading: false,
      columns
    }
  },
  created: function () {
    this.load()
  },
  computed: {
  },
  methods: {
    transformer (val) {
      if (CheckField(val) === false) {
        return false
      }
      if (val === 0 || val === '0' || val === false || val === 'false') {
        return false
      } else if (val === 1 || val === '1' || val === true || val === 'true') {
        return true
      }
    },
    templateChange (a, b, val) {
      updStrategyDefault({ Id: val.Id }).then((res) => {
        if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
          this.$message.success('操作成功！', 2)
        } else {
          this.$message.warning(res.Message, 2)
        }
      }).catch(error => {
          this.$message.error(error.$message, 2)
      })
    },
    load () {
      getStrategyTemplateData()
      .then((res) => {
        res.data.forEach((item, index) => {
          item.key = index + 1
        })
        this.data = res.data
      })
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
          title: '新增策略模板',
          width: 1000,
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
          title: '编辑策略模板',
          width: 1000,
          centered: true,
          maskClosable: false,
          keyboard: true
        })
    },
    del (record) {
      delStrategyTemplate(record.Id)
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
    copy (record) {
      record.IsDefault = 0
      record.Id = 0
      record.Name = record.Name + RandomString(5)
      saveStrategyTemplate(record).then((res) => {
        if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
          this.$message.success('操作成功！', 2)
          this.load()
        } else {
          this.$message.warning(res.Message, 2)
        }
      }).catch(error => {
          this.$message.error(error.$message, 2)
      })
    }
  }
}
</script>
