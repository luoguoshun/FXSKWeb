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
            <a-button type="default" icon="reload" @click="load()">刷新</a-button>
            <a-button type="default" icon="printer" @click="printLable()">打印登录标签</a-button>
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
        <template slot="Status" slot-scope="text">
          <span v-if="text==0"><span class="ant-badge-status-dot ant-badge-status-default"></span><span class="ant-badge-status-text">禁用</span></span>
          <span v-if="text==1"><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">启用</span></span>
        </template>
        <template slot="Sex" slot-scope="text">
          <span v-if="text==0"><span class="ant-badge-status-text" style="color:#096dd9;">男</span></span>
          <span v-if="text==1"><span class="ant-badge-status-text" style="color:#f198aa;">女</span></span>
        </template>
        <template slot="Department" slot-scope="text">
          <span v-if="text==d.value" v-for="d in departmentDatas":key="d.value" :value="d.value">{{ d.text }}</span>
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
    <a-modal
      title="打印标签"
      :visible="visible"
      :confirm-loading="confirmLoading"
      ok-text="打印"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-input placeholder="输入账户" v-model="LoginName" style="margin-bottom:10px;">
        <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
      </a-input>
      <a-input type="password" placeholder="输入密码" v-model="LoginPwd">
        <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-modal>
  </div>
</template>

<script>
import { getSysUserData, delSysUser } from '@/api/system/user'
import { getDepartmentData } from '@/api/basics/department'
import { BrowserPrintInit } from '@/utils/BrowserPrint.js'
import Edit from './Edit'
import { CheckField, PromptBox } from '@/utils/util'
const data = []// 一级列表数据
const columns = [
  { title: '登录名', dataIndex: 'LoginName', key: 'LoginName' },
  { title: '工号', dataIndex: 'UserCode', key: 'UserCode' },
  { title: '姓名', dataIndex: 'UserName', key: 'UserName' },
  { title: '性别', dataIndex: 'Sex', key: 'Sex', scopedSlots: { customRender: 'Sex' } },
  { title: '科室', dataIndex: 'Department', key: 'Department', scopedSlots: { customRender: 'Department' } },
  { title: '用户类型', dataIndex: 'UserType', key: 'UserType' },
  { title: '角色', dataIndex: 'RoleNames', key: 'RoleNames' },
  { title: '状态', dataIndex: 'Status', key: 'Status', scopedSlots: { customRender: 'Status' } },
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
      confirmLoading: false,
      visible: false,
      LoginName: '',
      LoginPwd: '',
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      departmentDatas: []
    }
  },
  created: function () {
    this.load()
    this.loadDepartmentData()
  },
  mounted () {
    // 初始化浏览器打印事件
    BrowserPrintInit(this)
  },
  computed: {
  },
  methods: {
    loadDepartmentData () {
      getDepartmentData().then((res) => {
        res.data.forEach((item, i) => {
          this.departmentDatas.push({
            value: item.DeptCode,
            text: item.DeptName
          })
        })
      })
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
                $this.load('', 1, 10)
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
          title: '新增用户',
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
                $this.load('', 1, 10)
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
          title: '编辑用户',
          width: 1000,
          centered: true,
          maskClosable: false
        })
    },
    del (record) {
      delSysUser(record.Id)
      .then((res) => {
        if (res.HttpStatusCode === 200 && res.ResultType === 1) {
          this.$message.success('操作成功！', 2)
          // Mark：定时提交成功一秒钟后刷新列表，防止数据未刷新
          this.load('', 1, 10)
        } else {
          this.$message.error(res.Message, 2)
        }
      })
      .catch((error) => {
        this.$message.error(error, 2)
      })
    },
    search () {
      this.pagination.current = 1
      this.load()
    },
    load () {
      getSysUserData(this.keys, this.pagination)
      .then((res) => {
        const _mainData = []
        res.data.forEach((item, index) => {
          item.key = index + 1
          _mainData.push(item)
        })
        this.data = _mainData
        this.pagination.total = res.count
      })
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.load()
    },
    printLable () {
      this.visible = true
    },
    handleOk (e) {
      if (CheckField(this.LoginName) === false) {
        PromptBox('请输入账户', 'warning')
        return
      }
      if (CheckField(this.LoginPwd) === false) {
        PromptBox('请输入密码', 'warning')
        return
      }
      const printData = `^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR2,2~SD30^JUS^LRN^CI0^XZ
                        ^XA
                        ^MMT
                        ^PW320
                        ^LL0160
                        ^LS0
                        ^FT101,157^BQN,2,5
                        ^FH\^FDLA,${window.btoa(this.LoginName)} ${window.btoa(this.LoginPwd)}^FS
                        ^FT100,148^A0N,20,31^FH\^FD${this.LoginName}^FS
                        ^PQ1,0,1,Y^XZ`
      this.GLOBAL.selectedDevice.send(printData, undefined, () => {})
    },
    handleCancel (e) {
      this.visible = false
    }
  }
}
</script>
