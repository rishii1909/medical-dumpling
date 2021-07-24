import React from 'react';
import { Container } from 'semantic-ui-react'
import { useNode, Canvas } from "@craftjs/core";

export const XContainer = (props) => {
    const { connectors: {connect, drag} } = useNode();
    return(
        <div ref={ ref => connect(drag(ref))}>
            <Container {... props}>
                <Canvas id='Element_container'>
                    {props.children}
                </Canvas>
            </Container>
        </div>
        
    )
} 