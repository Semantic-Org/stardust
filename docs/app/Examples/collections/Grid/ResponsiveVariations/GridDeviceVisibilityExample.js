import React from 'react'
import { Grid, Segment } from 'stardust'

const { Column, Row } = Grid

const GridDeviceVisibilityExample = () => (
  <Grid>
    <Row column={2} only='large screen'>
      <Column>
        <Segment>Large Screen</Segment>
      </Column>
      <Column>
        <Segment>Large Screen</Segment>
      </Column>
    </Row>
    <Row column={2} only='widescreen'>
      <Column>
        <Segment>Widescreen</Segment>
      </Column>
      <Column>
        <Segment>Widescreen</Segment>
      </Column>
    </Row>
    <Row column={2} only='mobile'>
      <Column>
        <Segment>Mobile</Segment>
      </Column>
      <Column>
        <Segment>Mobile</Segment>
      </Column>
    </Row>
    <Row column={3}>
      <Column only='computer'>
        <Segment>Computer</Segment>
      </Column>
      <Column only='tablet mobile'>
        <Segment>Tablet and Mobile</Segment>
      </Column>
      <Column>
        <Segment>All Sizes</Segment>
      </Column>
      <Column>
        <Segment>All Sizes</Segment>
      </Column>
    </Row>
    <Row column={4} only='computer'>
      <Column>
        <Segment>Computer</Segment>
      </Column>
      <Column>
        <Segment>Computer</Segment>
      </Column>
      <Column>
        <Segment>Computer</Segment>
      </Column>
      <Column>
        <Segment>Computer</Segment>
      </Column>
    </Row>
    <Row only='tablet'>
      <Column>
        <Segment>Tablet</Segment>
      </Column>
      <Column>
        <Segment>Tablet</Segment>
      </Column>
      <Column>
        <Segment>Tablet</Segment>
      </Column>
    </Row>
  </Grid>
)

export default GridDeviceVisibilityExample
