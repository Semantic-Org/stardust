import capitalize from 'lodash/capitalize'
import React from 'react'
import { Label } from 'semantic-ui-react'

const sizes = [
  'mini',
  'tiny',
  'small',
  'medium',
  'large',
  'big',
  'huge',
  'massive',
]

const LabelExampleSize = () => (
  <div>
    {sizes.map((size) => (
      <Label key={size} size={size}>
        {capitalize(size)}
      </Label>
    ))}
  </div>
)

export default LabelExampleSize
