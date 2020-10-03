import React from 'react'
import { Button, Grid, Label, Rating, Segment } from 'semantic-ui-react'

function exampleReducer(state, action) {
  switch (action.type) {
    case 'CLEAR_LOG':
      return { ...state, log: [] }
    case 'UPDATE_RATING':
      return {
        log: [
          {
            event: action.event,
            date: new Date().toLocaleTimeString(),
            name: action.name,
            isSelecting: action.isSelecting,
            maxRating: action.maxRating,
            rating: action.rating,
          },
          ...state.log,
        ],
        maxRating: action.maxRating,
        rating: action.rating,
      }
    default:
      throw new Error()
  }
}

function RatingExampleCallbacks() {
  const [state, dispatch] = React.useReducer(exampleReducer, {
    log: [],
    maxRating: 5,
    rating: 3,
  })
  const { log, maxRating, rating } = state

  return (
    <Grid>
      <Grid.Column width={4}>
        <Rating
          onRate={(e, data) =>
            dispatch({
              event: e.type,
              name: 'onRate',
              isSelecting: data.isSelecting,
              maxRating: data.maxRating,
              rating: data.rating,
              type: 'UPDATE_RATING',
            })
          }
          maxRating={maxRating}
          rating={rating}
        />
      </Grid.Column>
      <Grid.Column width={12}>
        {log.length > 0 && (
          <Segment attached='top' secondary>
            {log.map((entry, i) => (
              <pre key={i}>
                [{entry.date}] {entry.name} (
                {JSON.stringify({
                  e: { type: entry.event },
                  data: {
                    isSelecting: entry.isSelecting,
                    maxRating: entry.maxRating,
                    rating: entry.rating,
                  },
                })}
                )
              </pre>
            ))}
          </Segment>
        )}
        <Segment attached={log.length > 0 ? 'bottom' : undefined} secondary>
          <Label>Entries: {log.length}</Label>
          <Button
            compact
            floated='right'
            onClick={() => dispatch({ type: 'CLEAR_LOG' })}
            size='tiny'
          >
            Clear
          </Button>
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default RatingExampleCallbacks
