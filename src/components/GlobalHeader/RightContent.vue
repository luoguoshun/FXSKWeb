<template>
  <div :class="wrpCls">
    <a-select style="width:130px;" v-model="keyType">
      <a-select-option value="AppNo">
        申请单号
      </a-select-option>
      <a-select-option value="AppId">
        申请单编号
      </a-select-option>
      <a-select-option value="SendNo">
        打包号
      </a-select-option>
      <a-select-option value="SendId">
        打包编号
      </a-select-option>
      <a-select-option value="SpecimenId">
        标本编号
      </a-select-option>
    </a-select>
    <a-input-search placeholder="标本轨迹查询" v-model="key" style="width: 200px" @search="onSearch" />
    <message :class="prefixCls" />
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
    <!-- <select-lang :class="prefixCls" /> -->
  </div>
</template>

<script>
import { CheckField, PromptBox } from '@/utils/util'
import { searchDataByKey } from '@/api/specimentrace/specimentrace'
import AvatarDropdown from './AvatarDropdown'
import Message from '@/components/Message/Message'
import IconSelector from '../IconSelector/IconSelector.vue'
import SearchTrace from '@/views/submission/speciment/SearchTrace.vue'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    Message,
    IconSelector,
    SearchTrace
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      key: '',
      keyType: '',
      showMenu: true,
      showMsg: true,
      currentUser: {}
    }
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.currentUser = {
        name: this.$store.state.user.name
      }
    }, 1500)
  },
  methods: {
    onSearch (value) {
      if (CheckField(this.keyType) === false) {
        PromptBox('请选择查询类型！', 'warning')
        return
      }
      if (CheckField(this.key) === false) {
        PromptBox('请输入查询内容！', 'warning')
        return
      }
      this.loadIcon = true
      searchDataByKey(this.key, this.keyType).then(res => {
        if (CheckField(res.data) === false) {
          PromptBox('不存在数据', 'warning')
          return
        }
        const record = { data: res.data, key: this.key, keyType: this.keyType }
        this.$dialog(SearchTrace,
        {
          record: record,
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
          width: 1500,
          centered: true,
          maskClosable: true
        })
      })
    }
  }
}
</script>
