import React, { useState, useEffect } from 'react';
import { Icon, Segment, Form, Input, TextArea, Divider, Button, Header } from 'semantic-ui-react';
import { Collapse } from 'react-collapse';

import { API, graphqlOperation } from 'aws-amplify';
import { createContactForm } from '../../src/graphql/mutations';


const XContactWidget = () => {
    const [firstNameInputError, setFirstNameInputError] = useState(false);
    const [emailInputError, setEmailInputError] = useState(false);
    const [companyInputError, setCompanyInputError] = useState(false);
    const [contentInputError, setContentInputError] = useState(false);
    const [showErrMessage, setShowErrMessage] = useState(false);
    const [success, setSuccess] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [content, setContent] = useState('');
    const [contactFormOpen, setContactFormOpen] = useState(false);

    async function pushContactForm(){
        !firstName ? setFirstNameInputError(true) : setFirstNameInputError(false)
        !email ? setEmailInputError(true) : setEmailInputError(false)
        !company ? setCompanyInputError(true) : setCompanyInputError(false)
        !content ? setContentInputError(true) : setContentInputError(false)
        if(!firstName | !email | !company | !content){
            setShowErrMessage('Please enter all fields');
        }
        else{
            setShowErrMessage(false);
            const jsonContactForm = {
                first_name : firstName,
                email : email,
                company : company,
                content : content
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
                console.log('success')
            }else{
                setShowErrMessage('There was some error, please try again.')
            }
        }
    }
    return (
        <div className='contact_widget_wrapper raised'>
            <div className='contact_widget_header' onClick={()=>{setContactFormOpen(!contactFormOpen); console.log(contactFormOpen)}}>
                Contact Us 
                <Icon style={{float : 'right', transform : !contactFormOpen ? 'scale(0.9)' : 'scale(0.9) rotate(180deg)', transition : '0.4s ease' }} name='chevron up' size='large' />
            </div>
            <Collapse style={{transition : '1s ease'}} isOpened={contactFormOpen}>
                <Segment style={{borderRadius : '0'}}>
                    {!success ? 
                    <Form style={{margin : '8px 0px'}}>
                        How can we help you today?
                        <Input error={firstNameInputError} value={firstName} fluid placeholder='First name' 
                        onChange={(_,input) => { 
                          setFirstName(input.value)
                         }}
                         ></Input>
                        <Input error={emailInputError} value={email} fluid placeholder='Email' 
                        onChange={(_,input) => { 
                          setEmail(input.value)
                         }}
                         ></Input>
                        <Input error={companyInputError} value={company} fluid placeholder='Company' 
                        onChange={(_,input) => { 
                          setCompany(input.value)
                         }}
                         ></Input>
                        <TextArea error={contentInputError} value={content} placeholder='Enter your question' 
                        onChange={(_,input) => {
                          setContent(input.value)
                         }}
                         />
                        {showErrMessage && 
                            <span style={{color : 'red', marginTop : '4px', opacity : '0.8'}}>{showErrMessage}</span>
                        }
                        <Divider hidden></Divider>
                        <div style={{display : 'flex', justifyContent : 'center'}}>
                            <Button 
                            onClick={()=>pushContactForm()} 
                            className='raised' 
                            color='blue' 
                            style={{backgroundColor : '#184d7f'}}
                            >
                                Send email
                            </Button>
                        </div>
                    </Form>
                    : 
                    <div style={{display:'flex', justifyContent:'center', flexFlow:'column', padding : '4em 0'}}>
                        <Icon style={{margin : '0px auto'}} color='green' size='huge' name='check circle outline'/>
                    <Header color='black' textAlign='center' style={{opacity : '0.8'}} as='h4'>Great! We&apos;ll get in touch with you soon.</Header>
                    </div>
                    }
                </Segment>
            </Collapse>
        </div>
    )
}

export default XContactWidget