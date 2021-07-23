import React from 'react';
import { Header, Segment, Button, Menu, MenuItem } from 'semantic-ui-react';
import { Element, useEditor } from "@craftjs/core";
import { XButton } from './user/Button';
import { XSegment } from './user/Segment';
import { XText } from './user/Text';
export const Toolbox = () => {
    const { connectors, query } = useEditor();
    return (
        <Segment>
            <Header dividing> Components </Header>
            <Menu fluid vertical>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XText text="Enter some text here" />)}>
                    <Button fluid> Add Text </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XButton text="Button text" />)}>
                    <Button fluid> Add Button </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XSegment>Add content</XSegment>)}>
                        <Button fluid> Add Segment </Button>
                    </div>
                </MenuItem>
            </Menu>
        </Segment>
    )
}