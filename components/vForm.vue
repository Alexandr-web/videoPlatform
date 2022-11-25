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
      :class="{ 'skeleton': onSkeleton, }"
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
            'form__input--invalid': !fieldIsMatch(fieldKey) && dataForm[fieldKey].model.length,
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
    >{{ textButton }}</button>
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
      >{{ resRequest.message }}</p>
    </div>
  </form>
</template>

<script>
  import vCameraIcon from "@/components/icons/vCameraIcon";
  import vVideoIcon from "@/components/icons/vVideoIcon";
  import vLoader from "@/components/vLoader";
  import getValidTimeFormatMixin from "@/mixins/getValidTimeFormat";

  export default {
    name: "FormComponent",
    components: {
      vCameraIcon,
      vVideoIcon,
      vLoader,
    },
    mixins: [getValidTimeFormatMixin],
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
      isVideo: {
        type: Boolean,
        default: false,
      },
      onSkeleton: {
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
      video: {
        time: "",
        duration: 0,
      },
    }),
    computed: {
      getFieldsKeys() {
        return Object.keys(this.fields);
      },
      getDataFormKeys() {
        return Object.keys(this.dataForm);
      },
    },
    // Creating similar elements in the dataForm object that contain the keys needed to check the validation
    created() {
      this.getFieldsKeys.map((key) => {
        if (this.fields[key].type !== "file") {
          this.dataForm[key] = { model: this.fields[key].model || "", };
        } else {
          this.dataForm[key] = {
            file: null,
            src: this.fields[key].src || "",
            error: false,
            loading: false,
          };
        }
      });
    },
    methods: {
      /**
       * Validity check field
       * @param {string} key The key of the field element that we will check
       */
      fieldIsMatch(key) {
        const itemForm = this.dataForm[key];
        const field = this.fields[key];

        // For the field that contains the file
        if (field.type === "file") {
          return itemForm.file instanceof File;
        }

        // For normal string values
        const regexp = new RegExp(field.matchRegexpStr);

        return regexp.test(itemForm.model);
      },
      // Sends values that pass validation
      sendReq() {
        const data = this.getDataFormKeys
          .filter((key) => this.fieldIsMatch(key)).reduce((acc, key) => {
            acc[key] = this.dataForm[key];

            return acc;
          }, {});

        // If there is a video, then we send its data with the main data
        this.$emit("sendReq", this.isVideo ? { ...data, ...this.video, } : data);
      },
      /**
       * Assigns the time and duration of the video when it is fully loaded
       * @param {object} e Event object
       */
      videoIsLoad(e) {
        this.video.time = this.getValidTimeFormat(e.target.duration);
        this.video.duration = e.target.duration;
      },
      /**
       * Replacing the value of the dataForm element by key
       * @param {string} key dataForm object key
       * @param {string} val The new value for the element of the dataForm object
       */
      setOneKeyAtDataForm(key, val) {
        this.dataForm = this.getDataFormKeys.reduce((acc, dataKey) => {
          if (dataKey !== key) {
            acc[dataKey] = this.dataForm[dataKey];
          } else {
            acc[key] = val;
          }

          return acc;
        }, {});
      },
      /**
       * Loads a file and puts its data into the dataForm[fieldKey] element
       * @param {object} e Event object
       * @param {string} fieldKey Element key of the dataForm object
       */
      loadFile(e, fieldKey) {
        const file = e.currentTarget.files[0];

        if (file) {
          // Clear
          this.setOneKeyAtDataForm(fieldKey, {
            file: null,
            src: null,
            error: false,
            loading: true,
          });

          setTimeout(() => {
            const blob = new Blob([file], { type: file.type, });
            const url = URL.createObjectURL(blob);

            this.setOneKeyAtDataForm(fieldKey, {
              file,
              src: url,
              error: false,
              loading: false,
            });
          }, 0);
        } else {
          // Error
          this.setOneKeyAtDataForm(fieldKey, {
            ...this.dataForm[fieldKey],
            error: true,
          });

          this.$emit("setFormMessage", "Произошла ошибка при скачивании файла", "error");
        }
      },
    },
  };
</script>