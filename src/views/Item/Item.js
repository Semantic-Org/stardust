import cx from 'clsx'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import { childrenUtils, customPropTypes, getElementType, getUnhandledProps } from '../../lib'
import ItemContent from './ItemContent'
import ItemDescription from './ItemDescription'
import ItemExtra from './ItemExtra'
import ItemGroup from './ItemGroup'
import ItemHeader from './ItemHeader'
import ItemImage from './ItemImage'
import ItemMeta from './ItemMeta'

/**
 * An item view presents large collections of site content for display.
 */
function Item(props) {
  const { children, className, content, description, extra, header, image, meta } = props

  const classes = cx('item', className)
  const rest = getUnhandledProps(Item, props)
  const ElementType = getElementType(Item, props)

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes}>
        {children}
      </ElementType>
    )
  }

  let contentShorthandValue = content
  if (
    contentShorthandValue === undefined &&
    [description, extra, header, meta].some((prop) => !_.isNil(prop))
  ) {
    contentShorthandValue = {}
  }

  return (
    <ElementType {...rest} className={classes}>
      {ItemImage.create(image, { autoGenerateKey: false })}

      {ItemContent.create(contentShorthandValue, {
        autoGenerateKey: false,
        overrideProps: { description, extra, header, meta },
      })}
    </ElementType>
  )
}

Item.Content = ItemContent
Item.Description = ItemDescription
Item.Extra = ItemExtra
Item.Group = ItemGroup
Item.Header = ItemHeader
Item.Image = ItemImage
Item.Meta = ItemMeta

Item.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for ItemContent component. */
  content: customPropTypes.itemShorthand,

  /** Shorthand for ItemDescription component. */
  description: customPropTypes.itemShorthand,

  /** Shorthand for ItemExtra component. */
  extra: customPropTypes.itemShorthand,

  /** Shorthand for ItemHeader component. */
  header: customPropTypes.itemShorthand,

  /** Shorthand for ItemImage component. */
  image: customPropTypes.itemShorthand,

  /** Shorthand for ItemMeta component. */
  meta: customPropTypes.itemShorthand,
}

export default Item
