<template>
  <div ref="No">
    <a-card :bordered="false">
      <a-row>
        <a-col span="24">
          <a-space>
            <a-button type="primary" icon="check" @click="allReceive()">一键接收</a-button>
            <a-button type="primary" icon="carry-out" @click="receive()">选择接收</a-button>
            <a-button type="danger" icon="rollback" @click="doReturn()">退回</a-button>
            <a-input-search
              placeholder="输入标本号"
              v-model="code"
              style="width:200px; bottom: 0;"
              enter-button
              @search="onSearch" />
            申请单数：<a-tag color="#2db7f5">{{ appOrderTotal }}</a-tag>
            未确认数：<a-tag color="#f50">{{ notConfirm }}</a-tag>
            已确认数：<a-tag color="#87d068">{{ isConfirm }}</a-tag>
          </a-space>
        </a-col>
      </a-row>
      <div style="margin: 10px 0"></div>
      <a-table
        :columns="columns"
        rowKey="Id"
        :data-source="data"
        :pagination="pagination"
        @change="handleTableChange"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        class="components-table-demo-nested">
        <template slot="IsConfirm" slot-scope="text">
          <span v-if="text==true"><span class="ant-badge-status-dot ant-badge-status-processing"></span><span class="ant-badge-status-text">是</span></span>
          <span v-else-if="text==false"><span class="ant-badge-status-dot ant-badge-status-default"></span><span class="ant-badge-status-text">否</span></span>
        </template>
        <template slot="SendNo" slot-scope="text">
          <a style="font-weight: bold; color:#1890ff;">{{ text }}</a>
        </template>
        <template slot="LeaveTime" slot-scope="text">
          <span v-if="text === ''" style="font-weight: bold; color:red;">离体时间异常</span>
          <span v-else>{{ moment(text).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template slot="FixedTime" slot-scope="text">
          <span v-if="text === ''" style="font-weight: bold; color:red;">固定时间异常</span>
          <span v-else>{{ moment(text).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template slot="PathologyCode" slot-scope="text">
          <span v-if="text==d.value" v-for="d in pathologyType" :key="d.value" :value="d.value">{{ d.text }}</span>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model="visible" :centered="true" title="请填写退回原因" @ok="handleOk">
      <a-textarea v-model="returnReason"></a-textarea>
    </a-modal>
  </div>
</template>

<script>
import { getPackageSpecimensById, getPackageSpecimensBySpecimenId, getPackageSpecimensByAppOrderId, doReceive, doReturn } from '@/api/submission/receive'
import Edit from './Edit'
import moment from 'moment'
import enums from '@/store/enum/enum'
import { Scaner } from '@/utils/scan'
import { ObjectToJSONString, PromptBox } from '@/utils/util'
import { getSubmissionTypes } from '@/api/system/workflow'
const data = []// 一级列表数据
const columns = [
  { title: '送检号', dataIndex: 'SendNo', scopedSlots: { customRender: 'SendNo' } },
  { title: '送检类型', dataIndex: 'PathologyCode', scopedSlots: { customRender: 'PathologyCode' } },
  { title: '申请单号', dataIndex: 'AppNo' },
  { title: '标本编号', dataIndex: 'Id' },
  { title: '是否确认', dataIndex: 'IsConfirm', scopedSlots: { customRender: 'IsConfirm' } },
  { title: '运送人', dataIndex: 'Shipper' },
  { title: '标本名称', dataIndex: 'SpecimenName' },
  { title: '离体时间', dataIndex: 'LeaveTime', scopedSlots: { customRender: 'LeaveTime' } },
  { title: '固定时间', dataIndex: 'FixedTime', scopedSlots: { customRender: 'FixedTime' } },
  { title: '固定液', dataIndex: 'FixLiquid' },
  { title: '所属部位', dataIndex: 'PartName' },
  { title: '患者姓名', dataIndex: 'PatientName' }
]
export default {
  components: {
    Edit
  },
  data () {
    return {
      data,
      columns,
      selectedRowKeys: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      visible: false,
      returnReason: '',
      isConfirm: 0,
      notConfirm: 0,
      appOrderTotal: 0,
      pathologyType: [],
      code: ''
    }
  },
  created: function () {
    Scaner(this.scanCallBack)
    this.data = []
    getSubmissionTypes().then(res => {
      res.forEach(element => {
        this.pathologyType.push({
          value: element.Content,
          text: element.Name
        })
      })
    })
  },
  computed: {
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.No.focus()
    })
  },
  methods: {
    moment,
    onSearch () {
      this.scan(this.code)
    },
    scanCallBack (code) {
      this.scan(code)
    },
    loadData (id, methodName, isSPCode) {
      const $this = this
      if (methodName === 'getPackageSpecimensById') {
        getPackageSpecimensById(id).then(res => {
          if (res.data && res.data.length) {
            res.data.forEach((item, index) => {
              if (item.OperatingTime === null && !$this.inArrayExt(item.Id)) {
                if (!item.LeaveTime || item.LeaveTime === 'null') item.LeaveTime = ''
                if (!item.FixedTime || item.FixedTime === 'null') item.FixedTime = ''
                if (item.Id === id) item.IsConfirm = true
                $this.data.push(item)
              }
            })
            $this.dataListSort(id)
            $this.refreshScanTotal()
          } else {
            PromptBox('不存在或未操作前面步骤', 'warning')
          }
        })
      } else if (methodName === 'getPackageSpecimensBySpecimenId') {
        getPackageSpecimensBySpecimenId(id).then(res => {
          if (res.data && res.data.length) {
            res.data.forEach((item, index) => {
              if (item.OperatingTime === null && !$this.inArrayExt(item.Id)) {
                if (!item.LeaveTime || item.LeaveTime === 'null') item.LeaveTime = ''
                if (!item.FixedTime || item.FixedTime === 'null') item.FixedTime = ''
                if (item.Id === id) item.IsConfirm = true
                $this.data.push(item)
              }
            })
            $this.dataListSort(id)
            $this.refreshScanTotal()
          } else {
            PromptBox('标本不存在或未操作前面步骤', 'warning')
          }
        })
      } else if (methodName === 'getPackageSpecimensByAppOrderId') {
        getPackageSpecimensByAppOrderId(id).then(res => {
          if (res.HttpStatusCode === 200 && res.ResultType === 1) {
            if (res.Data.length === 0) {
              PromptBox('该申请单已经接收完成或不存在标本', 'warning')
              return
            }
            res.Data.forEach((item, index) => {
              if (item.OperatingTime === null && !$this.inArrayExt(item.Id)) {
                if (!item.LeaveTime || item.LeaveTime === 'null') item.LeaveTime = ''
                if (!item.FixedTime || item.FixedTime === 'null') item.FixedTime = ''
                item.IsConfirm = true
                $this.data.push(item)
              }
            })
            $this.dataListSort(id)
            $this.refreshScanTotal()
          } else {
            PromptBox(res.Message, 'warning')
          }
        })
      }
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
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.load()
    },
    onSelectChange (selectedRowKeys, obj) {
      this.selectedRowKeys = selectedRowKeys
    },
    receive () {
      if (this.selectedRowKeys.length === 0) {
        PromptBox('当前选择记录为空，不可确认', 'warning')
        return
      }
      const result = this.data.filter(w => this.selectedRowKeys.includes(w.Id) && w.IsConfirm === false)
      if (result && result.length > 0) {
        PromptBox('当前选择存在未确认的记录，不可提交', 'warning')
        return
      }
      const $this = this
      this.$confirm({
        title: '选择接收',
        content: '您确定要接收当前选择标本吗？',
        centered: true,
        onOk () {
          return new Promise(resolve => {
            const data = $this.data.filter(w => $this.selectedRowKeys.includes(w.Id))
            const _tempIds = []
            const _tempSendNos = []
            const _tempSpecimenIds = []
            data.forEach(item => {
              if (_tempIds.filter(w => w === item.SendId).length === 0) {
                _tempIds.push(item.SendId)
              }
              if (_tempSendNos.filter(w => w === item.SendNo).length === 0) {
                _tempSendNos.push(item.SendNo)
              }
              _tempSpecimenIds.push(item.Id)
            })
            const dto = {
              'Ids': _tempIds,
              'SendNos': _tempSendNos,
              'SpecimenIds': _tempSpecimenIds
            }
            doReceive({ 'ObjectDTO': dto }).then(res => {
              if (res.HttpStatusCode === 200 && res.ResultType === 1) {
                PromptBox(res.Message, 'success')
                const _tempData = []
                $this.data.forEach(item => {
                  if (_tempSpecimenIds.filter(w => w === item.Id).length === 0) {
                    _tempData.push(item)
                  }
                })
                $this.data = _tempData
                setTimeout(() => {
                  $this.refreshScanTotal()
                  resolve(true)
                }, 1000)
              } else {
                if (res.Message === '数据校验错误') {
                  PromptBox(res.Message, 'warning')
                  resolve(false)
                  return
                }
                PromptBox(res.Message, 'warning')
                resolve(false)
              }
            })
          })
        }
      })
    },
    allReceive () {
      if (!this.data || this.data.length === 0) {
        PromptBox('当前列表记录为空，不可确认', 'warning')
        return
      }
      const result = this.data.filter(w => w.IsConfirm === false)
      if (result && result.length > 0) {
        PromptBox('当前列表存在未确认的记录，不可提交', 'warning')
        return
      }
      const $this = this
      this.$confirm({
        title: '一键接收',
        content: '您确定要一键接收当前所有标本吗？',
        centered: true,
        onOk () {
          return new Promise(resolve => {
            const _tempIds = []
            const _tempSendNos = []
            const _tempSpecimenIds = []
            $this.data.forEach(item => {
              if (_tempIds.filter(w => w === item.SendId).length === 0) {
                _tempIds.push(item.SendId)
              }
              if (_tempSendNos.filter(w => w === item.SendNo).length === 0) {
                _tempSendNos.push(item.SendNo)
              }
              _tempSpecimenIds.push(item.Id)
            })
            const dto = {
              'Ids': _tempIds,
              'SendNos': _tempSendNos,
              'SpecimenIds': _tempSpecimenIds
            }
            doReceive({ 'ObjectDTO': dto }).then(res => {
              if (res.HttpStatusCode === 200 && res.ResultType === 1) {
                PromptBox(res.Message, 'success')
                $this.data = []
                setTimeout(() => {
                  resolve(true)
                }, 1000)
              } else {
                if (res.Message === '数据校验错误') {
                  PromptBox(ObjectToJSONString(res.Data), 'warning')
                  resolve(false)
                  return
                }
                PromptBox(res.Message, 'warning')
                resolve(false)
              }
            })
          })
        }
      })
    },
    doReturn () {
      if (!this.selectedRowKeys || this.selectedRowKeys.length === 0) {
        PromptBox('当前选择退回记录为空', 'warning')
        return
      }
      const $this = this
      this.$confirm({
        title: '退回',
        content: '您确定要退回当前记录吗？',
        centered: true,
        onOk () {
          return new Promise(resolve => {
            $this.visible = true
            resolve(true)
          })
        }
      })
    },
    handleOk () {
      const $this = this
      const data = $this.data.filter(w => $this.selectedRowKeys.includes(w.Id))
      const dto = []
      data.forEach(item => {
        dto.push({ 'SendId': item.SendId, 'SpecimenId': item.Id, 'Remark': this.returnReason })
      })
      doReturn({ 'ObjectDTO': dto }).then(res => {
        if (res.HttpStatusCode === 200 && res.ResultType === 1) {
          PromptBox(res.Message, 'success')
          $this.data = []
          setTimeout(() => {
            $this.visible = false
          }, 1000)
        } else {
          PromptBox(res.Message, 'warning')
        }
      })
    },
    scan (code) {
      let id = 0
      let methodName = 'getPackageSpecimensBySpecimenId'
      if (code.startsWith('---')) {
        id = Number(code.substring(3))
        this.loadData(id, 'getPackageSpecimensByAppOrderId')
      } else if (code.startsWith('-')) {
        id = Number(code.substring(1))
        if (id > 0) {
          if (!this.inArrayExt(id)) {
              this.loadData(id, methodName)
          } else {
            if (this.data.filter(w => w.Id === id).length === 0) {
              PromptBox('该标本不在列表中', 'warning')
              return
            }
            if (this.data.filter(w => w.Id === id && w.IsConfirm === true).length > 0) {
              PromptBox('该标本已确认', 'warning')
              return
            }
            this.updateField(id, 'IsConfirm', true)
            this.dataListSort(id)
            this.refreshScanTotal()
          }
        }
      } else if (code.startsWith('--')) {
          id = Number(code.substring(2))
          methodName = 'getPackageSpecimensById'
          this.loadData(id, methodName, true)
          this.refreshScanTotal()
      }
    },
    // 对每次标本扫码进行由上往下排序，先扫先送
    dataListSort (id) {
      const _tempData = []
      const _specimens = this.data.filter(w => w.Id === id)
      if (_specimens.length === 0) {
        return
      }
      const _specimen = _specimens[0]
      // 判断当前标本所在申请的标本是否已经存在扫码确定
      if (_specimen.IsScan === true) {
        return
      }
      // 把已经扫过的标本优先查出
      const _isScannData = this.data.filter(w => w.IsScan === true)
      if (_isScannData.length > 0) {
        _isScannData.forEach(item => {
          _tempData.push(item)
        })
      }
      this.data.forEach(item => {
        if (item.AppId === _specimen.AppId && _tempData.filter(f => f.Id === item.Id).length <= 0) {
          item.IsScan = true
          _tempData.push(item)
        }
      })
      if (this.data.filter(w => w.IsScan !== true).length > 0) {
        this.data.filter(w => w.IsScan !== true).forEach(item => {
          _tempData.push(item)
        })
      }
      this.data = _tempData
    },
    refreshScanTotal (isReload = false) {
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
      if (this.notConfirm === 0 && isReload === false) {
        PromptBox('所有标本都完成确认', 'success')
      }
      // 更新申请单数量
      const _tempOrder = []
      this.data.forEach(item => {
        if (_tempOrder.filter(f => f === item.AppNo).length === 0) {
          _tempOrder.push(item.AppNo)
        }
      })
      this.appOrderTotal = _tempOrder.length
    }
  }
}
</script>
