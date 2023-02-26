<template>
  <div>
    <a-row>
      <a-col :span="7">
      </a-col>
      <a-col :span="10">
        <a-input-search placeholder="请输入查询问题（输入功能关键字和问题关键字）" enter-button @search="onSearch" />
      </a-col>
      <a-col :span="7">
      </a-col>
    </a-row>
    <a-row style="margin-top:50px;">
      <a-col :span="24">
        <a v-for="i in data" :key="i"><a-icon type="caret-right" />{{ i }}</a>
      </a-col>
    </a-row>
  </div>
</template>

<script>
const dic = [
  { 'key': '申请单', 'value':'1'},
  { 'key': '申请|打不开', 'value':'1'},
  { 'key': '申请|空', 'value':'1'},
  { 'key': '标本不能打印', 'value':'2'},
  { 'key': '预检打印|内部错误', 'value':'2'}
]
const solution = [
  { 'key': '1', 'value':'申请界面打开显示为空，是由于没有设置申请单策略。到【系统管理】=>【策略配置】=>【策略模板】中配置策略'},
  { 'key': '2', 'value':'当预检打印标本，提示内部错误时，有可能是数据库配置有问题。到Api项目下的web.config配置文件，找到数据库连接字符串【FXSKContext】，检查是否正常连接到病理系统。'}
]
export default {
  data () {
    return {
      dic,
      solution,
      data: []
    }
  },
  methods: {
    onSearch (value) {
      this.data = []
      this.dic.forEach(item => {
        const key = item.key.split('|')
        const a= key.filter(f => value.indexOf(f) >= 0)
        if (a.length > 0) {
          const b = this.solution.filter(f => f.key === item.value)
          if (b.length > 0) {
            b.forEach(i => {
              if (this.data.filter(f => f === i.value).length === 0) {
                this.data.push(i.value)
              }
            })
          }
        }
      })
    }
  }
}
</script>

