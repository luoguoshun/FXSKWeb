<template>
  <div>
    <a-card :bordered="false">
      <div style="margin-bottom: 16px">
        <a-space>
          <a-button type="primary" icon="plus" @click="add()">新建</a-button>
          <a-button type="default" icon="reload" @click="load()">刷新</a-button>
        </a-space>
      </div>
      <a-table
        :columns="columns"
        rowKey="key"
        :data-source="data"
        :pagination="false"
        class="components-table-demo-nested"
        :expandedRowKeys="curExpandedRowKeys"
        @expand="expand">
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
              @cancel="cancel"
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
          <span slot="operation" slot-scope="text, record">
            <template>
              <a @click="edit(record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确定删除数据?"
                ok-text="是"
                cancel-text="否"
                @confirm="del(record)"
                @cancel="cancel"
                style="color:#f50"
              >
                <a href="#">删除</a>
              </a-popconfirm>
            </template>
          </span>
        </a-table>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { getMenuData, delMenu } from '@/api/system/menu'
import Edit from './Edit'
const allData = []
const data = []// 一级列表数据
const innerData = []// 子列表数据
const columns = [
  { title: '菜单名称', dataIndex: 'NodeName', key: 'NodeName', width: 150 },
  { title: '菜单编码', dataIndex: 'NodeCode', key: 'NodeCode', width: 150 },
  { title: '排序', dataIndex: 'SortOrder', key: 'SortOrder', width: 100 },
  { title: '页面Url', dataIndex: 'PageUrl', key: 'PageUrl', width: 250 },
  { title: '状态', dataIndex: 'Status', key: 'Status', scopedSlots: { customRender: 'Status' }, width: 100 },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
]
const innerColumns = [
  { title: '菜单名称', dataIndex: 'NodeName', key: 'NodeName', width: 150 },
  { title: '菜单编码', dataIndex: 'NodeCode', key: 'NodeCode', width: 150 },
  { title: '排序', dataIndex: 'SortOrder', key: 'SortOrder', width: 100 },
  { title: '页面Url', dataIndex: 'PageUrl', key: 'PageUrl', width: 250 },
  { title: '状态', dataIndex: 'Status', key: 'Status', scopedSlots: { customRender: 'Status' }, width: 100 },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
]
export default {
  components: {
    Edit
  },
  data () {
    return {
      allData,
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
    callback (key) {
    },
    getChildMenu (record) {
      const _childData = []
      this.allData.forEach((item) => {
        if (record.NodeCode === item.ParentCode) {
          _childData.push(item)
        }
      })
      this.innerData = _childData
    },
    expand (expanded, record) {
      if (this.curExpandedRowKeys.length > 0 && this.curExpandedRowKeys[0] === record.key) {
        this.curExpandedRowKeys = []
      } else {
        this.curExpandedRowKeys = [record.key]
        this.getChildMenu(record)
      }
    },
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
          title: '新增菜单',
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
              }, 1000)
            },
            cancel () {
            },
            close () {
            }
          }
        },
        // modal props
        {
          title: '编辑菜单',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    del (record) {
      delMenu(record.Id)
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
      getMenuData()
      .then((res) => {
        const _mainData = []
        this.allData = res.data
        res.data.forEach((item, index) => {
          item.key = index + 1
          if (item.ParentCode === null) {
            _mainData.push(item)
          }
        })
        this.data = _mainData
      })
    },
    cancel () {
    }
  }
}
</script>
