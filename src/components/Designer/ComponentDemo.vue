<template>
  <div style="width:100%;height:150px;text-align: center;line-height:80px;">
    <img :src="this.value" style="height: 80px;"/>
    <h1 style="font-weight: lighter;font-size:45px;height: 40px;display: block;">手术标本送检申请单</h1>
  </div>
</template>
<script>

export default {
  name: 'ReportTitle',
  props: {
    record: {
      type: Object,
      require: true,
      default: () => {}
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  created: function () {
  },
  methods: {
  }
}
</script>
