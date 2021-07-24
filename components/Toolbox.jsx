import React from 'react';
import { Header, Segment, Button, Menu, MenuItem, Dropdown, DropdownItem, DropdownMenu } from 'semantic-ui-react';
import { Element, useEditor } from "@craftjs/core";
import { XButton } from './user/Button';
import { XSegment } from './user/Segment';
import { XText } from './user/Text';
import { XDivider } from './user/Divider';
import { XHeader } from './user/Header';
export const Toolbox = () => {
    const { connectors, query } = useEditor();

    return (
        <Segment>
            <Header dividing> Components </Header>
            <Menu fluid vertical>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XText />)}>
                    <Button fluid> Add Text </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XButton text="Button text" />)}>
                    <Button fluid> Add Button </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XSegment className='user-segment'>Add content here</XSegment>)}>
                        <Button fluid> Add Segment </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XDivider></XDivider>)}>
                        <Button fluid> Add Divider </Button>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div ref={ref=> connectors.create(ref, <XHeader text='Enter header here'></XHeader>)}>
                        <Button fluid> Add Header </Button>
                    </div>
                </MenuItem>
            </Menu>
        </Segment>
    )
}