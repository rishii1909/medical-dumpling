import React from 'react';
import ReactDOM from 'react-dom';
export const RenderIndicator = ({ style, parentDom }) => {
    const indicator = (React.createElement("div", { style: {
            position: 'fixed',
            display: 'block',
            opacity: 1,
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'transparent',
            zIndex: 99999,
            ...style,
        } }));
    if (parentDom && parentDom.ownerDocument !== document) {
        return ReactDOM.createPortal(indicator, parentDom.ownerDocument.body);
    }
    return indicator;
};
//# sourceMappingURL=RenderIndicator.js.map