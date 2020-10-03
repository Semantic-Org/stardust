import React from 'react'

import ComponentExample from 'docs/src/components/ComponentDoc/ComponentExample'
import ExampleSection from 'docs/src/components/ComponentDoc/ExampleSection'

const RatingUsageExamples = () => (
  <ExampleSection title='Usage'>
    <ComponentExample
      title='Controlled'
      description='A rating can be a controlled component.'
      examplePath='modules/Rating/Usage/RatingExampleControlled'
    />
    <ComponentExample
      title='Callbacks'
      description='A rating has callbacks to notify when the rating changes.'
      examplePath='modules/Rating/Usage/RatingExampleCallbacks'
    />
  </ExampleSection>
)

export default RatingUsageExamples
