<template>
  <form
    class="form"
    :class="classes.filter(Boolean).join(' ')"
    @submit.prevent="sendReq"
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
        <div
          v-if="fields[fieldKey].typeFile === 'img'"
          class="form__file-view"
        >
          <vLoader
            v-if="dataForm[fieldKey].loading"
            :classes="['form__loader-file']"
          />
          <vCameraIcon
            v-if="!dataForm[fieldKey].src && !dataForm[fieldKey].loading"
            :classes="['form__file-view-icon']"
          />
          <img
            v-if="dataForm[fieldKey].src"
            class="form__file-img"
            :class="{
              'form__file-img--avatar': fields[fieldKey].isAvatar,
            }"
            :src="dataForm[fieldKey].src"
          />
        </div>
        <div
          v-if="fields[fieldKey].typeFile === 'video'"
          class="form__file-view"
        >
          <vLoader
            v-if="dataForm[fieldKey].loading"
            :classes="['form__loader-file']"
          />
          <vVideoIcon
            v-if="!dataForm[fieldKey].src && !dataForm[fieldKey].loading"
            :classes="['form__file-view-icon']"
          />
          <video
            v-if="dataForm[fieldKey].src"
            class="form__file-video"
            :src="dataForm[fieldKey].src"
            controls
            @loadedmetadata="videoIsLoad($event)"
          ></video>
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
    <div
      v-if="Object.values(resRequest).every(Boolean)"
      class="form__res-request"
    >
      <p
        class="form__res-request-text"
        :class="{
          'form__res-request--error': resRequest.type === 'error',
          'form__res-request--success': resRequest.type === 'success',
        }"
      >
        {{ resRequest.message }}
      </p>
    </div>
  </form>
</template>

<script>
  import vCameraIcon from "@/components/icons/vCameraIcon";
  import vVideoIcon from "@/components/icons/vVideoIcon";
  import vLoader from "@/components/vLoader";

  export default {
    name: "FormComponent",
    components: {
      vCameraIcon,
      vVideoIcon,
      vLoader,
    },
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
      getVideoTime: {
        type: Boolean,
        default: false,
      },
      resRequest: {
        type: Object,
        default: () => ({
          type: "",
          message: "",
        }),
      },
    },
    data: () => ({
      dataForm: {},
      videoTime: "",
    }),
    computed: {
      getFieldsKeys() {
        return Object.keys(this.fields);
      },
    },
    created() {
      Object.keys(this.fields).map((key) => {
        if (this.fields[key].type !== "file") {
          this.dataForm[key] = { model: "model" in this.fields[key] ? this.fields[key].model : "", };
        } else {
          this.dataForm[key] = {
            file: null,
            src: "src" in this.fields[key] ? this.fields[key].src : "",
            error: false,
            loading: false,
          };
        }
      });
    },
    methods: {
      sendReq() {
        const data = Object
          .keys(this.dataForm)
          .filter((key) => {
            const itemForm = this.dataForm[key];
            
            return this.fields[key].isMatchRegexp(itemForm["file" in itemForm ? "file" : "model"]);
          })
          .reduce((acc, key) => {
            acc[key] = this.dataForm[key];

            return acc;
          }, {});

        this.$emit("sendReq", this.getVideoTime ? { ...data, time: this.videoTime, } : data);
      },
      getValidTimeFormat(time) {
        return `${time < 10 ? "0" + time : time}`;
      },
      videoIsLoad(e) {
        const s = Math.floor(parseInt(e.target.duration % 60));
        const h = Math.floor(s / 60 / 60);
        const m = Math.floor(s / 60) - (h * 60);

        this.videoTime = `${this.getValidTimeFormat(h)}:${this.getValidTimeFormat(m)}:${this.getValidTimeFormat(s)}`;
      },
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

          this.setOneKeyAtDataForm(fieldKey, {
            file: null,
            src: null,
            error: false,
            loading: true,
          });

          reader.readAsDataURL(file);
          reader.addEventListener("load", () => {
            this.setOneKeyAtDataForm(fieldKey, {
              file,
              src: reader.result,
              error: false,
              loading: false,
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