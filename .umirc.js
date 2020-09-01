module.exports = {
    lessLoaderOptions: {
        javascriptEnabled: true,
    },
    plugins: [
        ['umi-plugin-react', {
            dva: true,
            titie: true,
            routes: {
                exclude: [/.*\/models\/.*/, /.*\/model\.js/] //model.js文件不加入路由，models中的文件不加入路由
            },
            antd: true
        }]
    ]
}