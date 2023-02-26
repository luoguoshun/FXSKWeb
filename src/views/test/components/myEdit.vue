<template>
  <div>
    <!-- {{ title }} -->
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: Object,
      require: true,
      default: null,
    },
  },
  data() {
    return {
      title12: this.title,
    };
  },
};
</script>

<style lang="less" scoped></style>
