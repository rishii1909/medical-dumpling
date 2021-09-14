import React, {useState, useEffect} from 'react';
import { Segment, Dropdown, Grid, GridRow, GridColumn, Checkbox } from 'semantic-ui-react'
import { Canvas, useNode } from "@craftjs/core";
import { FormLabel, Slider } from '@material-ui/core';
import { capitalize } from 'lodash';
import useWindowDimensions from '../hooks/useWindowDimensions';

const segmentOptions = [
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

export const XThreeColumns = (props) => {
    const { connectors: {connect, drag}, isActive, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
        isActive: state.events.selected
    }));

    return(
        <div 
        ref={ ref => connect(drag(ref))} 
        className='wrapper_segment'
        >
            <Segment textAlign='center' style={{paddingTop : props.vertical_padding, paddingBottom : props.vertical_padding,paddingLeft : props.horizontal_padding, paddingRight : props.horizontal_padding, maxWidth : props.maxWidth, margin : props.maxWidth !== "auto" ? "0px auto" : "auto", }} {... props} basic>
            <Grid doubling>
              <GridRow centered={props.centered}>
                <GridColumn width={props.first_col_width} style={{textAlign : props.textAlign}}>
                <Canvas className='canvas' id='Element_two_columns_1'>
                    Add content here...
                </Canvas>
                </GridColumn>
                <GridColumn width={props.second_col_width} style={{textAlign : props.textAlign}}>
                <Canvas className='canvas' id='Element_two_columns_2'>
                    Add content here...
                </Canvas>
                </GridColumn>
                <GridColumn width={props.third_col_width} style={{textAlign : props.textAlign}}>
                <Canvas className='canvas' id='Element_two_columns_3'>
                    Add content here...
                </Canvas>
                </GridColumn>
              </GridRow>
            </Grid> 
            </Segment>
        </div>
    )
}

export const XThreeColumnsReadOnly = (props) => {
    const { winHeight, winWidth } = useWindowDimensions();
    const { connectors: {connect, drag}, isActive, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
        isActive: state.events.selected
    }));

    return(
        <div 
        ref={ ref => connect(drag(ref))} 
        className='wrapper_segment'
        >
            <Segment textAlign='center' style={{paddingTop : props.vertical_padding, paddingBottom : props.vertical_padding,paddingLeft : props.horizontal_padding, paddingRight : props.horizontal_padding, maxWidth : props.maxWidth, margin : props.maxWidth !== "auto" ? "0px auto" : "auto", }} {... props} basic>
              <Grid>
                <GridRow centered={props.centered}>
                  <GridColumn textAlign={props.centered} width={winWidth < 800 ? props.first_col_width >= 3 ? 16 : 2*props.first_col_width : props.first_col_width }>
                    <Canvas className='canvas' id='Element_two_columns_1'>
                        Add content here...
                    </Canvas>
                  </GridColumn>
                  <GridColumn textAlign={props.centered} width={winWidth < 800 ? props.second_col_width >= 3 ? 16 : 2*props.second_col_width : props.second_col_width }>
                    <Canvas className='canvas' id='Element_two_columns_2'>
                        Add content here...
                    </Canvas>
                  </GridColumn>
                  <GridColumn textAlign={props.centered} width={winWidth < 800 ? props.third_col_width >= 3 ? 16 : 2*props.third_col_width : props.third_col_width }>
                    <Canvas className='canvas' id='Element_two_columns_3'>
                        Add content here...
                    </Canvas>
                  </GridColumn>
                </GridRow>
              </Grid> 
            </Segment>
        </div>
    )
}

const ThreeColumnsSettings = () => {
    const { actions: {setProp}, centered, basic, circular, clearing, color, disabled, padded, piled, raised, secondary, size, stacked, tertiary, textAlign, vertical, vertical_padding, horizontal_padding, first_col_width, second_col_width, third_col_width, maxWidth } = useNode((node) => ({
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
        first_col_width : node.data.props.first_col_width,
        second_col_width : node.data.props.second_col_width,
        third_col_width : node.data.props.third_col_width,
        maxWidth : node.data.props.maxWidth,
        centered : node.data.props.centered,

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
            <FormLabel component="legend">First col width : {first_col_width} </FormLabel>
            <Slider
            defaultValue={5}
            // step={1}
            aria-labelledby="continuous-slider"
            color='primary'
            min={1}
            max={16}
            valueLabelDisplay="auto"
            onChange={(_, value) => {
                setProp(props => {
                    props.first_col_width = value; 
                });
            }}
            />
            <br></br>
            <FormLabel component="legend">Second col width : {second_col_width} </FormLabel>
            <Slider
            defaultValue={6}
            // step={1}
            aria-labelledby="continuous-slider"
            color='primary'
            min={1}
            max={16}
            valueLabelDisplay="auto"
            onChange={(_, value) => {
                setProp(props => {
                    props.second_col_width = value; 
                });
            }}
            />
            <br></br>
            <FormLabel component="legend">Third col width : {third_col_width} </FormLabel>
            <Slider
            defaultValue={5}
            // step={1}
            aria-labelledby="continuous-slider"
            color='primary'
            min={1}
            max={16}
            valueLabelDisplay="auto"
            onChange={(_, value) => {
                setProp(props => {
                    props.third_col_width = value; 
                });
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
            <Checkbox label='Centered' onChange={(_,value) => {setProp(props => props.centered = value.checked);}}></Checkbox>
            <br></br>
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

XThreeColumns.craft = {
    props: {
        textAlign: 'left',
        size: 'small',
        maxWidth: "auto",
        first_col_width : 5,
        second_col_width : 6,
        third_col_width : 5
    },
    related: {
      settings: ThreeColumnsSettings
    }  
  }
