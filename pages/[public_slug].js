import React, { useState, useEffect } from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import Link from 'next/Link';

import { API, graphqlOperation } from 'aws-amplify';
import { listPages, getPage } from '../src/graphql/queries';
import * as queries from '../src/graphql/queries'
import { generateHtml } from '../components/util_js';
import { Resolvers } from '../components/Resolver';
import { useRouter } from 'next/router';

import lz, { compress } from "lzutf8";
import { Editor, Element, Frame } from '@craftjs/core';
import 'semantic-ui-css/semantic.min.css';

import { Container, Icon, } from 'semantic-ui-react';
import Footer from '../components/footer/footer';
import Fade from '../components/Fade';
import { Collapse } from 'react-collapse';
import { capitalize } from 'lodash';

import Head from 'next/dist/next-server/lib/head';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../src/aws-exports.js';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import XContactWidget from '../components/contactWidget/XContactWidget';
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
    const [menuPages, setMenuPages] = useState(null);
    const [loading, setLoading] = useState(false);
    const [transition, setTransition] = useState(400);
    const [pageJsonData, setPageJsonData] = useState(null);
    const [menuJsonData, setMenuJsonData] = useState(null);
    const [footerJsonData, setFooterJsonData] = useState(null);
    const [showCookies, setShowCookies] = useState(true);
    const [contactFormOpen, setContactFormOpen] = useState(true);
    const router = useRouter()
    const { public_slug } = router.query
    useEffect(() => {
        if(!router.isReady) return;
        fetchCurrentPage(public_slug)
    }, [router.isReady, public_slug]);

    useEffect(() => {
        if(!router.isReady) return;
        fetchPageData();
    },[router.isReady, public_slug])
    
    async function fetchPageData() {
        try {
            // console.log("Auth.currentUserInfo() : ", Auth.currentUserInfo())
            const fetchPagesData = await API.graphql({ query : queries.listPages, authMode : 'API_KEY' });
            console.log("Fetch pages : ", fetchPagesData)
            // const fetchPagesData = await API.graphql({ query : graphqlOperation(listPages), authMode : 'AMAZON_COGNITO_USER_POOLS' });
            var recievedPages = fetchPagesData.data.listPages.items
            // const menuPagesOrder = ['Home', 'About us', 'What we do', 'Case studies', 'Pre-analytics', 'Our team', 'Contact']
            // recievedPages = recievedPages.sort(function(a,b) {
            //     return menuPagesOrder.indexOf( a.title ) - menuPagesOrder.indexOf( b.title );
            //     //for the sake of recent versions of Google Chrome use:
            //     //return a.key.charCodeAt(0) > b.key.charCodeAt(0); or return a.key.charCodeAt(0) - b.key.charCodeAt(0);
            // });
            // setMenuPages(recievedPages)
            const currentPage = recievedPages.filter(e => new RegExp(public_slug, 'i').test(e.title))[0];
            const pageHeader = recievedPages.filter(e => new RegExp('component_header', 'i').test(e.title))[0];
            const pageFooter = recievedPages.filter(e => new RegExp('component_footer', 'i').test(e.title))[0];
            console.log('currentPage', currentPage)
            const fetchMenu = await API.graphql(graphqlOperation(queries.getPage, { id : pageHeader.id }));
            const fetchPage = await API.graphql(graphqlOperation(queries.getPage, { id : currentPage.id }))
            const fetchFooter = await API.graphql(graphqlOperation(queries.getPage, { id : pageFooter.id }));
            const decodedMenuJson = JSON.parse(lz.decompress(lz.decodeBase64(fetchMenu.data.getPage.page_data)));
            const decodedPagejson = JSON.parse(lz.decompress(lz.decodeBase64(fetchPage.data.getPage.page_data)));
            const decodedFooterJson = JSON.parse(lz.decompress(lz.decodeBase64(fetchFooter.data.getPage.page_data)));
            setMenuJsonData(decodedMenuJson);
            setPageJsonData(decodedPagejson);
            setFooterJsonData(decodedFooterJson);
            // const fetchMenu = await API.graphql(graphqlOperation(getPage, { id : '724f4176-80f3-4c45-8c36-028de7088107' }));
            // console.log('fetchMenu', fetchMenu)
        //   setJsxPageData(generateHtml(json));
        //     console.log('RENDER', renderToStaticMarkup(<div id='root-dom-container'>
        //     <Editor disabled resolver={Resolvers}>
        //         <Frame json={pageJsonData}></Frame>
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
        setPageJsonData(json)
        setTimeout(() => {
            setLoading(false)
        }, transition);
    }
    
    return (
        <div id='root-dom-container'>
            <Head>
                <title>{public_slug ? `${capitalize(public_slug)} |` : ''} GP Liaison</title>
                <link rel="icon" href="/favicon.png" />
            </Head>
            <div className='menubar_wrapper' style={{position : 'absolute', top : '0px',width : '100%', fontSize : '0.9em !important', paddingRight : '6px'}}>
                <Fade transitionDuration={transition} show={menuJsonData && !loading}>
                    <Editor enabled={false} resolver={Resolvers}>
                        <Frame json={menuJsonData}>
                            <Element is={Container} className='full-height flex-cont' canvas>
                            </Element>
                        </Frame>
                    </Editor>
                </Fade>
            </div>
            <div className='body_wrapper'>
                <Fade transitionDuration={transition} show={pageJsonData && !loading}>
                    <Editor enabled={false} resolver={Resolvers}>
                        <Frame json={pageJsonData}></Frame>
                    </Editor>
                </Fade>
            </div>
            <div className='footer_wrapper'>
                {/* <Button onClick={()=>setContactFormOpen(true)}>Press me</Button> */}
                <Fade transitionDuration={transition} show={footerJsonData && !loading}>
                    <Editor enabled={false} resolver={Resolvers}>
                        <Frame json={footerJsonData}>
                            <Element is={Container} className='full-height flex-cont' canvas>
                            </Element>
                        </Frame>
                    </Editor>
                    {showCookies && 
                        <div className='cookies'>
                            By using this website, you agree to our use of cookies. We use cookies to provide you with a great experience and to help our website run effectively.
                            <Icon onClick={()=>setShowCookies(false)} name='close' style={{float : 'right'}}></Icon>
                        </div>
                    }
                        <XContactWidget/>
                </Fade>
            </div>
        </div>
    )
}