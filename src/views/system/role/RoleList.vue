<template>
  <div>
    <a-card :bordered="false">
      <div style="margin-bottom: 16px">
        <a-space>
          <a-button type="primary" icon="plus" @click="add()">新建</a-button>
          <a-button type="default" icon="reload" @click="load(1, 10)">刷新</a-button>
        </a-space>
      </div>
      <a-table
        :columns="columns"
        rowKey="Id"
        :data-source="data"
        :pagination="false"
        class="components-table-demo-nested">
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
    </a-card>
  </div>
</template>

<script>
import { delRole, getRoleData } from '@/api/system/role'
import Edit from './Edit'
const data = []// 一级列表数据
const columns = [
  { title: '角色名', dataIndex: 'RoleName', key: 'RoleName' },
  { title: '备注', dataIndex: 'Remark', key: 'Remark' },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
]
export default {
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
      this.$dialog(Edit,
        // component props
        {
          record: {},
          on: {
            ok () {
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
          title: '新增角色',
          width: 700,
          centered: true,
          maskClosable: false
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
              }, 700)
            },
            cancel () {
            },
            close () {
            }
          }
        },
        // modal props
        {
          title: '编辑角色',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    del (record) {
      delRole(record.Id)
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
      getRoleData()
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
