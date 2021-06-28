import EventStack from '@semantic-ui-react/event-stack'
import { Ref } from '@fluentui/react-component-ref'
import cx from 'clsx'
import keyboardKey from 'keyboard-key'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React, { Children, cloneElement, createRef } from 'react'
import shallowEqual from 'shallowequal'

import {
  ModernAutoControlledComponent as Component,
  childrenUtils,
  customPropTypes,
  doesNodeContainClick,
  getElementType,
  getUnhandledProps,
  makeDebugger,
  objectDiff,
  useKeyOnly,
  useKeyOrValueAndKey,
} from '../../lib'
import Icon from '../../elements/Icon'
import Label from '../../elements/Label'
import Flag from '../../elements/Flag'
import Image from '../../elements/Image'
import DropdownDivider from './DropdownDivider'
import DropdownItem from './DropdownItem'
import DropdownHeader from './DropdownHeader'
import DropdownMenu from './DropdownMenu'
import DropdownSearchInput from './DropdownSearchInput'
import DropdownText from './DropdownText'
import getMenuOptions from './utils/getMenuOptions'
import getSelectedIndex from './utils/getSelectedIndex'

const debug = makeDebugger('dropdown')

const getKeyOrValue = (key, value) => (_.isNil(key) ? value : key)
const getKeyAndValues = (options) =>
  options ? options.map((option) => _.pick(option, ['key', 'value'])) : options

function renderItemContent(item) {
  const { flag, image, text } = item

  // TODO: remove this in v3
  // This maintains compatibility with Shorthand API in v1 as this might be called in "Label.create()"
  if (_.isFunction(text)) {
    return text
  }

  return {
    content: (
      <>
        {Flag.create(flag)}
        {Image.create(image)}

        {text}
      </>
    ),
  }
}

/**
 * A dropdown allows a user to select a value from a series of options.
 * @see Form
 * @see Select
 * @see Menu
 */
export default class Dropdown extends Component {
  searchRef = createRef()
  sizerRef = createRef()
  ref = createRef()

  getInitialAutoControlledState() {
    return { focus: false, searchQuery: '' }
  }

  static getAutoControlledStateFromProps(nextProps, computedState, prevState) {
    // These values are stored only for a comparison on next getAutoControlledStateFromProps()
    const derivedState = { __options: nextProps.options, __value: computedState.value }

    // The selected index is only dependent:
    const shouldComputeSelectedIndex =
      // On value change
      !shallowEqual(prevState.__value, computedState.value) ||
      // On option keys/values, we only check those properties to avoid recursive performance impacts.
      // https://github.com/Semantic-Org/Semantic-UI-React/issues/3000
      !_.isEqual(getKeyAndValues(nextProps.options), getKeyAndValues(prevState.__options))

    if (shouldComputeSelectedIndex) {
      derivedState.selectedIndex = getSelectedIndex({
        additionLabel: nextProps.additionLabel,
        additionPosition: nextProps.additionPosition,
        allowAdditions: nextProps.allowAdditions,
        deburr: nextProps.deburr,
        multiple: nextProps.multiple,
        search: nextProps.search,
        selectedIndex: computedState.selectedIndex,

        value: computedState.value,
        options: nextProps.options,
        searchQuery: computedState.searchQuery,
      })
    }

    return derivedState
  }

  componentDidMount() {
    debug('componentDidMount()')
    const { open } = this.state

    if (open) {
      this.open(null, false)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props) || !shallowEqual(nextState, this.state)
  }

  componentDidUpdate(prevProps, prevState) {
    // eslint-disable-line complexity
    debug('componentDidUpdate()')
    debug('to state:', objectDiff(prevState, this.state))

    const { closeOnBlur, minCharacters, openOnFocus, search } = this.props

    /* eslint-disable no-console */
    if (process.env.NODE_ENV !== 'production') {
      // in development, validate value type matches dropdown type
      const isNextValueArray = Array.isArray(this.props.value)
      const hasValue = _.has(this.props, 'value')

      if (hasValue && this.props.multiple && !isNextValueArray) {
        console.error(
          'Dropdown `value` must be an array when `multiple` is set.' +
            ` Received type: \`${Object.prototype.toString.call(this.props.value)}\`.`,
        )
      } else if (hasValue && !this.props.multiple && isNextValueArray) {
        console.error(
          'Dropdown `value` must not be an array when `multiple` is not set.' +
            ' Either set `multiple={true}` or use a string or number value.',
        )
      }
    }
    /* eslint-enable no-console */

    // focused / blurred
    if (!prevState.focus && this.state.focus) {
      debug('dropdown focused')
      if (!this.isMouseDown) {
        const openable = !search || (search && minCharacters === 1 && !this.state.open)

        debug('mouse is not down, opening')
        if (openOnFocus && openable) this.open()
      }
    } else if (prevState.focus && !this.state.focus) {
      debug('dropdown blurred')

      if (!this.isMouseDown && closeOnBlur) {
        debug('mouse is not down and closeOnBlur=true, closing')
        this.close()
      }
    }

    // opened / closed
    if (!prevState.open && this.state.open) {
      debug('dropdown opened')
      this.setOpenDirection()
      this.scrollSelectedItemIntoView()
    } else if (prevState.open && !this.state.open) {
      debug('dropdown closed')
    }

    if (prevState.selectedIndex !== this.state.selectedIndex) {
      this.scrollSelectedItemIntoView()
    }
  }

  // ----------------------------------------
  // Document Event Handlers
  // ----------------------------------------

  // onChange needs to receive a value
  // can't rely on props.value if we are controlled
  handleChange = (e, value) => {
    debug('handleChange()', value)
    _.invoke(this.props, 'onChange', e, { ...this.props, value })
  }

  closeOnChange = (e) => {
    const { closeOnChange, multiple } = this.props
    const shouldClose = _.isUndefined(closeOnChange) ? !multiple : closeOnChange

    if (shouldClose) {
      this.close(e, _.noop)
    }
  }

  closeOnEscape = (e) => {
    if (!this.props.closeOnEscape) return
    if (keyboardKey.getCode(e) !== keyboardKey.Escape) return
    e.preventDefault()

    debug('closeOnEscape()')
    this.close(e)
  }

  moveSelectionOnKeyDown = (e) => {
    debug('moveSelectionOnKeyDown()', keyboardKey.getKey(e))

    const { multiple, selectOnNavigation } = this.props
    const { open } = this.state

    if (!open) {
      return
    }

    const moves = {
      [keyboardKey.ArrowDown]: 1,
      [keyboardKey.ArrowUp]: -1,
    }
    const move = moves[keyboardKey.getCode(e)]

    if (move === undefined) {
      return
    }

    e.preventDefault()
    const nextIndex = this.getSelectedIndexAfterMove(move)

    if (!multiple && selectOnNavigation) {
      this.makeSelectedItemActive(e, nextIndex)
    }

    this.setState({ selectedIndex: nextIndex })
  }

  openOnSpace = (e) => {
    debug('openOnSpace()')

    const shouldHandleEvent =
      this.state.focus && !this.state.open && keyboardKey.getCode(e) === keyboardKey.Spacebar
    const shouldPreventDefault =
      e.target?.tagName !== 'INPUT' &&
      e.target?.tagName !== 'TEXTAREA' &&
      e.target?.isContentEditable !== true

    if (shouldHandleEvent) {
      if (shouldPreventDefault) {
        e.preventDefault()
      }

      this.open(e)
    }
  }

  openOnArrow = (e) => {
    debug('openOnArrow()')
    const { focus, open } = this.state

    if (focus && !open) {
      const code = keyboardKey.getCode(e)

      if (code === keyboardKey.ArrowDown || code === keyboardKey.ArrowUp) {
        e.preventDefault()
        this.open(e)
      }
    }
  }

  makeSelectedItemActive = (e, selectedIndex) => {
    const { open, value } = this.state
    const { multiple } = this.props

    const item = this.getSelectedItem(selectedIndex)
    const selectedValue = _.get(item, 'value')

    // prevent selecting null if there was no selected item value
    // prevent selecting duplicate items when the dropdown is closed
    if (_.isNil(selectedValue) || !open) {
      return value
    }

    // state value may be undefined
    const newValue = multiple ? _.union(value, [selectedValue]) : selectedValue
    const valueHasChanged = multiple ? !!_.difference(newValue, value).length : newValue !== value

    if (valueHasChanged) {
      // notify the onChange prop that the user is trying to change value
      this.setState({ value: newValue })
      this.handleChange(e, newValue)

      // Heads up! This event handler should be called after `onChange`
      // Notify the onAddItem prop if this is a new value
      if (item['data-additional']) {
        _.invoke(this.props, 'onAddItem', e, { ...this.props, value: selectedValue })
      }
    }

    return value
  }

  selectItemOnEnter = (e) => {
    debug('selectItemOnEnter()', keyboardKey.getKey(e))
    const { search } = this.props
    const { open, selectedIndex } = this.state

    if (!open) {
      return
    }

    const shouldSelect =
      keyboardKey.getCode(e) === keyboardKey.Enter ||
      // https://github.com/Semantic-Org/Semantic-UI-React/pull/3766
      (!search && keyboardKey.getCode(e) === keyboardKey.Spacebar)

    if (!shouldSelect) {
      return
    }

    e.preventDefault()

    const optionSize = _.size(
      getMenuOptions({
        value: this.state.value,
        options: this.props.options,
        searchQuery: this.state.searchQuery,

        additionLabel: this.props.additionLabel,
        additionPosition: this.props.additionPosition,
        allowAdditions: this.props.allowAdditions,
        deburr: this.props.deburr,
        multiple: this.props.multiple,
        search: this.props.search,
      }),
    )

    if (search && optionSize === 0) {
      return
    }

    const nextValue = this.makeSelectedItemActive(e, selectedIndex)

    // This is required as selected value may be the same
    this.setState({
      selectedIndex: getSelectedIndex({
        additionLabel: this.props.additionLabel,
        additionPosition: this.props.additionPosition,
        allowAdditions: this.props.allowAdditions,
        deburr: this.props.deburr,
        multiple: this.props.multiple,
        search: this.props.search,
        selectedIndex,

        value: nextValue,
        options: this.props.options,
        searchQuery: '',
      }),
    })

    this.closeOnChange(e)
    this.clearSearchQuery()

    if (search) {
      _.invoke(this.searchRef.current, 'focus')
    }
  }

  removeItemOnBackspace = (e) => {
    debug('removeItemOnBackspace()', keyboardKey.getKey(e))

    const { multiple, search } = this.props
    const { searchQuery, value } = this.state

    if (keyboardKey.getCode(e) !== keyboardKey.Backspace) return
    if (searchQuery || !search || !multiple || _.isEmpty(value)) return
    e.preventDefault()

    // remove most recent value
    const newValue = _.dropRight(value)

    this.setState({ value: newValue })
    this.handleChange(e, newValue)
  }

  closeOnDocumentClick = (e) => {
    debug('closeOnDocumentClick()')
    debug(e)

    if (!this.props.closeOnBlur) return

    // If event happened in the dropdown, ignore it
    if (this.ref.current && doesNodeContainClick(this.ref.current, e)) return

    this.close()
  }

  // ----------------------------------------
  // Component Event Handlers
  // ----------------------------------------

  handleMouseDown = (e) => {
    debug('handleMouseDown()')

    this.isMouseDown = true
    _.invoke(this.props, 'onMouseDown', e, this.props)
    document.addEventListener('mouseup', this.handleDocumentMouseUp)
  }

  handleDocumentMouseUp = () => {
    debug('handleDocumentMouseUp()')

    this.isMouseDown = false
    document.removeEventListener('mouseup', this.handleDocumentMouseUp)
  }

  handleClick = (e) => {
    debug('handleClick()', e)

    const { minCharacters, search } = this.props
    const { open, searchQuery } = this.state

    _.invoke(this.props, 'onClick', e, this.props)
    // prevent closeOnDocumentClick()
    e.stopPropagation()

    if (!search) return this.toggle(e)
    if (open) {
      _.invoke(this.searchRef.current, 'focus')
      return
    }
    if (searchQuery.length >= minCharacters || minCharacters === 1) {
      this.open(e)
      return
    }
    _.invoke(this.searchRef.current, 'focus')
  }

  handleIconClick = (e) => {
    const { clearable } = this.props
    const hasValue = this.hasValue()
    debug('handleIconClick()', { e, clearable, hasValue })

    _.invoke(this.props, 'onClick', e, this.props)
    // prevent handleClick()
    e.stopPropagation()

    if (clearable && hasValue) {
      this.clearValue(e)
    } else {
      this.toggle(e)
    }
  }

  handleItemClick = (e, item) => {
    debug('handleItemClick()', item)

    const { multiple, search } = this.props
    const { value: currentValue } = this.state
    const { value } = item

    // prevent toggle() in handleClick()
    e.stopPropagation()

    // prevent closeOnDocumentClick() if multiple or item is disabled
    if (multiple || item.disabled) {
      e.nativeEvent.stopImmediatePropagation()
    }
    if (item.disabled) {
      return
    }

    const isAdditionItem = item['data-additional']
    const newValue = multiple ? _.union(this.state.value, [value]) : value
    const valueHasChanged = multiple
      ? !!_.difference(newValue, currentValue).length
      : newValue !== currentValue

    // notify the onChange prop that the user is trying to change value
    if (valueHasChanged) {
      this.setState({ value: newValue })
      this.handleChange(e, newValue)
    }

    this.clearSearchQuery()

    if (search) {
      _.invoke(this.searchRef.current, 'focus')
    } else {
      _.invoke(this.ref.current, 'focus')
    }

    this.closeOnChange(e)

    // Heads up! This event handler should be called after `onChange`
    // Notify the onAddItem prop if this is a new value
    if (isAdditionItem) {
      _.invoke(this.props, 'onAddItem', e, { ...this.props, value })
    }
  }

  handleFocus = (e) => {
    debug('handleFocus()')
    const { focus } = this.state

    if (focus) return

    _.invoke(this.props, 'onFocus', e, this.props)
    this.setState({ focus: true })
  }

  handleBlur = (e) => {
    debug('handleBlur()')

    // Heads up! Don't remove this.
    // https://github.com/Semantic-Org/Semantic-UI-React/issues/1315
    const currentTarget = _.get(e, 'currentTarget')
    if (currentTarget && currentTarget.contains(document.activeElement)) return

    const { closeOnBlur, multiple, selectOnBlur } = this.props
    // do not "blur" when the mouse is down inside of the Dropdown
    if (this.isMouseDown) return

    _.invoke(this.props, 'onBlur', e, this.props)

    if (selectOnBlur && !multiple) {
      this.makeSelectedItemActive(e, this.state.selectedIndex)
      if (closeOnBlur) this.close()
    }

    this.setState({ focus: false })
    this.clearSearchQuery()
  }

  handleSearchChange = (e, { value }) => {
    debug('handleSearchChange()')
    debug(value)

    // prevent propagating to this.props.onChange()
    e.stopPropagation()

    const { minCharacters } = this.props
    const { open } = this.state
    const newQuery = value

    _.invoke(this.props, 'onSearchChange', e, { ...this.props, searchQuery: newQuery })
    this.setState({ searchQuery: newQuery, selectedIndex: 0 })

    // open search dropdown on search query
    if (!open && newQuery.length >= minCharacters) {
      this.open()
      return
    }
    // close search dropdown if search query is too small
    if (open && minCharacters !== 1 && newQuery.length < minCharacters) this.close()
  }

  handleKeyDown = (e) => {
    this.moveSelectionOnKeyDown(e)
    this.openOnArrow(e)
    this.openOnSpace(e)
    this.selectItemOnEnter(e)

    _.invoke(this.props, 'onKeyDown', e)
  }

  // ----------------------------------------
  // Getters
  // ----------------------------------------

  getSelectedItem = (selectedIndex) => {
    const options = getMenuOptions({
      value: this.state.value,
      options: this.props.options,
      searchQuery: this.state.searchQuery,

      additionLabel: this.props.additionLabel,
      additionPosition: this.props.additionPosition,
      allowAdditions: this.props.allowAdditions,
      deburr: this.props.deburr,
      multiple: this.props.multiple,
      search: this.props.search,
    })

    return _.get(options, `[${selectedIndex}]`)
  }

  getItemByValue = (value) => {
    const { options } = this.props

    return _.find(options, { value })
  }

  getDropdownAriaOptions = () => {
    const { loading, disabled, search, multiple } = this.props
    const { open } = this.state
    const ariaOptions = {
      role: search ? 'combobox' : 'listbox',
      'aria-busy': loading,
      'aria-disabled': disabled,
      'aria-expanded': !!open,
    }
    if (ariaOptions.role === 'listbox') {
      ariaOptions['aria-multiselectable'] = multiple
    }
    return ariaOptions
  }

  getDropdownMenuAriaOptions() {
    const { search, multiple } = this.props
    const ariaOptions = {}

    if (search) {
      ariaOptions['aria-multiselectable'] = multiple
      ariaOptions.role = 'listbox'
    }
    return ariaOptions
  }

  // ----------------------------------------
  // Setters
  // ----------------------------------------

  clearSearchQuery = () => {
    debug('clearSearchQuery()')

    const { searchQuery } = this.state
    if (searchQuery === undefined || searchQuery === '') return

    this.setState({ searchQuery: '' })
  }

  handleLabelClick = (e, labelProps) => {
    debug('handleLabelClick()')
    // prevent focusing search input on click
    e.stopPropagation()

    this.setState({ selectedLabel: labelProps.value })
    _.invoke(this.props, 'onLabelClick', e, labelProps)
  }

  handleLabelRemove = (e, labelProps) => {
    debug('handleLabelRemove()')
    // prevent focusing search input on click
    e.stopPropagation()
    const { value } = this.state
    const newValue = _.without(value, labelProps.value)
    debug('label props:', labelProps)
    debug('current value:', value)
    debug('remove value:', labelProps.value)
    debug('new value:', newValue)

    this.setState({ value: newValue })
    this.handleChange(e, newValue)
  }

  getSelectedIndexAfterMove = (offset, startIndex = this.state.selectedIndex) => {
    debug('moveSelectionBy()')
    debug(`offset: ${offset}`)

    const options = getMenuOptions({
      value: this.state.value,
      options: this.props.options,
      searchQuery: this.state.searchQuery,

      additionLabel: this.props.additionLabel,
      additionPosition: this.props.additionPosition,
      allowAdditions: this.props.allowAdditions,
      deburr: this.props.deburr,
      multiple: this.props.multiple,
      search: this.props.search,
    })

    // Prevent infinite loop
    // TODO: remove left part of condition after children API will be removed
    if (options === undefined || _.every(options, 'disabled')) return

    const lastIndex = options.length - 1
    const { wrapSelection } = this.props
    // next is after last, wrap to beginning
    // next is before first, wrap to end
    let nextIndex = startIndex + offset

    // if 'wrapSelection' is set to false and selection is after last or before first, it just does not change
    if (!wrapSelection && (nextIndex > lastIndex || nextIndex < 0)) {
      nextIndex = startIndex
    } else if (nextIndex > lastIndex) {
      nextIndex = 0
    } else if (nextIndex < 0) {
      nextIndex = lastIndex
    }

    if (options[nextIndex].disabled) {
      return this.getSelectedIndexAfterMove(offset, nextIndex)
    }

    return nextIndex
  }

  // ----------------------------------------
  // Overrides
  // ----------------------------------------

  handleIconOverrides = (predefinedProps) => {
    const { clearable } = this.props
    const classes = cx(clearable && this.hasValue() && 'clear', predefinedProps.className)

    return {
      className: classes,
      onClick: (e) => {
        _.invoke(predefinedProps, 'onClick', e, predefinedProps)
        this.handleIconClick(e)
      },
    }
  }

  // ----------------------------------------
  // Helpers
  // ----------------------------------------

  clearValue = (e) => {
    const { multiple } = this.props
    const newValue = multiple ? [] : ''

    this.setState({ value: newValue })
    this.handleChange(e, newValue)
  }

  computeSearchInputTabIndex = () => {
    const { disabled, tabIndex } = this.props

    if (!_.isNil(tabIndex)) return tabIndex
    return disabled ? -1 : 0
  }

  computeSearchInputWidth = () => {
    const { searchQuery } = this.state

    if (this.sizerRef.current && searchQuery) {
      // resize the search input, temporarily show the sizer so we can measure it

      this.sizerRef.current.style.display = 'inline'
      this.sizerRef.current.textContent = searchQuery
      const searchWidth = Math.ceil(this.sizerRef.current.getBoundingClientRect().width)
      this.sizerRef.current.style.removeProperty('display')

      return searchWidth
    }
  }

  computeTabIndex = () => {
    const { disabled, search, tabIndex } = this.props

    // don't set a root node tabIndex as the search input has its own tabIndex
    if (search) return undefined
    if (disabled) return -1
    return _.isNil(tabIndex) ? 0 : tabIndex
  }

  handleSearchInputOverrides = (predefinedProps) => ({
    onChange: (e, inputProps) => {
      _.invoke(predefinedProps, 'onChange', e, inputProps)
      this.handleSearchChange(e, inputProps)
    },
  })

  hasValue = () => {
    const { multiple } = this.props
    const { value } = this.state

    return multiple ? !_.isEmpty(value) : !_.isNil(value) && value !== ''
  }

  // ----------------------------------------
  // Behavior
  // ----------------------------------------

  scrollSelectedItemIntoView = () => {
    debug('scrollSelectedItemIntoView()')
    if (!this.ref.current) return
    const menu = this.ref.current.querySelector('.menu.visible')
    if (!menu) return
    const item = menu.querySelector('.item.selected')
    if (!item) return
    debug(`menu: ${menu}`)
    debug(`item: ${item}`)
    const isOutOfUpperView = item.offsetTop < menu.scrollTop
    const isOutOfLowerView = item.offsetTop + item.clientHeight > menu.scrollTop + menu.clientHeight

    if (isOutOfUpperView) {
      menu.scrollTop = item.offsetTop
    } else if (isOutOfLowerView) {
      // eslint-disable-next-line no-mixed-operators
      menu.scrollTop = item.offsetTop + item.clientHeight - menu.clientHeight
    }
  }

  setOpenDirection = () => {
    if (!this.ref.current) return

    const menu = this.ref.current.querySelector('.menu.visible')

    if (!menu) return

    const dropdownRect = this.ref.current.getBoundingClientRect()
    const menuHeight = menu.clientHeight
    const spaceAtTheBottom =
      document.documentElement.clientHeight - dropdownRect.top - dropdownRect.height - menuHeight
    const spaceAtTheTop = dropdownRect.top - menuHeight

    const upward = spaceAtTheBottom < 0 && spaceAtTheTop > spaceAtTheBottom

    // set state only if there's a relevant difference
    if (!upward !== !this.state.upward) {
      this.setState({ upward })
    }
  }

  open = (e = null, triggerSetState = true) => {
    const { disabled, search } = this.props
    debug('open()', { disabled, search, open: this.state.open })

    if (disabled) return
    if (search) _.invoke(this.searchRef.current, 'focus')

    _.invoke(this.props, 'onOpen', e, this.props)

    if (triggerSetState) {
      this.setState({ open: true })
    }
    this.scrollSelectedItemIntoView()
  }

  close = (e, callback = this.handleClose) => {
    debug('close()', { open: this.state.open })

    if (this.state.open) {
      _.invoke(this.props, 'onClose', e, this.props)
      this.setState({ open: false }, callback)
    }
  }

  handleClose = () => {
    debug('handleClose()')

    const hasSearchFocus = document.activeElement === this.searchRef.current
    // https://github.com/Semantic-Org/Semantic-UI-React/issues/627
    // Blur the Dropdown on close so it is blurred after selecting an item.
    // This is to prevent it from re-opening when switching tabs after selecting an item.
    if (!hasSearchFocus && this.ref.current) {
      this.ref.current.blur()
    }

    const hasDropdownFocus = document.activeElement === this.ref.current
    const hasFocus = hasSearchFocus || hasDropdownFocus

    // We need to keep the virtual model in sync with the browser focus change
    // https://github.com/Semantic-Org/Semantic-UI-React/issues/692
    this.setState({ focus: hasFocus })
  }

  toggle = (e) => (this.state.open ? this.close(e) : this.open(e))

  // ----------------------------------------
  // Render
  // ----------------------------------------

  renderText = () => {
    const { multiple, placeholder, search, text } = this.props
    const { searchQuery, selectedIndex, value, open } = this.state
    const hasValue = this.hasValue()

    const classes = cx(
      placeholder && !hasValue && 'default',
      'text',
      search && searchQuery && 'filtered',
    )
    let _text = placeholder
    let selectedItem

    if (text) {
      _text = text
    } else if (open && !multiple) {
      selectedItem = this.getSelectedItem(selectedIndex)
    } else if (hasValue) {
      selectedItem = this.getItemByValue(value)
    }

    return DropdownText.create(selectedItem ? renderItemContent(selectedItem) : _text, {
      defaultProps: {
        className: classes,
      },
    })
  }

  renderSearchInput = () => {
    const { search, searchInput } = this.props
    const { searchQuery } = this.state

    return (
      search && (
        <Ref innerRef={this.searchRef}>
          {DropdownSearchInput.create(searchInput, {
            defaultProps: {
              style: { width: this.computeSearchInputWidth() },
              tabIndex: this.computeSearchInputTabIndex(),
              value: searchQuery,
            },
            overrideProps: this.handleSearchInputOverrides,
          })}
        </Ref>
      )
    )
  }

  renderSearchSizer = () => {
    const { search, multiple } = this.props

    return search && multiple && <span className='sizer' ref={this.sizerRef} />
  }

  renderLabels = () => {
    debug('renderLabels()')
    const { multiple, renderLabel } = this.props
    const { selectedLabel, value } = this.state
    if (!multiple || _.isEmpty(value)) {
      return
    }
    const selectedItems = _.map(value, this.getItemByValue)
    debug('selectedItems', selectedItems)

    // if no item could be found for a given state value the selected item will be undefined
    // compact the selectedItems so we only have actual objects left
    return _.map(_.compact(selectedItems), (item, index) => {
      const defaultProps = {
        active: item.value === selectedLabel,
        as: 'a',
        key: getKeyOrValue(item.key, item.value),
        onClick: this.handleLabelClick,
        onRemove: this.handleLabelRemove,
        value: item.value,
      }

      return Label.create(renderLabel(item, index, defaultProps), { defaultProps })
    })
  }

  renderOptions = () => {
    const { lazyLoad, multiple, search, noResultsMessage } = this.props
    const { open, selectedIndex, value } = this.state

    // lazy load, only render options when open
    if (lazyLoad && !open) return null

    const options = getMenuOptions({
      value: this.state.value,
      options: this.props.options,
      searchQuery: this.state.searchQuery,

      additionLabel: this.props.additionLabel,
      additionPosition: this.props.additionPosition,
      allowAdditions: this.props.allowAdditions,
      deburr: this.props.deburr,
      multiple: this.props.multiple,
      search: this.props.search,
    })

    if (noResultsMessage !== null && search && _.isEmpty(options)) {
      return <div className='message'>{noResultsMessage}</div>
    }

    const isActive = multiple
      ? (optValue) => _.includes(value, optValue)
      : (optValue) => optValue === value

    return _.map(options, (opt, i) =>
      DropdownItem.create({
        active: isActive(opt.value),
        onClick: this.handleItemClick,
        selected: selectedIndex === i,
        ...opt,
        key: getKeyOrValue(opt.key, opt.value),
        // Needed for handling click events on disabled items
        style: { ...opt.style, pointerEvents: 'all' },
      }),
    )
  }

  renderMenu = () => {
    const { children, direction, header } = this.props
    const { open } = this.state
    const ariaOptions = this.getDropdownMenuAriaOptions()

    // single menu child
    if (!childrenUtils.isNil(children)) {
      const menuChild = Children.only(children)
      const className = cx(direction, useKeyOnly(open, 'visible'), menuChild.props.className)

      return cloneElement(menuChild, { className, ...ariaOptions })
    }

    return (
      <DropdownMenu {...ariaOptions} direction={direction} open={open}>
        {DropdownHeader.create(header, { autoGenerateKey: false })}
        {this.renderOptions()}
      </DropdownMenu>
    )
  }

  render() {
    debug('render()')
    debug('props', this.props)
    debug('state', this.state)

    const {
      basic,
      button,
      className,
      compact,
      disabled,
      error,
      fluid,
      floating,
      icon,
      inline,
      item,
      labeled,
      loading,
      multiple,
      pointing,
      search,
      selection,
      scrolling,
      simple,
      trigger,
    } = this.props
    const { focus, open, upward } = this.state

    // Classes
    const classes = cx(
      'ui',
      useKeyOnly(open, 'active visible'),
      useKeyOnly(disabled, 'disabled'),
      useKeyOnly(error, 'error'),
      useKeyOnly(loading, 'loading'),

      useKeyOnly(basic, 'basic'),
      useKeyOnly(button, 'button'),
      useKeyOnly(compact, 'compact'),
      useKeyOnly(fluid, 'fluid'),
      useKeyOnly(floating, 'floating'),
      useKeyOnly(inline, 'inline'),
      // TODO: consider augmentation to render Dropdowns as Button/Menu, solves icon/link item issues
      // https://github.com/Semantic-Org/Semantic-UI-React/issues/401#issuecomment-240487229
      // TODO: the icon class is only required when a dropdown is a button
      // useKeyOnly(icon, 'icon'),
      useKeyOnly(labeled, 'labeled'),
      useKeyOnly(item, 'item'),
      useKeyOnly(multiple, 'multiple'),
      useKeyOnly(search, 'search'),
      useKeyOnly(selection, 'selection'),
      useKeyOnly(simple, 'simple'),
      useKeyOnly(scrolling, 'scrolling'),
      useKeyOnly(upward, 'upward'),

      useKeyOrValueAndKey(pointing, 'pointing'),
      'dropdown',
      className,
    )
    const rest = getUnhandledProps(Dropdown, this.props)
    const ElementType = getElementType(Dropdown, this.props)
    const ariaOptions = this.getDropdownAriaOptions(ElementType, this.props)

    return (
      <Ref innerRef={this.ref}>
        <ElementType
          {...rest}
          {...ariaOptions}
          className={classes}
          onBlur={this.handleBlur}
          onClick={this.handleClick}
          onKeyDown={this.handleKeyDown}
          onMouseDown={this.handleMouseDown}
          onFocus={this.handleFocus}
          onChange={this.handleChange}
          tabIndex={this.computeTabIndex()}
        >
          {this.renderLabels()}
          {this.renderSearchInput()}
          {this.renderSearchSizer()}
          {trigger || this.renderText()}
          {Icon.create(icon, {
            overrideProps: this.handleIconOverrides,
            autoGenerateKey: false,
          })}
          {this.renderMenu()}

          {open && <EventStack name='keydown' on={this.closeOnEscape} />}
          {open && <EventStack name='click' on={this.closeOnDocumentClick} />}

          {focus && <EventStack name='keydown' on={this.removeItemOnBackspace} />}
        </ElementType>
      </Ref>
    )
  }
}

Dropdown.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Label prefixed to an option added by a user. */
  additionLabel: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),

  /** Position of the `Add: ...` option in the dropdown list ('top' or 'bottom'). */
  additionPosition: PropTypes.oneOf(['top', 'bottom']),

  /**
   * Allow user additions to the list of options (boolean).
   * Requires the use of `selection`, `options` and `search`.
   */
  allowAdditions: customPropTypes.every([
    customPropTypes.demand(['options', 'selection', 'search']),
    PropTypes.bool,
  ]),

  /** A Dropdown can reduce its complexity. */
  basic: PropTypes.bool,

  /** Format the Dropdown to appear as a button. */
  button: PropTypes.bool,

  /** Primary content. */
  children: customPropTypes.every([
    customPropTypes.disallow(['options', 'selection']),
    customPropTypes.givenProps(
      { children: PropTypes.any.isRequired },
      PropTypes.element.isRequired,
    ),
  ]),

  /** Additional classes. */
  className: PropTypes.string,

  /** Using the clearable setting will let users remove their selection from a dropdown. */
  clearable: PropTypes.bool,

  /** Whether or not the menu should close when the dropdown is blurred. */
  closeOnBlur: PropTypes.bool,

  /** Whether or not the dropdown should close when the escape key is pressed. */
  closeOnEscape: PropTypes.bool,

  /**
   * Whether or not the menu should close when a value is selected from the dropdown.
   * By default, multiple selection dropdowns will remain open on change, while single
   * selection dropdowns will close on change.
   */
  closeOnChange: PropTypes.bool,

  /** A compact dropdown has no minimum width. */
  compact: PropTypes.bool,

  /** Whether or not the dropdown should strip diacritics in options and input search */
  deburr: PropTypes.bool,

  /** Initial value of open. */
  defaultOpen: PropTypes.bool,

  /** Initial value of searchQuery. */
  defaultSearchQuery: PropTypes.string,

  /** Currently selected label in multi-select. */
  defaultSelectedLabel: customPropTypes.every([
    customPropTypes.demand(['multiple']),
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ]),

  /** Initial value of upward. */
  defaultUpward: PropTypes.bool,

  /** Initial value or value array if multiple. */
  defaultValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])),
  ]),

  /** A dropdown menu can open to the left or to the right. */
  direction: PropTypes.oneOf(['left', 'right']),

  /** A disabled dropdown menu or item does not allow user interaction. */
  disabled: PropTypes.bool,

  match: PropTypes.bool,

  /** An errored dropdown can alert a user to a problem. */
  error: PropTypes.bool,

  /** A dropdown menu can contain floated content. */
  floating: PropTypes.bool,

  /** A dropdown can take the full width of its parent */
  fluid: PropTypes.bool,

  /** A dropdown menu can contain a header. */
  header: PropTypes.node,

  /** Shorthand for Icon. */
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.object]),

  /** A dropdown can be formatted to appear inline in other content. */
  inline: PropTypes.bool,

  /** A dropdown can be formatted as a Menu item. */
  item: PropTypes.bool,

  /** A dropdown can be labeled. */
  labeled: PropTypes.bool,

  /** A dropdown can defer rendering its options until it is open. */
  lazyLoad: PropTypes.bool,

  /** A dropdown can show that it is currently loading data. */
  loading: PropTypes.bool,

  /** The minimum characters for a search to begin showing results. */
  minCharacters: PropTypes.number,

  /** A selection dropdown can allow multiple selections. */
  multiple: PropTypes.bool,

  /** Message to display when there are no results. */
  noResultsMessage: PropTypes.node,

  /**
   * Called when a user adds a new item. Use this to update the options list.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and the new item's value.
   */
  onAddItem: PropTypes.func,

  /**
   * Called on blur.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onBlur: PropTypes.func,

  /**
   * Called when the user attempts to change the value.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and proposed value.
   */
  onChange: PropTypes.func,

  /**
   * Called on click.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClick: PropTypes.func,

  /**
   * Called when a close event happens.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClose: PropTypes.func,

  /**
   * Called on focus.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onFocus: PropTypes.func,

  /**
   * Called when a multi-select label is clicked.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All label props.
   */
  onLabelClick: PropTypes.func,

  /**
   * Called on mousedown.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onMouseDown: PropTypes.func,

  /**
   * Called when an open event happens.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onOpen: PropTypes.func,

  /**
   * Called on search input change.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props, includes current value of searchQuery.
   */
  onSearchChange: PropTypes.func,

  /** Controls whether or not the dropdown menu is displayed. */
  open: PropTypes.bool,

  /** Whether or not the menu should open when the dropdown is focused. */
  openOnFocus: PropTypes.bool,

  /** Array of Dropdown.Item props e.g. `{ text: '', value: '' }` */
  options: customPropTypes.every([
    customPropTypes.disallow(['children']),
    PropTypes.arrayOf(PropTypes.shape(DropdownItem.propTypes)),
  ]),

  /** Placeholder text. */
  placeholder: PropTypes.string,

  /** A dropdown can be formatted so that its menu is pointing. */
  pointing: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([
      'left',
      'right',
      'top',
      'top left',
      'top right',
      'bottom',
      'bottom left',
      'bottom right',
    ]),
  ]),

  /**
   * Mapped over the active items and returns shorthand for the active item Labels.
   * Only applies to `multiple` Dropdowns.
   *
   * @param {object} item - A currently active dropdown item.
   * @param {number} index - The current index.
   * @param {object} defaultLabelProps - The default props for an active item Label.
   * @returns {*} Shorthand for a Label.
   */
  renderLabel: PropTypes.func,

  /** A dropdown can have its menu scroll. */
  scrolling: PropTypes.bool,

  /**
   * A selection dropdown can allow a user to search through a large list of choices.
   * Pass a function here to replace the default search.
   */
  search: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),

  /** A shorthand for a search input. */
  searchInput: PropTypes.oneOfType([PropTypes.array, PropTypes.node, PropTypes.object]),

  /** Current value of searchQuery. Creates a controlled component. */
  searchQuery: PropTypes.string,

  // TODO 'searchInMenu' or 'search='in menu' or ???  How to handle this markup and functionality?

  /** Define whether the highlighted item should be selected on blur. */
  selectOnBlur: PropTypes.bool,

  /**
   * Whether or not to change the value when navigating the menu using arrow keys.
   * Setting to false will require enter or left click to confirm a choice.
   */
  selectOnNavigation: PropTypes.bool,

  /** Currently selected label in multi-select. */
  selectedLabel: customPropTypes.every([
    customPropTypes.demand(['multiple']),
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ]),

  /** A dropdown can be used to select between choices in a form. */
  selection: customPropTypes.every([
    customPropTypes.disallow(['children']),
    customPropTypes.demand(['options']),
    PropTypes.bool,
  ]),

  /** A simple dropdown can open without Javascript. */
  simple: PropTypes.bool,

  /** A dropdown can receive focus. */
  tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /** The text displayed in the dropdown, usually for the active item. */
  text: PropTypes.string,

  /** Custom element to trigger the menu to become visible. Takes place of 'text'. */
  trigger: customPropTypes.every([customPropTypes.disallow(['selection', 'text']), PropTypes.node]),

  /** Current value or value array if multiple. Creates a controlled component. */
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number])),
  ]),

  /** Controls whether the dropdown will open upward. */
  upward: PropTypes.bool,

  /**
   * A dropdown will go to the last element when ArrowUp is pressed on the first,
   * or go to the first when ArrowDown is pressed on the last( aka infinite selection )
   */
  wrapSelection: PropTypes.bool,
}

Dropdown.defaultProps = {
  additionLabel: 'Add ',
  additionPosition: 'top',
  search: true,
  closeOnBlur: true,
  selection: true,
  closeOnEscape: true,
  deburr: false,
  icon: 'dropdown',
  minCharacters: 1,
  noResultsMessage: 'No results found.',
  openOnFocus: true,
  renderLabel: renderItemContent,
  searchInput: 'text',
  match: true,
  selectOnBlur: true,
  selectOnNavigation: true,
  wrapSelection: true,
}

Dropdown.autoControlledProps = ['open', 'searchQuery', 'selectedLabel', 'value', 'upward']

Dropdown.Divider = DropdownDivider
Dropdown.Header = DropdownHeader
Dropdown.Item = DropdownItem
Dropdown.Menu = DropdownMenu
Dropdown.SearchInput = DropdownSearchInput
Dropdown.Text = DropdownText
