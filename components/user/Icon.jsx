import React, {useState, useEffect} from 'react';
import Link from 'next/Link';
import { Icon, Checkbox, Segment, Input } from 'semantic-ui-react'
import { useNode } from "@craftjs/core";
import { FormLabel, Slider } from '@material-ui/core';
import ContentEditable from 'react-contenteditable'
import styles from '../footer/footer.module.css'

export const XIcon = (props) => {
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
        className='wrapper_Icon'
        style={{ display : 'inline-flex' }}
        >
            <Icon className={props.footer ? styles.social_icons : null} {... props}> 
            </Icon>
        </div>
    )
} 

export const XIconReadOnly = (props) => {
    const { connectors: {connect, drag}, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged
      }));
    
    return(
        <div 
        ref={ ref => connect(drag(ref))}
        className='wrapper_Icon'
        style={{ display : 'inline-flex' }}
        id={props.id}
        >
        {props.link ? 
          <a href={props.link}>
          <Icon className={props.footer ? styles.social_icons : null} {... props}> 
            
            {props.text}

            </Icon>
          </a>
          : 
          <Icon className={props.footer ? styles.social_icons : null} {... props}> 
            
            {props.text}

          </Icon>
        }
            
        </div>
    )
} 

const IconSettings = () => {
  const { actions: {setProp}, circular, name, footer, link } = useNode((node) => ({
      circular : node.data.props.circular,
      name : node.data.props.name,
      footer : node.data.props.footer,
      link : node.data.props.link
  }));
  
  return (
    <div>
      <Segment>
        <Checkbox label='Circular' onChange={(_,value) => {setProp(props => props.circular = value.checked);}}></Checkbox>
        <Checkbox label='Footer icon' onChange={(_,value) => {setProp(props => props.footer = value.checked);}}></Checkbox>
        <br></br>
        <Input fluid value={name} onChange={(_,input) => { 
          console.log(input.value)
          setProp(props => {
            props.name = input.value; 
          });
         }}>
        </Input>
      </Segment>
      <Segment>
        <FormLabel component="legend">Href </FormLabel>
        <Input fluid value={link} onChange={(_,input) => { 
          setProp(props => {
            props.link = input.value; 
          });
         }}>
        </Input>
      </Segment>
        <br></br>
    </div>
  )
}

XIcon.craft = {
  
  related: {
    settings: IconSettings
  }  
}
