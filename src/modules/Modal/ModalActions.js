import cx from 'classnames'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  customPropTypes,
  getElementType,
  getUnhandledProps,
  META,
} from '../../lib'
import Button from '../../elements/Button'

const ElementType = getElementType()

/**
 * A modal can contain a row of actions.
 */
export default class ModalActions extends Component {
  static propTypes = {
    /** An element type to render as (string or function). */
    as: customPropTypes.as,

    /** Array of shorthand buttons. */
    actions: customPropTypes.collectionShorthand,

    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string,

    /**
     * Action onClick handler when using shorthand `actions`.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props from the clicked action.
     */
    onActionClick: customPropTypes.every([
      customPropTypes.disallow(['children']),
      PropTypes.func,
    ]),
  }

  static _meta = {
    name: 'ModalActions',
    type: META.TYPES.MODULE,
    parent: 'Modal',
  }

  handleButtonOverrides = predefinedProps => ({
    onClick: (e, buttonProps) => {
      _.invoke(predefinedProps, 'onClick', e, buttonProps)
      _.invoke(this.props, 'onActionClick', e, buttonProps)
    },
  })

  render() {
    const { actions, children, className } = this.props
    const classes = cx('actions', className)
    const rest = getUnhandledProps(ModalActions, this.props)

    if (!childrenUtils.isNil(children)) return <ElementType {...rest} className={classes}>{children}</ElementType>

    return (
      <ElementType {...rest} className={classes}>
        {_.map(actions, action => Button.create(action, { overrideProps: this.handleButtonOverrides }))}
      </ElementType>
    )
  }
}

ModalActions.create = createShorthandFactory(ModalActions, actions => ({ actions }))
