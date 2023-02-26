<template>
  <div class="spin-content">
    <AppNoTemplate v-if="keyType === 'AppNo'" :record="sourceData"/>
    <AppNoTemplate v-if="keyType === 'AppId'" :record="sourceData"/>
    <SpecimenIdTemplate v-if="keyType === 'SpecimenId'" :record="sourceData"/>
    <SendNoTemplate v-if="keyType === 'SendNo'" :record="sourceData"/>
    <SendNoTemplate v-if="keyType === 'SendId'" :record="sourceData"/>
  </div>
</template>

<script>
import AppNoTemplate from '@/views/submission/speciment/AppNoTemplate.vue'
import SpecimenIdTemplate from '@/views/submission/speciment/SpecimenIdTemplate.vue'
import SendNoTemplate from '@/views/submission/speciment/SendNoTemplate.vue'
export default {
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  components: {
    AppNoTemplate,
    SpecimenIdTemplate,
    SendNoTemplate
  },
  data () {
    return {
      keyType: '',
      sourceData: []
    }
  },
  mounted () {
    this.keyType = this.record.keyType
    this.sourceData = this.record.data
  },
  methods: {
  }
}
</script>