const objectAssign = require('object-assign')

/**
 * @param {String} selector
 * @returns {Array<Object>} matcher for posthtml#match
 */
const transformSelectorToMatcher = (selector) => {
  /**
   * @param {Object} matcher
   * @param {String} attrName
   * @param {String} selector
   */
const assignAttrCondition = (matcher, attrName, selector) => {
    if (!matcher.attrs) {
      matcher.attrs = {}
    }

    matcher.attrs[attrName] = selector.substr(1)
  }

  const parts = selector.split(',').map((part) => {
    const matcher = {}
    const selector = part.trim()
    const firstSymbol = selector.substr(0, 1)

    switch (firstSymbol) {
      case '#':
        assignAttrCondition(matcher, 'id', selector)
        break

      case '.':
        assignAttrCondition(matcher, 'class', selector)
        break

      default:
        matcher.tag = selector
        break
    }

    return matcher
  })

  return parts
}

const defaultOptions = {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Element#Graphics_elements
   */
  selector: [
    'circle',
    'ellipse',
    'line',
    'path',
    'polygon',
    'polyline',
    'rect',
    'text',
    'use'
  ].join(',')
}

module.exports = (opts) => {
  const options = objectAssign({}, defaultOptions, opts || {})
  const fill = options.fill || null
  const matcher = transformSelectorToMatcher(options.selector)

  return (tree, done) => {
    tree.match(matcher, (node) => {
      if (fill) {
        if (!node.attrs) node.attrs = {}
        node.attrs.fill = fill
      }
      return node
    })

    done(null, tree)
  }
}

module.exports.defaultOptions = defaultOptions
module.exports.transformSelectorToMatcher = transformSelectorToMatcher
