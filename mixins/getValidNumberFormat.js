export default {
  methods: {
    getValidNumberFormat(num) {
      const options = {
        minimumFractionDigits: 0,
        currencyDisplay: "narrowSymbol",
      };

      return Intl.NumberFormat("ru-RU", options).format(num);
    },
  },
};