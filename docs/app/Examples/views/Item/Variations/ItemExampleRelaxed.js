import React from 'react'
import { Item } from 'semantic-ui-react'

const ItemExampleRelaxed = () => (
  <Item.Group relaxed>
    <Item>
      <Item.Image size='tiny' src='/assets/images/wireframe/image.png' />

      <Item.Content verticalAlign='middle'>
        <Item.Header as='a'>12 Years a Slave</Item.Header>
      </Item.Content>
    </Item>

    <Item>
      <Item.Image size='tiny' src='/assets/images/wireframe/image.png' />

      <Item.Content verticalAlign='middle'>
        <Item.Header as='a'>My Neighbor Totoro</Item.Header>
      </Item.Content>
    </Item>

    <Item>
      <Item.Image size='tiny' src='/assets/images/wireframe/image.png' />

      <Item.Content verticalAlign='middle'>
        <Item.Header as='a'>Watchmen</Item.Header>
      </Item.Content>
    </Item>
  </Item.Group>
)

export default ItemExampleRelaxed
