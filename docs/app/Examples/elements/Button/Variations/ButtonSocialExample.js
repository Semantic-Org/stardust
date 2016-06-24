import React, { Component } from 'react'
import { Button } from 'stardust'

export default class ButtonSocialExample extends Component {
  render() {
    return (
      <div>
        <Button className='facebook' icon='facebook'>
          Facebook
        </Button>
        <Button className='twitter' icon='twitter'>
          Twitter
        </Button>
        <Button className='google plus' icon='google plus'>
          Google Plus
        </Button>
        <Button className='vk' icon='vk'>
          VK
        </Button>
        <Button className='linkedin' icon='linkedin'>
          LinkedIn
        </Button>
        <Button className='instagram' icon='instagram'>
          Instagram
        </Button>
        <Button className='youtube' icon='youtube'>
          YouTube
        </Button>
      </div>
    )
  }
}
