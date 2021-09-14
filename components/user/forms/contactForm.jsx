import React, {useState, useEffect} from 'react';
import { useNode } from "@craftjs/core";
import { Label, FormGroup, FormInput, FormTextArea, FormButton, Form, Header, Segment, Icon } from 'semantic-ui-react';

import { API, graphqlOperation } from 'aws-amplify';
import { createContactForm } from '../../../src/graphql/mutations';

export const XContactForm = (props) => {
    const { connectors: {connect, drag}, isActive, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
        isActive: state.events.selected
      }));
    const [editable, setEditable] = useState(false);

    useEffect(() => {!selected && setEditable(false)}, [selected]);

    return (
        <div ref={ ref => connect(drag(ref))}>
            <Form >
            <Header dividing>SEND US A MESSAGE</Header>
                <FormGroup widths='equal'>
                    <FormInput fluid label='First name' />
                    <FormInput fluid label='Last name' />
                </FormGroup>
                {/* <FormGroup> */}
                    <FormInput fluid label='Email address' />
                {/* </FormGroup> */}
                {/* <FormGroup> */}
                    <FormInput fluid label='Subject' />
                {/* </FormGroup> */}
                {/* <FormGroup> */}
                    <FormTextArea fluid label='Message' />
                {/* </FormGroup> */}
                <FormButton color='black'>Submit</FormButton>
            </Form>
        </div>
    )
}


export const XContactFormReadOnly = (props) => {

    const [firstNameInputError, setFirstNameInputError] = useState(false);
    const [lastNameInputError, setLastNameInputError] = useState(false);
    const [subjectInputError, setSubjectInputError] = useState(false);
    const [emailInputError, setEmailInputError] = useState(false);
    const [contentInputError, setContentInputError] = useState(false);
    const [showErrMessage, setShowErrMessage] = useState(false);
    const [success, setSuccess] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [subject, setSubject] = useState('');
    const [email, setEmail] = useState('');
    const [content, setContent] = useState('');

    async function pushContactForm(){
        var tempInit = false
        !firstName ? setFirstNameInputError(true) : setFirstNameInputError(false)
        !lastName ? setLastNameInputError(true) : setLastNameInputError(false)
        !subject ? setSubjectInputError(true) : setSubjectInputError(false)
        !email ? setEmailInputError(true) : setEmailInputError(false)
        !content ? setContentInputError(true) : setContentInputError(false)
        if(!firstName | !lastName | !subject | !email | !content){
            setShowErrMessage('Please enter all fields');
        }
        else{
            setShowErrMessage(false);
            const jsonContactForm = {
                first_name : firstName,
                last_name : lastName,
                subject : subject,
                email : email,
                message : content
            }
            const jsonStringifiedContactForm = JSON.stringify(jsonContactForm) 
            const bubbleCreateContactForm = await API.graphql(
                graphqlOperation(
                    createContactForm, { 
                        input : {
                            value : jsonStringifiedContactForm,
                            timestamp : Date.now()
                        }
            }));
            if(bubbleCreateContactForm.data.createContactForm){
                setSuccess(true);
            }else{
                setShowErrMessage('There was some error, please try again.')
            }
        }
    }

    const { connectors: {connect, drag}, isActive, selected, dragged, actions: {setProp} } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
        isActive: state.events.selected
      }));
    const [editable, setEditable] = useState(false);

    useEffect(() => {!selected && setEditable(false)}, [selected]);

    return (
        <div ref={ ref => connect(drag(ref))}>
            <Segment disabled={success}>
                <Form >
                    <Header dividing>SEND US A MESSAGE</Header>
                    <FormGroup widths='equal'>
                        <FormInput
                        error={firstNameInputError}
                        onChange={(_,input) => setFirstName(input.value) }
                        fluid label='First name' required/>
                        <FormInput 
                        error={lastNameInputError}
                        onChange={(_,input) => setLastName(input.value) }
                        fluid label='Last name' required/>
                    </FormGroup>
                    <FormInput 
                        error={emailInputError}
                        onChange={(_,input) => setEmail(input.value) }
                        fluid label='Email address' required/>
                    <FormInput 
                        error={subjectInputError}
                        onChange={(_,input) => setSubject(input.value) }
                        fluid label='Subject' required/>
                    <FormTextArea 
                        error={contentInputError}
                        onChange={(_,input) => setContent(input.value) }
                        fluid label='Message' required/>
                    {showErrMessage && 
                            <span style={{color : 'red', marginTop : '4px', opacity : '0.8'}}>{showErrMessage}</span>
                    }
                    <br></br>
                    {!success && 
                        <FormButton color='black' onClick={()=>pushContactForm()}>Submit</FormButton>
                    }

                </Form>
            </Segment>
            {success && 
                <div style={{display:'flex', justifyContent:'center', flexFlow:'column', padding : '4em 0'}}>
                    <Icon style={{margin : '0px auto'}} color='green' size='huge' name='check circle outline'/>
                    <Header color='black' textAlign='center' style={{opacity : '0.8'}} as='h4'>Great! We&apos;ll get in touch with you soon.</Header>
                </div>
            }
            <br></br>
        </div>
    )
}



XContactForm.craft = {
    props: {
        // src: '',
        // size: 'medium',
        // bordered: true,
        // header: "HEALTHY DIAGNOSTICS",
        // key: null,
        // // height:'50px',
        // // width:'100px'
    },
    // related: {
    //   settings: ContactFormSettings
    // }  
}

