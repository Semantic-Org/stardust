import React from 'react'
import ComponentExample from 'docs/src/components/ComponentDoc/ComponentExample'
import ContributionPrompt from 'docs/src/components/ComponentDoc/ContributionPrompt'
import ExampleSection from 'docs/src/components/ComponentDoc/ExampleSection'

const DropdownTypesExamples = () => (
  <ExampleSection title='Types'>
    <ComponentExample
      title='Dropdown'
      description='A dropdown.'
      examplePath='modules/Dropdown/Types/DropdownExampleDropdown'
    >
      <ContributionPrompt>
        Dropdown state is not fully managed when using the subcomponent API. The
        shorthand props API fully manages state but needs to be extended to
        support the markup shown here.
      </ContributionPrompt>
    </ComponentExample>
    <ComponentExample
      title='Selection'
      description='A dropdown can be used to select between choices in a form.'
      examplePath='modules/Dropdown/Types/DropdownExampleSelection'
    />
    <ComponentExample
      title='Search Selection'
      description='A selection dropdown can allow a user to search through a large list of choices.'
      examplePath='modules/Dropdown/Types/DropdownExampleSearchSelection'
    />
    <ComponentExample examplePath='modules/Dropdown/Types/DropdownExampleSearchSelectionTwo' />
    {/* Possibly add state selection example. */}
    <ComponentExample
      title='Multiple Selection'
      description='A selection dropdown can allow multiple selections.'
      examplePath='modules/Dropdown/Types/DropdownExampleMultipleSelection'
    />
    <ComponentExample
      title='Multiple Search Selection'
      description='A selection dropdown can allow multiple search selections.
      The dropdown arrow not being on top of the text.'
      examplePath='modules/Dropdown/Types/DropdownExampleInlineclear'
    />

    <ComponentExample
      title='inline Search Selection'
      description='Type something that results in no results found in the dropdown search.'
      examplePath='modules/Dropdown/Types/DropdownExampleMultipleSearchSelection'
    />

    <ComponentExample
      title='Inline'
      description='A dropdown can be formatted to appear inline in other content.'
      examplePath='modules/Dropdown/Types/DropdownExampleInline'
    />
    <ComponentExample
      title='Clearable'
      description='Using the clearable setting will let users remove their selection from a dropdown..'
      examplePath='modules/Dropdown/Types/DropdownExampleClearable'
      suiVersion='2.4.0'
    />
    <ComponentExample examplePath='modules/Dropdown/Types/DropdownExampleClearableMultiple' />
    <ComponentExample
      title='Search Dropdown'
      description='A dropdown can be searchable.'
      examplePath='modules/Dropdown/Types/DropdownExampleSearchDropdown'
    />
    <ComponentExample
      title='Search In-Menu'
      description='A dropdown can include a search prompt inside its menu.'
      examplePath='modules/Dropdown/Types/DropdownExampleSearchInMenu'
    >
      <ContributionPrompt>
        Dropdown state is not fully managed when using the subcomponent API. The
        shorthand props API fully manages state but needs to be extended to
        support the markup shown here.
      </ContributionPrompt>
    </ComponentExample>
    <ComponentExample
      description='A dropdown with multiple selections can include a search prompt inside its menu.'
      examplePath='modules/Dropdown/Types/DropdownExampleMultipleSearchInMenu'
    >
      <ContributionPrompt>
        Dropdown state is not fully managed when using the subcomponent API. The
        shorthand props API fully manages state but needs to be extended to
        support the markup shown here.
      </ContributionPrompt>
    </ComponentExample>
    <ComponentExample examplePath='modules/Dropdown/Types/DropdownExampleInlineTwo' />
    <ComponentExample
      title='Pointing'
      description='A dropdown can be formatted so that its menu is pointing.'
      examplePath='modules/Dropdown/Types/DropdownExamplePointing'
    >
      <ContributionPrompt>
        The example below shows (roughly) the desired markup but is not
        functional since we don't currently support nested dropdowns.
      </ContributionPrompt>
    </ComponentExample>
    <ComponentExample examplePath='modules/Dropdown/Types/DropdownExamplePointingTwo' />
    <ComponentExample
      title='Floating'
      description='A dropdown menu can appear to be floating below an element.'
      examplePath='modules/Dropdown/Types/DropdownExampleFloating'
    />

    <ComponentExample
      title='Simple'
      description='A simple dropdown can open without Javascript.'
      examplePath='modules/Dropdown/Types/DropdownExampleSimple'
    />
  </ExampleSection>
)

export default DropdownTypesExamples
