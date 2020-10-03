import React from 'react'

import ComponentExample from 'docs/src/components/ComponentDoc/ComponentExample'
import ExampleSection from 'docs/src/components/ComponentDoc/ExampleSection'

const RatingStatesExamples = () => (
  <ExampleSection title='States'>
    <ComponentExample
      title='Disabled'
      description='A rating can be disabled.'
      examplePath='modules/Rating/States/RatingExampleDisabled'
    />
  </ExampleSection>
)

export default RatingStatesExamples
