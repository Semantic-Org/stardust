import React from 'react'
import { Button, Divider, Form, Grid, Segment } from 'semantic-ui-react'

const DividerExampleVerticalForm = () => (
  <Segment placeholder>
    <Grid columns={3} relaxed='very' stackable>
      <Grid.Column>
        <Form>
          <Form.Input
            icon='user'
            iconPosition='left'
            label='Username'
            placeholder='Username'
          />
          <Form.Input
            icon='lock'
            iconPosition='left'
            label='Password'
            type='password'
          />
          <Button content='Login' primary />
        </Form>
      </Grid.Column>
  
      <Grid.Column>
        <Divider vertical>Or</Divider>
      </Grid.Column>

      <Grid.Column verticalAlign='middle'>
        <Button content='Sign up' icon='signup' size='big' />
      </Grid.Column>
    </Grid>
  </Segment>
)

export default DividerExampleVerticalForm
