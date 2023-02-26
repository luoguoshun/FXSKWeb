<template>
  <div>
    <a-card :bordered="false">
      <a-row>
        <a-col :span="24">
          <a-space>
            <a-input class="ant-input" v-model="keys" placeholder="关键字输入" @keypress.13.native="search" />
            <a-button type="primary" icon="search" @click="search()">查询</a-button>
            <a-divider type="vertical" />
            <a-button type="primary" icon="plus" @click="add()">新建</a-button>
            <a-button type="default" icon="reload" @click="load('')">刷新</a-button>
          </a-space>
        </a-col>
      </a-row>
      <div style="margin: 10px 0"></div>
      <a-table :columns="columns" rowKey="Id" :data-source="data" :pagination="false" class="components-table-demo-nested">
        <template slot="State" slot-scope="text">
          <span v-if="text == 0"
            ><span class="ant-badge-status-dot ant-badge-status-default"></span><span class="ant-badge-status-text">停用</span></span
          >
          <span v-if="text == 1"
            ><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">在用</span></span
          >
        </template>
        <template slot="PathologyCode" slot-scope="text">
          <span v-if="text === key.value" v-for="key in pathologyCodeType" :key="key.value">{{ key.text }}</span>
        </template>
        <span slot="operation" slot-scope="text, record">
          <template>
            <a @click="edit(record)">修改</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除数据?" ok-text="是" cancel-text="否" @confirm="del(record)" style="color: #f50">
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </span>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { delCheckItem, getCheckItemData } from '@/api/basics/checkitem';
import { getSubmissionTypes } from '@/api/system/workflow';

import Edit from './Edit';
const data = []; // 一级列表数据
const columns = [
  { title: '送检类型', dataIndex: 'PathologyCode', key: 'PathologyCode', scopedSlots: { customRender: 'PathologyCode' } },
  { title: '检查项目名', dataIndex: 'ItemName', key: 'ItemName' },
  { title: '项目代码', dataIndex: 'ItemCode', key: 'ItemCode' },
  { title: '项目费用', dataIndex: 'CostAmount', key: 'CostAmount' },
  { title: '项目英文名', dataIndex: 'ItemEName', key: 'ItemEName' },
  { title: '状态', dataIndex: 'State', key: 'State', scopedSlots: { customRender: 'State' } },
  { title: '备注', dataIndex: 'Remark', key: 'Remark' },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } },
];
export default {
  components: {
    Edit,
  },
  data() {
    return {
      data,
      columns,
      keys: '',
      pathologyCodeType: [],
    };
  },
  created: function () {
    this.getSubmissionTypes();
    this.load('');
  },
  computed: {},
  methods: {
    getSubmissionTypes() {
      getSubmissionTypes().then((res) => {
        res.forEach((element) => {
          this.pathologyCodeType.push({
            value: element.Content,
            text: element.Name,
          });
        });
        this.pathologyCodeType.push({
          value: 'Common',
          text: '一般送检',
        });
      });
    },
    add() {
      const $this = this;
      this.$dialog(
        Edit,
        // component props
        {
          record: {},
          on: {
            ok() {
              setTimeout(() => {
                $this.load('');
              }, 500);
            },
            cancel() {},
            close() {},
          },
        },
        // modal props
        {
          title: '新增检查项目',
          width: 1000,
          centered: true,
          maskClosable: false,
        },
      );
    },
    edit(record) {
      const $this = this;
      this.$dialog(
        Edit,
        // component props
        {
          record,
          on: {
            ok() {
              // Mark：定时提交成功一秒钟后刷新列表，防止数据未刷新
              setTimeout(() => {
                $this.load('');
              }, 1000);
            },
            cancel() {},
            close() {},
          },
        },
        // modal props
        {
          title: '编辑检查项目',
          width: 1000,
          centered: true,
          maskClosable: false,
        },
      );
    },
    del(record) {
      delCheckItem(record.Id)
        .then((res) => {
          if (res.HttpStatusCode === 200 && res.ResultType === 1) {
            this.$message.success('操作成功！', 2);
            // Mark：定时提交成功一秒钟后刷新列表，防止数据未刷新
            this.load('');
          } else {
            this.$message.error(res.Message, 2);
          }
        })
        .catch((error) => {
          this.$message.error(error, 2);
        });
    },
    search() {
      this.load(this.keys);
    },
    load(keys) {
      getCheckItemData(keys).then((res) => {
        const _mainData = [];
        res.data.forEach((item, index) => {
          item.key = index + 1;
          _mainData.push(item);
        });
        this.data = _mainData;
      });
    },
  },
};
</script>
