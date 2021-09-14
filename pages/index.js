import React, { useState, useEffect } from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import Link from 'next/Link';

import { API, graphqlOperation } from 'aws-amplify';
// import { listPages, getPage } from '../src/graphql/queries';
import * as queries from '../src/graphql/queries'
import { generateHtml } from '../components/util_js';
import { Resolvers } from '../components/Resolver';
import { useRouter } from 'next/router';

import lz, { compress } from "lzutf8";
import { Editor, useEditor, Element, Frame } from '@craftjs/core';
import 'semantic-ui-css/semantic.min.css';

import { Container, Menu, MenuMenu, MenuItem, Button } from 'semantic-ui-react';
import Fade from '../components/Fade';

import Head from 'next/dist/next-server/lib/head';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../src/aws-exports.js';
import { AmplifySignOut } from '@aws-amplify/ui-react';

Amplify.configure(awsconfig);

// const client = new AWSAppSyncClient({
//     url: awsconfig.aws_appsync_graphqlEndpoint,
//     region: awsconfig.aws_appsync_region,
//     auth: {
//       type: AUTH_TYPE.API_KEY,
//       apiKey: awsconfig.aws_appsync_apiKey,
//     },
// });

export default function PublicPage(props){
    const [jsonPageData, setJsonPageData] = useState(null);
    const [jsxPageData, setJsxPageData] = useState(null);
    const [menuPages, setMenuPages] = useState(null);
    const [loading, setLoading] = useState(false);
    const [transition, setTransition] = useState(400);

    const router = useRouter()
    const { public_slug } = router.query
    if(public_slug == "") public_slug = "home";
    useEffect(() => {
        if(!router.isReady) return;
        fetchCurrentPage(public_slug)
    }, [router.isReady, public_slug]);

    useEffect(() => {
        fetchPageData()
    },[])
    
    async function fetchPageData() {
        try {
            console.log("Auth.currentUserInfo() : ", Auth.currentUserInfo())
            const fetchPagesData = await API.graphql({ query : queries.listPages, authMode : 'API_KEY' });
            console.log("Fetch pages : ", fetchPagesData)
            // const fetchPagesData = await API.graphql({ query : graphqlOperation(listPages), authMode : 'AMAZON_COGNITO_USER_POOLS' });
            var recievedPages = fetchPagesData.data.listPages.items
            const menuPagesOrder = ['Home', 'About us', 'What we do', 'Case studies', 'Pre-analytics', 'Our team', 'Contact']
            recievedPages = recievedPages.sort(function(a,b) {
                return menuPagesOrder.indexOf( a.title ) - menuPagesOrder.indexOf( b.title );
                //for the sake of recent versions of Google Chrome use:
                //return a.key.charCodeAt(0) > b.key.charCodeAt(0); or return a.key.charCodeAt(0) - b.key.charCodeAt(0);
            });
            console.log(recievedPages)
            setMenuPages(recievedPages)
            const currentPage = recievedPages.filter(e => new RegExp(public_slug, 'i').test(e.title))[0];
            const fetchPage = await API.graphql(graphqlOperation(queries.getPage, { id : currentPage.id }))
            const json = lz.decompress(lz.decodeBase64(fetchPage.data.getPage.page_data));
            setJsonPageData(json)
        //   setJsxPageData(generateHtml(json));
        //     console.log('RENDER', renderToStaticMarkup(<div id='root-dom-container'>
        //     <Editor disabled resolver={Resolvers}>
        //         <Frame json={jsonPageData}></Frame>
        //     </Editor>
        // </div>))

        } catch (error) {
          console.log(error)
        }
    }
    async function fetchCurrentPage(slug){
        setLoading(true)
        const recievedPages = menuPages ? menuPages : (await API.graphql(graphqlOperation(queries.listPages))).data.listPages.items;
        const currentPage = recievedPages.filter(e => new RegExp(slug, 'i').test(e.title))[0];
        const fetchPage = await API.graphql(graphqlOperation(queries.getPage, { id : currentPage.id }))
        const json = lz.decompress(lz.decodeBase64(fetchPage.data.getPage.page_data));
        console.log(JSON.parse(json))
        setJsonPageData(json)
        setTimeout(() => {
            setLoading(false)
        }, transition);
    }
    function fetchData () {
        return jsonPageData ? jsonPageData : []
        console.log('here')
    }
    return (
        <div id='root-dom-container'>
            <Head>
                <title>GP Liaison</title>
                <link rel="icon" href="/favicon.png" />
            </Head>
                <Menu fixed='top' inverted borderless style={{backgroundColor : 'transparent', padding : "1em 0.4em", fontWeight : '700'}}>
                    <MenuItem>
                        <img src='/gp-liaison-logo.png' style={{height : "48px", width : "118px"}} alt='logo'></img>
                    </MenuItem>
                    <MenuMenu position='right'>
                    {menuPages ? menuPages.map((page,index) => (
                        <MenuItem key={page.id}>
                            <Link passHref href={`/${page.title}`}><a className='menu_button'>{page.title.toUpperCase()}</a></Link>
                        </MenuItem>
                    )) : 
                        <MenuItem>
                            Loading
                        </MenuItem>
                    }
                    <MenuItem>
                        <Button className='menu_button' basic inverted><a href='https://dashboard.gp-liaison.com/' style={{fontWeight : 800, color : 'white'}}>DASHBOARD</a></Button>
                    </MenuItem>
                    </MenuMenu>
                </Menu>
            {/* { */}
                {/* jsonPageData && !loading ? */}
                <Fade transitionDuration={transition} show={jsonPageData && !loading}>
                    <Editor enabled={false} resolver={Resolvers}>
                    <Frame data={jsonPageData}>
                    <Element is={Container} className='full-height flex-cont' canvas>
                    </Element>
                    </Frame>
                    </Editor>
                </Fade>
{/*                 
                : <div>Loading</div> */}
                {/* } */}
        </div>
    )
}