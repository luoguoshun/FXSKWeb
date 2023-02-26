<template>
  <a-timeline>
    <a-timeline-item v-for="d in traceData" :color="d.Color" :key="d.Id">【{{ d.NodeType }}】</br> 操作时间：{{ d.OperatingTime }} </br> 操作人：{{ checkOprator(d) }}</a-timeline-item>
  </a-timeline>
</template>

<script>
import { getSpecimenTrace } from '@/api/specimentrace/specimentrace'
import { getSpecimenStatus } from '@/api/submission/app'
import moment from 'moment'
import { CheckField } from '@/utils/util'
export default {
  name: 'Trace',
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      traceData: [],
      nodeTypeDatas: []
    }
  },
  created: function () {
    this.getSpecimenStatus(() => {
      this.load()
    })
  },
  computed: {
  },
  methods: {
    checkOprator (val) {
      if (CheckField(val.UserName)) {
        return val.UserName
      }
      return val.Operator
    },
    getSpecimenStatus (callback) {
      getSpecimenStatus().then((res) => {
        Object.keys(res.data).forEach(element => {
          this.nodeTypeDatas.push({ value: res.data[element], text: element })
        })
        callback()
      })
    },
    load () {
      const $this = this
      getSpecimenTrace(this.record.Id).then((res) => {
        res.data.forEach((item, i) => {
          $this.nodeTypeDatas.forEach((item2, j) => {
           if (item.NodeType === 'Back' && item.OperatingTime === null) {
              res.data[i] = null
            } else {
              if (item.NodeType === item2.value) {
                res.data[i].NodeType = item2.text
              }
              if (res.data[i].OperatingTime !== null) {
                res.data[i].OperatingTime = moment(res.data[i].OperatingTime).format('YYYY-MM-DD HH:mm:ss')
              } else {
                res.data[i].Color = 'gray'
              }
            }
          })
        })
        $this.traceData = res.data
      })
    }
  }
}
</script>
