const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        // eslint-disable-next-line quotes
        additionalData: `@import '~@/styles/variables.scss';`
      }
    }
  },
  devServer: {
    proxy: {
      '/boss': {
        target: 'http://eduboss.lagounews.com',
        changeOrigin: true
      },
      '/front': {
        target: 'http://edufront.lagounews.com',
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    config.resolve.extensions.add('.vue')
  }
})
