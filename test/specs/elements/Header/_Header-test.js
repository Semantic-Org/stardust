import React from 'react'

import _Header from 'src/elements/Header/_Header'
import * as common from 'test/specs/commonTests'

describe.only('_Header', () => {
  common.hasUIClassName(_Header)
  common.rendersChildren(_Header)

  common.propKeyOnlyToClassName(_Header, 'dividing')
  common.propKeyOnlyToClassName(_Header, 'block')
  common.propKeyOnlyToClassName(_Header, 'inverted')
  common.propKeyOnlyToClassName(_Header, 'disabled')

  common.propKeyAndValueToClassName(_Header, 'floated')
  common.propKeyOrValueToClassName(_Header, 'attached')

  common.propValueOnlyToClassName(_Header, 'color')

  common.implementsAlignedProp(_Header)
})
