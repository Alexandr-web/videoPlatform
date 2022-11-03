const { dest, parallel, watch, src, } = require("gulp");
const plumber = require("gulp-plumber");
const autoprefixer = require("gulp-autoprefixer");
const scss = require("gulp-sass")(require("sass"));
const cleanCss = require("gulp-clean-css");
const concat = require("gulp-concat");

const paths = {
  scss: {
    from: ["./static/scss/**/*.scss", "!./static/scss/**/_*.scss"],
    to: "./static/css/",
    watchSrc: "./static/scss/**/*.scss",
  },
};

const stylesTask = () => {
  return src(paths.scss.from)
    .pipe(plumber())
    .pipe(scss({ outputStyle: "expanded", }))
    .pipe(autoprefixer({
      cascade: true,
      overrideBrowserslist: ["last 5 versions"],
    }))
    .pipe(cleanCss({ level: { 1: { specialComments: 0, }, }, }))
    .pipe(concat("main.css"))
    .pipe(dest(paths.scss.to));
};

const watching = () => {
  watch(paths.scss.watchSrc, parallel(stylesTask));
};

const buildTask = () => parallel(stylesTask);
const defaultTask = () => parallel(buildTask(), watching);

exports.build = buildTask();
exports.default = defaultTask();