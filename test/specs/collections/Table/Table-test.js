import React from 'react'

import Table from 'src/collections/Table/Table'
import TableBody from 'src/collections/Table/TableBody'
import TableCell from 'src/collections/Table/TableCell'
import TableFooter from 'src/collections/Table/TableFooter'
import TableHeader from 'src/collections/Table/TableHeader'
import TableHeaderCell from 'src/collections/Table/TableHeaderCell'
import TableRow from 'src/collections/Table/TableRow'
import { SUI } from 'src/lib'
import * as common from 'test/specs/commonTests'
import * as _ from 'lodash'

describe('Table', () => {
  common.isConformant(Table)
  common.hasSubcomponents(Table, [
    TableBody,
    TableCell,
    TableFooter,
    TableHeader,
    TableHeaderCell,
    TableRow,
  ])
  common.hasUIClassName(Table)
  common.rendersChildren(Table, {
    rendersContent: false,
  })

  common.implementsWidthProp(Table, SUI.WIDTHS, {
    canEqual: false,
    propKey: 'columns',
    widthClass: 'column',
  })

  common.implementsTextAlignProp(Table, ['left', 'center', 'right'])
  common.implementsVerticalAlignProp(Table)

  common.propKeyOnlyToClassName(Table, 'celled')
  common.propKeyOnlyToClassName(Table, 'collapsing')
  common.propKeyOnlyToClassName(Table, 'definition')
  common.propKeyOnlyToClassName(Table, 'fixed')
  common.propKeyOnlyToClassName(Table, 'inverted')
  common.propKeyOnlyToClassName(Table, 'selectable')
  common.propKeyOnlyToClassName(Table, 'singleLine', {
    className: 'single line',
  })
  common.propKeyOnlyToClassName(Table, 'stackable')
  common.propKeyOnlyToClassName(Table, 'sortable')
  common.propKeyOnlyToClassName(Table, 'striped')
  common.propKeyOnlyToClassName(Table, 'structured')
  common.propKeyOnlyToClassName(Table, 'unstackable')

  common.propKeyOrValueAndKeyToClassName(Table, 'attached', ['top', 'bottom'])
  common.propKeyOrValueAndKeyToClassName(Table, 'basic', ['very'])
  common.propKeyOrValueAndKeyToClassName(Table, 'compact', ['very'])
  common.propKeyOrValueAndKeyToClassName(Table, 'padded', ['very'])

  common.propValueOnlyToClassName(Table, 'color', SUI.COLORS)
  common.propValueOnlyToClassName(
    Table,
    'size',
    _.without(SUI.SIZES, 'mini', 'tiny', 'medium', 'big', 'huge', 'massive'),
  )

  describe('as', () => {
    it('renders as a table by default', () => {
      shallow(<Table />).should.have.tagName('table')
    })
  })

  describe('shorthand', () => {
    let wrapper
    let thead
    let tbody
    let tfoot

    beforeEach(() => {
      wrapper = undefined
      thead = undefined
      tbody = undefined
      tfoot = undefined
    })

    const headerRow = ['Name', 'Status', 'Notes']

    const renderBodyRow = ({ name, status, notes }, index) => ({
      key: index,
      cells: [name || { key: 0 }, status || { key: 1 }, notes || { key: 2 }],
    })

    const footerRow = [{ colSpan: 3, content: 'Total', key: 'total' }]

    const tableData = [
      { name: undefined, status: undefined, notes: undefined },
      { name: 'Jimmy', lastName: 'Hendrix', status: 'Requires Action', notes: undefined },
      { name: 'Jamie', lastName: 'Lannister', status: undefined, notes: 'Hostile' },
      { name: 'Jill', lastName: undefined, status: undefined, notes: undefined },
    ]

    const tableDataWithSameCellContentInSiblingCells = [
      { name: undefined, status: 'repeat', notes: 'repeat' },
      { name: 'Jimmy', status: 'Requires Action', notes: undefined },
      { name: 'Jamie', status: undefined, notes: 'Hostile' },
      { name: 'Jill', status: undefined, notes: undefined },
    ]

    const renderBodyRowWithSpan = ({ name, lastName, status, notes }, index) => ({
      key: index,
      cells: [
        name || { key: 0 },
        lastName || { key: 1 },
        status || { key: 2 },
        notes || { key: 3 },
      ],
    })

    const headerRows = [
      {
        key: 0,
        cells: [
          { key: 'fullname', colSpan: 2, content: 'Full Name' },
          { key: 'status', rowSpan: 2, content: 'Status' },
          { key: 'notes', rowSpan: 2, content: 'Notes' },
        ],
      },
      { key: 1, cells: ['First Name', 'Last Name'] },
    ]

    const wrapperMount = (props) => {
      wrapper = mount(<Table {...props} />)

      thead = wrapper.find('thead')
      tbody = wrapper.find('tbody')
      tfoot = wrapper.find('tfoot')
    }

    it('renders empty tbody with no shorthand', () => {
      wrapperMount()

      thead.should.have.lengthOf(0)

      tbody.should.have.lengthOf(1)
      tbody.find('tr').should.have.lengthOf(0)

      tfoot.should.have.lengthOf(0)
    })

    it('renders the table', () => {
      wrapperMount({ headerRow, renderBodyRow, footerRow, tableData })

      thead.should.have.lengthOf(1)
      thead.find('tr').should.have.lengthOf(1)
      thead.find('tr').find('th').should.have.lengthOf(headerRow.length)

      tbody.should.have.lengthOf(1)
      tbody.find('tr').should.have.lengthOf(tableData.length)
      tbody.find('tr').first().find('td').should.have.lengthOf(3)

      tfoot.should.have.lengthOf(1)
      tfoot.find('tr').should.have.lengthOf(1)
      tfoot.find('tr').find('td').should.have.lengthOf(footerRow.length)
    })

    it('renders the table with 2 lines header', () => {
      wrapperMount({ renderBodyRow: renderBodyRowWithSpan, footerRow, tableData, headerRows })

      thead.should.have.lengthOf(1)
      thead.find('tr').should.have.lengthOf(2)
      thead.find('tr').at(0).find('th').should.have.lengthOf(3)
      thead.find('tr').at(1).find('th').should.have.lengthOf(2)

      tbody.should.have.lengthOf(1)
      tbody.find('tr').should.have.lengthOf(tableData.length)
      tbody.find('tr').first().find('td').should.have.lengthOf(4)

      tfoot.should.have.lengthOf(1)
      tfoot.find('tr').should.have.lengthOf(1)
      tfoot.find('tr').find('td').should.have.lengthOf(footerRow.length)
    })

    it('renders table data with same string content in sibling cells', () => {
      wrapperMount({
        headerRow,
        renderBodyRow,
        tableData: tableDataWithSameCellContentInSiblingCells,
      })
    })
  })
})
