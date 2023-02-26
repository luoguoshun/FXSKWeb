<template>
  <a-card>
    <div>
      <a-tabs default-active-key="2">
        <a-tab-pane key="1" tab="系统基础配置检查">
          <a-button type="primary" @click="check">
            <a-icon type="radar-chart" />系统基础配置完整性检测
          </a-button>
          <a-progress ref="loading" :percent="percent" />
          <a-result
            ref="success"
            status="success"
            title="检测正确"
            sub-title="当前系统的配置和基础数据完整."
            style="display: none;"
          >
            <template #extra>
            </template>
          </a-result>
          <a-result
            ref="warning"
            status="warning"
            title="检测警告"
            style="display: none;"
            :sub-title="warningMsg">
            <template #extra>
            </template>
          </a-result>
          <a-tooltip ref="warningDesc">
            <span v-for="d in DescData" :key="d" :value="d" style="height:22px;display: block;"><a-icon style="color:red;margin-right:5px;" type="close-circle"/>{{ d }}</br></span>
          </a-tooltip>
        </a-tab-pane>
        <a-tab-pane key="2" tab="打印机模板配置">
          <PrintTempletCoonfig/>
        </a-tab-pane>
        <a-tab-pane key="3" tab="打印机配置">
          <PrintConfig/>
        </a-tab-pane>
        <a-tab-pane key="5" tab="主机映射配置">
          <ClienMapConfig/>
        </a-tab-pane>
        <a-tab-pane key="4" tab="His类型配置">
          <HisReqTypeConfig/>
        </a-tab-pane>
        <a-tab-pane key="6" tab="实施帮助">
          <Help/>
        </a-tab-pane>
        <a-tab-pane key="7" tab="申请单回溯">
          <AppOrderRecall/>
        </a-tab-pane>
        <a-tab-pane key="8" tab="同步字典">
          <!-- <SynchronousDictionary/> -->
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
</template>
<script>
import PrintTempletCoonfig from './PrintTempletConfig'
import HisReqTypeConfig from './HisReqTypeConfig'
import PrintConfig from '@/views/system/printer/PrintConfigList'
import ClienMapConfig from '@/views/system/clienmap/ClienMapConfig'
// import SynchronousDictionary from './SynchronousDictionary'
import Help from './Help.vue'
import AppOrderRecall from './AppOrderRecall.vue'
import { getStrategyTemplateData } from '@/api/system/strategy'
const temps = ['Print', 'Packaging', 'Receive', 'AppEdit', 'AppList']
export default {
  components: {
    PrintTempletCoonfig,
    PrintConfig,
    HisReqTypeConfig,
    ClienMapConfig,
    Help,
    AppOrderRecall,
    SynchronousDictionary
  },
  data () {
    return {
      percent: 0,
      warningMsg: '',
      activeKey: 1,
      DescData: [],
      temps
    }
  },
  created: function () {
    this.load()
  },
  mounted () {
    this.$refs.loading.$el.style.display = 'none'
    this.$refs.success.$el.style.display = 'none'
    this.$refs.warning.$el.style.display = 'none'
    this.$refs.warningDesc.$el.style.display = 'none'
  },
  computed: {
  },
  methods: {
    check () {
      this.percent = 0
      this.$refs.success.$el.style.display = 'none'
      this.$refs.warning.$el.style.display = 'none'
      this.$refs.warningDesc.$el.style.display = 'none'
      this.$refs.loading.$el.style.display = 'block'
      getStrategyTemplateData().then((res) => {
        const result = []
        this.temps.forEach(element => {
          const a = res.data.filter(f => f.Code === element && f.IsDefault === 1)
          if (a.length === 0) {
            result.push(`请检查代码为【${element}】所对应策略模板是否创建（系统管理=>策略配置=>策略模板）`)
          }
        })
        const timer = setInterval(() => {
          if (this.percent === 100) {
            clearInterval(timer)
            if (result !== '' && result.length === 0) {
              this.$refs.success.$el.style.display = 'block'
            } else {
              this.DescData = result
              this.$refs.warning.$el.style.display = 'block'
              this.$refs.warningDesc.$el.style.display = 'block'
            }
          }
          this.percent += 10
        }, 100)
      })
    },
    load () {
    }
  }
}
</script>
