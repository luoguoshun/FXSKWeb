<template>
  <div>
    <a-input-search placeholder="请输入文本" style="width: 200px" @search="onSearch" v-model="textValue" />
    <br /><br />
    <!-- 动态组件区域 -->
    <a-card class="dynamic-com-area">
      <div class="gutter-example">
        <a-row :gutter="48">
          <a-col class="gutter-row" :span="4" v-show="renderRulesObj['a-input']['show']">
            <a-input placeholder="请输入姓名" style="width: 200px" v-model="renderRulesObj['a-input']['defaultValue']" />
          </a-col>
          <a-col class="gutter-row" :span="4" v-show="renderRulesObj['a-input-number']['show']">
            <a-input-number placeholder="年龄" v-model="renderRulesObj['a-input-number']['defaultValue']" :min="1" :max="100" style="width: 200px" />
          </a-col>
          <a-col class="gutter-row" :span="4" v-show="renderRulesObj['a-select']['show']">
            <a-select show-search placeholder="请选择区域" style="width: 200px">
              <a-select-option v-for="item in renderRulesObj['a-select']['options']" :key="item.value" :value="item.value">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col class="gutter-row" :span="5" v-show="renderRulesObj['a-date-picker']['show']">
            <a-date-picker @change="dateOnChange" :defaultValue="moment('2015-01-01', 'YYYY-MM-DD')" />
          </a-col>
        </a-row>
        <div class="division"></div>
        <a-row :gutter="48">
          <a-col class="gutter-row" :span="10" v-show="renderRulesObj['a-input-textarea']['show']">
            <a-input v-model="renderRulesObj['a-input-textarea']['defaultValue']" type="textarea" style="height: 100px" />
          </a-col>
        </a-row>
      </div>
      <div v-show="false" id="grid-text">
        <a-input placeholder="请输入姓名" style="width: 200px" v-model="renderRulesObj['a-input']['defaultValue']" />
        <a-input-number placeholder="年龄" v-model="renderRulesObj['a-input-number']['defaultValue']" :min="1" :max="100" style="width: 200px" />
        <a-input placeholder="请输入姓名" style="width: 200px" v-model="renderRulesObj['a-input']['defaultValue']" />
        <a-date-picker @change="dateOnChange" :defaultValue="moment('2015-01-01', 'YYYY-MM-DD')" />
        <a-input placeholder="请输入姓名" style="width: 200px" v-model="renderRulesObj['a-input']['defaultValue']" />
        <a-input placeholder="请输入姓名" style="width: 200px" v-model="renderRulesObj['a-input']['defaultValue']" />
        <a-input placeholder="请输入姓名" style="width: 200px" v-model="renderRulesObj['a-input']['defaultValue']" />
        <a-select show-search placeholder="请选择区域" style="width: 200px">
          <a-select-option v-for="item in renderRulesObj['a-select']['options']" :key="item.value" :value="item.value">
            {{ item.text }}
          </a-select-option>
        </a-select>
        <a-input placeholder="请输入姓名" style="width: 200px" v-model="renderRulesObj['a-input']['defaultValue']" />
      </div>
    </a-card>
  </div>
</template>

<script>
// import  myEdit from '@views/test/dynamicTest/myEdit';
import nameEdit from '@/views/submission/print/nameEdit';
import numberEdit from '@/views/submission/print/numberEdit';
import { CheckField, PromptBox } from '@/utils/util';
import moment from 'moment';
const renderRulesObj = {
  'a-input': {
    name: 'a-input',
    matchText: ['name', 'text', '姓名', '姓', '名'],
    show: false,
    defaultValue: '',
    valueType: 'string',
    style: '',
  },
  'a-input-number': {
    name: 'a-input-number',
    matchText: ['age', 'numner', '年龄', '年纪', '岁数'],
    show: false,
    defaultValue: 0,
    valueType: 'number',
    style: '',
  },
  'a-input-textarea': {
    name: 'a-input-number',
    matchText: ['详细'],
    show: false,
    defaultValue: 0,
    valueType: 'string',
    style: '',
  },
  'a-date-picker': {
    name: 'a-date-picker',
    matchText: ['date', '时间', '日期', '生日'],
    show: false,
    valueType: 'date',
    defaultValue: 'moment("2015-01-01", "YYYY-MM-DD")',
    style: '',
  },
  'a-select': {
    name: 'a-select',
    matchText: ['区域', 'area', '地方', '区', '域'],
    show: false,
    defaultValue: '10010',
    options: [
      { value: '001', text: '天河区' },
      { value: '002', text: '黄浦区' },
      { value: '003', text: '越秀区' },
    ],
    valueType: 'Array',
    style: '',
  },
};
export default {
  data() {
    return {
      loading: false,
      visible: false,
      textValue: '',
      inputNumber: '',
      renderRulesObj: {},
    };
  },
  components: { nameEdit, numberEdit },
  computed: {},
  methods: {
    moment,
    onSearch(searchValue) {
      if (searchValue.length === 0) {
        PromptBox('请输入文本', 'warning');
        return;
      }
      if (!CheckField(searchValue)) {
        PromptBox('请输入正确的文本', 'warning');
        return;
      }
      Object.keys(this.renderRulesObj).forEach((key) => {
        const renderRules = this.renderRulesObj[key];
        if (renderRules && renderRules != null) {
          renderRules.show = false;
          //设置默认值
          switch (renderRules.valueType) {
            case 'string':
              renderRules.defaultValue = '';
              break;
            case 'number':
              renderRules.defaultValue = 0;
              break;
            case 'date':
              renderRules.defaultValue = moment('2015-01-01', 'YYYY-MM-DD');
              break;
            case 'array':
              renderRules.defaultValue = [];
              break;
            default:
              renderRules.defaultValue = null;
              break;
          }
          const matchTexts = renderRules['matchText'];
          for (const value of matchTexts) {
            // 在组件获取规则找到该匹配字符串
            if (searchValue.indexOf(value) !== -1) {
              renderRules.show = true;
              break; //跳出该组件规则遍历 继续匹配下一个组件
            }
          }
        }
      });
    },
    dateOnChange(value) {
      var value = moment(value).format('YYYY-MM-DD 00:00:01');
    },
  },
  created() {
    if (renderRulesObj && renderRulesObj != null) {
      this.renderRulesObj = renderRulesObj;
      console.log(this.renderRulesObj);
    }
  },
  watch: {
    textValue: function (newValue, oldValue) {
      Object.keys(this.renderRulesObj).forEach((key) => {
        const renderRules = this.renderRulesObj[key];
        if (renderRules && renderRules != null) {
          renderRules.show = false;
          //设置默认值
          switch (renderRules.valueType) {
            case 'string':
              renderRules.defaultValue = '';
              break;
            case 'number':
              renderRules.defaultValue = 0;
              break;
            case 'date':
              renderRules.defaultValue = moment('2015-01-01', 'YYYY-MM-DD');
              break;
            case 'array':
              renderRules.defaultValue = [];
              break;
            default:
              renderRules.defaultValue = null;
              break;
          }
          const matchTexts = renderRules['matchText'];
          for (const value of matchTexts) {
            // 在组件获取规则找到该匹配字符串
            if (newValue.indexOf(value) !== -1) {
              renderRules.show = true;
              break; //跳出该组件规则遍历 继续匹配下一个组件
            }
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
* {
  box-sizing: border-box;
}

.dynamic-com-area {
  width: 100%;
  // height: 500px;
  .gutter-example > .ant-row > div {
    background: transparent;
    border: 0;
  }
  .division {
    height: 10px;
  }
}
#grid-text {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr minmax(150px, 200px);
  //设置item之间的距离
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  grid-auto-flow: row; //先填充行
  > div {
    border: 1px solid red;
  }
  > input {
    border: 1px solid red;
  }
}
</style>
