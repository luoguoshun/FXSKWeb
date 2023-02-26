<template>
  <div>
    <a-button type="primary" @click="showDrawer">
      <a-icon type="question-circle" />
    </a-button>
    <a-drawer
      width="800"
      :title="helpTitle"
      placement="right"
      :closable="false"
      :visible="visible"
      :after-visible-change="afterVisibleChange"
      @close="onClose"
    >
      <k-form-build id="form" ref="kfb" :value="jsonData" :dynamicData="dynamicData"/>
    </a-drawer>
  </div>
</template>
<script>
import { getTemplateByCode } from '@/api/system/pageTemplate'
import { JSONStringToObject } from '@/utils/util'
export default {
  props: {
    helpTitle: {
      type: String,
      default: '帮助说明'
    },
    content: {
      type: String,
      default: ''
    },
    helpCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      jsonData: {
        list: [
        ],
        config: {
        }
      },
      dynamicData: {},
      visible: false
    }
  },
  created: function () {
  },
  methods: {
    afterVisibleChange (val) {
    },
    showDrawer () {
      getTemplateByCode(this.helpCode).then(res => {
        this.helpTitle = res.data.Name
        this.jsonData = JSONStringToObject(res.data.Content)
        setTimeout(() => {
          this.$refs.kfb.setData(this.record)
        }, 500)
      })
      this.visible = true
    },
    onClose () {
      this.visible = false
    }
  }
}
</script>
