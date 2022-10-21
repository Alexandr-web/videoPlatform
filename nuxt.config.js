export default {
  head: {
    title: "videoPlatform",
    htmlAttrs: { lang: "ru", },
    meta: [
      { charset: "utf-8", },
      { name: "viewport", content: "width=device-width, initial-scale=1", },
      { hid: "description", name: "description", content: "", },
      { name: "format-detection", content: "telephone=no", }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico", }
    ],
  },

  prefix: false,

  css: [
    "@/static/css/main.css"
  ],

  plugins: [
  ],

  components: true,

  buildModules: [
    "@nuxtjs/eslint-module"
  ],

  build: {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
    use: [{
      loader: "url-loader",
      options: {
         esModule: false,
         limit: 1000, // 1kB
         name: "fonts/[name].[contenthash:7].[ext]",
      },
    }],
  },

  modules: [
  ],

  serverMiddleware: [
    "@/server/app.js"
  ],
};
