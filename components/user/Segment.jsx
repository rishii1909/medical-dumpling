import React from 'react';
import { Segment } from 'semantic-ui-react'
import { Element, Canvas, useNode } from "@craftjs/core";


export const XSegment = ({compact, circular, className, color, padded, placeholder, loading, basic, children}) => {
    const { connectors: {connect, drag} } = useNode();
    return(
        <div ref={ ref => connect(drag(ref))}>
        {/* <div> */}
            <Segment compact={compact} circular={circular} className={className} color={color} basic={basic} padded={padded} placeholder={placeholder} loading={loading}>
                {/* <Element id="buttons" canvas> */}
                <Canvas id='Element_container'>
                    {children}
                </Canvas>
                {/* </Element> */}
            </Segment>
        </div>
    )
} 