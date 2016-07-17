import _ from 'lodash/fp'
import React, { Component } from 'react'
import { routerShape } from 'react-router'

import * as stardust from 'stardust'
import { typeOrder } from 'docs/app/utils'
import META from 'src/utils/Meta'

const { Menu, Input } = stardust

export default class Sidebar extends Component {
  static contextTypes = {
    router: routerShape,
  }
  state = { query: '' }

  handleSearchChange = e => this.setState({ query: e.target.value })

  renderItemsByType = (type) => {
    const { router } = this.context
    const items = _.flow(
      _.filter(_.overEvery([
        META.isParent,
        META.isType(type),
        ({ _meta }) => new RegExp(this.state.query, 'i').test(_meta.name),
      ])),
      _.sortBy('_meta.name'),
      _.map(({ _meta }) => {
        const route = `${_meta.type}s/${_.kebabCase(_meta.name)}`

        return (
          <Menu.Item key={_meta.name} name={_meta.name} onClick={() => router.push(route)} />
        )
      })
    )(stardust)

    return _.isEmpty(items) ? [] : (
      <div className='item' key={type}>
        <div className='header'>{_.capitalize(type)}s</div>
        <div className='menu'>{items}</div>
      </div>
    )
  }

  render() {
    return (
      <Menu className='inverted secondary vertical fluid' style={{ margin: 0 }}>
        <Menu.Item>
          <Input
            className='transparent inverted icon'
            icon='search'
            placeholder='Search'
            iconClass='search link icon'
            onChange={this.handleSearchChange}
          />
        </Menu.Item>
        {_.map(this.renderItemsByType, typeOrder)}
      </Menu>
    )
  }
}
