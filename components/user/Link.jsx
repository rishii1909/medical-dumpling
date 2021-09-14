import React, {useState, useEffect} from 'react';
import Link from 'next/Link';
import { useNode } from "@craftjs/core";
import ContentEditable from 'react-contenteditable'
import { Input, Segment, Checkbox } from 'semantic-ui-react';
import { FormLabel, Slider } from '@material-ui/core';
import { MuiThemeProvider, createTheme } from '@material-ui/core';


const theme = createTheme({
  palette: {
      primary: {
          main: '#000000'
      }
    },
});

export const XLink = (props) => {
    const { connectors: {connect, drag}, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged
      }));
    
    const [editable, setEditable] = useState(false);

    useEffect(() => {!selected && setEditable(false)}, [selected]);

    return(
        <div 
        ref={ ref => connect(drag(ref))}
        onClick={e => setEditable(true)}
        className='wrapper_Link'
        style={{ display : 'inline-flex' }}
        >
            <Link passHref {... props} style={{fontWeight : props.font_weight}} className='link'> 
            
            <ContentEditable
            disabled={!editable}
            html={props.text}
            onChange={e => 
              setProp(props => 
                props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")  
              )
            } 
            tagName="p"
            />

            </Link>
        </div>
    )
} 

export const XLinkReadOnly = (props) => {
    const { connectors: {connect, drag}, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
        font_weight: state.events.font_weight
      }));
    
    return(
        <div 
        ref={ ref => connect(drag(ref))}
        className='wrapper_Link'
        style={{ display : 'inline-flex' }}
        id={props.id}
        >
            <Link passHref style={{color : 'white !important'}} {... props} > 
            <a style={{color : 'white !important'}}>
            {props.text}
            </a>

            </Link>
        </div>
    )
} 

const LinkSettings = () => {
  const { actions: {setProp}, href, font_weight } = useNode((node) => ({
    href : node.data.props.href,
    font_weight: node.data.props.font_weight
  }));
  return (
    <Segment className="text-additional-settings">
        <Segment>
        <FormLabel component="legend">Href </FormLabel>
        <Input fluid value={href} onChange={(_,input) => { 
          setProp(props => {
            props.href = input.value; 
          });
         }}>
        </Input>
        </Segment>
        <br></br>
      <Segment className="text-additional-settings">
      <FormLabel component="legend">Font weight : {font_weight}px </FormLabel>
      <MuiThemeProvider theme={theme}>
      <Slider
      defaultValue={font_weight}
      step={100}
      aria-labelledby="continuous-slider"
      color='primary'
      min={100}
      max={900}
      valueLabelDisplay="auto"
      onChange={(_, value) => {
        setProp(props => props.font_weight = value);
      }}
      />
      </MuiThemeProvider>
    </Segment>
    </Segment>
    
  )
}

XLink.craft = {
  props: {
      href: '#',
      font_weight: 600
  },
  related: {
    settings: LinkSettings
  }  
}