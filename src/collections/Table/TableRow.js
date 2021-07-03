import _ from 'lodash'
import cx from 'clsx'
import PropTypes from 'prop-types'
import React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  customPropTypes,
  getElementType,
  getUnhandledProps,
  SUI,
  useKeyOnly,
  useTextAlignProp,
  useVerticalAlignProp,
} from '../../lib'
import TableCell from './TableCell'

/**
 * A table can have rows.
 */
function TableRow(props) {
  const {
    active,
    cellAs,
    cells,
    children,
    className,
    disabled,
    error,
    negative,
    positive,
    textAlign,
    verticalAlign,
    warning,
  } = props

  const classes = cx(
    useKeyOnly(active, 'active'),
    useKeyOnly(disabled, 'disabled'),
    useKeyOnly(error, 'error'),
    useKeyOnly(negative, 'negative'),
    useKeyOnly(positive, 'positive'),
    useKeyOnly(warning, 'warning'),
    useTextAlignProp(textAlign),
    useVerticalAlignProp(verticalAlign),
    className,
  )
  const rest = getUnhandledProps(TableRow, props)
  const ElementType = getElementType(TableRow, props)

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes}>
        {children}
      </ElementType>
    )
  }

  return (
    <ElementType {...rest} className={classes}>
      {_.map(cells, (cell, idx) => {
        const defaultProps = { as: cellAs }

        // generate a default react key for any string content created cells by this HOC
        // required due the fact that without this, sibling cells with same content will result in React Same Key Error
        if (typeof cell === 'string') {
          defaultProps.key = `${idx}-${cell.toLocaleLowerCase().replace(' ', '-')}`
        }

        return TableCell.create(cell, { defaultProps })
      })}
    </ElementType>
  )
}

TableRow.defaultProps = {
  as: 'tr',
  cellAs: 'td',
}

TableRow.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** A row can be active or selected by a user. */
  active: PropTypes.bool,

  /** An element type to render as (string or function). */
  cellAs: PropTypes.elementType,

  /** Shorthand array of props for TableCell. */
  cells: customPropTypes.collectionShorthand,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** A row can be disabled. */
  disabled: PropTypes.bool,

  /** A row may call attention to an error or a negative value. */
  error: PropTypes.bool,

  /** A row may let a user know whether a value is bad. */
  negative: PropTypes.bool,

  /** A row may let a user know whether a value is good. */
  positive: PropTypes.bool,

  /** A table row can adjust its text alignment. */
  textAlign: PropTypes.oneOf(_.without(SUI.TEXT_ALIGNMENTS, 'justified')),

  /** A table row can adjust its vertical alignment. */
  verticalAlign: PropTypes.oneOf(SUI.VERTICAL_ALIGNMENTS),

  /** A row may warn a user. */
  warning: PropTypes.bool,
}

TableRow.create = createShorthandFactory(TableRow, (cells) => ({ cells }))

export default TableRow
