import ReactDOMServer from 'react-dom/server';
import { Editor, Frame } from '@craftjs/core';

import { XButton } from '../components/user/Button'
import { XContainer } from '../components/user/Container'
import { XBanner } from '../components/user/Banner/Banner';
import { XImage } from '../components/user/Image/Image';
import { XSegment } from '../components/user/Segment'
import { XDivider } from '../components/user/Divider'
import { XHeader } from '../components/user/Header';
import { XText } from '../components/user/Text/Text';
import { XTwoColumns } from '../components/user/TwoColumns';
import { XCard } from '../components/user/Card/Card';
import { XEmbed } from './user/Embed';
import { Segment, Container, Header, Icon, HeaderContent } from 'semantic-ui-react';
const resolverComponents = { 
    XCard, 
    XEmbed, 
    XTwoColumns, 
    XHeader, 
    XText, 
    XBanner, 
    XDivider, 
    XImage, 
    XButton, 
    XSegment, 
    XContainer, 
    Segment, 
    Container, 
    Header, 
    Icon, 
    HeaderContent
}
export default function renderMarkup(JSONStateString) {
    const returnElement = ReactDOMServer.renderToStaticMarkup(
    <Editor resolver={resolverComponents}>
    <div>h</div>
    </Editor>
    );
    console.log("RETURNED ELEMENT", returnElement)
  return returnElement
  ;
}