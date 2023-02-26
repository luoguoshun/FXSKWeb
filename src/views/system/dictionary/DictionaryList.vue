<template>
  <div>
    <a-card :bordered="false">
      <div style="margin-bottom: 16px">
        <a-space>
          <a-input class="ant-input" v-model="keys" placeholder="关键字输入" @keypress.13.native="search"/>
          <a-button type="primary" icon="search" @click="search()">查询</a-button>
          <a-button type="primary" icon="plus" @click="add()">新建</a-button>
          <a-button type="default" icon="reload" @click="load()">刷新</a-button>
        </a-space>
      </div>
      <template>
        <a-table :columns="columns" :data-source="data" :row-selection="rowSelection">
          <template slot="Status" slot-scope="text">
            <span v-if="text==0"><span class="ant-badge-status-dot ant-badge-status-default"></span><span class="ant-badge-status-text">禁用</span></span>
            <span v-if="text==1"><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">启用</span></span>
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
      </template>
    </a-card>
  </div>
</template>

<script>
import { getDictData, delDict } from '@/api/system/dictionary'
import Edit from './Edit'
const columns = [
  { title: '字典名称', dataIndex: 'Name', key: 'Name', width: '15%' },
  { title: '字典类型', dataIndex: 'Type', key: 'Type', width: '10%' },
  { title: '字典内容', dataIndex: 'Content', key: 'Content', width: '25%' },
  { title: '状态', dataIndex: 'Status', key: 'Status', scopedSlots: { customRender: 'Status' }, width: '10%' },
  { title: '备注', dataIndex: 'Remark', key: 'Remark', width: '30%' },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, width: '10%' }
]
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
  },
  onSelect: (record, selected, selectedRows) => {
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
  }
}
export default {
  components: {
    Edit
  },
  data () {
    return {
      data: [],
      columns,
      rowSelection,
      keys: ''
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
          title: '新增字典',
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
          title: '编辑字典',
          width: 700,
          centered: true,
          maskClosable: false,
          keyboard: true
        })
    },
    del (record) {
      delDict(record.Id)
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
      const $this = this
      this.data = []
      getDictData()
      .then((res) => {
        res.data.push({ Id: -1 })
        res.data.forEach((item, index) => {
          item.key = index + 1
          if (item.Id === -1) {
            $this.data.push(item)
          }
        })
        RecursionDict($this.data[0], res.data)
        const tempData = []
        $this.data[0].children.forEach((item) => {
          tempData.push(item)
        })
        $this.data = tempData
      })
      // 递归字典
      function RecursionDict (obj, data) {
        data.forEach(element => {
          if (obj.Id === element.ParentId) {
            if (obj.children === undefined) {
              obj.children = []
            }
            obj.children.push(element)
            RecursionDict(element, data)
          }
        })
      }
    },
    search () {
      const $this = this
      if (this.keys === '') {
        this.load()
        return
      }
      getDictData(this.keys).then(res => {
        $this.data = []
        res.data.forEach((item, index) => {
          item.key = index + 1
          $this.data.push(item)
        })
      })
    }
  }
}
</script>
