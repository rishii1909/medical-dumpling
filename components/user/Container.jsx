import React from 'react';
import { Container } from 'semantic-ui-react'
import { useNode } from "@craftjs/core";

export const XContainer = ({children}) => {
    const { connectors: {connect, drag} } = useNode();
    return(
        <div ref={ ref => connect(drag(ref))}>
        <Container >{children}</Container>
        </div>
    )
} 