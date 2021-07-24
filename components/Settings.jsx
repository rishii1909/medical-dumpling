import React from 'react';
import { Box, Chip, Grid, Typography } from "@material-ui/core";
import { useEditor } from "@craftjs/core";
import { Button, Segment, Label, Header, Divider } from 'semantic-ui-react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#000000'
        }
    },
});

export const SettingsPanel = () => {  
    const { actions, selected } = useEditor((state,query) => {
        const currentNodeId = state.events.selected;
        let selected;
    
        if ( currentNodeId ) {
            console.log(state.nodes[currentNodeId].data)
            if(state.nodes[currentNodeId].data.displayName.includes("X")){
                selected = {
                    id: currentNodeId,
                    name: state.nodes[currentNodeId].data.name,
                    display: state.nodes[currentNodeId].data.displayName.replace('X',''),
                    settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
                    isDeletable: query.node(currentNodeId).isDeletable()
                }
            }else{
                selected = false
            };
          
        }
    
        return {
          selected
        }
      });
  return selected ? (    
    <Segment>
        <Grid container direction="column" spacing={0}>
        <Grid item>
          <Box pb={2}>
            <Grid container alignItems="center">
              <Grid item xs><Typography variant="subtitle1"><Header>{selected.display}</Header></Typography></Grid>
              <Grid item><Label >Selected</Label></Grid>
            </Grid>
          </Box>
        </Grid>
        <MuiThemeProvider theme={theme}>
        { 
          selected.settings && React.createElement(selected.settings)
        }
        </MuiThemeProvider>
        <Divider></Divider>
        {
          selected.isDeletable ? (
            <Button negative onClick={() => { actions.delete(selected.id); }} > 
                Delete 
            </Button>
          ) : null
        }
      </Grid>
    </Segment>
  ) : null
}