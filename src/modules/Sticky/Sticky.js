import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { META } from '../../lib'
import StickyContext from './StickyContext'

/**
 * Sticky content stays fixed to the browser viewport while
 * another column of content is visible on the page.
 */
class Sticky extends Component {
  static _meta = {
    name: 'Sticky',
    type: META.TYPES.MODULE,
  }

  static propTypes = {
    as: PropTypes.function,
    children: PropTypes.node,
    className: PropTypes.string,
    pushing: PropTypes.bool,
  }

  static contextTypes = {
    contextEl: PropTypes.node,
  }

  static Context = StickyContext

  componentDidMount() {
    this.contextEl = this.getContextEl()
    this.update()
    window.addEventListener('scroll', this.update)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.update)
  }

  getContextEl() {
    let parent = this.refs.trigger.parentElement

    while (!(
      (parent === document.body) ||
      (parent.classList.contains('ui') && parent.classList.contains('context'))
    )) {
      parent = parent.parentElement
    }

    return parent
  }

  update = () => {
    this.triggerBoundingRect = this.refs.trigger.getBoundingClientRect()
    this.contextBoundingRect = this.contextEl.getBoundingClientRect()
    this.stickyBoundingRect = this.refs.sticky.getBoundingClientRect()
    const state = {
      passed: this.triggerBoundingRect.top < 0,
      arrived: this.stickyBoundingRect.height > this.contextBoundingRect.bottom,
    }

    if (this.props.pushing) {
      if (!state.passed) {
        state.pushing = false
      } else if (state.arrived) {
        state.pushing = true
      } else {
        state.pushing = this.state.pushing
      }
    }

    this.setState(state)
  }

  getStyle = () => {
    const style = {}

    if (this.state && this.state.passed) {
      style.position = 'fixed'
      style.width = this.triggerBoundingRect.width

      if (this.state.arrived) {
        style.top = this.contextBoundingRect.bottom - this.stickyBoundingRect.height
      } else {
        style.top = 0
      }
    }

    return style
  }

  render() {
    return (
      <div {...this.props}>
        <div ref='trigger' />
        <div ref='sticky' style={this.getStyle()}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Sticky
