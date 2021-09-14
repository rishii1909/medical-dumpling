import React, {useState, useEffect} from 'react';
import { Button, Checkbox, Segment } from 'semantic-ui-react'
import { useNode } from "@craftjs/core";
import ContentEditable from 'react-contenteditable'


export const XButton = (props) => {
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
        className='wrapper_button'
        style={{ display : 'inline-flex' }}
        >
            <Button {... props}> 
            
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

            </Button>
        </div>
    )
} 

export const XButtonReadOnly = (props) => {
    const { connectors: {connect, drag}, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged
      }));
    
    return(
        <div 
        ref={ ref => connect(drag(ref))}
        className='wrapper_button'
        style={{ display : 'inline-flex' }}
        id={props.id}
        >
            <Button {... props}> 
            
            {props.text}

            </Button>
        </div>
    )
} 

const ButtonSettings = () => {
  const { actions: {setProp}, inverted, basic } = useNode((node) => ({
      basic : node.data.props.basic,
      inverted : node.data.props.inverted,
  }));
  
  return (
    <div>
      <Segment>
        <Checkbox label='Inverted' onChange={(_,value) => {setProp(props => props.inverted = value.checked);}}></Checkbox>
        <Checkbox label='basic' onChange={(_,value) => {setProp(props => props.basic = value.checked);}}></Checkbox>
      </Segment>
    </div>
  )
}

XButton.craft = {
  
  related: {
    settings: ButtonSettings
  }  
}
