const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  outputDir: 'D:\\project2\\myproj\\banpai\\www',
  devServer: {
    proxy: {
      '/rest': {
        target: 'http://192.168.1.179:8080',
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
  }
};
