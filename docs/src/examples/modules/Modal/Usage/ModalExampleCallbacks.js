import React from 'react'
import { Button, Grid, Label, Modal, Segment } from 'semantic-ui-react'

function exampleReducer(state, action) {
  switch (action.type) {
    case 'CLEAR_LOG':
      return { ...state, log: [] }
    case 'OPEN_MODAL':
      return {
        log: [
          {
            event: action.event,
            date: new Date().toLocaleTimeString(),
            name: action.name,
            value: true,
          },
          ...state.log,
        ],
        open: true,
      }
    case 'CLOSE_MODAL':
      return {
        log: [
          {
            event: action.event,
            date: new Date().toLocaleTimeString(),
            name: action.name,
            value: true,
          },
          ...state.log,
        ],
        open: false,
      }
    default:
      throw new Error()
  }
}

function ModalExampleCallbacks() {
  const [state, dispatch] = React.useReducer(exampleReducer, {
    log: [],
    open: false,
  })
  const { log, open } = state

  return (
    <Grid>
      <Grid.Column width={4}>
        <Modal
          onOpen={(e) =>
            dispatch({ event: e.type, name: 'onOpen', type: 'OPEN_MODAL' })
          }
          onClose={(e) =>
            dispatch({ event: e.type, name: 'onClose', type: 'CLOSE_MODAL' })
          }
          open={open}
          trigger={<Button>Open a modal</Button>}
        >
          <Modal.Header>Delete Your Account</Modal.Header>
          <Modal.Content>
            <p>Are you sure you want to delete your account</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={(e) =>
                dispatch({
                  event: e.type,
                  name: 'onClick',
                  type: 'CLOSE_MODAL',
                })
              }
              negative
            >
              No
            </Button>
            <Button
              onClick={(e) =>
                dispatch({
                  event: e.type,
                  name: 'onClick',
                  type: 'CLOSE_MODAL',
                })
              }
              positive
            >
              Yes
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
      <Grid.Column width={12}>
        {log.length > 0 && (
          <Segment attached='top' secondary>
            {log.map((entry, i) => (
              <pre key={i}>
                [{entry.date}] {entry.name} (
                {JSON.stringify({
                  e: { type: entry.event },
                  data: { open: entry.value },
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

export default ModalExampleCallbacks
