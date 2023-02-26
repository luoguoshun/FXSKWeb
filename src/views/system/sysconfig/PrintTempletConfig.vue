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
const data = []// 一级列表数据
const columns = [
  { title: '模板名称', dataIndex: 'Name' },
  { title: '内容', dataIndex: 'Content', width: 909,},
  { title: '操作', scopedSlots: { customRender: 'operation' } }
]
import { getPrintTempDicts, delPrintTempDicts } from '@/api/system/dictionary'
import enums from '@/store/enum/fields'
import enums2 from '@/store/enum/enum'
import Edit from './PrintTempletConfigEdit.vue'
export default {
  components: {
    Edit
  },
  name: 'PrintTempletCoonfig',
  data () {
    return {
      data,
      columns,
      enums2,
      enums
    }
  },
  created: function () {
    this.loadTemplet()
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    loadTemplet () {
      this.TempDatas = []
      this.TempTypeDatas = [{ 'value': 'new', 'text': '新建模板' }]
      getPrintTempDicts().then(res => {
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
              $this.loadTemplet()
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
        title: '新增打印模板',
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
          title: '编辑打印模板',
          width: 700,
          centered: true,
          maskClosable: false,
          keyboard: true
        })
    },
    remove () {
      if (this.TempId === 0) {
        this.$message.warning('请选择删除模板')
        return
      }
      const $this = this
      this.$confirm({
        title: '删除模板',
        content: '确定删除模板',
        centered: true,
        onOk () {
          delPrintTempDicts($this.TempId).then(res => {
            if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
              $this.$message.success('操作成功！', 2)
              $this.loadTemplet()
              $this.reDo()
              return new Promise(resolve => {
                setTimeout(() => {
                  resolve(true)
                }, 1000)
              })
            } else {
              $this.$message.warning(res.Message, 2)
              return new Promise(resolve => {
                  resolve(true)
              })
            }
          })
        }
      })
    }
  }
}
</script>
