const postcss = require('postcss')
const encodeSharpPlugin = require('./lib/encodeSharpPostCSSPlugin')

module.exports = function (content, sourcemap) {
  this.cacheable && this.cacheable()
  const done = this.async()

  postcss([ encodeSharpPlugin() ])
    .process(content)
    .then( (result) => {
      done(null, result.css, sourcemap)
    })
    .catch(done)
}
