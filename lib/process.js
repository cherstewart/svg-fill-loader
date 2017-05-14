const objectAssign = require('object-assign')
const posthtml = require('posthtml')
const parser = require('posthtml-parser')
const render = require('posthtml-render')
const fillPlugin = require('./posthtmlPlugin')

/**
 * Custom XML parser
 * @see https://github.com/fb55/htmlparser2/wiki/Parser-options
 */
const xmlParser = parser(({
  xmlMode: true,
  lowerCaseTags: false,
  lowerCaseconstibuteNames: false
}))

const defaultRenderOptions = {
  closingSingleTag: 'slash',
  /**
   * @see https://github.com/posthtml/posthtml-render#singletags
   */
  singleTags: [
    'circle',
    'ellipse',
    'line',
    'path',
    'polygon',
    'polyline',
    'rect',
    'use',
    'animateTransform'
  ]
}

/**
 * @param {String} content
 * @param {Object} [options]
 * @returns {Promise<String>}
 */
const process = (content, options) => {
  options = options || {}
  let renderOptions = objectAssign({}, defaultRenderOptions, options.renderOptions)

  // Dirty hack to autodetect non-single tags
  renderOptions.singleTags = renderOptions.singleTags.filter( (tag) => {
    return content.indexOf('</' + tag + '>') === -1
  })

  return posthtml([fillPlugin(options)])
    .process(content, {parser: xmlParser})
    .then( (result) => {
      return render(result.tree, renderOptions)
    })
}

module.exports = process
