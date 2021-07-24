import React, { useState, useEffect } from 'react';
import { Header } from 'semantic-ui-react'
import { Canvas, useNode } from "@craftjs/core";
import ContentEditable from 'react-contenteditable'


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