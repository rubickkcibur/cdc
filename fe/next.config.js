
const path = require('path')

module.exports = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    webpack(config) {
        config.module.rules.push({
          test: /\.worker\.js$/,
          loader: 'worker-loader',
          options: {
            // inline: true,
          filename: 'static/[hash].worker.js',
            publicPath: '/_next/'
          }
        })
        // Overcome webpack referencing `window` in chunks
        config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`
        return config
    }
}