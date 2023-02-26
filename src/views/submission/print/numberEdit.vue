<template>
  <div>
    <p>您输入的是：{{ title1 }}</p>
    <a-form-model layout="inline" :model="formInline" @submit="handleSubmit" @submit.native.prevent>
      <a-form-model-item>
        <a-input v-model="formInline.user" placeholder="Username">
          <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-input v-model="formInline.password" type="password" placeholder="Password">
          <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-button
          type="primary"
          html-type="submit"
          :disabled="formInline.user === '' || formInline.password === ''"
        >
         登入
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  },
  data() {
    return {
      title1: this.title,
      formInline: {
        user: '',
        password: '',
      },
    };
  },
  methods: {
    handleSubmit(e) {
      console.log(this.formInline);
    },
  },
};
</script>
