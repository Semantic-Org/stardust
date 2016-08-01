import cx from 'classnames'
import React, { PropTypes } from 'react'

import numberToWord from '../../utils/numberToWord'
import META from '../../utils/Meta'
import { getUnhandledProps, useAlignedProp, useKeyOnly, useValueAndKey } from '../../utils/propUtils'
import * as sui from '../../utils/semanticUtils'

function GridRow(props) {
  const { aligned, centered, children, className, color, column, stretched, vertical } = props
  const classes = cx(
    className,
    color,
    useAlignedProp(aligned),
    useKeyOnly(centered, 'centered'),
    useValueAndKey(numberToWord(column), 'column'),
    useKeyOnly(stretched, 'stretched'),
    useValueAndKey(vertical, 'aligned'),
    'row'
  )
  const rest = getUnhandledProps(GridRow, props)

  return <div {...rest} className={classes}>{children}</div>
}

GridRow._meta = {
  library: META.library.semanticUI,
  name: 'GridRow',
  parent: 'Grid',
  type: META.type.collection,
  props: {
    aligned: sui.textAlignments,
    color: sui.colors,
    column: sui.widths,
    vertical: sui.verticalAlignments,
  },
}

GridRow.propTypes = {
  /** A row can specify its text alignment. */
  aligned: PropTypes.oneOf(GridRow._meta.props.aligned),

  /** A row can have its columns centered. */
  centered: PropTypes.bool,

  /** Primary content of the GridRow. */
  children: PropTypes.node,

  /** Classes that will be added to the GridRow className. */
  className: PropTypes.string,

  /** A grid row can be colored. */
  color: PropTypes.oneOf(GridRow._meta.props.color),

  /** Represents column count per line in Row. */
  column: PropTypes.oneOf(GridRow._meta.props.column),

  /** An can stretch its contents to take up the entire column height. */
  stretched: PropTypes.bool,

  /** A row can specify its vertical alignment to have all its columns vertically centered. */
  vertical: PropTypes.oneOf(GridRow._meta.props.vertical),
}

export default GridRow
