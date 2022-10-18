<template>
  <form
    class="form"
    :class="classes.filter(Boolean).join(' ')"
    @submit.prevent="$emit('sendReq', getValidDataForm)"
  >
    <div
      v-for="(fieldKey, index) in getFieldsKeys"
      :key="index"
      class="form__field"
    >
      <label
        v-if="fields[fieldKey].type === 'file'"
        class="form__label form__area-file"
        :class="{
          'form__area-file--error': dataForm[fieldKey].error
        }"
        :for="fieldKey"
      >
        <input
          :id="fieldKey"
          class="form__file"
          type="file"
          :accept="fields[fieldKey].accept.join(',')"
          @change="loadFile($event, fieldKey)"
        >
        <div class="form__file-view">
          <vCameraIcon
            v-if="!dataForm[fieldKey].src"
            :classes="['form__file-view-icon']"
          />
          <img
            v-else
            class="form__file-res"
            :src="dataForm[fieldKey].src"
          >
        </div>
      </label>
      <label
        v-else
        class="form__label"
        :for="fieldKey"
      >
        <input
          :id="fieldKey"
          v-model.trim="dataForm[fieldKey].model"
          class="form__input"
          :class="{
            'form__input--invalid': !fields[fieldKey].isMatchRegexp(dataForm[fieldKey].model) && dataForm[fieldKey].model.length,
          }"
          :type="fields[fieldKey].type"
        >
        <span
          class="form__field-title"
          :class="{
            'form__field-title--up': Boolean(dataForm[fieldKey].model.length),
          }"
        >{{ fields[fieldKey].title }}</span>
      </label>
    </div>
    <button
      class="form__submit"
      :class="{
        'pending-btn': pending,
      }"
      type="submit"
      :disabled="pending"
    >
      {{ textButton }}
    </button>
  </form>
</template>

<script>
  import vCameraIcon from "@/components/icons/vCameraIcon";

  export default {
    name: "FormComponent",
    components: { vCameraIcon, },
    props: {
      classes: {
        type: Array,
        default: () => ([]),
      },
      fields: {
        type: Object,
        required: true,
      },
      textButton: {
        type: String,
        required: true,
      },
      pending: {
        type: Boolean,
        required: true,
      },
    },
    data: () => ({ dataForm: {}, }),
    computed: {
      getFieldsKeys() {
        return Object.keys(this.fields);
      },
      getValidDataForm() {
        return Object
          .keys(this.dataForm)
          .filter((key) => {
            const itemForm = this.dataForm[key];

            return this.fields[key].isMatchRegexp(itemForm["file" in itemForm ? "file" : "model"]);
          })
          .reduce((acc, key) => {
            acc[key] = this.dataForm[key];

            return acc;
          }, {});
      },
    },
    created() {
      Object.keys(this.fields).map((key) => {
        if (this.fields[key].type !== "file") {
          this.dataForm[key] = { model: "", };
        } else {
          this.dataForm[key] = {
            file: null,
            src: "",
            error: false,
          };
        }
      });
    },
    methods: {
      setOneKeyAtDataForm(key, val) {
        this.dataForm = Object.keys(this.dataForm).reduce((acc, dataKey) => {
          if (dataKey !== key) {
            acc[dataKey] = this.dataForm[dataKey];
          } else {
            acc[key] = val;
          }

          return acc;
        }, {});
      },
      loadFile(e, fieldKey) {
        const file = e.currentTarget.files[0];

        if (file) {
          const reader = new FileReader();

          reader.readAsDataURL(file);
          reader.addEventListener("load", () => {
            this.setOneKeyAtDataForm(fieldKey, {
              file,
              src: reader.result,
              error: false,
            });
          });
          
          reader.addEventListener("error", () => {
            this.setOneKeyAtDataForm(fieldKey, {
              ...this.dataForm[fieldKey],
              error: true,
            });

            throw reader.error;
          });
        } else {
          this.setOneKeyAtDataForm(fieldKey, {
            ...this.dataForm[fieldKey],
            error: true,
          });
        }
      },
    },
  };
</script>