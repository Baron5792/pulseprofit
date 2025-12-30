import { useEffect } from 'react';
import styles from '../../assets/css/Faq.module.css';
import faqImg from '../../assets/images/featured/Faq.png';
import ScrollFadeIn from '../../component/public/ScrollFadeIn';
import Accordion from 'react-bootstrap/Accordion';
import { NavLink } from 'react-router';
import faqAnne from '../../assets/images/featured/faq_anne.png'
import GoogleTranslateCustom from '../../component/public/Translator';

const Faq = () => {
    useEffect(() => {
        document.title = `FAQ - ${import.meta.env.VITE_APP_NAME}`;
    })
    return (
        <>
            <div className={styles['hero_container']}>
                <div className={styles['hero_img']}>
                    <img src={faqImg} alt="_blank" />
                </div>
                <div className={styles['hero_text']}>
                    <p>Hi, Do you have any questions ?</p>
                    <ScrollFadeIn>
                        <div className={styles['tiny-line']}></div>
                    </ScrollFadeIn>
                    <div>
                        <GoogleTranslateCustom />
                    </div>
                </div>
            </div>


            {/* faq title */}
            <div className={styles['title']}>
                <p>Here are some Frequently Asked Questions</p>
            </div>

            {/* list of FAQs */}
            <div className="container">
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header className={styles['accordion_title']}>How do I get started?</Accordion.Header>
                        <Accordion.Body>
                            <p className={styles['accordion_text']}>Getting Started on {import.meta.env.VITE_APP_NAME} Technology is pretty easy Simply visit the website at <NavLink to={'/account/register'}>www.thepulseprofit.org</NavLink> You’ll need to provide a valid email as this is necessary to receive updates to your account. Kindly save your username and password as this would be necessary whenever you need to log into your account. A Google authenticator can also be setup for added account security.</p>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header className={styles['accordion_title']}>How do I Deposit?</Accordion.Header>
                        <Accordion.Body>
                            <p className={styles['accordion_text']}>You simply log into your account and click on the deposit section of your dashboard. You would be required to input the deposit amount and send your request. A payment gateway (wallet address, account number etc) would be generated for you up. Kindly post your deposit to the generated payment gateway. Kindly note that you would be required to carry out this process for every deposit individually as a new payment gateway is usually generated every other time.</p>
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2">
                        <Accordion.Header className={styles['accordion_title']}>How to withdraw?</Accordion.Header>
                        <Accordion.Body>
                            <p className={styles['accordion_text']}>Withdrawals are carried out anytime during the week but preferably from Fridays to Sundays after the week’s trading activities. To withdraw you simply log into your account and click on the withdrawal section of your dashboard. You would be required to input the withdrawal amount, payment gateway (wallet address, account number etc) and send your request. It’s important to make sure your payment gateway is correct, to prevent a wrong payment gateway. Withdrawals can be carried out from Tuesday to Friday (preferably on Fridays). Weekly profit ONLY can be withdrawn for regular packages. While total sum withdrawal can apply for contract packages. Contact your Portfolio manager for more details on this</p>
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="3">
                        <Accordion.Header className={styles['accordion_title']}>What are Bitcoin Wallets?</Accordion.Header>
                        <Accordion.Body>
                            <p className={styles['accordion_text']}>Note that a bitcoin exchange is different from a bitcoin wallet. While the former offers a platform through which bitcoin buyers and sellers can transact with each other, the latter is simply a digital storage service for bitcoin holders to store their coins securely. To be more technical, bitcoin wallets store private keys which are used to authorize transactions and access the bitcoin address of a user. Most bitcoin exchanges provide bitcoin wallets for their users, but may charge a fee for this service.</p>
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="4">
                        <Accordion.Header className={styles['accordion_title']}>Are there any fees?</Accordion.Header>
                        <Accordion.Body>
                            <p className={styles['accordion_text']}>Making deposits and withdrawals comes at a price, depending on the payment method chosen to transfer funds. The higher the risk of a chargeback from a payment medium, the higher the fee. Making a bank draft or wiring money to the exchange has a lesser risk of a chargeback compared to funding your account with PayPal or a credit/debit card where the funds being transferred can be reversed and returned to the user upon request to the bank. In addition to transaction fees and funds transfer fees, traders may also be subject to currency conversion fees, depending on the currencies that are accepted by the bitcoin exchange. If a user transfers Canadian dollars to an exchange that only deals in U.S. dollars, the bank or the exchange will convert the CAD to USD for a fee. Transacting with an exchange that accepts your local currency is the best way to avoid the FX fee. All bitcoin exchanges have transaction fees that are applied to each completed buy and sell order carried out within the exchange. The fee rate is dependent on the volume of bitcoin transactions that is conducted.</p>
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="5">
                        <Accordion.Header className={styles['accordion_title']}>What Are Token Swaps?</Accordion.Header>
                        <Accordion.Body>
                            <p className={styles['accordion_text']}>A token swap has two distinct definitions within the crypto sphere. The first connotes the process of instantaneously exchanging one cryptocurrency to another without having to first undertake a crypto-to-fiat exchange. This definition encapsulates the workings of prominent platforms like Changelly, Shapeshift and Airswap. On the other hand, the second definition of token swap revolves around the migration of projects or platforms from one blockchain to another and the coin swapping requirements that often accompany such a move. In this case, a project has for one reason or the other chosen to switch its operation base to another blockchain with unique token standards. As such, the development team must provide the means for investors and users to swap the project’s native token to another token that is compatible with the new blockchain network. The process involved is what we call token swapping or token migration.</p>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>

            <div className={styles['load_container']}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-5">
                            <div className={styles['faq_featured']}>
                                <img src={faqAnne} alt="_blank" />
                            </div>
                        </div>
                        <div className="col-12 col-md-12 col-lg-7">
                            <div className={styles['lead_title']}>
                                <p>Anne Maria</p>
                                <p>Lead Director</p>
                            </div>
                            <div className={styles['lead_info']}>
                                <p>"A secure Future Must be invested, Wtih {import.meta.env.VITE_APP_NAME} you can secure your future and that of your loved ones".</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Faq;