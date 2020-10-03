import cx from 'clsx'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import {
  // eslint-disable-next-line camelcase
  deprecated_UIContext,
  ModernAutoControlledComponent as Component,
  getElementType,
  getUnhandledProps,
  SUI,
  useKeyOnly,
} from '../../lib'
import RatingIcon from './RatingIcon'

/**
 * A rating indicates user interest in content.
 */
export default class Rating extends Component {
  handleIconClick = (e, { index }) => {
    const { clearable, disabled, maxRating } = this.props
    const { rating } = this.state
    if (disabled) return

    // default newRating is the clicked icon
    // allow toggling a binary rating
    // allow clearing ratings
    let newRating = index + 1
    if (clearable === 'auto' && maxRating === 1) {
      newRating = +!rating
    } else if (clearable === true && newRating === rating) {
      newRating = 0
    }

    // set rating
    this.setState({ rating: newRating, isSelecting: false })
    _.invoke(this.props, 'onRate', e, { ...this.props, rating: newRating })
  }

  handleIconMouseEnter = (e, { index }) => {
    if (this.props.disabled) return

    this.setState({ selectedIndex: index, isSelecting: true })
  }

  handleMouseLeave = (...args) => {
    _.invoke(this.props, 'onMouseLeave', ...args)

    if (this.props.disabled) return

    this.setState({ selectedIndex: -1, isSelecting: false })
  }

  render() {
    const { cssFramework } = this.context
    const { className, color, disabled, icon, maxRating, size } = this.props
    const { rating, selectedIndex, isSelecting } = this.state

    const selected = isSelecting && !disabled && selectedIndex >= 0
    const classes = cx(
      'ui',
      icon,
      size,
      useKeyOnly(
        cssFramework === 'fomantic-ui',
        color || (icon === 'star' && 'yellow') || (icon === 'heart' && 'red'),
      ),
      useKeyOnly(disabled, 'disabled'),
      useKeyOnly(selected, 'selected'),
      'rating',
      className,
    )
    const rest = getUnhandledProps(Rating, this.props)
    const ElementType = getElementType(Rating, this.props)

    return (
      <ElementType
        {...rest}
        className={classes}
        role='radiogroup'
        onMouseLeave={this.handleMouseLeave}
        tabIndex={disabled ? 0 : -1}
      >
        {_.times(maxRating, (i) => (
          <RatingIcon
            tabIndex={disabled ? -1 : 0}
            active={rating >= i + 1}
            aria-checked={rating === i + 1}
            aria-posinset={i + 1}
            aria-setsize={maxRating}
            index={i}
            icon={icon}
            key={i}
            onClick={this.handleIconClick}
            onMouseEnter={this.handleIconMouseEnter}
            selected={selectedIndex >= i && isSelecting}
          />
        ))}
      </ElementType>
    )
  }
}

Rating.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Additional classes. */
  className: PropTypes.string,

  /**
   * You can clear the rating by clicking on the current start rating.
   * By default a rating will be only clearable if there is 1 icon.
   * Setting to `true`/`false` will allow or disallow a user to clear their rating.
   */
  clearable: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['auto'])]),

  /** An icon can be colored. Supported only in Fomantic UI. */
  color: PropTypes.oneOf(SUI.COLORS),

  /** The initial rating value. */
  defaultRating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /** You can disable or enable interactive rating.  Makes a read-only rating. */
  disabled: PropTypes.bool,

  /**
   * A rating can use a set of star or heart icons.
   * A rating can support other icons when integration with Fomantic UI is enabled.
   */
  icon: PropTypes.oneOfType([PropTypes.oneOf(['star', 'heart']), PropTypes.string]),

  /** The total number of icons. */
  maxRating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /**
   * Called after user selects a new rating.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and proposed rating.
   */
  onRate: PropTypes.func,

  /** The current number of active icons. */
  rating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /** A progress bar can vary in size. */
  size: PropTypes.oneOf(_.without(SUI.SIZES, 'medium', 'big')),
}

Rating.autoControlledProps = ['rating']

Rating.defaultProps = {
  clearable: 'auto',
  maxRating: 1,
}

// eslint-disable-next-line camelcase
Rating.contextType = deprecated_UIContext

Rating.Icon = RatingIcon
