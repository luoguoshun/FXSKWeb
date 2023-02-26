<template>
  <div id="app" class="container">
    <div class="row">
      <div class="col-sm-3">
        <h4>工具栏</h4>
        <a-space>
          <a-select v-model="TempType" style="width: 220px" @change="tempTypeChange">
            <a-select-option v-for="d in TempTypeDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
          </a-select>
          <a-input v-model="TempName" type="text" />
          <a-button type="default" @click="addText">文本</a-button>
          <a-button type="default" @click="addBox">方框</a-button>
          <a-button type="default" @click="addLine">线条</a-button>
          <a-button type="default" @click="addBarcode">条形码</a-button>
          <a-button type="default" @click="addQRcode">二维码</a-button>
          <a-button type="default" @click="reDo"><a-icon type="redo" /></a-button>
          <a-button type="primary" @click="save">保存</a-button>
          <a-button type="danger" @click="remove">删除</a-button>
          <a-button type="primary" @click="showDrawer">
            标签项
          </a-button>
          <a-drawer
            title="标签项列表"
            placement="right"
            :closable="false"
            :visible="visible"
            @close="onClose"
            width="400px"
          >
            <a-select style="width: 220px;margin-bottom:10px;" @change="printTemplateTargetChange">
              <a-select-option v-for="d in enums2.PrintTemplateTarget" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
            </a-select>
            <p v-for="item in PrintTemplateTarget" :key="item.value">{{ item.text }}【{{ item.value }}】</p>
          </a-drawer>
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>内容格式必须是“xxxxx${内容编码名}”</span>
            </template>
            <a-button type="primary" shape="circle">
              ?
            </a-button>
          </a-tooltip>
        </a-space>
        <hr>
        <a-row :gutter="24">
          <a-col :span="10">
            <a-card title="画板">
              <div>
                <canvas id="myCanvas" width="580" height="400" style="border: 1px solid rgb(211, 211, 211);"></canvas>
                <canvas id="barcode" hidden="hidden" width="202" height="82"></canvas>
                <canvas id="QRcode" hidden="hidden" width="202" height="82"></canvas>
              </div>
              <div v-if="true">
                <textarea name="" id="zplstr" style="width:580px;height:200px;">^XA^CW1,E:SIMSUN.FNT^CI28^PQ1^XZ</textarea>
              </div>
            </a-card>
          </a-col>
          <a-col :span="7">
            <a-card title="标签控件">
              <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" v-for="(json,i) in jsonZPL" :key="i" >
                <a-form-item :label="json.type">
                  <a-space>
                    <a-button @click="edit(i)" type="primary">属性</a-button>
                    <a-button @click="del(i)" type="danger">移除</a-button>
                  </a-space>
                </a-form-item>
              </a-form>
            </a-card>
          </a-col>
          <a-col :span="4">
            <a-card title="属性" style="width: 450px">
              <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <div v-if="index_select!=-1" class="col-sm-3">
                  <div v-if="jsonZPL[index_select].type=='text'">
                    <a-form-item label="内容">
                      <a-input v-model="jsonZPL[index_select].content" type="text" />
                    </a-form-item>
                    <a-form-item label="左边距离">
                      <a-input v-model.number="jsonZPL[index_select].x" type="number" />
                    </a-form-item>
                    <a-form-item label="顶部距离">
                      <a-input v-model.number="jsonZPL[index_select].y" type="number" />
                    </a-form-item>
                    <a-form-item label="字体大小">
                      <a-input v-model.number="jsonZPL[index_select].size" type="number" />
                    </a-form-item>
                    <a-form-item label="旋转">
                      <a-input v-model.number="jsonZPL[index_select].rotate" type="number" />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                      <a-button @click="update(index_select)" style="margin-top:10px;" type="primary">修改</a-button>
                    </a-form-item>
                  </div>
                  <div v-if="jsonZPL[index_select].type=='box'">
                    <a-form-item label="左边距离">
                      <a-input v-model.number="jsonZPL[index_select].x" type="number" />
                    </a-form-item>
                    <a-form-item label="顶部距离">
                      <a-input v-model.number="jsonZPL[index_select].y" type="number" />
                    </a-form-item>
                    <a-form-item label="边框宽度">
                      <a-input v-model.number="jsonZPL[index_select].border" type="number" />
                    </a-form-item>
                    <a-form-item label="宽度">
                      <a-input v-model.number="jsonZPL[index_select].w" type="number" />
                    </a-form-item>
                    <a-form-item label="高度">
                      <a-input v-model.number="jsonZPL[index_select].h" type="number" />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                      <a-button @click="update(index_select)" style="margin-top:10px;" type="primary">修改</a-button>
                    </a-form-item>
                  </div>
                  <div v-if="jsonZPL[index_select].type=='line'">
                    <a-form-item label="左边距离">
                      <a-input v-model.number="jsonZPL[index_select].x" type="number" />
                    </a-form-item>
                    <a-form-item label="顶部距离">
                      <a-input v-model.number="jsonZPL[index_select].y" type="number" />
                    </a-form-item>
                    <a-form-item label="线厚度">
                      <a-input v-model.number="jsonZPL[index_select].border" type="number" />
                    </a-form-item>
                    <a-form-item label="长度">
                      <a-input v-model.number="jsonZPL[index_select].w" type="number" />
                    </a-form-item>
                    <a-form-item label="旋转">
                      <a-input v-model.number="jsonZPL[index_select].rotate" type="number" />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                      <a-button @click="update(index_select)" style="margin-top:10px;" type="primary">修改</a-button>
                    </a-form-item>
                  </div>
                  <div v-if="jsonZPL[index_select].type=='barcode'">
                    <a-form-item label="内容">
                      <a-input v-model="jsonZPL[index_select].content" type="text" />
                    </a-form-item>
                    <a-form-item label="左边距离">
                      <a-input v-model.number="jsonZPL[index_select].x" type="number" />
                    </a-form-item>
                    <a-form-item label="顶部距离">
                      <a-input v-model.number="jsonZPL[index_select].y" type="number" />
                    </a-form-item>
                    <a-form-item label="条码高度">
                      <a-input v-model.number="jsonZPL[index_select].h" type="number" />
                    </a-form-item>
                    <a-form-item label="比例">
                      <a-select v-model.number="jsonZPL[index_select].scale">>
                        <a-select-option value="1">
                          1
                        </a-select-option>
                        <a-select-option value="2">
                          2
                        </a-select-option>
                        <a-select-option value="3">
                          3
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item label="旋转">
                      <a-input v-model.number="jsonZPL[index_select].rotate" type="number" />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                      <a-button @click="update(index_select)" style="margin-top:10px;" type="primary">修改</a-button>
                    </a-form-item>
                  </div>
                  <div v-if="jsonZPL[index_select].type=='qrcode'">
                    <a-form-item label="内容">
                      <a-input v-model="jsonZPL[index_select].content" type="text" />
                    </a-form-item>
                    <a-form-item label="左边距离">
                      <a-input v-model.number="jsonZPL[index_select].x" type="number" />
                    </a-form-item>
                    <a-form-item label="顶部距离">
                      <a-input v-model.number="jsonZPL[index_select].y" type="number" />
                    </a-form-item>
                    <a-form-item label="条码高度">
                      <a-input v-model.number="jsonZPL[index_select].h" type="number" />
                    </a-form-item>
                    <a-form-item label="条码宽度">
                      <a-input v-model.number="jsonZPL[index_select].w" type="number" />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                      <a-button @click="update(index_select)" style="margin-top:10px;" type="primary">修改</a-button>
                    </a-form-item>
                  </div>
                </div>
              </a-form>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>
<script>
import { writeCanvasZpl } from '@/utils/zpl_js/desing'
import { compilerZpl } from '@/utils/zpl_js/zpl'
import { savePrintTemplet, getPrintTempDicts, delPrintTempDicts } from '@/api/system/dictionary'
import { CheckField, ObjectToJSONString, JSONStringToObject } from '@/utils/util'
import enums from '@/store/enum/fields'
import enums2 from '@/store/enum/enum'
export default {
  name: 'PrintTempletCoonfig',
  data () {
    return {
      enums2,
      enums,
      TempType: 'new',
      TempName: '',
      jsonZPL: [],
      index_select: -1,
      TempTypeDatas: [{ 'value': 'new', 'text': '新建模板' }],
      TempId: 0,
      TempDatas: [],
      visible: false,
      PrintTemplateTarget: []
    }
  },
  mounted () {
    this.loadTemplet()
  },
  computed: {
    zpl () {
      writeCanvasZpl('myCanvas', this.jsonZPL)
      return compilerZpl(this.jsonZPL)
    }
  },
  methods: {
    printTemplateTargetChange (e) {
      this.PrintTemplateTarget = this.enums[e + 'Fields']
    },
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    tempTypeChange (value) {
      if (this.TempType === 'new') {
        this.TempName = ''
        this.reDo()
        return
      }
      const targetObj = this.TempTypeDatas.filter(w => w.value === value)
      this.TempName = targetObj[0].text
      this.TempId = targetObj[0].value
      const obj = this.TempDatas.filter(w => w.Id === targetObj[0].value)
      this.jsonZPL = JSONStringToObject(obj[0].Content)
      writeCanvasZpl('myCanvas', this.jsonZPL)
      this.write(compilerZpl(this.jsonZPL))
    },
    reDo () {
      this.jsonZPL = []
      this.TempName = ''
      this.TempId = 0
      this.TempType = 'new'
      this.write('^XA^CW1,E:SIMSUN.FNT^CI28\n^PQ1^XZ')
    },
    addText () {
      this.jsonZPL.push({
        'type': 'text',
        'content': '{cod_lab}',
        'x': 10,
        'y': 0,
        'size': 10,
        'rotate': 91
      })
      this.write(compilerZpl(this.jsonZPL))
    },
    addBox () {
      this.jsonZPL.push({
        'type': 'box',
        'x': 50,
        'y': 50,
        'w': 50,
        'h': 100,
        'border': 1
      })
      this.write(compilerZpl(this.jsonZPL))
    },
    addLine () {
      this.jsonZPL.push({
        'type': 'line',
        'x': 100,
        'y': 100,
        'w': 100,
        'rotate': 91,
        'border': 2
      })
      this.write(compilerZpl(this.jsonZPL))
    },
    addBarcode () {
      this.jsonZPL.push({
        'type': 'barcode',
        'content': '77382978',
        'x': 150,
        'y': 150,
        'h': 60,
        'scale': 2,
        'rotate': 91
      })
      this.write(compilerZpl(this.jsonZPL))
    },
    addQRcode () {
      this.jsonZPL.push({
        'type': 'qrcode',
        'content': '77382978',
        'x': 150,
        'y': 150,
        'h': 2,
        'w': 3
      })
      this.write(compilerZpl(this.jsonZPL))
    },
    write (zplStr) {
      writeCanvasZpl('myCanvas', this.jsonZPL)
      document.getElementById('zplstr').value = zplStr
    },
    update (index) {
      this.write(compilerZpl(this.jsonZPL))
    },
    loadTemplet () {
      this.TempDatas = []
      this.TempTypeDatas = [{ 'value': 'new', 'text': '新建模板' }]
      getPrintTempDicts().then(res => {
        res.data.forEach(element => {
          this.TempTypeDatas.push({ 'text': element.Name, 'value': element.Id })
        })
        this.TempDatas = res.data
      })
    },
    save () {
      if (this.TempType === 'new' && CheckField(this.TempName) === false) {
        this.$message.warning('请输入新建模板名称')
        return
      }
      const zplContent = ObjectToJSONString(this.jsonZPL)
      const params = { Name: this.TempName, Content: zplContent, Id: this.TempId }
      savePrintTemplet(params).then(res => {
        if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
          this.$message.success('操作成功！', 2)
          this.loadTemplet()
        } else {
          this.$message.warning(res.Message, 2)
        }
      })
    },
    remove () {
      if (this.TempId === 0) {
        this.$message.warning('请选择删除模板')
        return
      }
      const $this = this
      this.$confirm({
        title: '删除模板',
        content: '确定删除模板',
        centered: true,
        onOk () {
          delPrintTempDicts($this.TempId).then(res => {
            if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
              $this.$message.success('操作成功！', 2)
              $this.loadTemplet()
              $this.reDo()
              return new Promise(resolve => {
                setTimeout(() => {
                  resolve(true)
                }, 1000)
              })
            } else {
              $this.$message.warning(res.Message, 2)
              return new Promise(resolve => {
                  resolve(true)
              })
            }
          })
        }
      })
    },
    edit (index) {
      this.index_select = index
    },
    del (index) {
      this.index_select = -1
      this.jsonZPL.splice(index, 1)
      this.write(compilerZpl(this.jsonZPL))
    }
  }
}
</script>
