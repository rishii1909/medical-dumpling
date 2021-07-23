import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { SettingsPanel } from '../components/Settings'
import { Toolbox } from '../components/Toolbox'
import { Button, Container, Grid, GridColumn, Header, Segment } from 'semantic-ui-react'
import { XButton } from '../components/user/Button'
import { XContainer } from '../components/user/Container'
import 'semantic-ui-css/semantic.min.css';
import { XSegment } from '../components/user/Segment'
import {Editor, Frame, Element} from "@craftjs/core";



export default function Home() {
  return (
    <Segment>
      <Header textAlign='center' dividing>Page builder prototype</Header>
      <Editor resolver={{XButton, XSegment, XContainer, Button, Segment, Container}}>
        <Grid celled>
          <GridColumn width='13'>
            <Frame>
              <Element is={XSegment} raised color='red' canvas>
                  <XButton text='Button 1' />
                  <XSegment compact>Here is some text</XSegment>
                <Element is={XSegment} very padded raised color='black' canvas>
                  <XButton text='Button 2' />
                </Element>
              </Element>
            </Frame>
          </GridColumn>
          <GridColumn width='3'>
            <Toolbox></Toolbox>
            <SettingsPanel></SettingsPanel>
          </GridColumn>
        </Grid>
      </Editor>
    </Segment>
  )
}
