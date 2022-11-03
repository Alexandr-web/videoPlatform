export default {
  methods: {
    /**
     * Converts a number to a valid value
     * 10000 -> 10 000
     * @param {number} num Number 
     * @returns {string} Valid number value
     */
    getValidNumberFormat(num) {
      const options = {
        minimumFractionDigits: 0,
        currencyDisplay: "narrowSymbol",
      };

      return Intl.NumberFormat("ru-RU", options).format(num);
    },
  },
};