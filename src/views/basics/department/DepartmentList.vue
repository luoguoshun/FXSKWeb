<template>
  <div>
    <a-card :bordered="false">
      <a-row>
        <a-col :span="24">
          <a-space>
            <a-input class="ant-input" v-model="keys" placeholder="关键字输入" @keypress.13.native="search"/>
            <a-button type="primary" icon="search" @click="search()">查询</a-button>
            <a-divider type="vertical" />
            <a-button type="primary" icon="plus" @click="add()">新建</a-button>
            <a-button type="default" icon="reload" @click="load('', 1, 10)">刷新</a-button>
          </a-space>
        </a-col>
      </a-row>
      <div style="margin: 10px 0"></div>
      <a-table
        :columns="columns"
        rowKey="Id"
        :data-source="data"
        :pagination="pagination"
        @change="handleTableChange"
        class="components-table-demo-nested">
        <template slot="ValidState" slot-scope="text">
          <span v-if="text==0"><span class="ant-badge-status-dot ant-badge-status-default"></span><span class="ant-badge-status-text">停用</span></span>
          <span v-if="text==1"><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">在用</span></span>
          <span v-if="text==2"><span class="ant-badge-status-dot ant-badge-status-error"></span><span class="ant-badge-status-text">废弃</span></span>
        </template>
        <template slot="DeptType" slot-scope="text">
          <span v-if="text=='C'">门诊</span>
          <span v-if="text=='I'">住院</span>
          <span v-if="text=='F'">财务</span>
          <span v-if="text=='L'">后勤</span>
          <span v-if="text=='PI'">药库</span>
          <span v-if="text=='T'">医技</span>
          <span v-if="text=='D'">机关</span>
          <span v-if="text=='P'">药房</span>
          <span v-if="text=='N'">护士站</span>
          <span v-if="text=='O'">其它</span>
        </template>
        <template slot="DeptPRO" slot-scope="text">
          <span v-if="text=='0'">普通</span>
          <span v-if="text=='1'">手术</span>
          <span v-if="text=='2'">麻醉</span>
          <span v-if="text=='3'">ICU</span>
          <span v-if="text=='4'">CCu</span>
          <span v-if="text=='C'">产科</span>
          <span v-if="text=='E'">急诊留观</span>
          <span v-if="text=='T'">特诊</span>
        </template>
        <template slot="RegdeptFlag" slot-scope="text">
          <span v-if="text==0">否</span>
          <span v-if="text==1">是</span>
        </template>
        <template slot="TatdeptFlag" slot-scope="text">
          <span v-if="text==0">否</span>
          <span v-if="text==1">是</span>
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
    </a-card>
  </div>
</template>

<script>
import { delDepartment, getDepartmentPageData } from '@/api/basics/department'

import Edit from './Edit'
const data = []// 一级列表数据
const columns = [
  { title: '科室代码', dataIndex: 'DeptCode', key: 'DeptCode', width: 150 },
  { title: '科室名称', dataIndex: 'DeptName', key: 'DeptName', width: 200 },
  { title: '科室简称', dataIndex: 'SimpleName', key: 'SimpleName', width: 100 },
  { title: '科室类型', dataIndex: 'DeptType', key: 'DeptType', scopedSlots: { customRender: 'DeptType' }, width: 130 },
  { title: '是否挂号科室', dataIndex: 'RegdeptFlag', key: 'RegdeptFlag', scopedSlots: { customRender: 'RegdeptFlag' }, width: 150 },
  { title: '是否核算科室', dataIndex: 'TatdeptFlag', key: 'TatdeptFlag', scopedSlots: { customRender: 'TatdeptFlag' } },
  { title: '特殊科室属性', dataIndex: 'DeptPRO', key: 'DeptPRO', scopedSlots: { customRender: 'DeptPRO' } },
  { title: '有效标识', dataIndex: 'ValidState', key: 'ValidState', scopedSlots: { customRender: 'ValidState' } },
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
      columns,
      keys: '',
      pagination: {
        pageSize: 99999,
        current: 1,
        total: 0
      },
      departmentDatas: []
    }
  },
  created: function () {
    this.load('', 1, 99999)
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
                $this.load('', 1, 99999)
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
          title: '新增科室',
          width: 1000,
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
                $this.load('', 1, 99999)
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
          title: '编辑科室',
          width: 1000,
          centered: true,
          maskClosable: false
        })
    },
    del (record) {
      delDepartment(JSON.stringify([record.Id]))
      .then((res) => {
        if (res.HttpStatusCode === 200 && res.ResultType === 1) {
          this.$message.success('操作成功！', 2)
          // Mark：定时提交成功一秒钟后刷新列表，防止数据未刷新
          this.load('', 1, 99999)
        } else {
          this.$message.error(res.Message, 2)
        }
      })
      .catch((error) => {
        this.$message.error(error, 2)
      })
    },
    search () {
      this.load(this.keys, 1, 99999)
    },
    load (keys, pageIndex, pageSize) {
      this.data = []
      const $this = this
      getDepartmentPageData(keys, pageIndex, pageSize)
      .then((res) => {
        const tempData = []
        res.data.forEach((item, index) => {
          item.key = index + 1
          if (item.PId === 0) {
            tempData.push(item)
          }
        })
        tempData.forEach(item => {
          RecursionDict(item, res.data)
        })
        $this.data = tempData
      })
      // 递归字典
      function RecursionDict (obj, data) {
        data.forEach(element => {
          if (obj.Id === element.PId) {
            if (obj.children === undefined) {
              obj.children = []
            }
            obj.children.push(element)
            RecursionDict(element, data)
          }
        })
      }
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.load(pager.current, pager.pageSize)
    }
  }
}
</script>
