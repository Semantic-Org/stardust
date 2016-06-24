import React, { Component } from 'react'
import { Button } from 'stardust'

export default class ButtonButtonsExample extends Component {
  render() {
    return (
      <Button.Group>
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </Button.Group>
    )
  }
}
