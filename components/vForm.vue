<template>
  <form
    class="form"
    :class="(classes || []).filter(Boolean).join(' ')"
    @submit.prevent="$emit('sendReq', getValueModels)"
  >
    <div
      v-for="(fieldKey, index) in getFieldsKeys"
      :key="index"
      class="form__field"
    >
      <label
        class="form__label"
        for="email"
      >
        <input
          v-model.trim="validations[fieldKey].model"
          class="form__input"
          :class="{
            'form__input--invalid': validations[fieldKey].$invalid,
          }"
          :type="fields[fieldKey].type"
        >
        <span
          class="form__field-title"
          :class="{
            'form__field-title--up': Boolean(validations[fieldKey].model.length),
          }"
        >{{ fields[fieldKey].title }}</span>
      </label>
    </div>
  </form>
</template>

<script>
  export default {
    name: "FormComponent",
    props: {
      classes: {
        type: Array,
        default: () => ([]),
      },
      fields: {
        type: Object,
        required: true,
      },
      validParams: {
        type: Array,
        required: true,
      },
    },
    data: () => ({ validations: {}, }),
    computed: {
      getFieldsKeys() {
        return Object.keys(this.fields);
      },
      getValueModels() {
        return Object.keys(this.validations).reduce((acc, key) => {
          acc[key] = this.validations[key].model;

          return acc;
        }, {});
      },
    },
    created() {
      const obj = this.validParams.reduce((acc, { rules, name, }) => {
        acc[name] = { rules, model: "", };

        return acc;
      }, {});

      this.validations = { ...this.validations, ...obj, };
    },
  };
</script>