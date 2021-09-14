import React, {useState, useEffect} from 'react';
import { Grid, Segment, Dropdown } from 'semantic-ui-react'
import { Canvas, useNode } from "@craftjs/core";
import { FormLabel, Slider } from '@material-ui/core';
import { capitalize, times } from 'lodash';

const GridOptions = [
    {key : 'celled', value : 'celled', text : 'celled'},
    {key : 'centered', value : 'centered', text : 'centered'},
    {key : 'columns', value : 'columns', text : 'columns'},
    {key : 'divided', value : 'divided', text : 'divided'},
    {key : 'doubling', value : 'doubling', text : 'doubling'},
    {key : 'padded', value : 'padded', text : 'padded'},
    {key : 'inverted', value : 'inverted', text : 'inverted'},
    {key : 'relaxed', value : 'relaxed', text : 'relaxed'},
    {key : 'stackable', value : 'stackable', text : 'stackable'},
    {key : 'verticalAlign', value : 'verticalAlign', text : 'verticalAlign'},
    {key : 'textAlign', value : 'textAlign', text : 'textAlign'},
    {key : 'vertical', value : 'vertical', text : 'vertical'}
]

let currentConfig = []

export const XGrid = (props) => {
    const { connectors: {connect, drag}, isActive, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
        isActive: state.events.selected
    }));

    return(
        <div 
        ref={ ref => connect(drag(ref))} 
        className='wrapper_grid canvas'
        >
              <Canvas className='canvas' id='canvas_grid'>
              {times(props.rows, (i) => (
                {/* <XGridRow columns={2} key={i}>Content</XGridRow> */}
              ))}
              </Canvas>
        </div>
    )
}

const GridSettings = () => {
    const { actions: {setProp}, celled, centered, columns, divided, doubling, padded, inverted, relaxed, stackable, verticalAlign, textAlign, vertical } = useNode((node) => ({
        celled : node.data.props.celled,
        centered : node.data.props.centered,
        columns : node.data.props.columns,
        divided : node.data.props.divided,
        doubling : node.data.props.doubling,
        padded : node.data.props.padded,
        inverted : node.data.props.inverted,
        relaxed : node.data.props.relaxed,
        stackable : node.data.props.stackable,
        textAlign : node.data.props.textAlign,
        verticalAlign : node.data.props.verticalAlign,
        vertical : node.data.props.vertical,
    }));
    
    return (
      <div>
      <Segment className="grid-row-additional-settings">
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
      <Segment className="grid-additional-settings">
      <Dropdown
          clearable
          fluid
          multiple
          search
          selection
          options={GridOptions}
          placeholder='Grid options'
          onChange={(_,values) => {
              let newStuff = values.value.filter(x => !currentConfig.includes(x));
              let trash = currentConfig.filter(x => !values.value.includes(x));
              newStuff.forEach(el => {setProp(props => props[el] = true)});
              trash.forEach(el => {setProp(props => props[el] = false)});
              currentConfig = values.value
          }}
      />        
      </Segment>
    </div>
    )
  }

XGrid.craft = {
    props: {
        textAlign: 'left',
        size: 'small'
    },
    related: {
      settings: GridSettings
    }  
  }
