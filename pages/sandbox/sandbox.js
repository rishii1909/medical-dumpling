import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { SettingsPanel } from '../../components/Settings'
import { Toolbox } from '../../components/Toolbox'
import { Button, Container, Divider, Grid, GridColumn, Header, Segment, Icon, Label, HeaderContent } from 'semantic-ui-react'

import { Resolvers } from '../../components/Resolver';
import 'semantic-ui-css/semantic.min.css';

import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import lz, { compress } from "lzutf8";
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import {API, graphqlOperation} from '@aws-amplify/api';
import { getPage } from '../../src/graphql/queries';
function Home() {

  useEffect(() => {
    fetchPageData()
  }, []);

  const { actions, query } = useEditor();

  const router = useRouter()
  const { slug } = router.query
  const [page, setPage] = useState({});
  const [pageCollection, setPageCollection] = useState([]);
  const [menuJsonData, setMenuJsonData] = useState(null);
  async function fetchPageData() {
    try {
      // const fetchPagesData = await API.graphql(graphqlOperation(listPages));
      // const recievedPages = fetchPagesData.data.listPages.items
      // setPageCollection(recievedPages)
      // const currentPage = recievedPages.filter(e => new RegExp(slug, 'i').test(e.title))[0];
      const fetchMenu = await API.graphql(graphqlOperation(getPage, { id : '724f4176-80f3-4c45-8c36-028de7088107' }));
      console.log('fetchMenu', fetchMenu)
      setMenuJsonData(fetchMenu);
      setTimeout(() => {
        console.log(menuJsonData)
      }, 500);
      // setPage(fetchPage);
      // console.log(fetchPage)
      // const json = lz.decompress(lz.decodeBase64(fetchPage.data.getPage.page_data));
      // actions.deserialize(json);

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Segment basic className='screen-height'>
      <Editor resolver={Resolvers} >
        <Grid celled className='full-height admin-panel'>
          <GridColumn className='sideMenu' width='13'>
            <Frame>
              <Element is={Container} className='full-height flex-cont' canvas>
                <div className='full-height red'>
                {menuJsonData ? 
                <Element canvas>
                <Frame data={lz.decompress(lz.decodeBase64(menuJsonData.data.getPage.page_data))}>
                     <div>ajsdkn</div>
                </Frame>
                </Element>
                : <div>here {menuJsonData}</div>
                }
                <Header as='h2' icon>
                  <Icon name='add circle' />
                  <HeaderContent>Add content here</HeaderContent>
                </Header>
                <div>
                </div>
                </div>
              </Element>
            </Frame>
          </GridColumn>
          <GridColumn className='sideMenu' width='3'>
            <SettingsPanel></SettingsPanel>
            <Toolbox slug={'home'}></Toolbox>
          </GridColumn>
        </Grid>
      </Editor>
    </Segment>
  )
}

export default withAuthenticator(Home);
