<template>
  <div>
    <a-card :bordered="false">
      <a-space>
        <!-- <ScanCode @scan="scan" :isConfirm="isConfirm" :notConfirm="notConfirm" :no="no" /> -->
        未确认数：<a-tag color="#f50">{{ notConfirm }}</a-tag>
        已确认数：<a-tag color="#87d068">{{ isConfirm }}</a-tag>
        <a-input-search
          ref="No"
          placeholder="输入住院号或标本号"
          v-model="No"
          style="width:200px; bottom: 0;"
          enter-button
          @search="onSearch"
        />
        <a-button type="danger" @click="clearData">清空</a-button>
        <a-button v-if="isCorrect" type="primary" @click="handelCorrect">矫正</a-button>
        <!-- <a-input
          :value="LeaveTime"
          draggable="true"
          placeholder="输入离体时间"
          style="width:60px;"
          @click="inputClick"
          @keyup="e => inputChange(e)"
          @blur="e => blurChange(e, -1, 'AllLeaveTime')"
          @pressEnter="e => blurChange(e, -1, 'AllLeaveTime')"
        /> -->
        <!-- 固定时间：
        <a-input
          :value="FixedTime"
          draggable="true"
          placeholder="输入固定时间"
          style="width:60px;"
          @click="inputClick"
          @keyup="e => inputChange(e)"
          @blur="e => blurChange(e, -1, 'AllFixedTime')"
        />
        固定液：
        <a-select show-search :value="FixLiquid" style="width:150px;" @change="e => handleChange(e, -1, 'AllFixLiquid')">
          <a-select-option v-for="d in fixLiquidType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
        </a-select> -->
      </a-space>
      <div style="margin: 10px 0"></div>
      
      <a-spin tip="Loading..." :spinning="spinning">
        <a-table
          :columns="columns"
          rowKey="Id"
          :data-source="data"
          :pagination="pagination"
          @change="handleTableChange"
          class="components-table-demo-nested">
          <template slot="IsConfirm" slot-scope="text">
            <span v-if="text===true"><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">是</span></span>
            <span v-if="text==false"><span class="ant-badge-status-text" style="color:red;">否</span></span>
          </template>
        <!-- <template
          v-for="col in ['FixedTime', 'FixLiquid']"
          :slot="col"
          slot-scope="text, index"
        >
          <div :key="col" v-if="col==='FixedTime'">
            <a-input
              :value="text"
              style="width: 150px"
              placeholder="选择固定时间"
              draggable="true"
              @focus="e => focusEvent(e, 'FixedTime')"
              @keyup="e => onChange(e, index, 'FixedTime')"
              @blur="e => handleChange(e, index, 'FixedTime')"
              @pressEnter="e => handleChange(e, index, 'FixedTime')"
            />
          </div>
          <div :key="col" v-if="col==='FixLiquid'">
            <a-select
              show-search
              placeholder="选择固定液"
              :value="text"
              style="width:150px;"
              @change="e => fixLiquidChange(e, index)"
            >
              <a-select-option v-for="d in fixLiquidType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
            </a-select>
          </div>
        </template> -->
        </a-table>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import { correctSpecimenWorkflow, scanConfirmSpecimens, getAppSpecimensById, updateLeaveTime, updateFixedTime, getAppSpecimensByOneId, updateSpecimenFixLiquid, batchUpdateSpecimenFixedTime, batchUpdateSpecimenFixLiquid } from '@/api/submission/collect'
import Edit from './Edit'
import moment from 'moment'
import { Scaner } from '@/utils/scan'
import enums from '@/store/enum/enum'
import { StringToTime, CheckField, TimeToString,LoadNowTime, PromptBox } from '@/utils/util'
import { getDictByName } from '@/api/system/dictionary'
import ScanCode from '@/components/ScanCode/ScanCode'
const data = [] // 一级列表数据
const columns = [
  { title: '是否已采集', dataIndex: 'IsConfirm', scopedSlots: { customRender: 'IsConfirm' } },
  { title: '标本编号', dataIndex: 'Id' },
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '患者姓名', dataIndex: 'PatientName' },
  { title: '年龄', dataIndex: 'Age' },
  { title: '病人ID', dataIndex: 'HisNo', key: 'HisNo' },
  { title: '住院号', dataIndex: 'AdmissionNum' },
  { title: '标本名称', dataIndex: 'SpecimenName' },
  { title: '离体时间', dataIndex: 'LeaveTime'},
  { title: '固定时间', dataIndex: 'FixedTime'},// , scopedSlots: { customRender: 'FixedTime' }
  { title: '固定液', dataIndex: 'FixLiquid'},// , scopedSlots: { customRender: 'FixLiquid' } 
  { title: '所属部位', dataIndex: 'PartName' }
]
const timer = {
  hour: false,
  minute: false,
  second: false,
  total: 0,
  allHour: false,
  allMinute: false,
  allSecond: false,
  allTotal: 0,
  minuteVal: '',
  allMinuteVal: ''
}
export default {
  components: {
    Edit,
    ScanCode
  },
  data () {
    return {
      spinning: false,
      isCorrect: false,
      timer,
      data,
      columns,
      pageSize: 10,
      current: 1,
      total: 0,
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      fixLiquidType: enums.FixLiquid,
      FixLiquid: '',
      AllLeaveTime: '',
      editable: true,
      AllFixedTime: '',
      LeaveTime: '',
      FixedTime: '',
      isConfirm: 0,
      notConfirm: 0,
      No: ''
    }
  },
  created: function () {
    this.data = []
    Scaner(this.scanCallBack)
    this.getDictByName()
    const nowdate = moment(Date.now()).format('yyyy-MM-DD')
    this.LeaveTime = LoadNowTime('HH:mm')
    this.FixedTime = LoadNowTime('HH:mm')
    this.AllLeaveTime = `${nowdate} 00:00:00`
    this.AllFixedTime = `${nowdate} 00:00:00`
  },
  computed: {
  },
  methods: {
    handelCorrect() {
      if (this.No === '') {
        PromptBox('请输入矫正标本号', 'warning')
        return 
      }
      this.spinning = true
      const code = this.No.replace('-', '')
      correctSpecimenWorkflow({ Id: code }).then(res => {
        if (res.ResultType == '1' && res.HttpStatusCode == '200') {
          PromptBox('矫正成功', 'success')
        } else {
          PromptBox('矫正失败', 'warning')
        }
        this.spinning = false
      })
    },
    inputClick (e) {
      const input = e.target
      if (input.selectionStart <= 2) {
        input.selectionStart = 0
        input.selectionEnd = 2
      } else if (input.selectionStart >= 3 && input.selectionStart <= 5) {
        input.selectionStart = 3
        input.selectionEnd = 5
      }
    },
    clearData () {
      this.data = []
      this.refreshScanTotal()
    },
    inputChange (e) {
      this.timer.total += 1
      if (this.timer.minute === false && this.timer.total > 1) {
          this.timer.minute = true
          this.setInputSelection(e.target, 3, 5) // 分钟 将被选中
      }
    },
    blurChange (value, obj, column) {
      this.timer.total = 0
      this.timer.minute = false
      const _time = LoadNowTime(`yyyy-MM-DD ${value.target.value}:00`)
      if (column === 'FixedTime' && this.record.PathologyCode !== 'Frozen') {
        if (CheckField(obj.LeaveTime) && CheckField(_time) && StringToTime(_time) < StringToTime(obj.LeaveTime)) {
          PromptBox('固定时间不能小于离体时间', 'warning')
          return
        }
      }
      const Ids = []
      this.data.forEach(item => {
        Ids.push(item.Id)
      })
      if (column === 'AllFixedTime') {
        batchUpdateSpecimenFixedTime({ 'Ids': Ids, 'FixedTime': _time }).then(res => {
          if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
            PromptBox('操作成功', 'success')
            this.data.forEach(item => {
              this.updateField(item.Id, 'FixedTime', _time)
            })
          } else {
            PromptBox('操作失败', 'error')
            return
          }
        })
      }
      if (column === 'AllFixLiquid') {
        batchUpdateSpecimenFixLiquid({ 'Ids': Ids, 'FixLiquid': value }).then(res => {
          if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
            PromptBox('操作成功', 'success')
            this.FixLiquid = value
            this.data.forEach(item => {
              this.updateField(item.Id, 'FixLiquid', value)
            })
          } else {
            PromptBox('操作失败', 'error')
            return
          }
        })
      }
    },
    focusEvent (e, type) {
      timer.hour = false
      timer.minute = false
      timer.second = false
      timer.minuteValue = ''
      this.setInputSelection(e.target, 11, 13) // 小时 将被选中
      timer.total = 0
    },
    refreshScanTotal () {
      this.no = ''
      let _isScanTotal = 0
      let _isNotScanTotal = 0
      this.data.forEach((item, index) => {
          if (item.IsConfirm) {
            _isScanTotal += 1
          } else {
            _isNotScanTotal += 1
          }
      })
      this.isConfirm = _isScanTotal
      this.notConfirm = _isNotScanTotal
      const _result = this.data.filter(w => w.FixedTime.toString().indexOf('00:00:00'))
      if (this.notConfirm === 0 && _result.length < 0) {
        PromptBox('所有标本都完成确认', 'success')
      }
    },
    setInputSelection (input, startPos, endPos) {
      if (typeof input.selectionStart !== 'undefined') {
          input.selectionStart = startPos
          input.selectionEnd = endPos
      } else if (document.selection && document.selection.createRange) {
          // IE branch
          input.select()
          var range = document.selection.createRange()
          range.collapse(true)
          range.moveEnd('character', endPos)
          range.moveStart('character', startPos)
          range.select()
      }
    },
    moment,
    getDictByName () {
      const $this = this
      getDictByName('默认固定液').then(res => {
        if (res.data && res.data.length > 0) {
          $this.FixLiquid = res.data
        }
      })
      getDictByName('矫正开关').then(res => {
        if (res.data && res.data.length > 0) {
          $this.isCorrect = res.data === '1' ? true : false
        }
      })
    },
    fixLiquidChange (text, index) {
      this.data.forEach(item => {
        if (item.Id === index.Id) {
          item.FixLiquid = text
        }
      })
      // #region 使窗体获取扫码焦点
      let dom = document.getElementsByClassName('collectDialog')
      dom = dom[0].children[1].getElementsByClassName('ant-modal-body')
      dom[0].setAttribute('tabindex', -1)
      dom[0].focus()
      // #endregion
    },
    loadTime (text) {
      if (text === null || text === '' || text === undefined) {
        return null
      }
      const time = moment(text)
      return time
    },
    onChange (e, obj, column) {
      this.timer.total += 1
      if (this.timer.minute === false && this.timer.total >= 2) {
          this.timer.minute = true
          this.setInputSelection(e.target, 14, 16) // 分钟 将被选中
      } else if (this.timer.second === false && this.timer.total >= 4) {
          this.timer.second = true
          this.setInputSelection(e.target, 17, 19) // 秒钟 将被选中
      }
    },
    handleChange (value, obj, column) {
      if (column === 'FixedTime') {
        if (CheckField(obj.LeaveTime) && CheckField(value.target.value) && StringToTime(obj.LeaveTime) > value.target.value) {
          PromptBox('固定时间不能小于离体时间', 'warning')
          return
        }
        this.updateField(obj.Id, column, value.target.value)
        this.updateTime('Update' + column, obj, 'hand')
      }
      if (column === 'AllFixedTime') {
        this.data.forEach(item => {
          item.FixedTime = value.target.value
          this.updateTime('Update' + 'FixedTime', item, 'hand')
        })
      }
      if (column === 'AllFixLiquid') {
        this.FixLiquid = value
        this.data.forEach(item => {
          item.FixLiquid = value
          updateSpecimenFixLiquid({ 'ObjectDTO': item }).then(res => {
            const a = 1
          })
        })
      }
    },
    onOk () {},
    scanCallBack (code) {
      this.No = ''
      this.scan(code)
    },
    onSearch () {
      this.scan(this.No)
    },
    getDataItem (id) {
      let result = {}
      this.data.forEach(item => {
        if (item.Id === id) {
          result = item
        }
      })
      return result
    },
    updateField (id, fileName, fileValue) {
      this.data.forEach(item => {
        if (item.Id === id) {
          item[fileName] = fileValue
        }
      })
    },
    inArrayExt (id) {
      let ext = false
      this.data.forEach(item => {
        if (id === item.Id) {
          ext = true
        }
      })
      return ext
    },
    loadData (id) {
      const $this = this
      getAppSpecimensByOneId(id, '采集').then(res => {
        this.spinning = false
        if (res.HttpStatusCode === 200 && res.ResultType === 0) {
          PromptBox(res.Message, 'warning')
          return
        }
        if (res.HttpStatusCode === 200 && res.ResultType === 1 && res.Data.length === 0) {
          PromptBox(res.Message, 'warning')
          return
        }
        res.data = res.Data
        if (res.data && res.data.length) {
          const obj = res.data.filter(w => w.AllowOperating === false)
          if (obj.length > 0) {
            let warnStr = ''
            obj.forEach(item => {
              warnStr += `编号为【${item.Id}】的标本未进行【${item.LastSpecimenStatus}】\n`
            })
            PromptBox(warnStr, 'warning')
            return
          }
          res.data.forEach((item, index) => {
            if (!this.inArrayExt(item.Id)) {
              if (item.LeaveTime === null || item.LeaveTime === undefined) {
                const nowdate = moment(Date.now()).format('yyyy-MM-DD')
                item.LeaveTime = `${nowdate} 00:00:00`
              } else {
                item.LeaveTime = moment(item.LeaveTime).format('yyyy-MM-DD HH:mm:ss')
              }
              if (item.FixedTime === null || item.FixedTime === undefined) {
                const nowdate = moment(Date.now()).format('yyyy-MM-DD')
                item.FixedTime = `${nowdate} 00:00:00`
              } else {
                item.FixedTime = moment(item.FixedTime).format('yyyy-MM-DD HH:mm:ss')
              }
              if ($this.FixLiquid === '') { // 默认固定液
                item.FixLiquid = $this.FixLiquid
              }
              item.key = item.Id
              this.data.push(item)
            }
          })
          this.refreshScanTotal()
          // 对读取的第一个码进行采集状态更新
          if (res.HttpStatusCode === 200) {
            // 后续标本采集状态更新
            this.scanCollect(id, function () {
              $this.refreshScanTotal()
            })
          }
        }
      })
    },
    updateTime (methodName, item, type) {
      if (item.FixedTime.toString().indexOf('00:00:00') >= 0) {
        item.FixedTime = null
      }
      if (item.LeaveTime.toString().indexOf('00:00:00') >= 0) {
        item.LeaveTime = null
      }
      if (methodName === 'UpdateFixedTime') {
        if (CheckField(item.LeaveTime) && CheckField(item.FixedTime) && StringToTime(item.LeaveTime) > StringToTime(item.FixedTime)) {
            PromptBox('固定时间不能小于离体时间', 'warning')
            return
          } else if (item.FixedTime !== '' && (item.FixLiquid === null || typeof (item.FixLiquid) === 'undefined')) {
            PromptBox('固定液不能为空', 'warning')
            this.updateField(item.Id, 'FixedTime', '')
            return
          } else if (item.FixedTime === '' && type === 'hand') {
              // 手动固定清空
              this.updateField(item.Id, 'FixedTime', '')
          } else {
              // 固定
              this.updateField(item.Id, 'FixedTime', item.FixedTime)
          }
      } else if (methodName === 'UpdateLeaveTime') {
          // 离体
          this.updateField(item.Id, 'LeaveTime', item.LeaveTime)
      }
      switch (methodName) {
        case 'UpdateFixedTime':
          updateFixedTime({ 'ObjectDTO': item }).then(res => {
            if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
              PromptBox('操作成功', 'success')
              this.refreshScanTotal()
            } else {
              PromptBox('操作失败', 'error')
            }
          })
          break
        case 'UpdateLeaveTime':
          updateLeaveTime({ 'ObjectDTO': item }).then(res => {
            this.data.forEach((item, index) => {
              if (item.FixedTime === null) {
                this.data[index].FixedTime = moment(Date.now()).format('yyyy-MM-DD 00:00:00')
              }
            })
          })
          break
      }
    },
    scanCollect (id, callback) {
      const $this = this
      let isScanFinish = true
      const scanObj = this.data.filter(f => f.Id === id && f.IsConfirm === true)
      this.data.forEach((item, index) => {
        if (item.IsConfirm === false) {
          isScanFinish = false
        }
      })
      if (isScanFinish) {
          PromptBox('该申请单已经扫描完毕', 'warning')
          return
      }
      if (scanObj.length > 0) {
        PromptBox('该标本已扫描采集', 'warning')
        return
      }
      scanConfirmSpecimens({ 'Id': id }).then(res => {
        if (res.HttpStatusCode === 200) {
          console.log(res)
          $this.data.filter(f => f.Id === id)[0].IsConfirm = true
          callback()
        }
      })
    },
    isWristCode (code) {
      getAppSpecimensById(code).then(res => {
        if (res.HttpStatusCode === 200 && res.data.length === 0) {
          PromptBox('该标本还不能进行采集', 'warning')
          return
        }
        if (res.data && res.data.length) {
          res.data.forEach((item, index) => {
            if (!this.inArrayExt(item.Id)) {
              if (item.LeaveTime === null || item.LeaveTime === undefined) {
                const nowdate = moment(Date.now()).format('yyyy-MM-DD')
                item.LeaveTime = `${nowdate} 00:00:00`
              } else {
                item.LeaveTime = moment(item.LeaveTime).format('yyyy-MM-DD HH:mm:ss')
              }
              if (item.FixedTime === null || item.FixedTime === undefined) {
                const nowdate = moment(Date.now()).format('yyyy-MM-DD')
                item.FixedTime = `${nowdate} 00:00:00`
              } else {
                item.FixedTime = moment(item.FixedTime).format('yyyy-MM-DD HH:mm:ss')
              }
              if (this.FixLiquid === '') { // 默认固定液
                item.FixLiquid = this.FixLiquid
              }
              item.key = item.Id
              this.data.push(item)
            }
          })
          this.refreshScanTotal()
        }
      })
    },
    scan (code) {
      this.No = ''
      if (code.indexOf('-') < 0) {
        this.isWristCode(code)
        return
      }
      // 判断是否存在未确认的标本
      const $this = this
      if (code.substring(0, 1) !== '-') return
      // 判断无效码
      const id = Number(code.substring(1))
      if (id < 1) return
      let item = this.data.filter(w => w.Id === Number(code.substring(1)))
      item = item.length > 0 ? item[0] : null
      const isConfirm = item === null ? false : item.IsConfirm
      // 首次有效扫码读取标本下的申请单的所有标本信息
      if (!this.inArrayExt(id)) {
        this.spinning = true
          this.loadData(id)
      } else if (isConfirm === false) {
        // 后续标本采集状态更新
        this.scanCollect(id, function () {
          $this.updateField(id, 'IsConfirm', true)
          $this.updateField(id, 'FixLiquid', $this.FixLiquid)
          $this.refreshScanTotal()
        })
      } else if (TimeToString(item.FixedTime).toString().indexOf('00:00:00') >= 0 || TimeToString(item.LeaveTime).toString().indexOf('00:00:00') >= 0) {
        // 判断是否已经采集，才进行离体固定扫码
        if (item) {
          if (TimeToString(item.LeaveTime).toString().indexOf('00:00:00') >= 0) { // 离体时间
            item.LeaveTime = moment(Date.now()).format('yyy-MM-DD HH:mm:00')
            this.updateTime('UpdateLeaveTime', item, 'scan')
          } else if (TimeToString(item.FixedTime).toString().indexOf('00:00:00') >= 0) { // 固定时间
            item.FixedTime = moment(Date.now()).format('yyy-MM-DD HH:mm:00')
            this.updateTime('UpdateFixedTime', item, 'scan')
          }
        }
      } else {
        this.scanCollect(id, function () {
          $this.refreshScanTotal()
        })
      }
    },
    reLoad () {
      this.Status = 'n'
      this.load(1, 10, 'n')
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.load(pager.current, pager.pageSize)
    },
    onChangeBegin () {
    },
    onChangeEnd () {
    }
  }
}
</script>
