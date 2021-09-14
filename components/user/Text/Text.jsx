import React, {useState, useEffect} from 'react';
import { useNode } from "@craftjs/core";
import ContentEditable from 'react-contenteditable'
import { FormLabel, Slider } from '@material-ui/core';
import { Button, Segment, Header } from 'semantic-ui-react';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import styles from './Text.module.css'
import dynamic from 'next/dynamic';
import { width } from '@material-ui/system';
import { useSaveCallback, useLoadData, useSetData, useClearDataCallback } from '../../Editor/hooks';
import { options } from '../../Editor/options'
import { SketchPicker } from 'react-color';
const Editor = dynamic(
  () => import('../../Editor/editor').then(mod => mod.EditorContainer),
  { ssr: false }
);
const placeholderText = {
  "time": 1587670998983,
  "blocks": [
    {
      "type": "paragraph",
      "data": {
        "text": "Paragraph with some <b>bold</b>&nbsp;text. And <a href=\"https://google.com\">some</a> <i>italic</i>&nbsp;text."
      }
    }
    
  ],
  "version": "2.17.0"
}

const theme = createTheme({
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
    const [editor, setEditor] = useState(null);
    const [activeData, setActiveData] = useState(props.renderData);
    const [editable, setEditable] = useState(false);
    // const [activeData, setActiveData] = useState(JSON.parse(props.jsonEncodedData));


    // save handler
    const onSave = useSaveCallback(editor);
    
    async function saveAndUpdate(){
      const savedData = await onSave();
      setActiveData(savedData)
      console.log(activeData)
      setProp(props => {props.renderData = savedData; console.log("Rendered data : ", props.renderData)})
      setEditable(false);
      console.log(' User activity : Local Text Component updated successfully.')
    }
    // load data
    const { data, loading } = useLoadData(activeData);
    
    // set saved data
    useSetData(editor, activeData);
      
    // clear data callback
    const clearData = useClearDataCallback(editor);
      
    const disabled = editor === null || loading;

    useEffect(() => {!selected && setEditable(false)}, [selected]);

    const furnishBlock = (block, rootIndex) => {
      switch (block.type) {
        case "list":
          if(block.data.style == "ordered"){
              return (
                  <ol id={block.id}>
                    {block.data.items.map((listElement, index) => 
                      <li key={`${rootIndex}__${index}`} dangerouslySetInnerHTML={{__html : `${listElement}`}} />
                    )}
                  </ol>
                )
            } 
          else{
            return (
              <ul id={block.id}>
                {block.data.items.map((listElement, index) => 
                  <li key={`${rootIndex}__${index}`} dangerouslySetInnerHTML={{__html : `${listElement}`}} />
                )}
              </ul>
            )
          }
        
        case "paragraph":
          return (
            <p key={rootIndex} id={block.id} dangerouslySetInnerHTML={{__html : `${block.data.text.replace('&nbsp;', ' ')}`}}/>
          )
      
        case "header":
          return (
            <Header as={`h${block.data.level}`} key={rootIndex} id={block.id} content={block.data.text}/>
          )
      
        default:
          break;
      }
    } 

    if(editable){
      return (
        <div ref={ ref => connect(drag(ref))} style={{fontSize : props.fontSize, color : props.color}}>
        <Editor editorRef={setEditor} options={options} data={activeData}  />
        <Button disabled={disabled} type="button" onClick={saveAndUpdate}>Save</Button>
        </div>
      )
    }
    else{
      return (
        <div style={{fontSize : props.fontSize, color : props.color}} ref={ ref => connect(drag(ref))} onClick={() => {setEditable(true)}} >
        {activeData.blocks.map((block, index) => 
          furnishBlock(block, index)
        )
        }
      </div>
      )
    }
}
export const XTextReadOnly = (props) => {
    const { connectors: {connect, drag}, isActive, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
        isActive: state.events.selected
      }));
    const [activeData, setActiveData] = useState(props.renderData);

    const furnishBlock = (block, rootIndex) => {
      switch (block.type) {
        case "list":
          if(block.data.style == "ordered"){
              return (
                  <ol id={block.id}>
                    {block.data.items.map((listElement, index) => 
                      <li key={`${rootIndex}__${index}`} dangerouslySetInnerHTML={{__html : `${listElement}`}} />
                    )}
                  </ol>
                )
            } 
          else{
            return (
              <ul id={block.id}>
                {block.data.items.map((listElement, index) => 
                  <li key={`${rootIndex}__${index}`} dangerouslySetInnerHTML={{__html : `${listElement}`}} />
                )}
              </ul>
            )
          }
        
        case "paragraph":
          return (
            <p key={rootIndex} id={block.id} dangerouslySetInnerHTML={{__html : `${block.data.text}`}}/>
          )
      
        case "header":
          return (
            <Header as={`h${block.data.level}`} key={rootIndex} id={block.id} content={block.data.text}/>
          )
      
        default:
          break;
      }
    } 

      return (
        <div style={{fontSize : props.fontSize, color : props.color}} ref={ ref => connect(drag(ref))} >
          {activeData.blocks.map((block, index) => 
            furnishBlock(block, index)
          )
          }
        </div>
      )
}

const TextSettings = () => {
  const { actions: {setProp}, fontSize, textAlign, renderData, color } = useNode((node) => ({
    fontSize: node.data.props.fontSize,
    textAlign: node.data.props.textAlign,
    renderData: node.data.props.renderData,
    color: node.data.props.color,
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
      <br></br>
      <SketchPicker
              color={color}
              onChangeComplete={(color) => {setProp(props => props.color = color.hex)}}
      />
    </Segment>
    
    </div>
  )
}

XText.craft = {
  props: {
    fontSize: 18,
    textAlign: 'left',
    renderData: placeholderText,
    color: '#000'
  },
  related: {
    settings: TextSettings
  }  
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}