import * as common from 'test/specs/commonTests'

import Grid from 'src/collections/Grid/Grid'
import GridColumn from 'src/collections/Grid/GridColumn'
import GridRow from 'src/collections/Grid/GridRow'

describe('Grid', () => {
  common.isConformant(Grid)
  common.hasUIClassName(Grid)
  common.hasSubComponents(Grid, [GridRow, GridColumn])
  common.rendersChildren(Grid)

  common.implementsTextAlignProp(Grid)
  common.implementsVerticalAlignProp(Grid)
  common.implementsWidthProp(Grid, {
    canEqual: true,
    propKey: 'columns',
    widthClass: 'column',
  })

  common.propKeyAndValueToClassName(Grid, 'reversed')

  common.propKeyOnlyToClassName(Grid, 'centered')
  common.propKeyOnlyToClassName(Grid, 'container')
  common.propKeyOnlyToClassName(Grid, 'doubling')
  common.propKeyOnlyToClassName(Grid, 'stackable')
  common.propKeyOnlyToClassName(Grid, 'stretched')

  common.propKeyOrValueAndKeyToClassName(Grid, 'celled', ['internally'])
  common.propKeyOrValueAndKeyToClassName(Grid, 'divided', ['vertically'])
  common.propKeyOrValueAndKeyToClassName(Grid, 'padded', ['horizontally', 'vertically'])
  common.propKeyOrValueAndKeyToClassName(Grid, 'relaxed', ['very'])
})
