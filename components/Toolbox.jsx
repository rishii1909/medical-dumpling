import React from 'react';
import { Header, Segment, Button, Menu, MenuItem } from 'semantic-ui-react';
import { Element, useEditor } from "@craftjs/core";
import { XButton } from './user/Button';
import { XSegment } from './user/Segment';
export const Toolbox = () => {
    const { connectors, query } = useEditor();
    return (
        <Segment>
            <Header dividing> Here is a header. </Header>
            <Menu fluid vertical>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XButton text="Hi world" />)}>
                    <Button fluid> Add Button </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XSegment>New Segment</XSegment>)}>
                        <Button fluid> Add Segment </Button>
                    </div>
                </MenuItem>
            </Menu>
        </Segment>
    )
}