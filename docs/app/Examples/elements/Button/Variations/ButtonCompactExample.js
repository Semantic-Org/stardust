import React, { Component } from 'react'
import { Button } from 'stardust'

export default class ButtonCompactExample extends Component {
  render() {
    return (
      <div>
        <Button compact>Compact</Button>
        <Button>Normal</Button>
      </div>
    )
  }
}
