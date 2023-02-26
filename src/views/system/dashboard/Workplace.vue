<template>
  <page-header-wrapper>
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="currentUser.avatar"/>
        </div>
        <div class="content">
          <div class="content-title">
            {{ timeFix }}，{{ user.UserName }}<span class="welcome-text">{{ user.UserType }}</span>
          </div>
          <div>{{ user.UserType }}</div>
        </div>
      </div>
    </template>
    <template v-slot:extraContent>
      <div class="extra-content">
        <div class="stat-item">
          <a-statistic title="待处理任务数" :value="0" />
        </div>
      </div>
    </template>
    <div>
      <!-- <a-row :gutter="24">
        <a-col :xl="12" :lg="12" :md="12" :sm="12" :xs="12">
          <a-card title="任务追踪" id="workdata" style="height:300px;">
            <a slot="extra" href="javascript:"><a-icon type="reload" @click="loadData()" /></a>
            <a slot="extra" href="javascript:" style="margin-left:10px;" @click="searchAllWork()">全部</a>
            <a-table rowKey="Id" :columns="columns" :pagination="false" :data-source="followWorkData" size="small">
              <template slot="PathologyCode" slot-scope="text">
                <span v-if="text==d.value" v-for="d in pathologyType" :key="d.value" :value="d.value">{{ d.text }}</span>
              </template>
              <template slot="NodeType" slot-scope="text">
                <span v-if="text==d.value" v-for="d in nodeTypeDatas" :key="d.value" :value="d.value">{{ d.text }}</span>
              </template>
              <template slot="RelativeTime" slot-scope="text">
                <span style="font-weight: bold; color:red;">{{ text }}</span>
              </template>
              <span slot="operation" slot-scope="text, record">
                <template>
                  <a @click="trace(record)">追踪</a>
                  </a-popconfirm>
                </template>
              </span>
            </a-table>
          </a-card>
        </a-col>
        <a-col :xl="12" :lg="12" :md="12" :sm="12" :xs="12">
          <a-card title="已下发报告(未读)" id="workdata" style="height:300px;">
            <a slot="extra" href="javascript:"><a-icon type="reload" @click="loadReportData()" /></a>
            <a slot="extra" href="javascript:" style="margin-left:10px;" @click="searchAllReport()">全部</a>
            <a-table rowKey="Id" :columns="reportColumns" :pagination="false" :data-source="reportData" size="small">
              <template slot="PathologyCode" slot-scope="text">
                <span v-if="text==d.value" v-for="d in pathologyType" :key="d.value" :value="d.value">{{ d.text }}</span>
              </template>
              <template slot="NodeType" slot-scope="text">
                <span v-if="text==d.value" v-for="d in nodeTypeDatas" :key="d.value" :value="d.value">{{ d.text }}</span>
              </template>
              <template slot="RelativeTime" slot-scope="text">
                <span style="font-weight: bold; color:red;">{{ text }}</span>
              </template>
              <span slot="operation" slot-scope="text, record">
                <template>
                  <a @click="readReport(record)">查看报告</a>
                </template>
              </span>
            </a-table>
          </a-card>
        </a-col>
      </a-row> -->
      <a-row :gutter="24">
        <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card title="申请单/标本数量" id="datawarning" style="margin-top:10px;">
            <div id="main" style="width:100%;height:300px;"></div>
          </a-card>
        </a-col>
      </a-row>
      <!-- <a-row :gutter="24">
        <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card title="数据异常告警" id="datawarning" style="margin-top:10px;">
            <a slot="extra" href="#"><a-icon type="reload" /></a>
            <a slot="extra" href="#" style="margin-left:10px;">全部</a>
            <a-list :data-source="warningData">
              <a-list-item slot="renderItem" slot-scope="item">
                <a-list-item-meta :description="item.data">
                  <a slot="title" href="https://www.antdv.com/">
                    <span v-if="item.status==0"><span class="ant-badge-status-dot ant-badge-status-error"></span><span class="ant-badge-status-text"></span></span>
                    <span v-if="item.status==1"><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text"></span></span>
                    <span v-if="item.status==2"><span class="ant-badge-status-dot ant-badge-status-warning"></span><span class="ant-badge-status-text"></span></span>
                    {{ item.title }}
                  </a>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
      </a-row> -->
      <a-modal v-model="visible" title="病理报告" wrapClassName="reportModal">
        <iframe
          class="reportContent"
          src=""
          style="width:100%;height:100%;"
          frameborder="no"
          border="0"
          marginwidth="0"
          marginheight="0"
          scrolling="no"
          allowtransparency="yes"
        />
      </a-modal>
    </div>
  </page-header-wrapper>
</template>

<script>
import { timeFix, StringToTime } from '@/utils/util'
import { mapState } from 'vuex'
import moment from 'moment'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { Radar } from '@/components'
import manhand from '@/assets/img/hand/hand_man.png'
import womanhand from '@/assets/img/hand/hand_woman.png'
import { getSpecimenFollowData } from '@/api/system/workplace'
import enums from '@/store/enum/enum'
import Trace from '@/views/submission/speciment/Trace'
import { getSpecimenStatus } from '@/api/submission/app'
import { getReportMassage, getReportInfo } from '@/api/system/message'
import { getOrderAndSpecimenTotal } from '@/api/statistic/statistic'
import { getSubmissionTypes } from '@/api/system/workflow'
import * as echarts from 'echarts'
const warningData = [
]
const columns = [
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '患者姓名', dataIndex: 'PatientName' },
  { title: '送检类型', dataIndex: 'PathologyCode', scopedSlots: { customRender: 'PathologyCode' } },
  { title: '标本名称', dataIndex: 'SpecimenName' },
  { title: '停留环节', dataIndex: 'NodeType', scopedSlots: { customRender: 'NodeType' } },
  { title: '任务用时', dataIndex: 'RelativeTime', scopedSlots: { customRender: 'RelativeTime' } },
  { title: '操作时间', dataIndex: 'OperatingTime', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '操作', dataIndex: 'operation', scopedSlots: { customRender: 'operation' } }
]
const reportColumns = [
  { title: '申请单号', dataIndex: 'HisSheetId', scopedSlots: { customRender: 'HisSheetId' } },
  { title: '原申请单号', dataIndex: 'OllAppOrder' },
  { title: '病理号', dataIndex: 'MrCode' },
  { title: '病人姓名', dataIndex: 'PatientName' },
  { title: '病人年龄', dataIndex: 'Age' },
  { title: '病理类型', dataIndex: 'PathologyClass' },
  { title: '发布时间', dataIndex: 'TimeIssued', customRender: (val) => { return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '' } },
  { title: '是否阅读', key: 'ReadingTime', scopedSlots: { customRender: 'ReadingTime' } },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
]
export default {
  name: 'Workplace',
  components: {
    PageHeaderWrapper,
    Radar,
    Trace
  },
  data () {
    return {
      visible: false,
      timeFix: timeFix(),
      avatar: '',
      user: {},
      warningData,
      columns,
      reportColumns,
      followWorkData: [],
      pathologyType: [],
      loading: true,
      radarLoading: true,
      activities: [],
      teams: [],
      projects: [],
      axis1Opts: {
        dataKey: 'item',
        line: null,
        tickLine: null,
        grid: {
          lineStyle: {
            lineDash: null
          },
          hideFirstLine: false
        }
      },
      nodeTypeDatas: [],
      radarData: [],
      reportData: []
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.nickname,
      welcome: (state) => state.user.welcome
    }),
    currentUser () {
      let handImg = manhand
      switch (this.user.Sex) {
        case 0:
          handImg = manhand
          break
        case 1:
          handImg = womanhand
          break
      }
      return {
        name: 'Serati Ma',
        avatar: handImg
      }
    },
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  beforeCreate () {
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
    // getSubmissionTypes().then(res => {
    //   res.forEach(element => {
    //     this.pathologyType.push({
    //       value: element.Content,
    //       text: element.Name
    //     })
    //   })
    // })
    this.loadData()
    // this.getSpecimenStatus()
    // this.loadReportData()
  },
  mounted () {
    this.getProjects()
    this.getActivity()
    this.getTeams()
    this.initRadar()
    if (this.user.UserType !== '系统管理员') {
      document.getElementById('datawarning').style.display = 'none'
    }
  },
  methods: {
    loadEcharts (datas) {
      const Date = this.getDaysInMonth(moment().format('YYYY'), moment().format('MM'))
      const OrderData = []
      const SpecimenData = []
      Date.forEach(item => {
        let exist = false
        datas.order.filter(f => {
          if (StringToTime(f.DateTime, 'yyyy-MM-DD') === StringToTime(item, 'yyyy-MM-DD')) {
            OrderData.push(f.Total)
            exist = true
          }
        })
        if (exist === false) {
          OrderData.push(0)
        }
      })
      Date.forEach(item => {
        let exist = false
        datas.specimen.filter(f => {
          if (StringToTime(f.DateTime, 'yyyy-MM-DD') === StringToTime(item, 'yyyy-MM-DD')) {
            SpecimenData.push(f.Total)
            exist = true
          }
        })
        if (exist === false) {
          SpecimenData.push(0)
        }
      })
      var myChart = echarts.init(document.getElementById('main'))
      const option = {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['申请单', '标本']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: Date
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '申请单',
                type: 'line',
                stack: '总量',
                data: OrderData
            },
            {
                name: '标本',
                type: 'line',
                stack: '总量',
                data: SpecimenData
            }
        ]
      }
      option && myChart.setOption(option)
    },
    getDaysInMonth (year, month) {
      const daysOfMonth = []
      month = parseInt(month, 10)
      const lastDayOfMonth = new Date(year, month, 0).getDate()
      for (let i = 1; i <= lastDayOfMonth; i++) {
        if (i < 10) {
          daysOfMonth.push(year + '-' + month + '-' + '0' + i)
        } else {
          daysOfMonth.push(year + '-' + month + '-' + i)
        }
      }
      return daysOfMonth
    },
    getSpecimenStatus () {
      getSpecimenStatus().then((res) => {
          this.nodeTypeDatas.push({ value: '', text: '全部' })
        Object.keys(res.data).forEach(element => {
          if (element === '退回') {
            this.nodeTypeDatas.push({ value: res.data[element], text: element, color: 'red' })
          } else {
            this.nodeTypeDatas.push({ value: res.data[element], text: element, color: '#000000a6' })
          }
        })
      })
    },
    searchAllWork () {
      this.$router.push({ path: '/submission/specimenfollow' })
    },
    searchAllReport () {
      this.$router.push({ path: '/submission/message' })
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
    loadData () {
      // this.followWorkData = []
      // getSpecimenFollowData({ 'current': 1, 'pageSize': 10 }).then(res => {
      //   if (res && res.PagerData) {
      //     res.PagerData.forEach((element, index) => {
      //       if (index < 5) {
      //         element.RelativeTime = moment(element.OperatingTime).startOf('minute').fromNow()
      //         this.followWorkData.push(element)
      //       }
      //     })
      //   }
      // })
      getOrderAndSpecimenTotal().then(res => {
        this.loadEcharts(res.data)
      })
    },
    loadReportData () {
      const dto = { 'ObjectDTO': null, 'PageIndex': 1, 'PageSize': 5 }
      getReportMassage(dto).then(res => {
        if (res && res.data) {
          const _mainData = []
          res.data.forEach((item, index) => {
            item.key = index + 1
            _mainData.push(item)
          })
          this.reportData = _mainData
        } else {
          this.$message.warning(res.Message, 1)
        }
      })
    },
    readReport (obj) {
      // this.visible = true
      getReportInfo(obj.HisSheetId).then(res => {
        window.open(res)
      })
    },
    raw (literals, ...substitutions) {
      let result = ''
      for (let i = 0; i < substitutions.length; i++) {
        result += literals.raw[i]
        result += substitutions.raw[i]
      }
      result += literals.raw[literals.length - 1]
      return result
    },
    passthru (literals, ...substitutions) {
      let result = ''
      for (let i = 0; i < substitutions.length; i++) {
        result += literals[i]
        result += substitutions[i]
      }
      result += literals[literals.length - 1]
      return result
    },
    getProjects () {
      // this.$http.get('/list/search/projects')
      //   .then(res => {
      //     this.projects = res.result && res.result.data
      //     this.loading = false
      //   })
    },
    getActivity () {
      // this.$http.get('/workplace/activity')
      //   .then(res => {
      //     this.activities = res.result
      //   })
    },
    getTeams () {
      // this.$http.get('/workplace/teams')
      //   .then(res => {
      //     this.teams = res.result
      //   })
    },
    initRadar () {
      this.radarLoading = true
    }
  }
}
</script>
<style>
  #workdata .ant-card-body{
    padding:0;
  }
  #workdata .ant-list-bordered{
    border:0;
  }
</style>
<style lang="less" scoped>
  @import "./Workplace.less";
  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }

    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }

    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;

      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }

      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }

    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;

      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }

      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }

</style>
