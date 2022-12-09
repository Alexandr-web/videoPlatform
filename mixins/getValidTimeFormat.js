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
      const m = Math.floor(parseInt((duration / 60) % 60));
      const objTime = {
        minutes: this.checkTime(m),
        seconds: this.checkTime(s),
      };

      return Object
        .keys(objTime)
        .map((key) => objTime[key])
        .join(":");
    },
  },
};