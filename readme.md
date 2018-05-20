### 一个基于vue2 + node serve + mongodb 的在线商城应用 ###
**开发版本（客户端）**
第一步： 安装依赖
> npm install

第二步： 启动服务
> npm start （npm  run dev）

第三步： 打包部署
> npm run build

第四步：
> http://127.0.0.1:8080

*注意事项：前端接口需要跨域请求接口*

**webpack 跨域配置**

    proxyTable: {
      '/api': {
        target: 'http://127.0.0.1:4000', //设置调用接口域名和端口号别忘了加http
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/' //这里理解成用‘/api’代替target里面的地址，组件中我们调接口时直接用/api代替
          // 比如我要调用'http://0.0:300/user/add'，直接写‘/api/user/add’即可 代理后地址栏显示/
        }
      }
    }
    
**前端请求**

    axios.post('/api/users/addAdress', {userId: this.userId, data}).then(res => {
            let result = res.data;
            if (!result.status) {
              this.addrAddShow = false;
            }
          })
  
**打包放入后台服务**

*由于前端请求接口中使用了 /api 所以放到服务端时，在打包时要把接口地址去掉/api,否则接口无法使用*

**打包后直接访问**

>http://127.0.0.1:4000