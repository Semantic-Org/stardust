import React from 'react'
import { Image, Rail, Segment } from 'stardust'

const RailAttachedInternalExample = () => (
  <Segment>
    <Image src='http://semantic-ui.com/images/wireframe/paragraph.png' />

    <Rail attached internal position='left'>
      <Segment>Left Rail Content</Segment>
    </Rail>

    <Rail attached internal position='right'>
      <Segment>Right Rail Content</Segment>
    </Rail>
  </Segment>
)

export default RailAttachedInternalExample
