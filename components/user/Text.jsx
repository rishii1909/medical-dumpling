import React, {useState, useEffect} from 'react';
import { useNode } from "@craftjs/core";
import ContentEditable from 'react-contenteditable'
import { FormLabel, Slider } from '@material-ui/core';
import { Segment } from 'semantic-ui-react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';


const theme = createMuiTheme({
  palette: {
      primary: {
          main: '#000000'
      }
    },
});
export const XText = (props) => {
    const { connectors: {connect, drag}, isActive, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
        isActive: state.events.selected
      }));
    
    const [editable, setEditable] = useState(false);

    useEffect(() => {!selected && setEditable(false)}, [selected]);

    return (
            <p
            ref={ ref => connect(drag(ref))}
            onClick={e => setEditable(true)}
            className='text-wrapper'
            style={{ fontSize : props.fontSize, textAlign : props.textAlign }}
            elementType='Text'
            >
            
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
            </p>
    )
}

const TextSettings = () => {
  const { actions: {setProp}, fontSize, textAlign } = useNode((node) => ({
    fontSize: node.data.props.fontSize,
    textAlign: node.data.props.textAlign
  }));

  return (
    <div>
      <Segment className="text-additional-settings">
      <FormLabel component="legend">Font size : {fontSize}px </FormLabel>
      <MuiThemeProvider theme={theme}>
      <Slider
      defaultValue={fontSize}
      // step={1}
      aria-labelledby="continuous-slider"
      color='primary'
      min={7}
      max={50}
      valueLabelDisplay="auto"
      onChange={(_, value) => {
        setProp(props => props.fontSize = value);
      }}
      />
      </MuiThemeProvider>
    </Segment>
    <br></br>
    <Segment className="text-additional-settings">
      <FormLabel component="legend">Text Align : {capitalizeFirstLetter(textAlign)} </FormLabel>
      <MuiThemeProvider theme={theme}>
      <Slider
      defaultValue={textAlign}
      // step={1}
      aria-labelledby="continuous-slider"
      color='primary'
      min={0}
      max={2}
      onChange={(_, value) => {
        switch (value) {
          case 0:
            setProp(props => props.textAlign = 'left');
            break;
            
          case 1:
            setProp(props => props.textAlign = 'center');
            break;

          case 2:
            setProp(props => props.textAlign = 'right');
            break;

          default:
            break;
        }

      }}
      />
      </MuiThemeProvider>
    </Segment>
    </div>
  )
}

XText.craft = {
  props: {
    text: "Enter text",
    fontSize: 16,
    textAlign: 'left'
  },
  related: {
    settings: TextSettings
  }  
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}