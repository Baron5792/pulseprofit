import styles from '../../../../assets/css/user/EveryProfile.module.css';
import { useEffect, useState } from "react";
import { useUser } from '../../../../component/middleware/Authentication';
import { Modal } from 'react-bootstrap';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { useCsrfToken } from '../../../../component/middleware/Csrf-token';

const Profile = () => {
    const { user, refreshUser } = useUser();
    const [personalModal, setPersonalModal] = useState(false);
    const { csrfToken, refreshCsrfToken } = useCsrfToken();
    

    const closePersonalModal = () => {
        setPersonalModal(false);
    }

    // max date
    // Helper function to get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        // Month is 0-indexed, so add 1 and pad with 0 if single digit
        const month = String(today.getMonth() + 1).padStart(2, '0');
        // Day
        const day = String(today.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    };

    // Use useMemo to calculate the max date once on component mount
    const maxDate = useMemo(() => getTodayDate(), []);

    useEffect(() => {
        document.title = `Profile Info - ${import.meta.env.VITE_APP_NAME}`;

        refreshCsrfToken();

        const intervalId = setInterval(() => {
            refreshUser();
        }, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [])

    // handle personal input
    const [personalInfo, setPersonalInfo] = useState({
        fullname: '',
        username: '',
        phone: '',
        telegram: '',
        gender: 'Male',
        date_of_birth: '',
    })

    const openPersonalModal = () => {
        if (user) {
            setPersonalInfo({
                fullname: user.fullname || '',
                username: user.username || '',
                phone: user.phone || '',
                telegram: user.telegram || '',
                gender: user.gender || 'Male',
                date_of_birth: user.date_of_birth || ''
            })
        }
        setPersonalModal(true);
    }

    const requiredFields = ['fullname', 'username', 'phone']

    const handlePersonalInput = (event) => {
        const { name, value } = event.target;
        setPersonalInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const updatePersonalData = async(event) => {
        event.preventDefault();
        const isEmpty = requiredFields.some(value => personalInfo[value].trim() === '');
        if (isEmpty) {
            toast.warning('Every required field must not be empty');
            return;
        }

        // update personal info
        try {
            const requestUpdatePersonal = await fetch (`${import.meta.env.VITE_APP_API_URL}update/profile.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify(personalInfo)
            });

            const responseUpdatePersonal = await requestUpdatePersonal.json();
            if (responseUpdatePersonal.status === 'success' && requestUpdatePersonal.ok) {
                toast.success(responseUpdatePersonal.message ||"Your personal Info has been updated successfully");
                setPersonalModal(false);
                refreshUser();
            }

            else {
                toast.error(responseUpdatePersonal.message || "An error occured while updating profile");
            }
        }

        catch (error) {
            toast.error('Network error');
        }
    }


    // for address modal
    const [AddressModal, setAddressModal] = useState(false);
    const [addressInput, setAddressInput] = useState({
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        nationality: ''
    })
    const openAddressModal = () => {
        setAddressModal(true);
        if (user) {
            setAddressInput({
                address1: user.address1 || '',
                address2: user.address2 || '',
                city: user.city || '',
                state: user.state || '',
                zipcode: user.zipcode || '',
                country: user.zipcode || '',
                nationality: user.nationality || ''
            })
        }
    }

    const handleAddressInput = (event) => {
        const { name, value } = event.target;
        setAddressInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const closeAddressModal = () => {
        setAddressModal(false);
    }

    const addressRequired = ['address1', 'state', 'country'];
    const handleUpdateAddress = async (event) => {
        event.preventDefault();
        const checkEmpty = addressRequired.some(value => addressInput[value].trim() === '');
        if (checkEmpty) {
            toast.warning("All required fields are required to proceed");
            return;
        }

        // submit 
        try {
            const requestUpdateAddress = await fetch (`${import.meta.env.VITE_APP_API_URL}update/address.php`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(addressInput)
            })
            const responseAddressUpdate = await requestUpdateAddress.json();
            if (responseAddressUpdate.status === 'success') {
                toast.success(responseAddressUpdate.message || "Your address has been updated successfully");
                refreshUser();
                setAddressModal(false);
            }

            else {
                toast.error(responseAddressUpdate.message || "An error occured while updating your profile");
                refreshCsrfToken();
            }
        }

        catch (error) {
            toast.error('Network error');
            refreshCsrfToken();
        }
    }


    return (
        <>
            {/* profile top */}
            <div className={`${styles['profile_top']}`}>
                <p>Personal Information</p>
                <p>Basic info, like your name and address, that you use on our platform.</p>
            </div>

            {/* relay container for details */}
            <div className={`${styles['profile_main_container']}`}>
                {/* for each row */}
                {/* fullname */}
                <div className={styles['data_row']} onClick={openPersonalModal}>
                    <div className="row">
                        <div className="col-9 col-md-9 col-lg-7">
                            <div className={styles['first_row']}>
                                <p>Full Name</p>
                                {user && (
                                    <p>{user.fullname}</p>
                                )}
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-5">
                            <p className={styles['second_row']}>
                                <span className='bi bi-chevron-right'></span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* username */}
                <div className={styles['data_row']} onClick={openPersonalModal}>
                    <div className="row">
                        <div className="col-9 col-md-9 col-lg-7">
                            <div className={styles['first_row']}>
                                <p>Username</p>
                                {user && user.username && user.username.length > 0 ? (
                                    <p>{user.username}</p>
                                ): (
                                    <p>Not added yet</p>
                                )}
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-5">
                            <p className={styles['second_row']}>
                                <span className='bi bi-chevron-right'></span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* email */}
                <div className={styles['data_row']} >
                    <div className="row">
                        <div className="col-9 col-md-9 col-lg-7">
                            <div className={styles['first_row']}>
                                <p>Email</p>
                                {user && user.email && user.email.length > 0 ? (
                                    <p>{user.email}</p>
                                ): (
                                    <p>NULL</p>
                                )}
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-5">
                            <p className={styles['second_row']}>
                                <span className='bi bi-lock'></span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* phone number */}
                <div className={styles['data_row']}  onClick={openPersonalModal}>
                    <div className="row">
                        <div className="col-9 col-md-9 col-lg-7">
                            <div className={styles['first_row']}>
                                <p>Phone Number</p>
                                {user && user.phone && user.phone.length > 0 ? (
                                    <p>{user.phone}</p>
                                ): (
                                    <p>NULL</p>
                                )}
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-5">
                            <p className={styles['second_row']}>
                                <span className='bi bi-chevron-right'></span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* telegram */}
                <div className={styles['data_row']}  onClick={openPersonalModal}>
                    <div className="row">
                        <div className="col-9 col-md-9 col-lg-7">
                            <div className={styles['first_row']}>
                                <p>Telegram</p>
                                {user && user.telegram && user.telegram.length > 0 ? (
                                    <p>{user.telegram && user.telegram.length > 30 ? (
                                        user.telegram.slice(0, 30) + '...'
                                    ): (
                                        user.telegram
                                    )}</p>
                                ): (
                                    <p>Not added yet</p>
                                )}
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-5">
                            <p className={styles['second_row']}>
                                <span className='bi bi-chevron-right'></span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Gender */}
                <div className={styles['data_row']}  onClick={openPersonalModal}>
                    <div className="row">
                        <div className="col-9 col-md-9 col-lg-7">
                            <div className={styles['first_row']}>
                                <p>Gender</p>
                                {user && user.gender && user.gender.length > 0 ? (
                                    <p>{user.gender}</p>
                                ): (
                                    <p>NULL</p>
                                )}
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-5">
                            <p className={styles['second_row']}>
                                <span className='bi bi-chevron-right'></span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Date of Birth */}
                <div className={styles['data_row']}  onClick={openPersonalModal}>
                    <div className="row">
                        <div className="col-9 col-md-9 col-lg-7">
                            <div className={styles['first_row']}>
                                <p>Date of Birth</p>
                                {user && user.date_of_birth && user.date_of_birth.length > 0 ? (
                                    <p>{user.date_of_birth}</p>
                                ): (
                                    <p>NULL</p>
                                )}
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-5">
                            <p className={styles['second_row']}>
                                <span className='bi bi-chevron-right'></span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* country */}
                <div className={styles['data_row']} onClick={openAddressModal}>
                    <div className="row">
                        <div className="col-9 col-md-9 col-lg-7">
                            <div className={styles['first_row']}>
                                <p>Country</p>
                                {user && user.country && user.country.length > 0 ? (
                                    <p>{user.country}</p>
                                ): (
                                    <p>Not added yet    </p> 
                                )}
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-5">
                            <p className={styles['second_row']}>
                                <span className='bi bi-chevron-right'></span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* address */}
                <div className={styles['data_row']} onClick={openAddressModal}>
                    <div className="row">
                        <div className="col-9 col-md-9 col-lg-7">
                            <div className={styles['first_row']}>
                                <p>Address</p>
                                {user && user.address1 && user.address1.length > 0 ? (
                                    <p>{user.address1}</p>
                                ): (
                                    <p>Not added yet</p> 
                                )}
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-5">
                            <p className={styles['second_row']}>
                                <span className='bi bi-chevron-right'></span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>



            {/* modal for personal info */}
            <Modal show={personalModal} className='modal-lg'>
                <Modal.Title>
                    <div className='d-flex justify-content-between py-2 px-4'>
                        <p className={`${styles['personal_modal_title']} mt-3`}>Update Profile</p>
                        <button type="button" onClick={closePersonalModal} className='btn btn-normal bi bi-x fs-4 text-secondary'></button>
                    </div>
                </Modal.Title>
                <Modal.Body>
                    <div className='py-2 px-4'>
                        <form action="" method="post" onSubmit={updatePersonalData}>
                            <div className="row">
                                {/* fullname */}
                                <div className={`${styles['form-group']} form-group col-12 col-md-6 col-lg-6`}>
                                    <label htmlFor="fullname">Full Name <span className='text-danger'>*</span></label>
                                    {user && (
                                        <input type="text" value={personalInfo.fullname} onChange={handlePersonalInput} name="fullname" className='form-control' id="" />
                                    )}
                                </div>

                                {/* username */}
                                <div className={`${styles['form-group']} form-group col-12 col-md-6 col-lg-6`}>
                                    <label htmlFor="username">Username <span className='text-danger'>*</span></label>
                                    {user && (
                                        <input type="text" onChange={handlePersonalInput} value={personalInfo.username} name="username" className='form-control' id="" />
                                    )}
                                </div>

                                {/* phone number */}
                                <div className={`${styles['form-group']} form-group col-12 col-md-6 col-lg-6`}>
                                    <label htmlFor="phone">Phone Number <span className='text-danger'>*</span></label>
                                    {user && (
                                        <input type="tel" onChange={handlePersonalInput} value={personalInfo.phone} placeholder='Enter phone number' name="phone" className='form-control' id="" />
                                    )}
                                </div>

                                {/* telegram */}
                                <div className={`${styles['form-group']} form-group col-12 col-md-6 col-lg-6`}>
                                    <label htmlFor="telegram">Telegram</label>
                                    {user && (
                                        <input type="text" onChange={handlePersonalInput} value={personalInfo.telegram} name="telegram" className='form-control' id="" />
                                    )}
                                </div>

                                {/* gender */}
                                <div className={`${styles['form-group']} form-group col-12 col-md-6 col-lg-6`}>
                                    <label htmlFor="gender">Gender</label>
                                    {user && (
                                        <select name="gender" onChange={handlePersonalInput} className='form-control' id="">
                                            {user && user.gender.length > 0 ? (
                                                <option value={personalInfo.gender}>{personalInfo.gender}</option>
                                            ): (
                                                null
                                            )}
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Others">Others</option>
                                        </select>
                                    )}
                                </div>

                                {/* date of birth */}
                                <div className={`${styles['form-group']} form-group col-12 col-md-6 col-lg-6`}>
                                    <label htmlFor="dob">Date of birth</label>
                                    {user && (
                                        <input max={maxDate} onChange={handlePersonalInput} value={personalInfo.date_of_birth} type="date" name="date_of_birth" className='form-control' id="" />
                                    )}
                                </div>

                                {/* submit modal */}
                                <div className={`${styles['form-group']} form-group col-12 col-md-6 col-lg-6`}>
                                    <button type='submit'>Update Profile</button>
                                </div>
                            </div>  
                        </form>
                    </div>
                </Modal.Body>
            </Modal>


            {/* modal for address profile */}
            <Modal show={AddressModal} className='modal-lg'>
                <Modal.Title>
                    <div className='d-flex justify-content-between py-2 px-4'>
                        <p className={`${styles['personal_modal_title']} mt-3`}>Update Address</p>
                        <button type="button" onClick={closeAddressModal} className='btn btn-normal bi bi-x fs-4 text-secondary'></button>
                    </div>
                </Modal.Title>
                <Modal.Body>
                    <div className='py-2 px-4'>
                        <form action="" method="post" onSubmit={handleUpdateAddress}>
                            <div className="row">
                                {/* address line 1 */}
                                <div className={`${styles['form-group']} form-group col-12 col-md-6 col-lg-6`}>
                                    <label htmlFor="address1">Address Line 1 <span className='text-danger'>*</span></label>
                                    <input type="text" onChange={handleAddressInput} value={addressInput.address1} name="address1" className='form-control' id="" />
                                </div>

                                {/* address line 2 */}
                                <div className={`${styles['form-group']} form-group col-12 col-md-6 col-lg-6`}>
                                    <label htmlFor="address2">Address Line 2</label>
                                    <input type="text" value={addressInput.address2} onChange={handleAddressInput}  name="address2" className='form-control' id="" />
                                </div>

                                {/* city */}
                                <div className={`${styles['form-group']} form-group col-12 col-md-6 col-lg-6`}>
                                    <label htmlFor="city">City</label>
                                    <input type="text" value={addressInput.city} onChange={handleAddressInput}  name="city" className='form-control' id="" />
                                </div>

                                <div className="col-12 col-md-12 col-lg-6">
                                    <div className="row">
                                        {/* state/province */}
                                        <div className={`${styles['form-group']} form-group col-6 col-md-6 col-lg-6`}>
                                            <label htmlFor="state">State / Province <span className='text-danger'>*</span></label>
                                            <input type="text" value={addressInput.state} onChange={handleAddressInput}  name="state" className='form-control' id="" />
                                        </div>

                                        {/* zip/postal code */}
                                        <div className={`${styles['form-group']} form-group col-6 col-md-6 col-lg-6`}>
                                            <label htmlFor="zipcode">Zip / Postal Code</label>
                                            <input type="text" value={addressInput.zipcode} onChange={handleAddressInput}  name="zipcode" className='form-control' id="" />
                                        </div>
                                    </div>
                                </div>

                                {/* Country */}
                                <div className={`${styles['form-group']} form-group col-12 col-md-6 col-lg-6`}>
                                    <label htmlFor="country">Country (<span className='small text-secondary'>Residential</span>) <span className='text-danger'>*</span></label>
                                    <input type="text" value={addressInput.country} onChange={handleAddressInput}  name="country" className='form-control' id="" />
                                </div>

                                {/* nationality */}
                                <div className={`${styles['form-group']} form-group col-12 col-md-6 col-lg-6`}>
                                    <label htmlFor="nationality">Nationality (<span className='small text-secondary'>Citizenship</span>)</label>
                                    <input type="text" value={addressInput.nationality} onChange={handleAddressInput}  name="nationality" className='form-control' id="" />
                                </div>

                                {/* submit modal */}
                                <div className={`${styles['form-group']} form-group col-12 col-md-6 col-lg-6`}>
                                    <button type='submit'>Update Address</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Profile;