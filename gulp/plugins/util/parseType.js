const _ = require('lodash')
const { names } = require('../../../src/elements/Flag/Flag') // eslint-disable-line no-unused-vars
const SUI = require('../../../src/lib/SUI') // eslint-disable-line no-unused-vars

const evalValue = value => eval(value) // eslint-disable-line no-eval

const isTransformable = value => typeof value === 'string' && (value.includes('SUI') || value.includes('names'))

const uniqValues = values => _.uniqWith(values, (val, other) => `${val}` === `${other}`)

const transformEnumValues = values => _.flatMap(values, ({ value }) => {
  if (value === 'names') return evalValue(value)
  if (_.startsWith(value, '...SUI')) return evalValue(value.substring(3))
  return value.replace(/'/g, '')
})

const parseEnum = (type) => {
  const { value } = type

  if (isTransformable(value)) return { ...type, value: uniqValues(evalValue(value)) }
  return { ...type, value: uniqValues(transformEnumValues(value)) }
}

const parseUnion = (union) => {
  const { value } = union
  const values = _.flatten(_.map(
    _.filter(value, { name: 'enum' }),
    type => parseEnum(type).value,
  ))

  return {
    ...union,
    name: _.map(value, 'name').join('|'),
    value: values,
  }
}

export default (propName, { type }) => {
  if (type === undefined) {
    throw new Error([
      `The prop "${propName}" does not contain propType definition. This happens if the property is in the `,
      'defaultProps, but it is not in the propTypes',
    ].join(' '))
  }
  if (type.name === 'enum') return parseEnum(type)
  if (type.name === 'union') return parseUnion(type)

  return type
}
