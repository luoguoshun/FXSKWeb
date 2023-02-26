<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'

export default {
  data () {
    return {
    }
  },
  created () {
    // setTimeout(() => {
    //   this.$notification.open({
    //     message: `有新的报告签发`,
    //     description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    //     icon: <a-icon type="bell" style="color: #108ee9" />,
    //     placement: 'bottomRight'
    //   })
    // }, 10000)
  },
  computed: {
    locale () {
      // 只是为了切换语言时，更新标题
      const { title } = this.$route.meta
      title && (setDocumentTitle(`${i18nRender(title)} - ${domTitle}`))
      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  }
}
</script>
