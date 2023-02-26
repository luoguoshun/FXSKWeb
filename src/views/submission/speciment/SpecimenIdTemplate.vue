<template>
  <div>
    <a-descriptions title="申请单">
      <a-descriptions-item label="申请单号">
        {{ this.record.apps[0].AppNo }}
      </a-descriptions-item>
      <a-descriptions-item label="申请单编号">
        {{ this.record.apps[0].Id }}
      </a-descriptions-item>
      <a-descriptions-item label="患者名称">
        {{ this.record.apps[0].PatientName }}
      </a-descriptions-item>
      <a-descriptions-item label="开单时间">
        {{ this.record.apps[0].ReqDateTime }}
      </a-descriptions-item>
      <a-descriptions-item label="年龄">
        {{ this.record.apps[0].Age }}{{ this.record.apps[0].AgeType === '0' ? '岁' : (this.record.apps[0].AgeType === '1' ? '月' : '日') }}
      </a-descriptions-item>
      <a-descriptions-item label="性别">
        {{ this.record.apps[0].Sex === 1 ? '女' : '男' }}
      </a-descriptions-item>
      <a-descriptions-item label="门诊号">
        {{ this.record.apps[0].OutpatientNum }}
      </a-descriptions-item>
      <a-descriptions-item label="住院号">
        {{ this.record.apps[0].AdmissionNum }}
      </a-descriptions-item>
      <a-descriptions-item label="手腕码">
        {{ this.record.apps[0].InpatientWristCode }}
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions title="标本列表">
      <a-list size="small" bordered>
        <a-list-item v-for="i in this.record.specimens" :key="i.Id">
          <a @click="trace(i)">{{ i.SpecimenName }}</a>
        </a-list-item>
        <div slot="header">
          标本名称
        </div>
      </a-list>
    </a-descriptions>
    <a-descriptions title="打包运送">
      <a-descriptions-item label="打包号">
        {{ this.record.sendPackages.SendNo }}
      </a-descriptions-item>
      <a-descriptions-item label="打包编号">
        {{ this.record.sendPackages.Id }}
      </a-descriptions-item>
      <a-descriptions-item label="打包时间">
        {{ this.record.sendPackages.CreatedTime }}
      </a-descriptions-item>
      <a-descriptions-item label="打包人">
        {{ this.record.sendPackages.Submitter }}
      </a-descriptions-item>
      <a-descriptions-item label="运送时间">
        {{ this.record.sendPackages.ShippingStartTime }}
      </a-descriptions-item>
      <a-descriptions-item label="发送人">
        {{ this.record.sendPackages.Shipper }}
      </a-descriptions-item>
      <a-descriptions-item label="接收时间">
        {{ this.record.sendPackages.ShippingEndTime }}
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import Trace from './Trace'
export default {
  components: {
    Trace
  },
  name: 'AppNoTemplate',
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
    }
  },
  created: function () {
    // this.record = {}
  },
  computed: {
  },
  methods: {
    initializeData (e, field) {
      if (CheckField(e) && e.length > 0) {
        return e[field]
      }
    },
    trace (record) {
      this.$dialog(Trace,
        // component props
        {
          record,
          on: {
            ok () {
            },
            cancel () {
            },
            close () {
            }
          }
        },
        // modal props
        {
          title: '标本轨迹',
          width: 1000,
          centered: true,
          maskClosable: true
        })
    },
  }
}
</script>
