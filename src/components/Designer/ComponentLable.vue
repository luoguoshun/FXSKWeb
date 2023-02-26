<template>
  <span>{{ this.value }}</span>
</template>
<script>

export default {
  name: 'ReportTitle',
  props: {
    record: {
      type: Object,
      require: true,
      default: () => {}
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  created: function () {
  },
  methods: {
  }
}
</script>
