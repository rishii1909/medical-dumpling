import React, {useState, useEffect} from 'react';
import { Segment, Menu, Dropdown, Checkbox } from 'semantic-ui-react'
import { Canvas, useNode } from "@craftjs/core";
import { FormLabel, Slider } from '@material-ui/core';
import { capitalize } from 'lodash';
import ContentEditable from 'react-contenteditable';
import { createTheme, MuiThemeProvider } from '@material-ui/core';

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


const theme = createTheme({
  palette: {
      primary: {
          main: '#000000'
      }
    },
});

let currentConfig = []

export const XMenu = (props) => {
    const { connectors: {connect, drag}, isActive, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
        isActive: state.events.selected
    }));
    return(
        <div 
        ref={ ref => connect(drag(ref))} 
        className='wrapper_menu'
        >
            <Menu
            style=
                {
                  {
                    fontWeight : props.fontWeight + ' !important'
                  }
                } 
              {... props}
              className="menubar"
            >
                <Canvas className='canvas' id='Element_menu'>
                    {props.children}
                </Canvas>
            </Menu>
        </div>
    )
}
export const XMenuReadOnly = (props) => {
    const { connectors: {connect, drag}, isActive, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
        isActive: state.events.selected
    }));
    return(
        <div 
        ref={ ref => connect(drag(ref))} 
        className='wrapper_segment'
        id={"wrapper_"+props.id}
        >
            <Menu 
              style=
                {
                  {
                    fontWeight : props.fontWeight,
                    backgroundColor : props.transparent ? 'transparent' : 'auto',
                  }
                } 
                
              {... props}
            >
                <Canvas className='canvas' id='Element_menu'>
                    {props.children}
                </Canvas>
            </Menu>
        </div>
    )
}

const SegmentSettings = () => {
    const { actions: {setProp}, basic, disabled, secondary, size, tertiary, textAlign, fontWeight, maxWidth, inverted, borderless } = useNode((node) => ({
        basic : node.data.props.basic,
        disabled : node.data.props.disabled,
        secondary : node.data.props.secondary,
        tertiary : node.data.props.tertiary,
        textAlign : node.data.props.textAlign,
        fontWeight : node.data.props.fontWeight,
        maxWidth : node.data.props.maxWidth,
        inverted : node.data.props.inverted,
        borderless : node.data.props.borderless,
        transparent : node.data.props.transparent,
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
      <Segment>
        <Checkbox label='Inverted' onChange={(_,value) => {setProp(props => props.inverted = value.checked);}}></Checkbox>
        <Checkbox label='Borderless' onChange={(_,value) => {setProp(props => props.borderless = value.checked);}}></Checkbox>
        <Checkbox label='transparent' onChange={(_,value) => {setProp(props => props.transparent = value.checked);}}></Checkbox>
      </Segment>
      <Segment className="text-additional-settings">
      <FormLabel component="legend">Font weight : {fontWeight}px </FormLabel>
      <MuiThemeProvider theme={theme}>
      <Slider
      defaultValue={fontWeight}
      step={100}
      aria-labelledby="continuous-slider"
      color='primary'
      min={100}
      max={900}
      valueLabelDisplay="auto"
      onChange={(_, value) => {
        setProp(props => props.fontWeight = value);
      }}
      />
      </MuiThemeProvider>
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

XMenu.craft = {
    props: {
        textAlign: 'left',
        size: 'small',
        maxWidth: "auto",
        fontWeight: 600,
    },
    related: {
      settings: SegmentSettings
    }  
  }
