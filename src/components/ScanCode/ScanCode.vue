<template>
  <a-space>
    <a-input-search :model="no" placeholder="输入标本号" enter-button @search="onSearch" />
    <!-- <span style="color:crimson;">（统一修改时间后需要点击保存/打印进行存储）</span> -->
    未确认数：<a-tag color="#f50">{{ notConfirm }}</a-tag>
    已确认数：<a-tag color="#87d068">{{ isConfirm }}</a-tag>
  </a-space>
</template>

<script>
import { string } from 'pizzip/js/support'

export default {
  name: 'ScanCode',
  data () {
    return {
    }
  },
  props: {
    notConfirm: {
      type: Number,
      default: 0
    },
    isConfirm: {
      type: Number,
      default: 0
    },
    no: {
      type: string,
      default: ''
    }
  },
  methods: {
    onSearch (value) {
      this.$emit('scan', this.no)
    }
  }
}
</script>
