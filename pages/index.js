import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { SettingsPanel } from '../components/Settings'
import { Toolbox } from '../components/Toolbox'
import { Button, Container, Divider, Grid, GridColumn, Header, Segment, Icon, HeaderSubheader, HeaderContent } from 'semantic-ui-react'
import { XButton } from '../components/user/Button'
import { XContainer } from '../components/user/Container'
import 'semantic-ui-css/semantic.min.css';
import { XSegment } from '../components/user/Segment'
import { XDivider } from '../components/user/Divider'
import {Editor, Frame, Element, Canvas} from "@craftjs/core";



export default function Home() {
  return (
    <Segment basic className='screen-height'>
      <Editor resolver={{XButton, XSegment, XContainer, Button, Segment, Container}} >
        <Grid celled className='full-height'>
          <GridColumn width='13'>
            <Frame>
              <Element is={Container} className='full-height flex-cont' raised color='black' canvas>
              <div className='full-height red'>
              <Header as='h2' icon>
                <Icon name='add circle' />
                <HeaderContent>Add content here</HeaderContent>
              </Header>
              </div>
              </Element>
            </Frame>
          </GridColumn>
          <GridColumn width='3'>
            <SettingsPanel></SettingsPanel>
            <Toolbox></Toolbox>
          </GridColumn>
        </Grid>
      </Editor>
    </Segment>
  )
}
