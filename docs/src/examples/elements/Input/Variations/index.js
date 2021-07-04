import React from 'react'
import ComponentExample from 'docs/src/components/ComponentDoc/ComponentExample'
import ExampleSection from 'docs/src/components/ComponentDoc/ExampleSection'
import { Message } from 'semantic-ui-react'

const InputVariationsExamples = () => (
  <ExampleSection title='Variations'>
    <ComponentExample
      title='Input Element'
      description='You can pass props (specially data attributes) to input by including an input element in children.'
      examplePath='elements/Input/Variations/InputExampleInputElement'
    />
    <ComponentExample
      title='Icon'
      description='An input can be formatted with an icon.'
      examplePath='elements/Input/Variations/InputExampleIcon'
    />
    <ComponentExample
      description='You can position the icon.'
      examplePath='elements/Input/Variations/InputExampleIconPosition'
    />
    <ComponentExample
      description='You can pass an Icon props object.'
      examplePath='elements/Input/Variations/InputExampleIconProps'
    />
    <ComponentExample
      description='You can pass an Icon element.'
      examplePath='elements/Input/Variations/InputExampleIconElement'
    />
    <ComponentExample
      description='You can pass an Icon child.'
      examplePath='elements/Input/Variations/InputExampleIconChild'
    >
      <Message warning>
        When using <code>children</code>, you must add a placeholder{' '}
        <code>{'<input />'}</code>.
      </Message>
    </ComponentExample>
    <ComponentExample
      title='Labeled'
      description='An input can be formatted with a label.'
      examplePath='elements/Input/Variations/InputExampleLabeled'
    />
    <ComponentExample
      description='You can pass any element.'
      examplePath='elements/Input/Variations/InputExampleRightLabeled'
    />
    <ComponentExample
      description='You can pass a Label props object.'
      examplePath='elements/Input/Variations/InputExampleRightLabeledBasic'
    />
    <ComponentExample
      description='You can pass a Label child.'
      examplePath='elements/Input/Variations/InputExampleRightLeftLabeled'
    >
      <Message warning>
        Multiple Labels require <code>children</code>. When using{' '}
        <code>children</code>, you must add a placeholder{' '}
        <code>{'<input />'}</code>.
      </Message>
    </ComponentExample>
    <ComponentExample examplePath='elements/Input/Variations/InputExampleRightLabeledTag' />
    <ComponentExample examplePath='elements/Input/Variations/InputExampleLeftCornerLabeled' />
    <ComponentExample examplePath='elements/Input/Variations/InputExampleRightCornerLabeled' />
    <ComponentExample
      title='Action'
      description='An input can be formatted to alert the user to an action they may perform.'
      examplePath='elements/Input/Variations/InputExampleAction'
    />
    <ComponentExample
      description='You can pass a Button props object.'
      examplePath='elements/Input/Variations/InputExampleLeftActionLabeledButton'
    />
    <ComponentExample
      description='You can pass any element.'
      examplePath='elements/Input/Variations/InputExampleActionDropdown'
    />
    <ComponentExample examplePath='elements/Input/Variations/InputExampleActions'>
      <Message warning>
        Multiple Actions require <code>children</code>. When using{' '}
        <code>children</code>, you must add a placeholder{' '}
        <code>{'<input />'}</code>.
      </Message>
    </ComponentExample>
    <ComponentExample examplePath='elements/Input/Variations/InputExampleActionLabeledButton' />
    <ComponentExample examplePath='elements/Input/Variations/InputExampleActionIconButton' />
    <ComponentExample
      title='Transparent'
      description='A transparent input has no background.'
      examplePath='elements/Input/Variations/InputExampleTransparent'
    />
    <ComponentExample
      title='Inverted'
      description='An input can be formatted to appear on dark backgrounds.'
      examplePath='elements/Input/Variations/InputExampleInverted'
    />
    <ComponentExample
      title='Fluid'
      description='An input can take on the size of its container.'
      examplePath='elements/Input/Variations/InputExampleFluid'
    />
    <ComponentExample
      title='Size'
      description='An input can vary in size.'
      examplePath='elements/Input/Variations/InputExampleSize'
    />
  </ExampleSection>
)

export default InputVariationsExamples
