import _ from 'lodash'
import React, { Component, PropTypes } from 'react'

import { Icon, Popup, Table } from 'src'
import { SUI } from 'src/lib'

const descriptionExtraStyle = {
  fontSize: '0.95em',
  color: '#777',
}

const getTagType = tag => tag.type.type === 'AllLiteral' ? 'any' : tag.type.name

/**
 * Displays a table of a Component's PropTypes.
 */
export default class ComponentProps extends Component {
  static propTypes = {
    /**
     * A single Component's prop info as generated by react-docgen.
     * @type {object} Props info object where keys are prop names and values are prop definitions.
     */
    props: PropTypes.object,
    /**
     * A single Component's meta info.
     * @type {object} Meta info object where enum prop values are defined.
     */
    meta: PropTypes.object,
  }

  state = {
    showEnumsFor: {},
  }

  toggleEnumsFor = (prop) => () => {
    this.setState({
      showEnumsFor: {
        ...this.state.showEnumsFor,
        [prop]: !this.state.showEnumsFor[prop],
      },
    })
  }

  renderName = item => <code>{item.name}</code>

  renderRequired = item => item.required && (
    <Popup
      position='right center'
      style={{ padding: '0.5em' }}
      trigger={<Icon size='small' color='red' name='asterisk' />}
      content='Required'
      size='tiny'
      inverted
    />
  )

  renderDefaultValue = item => {
    const defaultValue = _.get(item, 'defaultValue.value')
    if (_.isNil(defaultValue)) return null

    return <code>{defaultValue}</code>
  }

  renderFunctionSignature = (item) => {
    const params = _.filter(item.tags, { title: 'param' })
    const returns = _.find(item.tags, { title: 'returns' })

    // this doesn't look like a function propType doc block
    // don't try to render a signature
    if (_.isEmpty(params) && !returns) return

    const paramSignature = params
      .map(param => `${param.name}: ${getTagType(param)}`)
      .join(', ')

    const tagDescriptions = _.compact([...params, returns]).map(tag => (
      <div style={{ color: '#888' }} key={tag.name}>
        <strong>{tag.name || tag.title}</strong> - {tag.description}
      </div>
    ))

    const signature = (
      <pre><code>{item.name}({paramSignature}){returns ? `: ${getTagType(returns)}` : ''}</code></pre>
    )

    return (
      <div>
        <strong>Signature:</strong>
        {signature}
        {tagDescriptions}
      </div>
    )
  }

  expandEnums = (value) => {
    const parts = value.split('.')
    if (parts[0] === 'SUI') {
      return SUI[parts[1]]
    }
    return value
  }

  renderEnums = (item) => {
    if (item.type !== '{enum}') return

    const { showEnumsFor } = this.state
    const truncateAt = 30

    if (!item.value) return null

    const values = [].concat(item.value).reduce((accumulator, v) => {
      return accumulator.concat(this.expandEnums(_.trim(v.value || v, '.\'')))
    }, [])

    // show all if there are few
    if (values.length < truncateAt) {
      return (
        <p style={descriptionExtraStyle}>
          <strong>Enums: </strong> {values.join(', ')}
        </p>
      )
    }

    // add button to show more when there are many values and it is not toggled
    if (!showEnumsFor[item.name]) {
      return (
        <p style={descriptionExtraStyle}>
          <strong>Enums: </strong>
          <a style={{ cursor: 'pointer' }} onClick={this.toggleEnumsFor(item.name)}>
            Show all {values.length}
          </a>
          <div>{values.slice(0, truncateAt - 1).join(', ')}...</div>
        </p>
      )
    }

    // add "show more" button when there are many
    return (
      <p style={descriptionExtraStyle}>
        <strong>Enums: </strong>
        <a style={{ cursor: 'pointer' }} onClick={this.toggleEnumsFor(item.name)}>
          Show less
        </a>
        <div>{values.join(', ')}</div>
      </p>
    )
  }

  renderRow = item => {
    return (
      <Table.Row key={item.name}>
        <Table.Cell>{this.renderName(item)}{this.renderRequired(item)}</Table.Cell>
        <Table.Cell>{this.renderDefaultValue(item)}</Table.Cell>
        <Table.Cell>{item.type}</Table.Cell>
        <Table.Cell>
          {item.description && (
            <p>{item.description}</p>
          )}
          {this.renderFunctionSignature(item)}
          {this.renderEnums(item)}
        </Table.Cell>
      </Table.Row>
    )
  }

  render() {
    const { props: propsDefinition } = this.props

    const content = _.sortBy(_.map(propsDefinition, (config, name) => {
      const value = _.get(config, 'type.value')
      let type = _.get(config, 'type.name')
      if (type === 'union') {
        type = _.map(value, (val) => val.name).join('|')
      }
      type = type && `{${type}}`

      const description = _.get(config, 'docBlock.description', '')

      return {
        name,
        type,
        value,
        tags: _.get(config, 'docBlock.tags'),
        required: config.required,
        defaultValue: config.defaultValue,
        description: description && description.split('\n').map(l => ([l, <br key={l} />])),
      }
    }), 'name')

    return (
      <Table compact basic='very'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Default</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(content, this.renderRow)}
        </Table.Body>
      </Table>
    )
  }
}
