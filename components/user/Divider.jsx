import React from 'react';
import { Divider } from 'semantic-ui-react'
import { useNode } from "@craftjs/core";

export const XDivider = (props) => {
    const { connectors: {connect, drag} } = useNode();
    return(
        <div ref={ ref => connect(drag(ref))}>
        <Divider {... props}>{props.children}</Divider>
        </div>
    )
}

export const XDividerReadOnly = (props) => {
    const { connectors: {connect, drag} } = useNode();
    return(
        <div ref={ ref => connect(drag(ref))}>
        <Divider {... props}>{props.children}</Divider>
        </div>
    )
}