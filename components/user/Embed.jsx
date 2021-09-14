import React, { useState, useEffect } from 'react';
import { Checkbox, Header, Input, Segment, Embed } from 'semantic-ui-react'
import { Canvas, useNode } from "@craftjs/core";
import { FormLabel, Slider } from '@material-ui/core';
import ContentEditable from 'react-contenteditable'


export const XEmbed = (props) => {
    const { connectors: {connect, drag}, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged
      }));
    
    const [editable, setEditable] = useState(false);

    useEffect(() => {!selected && setEditable(false)}, [selected]);
  
    return (
        <div 
        ref={ ref => connect(drag(ref))}
        onClick={e => setEditable(true)}
        className = 'header-wrapper'  
        >
            <Embed {...props}/>
        </div>
    )
}
export const XEmbedReadOnly = (props) => {
    const { connectors: {connect, drag}, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged
      }));
    

  
    return (
        <div 
        ref={ ref => connect(drag(ref))}
        className = 'header-wrapper'  
        >
            <Embed {...props} placeholder='/yt-thumb.jpg'/>
        </div>
    )
}

const EmbedSettings = () => {
  const { actions: {setProp}, url,  } = useNode((node) => ({
    url : node.data.props.url,
  }));
  return (
    <Segment ref={ ref => connect(drag(ref))} className="embed-additional-settings">
        <FormLabel component="legend">Embed URL : </FormLabel>
        <Input value={url} onChange={(val) => setProp(props => props.url = val.target.value) }></Input>
        <br></br>
    </Segment>
  )
}

XEmbed.craft = {
  props: {
      
  },
  related: {
    settings: EmbedSettings
  }  
}