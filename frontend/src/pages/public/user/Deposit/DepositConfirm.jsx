import { useEffect, useState } from 'react';
import styles from '../../../../assets/css/user/Deposit.module.css';
import { useSearchParams } from 'react-router';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useCsrfToken } from '../../../../component/middleware/Csrf-token';

const DepositConfirm = () => {
    const [searchParam] = useSearchParams();
    const reference_id = searchParam.get('reference_id');
    const navigate = useNavigate();
    const { csrfToken, refreshCsrfToken } = useCsrfToken();

    // first check that the reference belongs to this user then fetch data
    const [depositDetails, setDepositDetails] = useState(null);
    const confirmReference = async() => {
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}fetch/check_deposit_eligibility.php?reference_id=${reference_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            if (!response.ok) {
                const errorMsg = await response.json();
                toast.error(errorMsg || `Server responded with status ${response.status}`);
            }

            const request = await response.json();
            if (request.status === 'success') {
                setDepositDetails(request.data);
            }

            else {
                if (request.redirect === 'true') {
                    toast.error("Something went wrong", {toastId: 'invalid form'});
                    navigate('/user/deposit');
                }

                else {
                    toast.error(request.message || "Something went wrong", {toastId: 'invalid form'});
                }
            }
        }

        catch (error) {
            toast.error("Something went wrong", {toastId: 'network error'});
        }
    }

    useEffect(() => {
        if (!reference_id || reference_id === '') {
            navigate('/user/deposit');
            toast.error('Unauthorized access');
        }
        document.title = `Confirm Deposit - ${import.meta.env.VITE_APP_NAME}`;
        confirmReference();
        refreshCsrfToken();
    }, [])

    // for amount format
    let formattedAmount = '';
    let rawAmount = '';

    if (depositDetails) {
        rawAmount = depositDetails.amount; // Store the original amount
        
        const numberFormatter = new Intl.NumberFormat('en-US', {
            style: 'decimal', 
            minimumFractionDigits: 2, 
        });

        formattedAmount = numberFormatter.format(rawAmount);
    }

    // button to toggle image upload
    const [imageUpload, setImageUpload] = useState(false);
    const [imageButton, setImageButton] = useState(false);
    const handleImageDisplay = () => {
        setImageButton(true)
        setTimeout(() => {
            setImageButton(false)
        }, 3000)
        setTimeout(() => {
            setImageUpload(true);
        }, 3000)
    }

    // for drag and drop of items
    const [screenshotFile, setScreenshotFile] = useState(null);
    const handleDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;

        if (files.length > 0) {
            setScreenshotFile(files[0]);
            toast.success(`File ready: ${files[0].name}`);
        }
    }

    const handleDragOver = (event) => {
        event.preventDefault();
    }

    const copyWalletAddress = async() => {
        const walletAddress = depositDetails.wallet_address;
        try {
            await navigator.clipboard.writeText(walletAddress);
            toast.success('Wallet address has been copied successfully', {toastId: 'Copy-success'});
        }

        catch(error) {
            toast.error('Something went wrong while copying wallet address', {toastId: 'copy-error'});
        }
    }

    const [disableBtn, setDisableBtn] = useState(false);
    
    const submitDepositForm = async(event) => {
        event.preventDefault();
        setDisableBtn(true);
        // check if image is empty
        if (!screenshotFile) {
            toast.warning('Payment proof image is missing. Upload the image file.', {toastId: 'empty-image'});
            setTimeout(() => {
                setDisableBtn(false);
            }, 2000)
            return;
        }
        const formData = new FormData();
        formData.append('screenshot_file', screenshotFile);
        formData.append('reference_id', reference_id);
        formData.append('tnx_id', depositDetails.txn_id);
        formData.append('amount', depositDetails.amount);
        formData.append('wallet_name', depositDetails.wallet_name);
        formData.append('wallet_address', depositDetails.wallet_address);
        formData.append('wallet', depositDetails.wallet);
        // formData.append
        const SwalAlert = await Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            html: `<p class="small">This process cannot be reversed</p>`,
            showCancelButton: true,
            cancelButtonColor: 'lightcoral',
            cancelButtonText: 'Cancel',
            confirmButtonColor: 'lightgreen',
            confirmButtonText: 'Proceed'
        })

        if (SwalAlert.isConfirmed) {
            try {
                const submitResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}insert/new_deposit.php`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'X-CSRF-Token': csrfToken
                    },
                    body: formData
                })

                const submitRequest = await submitResponse.json();
                if (!submitResponse.ok) {
                    toast.error(submitRequest.message || `Server responded with status ${submitResponse.status}`);
                    setTimeout(() => {
                        setDisableBtn(false);
                    }, 2000)
                }

                if (submitRequest.status === 'success') {
                    toast.success('Deposit Submitted! Awaiting verification', {toastId: 'deposit-success'});
                    navigate('/user/transaction');
                    setTimeout(() => {
                        setDisableBtn(false);
                    }, 2000)
                }

                else {
                    toast.error(submitRequest.message || 'Something went wrong');
                    setTimeout(() => {
                        setDisableBtn(false);
                    }, 2000)
                }
            }

            catch (error) {
                toast.error('Something went wrong!', {toastId: 'network-error'});
                setTimeout(() => {
                    setDisableBtn(false);
                }, 2000)
            }
        }
    }

    const cancelOperation = async() => {
        const SwalAlert = await Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            html: `<p class="small">Your current process may be lost!</p>`,
            showCancelButton: true,
            cancelButtonColor: 'lightcoral',
            cancelButtonText: 'No, stay',
            confirmButtonColor: 'lightgreen',
            confirmButtonText: 'Yes, quit'
        })

        if (SwalAlert.isConfirmed) {
            navigate('/user/deposit');
            toast.info('Deposit process has been cancelled successfully', {toastId: 'success'});
            return;
        }
    }


    return (
        <>
            {depositDetails && (
                <>
                    <div>
                        <p className={styles['page_title']}>Confirm Your Deposit</p>
                        <div className={styles['more_title']}>
                            <p>You are about to deposit  <span>{formattedAmount} USD</span> into your account</p>
                            <p>Please review the information and confirm.</p>
                            <p>TXN{depositDetails.txn_id}</p>
                        </div>
                    </div> 

                    {/* deposit_container */}
                    <div className={`${styles['confirm_deposit_container']}`}>
                        {/* payment metthod */}
                        <div className={`${styles['detail-card']}`}>
                            <p>Payment method</p>
                            <p className="coin-name"><span className='bi bi-wallet'></span> {depositDetails.wallet}</p> 
                        </div>

                        {/* selected currency */}
                        <div className={`${styles['detail-card']}`}>
                            <p>Selected currency</p>
                            <p className="coin-name"> {depositDetails.wallet_name}</p> 
                        </div>

                        {/* amount to be deposited */}
                        <div className={`${styles['detail-card']}`}>
                            <p>Amount to deposit</p>
                            <p className="coin-name">{formattedAmount} USD</p> 
                        </div>

                        {/* wallet address and title */}
                        <div className={`${styles['deposit_wallet_title']}`}>
                            <p>WALLET ADDRESS</p>
                            <div className="input-group">
                                <input type="text" value={depositDetails.wallet_address} name="" readOnly className='form-control' id="" />
                                <button type="button" onClick={copyWalletAddress} className='input-text btn btn-normal bi bi-copy'></button>
                            </div>
                            <span><i className='bi bi-info-circle'></i> Note: Kindly copy and pay to the wallet address provided above <i className='bi bi-hand-index'></i></span>

                            <span className='d-block'><i className='bi bi-info-circle'></i> Account will be credited once we receive your payment.</span>
                        </div>

                        {/* proceed button */}
                        <div className={imageUpload ? `d-none`: `${styles['proceed_text_button']}`}>
                            <button disabled={imageButton} type="button" className='form-control' onClick={handleImageDisplay}>{ imageButton ? `Processing...`: `Confirm` }</button>
                            <button type='button' onClick={cancelOperation}>Cancel</button>
                        </div>


                        {/* for image upload */}
                        <div className={imageUpload ? `${styles['deposit_upload']} py-5`: `d-none`}>
                            <form onSubmit={submitDepositForm}>
                                <div className={styles['top_row']}>
                                    <label htmlFor="click_area">{screenshotFile ? `File Selected: ${screenshotFile.name}` : `Click to upload screenshot of payment`}</label>
                                    <input onChange={(e) => setScreenshotFile(e.target.files[0])} onDragOver={handleDragOver} onDrop={handleDrop} accept='image/*' type="file" name="screenshot_file" id="click_area" />

                                    <p style={{marginTop: '1rem', color: 'lightcoral', fontSize: '13px'}}>
                                        For fastest verification, please upload a screenshot of your successful transaction. This helps ensure your payment is credited quickly and accurately.
                                    </p>
                                </div>

                                <div className={`form-group my-1 ${styles['accept-terms']}`}>
                                    <input type="checkbox" required className='text-primary' name="terms" id="terms" />
                                    <label htmlFor="terms" className='small mx-3'>I agree to the <span>Terms of Service</span> and <span>Privacy Policy</span></label>
                                </div>
                                
                                <button disabled={disableBtn} type="submit" className='form-control btn btn-primary'>{disableBtn ? 'Processing Deposit...': 'Confirm Deposit'}</button>

                            </form>
                            
                        </div>
                        
                    </div>
                </>
            )}
        </>
    )
}

export default DepositConfirm;