import * as React from 'react'

import { SemanticShorthandItem } from '../../generic'
import ItemContent, { ItemContentProps } from './ItemContent'
import ItemDescription, { ItemDescriptionProps } from './ItemDescription'
import ItemExtra, { ItemExtraProps } from './ItemExtra'
import ItemGroup from './ItemGroup'
import ItemHeader, { ItemHeaderProps } from './ItemHeader'
import ItemImage, { ItemImageProps } from './ItemImage'
import ItemMeta, { ItemMetaProps } from './ItemMeta'

export interface ItemProps extends StrictItemProps {
  [key: string]: any
}

export interface StrictItemProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for ItemContent component. */
  content?: SemanticShorthandItem<ItemContentProps>

  /** Shorthand for ItemDescription component. */
  description?: SemanticShorthandItem<ItemDescriptionProps>

  /** Shorthand for ItemExtra component. */
  extra?: SemanticShorthandItem<ItemExtraProps>

  /** Shorthand for ItemHeader component. */
  header?: SemanticShorthandItem<ItemHeaderProps>

  /** Shorthand for ItemImage component. */
  image?: SemanticShorthandItem<ItemImageProps>

  /** Shorthand for ItemMeta component. */
  meta?: SemanticShorthandItem<ItemMetaProps>
}

interface ItemComponent extends React.StatelessComponent<ItemProps> {
  Content: typeof ItemContent
  Description: typeof ItemDescription
  Extra: typeof ItemExtra
  Group: typeof ItemGroup
  Header: typeof ItemHeader
  Image: typeof ItemImage
  Meta: typeof ItemMeta
}

declare const Item: ItemComponent

export default Item
