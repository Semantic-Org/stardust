import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import {
  childrenUtils,
  customPropTypes,
  getElementType,
  getUnhandledProps,
  META,
} from '../../lib'

const ElementType = getElementType()

/**
 * A statistic can contain a label to help provide context for the presented value.
 */
function StatisticLabel(props) {
  const { children, className, label } = props
  const classes = cx('label', className)
  const rest = getUnhandledProps(StatisticLabel, props)

  return (
    <ElementType {...rest} className={classes}>
      {childrenUtils.isNil(children) ? label : children}
    </ElementType>
  )
}

StatisticLabel._meta = {
  name: 'StatisticLabel',
  parent: 'Statistic',
  type: META.TYPES.VIEW,
}

StatisticLabel.propTypes = {
  /** An element type to render as (string or function). */
  as: customPropTypes.as,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  label: customPropTypes.contentShorthand,
}

export default StatisticLabel
