<template>
  <div>
    <a-card :bordered="false">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="主流程">
          <WorkflowSetting/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="子流程" force-render>
          <WorkflowNodeSetting/>
        </a-tab-pane>
        <a-tab-pane key="3" tab="科室流程配置">
          <DepartmentSeeting />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import WorkflowSetting from './WorkflowSetting'
import WorkflowNodeSetting from './WorkflowNodeSetting'
import DepartmentSeeting from './DepartmentSetting'

export default {
  components: {
    DepartmentSeeting,
    WorkflowSetting,
    WorkflowNodeSetting
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
