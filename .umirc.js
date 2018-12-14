import { resolve } from "path";
// ref: https://umijs.org/config/
export default {
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        //loadingComponent: './components/PageLoading/index',
        loadingComponent: './components/Loader/index',
      },
      //dynamicImport: false,
      targets: {
        ie: 10,
      },
      title: '项目信息',
      dll: true,
      routes: {
        exclude: [],
      },
      hardSource: false,
    }],
  ],
  theme: {
    'primary-color': '#1890FF',
  },
  alias: {
    components: resolve(__dirname, "./src/components"),
    utils: resolve(__dirname, "./src/utils"),
  },
  // proxy: {
  //   "/api": {
  //     "target": "http://localhost:8000/",
  //     "changeOrigin": true,
  //     "pathRewrite": { "^/api" : "" }
  //   }
  // },
  //hash:true, //TODO: 设置build之后文件的哈希值
}
