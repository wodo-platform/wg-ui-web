module.exports = {
    devServer: {
        //proxy: 'http://localhost:8080',
        disableHostCheck: true,
        headers: { "Access-Control-Allow-Origin": "*,*" }

    },
    configureWebpack: {
        devtool: 'source-map',
        devServer: {
            //proxy: 'http://localhost:8080',
            disableHostCheck: true,
            headers: { "Access-Control-Allow-Origin": "*,*" }

        }
    },
    pluginOptions: {
        i18n: {
            enableInSFC: true
        }
    }
}