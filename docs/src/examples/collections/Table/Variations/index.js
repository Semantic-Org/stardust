import React from 'react'
import { Message } from 'semantic-ui-react'

import ExampleSection from 'docs/src/components/ComponentDoc/ExampleSection'
import ComponentExample from 'docs/src/components/ComponentDoc/ComponentExample'

const Variations = () => (
  <ExampleSection title='Variations'>
    <ComponentExample
      title='Single Line'
      description='A table can specify that its cell contents should remain on a single line, and not wrap.'
      examplePath='collections/Table/Variations/TableExampleSingleLine'
    />

    <ComponentExample
      title='Attached'
      description='A table can be attached to other content on a page.'
      examplePath='collections/Table/Variations/TableExampleAttached'
    />

    <ComponentExample
      title='Fixed'
      description={[
        'A table can use fixed a special faster form of table rendering that does not resize table cells based on',
        'content.',
      ].join(' ')}
      examplePath='collections/Table/Variations/TableExampleFixed'
    />
    <ComponentExample examplePath='collections/Table/Variations/TableExampleFixedLine'>
      <Message info>
        Fixed <code>single line</code> tables will automatically ensure content
        that does not fit in a single line will receive "..." ellipsis.
      </Message>
    </ComponentExample>

    <ComponentExample
      title='Stacking'
      description='A table can specify how it stacks table content responsively.'
      examplePath='collections/Table/Variations/TableExampleUnstackable'
    />
    <ComponentExample examplePath='collections/Table/Variations/TableExampleStackable' />

    <ComponentExample
      title='Selectable Row'
      description='A table can have its rows appear selectable.'
      examplePath='collections/Table/Variations/TableExampleSelectableRow'
    />
    <ComponentExample examplePath='collections/Table/Variations/TableExampleSelectableInvertedRow' />

    <ComponentExample
      title='Selectable Cell'
      description='A table cell can be selectable.'
      examplePath='collections/Table/Variations/TableExampleSelectableCell'
    >
      <Message info>
        Using an <code>a</code> link inside a selectable cell will automatically
        make the hit box the entire cell area. By default links will inherit
        their cell color.
      </Message>
    </ComponentExample>

    <ComponentExample
      title='Vertical Alignment'
      description='A table, header, row or cell can adjust its vertical alignment.'
      examplePath='collections/Table/Variations/TableExampleVerticalAlign'
    />

    <ComponentExample
      title='Text Alignment'
      description='A table, header, row, or cell can adjust its text alignment.'
      examplePath='collections/Table/Variations/TableExampleTextAlign'
    />

    <ComponentExample
      title='Striped'
      description='A table can stripe alternate rows of content with a darker color to increase contrast.'
      examplePath='collections/Table/Variations/TableExampleStriped'
    />

    <ComponentExample
      title='Celled'
      description='A table may be divided into individual cells.'
      examplePath='collections/Table/Variations/TableExampleCelled'
    />

    <ComponentExample
      title='Basic'
      description='A table can reduce its complexity to increase readability.'
      examplePath='collections/Table/Variations/TableExampleBasic'
    />
    <ComponentExample examplePath='collections/Table/Variations/TableExampleVeryBasic' />

    <ComponentExample
      title='Collapsing Cell'
      description='A cell can be collapsing so that it only uses as much space as required.'
      examplePath='collections/Table/Variations/TableExampleCollapsingCell'
    />

    <ComponentExample
      title='Column Count'
      description='A table can specify its column count to divide its content evenly.'
      examplePath='collections/Table/Variations/TableExampleColumnCount'
    />

    <ComponentExample
      title='Column Width'
      description='A table can specify the width of individual columns independently.'
      examplePath='collections/Table/Variations/TableExampleColumnWidth'
    />

    <ComponentExample
      title='Collapsing'
      description='A table can be collapsing, taking up only as much space as its rows.'
      examplePath='collections/Table/Variations/TableExampleCollapsing'
    />

    <ComponentExample
      title='Colored'
      description='A table can be given a color to distinguish it from other table.'
      examplePath='collections/Table/Variations/TableExampleColors'
    />

    <ComponentExample
      title='Inverted'
      description="A table's colors can be inverted."
      examplePath='collections/Table/Variations/TableExampleInverted'
    />
    <ComponentExample examplePath='collections/Table/Variations/TableExampleInvertedColors' />

    <ComponentExample
      title='Sortable'
      description='A table can appear to sort its data by column in ascending or descending order.'
      examplePath='collections/Table/Variations/TableExampleSortable'
    />

    <ComponentExample
      title='Full-Width Header / Footer'
      description='A definition table can have a full width header or footer, filling in the gap left by the first column.'
      examplePath='collections/Table/Variations/TableExampleFullWidth'
    />

    <ComponentExample
      title='Padded'
      description='A table may sometimes need to be more padded for legibility.'
      examplePath='collections/Table/Variations/TableExamplePadded'
    />
    <ComponentExample examplePath='collections/Table/Variations/TableExampleVeryPadded' />

    <ComponentExample
      title='Compact'
      description='A table may sometimes need to be more compact to make more rows visible at a time.'
      examplePath='collections/Table/Variations/TableExampleCompact'
    />
    <ComponentExample examplePath='collections/Table/Variations/TableExampleVeryCompact' />

    <ComponentExample
      title='Size'
      description='A table can also be small or large.'
      examplePath='collections/Table/Variations/TableExampleSmall'
    />
    <ComponentExample examplePath='collections/Table/Variations/TableExampleLarge' />

    <ComponentExample
      title='TableData'
      description='A table can receive a JSON object to create body rows.'
      examplePath='collections/Table/Variations/TableExampleTableData'
    >
      <Message info>
        Using the <code>tableData</code> attribute requires also to define the
        Tables
        <code>renderBodyRow</code> attribute.
      </Message>
    </ComponentExample>
  </ExampleSection>
)

export default Variations
