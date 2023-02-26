<template>
  <a-form :form="form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol" labelAlign="left">
    <a-button type="primary" icon="printer" v-print="'#print_main'">打印</a-button>
    <div id="print_main">
      <h2>病理检查申请单</h2>
      <div id="tabletop">
        <a-row>
          <a-col :span="14">
            <a-form-item label="申请时间：">
              <a-input class="ant-form-text" v-decorator="['CreatedTime']" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="费别：">
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="病人号：">
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <table>
        <tr>
          <td>
            <a-form-item label="姓名：">
              <a-input class="ant-form-text" v-decorator="['PatientName']" disabled/>
            </a-form-item>
          </td>
          <td>
            <a-form-item label="年龄：">
              <a-input class="ant-form-text" v-decorator="['Age']" disabled/>
            </a-form-item>
          </td>
          <td>
            <a-form-item label="科别：">
              <a-input class="ant-form-text" v-decorator="['Department']" disabled/>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td>
            <a-form-item label="住院号：">
              <a-input class="ant-form-text" v-decorator="['AdmissionNum']" disabled/>
            </a-form-item>
          </td>
          <td>
            <a-form-item label="性别：">
              <a-input class="ant-form-text" v-decorator="['Sex', {initialValue: (Number(record.Sex) >= 0 ? '女':'男')}]" disabled/>
            </a-form-item>
          </td>
          <td>
            <a-form-item label="床号：">
              <a-input class="ant-form-text" v-decorator="['BedNo']" disabled/>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td>
            <a-form-item label="病区：">
              <a-input class="ant-form-text" v-decorator="['']" disabled/>
            </a-form-item>
          </td>
          <td>
            <a-form-item label="医疗卡号：">
              <a-input class="ant-form-text" v-decorator="['']" disabled/>
            </a-form-item>
          </td>
          <td>
            <a-form-item label="联系电话：">
              <a-space></a-space>
              <a-input class="ant-form-text" v-decorator="['MobileNo']" disabled/>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td colspan="24">
            <a-form-item label="病史及体格检查" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-textarea v-decorator="['BriefHistory']" disabled :rows="8"></a-textarea>
            </a-form-item>
            <a-form-item label="其它辅助检查：" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
              <a-textarea disabled :rows="4"></a-textarea>
            </a-form-item>
            <a-form-item label="临床诊断：" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
              <a-textarea v-decorator="['ClinicalDiagnosis']" disabled :rows="6" aria-colspan="20"></a-textarea>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <a-form-item label="检查项目：" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
              <a-input class="ant-form-text" v-decorator="['ExamItem']" disabled/>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <div style="height:100px;">
              <a-form-item label="检查部位：" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
              </a-form-item>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </a-form>
</template>
<script>
import pick from 'lodash.pick'
import moment from 'moment'
import { BrowserPrintInit } from '@/utils/BrowserPrint.js'
const fields = ['PatientName', 'Age', 'Department', 'AdmissionNum', 'Sex', 'BedNo', 'MobileNo', 'BriefHistory', 'ClinicalDiagnosis', 'ExamItem', 'CreatedTime']
export default {
  name: 'Preview',
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      layout: 'horizontal',
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 17
      },
      form: this.$form.createForm(this)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.record.CreatedTime = moment(this.record.CreatedTime).format('YYYY-MM-DD HH:mm')
      this.form.setFieldsValue(pick(this.record, fields))
    })
    // 初始化浏览器打印事件
    BrowserPrintInit(this)
  },
  methods: {
    btnClickPrint: function () {
      this.printLabel(1, 2, 3, 4)
    },
    printLabel: function (specimenCode, specimenName, specimenId, partName) {
      if (partName == null) {
          partName = ''
      }
      var printData = '^XA^CW1,E:SIMSUN.FNT^CI28' +
          '^FO20,20^A1,30,30^FD6666-' + specimenCode + '^FS' +
          '^FO20,55^A1,30,30^FDI:6666^FS' +
          '^FO20,90^A1,30,30^FDD:6666^FS' +
          '^FO20,127^A1,30,30^FDS:6666【6666】^FS' +
          '^FO220,30^BQN,2,4^FDMM,A6666-6666^FS' +
          '^PQ1^XZ'
      this.selectedDevice.send(printData, undefined, () => {})
    }
  }
}
</script>
<style type="text/css">
    @media print {
      .no-print {
          display: none;
      }
    }
    #print_main #tablemain {
        text-align: center;
    }
    #print_main .ant-form-item{
      margin-bottom: 0px;
    }
    #print_main .ant-input[disabled]{
      background-color: #f5f5f500;
      border: none;
      color:#5b5b5b;
    }
    #print_main h2 {
        margin: 0 auto;
        text-align: center;
        font-family: fangsong;
        font-size: 35px;
        line-height: 55px;
        font-weight: bold;
    }

    #print_main table {
        border-collapse: collapse;
        margin: 0 auto;
        border: solid #000000;
        border-width: 1px;
        width: 80%;
        height: 90%;
        margin-bottom: 20px;
    }
    #print_main table tr,#print_main table tr td {
        border: solid #000000;
        border-width: 1px;
    }

    #print_main table tr td label {
        width: 20%;
        font-weight: bold;
        margin-left: 5px;
    }

    #print_main #tabletop {
        width: 80%;
        margin: 0 auto;
    }
    #print_main textarea{
      resize:none
    }
</style>
