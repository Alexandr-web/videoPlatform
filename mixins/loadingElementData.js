export default {
  data: () => ({ loadingElement: true, }),
  methods: {
    dataElementIsLoaded() {
      this.loadingElement = false;
    },
  },
};