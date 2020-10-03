import React from 'react'

import ComponentExample from 'docs/src/components/ComponentDoc/ComponentExample'
import ExampleSection from 'docs/src/components/ComponentDoc/ExampleSection'

const RatingTypesExamples = () => (
  <ExampleSection title='Types'>
    <ComponentExample
      title='Rating'
      description='A basic rating.'
      examplePath='modules/Rating/Types/RatingExampleRating'
    />
    <ComponentExample
      title='Star'
      description='A rating can use a set of star icons.'
      examplePath='modules/Rating/Types/RatingExampleStar'
    />
    <ComponentExample
      title='Heart'
      description='A rating can use a set of heart icons.'
      examplePath='modules/Rating/Types/RatingExampleHeart'
    />
    <ComponentExample
      title='Clearable'
      description='A rating can be cleared by clicking again.'
      examplePath='modules/Rating/Types/RatingExampleClearable'
    />
  </ExampleSection>
)

export default RatingTypesExamples
