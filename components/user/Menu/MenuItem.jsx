import React, {useState, useEffect} from 'react';
import { Segment, Menu, MenuItem, Dropdown } from 'semantic-ui-react'
import { Canvas, useNode } from "@craftjs/core";
import { FormLabel, Slider } from '@material-ui/core';
import { capitalize } from 'lodash';
import ContentEditable from 'react-contenteditable';

const menuOptions = [
    {key : 'basic', value : 'basic', text : 'basic'},
    {key : 'circular', value : 'circular', text : 'circular'},
    {key : 'disabled', value : 'disabled', text : 'disabled'},
    {key : 'padded', value : 'padded', text : 'padded'},
    {key : 'piled', value : 'piled', text : 'piled'},
    {key : 'raised', value : 'raised', text : 'raised'},
    {key : 'secondary', value : 'secondary', text : 'secondary'},
    {key : 'stacked', value : 'stacked', text : 'stacked'},
    {key : 'tertiary', value : 'tertiary', text : 'tertiary'},
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

export const XMenuItem = (props) => {
    const { connectors: {connect, drag}, isActive, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
        isActive: state.events.selected
    }));
    return(
        <div 
        ref={ ref => connect(drag(ref))} 
        className='wrapper_menu'
        style={{display : 'inline-flex'}}
        >
            <MenuItem
              {... props}
              style={{padding : '0px'}}
              className='menubar'
            >
                <Canvas className='canvas' style={{padding : '.92857143em 1.14285714em'}} id='Element_menu_item'>
                    {props.children}
                </Canvas>
            </MenuItem>
        </div>
    )
}
export const XMenuItemReadOnly = (props) => {
    const { connectors: {connect, drag}, isActive, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
        isActive: state.events.selected
    }));
    return(
        <div 
        ref={ ref => connect(drag(ref))} 
        className='wrapper_menu_item'
        >
            <MenuItem 
              {... props}
            >
                <Canvas className='canvas' id='Element_menu_item'>
                    {props.children}
                </Canvas>
            </MenuItem>
        </div>
    )
}

const MenuItemSettings = () => {
    const { actions: {setProp}, basic, circular, clearing, color, disabled, padded, piled, raised, secondary, size, stacked, tertiary, textAlign, vertical, vertical_padding, horizontal_padding, maxWidth } = useNode((node) => ({
        basic : node.data.props.basic,
        circular : node.data.props.circular,
        clearing : node.data.props.clearing,
        color : node.data.props.color,
        disabled : node.data.props.disabled,
        padded : node.data.props.padded,
        piled : node.data.props.piled,
        raised : node.data.props.raised,
        secondary : node.data.props.secondary,
        stacked : node.data.props.stacked,
        tertiary : node.data.props.tertiary,
        textAlign : node.data.props.textAlign,
        vertical : node.data.props.vertical,
        vertical_padding : node.data.props.vertical_padding,
        horizontal_padding : node.data.props.horizontal_padding,
        maxWidth : node.data.props.maxWidth,
    }));
    
    return (
        <div>
        <Segment className="text-additional-settings">
        <FormLabel component="legend">Align Content : {capitalize(textAlign)} </FormLabel>
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
            options={menuOptions}
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
        <br></br>
        <Segment className="text-additional-settings">
            <FormLabel component="legend">Vertical padding : 
            {vertical_padding ? vertical_padding + 'px' : 'auto'} 
            {/* <ContentEditable
            html={vertical_padding} 
            onChange={e => 
              setProp(props => 
                props.vertical_padding = e.target.value  
              )
            } 
            tagName="p"
            /> */}
            </FormLabel>
            <Slider
            defaultValue={1}
            aria-labelledby="continuous-slider"
            color='primary'
            min={1}
            max={100}
            valueLabelDisplay="auto"
            onChange={(_, value) => {
                setProp(props => {
                    props.vertical_padding = value; 
                });
            }}
            />
        </Segment>
        <br></br>
        <Segment className="text-additional-settings">
            <FormLabel component="legend">Horizontal padding : 
            {horizontal_padding ? horizontal_padding + 'px' : 'auto'} 
            {/* <ContentEditable
            html={vertical_padding} 
            onChange={e => 
              setProp(props => 
                props.vertical_padding = e.target.value  
              )
            } 
            tagName="p"
            /> */}
            </FormLabel>
            <Slider
            defaultValue={1}
            aria-labelledby="continuous-slider"
            color='primary'
            min={1}
            max={100}
            valueLabelDisplay="auto"
            onChange={(_, value) => {
                setProp(props => {
                    props.horizontal_padding = value; 
                });
            }}
            />
        </Segment>
        <br></br>
        <Segment className="text-additional-settings">
            <FormLabel component="legend">Max Width : 
            {maxWidth !== "auto" ? maxWidth + 'px' : maxWidth} 
            {/* <ContentEditable
            html={vertical_padding} 
            onChange={e => 
              setProp(props => 
                props.vertical_padding = e.target.value  
              )
            } 
            tagName="p"
            /> */}
            </FormLabel>
            <Slider
            defaultValue={1}
            aria-labelledby="continuous-slider"
            color='primary'
            step={10}
            min={300}
            max={1800}
            valueLabelDisplay="auto"
            onChange={(_, value) => {
              setProp(props => {
                props.maxWidth = value > 0 ? value : "auto"; 
              });
            }}
            />
        </Segment>
    
      </div>
    )
  }

XMenuItem.craft = {
    props: {
        textAlign: 'left',
        size: 'small',
        maxWidth: "auto",
    },
    related: {
      settings: MenuItemSettings
    }  
  }
