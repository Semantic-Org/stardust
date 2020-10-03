import React, { Component } from 'react'
import { Rating } from 'semantic-ui-react'

export default class RatingExampleControlled extends Component {
  state = { rating: 0 }

  handleChange = (e) => this.setState({ rating: e.target.value })

  render() {
    const { rating } = this.state

    return (
      <div>
        <div>Rating: {rating}</div>
        <input
          type='range'
          min={0}
          max={5}
          value={rating}
          onChange={this.handleChange}
        />
        <br />
        <Rating rating={this.state.rating} maxRating={5} />
      </div>
    )
  }
}
