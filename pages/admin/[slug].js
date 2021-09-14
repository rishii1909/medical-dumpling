import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { SettingsPanel } from '../../components/Settings'
import { Toolbox } from '../../components/Toolbox'
import { Button, Container, Divider, Grid, GridColumn, Header, Segment, Icon, Label, HeaderContent, GridRow } from 'semantic-ui-react'

import { Resolvers } from '../../components/Resolver';
import 'semantic-ui-css/semantic.min.css';

import {Editor, Frame, Element, useEditor} from "@craftjs/core";
import Fade from '../../components/Fade';

import lz, { compress } from "lzutf8";

import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { API, graphqlOperation } from 'aws-amplify';
import * as queries from "../../src/graphql/queries"



function Home() {

  useEffect(() => {
    fetchPageData()
  }, []);

  const { actions, query } = useEditor();

  const router = useRouter()
  const { slug } = router.query
  const [page, setPage] = useState({});
  const [pageCollection, setPageCollection] = useState([]);
  const [transition, setTransition] = useState(400);
  const [menuJsonData, setMenuJsonData] = useState(null);
  const [menuEditorActive, setmenuEditorActive] = useState(true);
  async function fetchPageData() {
    try {
      // const fetchPagesData = await API.graphql(graphqlOperation(listPages));
      // const recievedPages = fetchPagesData.data.listPages.items
      // setPageCollection(recievedPages)
      // const currentPage = recievedPages.filter(e => new RegExp(slug, 'i').test(e.title))[0];
      // const fetchPage = await API.graphql(graphqlOperation(getPage, { id : currentPage.id }))
      // setPage(fetchPage);
      // console.log(fetchPage)
      // const json = lz.decompress(lz.decodeBase64(fetchPage.data.getPage.page_data));
      // actions.deserialize(json);
      // Fetching the menubar.
      const fetchMenu = await API.graphql(graphqlOperation(queries.getPage, { id : '724f4176-80f3-4c45-8c36-028de7088107' }));
      const decodedMenuJson = JSON.parse(lz.decompress(lz.decodeBase64(fetchMenu.data.getPage.page_data)));
      console.log('decodedMenuJson', decodedMenuJson)
      for(var key in decodedMenuJson){
        if (decodedMenuJson.hasOwnProperty(key)) {
          if( decodedMenuJson[key].type.resolvedName && decodedMenuJson[key].type.resolvedName.startsWith("X")){
              decodedMenuJson[key].type.resolvedName = decodedMenuJson[key].type.resolvedName.replace("ReadOnly","");
              console.log("Refactored XComponent : ", decodedMenuJson[key].type.resolvedName);
          }
          // if( decodedMenuJson[key].nodes.includes('N8_RmSrlA') ){
          //     var index = decodedMenuJson[key].nodes.indexOf('N8_RmSrlA');
          //     if (index !== -1) {
          //         decodedMenuJson[key].nodes.splice(index, 1);
          //     }
          // }
        }
      }
      setMenuJsonData(decodedMenuJson);
      //
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Segment basic className='screen-height' onClick={(e) => { setmenuEditorActive(false) }}>
        <Grid celled className='full-height admin-panel'>
        <GridRow onClick={(e) => { setmenuEditorActive(true);  e.stopPropagation(); }}>
            <Editor enabled={true} resolver={Resolvers}>
          <GridColumn width='13'>
                <Frame data={menuJsonData}>
                  <Element is={Container} className='full-height flex-cont' canvas>
                  {menuEditorActive &&
                  <div className='addContentPlaceholder' style={{width : '100%', height : '100%'}}>Add content here</div>
                  }
                  </Element>
                </Frame>
          </GridColumn>
          <GridColumn width='3'>
          {/* <div onClick={(e) => { setmenuEditorActive(true);  e.stopPropagation(); }}> */}
            {/* <Fade transitionDuration={transition} show={menuJsonData}> */}
              
              {menuEditorActive && 
                <GridColumn width='3' className='sideMenu'>
                <SettingsPanel/>
                <Toolbox slug='component_header'></Toolbox>
              </GridColumn>
              }
            {/* </Fade> */}
            {/* </div> */}
          </GridColumn>
              </Editor>
        </GridRow>
          <GridRow>
          {/* <Editor resolver={Resolvers} >
          <GridColumn className='sideMenu' width={menuEditorActive ? '16' : '13'}>
            <Frame>
              <Element is={Container} className='full-height flex-cont' canvas>
                <div className='full-height red'>
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
          {!menuEditorActive &&
            <GridColumn className='sideMenu' width='3'>
            <SettingsPanel></SettingsPanel>
            <Toolbox slug={slug}></Toolbox>
            </GridColumn>
          }
          </Editor> */}
          </GridRow>
        </Grid>
    </Segment>
  )
}

export default withAuthenticator(Home);
