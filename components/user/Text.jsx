import React, {useState, useEffect} from 'react';
import { useNode } from "@craftjs/core";
import ContentEditable from 'react-contenteditable'

export const XText = ({text, children}) => {
    const { connectors: {connect, drag}, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged
      }));
    
    const [editable, setEditable] = useState(false);

    useEffect(() => {!selected && setEditable(false)}, [selected]);

    return (
            <p
            ref={ ref => connect(drag(ref))}
            onClick={e => setEditable(true)}
            className='text-wrapper'
            >
            
            <ContentEditable
            disabled={!editable}
            html={text} 
            onChange={e => 
              setProp(props => 
                props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")  
              )
            } 
            tagName="p"
            />
            
            </p>
    )
}