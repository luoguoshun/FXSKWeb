<template>
  <div>
    <a-table :columns="columns" :data-source="this.$attrs.dynamicData.Specimens" size="middle" :pagination="false" />
  </div>
</template>
<script>
const data = []
const columns = [
  { title: '标本名称', dataIndex: 'SpecimenName' },
  { title: '采取部位', dataIndex: 'PartName' },
  { title: '标本数量', dataIndex: 'Total' }
]
export default {
  name: 'Table',
  props: {
    record: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      data,
      columns
    }
  },
  created: function () {
  },
  methods: {
  }
}
</script>
