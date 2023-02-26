<template>
  <div>
    <a-card :bordered="false">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="操作科室策略配置">
          <StrategySettingDept/>
        </a-tab-pane>
        <a-tab-pane key="5" tab="送检科室策略配置">
          <StrategySettingSendDept/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="用户策略配置">
          <StrategySettingUser/>
        </a-tab-pane>
        <a-tab-pane key="3" tab="策略模板" force-render>
          <StrategyTemplate/>
        </a-tab-pane>
        <a-tab-pane key="4" tab="表单模板画板">
          <FormDesign/>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import StrategySettingDept from './StrategySettingDept'
import StrategySettingSendDept from './StrategySettingSendDept'
import StrategySettingUser from './StrategySettingUser'
import StrategyTemplate from './StrategyTemplate'
import FormDesign from './FormDesign'
export default {
  components: {
    StrategySettingDept,
    StrategySettingUser,
    StrategyTemplate,
    FormDesign,
    StrategySettingSendDept
  },
  data () {
    return {
    }
  },
  created: function () {
  },
  computed: {
  },
  methods: {
  }
}
</script>
