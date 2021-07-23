import React from 'react';
import { Button, Input, Segment } from 'semantic-ui-react';

export const SettingsPanel = () => {
    return(
        <Segment>
              <Input fluid type="text" placeholder="Slider..."/>
            <Button color='red'> Delete </Button>
        </Segment>
    )
}