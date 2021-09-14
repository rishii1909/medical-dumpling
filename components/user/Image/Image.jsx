import React, {useState, useEffect, useRef} from 'react';
import { useNode } from "@craftjs/core";
import { Segment, Dropdown, Button, Image, Checkbox } from 'semantic-ui-react';
import { FormLabel, Slider } from '@material-ui/core';
import { capitalize } from 'lodash';
import styles from './Image.module.css'
import placeholder from './image.png';

import Storage from '@aws-amplify/storage';

const sizes = [
    {key : 1, label : 'mini',}, 
    {key : 2, label : 'tiny',}, 
    {key : 3, label : 'small',}, 
    {key : 4, label : 'medium',}, 
    {key : 5, label : 'large',}, 
    {key : 6, label : 'big',}, 
    {key : 7, label : 'huge',}, 
    {key : 8, label : 'massive'},
]

const floats = [
    {key : 1, label : 'left', val : 'left'},
    {key : 2, label : 'None', val : false},
    {key : 3, label : 'right', val : 'right'},
]

let currentConfig = []

const ImageOptions = [
    {key : 'raised', value : 'raised', text : 'raised'},
    {key : 'bordered', value : 'bordered', text : 'bordered'},
    {key : 'rounded', value : 'rounded', text : 'rounded'},
    {key : 'circular', value : 'circular', text : 'circular'},
    {key : 'centered', value : 'centered', text : 'centered'},
    {key : 'spaced', value : 'spaced', text : 'spaced'},
    {key : 'fluid', value : 'fluid', text : 'fluid'},
]

export const XImage = (props) => {

    const { connectors: {connect, drag}, isActive, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
        isActive: state.events.selected
      }));

    async function fetchImage(key) {
      try {
        let imageData = await Storage.get(key)
        return imageData;
      } catch(err) {
        console.log('error: ', err)
      }
    }
    const [signedURL, setSignedURL] = useState(null);
    fetchImage(props.imageKey).then(result => {setSignedURL(result);})
    const [editable, setEditable] = useState(false);

    useEffect(() => {!selected && setEditable(false)}, [selected]);


    return (
        <div ref={ ref => connect(drag(ref))} style={{ float : props.float ? props.float : 'none', margin : props.float ? props.float === 'right' ? '0 0 1.2em 1.2em' : '0 1.2em 1.2em 0' : 'auto'  }} className={props.float !== false ? styles.image_wrapper : styles.image_wrapper_fullWidth}>
            <Image style={{ height : props.icon ? '48px' : 'auto', width : 'auto'}} { ... props } src={signedURL}></Image>
        </div>
    )
}

export const XImageReadOnly = (props) => {

    const { connectors: {connect, drag}, isActive, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
        isActive: state.events.selected
      }));

    async function fetchImage(key) {
      try {
        let imageData = await Storage.get(key)
        return imageData;
      } catch(err) {
        console.log('error: ', err)
      }
    }
    const [signedURL, setSignedURL] = useState(null);
    fetchImage(props.imageKey).then(result => {setSignedURL(result);})
    return (
        <div ref={ ref => connect(drag(ref))} style={{ float : props.float ? props.float : 'none', margin : props.float ? props.float === 'right' ? '0 0 1.2em 1.2em' : '0 1.2em 1.2em 0' : 'auto'  }} className={props.float !== false ? styles.image_wrapper : styles.image_wrapper_fullWidth}>
            <Image style={{ height : props.icon ? '48px' : 'auto', width : 'auto'}} { ... props } src={signedURL}></Image>
        </div>
    )
}

const ImageSettings = () => {
    const inputEl = useRef(null);
    const { actions: {setProp}, src, size, float, fluid, raised, bordered, rounded, circular, centered, spaced, icon } = useNode((node) => ({
        src: node.data.props.src,
        size: node.data.props.size,
        float: node.data.props.float,
        bordered: node.data.props.bordered,
        raised: node.data.props.raised,
        rounded: node.data.props.rounded,
        circular: node.data.props.circular,
        centered: node.data.props.centered,
        spaced: node.data.props.spaced,
        fluid: node.data.props.fluid,
        icon: node.data.props.icon,
        
    }));

    async function onImageUpload(e) {
        const img = e.target.files[0];
        // if (event.target.files && event.target.files[0]) {
        // let img = event.target.files[0];
        // }
        try {
          setProp(props => props.src = URL.createObjectURL(img))
          const imageUpload = await Storage.put(img.name, img, {
            // contentType: 'image/png' // contentType is optional
          });
          const uploadedImageKey = imageUpload.key
          const signedURL = await Storage.get(uploadedImageKey);
          setProp(props => props.src = signedURL)
          setProp(props => props.imageKey = uploadedImageKey)
  
        } catch (error) {
          console.log('Error in image processing: ', error);
        }
    }
    return (
        <div>
            <Segment className='image-additional-settings' style={{maxWidth:'100%'}}>
                <FormLabel component="legend">Upload Image</FormLabel>
                <br></br>
                <Button
                  content="Choose File"
                  labelPosition="left"
                  icon="file"
                  onClick={() => inputEl.current.click()}
                />
                <input
                  ref={inputEl}
                  type="file"
                  hidden
                  onChange={(event) => onImageUpload(event)}
                />
            </Segment>
            <Segment className="image-additional-settings">
            <Checkbox label='Icon' onChange={(_,value) => {setProp(props => props.icon = value.checked);}}></Checkbox>
            <FormLabel component="legend">Image size : { size } </FormLabel>
            <Slider
                defaultValue={sizes.find(function(x) { return x.label === size }).key}
                aria-labelledby="continuous-slider"
                color='primary'
                min={1}
                max={7}
                valueLabelDisplay="auto"
                onChange={(_, value) => {
                    setProp(props => {
                        props.size = sizes[value].label; 
                    });
                }}
                />
            </Segment>
            <Segment padded='' className="image-additional-settings">
                <FormLabel component="legend">Float image : {typeof(float) === 'string' ? capitalize(float) : 'None'} </FormLabel>
                <Slider
                defaultValue={1}
                aria-labelledby="continuous-slider"
                color='primary'
                min={0}
                max={2}
                onChange={(_, value) => {
                    setProp(props => props.float = floats[value].value)
                  switch (value) {
                    case 0:
                      setProp(props => props.float = 'left');
                      break;
                
                    case 1:
                      setProp(props => props.float = false);
                      break;
                
                    case 2:
                      setProp(props => props.float = 'right');
                      break;
                
                    default:
                      break;
                  }
              
                }}
                />
            </Segment>
            <Segment className="image-additional-settings">
                <Dropdown
                    clearable
                    fluid
                    multiple
                    search
                    selection
                    options={ImageOptions}
                    placeholder='Image options'
                    onChange={(_,values) => {
                        let newStuff = values.value.filter(x => !currentConfig.includes(x));
                        let trash = currentConfig.filter(x => !values.value.includes(x));
                        newStuff.forEach(el => {setProp(props => props[el] = true)});
                        trash.forEach(el => {setProp(props => props[el] = false)});
                        currentConfig = values.value
                    }}
                />        
            </Segment>
            {/* <Segment className='image-additional-settings'>
                <FormLabel component='legend'>Image dimensions : </FormLabel>
                <br></br>
                <Form>
                <FormGroup widths='equal' >
                    <FormField
                        width='2'
                        className='compressed-input'
                        control={Input} 
                        label="Height"
                        defaultValue={height}
                        onChange={(_,value) => {setProp(props => props.height = value)}}
                    />
                    <FormField
                        width='2'
                        className='compressed-input'
                        control={Input}
                        label="width"
                        defaultValue={width}
                        onChange={(_,value) => {setProp(props => props.width = value)}}
                    />
                </FormGroup>
                </Form>
            </Segment> */}
        </div>
    )
}
XImage.craft = {
    props: {
        src: '/_next/static/image/components/user/Image/image.a00eb108e09cd928ab58788d4d5db741.png',
        size: 'medium',
        float: false,
        imageKey: 'None',
        // height:'50px',
        // width:'100px'
    },
    related: {
      settings: ImageSettings
    }  
}