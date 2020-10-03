import * as PropTypes from 'prop-types'
import * as React from 'react'

const UIContext = React.createContext({
  cssFramework: 'semantic-ui',
})

// eslint-disable-next-line camelcase
export function unstable_Provider(props) {
  if (process.env.NODE_ENV !== 'production') {
    // TODO: throw on nested usages
    React.useContext(UIContext)
  }

  const { children, unstable_cssFramework: cssFramework } = props
  const value = React.useMemo(() => ({ cssFramework }), [cssFramework])

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

unstable_Provider.propTypes = {
  unstable_cssFramework: PropTypes.oneOf(['semantic-ui', 'fomantic-ui']),
}

// eslint-disable-next-line camelcase
export const deprecated_UIContext = UIContext

export function useCSSFramework() {
  const value = React.useContext(UIContext)

  return value.cssFramework
}
