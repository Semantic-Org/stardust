import _ from 'lodash'
import faker from 'faker'
import React from 'react'

import * as common from 'test/specs/commonTests'
import { consoleUtil, domEvent, sandbox } from 'test/utils'
import Label from 'src/elements/Label/Label'
import Dropdown from 'src/modules/Dropdown/Dropdown'
import DropdownDivider from 'src/modules/Dropdown/DropdownDivider'
import DropdownHeader from 'src/modules/Dropdown/DropdownHeader'
import DropdownItem from 'src/modules/Dropdown/DropdownItem'
import DropdownMenu from 'src/modules/Dropdown/DropdownMenu'
import DropdownSearchInput from 'src/modules/Dropdown/DropdownSearchInput'
import DropdownText from 'src/modules/Dropdown/DropdownText'

let attachTo
let options
let wrapper

// ----------------------------------------
// Wrapper
// ----------------------------------------
// we need to unmount the dropdown after every test to ensure all event listeners are cleaned up
// wrap the render methods to update a global wrapper that is unmounted after each test
const wrapperMount = (node, opts) => {
  attachTo = document.createElement('div')
  document.body.appendChild(attachTo)

  wrapper = mount(node, { ...opts, attachTo })
  return wrapper
}
const wrapperShallow = (...args) => (wrapper = shallow(...args))
const wrapperRender = (...args) => (wrapper = render(...args))

// ----------------------------------------
// Options
// ----------------------------------------
const getOptions = (count = 5) =>
  _.times(count, (i) => {
    const text = [i, ..._.times(3, faker.hacker.noun)].join(' ')
    const value = _.snakeCase(text)
    return { text, value }
  })

// -------------------------------
// Common Assertions
// -------------------------------
const dropdownMenuIsClosed = () => {
  wrapper.should.not.have.className('visible')

  const menu = wrapper.find('DropdownMenu')
  try {
    // when shallow rendered
    menu.should.not.have.prop('open', true)
  } catch (err) {
    // when mounted
    menu.should.not.have.className('visible')
  }
}

const dropdownMenuIsOpen = () => {
  wrapper.childAt(0).should.have.className('active')
  wrapper.childAt(0).should.have.className('visible')

  const menu = wrapper.find('DropdownMenu')
  try {
    // when shallow rendered
    menu.should.have.prop('open', true)
  } catch (err) {
    // when mounted
    menu.should.have.className('visible')
  }
}

const nativeEvent = { nativeEvent: { stopImmediatePropagation: _.noop } }

describe.only('Dropdown', () => {
  beforeEach(() => {
    attachTo = undefined
    wrapper = undefined
    options = getOptions()
  })

  afterEach(() => {
    if (wrapper && wrapper.unmount) wrapper.unmount()
    if (attachTo) document.body.removeChild(attachTo)
  })

  common.isConformant(Dropdown)
  common.hasUIClassName(Dropdown)
  common.hasSubcomponents(Dropdown, [
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
    DropdownMenu,
    DropdownSearchInput,
    DropdownText,
  ])

  common.implementsIconProp(Dropdown, {
    assertExactMatch: false,
    autoGenerateKey: false,
  })
  common.implementsShorthandProp(Dropdown, {
    autoGenerateKey: false,
    propKey: 'header',
    ShorthandComponent: DropdownHeader,
    mapValueToProps: (val) => ({ content: val }),
  })

  common.propKeyOnlyToClassName(Dropdown, 'disabled')
  common.propKeyOnlyToClassName(Dropdown, 'error')
  common.propKeyOnlyToClassName(Dropdown, 'loading')
  common.propKeyOnlyToClassName(Dropdown, 'basic')
  common.propKeyOnlyToClassName(Dropdown, 'button')
  common.propKeyOnlyToClassName(Dropdown, 'compact')
  common.propKeyOnlyToClassName(Dropdown, 'fluid')
  common.propKeyOnlyToClassName(Dropdown, 'floating')
  common.propKeyOnlyToClassName(Dropdown, 'inline')
  // TODO: See Dropdown cx notes
  // common.propKeyOnlyToClassName(Dropdown, 'icon')
  common.propKeyOnlyToClassName(Dropdown, 'labeled')
  common.propKeyOnlyToClassName(Dropdown, 'item')
  common.propKeyOnlyToClassName(Dropdown, 'multiple')
  common.propKeyOnlyToClassName(Dropdown, 'search')
  common.propKeyOnlyToClassName(Dropdown, 'selection')
  common.propKeyOnlyToClassName(Dropdown, 'simple')
  common.propKeyOnlyToClassName(Dropdown, 'scrolling')
  common.propKeyOnlyToClassName(Dropdown, 'upward')

  common.propKeyOrValueAndKeyToClassName(Dropdown, 'pointing', [
    'left',
    'right',
    'top',
    'top left',
    'top right',
    'bottom',
    'bottom left',
    'bottom right',
  ])

  describe('defaultSearchQuery', () => {
    it('changes default value of searchQuery', () => {
      shallow(<Dropdown defaultSearchQuery='foo' />).should.have.state('searchQuery', 'foo')
    })
  })

  it('closes on blur', () => {
    wrapperMount(<Dropdown options={options} />).simulate('click')

    dropdownMenuIsOpen()
    wrapper.simulate('blur')
    dropdownMenuIsClosed()
  })

  it('does not close on blur with closeOnBlur set to false', () => {
    wrapperMount(<Dropdown options={options} closeOnBlur={false} />).simulate('click')

    dropdownMenuIsOpen()
    wrapper.simulate('blur')
    dropdownMenuIsOpen()
  })

  it('blurs the Dropdown node on close', () => {
    wrapperMount(<Dropdown options={options} selection defaultOpen />)

    const instance = wrapper.instance()
    sandbox.spy(instance.ref.current, 'blur')

    dropdownMenuIsOpen()
    wrapper.simulate('click')
    dropdownMenuIsClosed()

    instance.ref.current.blur.should.have.been.calledOnce()
  })

  it('blurs the Dropdown node on close by clicking outside component', () => {
    wrapperMount(<Dropdown options={options} selection defaultOpen />)

    const instance = wrapper.instance()
    sandbox.spy(instance.ref.current, 'blur')

    dropdownMenuIsOpen()
    document.body.click()
    dropdownMenuIsClosed()

    instance.ref.current.blur.should.have.been.calledOnce()
  })

  it('does not close on click when search is true and options are empty', () => {
    wrapperMount(<Dropdown options={[]} search selection defaultOpen />)

    const instance = wrapper.instance()
    sandbox.spy(instance.ref.current, 'blur')

    dropdownMenuIsOpen()
    wrapper.simulate('click')
    dropdownMenuIsOpen()
  })

  it('opens on focus', () => {
    wrapperMount(<Dropdown options={options} />)

    dropdownMenuIsClosed()
    wrapper.simulate('focus')
    dropdownMenuIsOpen()
  })

  describe('disabled', () => {
    it('does not open on click', () => {
      wrapperMount(<Dropdown options={options} disabled />)

      dropdownMenuIsClosed()
      wrapper.simulate('click')
      dropdownMenuIsClosed()
    })

    it('does not open on click with pointer events enabled', () => {
      wrapperMount(<Dropdown options={options} disabled style={{ pointerEvents: 'all' }} />)

      dropdownMenuIsClosed()
      wrapper.simulate('click')
      dropdownMenuIsClosed()
    })

    it('does not open on focus', () => {
      wrapperMount(<Dropdown options={options} disabled />)

      dropdownMenuIsClosed()
      wrapper.simulate('focus')
      dropdownMenuIsClosed()
    })
  })

  describe('tabIndex', () => {
    it('defaults to 0', () => {
      wrapperShallow(<Dropdown options={options} />)

      wrapper.childAt(0).should.have.prop('tabIndex', 0)
    })

    it('defaults to -1 when disabled', () => {
      wrapperShallow(<Dropdown disabled options={options} />)

      wrapper.childAt(0).should.have.prop('tabIndex', -1)
    })

    it('applies when defined', () => {
      wrapperShallow(<Dropdown options={options} tabIndex={1} />)

      wrapper.childAt(0).should.have.prop('tabIndex', 1)
    })

    describe('tabIndex', () => {
      it('defaults the search input to 0', () => {
        shallow(<Dropdown options={options} selection search />)
          .find(DropdownSearchInput)
          .should.have.prop('tabIndex', 0)
      })

      it('defaults the disabled search input to -1', () => {
        shallow(<Dropdown disabled options={options} selection search />)
          .find(DropdownSearchInput)
          .should.have.prop('tabIndex', -1)
      })

      it('allows explicitly setting the search input value', () => {
        shallow(<Dropdown options={options} selection search tabIndex={123} />)
          .find(DropdownSearchInput)
          .should.have.prop('tabIndex', 123)
      })

      it('allows explicitly setting the search input value when disabled', () => {
        shallow(<Dropdown disabled options={options} selection search tabIndex={123} />)
          .find(DropdownSearchInput)
          .should.have.prop('tabIndex', 123)
      })

      it('is not present on the root when is search', () => {
        shallow(<Dropdown options={options} selection search />).should.not.have.prop('tabIndex')
      })

      it('is not present on the root when is search and defined', () => {
        shallow(<Dropdown options={options} selection search tabIndex={1} />).should.not.have.prop(
          'tabIndex',
        )
      })
    })
  })

  describe('aria', () => {
    it('should label normal dropdown as a listbox', () => {
      wrapperMount(<Dropdown />)
      wrapper.find('div').at(0).should.have.prop('role', 'listbox')
    })
    it('should label search dropdown as a combobox', () => {
      wrapperMount(<Dropdown search />)
      wrapper.find('div').at(0).should.have.prop('role', 'combobox')
    })
    it('should label search dropdownMenu as a listbox', () => {
      wrapperMount(<Dropdown search />)
      wrapper.find('DropdownMenu').should.have.prop('role', 'listbox')
    })
    it('should label search multiple dropdownMenu as aria-multiselectable', () => {
      wrapperMount(<Dropdown search multiple />)
      wrapper.find('DropdownMenu').should.have.prop('aria-multiselectable', true)
    })
    it('should not label normal dropdownMenu with a role', () => {
      wrapperMount(<Dropdown />)
      wrapper.find('DropdownMenu').should.not.have.prop('role')
    })
    it('should label disabled dropdown as aria-disabled', () => {
      wrapperMount(<Dropdown disabled />)
      wrapper.find('div').at(0).should.have.prop('aria-disabled', true)
    })
    it('should label normal dropdown without aria-disabled', () => {
      wrapperMount(<Dropdown />)
      wrapper.find('div').at(0).should.not.have.prop('aria-disabled')
    })
    it('should label multiple dropdown as aria-multiselectable', () => {
      wrapperMount(<Dropdown multiple />)
      wrapper.find('div').at(0).should.have.prop('aria-multiselectable', true)
    })
    it('should not label multiple search dropdown as aria-multiselectable', () => {
      wrapperMount(<Dropdown search multiple />)
      wrapper.find('div').at(0).should.not.have.prop('aria-multiselectable')
    })
    it('should label normal dropdown without aria-multiselectable', () => {
      wrapperMount(<Dropdown />)
      wrapper.find('div').at(0).should.not.have.prop('aria-multiselectable')
    })
    it('should label loading dropdown as aria-busy', () => {
      wrapperMount(<Dropdown loading />)
      wrapper.find('div').at(0).should.have.prop('aria-busy', true)
    })
    it('should label normal dropdown without aria-busy', () => {
      wrapperMount(<Dropdown />)
      wrapper.find('div').at(0).should.not.have.prop('aria-busy')
    })
    it('should label search dropdown input aria-autocomplete=list', () => {
      wrapperMount(<Dropdown search />)
      wrapper.find('input').should.have.prop('aria-autocomplete', 'list')
    })
    it('should label search dropdown input type=text', () => {
      wrapperMount(<Dropdown search />)
      wrapper.find('input').should.have.prop('type', 'text')
    })
  })

  describe('clearable', () => {
    it('does not clear when value is empty', () => {
      const onChange = sandbox.spy()
      wrapperShallow(<Dropdown clearable onChange={onChange} />)

      wrapper.find('Icon').simulate('click', { stopPropagation: _.noop })
      onChange.should.have.not.been.called()
    })

    it('does not clear when is multiple and value is empty', () => {
      const onChange = sandbox.spy()
      wrapperShallow(<Dropdown clearable multiple onChange={onChange} />)

      wrapper.find('Icon').simulate('click', { stopPropagation: _.noop })
      onChange.should.have.not.been.called()
    })

    it('clears when value is not empty', () => {
      const defaultValue = options[1].value
      const event = { stopPropagation: _.noop }
      const onChange = sandbox.spy()

      wrapperShallow(
        <Dropdown defaultValue={defaultValue} clearable onChange={onChange} options={options} />,
      )
      wrapper.find('Icon').simulate('click', event)

      onChange.should.have.been.calledOnce()
      onChange.should.have.been.calledWithMatch(event, { value: '' })
      wrapper.should.have.state('selectedIndex', 0)
    })

    it('clears when value is multiple and is not empty', () => {
      const defaultValue = _.map(options, 'value')
      const event = { stopPropagation: _.noop }
      const onChange = sandbox.spy()

      wrapperShallow(
        <Dropdown
          defaultValue={defaultValue}
          clearable
          multiple
          onChange={onChange}
          options={options}
        />,
      )
      wrapper.find('Icon').simulate('click', event)

      onChange.should.have.been.calledOnce()
      onChange.should.have.been.calledWithMatch(event, { value: [] })
      wrapper.should.have.state('selectedIndex', 0)
    })
  })

  describe('handleBlur', () => {
    it('passes the event to the onBlur prop', () => {
      const onBlur = sandbox.spy()
      const event = { foo: 'bar' }

      wrapperShallow(<Dropdown onBlur={onBlur} />)
      wrapper.childAt(0).simulate('blur', event)

      onBlur.should.have.been.calledOnce()
      onBlur.should.have.been.calledWithMatch(event)
    })

    it('calls handleChange with the selected option on blur', () => {
      wrapperShallow(<Dropdown selectOnBlur options={options} />)

      const instance = wrapper.instance()
      wrapper.childAt(0).simulate('click', { stopPropagation: _.noop })
      dropdownMenuIsOpen()
      sandbox.spy(instance, 'handleChange')

      const event = { stopPropagation: _.noop }
      wrapper.childAt(0).simulate('blur', event)

      instance.handleChange.should.have.been.calledWithMatch(event, options[0].value)
    })

    it('does not call handleChange if the value has not changed', () => {
      const onChange = sandbox.spy()

      wrapperMount(<Dropdown onChange={onChange} options={options} selectOnBlur />)

      // focus, open and select an item
      wrapper.simulate('click')
      wrapper.simulate('focus')
      dropdownMenuIsOpen()

      wrapper.find('DropdownItem').at(2).simulate('click')
      dropdownMenuIsClosed()
      onChange.should.have.been.calledOnce()

      wrapper.simulate('click')
      wrapper.find('DropdownItem').at(2).simulate('click')
      dropdownMenuIsClosed()
      onChange.should.have.been.calledOnce()
    })

    it('sets focus state to false', () => {
      wrapperShallow(<Dropdown selectOnBlur />)

      wrapper.childAt(0).simulate('blur')
      wrapper.should.have.state('focus', false)
    })

    it('sets searchQuery state to empty', () => {
      wrapperShallow(<Dropdown />)

      wrapper.setState({ searchQuery: 'foo' })
      wrapper.childAt(0).simulate('blur')
      wrapper.should.have.state('searchQuery', '')
    })

    it('does not call onBlur when the mouse is down', () => {
      const onBlur = sandbox.spy()

      wrapperShallow(<Dropdown onBlur={onBlur} selectOnBlur />)

      wrapper.simulate('mousedown')
      wrapper.simulate('blur')

      onBlur.should.not.have.been.called()
    })

    it('does not call makeSelectedItemActive when the mouse is down', () => {
      const spy = sandbox.spy()

      wrapperShallow(<Dropdown onBlur={spy} selectOnBlur />)

      const instance = wrapper.instance()
      sandbox.spy(instance, 'makeSelectedItemActive')

      wrapper.simulate('mousedown')
      wrapper.simulate('blur')

      instance.makeSelectedItemActive.should.not.have.been.called()
    })

    it('does not set focus state when the mouse is down', () => {
      wrapperShallow(<Dropdown />)

      wrapper.setState({ focus: 'foo' })
      wrapper.simulate('mousedown')
      wrapper.simulate('blur')
      wrapper.should.have.state('focus', 'foo')
    })
  })

  describe('handleClose', () => {
    it('is called when open changes to false', () => {
      wrapperMount(<Dropdown options={options} selection />)
      wrapper.simulate('click')
      dropdownMenuIsOpen()

      const instance = wrapper.instance()
      sandbox.spy(instance, 'handleClose')

      wrapper.simulate('click')
      dropdownMenuIsClosed()

      instance.handleClose.should.have.been.calledOnce()
    })

    it('prevents Space from opening a search Dropdown after selecting an item', () => {
      // Prevent a bug where pressing space in another control opens the Dropdown
      // https://github.com/Semantic-Org/Semantic-UI-React/issues/692
      wrapperMount(<Dropdown options={options} search selection />)

      // open, click an item, assert it is active and in the value
      wrapper.simulate('click')
      dropdownMenuIsOpen()

      wrapper.find('DropdownItem').first().simulate('click')
      wrapper.should.have.state('value', options[0].value)
      dropdownMenuIsClosed()

      // The dropdown will be still focused after an item will be selected, we should remove
      // focus from it before
      document.activeElement.blur()

      // doesn't open on space
      wrapper.simulate('keydown', { key: 'Spacebar' })
      wrapper.update()
      dropdownMenuIsClosed()
    })
  })

  describe('closeOnChange', () => {
    it('will close when defined and dropdown is multiple', () => {
      wrapperMount(<Dropdown selection multiple search closeOnChange options={options} />).simulate(
        'click',
      )

      dropdownMenuIsOpen()

      wrapper.find('DropdownItem').first().simulate('click', nativeEvent)

      dropdownMenuIsClosed()
    })

    it('will remain open when undefined and dropdown is multiple', () => {
      wrapperMount(<Dropdown selection multiple search options={options} />).simulate('click')

      dropdownMenuIsOpen()

      wrapper.find('DropdownItem').first().simulate('click', nativeEvent)

      dropdownMenuIsOpen()
    })
  })

  describe('closeOnEscape', () => {
    it('closes the dropdown when Escape key is pressed by default', () => {
      wrapperMount(<Dropdown defaultOpen />)

      dropdownMenuIsOpen()

      domEvent.keyDown(document, { key: 'Escape' })
      dropdownMenuIsClosed()
    })

    it('closes the dropdown when is "true" and Escape key is pressed', () => {
      wrapperMount(<Dropdown defaultOpen closeOnEscape />)

      dropdownMenuIsOpen()

      domEvent.keyDown(document, { key: 'Escape' })
      dropdownMenuIsClosed()
    })

    it('does not close the dropdown when false and Escape key is pressed', () => {
      wrapperMount(<Dropdown defaultOpen closeOnEscape={false} />)

      dropdownMenuIsOpen()

      domEvent.keyDown(document, { key: 'Escape' })
      dropdownMenuIsOpen()
    })
  })

  describe('setSelectedIndex', () => {
    it('will call setSelectedIndex if options change', () => {
      wrapperMount(<Dropdown options={options} />)

      wrapper.simulate('click')
      wrapper.simulate('keydown', { key: 'ArrowDown' })
      wrapper.should.have.state('selectedIndex', 1)

      wrapper.setProps({ options: [] })
      wrapper.should.have.not.state('selectedIndex')
    })

    it('will not call setSelectedIndex if options have not changed', () => {
      wrapperMount(<Dropdown options={options} />)

      wrapper.simulate('click')
      wrapper.simulate('keydown', { key: 'ArrowDown' })
      wrapper.should.have.state('selectedIndex', 1)

      wrapper.setProps({ options })
      wrapper.should.have.state('selectedIndex', 1)
    })
  })

  describe('selectedIndex', () => {
    it('sets "selectedIndex" when an item was selected', () => {
      const option = _.last(options)

      wrapperMount(<Dropdown options={options} search selection />)
      const input = wrapper.find('input.search')

      // open, simulate search and select option
      wrapper.simulate('click')
      wrapper.simulate('keydown', { key: 'ArrowDown' })
      wrapper.should.have.state('selectedIndex', 1)

      input.simulate('change', { target: { value: option.text } })
      wrapper.simulate('keydown', { key: 'Enter' })

      wrapper.should.have.state('selectedIndex', 4)

      // open again
      wrapper.simulate('click')
      wrapper.should.have.state('selectedIndex', 4)
    })

    it('keeps "selectedIndex" when the same item was selected', () => {
      const option = _.last(options)

      wrapperMount(<Dropdown options={options} search selection />)
      const input = wrapper.find('input.search')

      // simulate search and select option
      input.simulate('change', { target: { value: option.text } })
      wrapper.simulate('keydown', { key: 'Enter' })

      wrapper.should.have.state('selectedIndex', 4)

      // select the same option again
      input.simulate('change', { target: { value: option.text } })
      wrapper.simulate('keydown', { key: 'Enter' })
      wrapper.should.have.state('selectedIndex', 4)
    })
  })

  describe('isMouseDown', () => {
    it('tracks when the mouse is down', () => {
      wrapperMount(<Dropdown />).simulate('mousedown')

      wrapper.instance().isMouseDown.should.equal(true)

      domEvent.mouseUp(document)
      wrapper.instance().isMouseDown.should.equal(false)
    })
  })

  describe('icon', () => {
    it('defaults to a dropdown icon', () => {
      Dropdown.defaultProps.icon.should.equal('dropdown')
      wrapperRender(<Dropdown />).should.contain.descendants('.dropdown.icon')
    })

    it('always opens a dropdown on click', () => {
      wrapperMount(<Dropdown options={options} selection search />)
        .find('i.icon')
        .simulate('click')

      dropdownMenuIsOpen()
    })

    it('always opens a dropdown on click', () => {
      wrapperMount(<Dropdown options={options} selection search />)
        .find('i.icon')
        .simulate('click')

      dropdownMenuIsOpen()
    })

    it('passes onClick handler', () => {
      const event = { target: null }
      const onClick = sandbox.spy()
      const props = { name: 'user', onClick }

      wrapperMount(<Dropdown icon={props} options={options} />)
        .find('i.icon')
        .simulate('click', event)

      onClick.should.have.been.calledOnce()
      onClick.should.have.been.calledWithMatch(event, props)
    })
  })

  describe('searchQuery', () => {
    it('defaults to empty string', () => {
      shallow(<Dropdown />).should.have.state('searchQuery', '')
    })

    it('passes value to state', () => {
      shallow(<Dropdown searchQuery='foo' />).should.have.state('searchQuery', 'foo')
    })
  })

  describe('selected item', () => {
    it('defaults to the first item', () => {
      wrapperShallow(<Dropdown options={options} selection />)
        .find('DropdownItem')
        .first()
        .should.have.prop('selected', true)
    })
    it('defaults to the first non-disabled item', () => {
      options[0].disabled = true
      wrapperShallow(<Dropdown options={options} selection />)

      // selection moved to second item
      wrapper.find('DropdownItem').first().should.have.prop('selected', false)

      wrapper.find('DropdownItem').at(1).should.have.prop('selected', true)
    })
    it('defaults to selected item when options are initially empty', () => {
      const randomIndex = 1 + _.random(options.length - 2)
      const value = options[randomIndex].value

      wrapperMount(<Dropdown options={[]} selection value={value} />)

      wrapper.setProps({ options, value })

      wrapper.find('DropdownItem').at(randomIndex).should.have.prop('selected', true)
    })
    it('is null when all options disabled', () => {
      const disabledOptions = options.map((o) => ({ ...o, disabled: true }))

      wrapperRender(<Dropdown options={disabledOptions} selection />).should.not.have.descendants(
        '.selected',
      )
    })
    it('is set when clicking an item', () => {
      // random item, skip the first as it's selected by default
      const randomIndex = 1 + _.random(options.length - 2)
      wrapperMount(<Dropdown options={options} selection />)

      wrapper.find('DropdownItem').at(randomIndex).simulate('click')
      wrapper.find('DropdownItem').at(randomIndex).should.have.prop('selected', true)
    })
    it('is ignored when clicking a disabled item', () => {
      // random item, skip the first as it's selected by default
      const randomIndex = 1 + _.random(options.length - 2)

      options[randomIndex].disabled = true

      wrapperMount(<Dropdown options={options} selection />)
        .simulate('click', nativeEvent)
        .find('DropdownItem')
        .at(randomIndex)
        .simulate('click', nativeEvent)
        .should.not.have.prop('selected', true)

      dropdownMenuIsOpen()
    })
    it('moves down on arrow down when open', () => {
      wrapperMount(<Dropdown options={options} selection />)

      // open
      wrapper.simulate('click')
      dropdownMenuIsOpen()

      // arrow down
      wrapper.simulate('keydown', { key: 'ArrowDown' })

      // selection moved to second item
      wrapper.find('DropdownItem').first().should.have.prop('selected', false)
      wrapper.find('DropdownItem').at(1).should.have.prop('selected', true)
    })
    it('moves up on arrow up when open', () => {
      wrapperMount(<Dropdown options={options} selection />)

      // open
      wrapper.simulate('click').find('DropdownItem').first().should.have.prop('selected', true)

      // arrow down
      wrapper.simulate('keydown', { key: 'ArrowUp' })

      // selection moved to last item
      wrapper.find('DropdownItem').first().should.have.prop('selected', false)
      wrapper
        .find('DropdownItem')
        .at(options.length - 1)
        .should.have.prop('selected', true)
    })
    it('skips over items filtered by search', () => {
      const opts = [
        { text: 'a1', value: 'a1' },
        { text: 'skip this one', value: 'skip this one' },
        { text: 'a2', value: 'a2' },
      ]
      // search for 'a'
      wrapperMount(<Dropdown options={opts} search selection />)
        .simulate('click')
        .find('input.search')
        .simulate('change', { target: { value: 'a' } })

      wrapper.find('.selected').should.contain.text('a1')

      // move selection down
      wrapper.simulate('keydown', { key: 'ArrowDown' })

      wrapper.find('.selected').should.contain.text('a2')
    })
    it('filters diacritics on options when using deburr prop', () => {
      const inputText = 'floresti'
      const textToFind = 'FLOREŞTI'

      const opts = [
        { text: textToFind, value: '1' },
        { text: `ŞANŢU ${textToFind}`, value: '2' },
        { text: `${textToFind} Alba`, value: '3' },
      ]

      // search for 'floresti'
      wrapperMount(<Dropdown options={opts} search deburr selection />)
        .simulate('click')
        .find('input.search')
        .simulate('change', { target: { value: inputText } })

      wrapper.find('.selected').should.contain.text(textToFind)
    })
    it('filters diacritics on input when using deburr prop', () => {
      const inputText = 'FLORÉŞTI'
      const textToFind = 'FLORESTI'

      const opts = [
        { text: textToFind, value: '1' },
        { text: `SANTU ${textToFind}`, value: '2' },
        { text: `${textToFind} Alba`, value: '3' },
      ]

      // search for 'floresti'
      wrapperMount(<Dropdown options={opts} search deburr selection />)
        .simulate('click')
        .find('input.search')
        .simulate('change', { target: { value: inputText } })

      wrapper.find('.selected').should.contain.text(textToFind)
    })
    it('should not filter diacritics when deburr is not set', () => {
      const inputText = 'FLORÉŞTI'
      const textToFind = 'FLORESTI'

      // Add this in case the default 'no results text' changes.
      const noResultsText = 'NoResultsFound'

      const opts = [
        { text: textToFind, value: '1' },
        { text: `SANTU ${textToFind}`, value: '2' },
        { text: `${textToFind} Alba`, value: '3' },
      ]

      // search for 'floresti'
      wrapperMount(<Dropdown options={opts} search selection noResultsMessage={noResultsText} />)
        .simulate('click')
        .find('input.search')
        .simulate('change', { target: { value: inputText } })

      wrapper.find('.message').should.contain.text(noResultsText)
    })
    it('still works after encountering "no results"', () => {
      const opts = [
        { text: 'a1', value: 'a1' },
        { text: 'a2', value: 'a2' },
        { text: 'a3', value: 'a3' },
      ]
      wrapperMount(<Dropdown options={opts} search selection />)

      // search for 'a4'
      // no results appears
      wrapper
        .simulate('click')
        .find('input.search')
        .simulate('change', { target: { value: 'a4' } })

      wrapper.should.have.exactly(1).descendants('.message')

      // search for 'a' (simulated backspace)
      // no results is removed
      // first item is selected
      // down arrow moves selection
      wrapper.find('input.search').simulate('change', { target: { value: 'a' } })

      wrapper.should.not.have.descendants('.message')

      wrapper.should.have.exactly(1).descendants('.selected').which.contain.text('a1')

      // move selection down
      wrapper.simulate('keydown', { key: 'ArrowDown' })

      wrapper.should.have.exactly(1).descendants('.selected').which.contain.text('a2')
    })
    it('skips over disabled items', () => {
      const opts = [
        { text: 'a1', value: 'a1' },
        { text: 'skip this one', value: 'skip this one', disabled: true },
        { text: 'a2', value: 'a2' },
      ]

      wrapperMount(<Dropdown options={opts} search selection />)
      wrapper.simulate('click')

      wrapper.find('.selected').should.contain.text('a1')

      // move selection down
      wrapper.simulate('keydown', { key: 'ArrowDown' })
      wrapper.find('.selected').should.contain.text('a2')
    })
    it('does not enter an infinite loop when all items are disabled', () => {
      const onChange = sandbox.spy()
      const opts = [
        { text: '1', value: '1', disabled: true },
        { text: '2', value: '2', disabled: true },
      ]
      wrapperMount(<Dropdown onChange={onChange} options={opts} search selection />)

      wrapper.simulate('click')
      // move selection down
      wrapper.simulate('keydown', { key: 'ArrowDown' })

      onChange.should.have.not.been.called()
    })
    it('scrolls the selected item into view', () => {
      // get enough options to make the menu scrollable
      const opts = getOptions(20)

      wrapperMount(<Dropdown options={opts} selection />).simulate('click')

      dropdownMenuIsOpen()
      const menu = document.querySelector('.ui.dropdown .menu.visible')

      // Limit the menu's height and set an overflow so it's scrollable
      menu.style.height = '100px'
      menu.style.overflow = 'auto'

      //
      // Scrolls to bottom
      //

      // make sure first item is selected
      wrapper.find('.selected').should.contain.text(opts[0].text)

      // wrap selection to last item
      wrapper.simulate('keydown', { key: 'ArrowUp' })

      // make sure last item is selected
      wrapper.find('.selected').should.contain.text(_.tail(opts).text)

      // menu should be completely scrolled to the bottom
      const isMenuScrolledToBottom = menu.scrollTop + menu.clientHeight === menu.scrollHeight
      isMenuScrolledToBottom.should.be.true(
        'When the last item in the list was selected, DropdownMenu did not scroll to bottom.',
      )

      //
      // Scrolls back to top
      //

      // wrap selection to last item
      wrapper.simulate('keydown', { key: 'ArrowDown' })

      // make sure first item is selected
      wrapper.find('.selected').should.contain.text(opts[0].text)

      // Note: For some reason the first item's offsetTop is not 0 so we need
      // to find the item's offsetTop and ensure it's at the top.
      const selectedItem = document.querySelector('.ui.dropdown .menu.visible .item.selected')
      const isMenuScrolledToTop = menu.scrollTop === selectedItem.offsetTop
      isMenuScrolledToTop.should.be.true(
        'When the first item in the list was selected, DropdownMenu did not scroll to top.',
      )
    })
    it('becomes active on enter when open', () => {
      wrapperMount(<Dropdown options={options} selection />)
      wrapper.simulate('click')

      // initial item props
      wrapper.find('DropdownItem').at(1).should.have.props({ selected: false, active: false })

      // select and make active
      wrapper.simulate('keydown', { key: 'ArrowDown' })
      wrapper.simulate('keydown', { key: 'Enter' })

      wrapper.find('DropdownItem').at(1).should.have.props({ selected: true, active: true })
    })
    it('becomes active on spacebar when open', () => {
      wrapperMount(<Dropdown options={options} selection />)
      wrapper.simulate('click')

      // initial item props
      wrapper.find('DropdownItem').at(1).should.have.props({ selected: false, active: false })

      // select and make active
      wrapper.simulate('keydown', { key: 'ArrowDown' })
      wrapper.simulate('keydown', { key: 'Spacebar' })

      wrapper.find('DropdownItem').at(1).should.have.props({ selected: true, active: true })
    })
    it('closes the menu on ENTER key', () => {
      wrapperMount(<Dropdown options={options} selection />).simulate('click')

      dropdownMenuIsOpen()

      // choose an item closes
      wrapper.simulate('keydown', { key: 'Enter' })
      dropdownMenuIsClosed()
    })
    it('closes the menu on SPACE key', () => {
      wrapperMount(<Dropdown options={options} selection />).simulate('click')

      dropdownMenuIsOpen()

      // choose an item closes
      wrapper.simulate('keydown', { key: 'Spacebar' })
      dropdownMenuIsClosed()
    })
    it('closes the Search menu on ENTER key', () => {
      wrapperMount(<Dropdown options={options} selection search />).simulate('click')

      dropdownMenuIsOpen()

      // choose an item closes
      wrapper.simulate('keydown', { key: 'Enter' })
      dropdownMenuIsClosed()
    })
    it('does not close the Search menu on SPACE key', () => {
      wrapperMount(<Dropdown options={options} selection search />).simulate('click')

      dropdownMenuIsOpen()

      // choose an item closes
      wrapper.simulate('keydown', { key: 'Spacebar' })
      dropdownMenuIsOpen()
    })
    it('keeps value of the searchQuery when selection is changed', () => {
      wrapperMount(<Dropdown options={options} selection search />)

      wrapper.setState({ searchQuery: 'foo' })
      wrapper.simulate('click')
      wrapper.simulate('keydown', { key: 'ArrowDown' })

      wrapper.should.have.state('searchQuery', 'foo')
    })
  })

  describe('value', () => {
    it('sets the corresponding item to active', () => {
      const value = _.sample(options).value

      wrapperShallow(<Dropdown options={options} selection value={value} />)
        .find('DropdownItem')
        .find({ value, active: true })
        .should.be.present()
    })

    it('sets the corresponding item text', () => {
      const { text, value } = _.sample(options)

      wrapperShallow(<Dropdown value={value} options={options} selection />)
        .find('DropdownItem')
        .find({ value, text })
        .should.be.present()
    })

    it('updates active item when changed', () => {
      const value = _.sample(options).value
      let next
      while (!next || next === value) next = _.sample(options).value

      wrapperMount(<Dropdown value={value} options={options} selection />)

      // initial active item
      wrapper.find('DropdownItem').find({ value }).should.have.prop('active', true)

      // change value
      wrapper.setProps({ value: next })

      // next active item
      wrapper.find('DropdownItem').find({ value: next }).should.have.prop('active', true)
    })

    it('updates text when value changed', () => {
      const initialItem = _.sample(options)
      const nextItem = _.sample(_.without(options, initialItem))

      wrapperMount(<Dropdown options={options} selection value={initialItem.value} />)
      wrapper.find(DropdownText).should.contain.text(initialItem.text)

      wrapper.setProps({ value: nextItem.value })
      wrapper.find(DropdownText).should.contain.text(nextItem.text)
    })

    it('updates value on down arrow', () => {
      wrapperMount(<Dropdown options={options} selection />)

      wrapper.simulate('click')
      wrapper.simulate('keydown', { key: 'ArrowDown' })

      wrapper.should.have.state('value', options[1].value)
    })

    it('updates value on up arrow', () => {
      wrapperMount(<Dropdown options={options} selection />)

      wrapper.simulate('click')
      wrapper.simulate('keydown', { key: 'ArrowUp' })

      wrapper.should.have.state('value', options[4].value)
    })
  })

  describe('text', () => {
    it('defaults to "placeholder"', () => {
      const placeholder = faker.hacker.phrase()

      wrapperMount(<Dropdown options={options} placeholder={placeholder} />)
        .find('div.text')
        .should.contain.text(placeholder)
    })
    it('sets the display text', () => {
      const text = faker.hacker.phrase()

      wrapperRender(<Dropdown options={options} selection text={text} />)
        .find('div.text')
        .should.contain.text(text)
    })
    it('prevents updates on item click if defined', () => {
      const text = faker.hacker.phrase()

      wrapperMount(<Dropdown options={options} selection text={text} />)
        .simulate('click')
        .find('DropdownItem')
        .at(_.random(options.length - 1))
        .simulate('click')

      wrapper.find('div.text').should.contain.text(text)
    })
    it('is updated on item click if not already defined', () => {
      wrapperMount(<Dropdown options={options} selection />)

      // open
      wrapper.simulate('click')

      // click item
      const item = wrapper
        .find('DropdownItem')
        .at(_.random(options.length - 1))
        .simulate('click')

      // text updated
      wrapper.find('div.text').should.contain.text(item.text())
    })
    it('is updated on item enter if multiple search results present', () => {
      const searchOptions = [
        { value: 0, text: 'foo' },
        { value: 1, text: 'foe' },
      ]
      wrapperMount(<Dropdown options={searchOptions} search selection />)

      // open and simulate search
      wrapper.simulate('click')
      wrapper.setState({ searchQuery: 'fo' })

      // arrow down
      wrapper.simulate('keydown', { key: 'ArrowDown' })
      wrapper.simulate('keydown', { key: 'Enter' })

      // text updated
      wrapper.find('div.text').should.contain.text('foe')
    })
    it('displays if value is 0', () => {
      const text = faker.hacker.noun()

      wrapperMount(<Dropdown options={[{ value: 0, text }]} selection />)

      // open
      wrapper.simulate('click')

      // click item
      const item = wrapper.find('DropdownItem').simulate('click')

      // text updated
      wrapper.find('div.text').should.contain.text(item.text())
    })
    it("does not display if value is ''", () => {
      const text = faker.hacker.noun()

      wrapperMount(<Dropdown options={[{ value: '', text }]} selection />)
        .simulate('click')
        .find('DropdownItem')
        .simulate('click')

      wrapper.find('div.text').should.contain.text('')
    })
    it('does not display if value is null', () => {
      const text = faker.hacker.noun()

      wrapperMount(<Dropdown options={[{ value: null, text }]} selection />)
        .simulate('click')
        .find('DropdownItem')
        .simulate('click')

      wrapper.find('div.text').should.contain.text('')
    })
    it('does not display if value is undefined', () => {
      const text = faker.hacker.noun()

      wrapperMount(<Dropdown options={[{ key: text, value: undefined, text }]} selection />)
        .simulate('click')
        .find('DropdownItem')
        .simulate('click')

      wrapper.find('div.text').should.contain.text('')
    })
  })

  describe('trigger', () => {
    it('displays the trigger', () => {
      const text = 'Hey there'
      const trigger = <div className='trigger'>{text}</div>

      wrapperRender(<Dropdown options={options} trigger={trigger} />)
        .find('.trigger')
        .should.contain.text(text)
    })
  })

  describe('menu', () => {
    it('opens on dropdown click', () => {
      wrapperMount(<Dropdown options={options} selection />)

      dropdownMenuIsClosed()
      wrapper.simulate('click')
      dropdownMenuIsOpen()
    })

    it('opens on arrow down when focused', () => {
      wrapperMount(<Dropdown options={options} selection />)

      // Note: This mousedown is necessary to get the Dropdown focused
      // without it being open.
      wrapper.simulate('mousedown')
      wrapper.simulate('focus')
      dropdownMenuIsClosed()

      wrapper.simulate('keydown', { key: 'ArrowDown' })
      dropdownMenuIsOpen()
    })

    it('opens on space when focused', () => {
      const preventDefault = sandbox.spy()
      wrapperMount(<Dropdown options={options} selection />)

      // Note: This mousedown is necessary to get the Dropdown focused
      // without it being open.
      wrapper.simulate('mousedown')
      wrapper.simulate('focus')
      dropdownMenuIsClosed()

      wrapper.simulate('keydown', { key: 'Spacebar', preventDefault })
      dropdownMenuIsOpen()
      preventDefault.should.have.been.calledOnce()
    })

    it('opens on space in search input when focused', () => {
      const preventDefault = sandbox.spy()
      wrapperMount(<Dropdown options={options} selection search />)

      // Note: This mousedown is necessary to get the Dropdown focused
      // without it being open.
      wrapper.simulate('mousedown')
      wrapper.simulate('focus')
      dropdownMenuIsClosed()

      wrapper.find('input.search').simulate('keydown', { key: 'Spacebar', preventDefault })
      dropdownMenuIsOpen()
      preventDefault.should.have.not.been.called()
    })

    it('does not open on arrow down when not focused', () => {
      wrapperMount(<Dropdown options={options} selection />)
      dropdownMenuIsClosed()

      wrapper.simulate('keydown', { key: 'ArrowDown' })
      dropdownMenuIsClosed()
    })

    it('does not open on space when not focused', () => {
      wrapperMount(<Dropdown options={options} selection />)
      dropdownMenuIsClosed()

      wrapper.simulate('keydown', { key: 'Spacebar' })
      dropdownMenuIsClosed()
    })

    it('closes on dropdown click', () => {
      wrapperMount(<Dropdown options={options} selection defaultOpen />)

      dropdownMenuIsOpen()
      wrapper.simulate('click')
      dropdownMenuIsClosed()
    })

    it('closes on menu item click', () => {
      wrapperMount(<Dropdown options={options} selection />)
      const item = wrapper.find('DropdownItem').at(_.random(options.length - 1))

      // open
      wrapper.simulate('click')
      dropdownMenuIsOpen()

      // select item
      item.simulate('mousedown')
      item.simulate('click')
      dropdownMenuIsClosed()
    })

    it('blurs after menu item click (mousedown)', () => {
      wrapperMount(<Dropdown options={options} selection />)
      const item = wrapper.find('DropdownItem').at(_.random(options.length - 1))

      // open
      wrapper.simulate('click')
      dropdownMenuIsOpen()

      // select item
      item.simulate('mousedown')
      dropdownMenuIsOpen()
      item.simulate('click')
      dropdownMenuIsClosed()
    })

    it('closes on click outside', () => {
      wrapperMount(<Dropdown options={options} selection />)

      // open
      wrapper.simulate('click')
      dropdownMenuIsOpen()

      // click outside
      domEvent.click(document.body)
      dropdownMenuIsClosed()
    })

    it('handles focus correctly', () => {
      wrapperMount(<Dropdown options={options} selection />)
      wrapper.should.have.state('focus', false)

      // focus
      wrapper.getDOMNode().focus()
      wrapper.should.have.state('focus', true)

      // click outside
      domEvent.click(document.body)
      wrapper.should.have.state('focus', false)
    })

    it('closes on esc key', () => {
      wrapperMount(<Dropdown options={options} selection />)

      // open
      wrapper.find('Dropdown').simulate('click')
      dropdownMenuIsOpen()

      // esc
      domEvent.keyDown(document, { key: 'Escape' })
      dropdownMenuIsClosed()
    })
  })

  describe('onOpen', () => {
    it('called when dropdown would open', () => {
      const onOpen = sandbox.spy()
      wrapperMount(<Dropdown options={options} selection onOpen={onOpen} />)

      wrapper.simulate('click')
      onOpen.should.have.been.calledOnce()
    })

    it('not called when dropdown would not open', () => {
      const onOpen = sandbox.spy()
      wrapperMount(<Dropdown options={options} selection onOpen={onOpen} />)

      wrapper.simulate('keydown', { key: 'ArrowDown' })
      onOpen.should.not.have.been.calledOnce()
    })

    it('is called once when the icon is clicked with a search prop', () => {
      // https://github.com/Semantic-Org/Semantic-UI-React/issues/2600
      const onOpen = sandbox.spy()
      wrapperShallow(<Dropdown options={options} selection search onOpen={onOpen} />)
        .find('Icon')
        .simulate('click', { stopPropagation: _.noop })

      onOpen.should.have.been.calledOnce()
    })
  })

  describe('onClose', () => {
    it('called when dropdown would close', () => {
      const onClose = sandbox.spy()
      wrapperMount(<Dropdown defaultOpen onClose={onClose} options={options} selection />)

      wrapper.simulate('click')
      onClose.should.have.been.calledOnce()
    })

    it('called once even when blurred', () => {
      // Heads up!
      // Special test for: https://github.com/Semantic-Org/Semantic-UI-React/issues/2953
      const onClose = sandbox.spy()
      wrapperMount(<Dropdown defaultOpen onClose={onClose} options={options} selection />)

      wrapper.simulate('click')
      wrapper.simulate('blur')
      onClose.should.have.been.calledOnce()
    })
  })

  describe('open', () => {
    it('defaultOpen opens the menu when true', () => {
      wrapperShallow(<Dropdown options={options} selection defaultOpen />)
      dropdownMenuIsOpen()
    })
    it('defaultOpen opens the menu on search dropdowns', () => {
      wrapperShallow(<Dropdown search options={options} selection defaultOpen />)
      dropdownMenuIsOpen()
    })
    it('defaultOpen closes the menu when false', () => {
      wrapperShallow(<Dropdown options={options} selection defaultOpen={false} />)
      dropdownMenuIsClosed()
    })
    it('opens the menu when true', () => {
      wrapperShallow(<Dropdown options={options} selection open />)
      dropdownMenuIsOpen()
    })
    it('closes the menu when false', () => {
      wrapperShallow(<Dropdown options={options} selection open={false} />)
      dropdownMenuIsClosed()
    })
    it('closes the menu when toggled from true to false', () => {
      wrapperMount(<Dropdown options={options} selection open />).setProps({ open: false })
      dropdownMenuIsClosed()
    })
    it('opens the menu when toggled from false to true', () => {
      wrapperMount(<Dropdown options={options} selection open={false} />).setProps({ open: true })
      dropdownMenuIsOpen()
    })
    it('calls scrollSelectedItemIntoView when changed from false to true', () => {
      wrapperMount(<Dropdown options={options} selection open={false} />)

      const instance = wrapper.instance()
      sandbox.spy(instance, 'scrollSelectedItemIntoView')

      instance.scrollSelectedItemIntoView.should.not.have.been.called()

      wrapper.setProps({ open: true })

      instance.scrollSelectedItemIntoView.should.have.been.calledOnce()
    })
  })

  describe('multiple', () => {
    it('does not close the menu on item selection with enter', () => {
      wrapperMount(<Dropdown options={options} selection multiple />).simulate('click')

      dropdownMenuIsOpen()

      // choose an item keeps menu open
      wrapper.simulate('keydown', { key: 'Enter' })
      dropdownMenuIsOpen()
    })
    it('does not close the menu on clicking on an item', () => {
      wrapperMount(<Dropdown options={options} selection multiple />)
        .simulate('click', nativeEvent)
        .find('DropdownItem')
        .at(_.random(options.length - 1))
        .simulate('click', nativeEvent)

      dropdownMenuIsOpen()
    })
    it('filters active options out of the list', () => {
      // make all the items active, expect to see none in the list
      const value = _.map(options, 'value')

      wrapperShallow(<Dropdown options={options} selection value={value} multiple />)
      wrapper.should.not.have.descendants('DropdownItem')
    })
    it('displays a label for active items', () => {
      // select a random item, expect a label with the item's text
      const testOptions = [
        { value: 'foo', text: 'foo' },
        { value: 'bar', text: 'bar', image: 'bar.jpg' },
        { value: 'baz', text: <span className='baz'>baz</span> },
        {
          value: 'qux',
          text: () => (
            <span className='qux' key='qux'>
              qux
            </span>
          ),
        },
      ]

      consoleUtil.disableOnce()
      wrapperMount(
        <Dropdown
          multiple
          options={testOptions}
          selection
          value={testOptions.map((option) => option.value)}
        />,
      )

      expect(wrapper.find(Label).at(0).getDOMNode().innerText).to.include('foo')

      expect(wrapper.find(Label).at(1).getDOMNode().innerText).to.include('bar')
      wrapper.find(Label).at(1).find('Image').should.have.prop('src', 'bar.jpg')

      wrapper.find('span.baz').should.contain.text('baz')
      wrapper.find('span.qux').should.contain.text('qux')
    })
    it('keeps the selection within the range of remaining options', () => {
      // items are removed as they are made active
      // the selection should move if the last item is made active
      wrapperMount(<Dropdown options={options} selection multiple />)

      // open
      wrapper.simulate('click')
      dropdownMenuIsOpen()

      // activate the last item, removing it from the list
      wrapper.simulate('keydown', { key: 'ArrowUp' })

      wrapper.should.have.exactly(options.length).descendants('DropdownItem')
      wrapper.find('DropdownItem').last().should.have.prop('selected', true)

      wrapper.simulate('keydown', { key: 'Enter' })

      // one item should be gone, and the _new_ last item should be selected
      wrapper.should.have.exactly(options.length - 1).descendants('DropdownItem')
      wrapper.find('DropdownItem').last().should.have.prop('selected', true)
    })
    it('keeps the selection on the same index', () => {
      wrapperMount(<Dropdown options={options} selection multiple />)

      wrapper.simulate('click')
      dropdownMenuIsOpen()

      wrapper.simulate('keydown', { key: 'ArrowDown' })
      wrapper.find('DropdownItem').at(1).should.have.prop('selected', true)

      wrapper.simulate('keydown', { key: 'Enter' })
      wrapper.find('DropdownItem').at(1).should.have.prop('selected', true)
    })
    it('skips disabled items in selection', () => {
      const testOptions = [
        { value: 'foo', key: 'foo', text: 'foo' },
        { value: 'bar', key: 'bar', text: 'bar' },
        { value: 'baz', key: 'baz', text: 'baz', disabled: true },
        { value: 'qux', key: 'qux', text: 'qux' },
      ]

      wrapperMount(<Dropdown options={testOptions} selection multiple />)

      wrapper.simulate('click')
      dropdownMenuIsOpen()

      wrapper.simulate('keydown', { key: 'ArrowDown' })
      wrapper.find('DropdownItem').at(1).should.have.prop('selected', true)

      wrapper.simulate('keydown', { key: 'Enter' })
      wrapper.find('DropdownItem').at(2).should.have.prop('selected', true)
    })
    it('has labels with delete icons', () => {
      // add a value so we have a label
      const value = [_.head(options).value]
      wrapperRender(
        <Dropdown options={options} selection value={value} multiple />,
      ).should.have.descendants('.label')

      wrapper.find('.label').should.have.descendants('.delete.icon')
    })
    it('enables custom rendering', () => {
      const value = [_.head(options).value]
      const renderLabel = () => ({ content: 'My custom text!', as: 'div' })

      wrapperRender(
        <Dropdown options={options} selection value={value} multiple renderLabel={renderLabel} />,
      ).should.have.descendants('.label')

      const label = wrapper.find('.label')

      label.should.have.text('My custom text!')
      label.should.have.tagName('div')
    })

    describe('selecting items', () => {
      let spy
      beforeEach(() => {
        spy = sandbox.spy()
      })

      it('does not close the menu on clicking on a label', () => {
        const value = _.map(options, 'value')
        const randomIndex = _.random(options.length - 1)

        wrapperMount(<Dropdown options={options} selection multiple value={value} />)
          .simulate('click', nativeEvent)
          .find('Label')
          .at(randomIndex)
          .simulate('click', nativeEvent)

        dropdownMenuIsOpen()
      })

      it('sets label to active', () => {
        const value = _.map(options, 'value')
        const randomIndex = _.random(options.length - 1)

        wrapperMount(<Dropdown options={options} selection multiple value={value} />)
          .simulate('click', nativeEvent)
          .find('Label')
          .at(randomIndex)
          .simulate('click', nativeEvent)

        wrapper.find('Label').at(randomIndex).should.have.prop('active', true)
      })

      it('calls onLabelClick', () => {
        const value = _.map(options, 'value')
        const randomIndex = _.random(options.length - 1)
        const randomValue = value[randomIndex]

        wrapperMount(
          <Dropdown options={options} selection multiple value={value} onLabelClick={spy} />,
        )
          .simulate('click', nativeEvent)
          .find('Label')
          .at(randomIndex)
          .simulate('click', nativeEvent)

        spy.should.have.been.calledWithMatch({}, { value: randomValue })
      })

      it('refocuses search on select', () => {
        const randomIndex = _.random(options.length - 1)

        wrapperMount(<Dropdown options={options} search selection multiple />)
          .simulate('click', nativeEvent)
          .find('DropdownItem')
          .at(randomIndex)
          .simulate('click', nativeEvent)

        wrapper.instance().searchRef.current.should.eq(document.activeElement)
      })
    })
    describe('removing items', () => {
      it('calls onChange without the clicked value', () => {
        const value = _.map(options, 'value')
        const randomIndex = _.random(options.length - 1)
        const randomValue = value[randomIndex]
        const expected = _.without(value, randomValue)
        const spy = sandbox.spy()
        wrapperMount(<Dropdown options={options} selection value={value} multiple onChange={spy} />)

        wrapper.find('.delete.icon').at(randomIndex).simulate('click')

        spy.should.have.been.calledOnce()
        spy.should.have.been.calledWithMatch({}, { value: expected })
      })
    })
  })

  describe('removing items on backspace', () => {
    let spy
    beforeEach(() => {
      spy = sandbox.spy()
    })

    it('does nothing without selected items', () => {
      wrapperMount(<Dropdown options={options} selection multiple search onChange={spy} />)

      // open
      wrapper.simulate('click')

      domEvent.keyDown(document, { key: 'Backspace' })

      spy.should.not.have.been.called()
    })
    it('removes the last item when there is no search query', () => {
      const value = _.map(options, 'value')
      const expected = _.dropRight(value)
      wrapperMount(
        <Dropdown options={options} selection value={value} multiple search onChange={spy} />,
      )

      // open
      wrapper.simulate('click')

      domEvent.keyDown(document, { key: 'Backspace' })

      spy.should.have.been.calledOnce()
      spy.should.have.been.calledWithMatch({}, { value: expected })
    })
    it('removes the last item when there is no search query when uncontrolled', () => {
      const value = _.map(options, 'value')
      const expected = _.dropRight(value)
      wrapperMount(
        <Dropdown
          options={options}
          selection
          defaultValue={value}
          multiple
          search
          onChange={spy}
        />,
      )

      // open
      wrapper.simulate('click')

      domEvent.keyDown(document, { key: 'Backspace' })

      spy.should.have.been.calledOnce()
      spy.should.have.been.calledWithMatch({}, { value: expected })

      wrapper.state('value').should.deep.equal(expected)
    })
    it('does not remove the last item when there is a search query', () => {
      // search for random item
      const searchQuery = _.sample(options).text
      const value = _.map(options, 'value')
      wrapperMount(
        <Dropdown options={options} selection value={value} multiple search onChange={spy} />,
      )

      // open and simulate search
      wrapper.simulate('click').setState({ searchQuery })

      domEvent.keyDown(document, { key: 'Backspace' })

      spy.should.not.have.been.called()
    })
    it('does not remove items for multiple dropdowns without search', () => {
      const value = _.map(options, 'value')
      wrapperMount(<Dropdown options={options} selection value={value} multiple onChange={spy} />)

      // open
      wrapper.simulate('click')

      domEvent.keyDown(document, { key: 'Backspace' })

      spy.should.not.have.been.called()
    })
  })

  describe('onChange', () => {
    let spy
    beforeEach(() => {
      spy = sandbox.spy()
    })

    it('is called with event and value on item click', () => {
      const randomIndex = _.random(options.length - 1)
      const randomValue = options[randomIndex].value
      wrapperMount(<Dropdown options={options} selection onChange={spy} />)
        .simulate('click')
        .find('DropdownItem')
        .at(randomIndex)
        .simulate('click')

      spy.should.have.been.calledOnce()
      spy.should.have.been.calledWithMatch({}, { value: randomValue })
    })
    it('is not called when value is not changed on item click', () => {
      wrapperMount(<Dropdown options={options} selection onChange={spy} />)

      wrapper.simulate('click').find('DropdownItem').at(0).simulate('click')
      spy.should.have.been.calledOnce()
      // TODO: try reenable after Enzyme update
      // https://github.com/Semantic-Org/Semantic-UI-React/pull/3747#issuecomment-522018329
      // dropdownMenuIsClosed()

      wrapper.simulate('click').find('DropdownItem').at(0).simulate('click')
      spy.should.have.been.calledOnce()
      // TODO: try reenable after Enzyme update
      // dropdownMenuIsClosed()
    })
    it('is called with event and value when pressing enter on a selected item', () => {
      const firstValue = options[0].value
      wrapperMount(<Dropdown options={options} selection onChange={spy} />).simulate('click')

      wrapper.simulate('keydown', { key: 'Enter' })

      spy.should.have.been.calledOnce()
      spy.should.have.been.calledWithMatch({}, { value: firstValue })
    })
    it('is called with event and value when blurring', () => {
      const firstValue = options[0].value
      wrapperMount(<Dropdown options={options} selection onChange={spy} />)
        .simulate('focus') // open, highlights first item
        .simulate('blur') // blur should activate selected item

      spy.should.have.been.calledOnce()
      spy.should.have.been.calledWithMatch({}, { value: firstValue })
    })
    it('is not called on blur when closed', () => {
      wrapperMount(<Dropdown options={options} selection open={false} onChange={spy} />)
        .simulate('focus')
        .simulate('blur')

      spy.should.not.have.been.called()
    })
    it('is not called on blur when selectOnBlur is false', () => {
      wrapperMount(<Dropdown options={options} selection onChange={spy} selectOnBlur={false} />)
        .simulate('focus')
        .simulate('click')

      wrapper.simulate('blur')

      spy.should.not.have.been.called()
    })
    it('is not called on blur with multiple select', () => {
      wrapperMount(<Dropdown options={options} selection onChange={spy} multiple />)
        .simulate('focus')
        .simulate('click')

      wrapper.simulate('blur')

      spy.should.not.have.been.called()
    })
    it('is not called when updating the value prop', () => {
      const value = _.sample(options).value
      const next = _.sample(_.without(options, value)).value

      wrapperMount(<Dropdown options={options} selection value={value} onChange={spy} />).setProps({
        value: next,
      })

      spy.should.not.have.been.called()
    })
  })

  describe('onClick', () => {
    it('is called with (event, props)', () => {
      const onClick = sandbox.spy()
      wrapperMount(<Dropdown onClick={onClick} options={options} />)
      wrapper.simulate('click', { stopPropagation: _.noop })

      onClick.should.have.been.calledOnce()
      onClick.should.have.been.calledWithMatch({}, { options })
    })

    it("toggles the dropdown when it's not searchable", () => {
      wrapperMount(<Dropdown options={options} />)

      wrapper.simulate('click')
      dropdownMenuIsOpen()

      wrapper.simulate('click')
      dropdownMenuIsClosed()
    })

    it("opens the dropdown when it's searchable, but don't close", () => {
      wrapperMount(<Dropdown options={options} search />)

      wrapper.simulate('click')
      dropdownMenuIsOpen()

      wrapper.simulate('click')
      dropdownMenuIsOpen()
    })

    it("don't open the dropdown when it's searchable and minCharacters is more that default value", () => {
      wrapperMount(<Dropdown minCharacters={3} options={options} search />)

      wrapper.simulate('click')
      dropdownMenuIsClosed()
    })
  })

  describe('onFocus', () => {
    it('is called with (event, props)', () => {
      const onFocus = sandbox.spy()
      wrapperMount(<Dropdown onFocus={onFocus} options={options} />)
      wrapper.simulate('focus')

      onFocus.should.have.been.calledOnce()
      onFocus.should.have.been.calledWithMatch({}, { options })
    })

    it("opens the dropdown when it's not searchable", () => {
      wrapperMount(<Dropdown options={options} />)

      wrapper.simulate('focus')
      dropdownMenuIsOpen()
    })

    it("opens the dropdown when it's searchable", () => {
      wrapperMount(<Dropdown options={options} search />)

      wrapper.simulate('focus')
      dropdownMenuIsOpen()
    })

    it("don't open the dropdown when it's searchable and minCharacters is more that default value", () => {
      wrapperMount(<Dropdown minCharacters={3} options={options} search />)

      wrapper.simulate('focus')
      dropdownMenuIsClosed()
    })
  })

  describe('onSearchChange', () => {
    it('is called with (event, value) on search input change', () => {
      const spy = sandbox.spy()
      wrapperMount(<Dropdown options={options} search selection onSearchChange={spy} />)
        .find('input.search')
        .simulate('change', { target: { value: 'a' }, stopPropagation: _.noop })

      spy.should.have.been.calledOnce()
      spy.should.have.been.calledWithMatch(
        { target: { value: 'a' } },
        {
          search: true,
          searchQuery: 'a',
        },
      )
    })

    it("don't open the menu on change if query's length is less than minCharacters", () => {
      wrapperMount(<Dropdown minCharacters={3} options={options} selection search />)

      dropdownMenuIsClosed()

      // simulate search with query's length is less than minCharacters
      wrapper.find('input.search').simulate('change', { target: { value: 'a' } })

      dropdownMenuIsClosed()
    })

    it("closes the opened menu on change if query's length is less than minCharacters", () => {
      wrapperMount(<Dropdown minCharacters={3} options={options} selection search />)
      const input = wrapper.find('input.search')

      input.simulate('change', { target: { value: 'abc' } })
      dropdownMenuIsOpen()

      input.simulate('change', { target: { value: 'a' } })
      dropdownMenuIsClosed()
    })
  })

  describe('options', () => {
    it('adds the onClick handler to all items', () => {
      wrapperShallow(<Dropdown options={options} selection />)
        .find('DropdownItem')
        .everyWhere((item) => item.should.have.prop('onClick'))
    })
    it('calls handleItemClick when an item is clicked', () => {
      wrapperMount(<Dropdown options={options} selection />)

      const instance = wrapper.instance()
      sandbox.spy(instance, 'handleItemClick')

      // open
      wrapper.simulate('click')
      dropdownMenuIsOpen()

      instance.handleItemClick.should.not.have.been.called()

      // click random item
      wrapper
        .find('DropdownItem')
        .at(_.random(0, options.length - 1))
        .simulate('click')

      instance.handleItemClick.should.have.been.calledOnce()
    })
    it('renders new options when options change', () => {
      const customOptions = [
        { text: 'abra', value: 'abra' },
        { text: 'cadabra', value: 'cadabra' },
        { text: 'bang', value: 'bang' },
      ]
      wrapperMount(<Dropdown options={customOptions} />).find('input.search')

      wrapper.find('DropdownItem').should.have.lengthOf(3)

      wrapper.setProps({ options: [...customOptions, { text: 'bar', value: 'bar' }] })

      wrapper.find('DropdownItem').should.have.lengthOf(4)

      const newItem = wrapper.find('DropdownItem').last()

      newItem.should.have.prop('text', 'bar')
      newItem.should.have.prop('value', 'bar')
    })

    it('passes options as props', () => {
      const customOptions = [
        { text: 'abra', value: 'abra', 'data-foo': 'someValue' },
        { text: 'cadabra', value: 'cadabra', 'data-foo': 'someValue' },
        { text: 'bang', value: 'bang', 'data-foo': 'someValue' },
      ]
      wrapperShallow(<Dropdown options={customOptions} selection />)
        .find('DropdownItem')
        .everyWhere((item) => item.should.have.prop('data-foo', 'someValue'))
    })

    it('handles keys correctly', () => {
      const customOptions = [
        { key: 0, text: 'foo', value: 'foo' },
        { key: null, text: 'bar', value: 'bar' },
        { key: undefined, text: 'baz', value: 'baz' },
      ]
      wrapperShallow(<Dropdown options={customOptions} selection />)
      const items = wrapper.find('DropdownItem')

      items.at(0).key().should.equal('0')
      items.at(1).key().should.equal('bar')
      items.at(2).key().should.equal('baz')
    })
  })

  describe('search', () => {
    it('does not add a search input when not defined', () => {
      wrapperShallow(<Dropdown options={options} selection />)

      wrapper.should.not.have.descendants('input.search')
    })

    it('adds a search input when present', () => {
      wrapperShallow(<Dropdown options={options} selection search />)
      wrapper.should.have.exactly(1).descendants(DropdownSearchInput)
    })

    it('sets focus to the search input on open', () => {
      wrapperMount(<Dropdown options={options} selection search />).simulate('click')

      const activeElement = document.activeElement
      const searchIsFocused = activeElement === document.querySelector('input.search')
      searchIsFocused.should.be.true(
        `Expected "input.search" to be the active element but found ${activeElement} instead.`,
      )
    })

    it('sets focus to the search input on click on the placeholder', () => {
      wrapperMount(
        <Dropdown minCharacters={3} options={options} placeholder='foo' selection search />,
      )

      wrapper.find(DropdownText).simulate('click')

      const activeElement = document.activeElement
      const searchIsFocused = activeElement === document.querySelector('input.search')
      searchIsFocused.should.be.true(
        `Expected "input.search" to be the active element but found ${activeElement} instead.`,
      )
    })

    it('sets focus to the search input on click Dropdown when is opened', () => {
      wrapperMount(<Dropdown open options={options} multiple selection search />)
      wrapper.simulate('click')

      const activeElement = document.activeElement
      const searchIsFocused = activeElement === document.querySelector('input.search')
      searchIsFocused.should.be.true(
        `Expected "input.search" to be the active element but found ${activeElement} instead.`,
      )
    })

    it('clears the search query when an item is selected', () => {
      // search for random item
      const searchQuery = _.sample(options).text

      wrapperMount(<Dropdown options={options} selection search />)

      // open and simulate search
      wrapper.simulate('click').setState({ searchQuery })

      // click first item (we searched for exact text)
      wrapper.find('DropdownItem').first().simulate('click')

      // bye bye search query
      wrapper.should.have.state('searchQuery', '')
    })

    it('opens the menu on change if there is a query and not already open', () => {
      wrapperMount(<Dropdown options={options} selection search />)

      dropdownMenuIsClosed()

      // simulate search
      wrapper.find('input.search').simulate('change', { target: { value: faker.hacker.noun() } })

      dropdownMenuIsOpen()
    })

    it('does not call onChange on query change', () => {
      const onChange = sandbox.spy()
      wrapperMount(<Dropdown options={options} selection search onChange={onChange} />)

      // simulate search
      wrapper.find('input.search').simulate('change', { target: { value: faker.hacker.noun() } })

      onChange.should.not.have.been.called()
    })

    it('filters the items based on display text', () => {
      const search = wrapperMount(<Dropdown options={options} selection search />).find(
        'input.search',
      )

      // search for value yields 0 results
      search.simulate('change', { target: { value: _.sample(options).value } })

      wrapper
        .find('DropdownItem')
        .should.have.lengthOf(0, "Searching for an item's value did not yield 0 results.")

      // search for text yields 1 result
      search.simulate('change', { target: { value: _.sample(options).text } })

      wrapper
        .find('DropdownItem')
        .should.have.lengthOf(1, "Searching for an item's text did not yield any results.")
    })

    it('filters the items based on custom search function', () => {
      const searchFunction = sandbox.stub().returns(options.slice(0, 2))
      const search = wrapperMount(
        <Dropdown options={options} selection search={searchFunction} />,
      ).find('input.search')
      const searchQuery = '__nonExistingSearchQuery__'

      // search for value yields 2 results as per our custom search function
      search.simulate('change', { target: { value: searchQuery } })

      searchFunction.should.have.been.calledWithMatch(options, searchQuery)
      wrapper
        .find('DropdownItem')
        .should.have.lengthOf(2, 'Searching with custom search function did not yield 2 results.')
    })

    it('sets the selected item to the first search result', () => {
      const testOptions = [
        { value: 'foo', key: 'foo', text: 'foo' },
        { value: 'bar', key: 'bar', text: 'bar' },
        { value: 'baz', key: 'baz', text: 'baz' },
        { value: 'qux', key: 'qux', text: 'qux' },
      ]

      wrapperMount(<Dropdown options={testOptions} selection search />)

      // the first item is selected by default
      // avoid it to prevent false positives
      wrapper.simulate('click')
      wrapper.simulate('keydown', { key: 'ArrowUp' })
      wrapper.should.have.state('selectedIndex', 3)

      wrapper.find('input.search').simulate('change', { target: { value: 'baz' } })
      wrapper.should.have.state('selectedIndex', 0)
    })

    it('retains the selected item after searching with no results', () => {
      wrapperMount(<Dropdown options={options} selection search />)

      // open the dropdown
      wrapper.simulate('click')
      dropdownMenuIsOpen()

      // select the second item in the list
      wrapper.find('DropdownItem').at(1).simulate('click')
      wrapper.find('DropdownItem').at(1).should.have.prop('active', true)
      wrapper.find('DropdownItem').at(1).should.have.prop('selected', true)

      wrapper.find('DropdownItem').at(0).should.have.prop('active', false)
      wrapper.find('DropdownItem').at(0).should.have.prop('selected', false)

      // search for a non-existent item, triggering the not found message
      const search = wrapper.find('input.search')
      search.simulate('change', { target: { value: '__nonExistingSearchQuery__' } })

      // click outside, close the dropdown
      domEvent.click(document)
      dropdownMenuIsClosed()

      // next time we open the dropdown, the active item at index 1 should be selected
      // even though our search query last set the selected index to 0
      wrapper.simulate('click')
      dropdownMenuIsOpen()

      wrapper.find('DropdownItem').at(1).should.have.prop('active', true)
      wrapper.find('DropdownItem').at(1).should.have.prop('selected', true)

      wrapper.find('DropdownItem').at(0).should.have.prop('active', false)
      wrapper.find('DropdownItem').at(0).should.have.prop('selected', false)
    })

    it('set right selected index when click on option with search', () => {
      wrapperMount(<Dropdown options={options} search selection />)

      // avoid testing item index 0, it is selected by default
      const itemIndex = 1

      // open the menu
      wrapper.simulate('click')
      dropdownMenuIsOpen()

      // search for specific item, filtering the list and changing the index order
      const search = wrapper.find('input.search')
      search.simulate('change', { target: { value: `${itemIndex}-item` } })

      // click the item
      wrapper.find('DropdownItem').simulate('click')

      // open the menu again
      wrapper.simulate('click')
      dropdownMenuIsOpen()

      // our selectedIndex should match that items index in the full list of items
      wrapper.state('selectedIndex').should.equal(itemIndex)
    })

    it('still allows moving selection after blur/focus', () => {
      // open, first item is selected
      wrapperMount(<Dropdown options={options} selection search />)

      wrapper.simulate('click')
      dropdownMenuIsOpen()

      wrapper.find('DropdownItem').at(0).should.have.prop('selected', true)

      // blur, focus, open, move item selection down
      wrapper.simulate('blur')
      wrapper.simulate('focus')
      wrapper.simulate('keydown', { key: 'ArrowDown' })

      wrapper.find('DropdownItem').at(0).should.have.prop('selected', false)
      wrapper.find('DropdownItem').at(1).should.have.prop('selected', true)

      // blur, focus, open, move item selection up
      wrapper.simulate('blur')
      wrapper.simulate('focus')
      wrapper.simulate('keydown', { key: 'ArrowUp' })

      wrapper.find('DropdownItem').at(0).should.have.prop('selected', true)
      wrapper.find('DropdownItem').at(1).should.not.have.prop('selected', true)
    })

    it('does not close the menu when options are empty', () => {
      wrapperMount(<Dropdown options={options} search selection />)
      wrapper.simulate('click')

      wrapper.find('input.search').simulate('change', { target: { value: 'foo' } })
      wrapper.simulate('keydown', { key: 'Enter' })

      dropdownMenuIsOpen()
    })

    it('sets focus to the search input after selection', () => {
      // random item, skip the first as it's selected by default
      const randomIndex = 1 + _.random(options.length - 2)

      wrapperMount(<Dropdown options={options} selection search />)
        .simulate('click', nativeEvent)
        .find('DropdownItem')
        .at(randomIndex)
        .simulate('click', nativeEvent)

      dropdownMenuIsClosed()

      const activeElement = document.activeElement
      const searchIsFocused = activeElement === document.querySelector('input.search')
      searchIsFocused.should.be.true(
        `Expected "input.search" to be the active element but found ${activeElement} instead.`,
      )
      wrapper.should.have.state('focus', true)
    })

    it('sets focus to the dropdown after selection', () => {
      const randomIndex = _.random(options.length - 1)

      wrapperMount(<Dropdown options={options} selection />)
        .simulate('click', nativeEvent)
        .find('DropdownItem')
        .at(randomIndex)
        .simulate('click', nativeEvent)

      // TODO: try reenable after Enzyme update
      // https://github.com/Semantic-Org/Semantic-UI-React/pull/3747#issuecomment-522018329
      // dropdownMenuIsClosed()

      const activeElement = document.activeElement
      const dropdownIsFocused = activeElement === document.querySelector('div.dropdown')
      dropdownIsFocused.should.be.true(
        `Expected Dropdown to be the active element but found ${activeElement} instead.`,
      )

      wrapper.should.have.state('focus', true)
    })
  })

  describe('searchInput', () => {
    it('overrides onChange handler', () => {
      const onInputChange = sandbox.spy()
      const onSearchChange = sandbox.spy()

      wrapperShallow(
        <Dropdown
          onSearchChange={onSearchChange}
          options={options}
          search
          searchInput={{ onChange: onInputChange }}
        />,
      )

      wrapper
        .find(DropdownSearchInput)
        .shallow()
        .simulate('change', {
          stopPropagation: _.noop,
          target: { value: faker.hacker.noun() },
        })

      onInputChange.should.have.been.calledOnce()
      onSearchChange.should.have.been.calledOnce()
    })
  })

  describe('no results message', () => {
    it('is shown when a search yields no results', () => {
      const search = wrapperMount(<Dropdown options={options} selection search />).find(
        'input.search',
      )

      wrapper.find('.message').should.not.be.present()

      // search for something we know will not exist
      search.simulate('change', { target: { value: '_________________' } })

      wrapper.find('.message').should.be.present()
    })

    it('is not shown on multiple dropdowns with no remaining items', () => {
      // make all the items active so there are no remaining options
      const value = _.map(options, 'value')
      wrapperMount(<Dropdown options={options} selection value={value} multiple />)

      // open the menu
      wrapper.simulate('click')
      dropdownMenuIsOpen()

      // confirm there are no items
      wrapper.should.not.have.descendants('DropdownItem')

      // expect no message
      wrapper.find('.message').should.not.be.present()
    })

    it('uses default noResultsMessage', () => {
      const search = wrapperMount(<Dropdown options={options} selection search />).find(
        'input.search',
      )

      // search for something we know will not exist
      search.simulate('change', { target: { value: '_________________' } })

      wrapper.find('.message').should.have.text('No results found.')
    })

    it('uses custom string for noResultsMessage', () => {
      const search = wrapperMount(
        <Dropdown options={options} selection search noResultsMessage='Something custom' />,
      ).find('input.search')

      // search for something we know will not exist
      search.simulate('change', { target: { value: '_________________' } })

      wrapper.find('.message').should.have.text('Something custom')
    })

    it('uses custom component for noResultsMessage', () => {
      const search = wrapperMount(
        <Dropdown
          options={options}
          selection
          search
          noResultsMessage={<span>Something custom</span>}
        />,
      ).find('input.search')

      // search for something we know will not exist
      search.simulate('change', { target: { value: '_________________' } })

      wrapper.find('.message').should.contain.descendants('span')
    })

    it('uses no noResultsMessage', () => {
      const search = wrapperMount(
        <Dropdown options={options} selection search noResultsMessage='' />,
      ).find('input.search')

      // search for something we know will not exist
      search.simulate('change', { target: { value: '_________________' } })

      wrapper.find('.message').should.have.text('')
    })
    it('is not shown when set to `null`', () => {
      const search = wrapperMount(
        <Dropdown options={options} selection search noResultsMessage={null} />,
      ).find('input.search')

      // search for something we know will not exist
      search.simulate('change', { target: { value: '_________________' } })

      wrapper.should.not.have.descendants('.message')
    })
  })

  describe('placeholder', () => {
    it('is present when defined', () => {
      wrapperShallow(
        <Dropdown options={options} selection placeholder='hi' />,
      ).should.have.descendants('.default.text')
    })
    it('is not present when not defined', () => {
      wrapperShallow(<Dropdown options={options} selection />).should.not.have.descendants(
        '.default.text',
      )
    })
    it('is not present when there is a value', () => {
      wrapperShallow(
        <Dropdown options={options} selection value='hi' placeholder='hi' />,
      ).should.not.have.descendants('.default.text')
    })
    it('is present on a multiple dropdown with an empty value array', () => {
      wrapperShallow(
        <Dropdown options={options} selection multiple placeholder='hi' />,
      ).should.have.descendants('.default.text')
    })
    it('has a filtered className when there is a search query', () => {
      wrapperShallow(<Dropdown options={options} selection search placeholder='hi' />)
        .setState({ searchQuery: 'a' })
        .should.have.descendants('.default.text.filtered')
    })
  })

  describe('render', () => {
    it('calls renderText', () => {
      wrapperShallow(<Dropdown options={options} selection />)

      const instance = wrapper.instance()
      sandbox.spy(instance, 'renderText')

      instance.renderText.should.not.have.been.called()

      instance.render()

      instance.renderText.should.have.been.called()
    })
  })

  describe('lazyLoad', () => {
    it('does not render options when closed', () => {
      wrapperShallow(<Dropdown options={options} lazyLoad />).should.not.have.descendants(
        'DropdownItem',
      )
    })

    it('renders options when open', () => {
      wrapperShallow(<Dropdown options={options} lazyLoad open />).should.have.descendants(
        'DropdownItem',
      )
    })
  })

  describe('Dropdown.Menu child', () => {
    it('renders child passed', () => {
      wrapperShallow(
        <Dropdown text='required prop'>
          <Dropdown.Menu data-find-me />
        </Dropdown>,
      ).should.contain.descendants('DropdownMenu')

      wrapper.find('DropdownMenu').should.have.prop('data-find-me', true)
    })

    it('opens on click', () => {
      wrapperMount(
        <Dropdown text='required prop'>
          <Dropdown.Menu />
        </Dropdown>,
      )

      dropdownMenuIsClosed()
      wrapper.simulate('click')
      dropdownMenuIsOpen()
    })

    it('spreads extra menu props', () => {
      wrapperShallow(
        <Dropdown text='required prop'>
          <Dropdown.Menu data-foo-bar />
        </Dropdown>,
      ).should.contain.descendants('DropdownMenu')

      wrapper.find('DropdownMenu').should.have.prop('data-foo-bar', true)
    })

    it("merges the user's menu className", () => {
      wrapperShallow(
        <Dropdown text='required prop'>
          <Dropdown.Menu className='foo-bar' />
        </Dropdown>,
      ).should.contain.descendants('DropdownMenu')

      const menu = wrapper.find('DropdownMenu').shallow()

      menu.should.have.className('menu')
      menu.should.have.className('foo-bar')
    })
  })

  describe('allowAdditions', () => {
    const customOptions = [
      { text: 'abra', value: 'abra' },
      { text: 'cadabra', value: 'cadabra' },
      { text: 'bang', value: 'bang' },
    ]

    it('adds an option for arbitrary search value', () => {
      const search = wrapperMount(
        <Dropdown options={customOptions} selection search allowAdditions />,
      ).find('input.search')

      wrapper.find('DropdownItem').should.have.lengthOf(3)

      search.simulate('change', { target: { value: 'boo' } })

      wrapper.find('DropdownItem').should.have.lengthOf(1)

      wrapper.find('DropdownItem').should.have.prop('value', 'boo')
    })

    it('adds an option for prefix search value', () => {
      const search = wrapperMount(
        <Dropdown options={customOptions} selection search allowAdditions />,
      ).find('input.search')

      wrapper.find('DropdownItem').should.have.lengthOf(3)

      search.simulate('change', { target: { value: 'a' } })

      wrapper.find('DropdownItem').should.have.lengthOf(4)

      wrapper.find('DropdownItem').first().should.have.prop('value', 'a')
    })

    it('uses default additionLabel', () => {
      const search = wrapperMount(
        <Dropdown options={customOptions} selection search allowAdditions />,
      ).find('input.search')

      search.simulate('change', { target: { value: 'boo' } })

      wrapper.find('DropdownItem').should.have.lengthOf(1)

      wrapper.find('DropdownItem').last().should.have.prop('className', 'addition')

      const text = wrapper.find('DropdownItem').prop('text')

      expect(text[0]).to.equal('Add ')
      shallow(text[1]).equals(<b key='addition-query'>boo</b>)
    })

    it('uses custom additionLabel string', () => {
      const search = wrapperMount(
        <Dropdown options={customOptions} selection search allowAdditions additionLabel='New: ' />,
      ).find('input.search')

      search.simulate('change', { target: { value: 'boo' } })

      wrapper.find('DropdownItem').should.have.lengthOf(1)

      wrapper.find('DropdownItem').last().should.have.prop('className', 'addition')

      const text = wrapper.find('DropdownItem').prop('text')

      expect(text[0]).to.equal('New: ')
      shallow(text[1]).equals(<b key='addition-query'>boo</b>)
    })

    it('uses custom additionLabel element', () => {
      const search = wrapperMount(
        <Dropdown
          options={customOptions}
          selection
          search
          allowAdditions
          additionLabel={<i>New: </i>}
        />,
      ).find('input.search')

      search.simulate('change', { target: { value: 'boo' } })

      wrapper.find('DropdownItem').should.have.lengthOf(1)

      wrapper.find('DropdownItem').last().should.have.prop('className', 'addition')

      const text = wrapper.find('DropdownItem').prop('text')

      shallow(text[0]).equals(<i key='label'>New: </i>)
      shallow(text[1]).equals(<b key='addition-query'>boo</b>)
    })

    it('uses no additionLabel', () => {
      const search = wrapperMount(
        <Dropdown options={customOptions} selection search allowAdditions additionLabel='' />,
      ).find('input.search')

      search.simulate('change', { target: { value: 'boo' } })

      wrapper.find('DropdownItem').should.have.lengthOf(1)

      wrapper.find('DropdownItem').last().should.have.prop('className', 'addition')

      const text = wrapper.find('DropdownItem').prop('text')

      expect(text[0]).to.equal('')
      shallow(text[1]).equals(<b key='addition-query'>boo</b>)
    })

    it('keeps custom value option (bottom) when options change', () => {
      const search = wrapperMount(
        <Dropdown
          options={customOptions}
          selection
          search
          allowAdditions
          additionPosition='bottom'
        />,
      ).find('input.search')

      search.simulate('change', { target: { value: 'a' } })

      wrapper.find('DropdownItem').should.have.lengthOf(4)

      wrapper.find('DropdownItem').last().should.have.prop('value', 'a')

      wrapper.setProps({ options: [...customOptions, { text: 'bar', value: 'bar' }] })

      wrapper.find('DropdownItem').should.have.lengthOf(5)

      wrapper.find('DropdownItem').last().should.have.prop('value', 'a')
    })

    it('keeps custom value option (top) when options change', () => {
      const search = wrapperMount(
        <Dropdown options={customOptions} selection search allowAdditions />,
      ).find('input.search')

      search.simulate('change', { target: { value: 'a' } })

      wrapper.find('DropdownItem').should.have.lengthOf(4)

      wrapper.find('DropdownItem').first().should.have.prop('value', 'a')

      wrapper.setProps({ options: [...customOptions, { text: 'bar', value: 'bar' }] })

      wrapper.find('DropdownItem').should.have.lengthOf(5)

      wrapper.find('DropdownItem').first().should.have.prop('value', 'a')
    })

    it('calls onAddItem prop when clicking new value', () => {
      const onAddItem = sandbox.spy()
      const onChange = sandbox.spy()
      const search = wrapperMount(
        <Dropdown
          allowAdditions
          onAddItem={onAddItem}
          onChange={onChange}
          options={customOptions}
          search
          selection
        />,
      ).find('input.search')

      search.simulate('change', { target: { value: 'boo' } })

      wrapper.find('DropdownItem').first().simulate('click')

      onChange.should.have.been.calledOnce()
      onAddItem.should.have.been.calledOnce()
      onAddItem.should.have.been.calledWithMatch({}, { value: 'boo' })
      onAddItem.should.have.been.calledImmediatelyAfter(onChange)
    })

    it('calls onAddItem prop when pressing enter on new value', () => {
      const onAddItem = sandbox.spy()
      const onChange = sandbox.spy()

      wrapperMount(
        <Dropdown
          allowAdditions
          onAddItem={onAddItem}
          onChange={onChange}
          options={customOptions}
          search
          selection
        />,
      )
      const search = wrapper.find('input.search')

      search.simulate('change', { target: { value: 'boo' } })
      search.simulate('keydown', { key: 'Enter' })

      onChange.should.have.been.calledOnce()
      onAddItem.should.have.been.calledOnce()
      onAddItem.should.have.been.calledWithMatch({}, { value: 'boo' })
      onAddItem.should.have.been.calledImmediatelyAfter(onChange)
    })

    it('clears value of the searchQuery when selection is only option', () => {
      wrapperMount(<Dropdown options={customOptions} selection search allowAdditions />)

      const search = wrapper.find('input.search')

      search.simulate('change', { target: { value: 'boo' } })
      search.simulate('keydown', { key: 'Enter' })

      wrapper.should.have.state('searchQuery', '')
    })
  })

  describe('header', () => {
    it('renders a header when present', () => {
      const text = faker.hacker.phrase()

      wrapperRender(<Dropdown options={options} header={text} />)
        .find('.menu .header')
        .should.contain.text(text)
    })
    it('does not render a header when not present', () => {
      wrapperRender(<Dropdown options={options} />).should.not.have.descendants('.menu .header')
    })
  })

  describe('value validations', () => {
    it('logs an error if dropdown is not multiple and value is array', () => {
      consoleUtil.disableOnce()
      const spy = sandbox.spy(console, 'error')

      const originalValue = _.pick(options, 'value')[0]
      const nextValue = _.castArray(_.pick(options, 'value')[1])

      wrapperMount(<Dropdown options={options} value={originalValue} selection />)
      wrapper.setProps({ value: nextValue })

      const errorMessage =
        'Dropdown `value` must not be an array when `multiple` is not set.' +
        ' Either set `multiple={true}` or use a string or number value.'

      spy.should.have.been.calledOnce()
      spy.should.have.been.calledWithMatch(errorMessage)
    })

    it('logs an error if dropdown is multiple and value not array', () => {
      consoleUtil.disableOnce()
      const spy = sandbox.spy(console, 'error')

      const originalValue = _.castArray(_.pick(options, 'value')[0])
      const nextValue = _.pick(options, 'value')[1]

      wrapperMount(<Dropdown options={options} value={originalValue} selection multiple />)
      wrapper.setProps({ value: nextValue })

      const errorMessage =
        'Dropdown `value` must be an array when `multiple` is set.' +
        ` Received type: \`${Object.prototype.toString.call(nextValue)}\`.`

      spy.should.have.been.calledOnce()
      spy.should.have.been.calledWithMatch(errorMessage)
    })
  })

  describe('selectOnNavigation', () => {
    it('is on by default', () => {
      const onChange = sandbox.spy()

      wrapperMount(
        <Dropdown options={options} defaultValue={options[0].value} onChange={onChange} />,
      )

      // open
      wrapper.simulate('click')
      wrapper.simulate('keydown', { key: 'ArrowDown' })

      onChange.should.have.been.called()
      wrapper.should.have.state('value', options[1].value)
    })

    it('does not change value when set to false', () => {
      const onChange = sandbox.spy()
      const value = options[0].value

      wrapperMount(
        <Dropdown
          options={options}
          defaultValue={value}
          selectOnNavigation={false}
          onChange={onChange}
        />,
      )

      // open
      wrapper.simulate('click')
      wrapper.simulate('keydown', { key: 'ArrowDown' })

      onChange.should.not.have.been.called()
      wrapper.should.have.state('value', value)
    })
  })

  describe('wrapSelection', () => {
    it("does not move up on arrow up when first item is selected when open and 'wrapSelection' is false", () => {
      wrapperMount(<Dropdown options={options} selection wrapSelection={false} />)

      // open
      wrapper.simulate('click').find('DropdownItem').first().should.have.prop('selected', true)

      // arrow up
      wrapper.simulate('keydown', { key: 'ArrowUp' })

      // selection should not move to last item
      // should keep on first instead
      wrapper.find('DropdownItem').first().should.have.prop('selected', true)
      wrapper
        .find('DropdownItem')
        .at(options.length - 1)
        .should.have.prop('selected', false)
    })
    it("does not move down on arrow down when last item is selected when open and 'wrapSelection' is false", () => {
      wrapperMount(<Dropdown options={options} selection wrapSelection={false} />)

      // open and make last item selected
      wrapper.simulate('click')
      wrapper.simulate('keydown', { key: 'ArrowDown' })
      wrapper.simulate('keydown', { key: 'ArrowDown' })
      wrapper.simulate('keydown', { key: 'ArrowDown' })
      wrapper.simulate('keydown', { key: 'ArrowDown' })

      wrapper
        .find('DropdownItem')
        .at(options.length - 1)
        .should.have.prop('selected', true)

      // selection should not move to first item, should keep on last instead
      wrapper.simulate('keydown', { key: 'ArrowDown' })
      wrapper.find('DropdownItem').at(0).should.have.prop('selected', false)
      wrapper
        .find('DropdownItem')
        .at(options.length - 1)
        .should.have.prop('selected', true)
    })
  })

  describe('upward', () => {
    it('is false when there is enough space below', () => {
      wrapperMount(<Dropdown options={options} />)

      wrapper.simulate('click').should.not.have.className('upward')
    })

    it('is true when there is not enough space below', () => {
      wrapperMount(
        <Dropdown
          options={options}
          style={{ marginTop: document.documentElement.clientHeight - 50 }}
        />,
      )

      wrapper.simulate('click').should.have.className('upward')
    })
  })
})
