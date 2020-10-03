import cx from 'clsx'
import keyboardKey from 'keyboard-key'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

// eslint-disable-next-line camelcase
import { deprecated_UIContext, getElementType, getUnhandledProps, useKeyOnly } from '../../lib'

/**
 * An internal icon sub-component for Rating component
 */
export default class RatingIcon extends Component {
  handleClick = (e) => {
    _.invoke(this.props, 'onClick', e, this.props)
  }

  handleKeyUp = (e) => {
    _.invoke(this.props, 'onKeyUp', e, this.props)

    switch (keyboardKey.getCode(e)) {
      case keyboardKey.Enter:
      case keyboardKey.Spacebar:
        e.preventDefault()
        _.invoke(this.props, 'onClick', e, this.props)
        break
      default:
    }
  }

  handleMouseEnter = (e) => {
    _.invoke(this.props, 'onMouseEnter', e, this.props)
  }

  render() {
    const { cssFramework } = this.context
    const { active, className, icon, selected } = this.props

    const classes = cx(
      useKeyOnly(active, 'active'),
      useKeyOnly(selected, 'selected'),
      useKeyOnly(cssFramework === 'fomantic-ui', icon || 'star'),
      'icon',
      className,
    )
    const rest = getUnhandledProps(RatingIcon, this.props)
    const ElementType = getElementType(RatingIcon, this.props)

    return (
      <ElementType
        {...rest}
        className={classes}
        onClick={this.handleClick}
        onKeyUp={this.handleKeyUp}
        onMouseEnter={this.handleMouseEnter}
        role='radio'
      />
    )
  }
}

RatingIcon.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Indicates activity of an icon. */
  active: PropTypes.bool,

  /** Additional classes. */
  className: PropTypes.string,

  /** An index of icon inside Rating. */
  index: PropTypes.number,

  /** A rating can use a set of star or heart icons. */
  icon: PropTypes.oneOfType([PropTypes.oneOf(['star', 'heart']), PropTypes.string]),

  /**
   * Called on click.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClick: PropTypes.func,

  /**
   * Called on keyup.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onKeyUp: PropTypes.func,

  /**
   * Called on mouseenter.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onMouseEnter: PropTypes.func,

  /** Indicates selection of an icon. */
  selected: PropTypes.bool,
}

RatingIcon.defaultProps = {
  as: 'i',
}

// eslint-disable-next-line camelcase
RatingIcon.contextType = deprecated_UIContext
