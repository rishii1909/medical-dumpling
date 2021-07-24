import React, {useState, useEffect} from 'react';
import { Segment, Dropdown } from 'semantic-ui-react'
import { Canvas, useNode } from "@craftjs/core";
import { FormLabel, Slider } from '@material-ui/core';

const segmentOptions = [
    {key : 'basic', value : 'basic', text : 'basic'},
    {key : 'circular', value : 'circular', text : 'circular'},
    // {key : 'clearing', value : 'clearing', text : 'clearing'},
    // {key : 'color', value : 'color', text : 'color'},
    {key : 'disabled', value : 'disabled', text : 'disabled'},
    {key : 'padded', value : 'padded', text : 'padded'},
    {key : 'piled', value : 'piled', text : 'piled'},
    {key : 'raised', value : 'raised', text : 'raised'},
    {key : 'secondary', value : 'secondary', text : 'secondary'},
    // {key : 'size', value : 'size', text : 'size'},
    {key : 'stacked', value : 'stacked', text : 'stacked'},
    {key : 'tertiary', value : 'tertiary', text : 'tertiary'},
    // {key : 'textAlign', value : 'textAlign', text : 'textAlign'},
    {key : 'vertical', value : 'vertical', text : 'vertical'}
]

const sizes = [
    {key : 1, label : 'mini',}, 
    {key : 2, label : 'tiny',}, 
    {key : 3, label : 'small',}, 
    {key : 4, label : 'large',}, 
    {key : 5, label : 'big',}, 
    {key : 6, label : 'huge',}, 
    {key : 7, label : 'massive'},
]


let currentConfig = []

export const XSegment = (props) => {
    const { connectors: {connect, drag}, isActive, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
        isActive: state.events.selected
    }));

    return(
        <div 
        ref={ ref => connect(drag(ref))} 
        className='segment-wrapper'
        >
            <Segment {... props}>
                <Canvas className='segment-canvas' id='Element_segment'>
                    {props.children}
                </Canvas>
            </Segment>
        </div>
    )
}

const SegmentSettings = () => {
    const { actions: {setProp}, basic, circular, clearing, color, disabled, padded, piled, raised, secondary, size, stacked, tertiary, textAlign, vertical } = useNode((node) => ({
        basic : node.data.props.basic,
        circular : node.data.props.circular,
        clearing : node.data.props.clearing,
        color : node.data.props.color,
        disabled : node.data.props.disabled,
        padded : node.data.props.padded,
        piled : node.data.props.piled,
        raised : node.data.props.raised,
        secondary : node.data.props.secondary,
        // size : node.data.props.size,
        stacked : node.data.props.stacked,
        tertiary : node.data.props.tertiary,
        textAlign : node.data.props.textAlign,
        vertical : node.data.props.vertical,
    }));
    
    return (
        <div>
        <Segment padded='' className="text-additional-settings">
        <FormLabel component="legend">Align Content : {capitalizeFirstLetter(textAlign)} </FormLabel>
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
        </Segment>
        <br></br>
        <Segment className="text-additional-settings">
        <Dropdown
            clearable
            fluid
            multiple
            search
            selection
            options={segmentOptions}
            placeholder='Segment options'
            onChange={(_,values) => {
                let newStuff = values.value.filter(x => !currentConfig.includes(x));
                let trash = currentConfig.filter(x => !values.value.includes(x));
                newStuff.forEach(el => {setProp(props => props[el] = true)});
                trash.forEach(el => {setProp(props => props[el] = false)});
                currentConfig = values.value
            }}
        />        
        </Segment>
        <br></br>
        <Segment className="text-additional-settings">
            <FormLabel component="legend">Segment size : {size} </FormLabel>
            <Slider
            defaultValue={3}
            // step={1}
            aria-labelledby="continuous-slider"
            color='primary'
            min={1}
            max={7}
            valueLabelDisplay="auto"
            onChange={(_, value) => {
                setProp(props => {
                    props.size = sizes.filter(obj => {return obj.key === value })[0].label; 
                });
            }}
            />
        </Segment>
    
      </div>
    )
  }

XSegment.craft = {
    props: {
        textAlign: 'left',
        size: 'small'
    },
    related: {
      settings: SegmentSettings
    }  
  }

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}