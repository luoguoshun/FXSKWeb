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
        <template slot="ReqType" slot-scope="text">
          <span v-if="text==d.value" v-for="d in specimenNameType" :key="d.value" :value="d.value">{{ d.text }}</span>
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
import { delHisReqTypeConfig, getHisReqTypeConfigs } from '@/api/system/hisReqConfig'
import HisReqTypeConfigEdit from './HisReqTypeConfigEdit'
const data = []// 一级列表数据
const columns = [
  { title: '客户端IP', dataIndex: 'IP', key: 'IP' },
  { title: '请求类型', dataIndex: 'ReqType', key: 'ReqType', scopedSlots: { customRender: 'ReqType' } },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
]
export default {
  components: {
    HisReqTypeConfigEdit
  },
  data () {
    return {
      data,
      columns,
      specimenNameType: [
        { 'text': '病人Id', 'value': '1' },
        { 'text': '住院号', 'value': '2' },
        { 'text': '门诊号', 'value': '3' },
        { 'text': '手腕码', 'value': '7' }
      ]
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
      this.$dialog(HisReqTypeConfigEdit,
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
          title: '新增打印机',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    edit (record) {
      const $this = this
      this.$dialog(HisReqTypeConfigEdit,
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
          title: '编辑打印机',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    del (record) {
      delHisReqTypeConfig(record.Id)
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
      getHisReqTypeConfigs()
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
