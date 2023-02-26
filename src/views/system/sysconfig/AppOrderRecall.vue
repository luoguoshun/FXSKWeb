<template>
  <div>
    <a-row>
      <a-col :span="7">
      </a-col>
      <a-col :span="10">
        <a-input-search placeholder="请输入申请单号" enter-button @search="onSearch" />
      </a-col>
      <a-col :span="7">
      </a-col>
    </a-row>
    <a-row style="width:90%; margin:0 auto;">
      <a-result
        :status="result.status"
        :title="result.title"
        :sub-title="result.subTitle"
      >
        <div class="desc">
        </div>
      </a-result>
    </a-row>
  </div>
</template>

<script>
import { recallAppOrder } from '@/api/system/strategy'
export default {
  data () {
    return {
      result: {
        status: 'success',
        title: '回滚成功',
        subTitle: '该申请单已经回滚到未打包状态，请重新打包！'
      }
    }
  },
  methods: {
    onSearch (value) {
      recallAppOrder({ AppNo: value }).then(res => {
        console.log(res)
        if (res.HttpStatusCode === 200 && res.ResultType === 1) {
          this.result = {
            status: 'success',
            title: '回滚成功',
            subTitle: `申请单【${value}】已经回滚到未打包状态，请重新打包！`
          }
        } else {
          this.result = {
            status: 'error',
            title: '回滚失败',
            subTitle: res.Message
          }
        }
      })
    }
  }
}
</script>
