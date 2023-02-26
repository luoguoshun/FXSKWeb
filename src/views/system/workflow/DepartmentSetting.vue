<template>
  <div>
    <a-card :bordered="false">
      <a-row>
        <a-col :span="24">
          <a-space>
            <a-input class="ant-input" v-model="fileter.keys" placeholder="关键字输入" @keypress.13.native="search"/>
            <a-button type="primary" icon="search" @click="search()">查询</a-button>
            <a-divider type="vertical" />
            <a-button type="default" icon="reload" @click="load()">刷新</a-button>
          </a-space>
        </a-col>
      </a-row>
      <div style="margin: 10px 0"></div>
      <a-table
        :columns="columns"
        rowKey="Id"
        :data-source="data"
        class="components-table-demo-nested">
        <span slot="operation" slot-scope="text, record">
          <template>
            <a @click="edit(record)">流程配置</a>
          </template>
        </span>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { getDepartmentData } from '@/api/basics/department'
import Edit from './DepartmentSettingEdit'
import { CheckField } from '@/utils/util'
const data = []// 一级列表数据
const columns = [
  { title: '科室代码', dataIndex: 'DeptCode', width: 250 },
  { title: '科室名称', dataIndex: 'DeptName', width: 350 },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
]
export default {
  name: 'DepartmentSeeting',
  components: {
    Edit
  },
  data () {
    return {
      data,
      columns,
      fileter: {
        keys: ''
      }
    }
  },
  created: function () {
    this.load()
  },
  computed: {
  },
  methods: {
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
          title: '科室流程配置',
          width: 750,
          centered: true,
          maskClosable: false
        })
    },
    search () {
      this.load(this.fileter.keys)
    },
    load (name) {
      this.data = []
      const $this = this
      getDepartmentData()
      .then((res) => {
        let tempData = []
        res.data.forEach((item, index) => {
          item.key = index + 1
          if (item.PId === 0) {
            tempData.push(item)
          }
        })
        if (CheckField(name)) {
          tempData = tempData.filter(f => f.DeptName.indexOf(name) >=0)
        }
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
    }
  }
}
</script>
