import React, { useState, useEffect } from 'react';
import { Checkbox, Header, Segment } from 'semantic-ui-react'
import { Canvas, useNode } from "@craftjs/core";
import { FormLabel, Slider } from '@material-ui/core';
import ContentEditable from 'react-contenteditable'

const sizes = [
  {key : 1, label : 'h1',}, 
  {key : 2, label : 'h2',}, 
  {key : 3, label : 'h3',}, 
  {key : 4, label : 'h4',}, 
  {key : 5, label : 'h5',}, 
  {key : 6, label : 'h6',}, 
  {key : 7, label : 'h7'},
]

export const XHeader = (props) => {
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
            <Header {... props}>
                {/* {props.children} */}
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
            </Header>
        </div>
    )
}

export const XHeaderReadOnly = (props) => {
    const { connectors: {connect, drag}, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged
      }));
    

  
    return (
        <div 
        ref={ ref => connect(drag(ref))}
        className = 'header-wrapper'  
        >
            <Header {... props}>
            {props.text.replace('&amp;', '&').replace('&nbsp;', ' ')} 
            </Header>
        </div>
    )
}

const HeaderSettings = () => {
  const { actions: {setProp}, as, dividing } = useNode((node) => ({
    as : node.data.props.as,
    dividing : node.data.props.dividing,
  }));
  return (
    <Segment className="text-additional-settings">
        <FormLabel component="legend">Header size : {as} </FormLabel>
        <Slider
        defaultValue={3}
        // step={1}
        aria-labelledby="continuous-slider"
        color='primary'
        min={1}
        max={6}
        valueLabelDisplay="auto"
        onChange={(_, value) => {
            setProp(props => {
                props.as = sizes.filter(obj => {return obj.key === value })[0].label; 
            });
        }}
        />
        <br></br>
        <Checkbox label='Dividing' onChange={(_,value) => {setProp(props => props.dividing = value.checked);}}></Checkbox>
    </Segment>
  )
}

XHeader.craft = {
  props: {
      as: 'h3',
      text: 'Header Text',
  },
  related: {
    settings: HeaderSettings
  }  
}