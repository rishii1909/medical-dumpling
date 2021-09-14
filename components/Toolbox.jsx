import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/Link';
import { Modal, Header, TextArea, Segment, Input, Button, Icon, Menu, MenuItem, Dropdown, DropdownItem, DropdownMenu, Progress, ModalHeader, ModalContent, ModalDescription, ModalActions, Grid, GridRow, GridColumn, Divider } from 'semantic-ui-react';
import { useEditor } from "@craftjs/core";
import lz, { compress } from "lzutf8";
import copy from 'copy-to-clipboard';
import dynamic from 'next/dynamic'
import { XButton } from './user/Button';
import { XSegment } from './user/Segment';
import { XText } from './user/Text/Text';
import { XDivider } from './user/Divider';
import { XHeader } from './user/Header';
import { XImage } from './user/Image/Image';
import { XGrid } from './user/Grid/Grid';
import { XBanner } from './user/Banner/Banner';
import { XTwoColumns } from './user/TwoColumns';
import { XThreeColumns } from './user/ThreeColumns';
import { XCard } from './user/Card/Card';
import { XEmbed } from './user/Embed';
import { XLink } from './user/Link'
import { XIcon } from './user/Icon';
import { XMenu, XMenuMenu, XMenuItem } from './user/Menu';
import { XContactForm } from './user/forms/contactForm';

import { lowerCase } from 'lodash';

import { API, graphqlOperation } from 'aws-amplify';
import { createPage, deletePage, updatePage } from '../src/graphql/mutations';
import { listPages, getPage } from '../src/graphql/queries';
import { AmplifySignOut } from '@aws-amplify/ui-react';

export const Toolbox = (props) => {
    const { actions, connectors, query } = useEditor();
    const [status, setStatus] = useState(false);
    const [pageCollection, setPageCollection] = useState([]);
    const [currentPage, setCurrentPage] = useState([]);
    const [updateStats, setUpdateStats] = useState(100);
    const [updateLabel, setUpdateLabel] = useState('Initialized');
    const [createPageModalOpen, setCreatePageModalOpen] = useState(false);
    const [deletePageModalOpen, setDeletePageModalOpen] = useState(false);
    const [newPageName, setNewPageName] = useState('');
    const [deleteCheck, setDeleteCheck] = useState('');
    const router = useRouter()
    const { slug } = router.query
    useEffect(() => {
        if(!router.isReady) return;
        fetchAllPages()
        // fetchCurrentPages()
      }, [router.isReady, slug])
    const craftJsNodes = {
        ROOT: {
          type: { resolvedName: "Text" },
          nodes: [],
          props: {},
          custom: {},
          hidden: false,
          parent: "",
          isCanvas: false,
          displayName: "Text",
          linkedNodes: {}
        }
      };
    async function fetchAllPages(){
          try {
            const fetchPagesData = await API.graphql(graphqlOperation(listPages));
            console.log('fetchPagegsData', fetchPagesData)
            const recievedPages = fetchPagesData.data.listPages.items
            setPageCollection(recievedPages)
            const currentPage = recievedPages.filter(e => new RegExp(slug, 'i').test(e.title))[0];
            console.log("currentPage : ", currentPage)
            const fetchPage = await API.graphql(graphqlOperation(getPage, { id : currentPage.id }))
            setCurrentPage(fetchPage.data.getPage);
            console.log("fetchPage : ", fetchPage)
            const json = lz.decompress(lz.decodeBase64(fetchPage.data.getPage.page_data));
            const parsedJson = JSON.parse(json)
            console.log(parsedJson)
            // delete parsedJson['N8_RmSrlA']
            // function removeA(arr) {
            //     var what, a = arguments, L = a.length, ax;
            //     while (L > 1 && arr.length) {
            //         what = a[--L];
            //         while ((ax= arr.indexOf(what)) !== -1) {
            //             arr.splice(ax, 1);
            //         }
            //     }
            //     return arr;
            // }
            for(var key in parsedJson){
                if (parsedJson.hasOwnProperty(key)) {
                    if( parsedJson[key].type.resolvedName && parsedJson[key].type.resolvedName.startsWith("X")){
                        parsedJson[key].type.resolvedName = parsedJson[key].type.resolvedName.replace("ReadOnly","");
                        console.log("Refactored XComponent : ", parsedJson[key].type.resolvedName);
                    }
                    // if( parsedJson[key].nodes.includes('N8_RmSrlA') ){
                    //     var index = parsedJson[key].nodes.indexOf('N8_RmSrlA');
                    //     if (index !== -1) {
                    //         parsedJson[key].nodes.splice(index, 1);
                    //     }
                    // }
                }
            }
            actions.deserialize(JSON.stringify(parsedJson));
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <Segment>
            <AmplifySignOut/>
            <Header dividing> Pages </Header>
            <Dropdown fluid='true' placeholder='Choose page' >
                <DropdownMenu>
                    {pageCollection.map((page) => (
                        <DropdownItem fluid key={page.id}> <Link passHref href={`/admin/${page.title}`}><a>{page.title}</a></Link></DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
            <Divider></Divider>
            <Modal
              onClose={() => setCreatePageModalOpen(false)}
              onOpen={() => setCreatePageModalOpen(true)}
              open={createPageModalOpen}
              trigger={
                <Button icon fluid labelPosition='left'>
                    <Icon name='plus'></Icon>
                    New Page
                </Button>
              }
            >
              <ModalHeader>Page Details</ModalHeader>
              <ModalContent>
                <ModalDescription>
                  <Header>Enter the new page&apos;s title</Header>
                            <Divider hidden></Divider>
                    <Grid>
                        <GridRow centered>
                            <GridColumn width='8'>
                            <Input fluid value={newPageName} onChange={(_,input) => { 
                              setNewPageName(input.value);
                             }}>
                            </Input>
                            </GridColumn>
                        </GridRow>
                    </Grid>
                </ModalDescription>
              </ModalContent>
              <ModalActions>
                <Button color='black' onClick={() => setCreatePageModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  content="Create Page"
                  labelPosition='right'
                  icon='checkmark'
                  onClick={async () => {
                    for( var el in pageCollection){
                        if(el.title == newPageName){
                            alert('page already exists with that title.')
                            return;
                        }
                    }
                    if(newPageName.replace(/ /g,'')){
                        const bubbleCreate = await API.graphql(graphqlOperation(createPage, { input : { title : newPageName } }))
                        if(bubbleCreate.data.createPage){
                            router.push(`/admin/${newPageName}`)
                            setCreatePageModalOpen(false)
                        }else{
                            alert("Faced an error, the page could not be created.")
                            console.log(bubbleDelete)
                        }
                    }
                  }}
                  positive
                />
              </ModalActions>
            </Modal>
            <Divider></Divider>
            <Modal
              onClose={() => setDeletePageModalOpen(false)}
              onOpen={() => setDeletePageModalOpen(true)}
              open={deletePageModalOpen}
              trigger={
                <Button icon fluid negative labelPosition='left'>
                    <Icon name='trash'></Icon>
                    Delete Page
                </Button>
              }
            >
              <ModalHeader>Page Details</ModalHeader>
              <ModalContent>
                <ModalDescription>
                  <Header>Type &quot;delete {lowerCase(currentPage.title)}&quot; to delete this page <b>permanently.</b></Header>
                            <Divider hidden></Divider>
                    <Grid>
                        <GridRow centered>
                            <GridColumn width='8'>
                            <Input fluid value={deleteCheck} onChange={(_,input) => { 
                              setDeleteCheck(input.value);
                             }}>
                            </Input>
                            </GridColumn>
                        </GridRow>
                    </Grid>
                </ModalDescription>
              </ModalContent>
              <ModalActions>
                <Button color='black' onClick={() => setDeletePageModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  content="Delete permanently"
                  labelPosition='right'
                  icon='trash'
                  onClick={async () => {
                    if(deleteCheck === `delete ${lowerCase(currentPage.title)}`){
                        const bubbleDelete = await API.graphql(graphqlOperation(deletePage, { input : { id : currentPage.id } }))
                        if(bubbleDelete.data.deletePage){
                            router.push(`/admin/home`)
                            setDeletePageModalOpen(false)

                        }else{
                            alert("Faced an error, the page could not be deleted.")
                            console.log(bubbleDelete)
                        }
                    }
                  }}
                  negative
                />
              </ModalActions>
            </Modal>
            <Header dividing> Save data</Header>
            <Progress small label={updateLabel} disabled={!status} active={updateStats == 100 ? false : true} percent={updateStats} color='black' />
            <Button
            onClick={async () => {
                setStatus(true)
                setUpdateStats(0);
                setUpdateLabel('Initialized update...');
                const json = query.serialize();
                setUpdateStats(20);
                setUpdateLabel('Compiling page data...');
                const parsedJson = JSON.parse(json);
                for(var key in parsedJson){
                    if (parsedJson.hasOwnProperty(key)) {
                        if( parsedJson[key].type.resolvedName && parsedJson[key].type.resolvedName.startsWith("X")){
                            parsedJson[key].type.resolvedName = parsedJson[key].type.resolvedName + "ReadOnly";
                            console.log("Refactored XComponent : ", parsedJson[key].type.resolvedName);
                        }
                    }
                }
                setUpdateStats(30);
                setUpdateLabel('Compressing and encoding page data...');
                // console.log(parsedJson)
                const compressedPageData = lz.encodeBase64(lz.compress(JSON.stringify(parsedJson)))
                setUpdateStats(50);
                setUpdateLabel('Pushing updates to database...');
                console.log(currentPage.id)
                const bubbleUpdate = await API.graphql(graphqlOperation(updatePage, {input : { id : currentPage.id, page_data : compressedPageData }}))
                setUpdateStats(100);
                setUpdateLabel('Successfully updated!');
                setStatus(true)

            }}
            fluid
            > Update Changes </Button>
            <br></br>
            <Header dividing> Components </Header>
            <Menu className='toolbox-menu' fluid vertical>
            <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XLink ></XLink>)}>
                    <Button fluid> Add Link </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XMenu ></XMenu>)}>
                    <Button fluid> Add Menu </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XMenuMenu ></XMenuMenu>)}>
                    <Button fluid> Add MenuMenu </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XMenuItem ></XMenuItem>)}>
                    <Button fluid> Add MenuItem </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XCard ></XCard>)}>
                    <Button fluid> Add Card </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XBanner imageKey='None' />)}>
                    <Button fluid> Add Banner </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XIcon name='twitter' />)}>
                    <Button fluid> Add Icon </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XTwoColumns ></XTwoColumns>)}>
                    <Button fluid> Add Two Columns </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XThreeColumns ></XThreeColumns>)}>
                    <Button fluid> Add Three Columns </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XGrid rows={1}> Add content here </XGrid>)}>
                    <Button fluid> Create Grid </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XImage />)}>
                    <Button fluid> Add Image </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XText />)}>
                    <Button fluid> Add Text </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XButton text="Button text" />)}>
                    <Button fluid> Add Button </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XSegment className='user-segment' id='segment_id'></XSegment>)}>
                    {/* <div ref={ref=> connectors.create(ref, <XSegment className='user-segment' />)}> */}
                        <Button fluid> Add Segment </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XDivider></XDivider>)}>
                        <Button fluid> Add Divider </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XHeader text='Enter header here'></XHeader>)}>
                        <Button fluid> Add Header </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XEmbed />)}>
                        <Button fluid> Add Embed </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XContactForm />)}>
                        <Button fluid> Contact form </Button>
                    </div>
                </MenuItem>
            </Menu>
        </Segment>
    )
}

