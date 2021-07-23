import React from 'react';
import { Element } from "@craftjs/core";
import { XSegment } from './Segment';


export const XDSegment = ({compact, circular, classname, color, padded, placeholder, loading, children}) => {
    return(
        <XSegment compact={compact} circular={circular} className={classname} color={color} padded={padded} placeholder={placeholder} loading={loading}>
            <div>
            <Element id='droppable_segment' canvas></Element>
            </div>
            {children}
        </XSegment>
    )
} 