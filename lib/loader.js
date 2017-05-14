const objectAssign = require('object-assign')
const loaderUtils = require('loader-utils')
const process = require('./process')
require('../encodeSharp')

const parseQuery = (query) => {
  if (!query) {
    return {}
  }

  const encoded = query.replace(',', encodeURIComponent(','))
  return loaderUtils.parseQuery(encoded)
}

const defaultConfig = {
  raw: true
}

module.exports = (content) => {
  this.cacheable && this.cacheable()
  const done = this.async()

  const loaderConfig = objectAssign({}, defaultConfig, parseQuery(this.query))
  const query = parseQuery(this.resourceQuery)
  const totalConfig = objectAssign({}, loaderConfig, query)

  /**
   * Workaround for Webpack bug when it misses resource query in aliased loader
   * @see https://github.com/webpack/webpack/issues/1289
   * @see https://github.com/webpack/webpack/issues/1513
   * @see https://github.com/webpack/webpack/issues/3320
   */
  if (Object.keys(query).length === 0 && this._module) {
    const rawRequest = this._module.rawRequest
    const queryMarkPos = rawRequest.indexOf('?')

    if (queryMarkPos !== -1) {
      query = parseQuery(rawRequest.substr(queryMarkPos))
    }
  }

  if (!totalConfig.fill) {
    const result = totalConfig.raw ? content : 'module.exports = ' + JSON.stringify(content)
    return done(null, result)
  }

  process(content, totalConfig)
    .then( (res) => {
      const result = totalConfig.raw
        ? res
        : 'module.exports = ' + JSON.stringify(res)
      done(null, result)
    })
    .catch(done)
}

module.exports.parseQuery = parseQuery
