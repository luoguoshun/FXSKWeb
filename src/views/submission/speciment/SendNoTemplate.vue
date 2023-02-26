<template>
  <div>
    <a-descriptions title="申请单">
      <a-list size="small" bordered>
        <a-list-item v-for="i in this.record.apps" :key="i.Id">
          <a @click="show(i)">{{ i.AppNo }}({{ i.PatientName }})</a>
        </a-list-item>
        <div slot="header">
          标本名称
        </div>
      </a-list>
    </a-descriptions>
    <a-descriptions title="标本列表">
    </a-descriptions>
    <div 
      v-infinite-scroll="handleInfiniteOnLoad"
      class="demo-infinite-container"
      :infinite-scroll-disabled="busy"
      :infinite-scroll-distance="10">
      <a-list :data-source="this.record.specimens">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta>
            <a slot="title" @click="trace(item)">{{ item.SpecimenName }}</a>
          </a-list-item-meta>
          <!-- <div>Content</div> -->
        </a-list-item>
        <div v-if="loading && !busy" class="demo-loading-container">
          <a-spin />
        </div>
      </a-list>
    </div>
    <a-descriptions title="打包运送">
      <a-descriptions-item label="打包号">
        {{ this.record.sendPackages[0].SendNo }}
      </a-descriptions-item>
      <a-descriptions-item label="打包编号">
        {{ this.record.sendPackages[0].Id }}
      </a-descriptions-item>
      <a-descriptions-item label="打包时间">
        {{ this.record.sendPackages[0].CreatedTime }}
      </a-descriptions-item>
      <a-descriptions-item label="打包人">
        {{ this.record.sendPackages[0].Submitter }}
      </a-descriptions-item>
      <a-descriptions-item label="运送时间">
        {{ this.record.sendPackages[0].ShippingStartTime }}
      </a-descriptions-item>
      <a-descriptions-item label="发送人">
        {{ this.record.sendPackages[0].Shipper }}
      </a-descriptions-item>
      <a-descriptions-item label="接收时间">
        {{ this.record.sendPackages[0].ShippingEndTime }}
      </a-descriptions-item>
    </a-descriptions>
    <a-modal centered="true" v-model="visible" title="申请单详情" :width="800">
      <a-descriptions title="">
        <a-descriptions-item label="申请单号">
          {{ app.AppNo }}
        </a-descriptions-item>
        <a-descriptions-item label="申请单编号">
          {{ app.Id }}
        </a-descriptions-item>
        <a-descriptions-item label="患者名称">
          {{ app.PatientName }}
        </a-descriptions-item>
        <a-descriptions-item label="开单时间">
          {{ app.ReqDateTime }}
        </a-descriptions-item>
        <a-descriptions-item label="年龄">
          {{ app.Age }}{{ app.AgeType === '0' ? '岁' : (app.AgeType === '1' ? '月' : '日') }}
        </a-descriptions-item>
        <a-descriptions-item label="性别">
          {{ app.Sex === 1 ? '女' : '男' }}
        </a-descriptions-item>
        <a-descriptions-item label="门诊号">
          {{ app.OutpatientNum }}
        </a-descriptions-item>
        <a-descriptions-item label="住院号">
          {{ app.AdmissionNum }}
        </a-descriptions-item>
        <a-descriptions-item label="手腕码">
          {{ app.InpatientWristCode }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import reqwest from 'reqwest'
import Trace from './Trace'
import { CheckField } from '@/utils/util'
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
      visible: false,
      loading: false,
      busy: false,
      app: {}
    }
  },
  created: function () {
    this.record = {}
  },
  computed: {
  },
  methods: {
    initializeData (e, field) {
      if (CheckField(e) && e.length > 0) {
        return e[field]
      }
    },
    fetchData (callback) {
      reqwest({
        url: fakeDataUrl,
        type: 'json',
        method: 'get',
        contentType: 'application/json',
        success: res => {
          callback(res)
        }
      })
    },
    handleInfiniteOnLoad () {
      const data = this.record.specimens
      this.loading = true
      if (data.length > 14) {
        this.busy = true
        this.loading = false
        return
      }
      this.fetchData(res => {
        this.record.specimens = data.concat(res.results)
        this.loading = false
      })
    },
    show (e) {
      this.app =  e
      this.visible = true
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
    }
  }
}
</script>
<style>
.demo-infinite-container {
  border-radius: 4px;
  overflow: auto;
  height: 300px;
}
.demo-loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
</style>
