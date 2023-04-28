import React, { useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser';
import { useState } from 'react';
import {useStateValue} from '../context/StateProvider';
import ReCAPTCHA from "react-google-recaptcha";


const Result = () => {
    return (
        <p>You had send your messae successfully.We will contact you as soon as possible</p>
    )
}

const Contact = () => {
    const [{user},dispath] = useStateValue();
    const form = useRef();
    const [result, setResult] = useState(false)
    const key='6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
    const[captchaIsDone,setCaptchaDone]=useState(false)

    const sendEmail = (e) => {
        e.preventDefault(); 
        const user_name = form.current.user_name.value;
        const user_email = form.current.user_email.value;
        const message = form.current.message.value;
        const templateParams = {
            user_name: user_name,
            user_email: user_email,
            message: message
        };
        emailjs.send('service_ptz505u',
        'template_umg436e',
        templateParams, 'kS6eO53Umg8pwzomH')
        .then((result) => {
            console.log(result);
            console.log("sent successfully");
        }, (error) => {
            console.log(error.text);
        });

        e.target.reset();
        setResult(true)
    };

    function onChange(){
        setCaptchaDone(true)
        console.log("change")
    }
  

    return (
        <div className="py-8 lg:py-10 px-4 mx-auto max-w-screen-md">
            <p className='mb-4 text-4xl text-4xlfont-medium text-gray-900'> Contact Us Here</p>
            <p className='mb-8 lg:mb-10 text-4xlfont-medium text-gray-900'> Let us know your issue</p>
            <form className='space-y-8' action='#' id='ContactForm' ref={form} onSubmit={sendEmail}>
                <div>
                    <label className='block mb-2 text-sm font-medium text-gray-900'>Full Name</label>
                    <input type="text" required
                        className='block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm'
                        value={user?.user?.name} name="user_name" disabled />
                </div>
                <div>
                    <label className='block mb-2 text-sm font-medium text-gray-900'>Email</label>
                    <input type="email" required className='block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm '
                        value={user?.user?.email} name="user_email" disabled />
                </div>
                <div className='sm:col-span-2'>
                    <label className='block mb-2 text-sm font-medium text-gray-90'>Message</label>
                    <textarea name="message" required
                        className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 '
                        placeholder='What is your problem' />
                </div>

                <ReCAPTCHA
                sitekey={key}
                onChange={onChange}
                />,


                {captchaIsDone &&<button 
                type="submit"
                className='py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-blue-500 '>Send message 
                
                </button>}
                <div className='row'>{
                    result ? <Result /> : null
                }</div>
            </form>
        </div>
    )
}

export default Contact