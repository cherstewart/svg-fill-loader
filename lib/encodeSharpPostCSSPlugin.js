const postcss = require('postcss')
const helpers = require('postcss-helpers')

module.exports = postcss.plugin('encode-sharp-in-query-string-param-values', (options) => {
  return (root) => {
    root.walkDecls(function (decl) {
      const helper = helpers.createUrlsHelper(decl.value)

      if (!helper.URIS)
        return

      helper.URIS.forEach( (url) => {
        const href = url.href()
        const hasQuery = href.lastIndexOf('?') > 0
        const query = hasQuery ? href.substring(href.lastIndexOf('?') + 1) : null

        if (query !== null && query.length) {
          const params = query.split('&')
          const newQuery = params
            .map( (paramPair) => {
              const isShouldUpdateParam = paramPair.indexOf('=') > 0
              return isShouldUpdateParam ? paramPair.replace(/#/g, '%23') : paramPair
            })
            .join('&')

          url.href(href.replace(query, newQuery))
        }
      })

      decl.value = helper.getModifiedRule()
    })
  }
})
