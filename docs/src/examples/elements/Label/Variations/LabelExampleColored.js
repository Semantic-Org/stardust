import capitalize from 'lodash/capitalize'
import React from 'react'
import { Label } from 'semantic-ui-react'

const colors = [
  'red',
  'orange',
  'yellow',
  'olive',
  'green',
  'teal',
  'blue',
  'violet',
  'purple',
  'pink',
  'brown',
  'grey',
  'black',
]

const LabelExampleColored = () => (
  <div>
    {colors.map((color) => (
      <Label color={color} key={color}>
        {capitalize(color)}
      </Label>
    ))}
  </div>
)

export default LabelExampleColored
