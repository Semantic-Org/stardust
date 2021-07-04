import faker from 'faker'
import React from 'react'

import Item from 'src/views/Item/Item'
import ItemContent from 'src/views/Item/ItemContent'
import ItemDescription from 'src/views/Item/ItemDescription'
import ItemExtra from 'src/views/Item/ItemExtra'
import ItemGroup from 'src/views/Item/ItemGroup'
import ItemHeader from 'src/views/Item/ItemHeader'
import ItemImage from 'src/views/Item/ItemImage'
import ItemMeta from 'src/views/Item/ItemMeta'
import * as common from 'test/specs/commonTests'

describe('Item', () => {
  common.isConformant(Item)
  common.hasSubcomponents(Item, [
    ItemContent,
    ItemDescription,
    ItemExtra,
    ItemGroup,
    ItemHeader,
    ItemImage,
    ItemMeta,
  ])
  common.rendersChildren(Item, {
    rendersContent: false,
  })

  common.implementsShorthandProp(Item, {
    autoGenerateKey: false,
    propKey: 'image',
    ShorthandComponent: ItemImage,
    mapValueToProps: (val) => ({ src: val }),
  })

  common.implementsShorthandProp(Item, {
    autoGenerateKey: false,
    propKey: 'content',
    ShorthandComponent: ItemContent,
    mapValueToProps: (val) => ({ content: val }),
  })

  describe('content prop', () => {
    it('renders ItemContent component', () => {
      shallow(<Item content={faker.hacker.phrase()} />).should.have.descendants('ItemContent')
    })
  })

  describe('description prop', () => {
    it('renders ItemContent component', () => {
      shallow(<Item description={faker.hacker.phrase()} />).should.have.descendants('ItemContent')
    })
  })

  describe('extra prop', () => {
    it('renders ItemContent component', () => {
      shallow(<Item extra={faker.hacker.phrase()} />).should.have.descendants('ItemContent')
    })
  })

  describe('header prop', () => {
    it('renders ItemContent component', () => {
      shallow(<Item header={faker.hacker.phrase()} />).should.have.descendants('ItemContent')
    })
  })

  describe('image prop', () => {
    it('renders ItemImage component', () => {
      shallow(<Item image={faker.image.imageUrl()} />).should.have.descendants('ItemImage')
    })
  })

  describe('meta prop', () => {
    it('renders ItemContent component', () => {
      shallow(<Item meta={faker.hacker.phrase()} />).should.have.descendants('ItemContent')
    })
  })
})
