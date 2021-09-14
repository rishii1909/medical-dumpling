import React, {useState, useEffect, useRef} from 'react';
import Storage from '@aws-amplify/storage';
import { useNode } from "@craftjs/core";
import { Segment, Dropdown, Button, Image, Header } from 'semantic-ui-react';
import { FormLabel, Slider } from '@material-ui/core';
import { capitalize } from 'lodash';
import styles from './Banner.module.css'
import ContentEditable from 'react-contenteditable';
import placeholder from './banner.jpg';
import useWindowDimensions from '../../hooks/useWindowDimensions';

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
]

export const XBanner = (props) => {
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
    const { connectors: {connect, drag}, isActive, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
        isActive: state.events.selected
      }));
    const [editable, setEditable] = useState(false);

    useEffect(() => {!selected && setEditable(false)}, [selected]);

    return (
        <div ref={ ref => connect(drag(ref))} style={signedURL ? {backgroundImage : `linear-gradient( rgba(0,0,0,.36), rgba(0,0,0,.36) ), url(${signedURL || props.src})`} : {backgroundImage : `linear-gradient(rgba(0,0,0,.36), rgba(0,0,0,.36))`}} className={styles.wrapper_banner}>
            <div style={{maxWidth : `${props.maxWidth}px`}}  className={styles.banner_header} >
                <ContentEditable
                className={styles.headerOne}
                disabled={editable}
                html={props.header}
                onChange={e => 
                  setProp(props => 
                    props.header = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")  
                  )
                }
                tagName="h1"
                />
            </div>
        </div>
    )
}

export const XBannerReadOnly = (props) => {
  const { winHeight, winWidth } = useWindowDimensions();
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
    const { connectors: {connect, drag}, isActive, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
        isActive: state.events.selected
      }));
    const [editable, setEditable] = useState(false);

    useEffect(() => {!selected && setEditable(false)}, [selected]);

    return (
        <div ref={ ref => connect(drag(ref))} style={signedURL ? {backgroundImage : `linear-gradient( rgba(0,0,0,.36), rgba(0,0,0,.36) ), url(${signedURL || props.src})`} : {backgroundImage : `linear-gradient(rgba(0,0,0,.36), rgba(0,0,0,.36))`}} className={props.header === '' ? styles.wrapper_banner_min : styles.wrapper_banner }>
            <div style={{maxWidth : `${props.maxWidth}px`}} className={styles.banner_header} >
                <h1 className={ winWidth < 496 ? styles.headerOneResp : styles.headerOne }>{props.header}</h1>
            </div>
        </div>
    )
}

const BannerSettings = () => {
    const inputEl = useRef(null);
    const { actions: {setProp}, src, size, float, raised, bordered, rounded, circular, centered, spaced, header, key, maxWidth } = useNode((node) => ({
        src: node.data.props.src,
        size: node.data.props.size,
        float: node.data.props.float,
        bordered: node.data.props.bordered,
        raised: node.data.props.raised,
        rounded: node.data.props.rounded,
        circular: node.data.props.circular,
        centered: node.data.props.centered,
        spaced: node.data.props.spaced,
        header: node.data.props.header,
        key: node.data.props.imageKey,
        maxWidth: node.data.props.maxWidth,
        
        
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
                {key ? key : 'None'}
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
                  onChange={onImageUpload}
                />
            </Segment>
            <Segment className="text-additional-settings">
            <FormLabel component="legend">Max Width : 
            {maxWidth !== "auto" ? maxWidth + 'px' : maxWidth} 
            {/* <ContentEditable
            html={vertical_padding} 
            onChange={e => 
              setProp(props => 
                props.vertical_padding = e.target.value  
              )
            } 
            tagName="p"
            /> */}
            </FormLabel>
            <Slider
            defaultValue={1}
            aria-labelledby="continuous-slider"
            color='primary'
            step={10}
            min={300}
            max={1800}
            valueLabelDisplay="auto"
            onChange={(_, value) => {
              setProp(props => {
                props.maxWidth = value > 0 ? value : "auto"; 
              });
            }}
            />
        </Segment>
        <br></br>
            <Segment className="image-additional-settings">
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
        </div>
    )
}



XBanner.craft = {
    props: {
        src: '',
        size: 'medium',
        bordered: true,
        header: "HEALTHY DIAGNOSTICS",
        key: null,
        maxWidth: 840,
        // height:'50px',
        // width:'100px'
    },
    related: {
      settings: BannerSettings
    }  
}

