<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="https://www.github.com/vueComponent/pro-layout" target="_blank"></a>
      <a href="https://www.github.com/vueComponent/ant-design-vue-pro" target="_blank"></a>
      <a href="https://www.github.com/sendya/" target="_blank"></a>
    </template>
    <template v-slot:copyright>
      <a href="https://github.com/vueComponent" target="_blank"></a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
