import PropTypes from 'prop-types'
import React from 'react'
import { Link, withSiteData } from 'react-static'
import { Container, Divider, Grid, Header, Icon, Label, List, Segment } from 'semantic-ui-react'

import CodeSnippet from 'docs/src/components/CodeSnippet'
import DocsLayout from 'docs/src/components/DocsLayout'
import Logo from 'docs/src/components/Logo/Logo'
import { semanticUIDocsURL, repoURL } from 'docs/src/utils'

const AccordionJSX = `<Accordion panels={[
  { title: 'What is a dog?', content: '...' },
  { title: 'What kinds are there?', content: '...' },
]} />`
const AccordionHTML = `<div class="ui accordion">
  <div class="title">
    <i class="dropdown icon"></i>
    What is a dog?
  </div>
  <div class="content">
    <p>...</p>
  </div>
  <div class="title">
    <i class="dropdown icon"></i>
    What kinds are there?
  </div>
  <div class="content">
    <p>...</p>
  </div>
</div>`

const ButtonJSX = `<Button size='small' color='green'>
  <Icon name='download' />
  Download
</Button>`
const ButtonHTML = `<button class="ui small green button">
  <i class="download icon"></i>
  Download
</button>`
const LabelJSX = "<Label image='veronika.jpg' />"
const LabelHTML = `<div class="ui image label">
  <img src="veronika.jpg">
</div>`
const RatingJSX = '<Rating rating={1} maxRating={5} />'
const RatingHTML = `<div
  class="ui rating"
  data-rating="1"
  data-max-rating="5"
></div>`

const MessageIconJSX = `<Message
  success
  icon='thumbs up'
  header='Nice job!'
  content='Your profile is complete.'
/>`
const MessageIconHTML = `<div class="ui success message">
  <i class="thumbs up icon"></i>
  <div class="content">
    <div class="header">
      Nice job!
    </div>
    Your profile is complete.
  </div>
</div>`

const MessageSubcomponentsJSX = `<Message icon>
  <Icon name='circle notched' loading />
  <Message.Content>
    <Message.Header>
      Just one second
    </Message.Header>
    We're fetching that content for you.
  </Message.Content>
</Message>`
const MessageSubcomponentsHTML = `<div class="ui icon message">
  <i class="loading circle notched icon"></i>
  <div class="content">
    <div class="header">
      Just one second
    </div>
    We're fetching that content for you.
  </div>
</div>`
const HeaderAugmentationJSX = `<Header as='h3'>
  Learn More
</Header>`
const HeaderAugmentationHTML = `<h3 class="ui header">
  Learn More
</h3>`
const MenuItemLinkAugmentationJSX = `import { Link } from 'react-router-dom'

<Menu>
  <Menu.Item as={Link} to='/home'>
    Home
  </Menu.Item>
</Menu>`
const MenuItemLinkAugmentationHTML = `<div class="ui menu">
  <a class="item" href="/home">
    Home
  </a>
</div>`

const Comparison = ({ jsx, html }) => (
  <Segment inverted style={{ backgroundColor: '#2d2d2d' }}>
    <Grid columns='equal' centered textAlign='left'>
      <Grid.Column computer='8' largeScreen='7' widescreen='7'>
        <Label color='grey' size='tiny' attached='top left'>
          JSX
        </Label>
        <CodeSnippet fitted label={false} mode='jsx' value={jsx} />
      </Grid.Column>
      <Grid.Column largeScreen='2' only='large screen' textAlign='center'>
        <Divider vertical>
          <Icon inverted name='right arrow circle' />
        </Divider>
      </Grid.Column>
      <Grid.Column computer='8' largeScreen='7' widescreen='7'>
        <Label color='grey' size='tiny' attached='top right'>
          Rendered HTML
        </Label>
        <CodeSnippet fitted label={false} mode='html' value={html} />
      </Grid.Column>
    </Grid>
  </Segment>
)

Comparison.propTypes = {
  jsx: PropTypes.string,
  html: PropTypes.string,
}

const Introduction = ({ pkg, title }) => (
  <DocsLayout additionalTitle='Introduction' title={title}>
    <Container id='introduction-page'>
      <Segment basic textAlign='center'>
        <Logo centered size='small' />
        <Header as='h1' textAlign='center'>
          Semantic UI React
          <Header.Subheader>{pkg.description}</Header.Subheader>
        </Header>
      </Segment>

      <Segment basic padded>
        <Header as='h2' dividing>
          Introduction
        </Header>
        <p>
          Semantic UI React is the official React integration for{' '}
          <a href={semanticUIDocsURL}>Semantic UI</a> .
        </p>
        <List>
          <List.Item icon='check' content='jQuery Free' />
          <List.Item icon='check' content='Declarative API' />
          <List.Item icon='check' content='Augmentation' />
          <List.Item icon='check' content='Shorthand Props' />
          <List.Item icon='check' content='Sub Components' />
          <List.Item icon='check' content='Auto Controlled State' />
        </List>
        <p>
          Installation instructions are provided in the <Link to='/usage'>Usage</Link> section.
        </p>
      </Segment>

      {/* ----------------------------------------
       *  jQuery Free
       * -------------------------------------- */}
      <Segment basic padded>
        <Header as='h2' dividing>
          jQuery Free
        </Header>
        <p>
          jQuery is a DOM manipulation library. It reads from and writes to the DOM. React uses a
          virtual DOM (a JavaScript representation of the real DOM). React only <em>writes</em>{' '}
          patch updates to the DOM, but <em>never reads</em> from it.
        </p>
        <p>
          It is not feasible to keep real DOM manipulations in sync with React's virtual DOM.
          Because of this, all jQuery functionality has been re-implemented in React.
        </p>
      </Segment>

      {/* ----------------------------------------
       *  Declarative API
       * -------------------------------------- */}
      <Segment basic padded>
        <Header as='h2' dividing>
          Declarative API
        </Header>
        <p>Declarative APIs provide for robust features and prop validation.</p>

        <Comparison jsx={RatingJSX} html={RatingHTML} />
        <Comparison jsx={ButtonJSX} html={ButtonHTML} />
      </Segment>

      {/* ----------------------------------------
       *  Augmentation
       * -------------------------------------- */}
      <Segment basic padded>
        <Header as='h2' dividing>
          Augmentation
        </Header>
        <p>
          Control the rendered HTML tag, or render one component <code>as</code> another component.
          Extra props are passed to the component you are rendering <code>as</code>.
        </p>

        <p>
          Augmentation is powerful. You can compose component features and props without adding
          extra nested components. This is essential for working with <code>MenuLinks</code> and{' '}
          <code>react-router</code>.
        </p>

        <Comparison jsx={HeaderAugmentationJSX} html={HeaderAugmentationHTML} />
        <Comparison jsx={MenuItemLinkAugmentationJSX} html={MenuItemLinkAugmentationHTML} />
      </Segment>

      {/* ----------------------------------------
       *  Shorthand Props
       * -------------------------------------- */}
      <Segment basic padded>
        <Header as='h2' dividing>
          Shorthand Props
        </Header>
        <p>
          Shorthand props generate markup for you, making many use cases a breeze. All object props
          are spread on the child components.
        </p>

        <Header as='h3'>Child Object Arrays</Header>
        <p>
          Components with repeating children accept arrays of plain objects.
          <a
            href='https://facebook.github.io/react/docs/context.html#parent-child-coupling'
            target='_blank'
            rel='noopener noreferrer'
          >
            &nbsp;Facebook is fond of this&nbsp;
          </a>
          over using context to handle parent-child coupling and so are we.
        </p>
        <Comparison jsx={AccordionJSX} html={AccordionHTML} />

        <Header as='h3'>{'icon={...}'}</Header>
        <p>
          The <code>icon</code> prop is standard for many components. It can accept an Icon{' '}
          <code>name</code>, an Icon props object, or an <code>{'<Icon />'}</code> instance.
        </p>
        <Comparison jsx={MessageIconJSX} html={MessageIconHTML} />

        <Header as='h3'>{'image={...}'}</Header>
        <p>
          The <code>image</code> prop is standard for many components. It can accept an image{' '}
          <code>src</code>, an Image props object, or an <code>{'<Image />'}</code> instance.
        </p>
        <Comparison jsx={LabelJSX} html={LabelHTML} />
      </Segment>

      {/* ----------------------------------------
       *  Sub Components
       * -------------------------------------- */}
      <Segment basic padded>
        <Header as='h2' dividing>
          Sub Components
        </Header>
        <p>
          Sub components give you complete access to the markup. This is essential for flexibility
          in customizing components.
        </p>
        <Comparison jsx={MessageSubcomponentsJSX} html={MessageSubcomponentsHTML} />
      </Segment>

      {/* ----------------------------------------
       *  Auto Controlled State
       * -------------------------------------- */}
      <Segment basic padded>
        <Header as='h2' dividing>
          Auto Controlled State
        </Header>

        <p>
          React has the concept of
          <a
            href='https://facebook.github.io/react/docs/forms.html'
            target='_blank'
            rel='noopener noreferrer'
          >
            &nbsp;controlled and uncontrolled&nbsp;
          </a>
          components.
        </p>

        <p>
          Our stateful components self manage their state out of the box, without wiring. Dropdowns
          open on click without wiring <code>onClick</code> to the <code>open</code> prop. The value
          is also stored internally, without wiring <code>onChange</code> to <code>value</code>.
        </p>
        <p>
          If you add a <code>value</code> prop or an <code>open</code> prop, the Dropdown delegates
          control for that one prop to your value. The other props remain auto controlled. Mix and
          match any number of controlled and uncontrolled props. Add and remove control at any time
          by adding or removing props. Everything just works.
        </p>
        <p>
          Take a look at our
          <a href={`${repoURL}/blob/master/src/lib/ModernAutoControlledComponent.js`}>
            &nbsp;
            <code>ModernAutoControlledComponent</code>
            &nbsp;
          </a>
          to see how this was done. See the docs try it out live.
        </p>
        <Divider hidden section />
        <Divider hidden section />
        <Divider hidden section />
      </Segment>
    </Container>
  </DocsLayout>
)

Introduction.propTypes = {
  pkg: PropTypes.shape({
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
}

export default withSiteData(Introduction)
