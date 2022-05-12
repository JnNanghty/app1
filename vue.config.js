const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/theme/variables.styl'),
        path.resolve(__dirname, './src/theme/mixin.styl'),
      ],
    })
}

module.exports = {
  outputDir: 'D:\\project\\banpai\\www',
  transpileDependencies: ['vue-router', 'minio'],
  devServer: {
    proxy: {
      '/rest': {
        // target: 'http://testc.hzmaijie.com',
        target: 'http://192.168.1.140:80',
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)))
  },
};
