export default {
  methods: {
    /**
     * Checks the value of the unit of time
     * 9 -> 09
     * 10 -> 10
     * @param {number} time Unit of time
     * @returns {string | number} Valid time unit value
     */
    checkTime(time) {
      return time < 10 ? `0${time}` : time;
    },
    /**
     * Converts a time duration to a valid format 00:00
     * @param {number} duration Length of time
     * @returns {string} Valid time format
     */
    getValidTimeFormat(duration) {
      const s = Math.floor(parseInt(duration % 60));
      const h = Math.floor(s / 60 / 60);
      const m = Math.floor(s / 60) - (h * 60);
      const objTime = {
        hours: h > 0 ? this.checkTime(h) : false,
        minutes: this.checkTime(m),
        seconds: this.checkTime(s),
      };
      const trueKeys = Object.keys(objTime).filter((key) => objTime[key]);
      const lengthTrueKeys = trueKeys.length - 1;

      return Object
        .keys(objTime)
        .filter((key) => objTime[key])
        .map((key, index) => index !== lengthTrueKeys ? `${objTime[key]}:` : objTime[key])
        .join("");
    },
  },
};