export default {
  data: () => ({
    resRequest: {
      message: "",
      type: "",
    },
  }),
  methods: {
    /**
     * Populates an object with message from data
     * @param {string} message Message to display
     * @param {string} type Message type ("error", "success")
     */
    setFormMessage(message, type) {
      this.resRequest = {
        message,
        type,
      };
    },
    // Clear and hide message
    clearFormMessage() {
      this.resRequest = {
        message: "",
        type: "",
      };
    },
  },
};