import { useCallback, useEffect, useState } from "react";
import styles from '../../assets/css/Contact.module.css';
import ScrollFadeIn from "../../component/public/ScrollFadeIn";
import { toast } from "react-toastify";
import GoogleMap from "../../component/contact/Google-map";
import { useUser } from "../../component/middleware/Authentication";
import GoogleTranslateCustom from "../../component/public/Translator";

const Contact = () => {
    const { user, refreshUser } = useUser();
    // fetch captcha code
    const [question,  setQuestion] = useState('');
    const fetchCaptcha = useCallback(async () => {
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}account/captcha.php`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })

            const data = await response.json();
            setQuestion(data.question);
        }
        catch (error){
            toast.error('Network error', {toastId: 'captcha_error'});
        }
    }, [])


    // submit form data
    const [input, setInput] = useState({
        fullname: '',
        email: '',
        subject: '',
        message: '',
        captcha: ''
    })

    const handleInput = (event) => {
        const { name, value } = event.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const submitForm = async(event) => {
        event.preventDefault();
        const isEmpty = Object.values(input).some(value => value.trim() === '');
        if (isEmpty) {
            toast.warning("All fields are required to proceed", {toastId: 'contact_form_warning'});
            fetchCaptcha(); // refresh captcha on error
                // reset captcha field
                setInput(prev => ({
                    ...prev,
                    captcha: ''
                }));
            return;
        }

        try {
            // submit the forms data
            const responseSubmit = await fetch(`${import.meta.env.VITE_APP_API_URL}contact_us.php`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(input)
            })

            const requestResponse = await responseSubmit.json();
            if (requestResponse.status === 'success') {
                toast.success("Your message has been sent successfully");
            }

            else {
                toast.warning(requestResponse.message || "An error has occured, please try again later");
                fetchCaptcha(); // refresh captcha on error
                // reset captcha field
                setInput(prev => ({
                    ...prev,
                    captcha: ''
                }));
            }
        }

        catch (error) {
            toast.error("An error occured while submitting form");
        }
    }

    useEffect(() => {
        fetchCaptcha();
        document.title = `Contact Us - ${import.meta.env.VITE_APP_NAME}`;
        refreshUser();
    }, [fetchCaptcha]);

    return (
        <>
            {/* contact us main container */}
            <div className={`${styles['contact_main_container']} container-fluid`}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-12">
                            {/* pages intro */}
                            <div className={styles['page_intro']}>
                                <p>Contact Us</p>
                                <ScrollFadeIn>
                                    <div className={styles['tiny-line']}></div>
                                </ScrollFadeIn>
                                <p>We are always available to respond to your complaints and request </p>
                                <div>
                                    <GoogleTranslateCustom />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* contact form and info */}
            <div className={`${styles['contact_info_form']} container-fluid`}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-6">
                            {/* contact info */}
                            <div className="row">
                                <div className="col-12 col-md-6 col-lg-6">
                                    <div className={styles['contact_info']}>
                                        <p>Contact Details</p>
                                        <span><i className="bi bi-question-circle"></i> {import.meta.env.VITE_APP_EMAIL}</span>
                                        <span><i className="bi bi-geo-alt"></i> {import.meta.env.VITE_APP_LOCATION}</span>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-6">
                                    {/* openeing hours*/}
                                    <div className={styles['opening_hours_info']}>
                                        <p>Opening Hours</p>
                                        <span>Weekdays: 24hrs</span>
                                        <span>Saturday: Close</span>
                                        <span>Sunday: Close</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-12 col-lg-6"> 
                            {/* contact form */}
                            <div className={styles['contact_form']}>
                                <form onSubmit={submitForm} method="post" className={styles['form']}>
                                    <ScrollFadeIn>
                                        <p className="m-0" style={{ color: 'darkcyan' }}>Your email address will not be published*</p>
                                        <p className={styles['send_message']}>Send us a message</p>
                                    </ScrollFadeIn>

                                    <div className="row my-5">
                                        <div className="form-group col-12 col-md-6 col-lg-6">
                                            <input onChange={handleInput} type="text" placeholder="Your name *" id="name" className="form-control" name="fullname" />
                                        </div>
                                        <div className="form-group col-12 col-md-6 col-lg-6">
                                            <input type="email" id="email" placeholder="Your E-mail*" onChange={handleInput} className="form-control" name="email" />
                                        </div>

                                        <div className="form-group my-4">
                                            <select name="subject" onChange={handleInput} id="subject" className="form-control">
                                                <option value="">Select a Subject *</option>
                                                <option value="Enquiry">Enquiry</option>
                                                <option value="Financial Advice">Financial Advice</option>
                                                <option value="Account Issues">Account Issues</option>
                                                <option value="Other Issues">Other Issues</option>
                                            </select>
                                        </div>

                                        {/* for captcha */}
                                        <div className="form-group col-12 col-md-12 col-lg-12 my-0">
                                            {question && (
                                                <>
                                                    <input type="text" onChange={handleInput} name="captcha" id="captcha" value={input.captcha} className="form-control" placeholder={question} />
                                                </>
                                            )}
                                        </div>

                                        <div className="form-group col-12 col-md-12 col-lg-12 my-4">
                                            <textarea name="message" onChange={handleInput} id="message" rows="5" placeholder="Type Your Message *" className="form-control"></textarea>
                                        </div>

                                        <div className="form-group">
                                            <button type="submit" className={styles['submit_button']}>Send Message</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* render google map here */}
                <div className="row my-5">
                    <GoogleMap />
                </div>
            </div>
        </>
    )
}

export default Contact;