import cx from 'classnames'
import React, { PropTypes } from 'react'

import {
  createShorthand,
  customPropTypes,
  getElementType,
  getUnhandledProps,
  META,
} from '../../lib/index'
import FeedContent from './FeedContent'
import FeedLabel from './FeedLabel'

function FeedEvent(props) {
  const { content, children, className, date, extraImages, extraText, image, icon, meta, summary } = props
  const classes = cx(className, 'event')
  const rest = getUnhandledProps(FeedEvent, props)
  const ElementType = getElementType(FeedEvent, props)

  const hasContentProp = content || date || extraImages || extraText || meta || summary
  const contentProps = { content, date, extraImages, extraText, meta, summary }

  return (
    <ElementType {...rest} className={classes}>
      {createShorthand(FeedLabel, val => ({ icon: val }), icon)}
      {createShorthand(FeedLabel, val => ({ image: val }), image)}
      {hasContentProp && <FeedContent {...contentProps} />}
      {children}
    </ElementType>
  )
}

FeedEvent._meta = {
  name: 'FeedEvent',
  parent: 'Feed',
  type: META.TYPES.VIEW,
}

FeedEvent.propTypes = {
  /** An element type to render as (string or function). */
  as: customPropTypes.as,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for FeedContent. */
  content: FeedContent.propTypes.content,

  /** Shorthand for FeedDate. */
  date: FeedContent.propTypes.date,

  /** Shorthand for FeedExtra with images. */
  extraImages: FeedContent.propTypes.extraImages,

  /** Shorthand for FeedExtra with content. */
  extraText: FeedContent.propTypes.extraText,

  /** An event can contain icon label. */
  icon: customPropTypes.itemShorthand,

  /** An event can contain image label. */
  image: customPropTypes.itemShorthand,

  /** Shorthand for FeedMeta. */
  meta: FeedContent.propTypes.meta,

  /** Shorthand for FeedSummary. */
  summary: FeedContent.propTypes.summary,
}

export default FeedEvent
