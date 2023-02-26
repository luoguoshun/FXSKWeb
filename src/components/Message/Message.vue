<template>
  <a-dropdown placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <a-badge :count="total" @click="goMessage('all')">
        <a-icon type="notification" style="font-size:19px;" />
      </a-badge>
    </span>
    <!-- <template v-slot:overlay>
      <a-card style="width: 300px">
        <a-list bordered :data-source="data">
          <a-list-item slot="renderItem" slot-scope="item">
            <a slot="extra" href="javascript:" style="color:#000000a6">{{ item }}</a>
          </a-list-item>
          <div slot="footer" style="text-align: center;">
            <a slot="extra" href="#" @click="goMessage('all')">更多</a>
          </div>
        </a-list>
      </a-card>
    </template> -->
  </a-dropdown>
</template>

<script>
import { getNotReadingReportTotal } from '@/api/system/message'
const data = [
]
export default {
  name: 'Message',
  props: {
    currentUser: {
      type: Object,
      default: () => null
    },
    menu: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      data,
      total: 0
    }
  },
  created: function () {
    // this.loadTotal()
  },
  methods: {
    goMessage (title) {
      this.$router.push({ path: '/submission/message' })
    },
    loadTotal () {
      const $this = this
      getNotReadingReportTotal().then(res => {
        if (res) {
          $this.total = res.Data
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
