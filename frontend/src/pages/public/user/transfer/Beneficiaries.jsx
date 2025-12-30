import { useEffect, useState } from 'react';
import styles from '../../../../assets/css/user/Beneficiaries.module.css';
import UnknownImg from '../../../../assets/images/avatar/unknown.jpeg';
import { Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';



const Beneficiaries = () => {

    // fetch every beneficiary and render every 5secs
    const [data, setData] = useState(null);
    const fetchBeneficiaries = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}fetch/beneficiaries.php`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            const request = await response.json();
            if (request.status === 'success') {
                setData(request.data);
            }

            else {
                setData(null);
                toast.error(request.message || 'Something went wrong', {toastId: 'something-error'});
            }
        }

        catch (error) {
            toast.error(error.message || 'Something went wrong', {toastId: 'network-error'});
            setData(null);
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchBeneficiaries();
        }, 4000)

        return () => clearInterval(intervalId);
    }, [])

    const copyRegNo = (regNo) => {
        try {
            navigator.clipboard.writeText(regNo);
            toast.info('Copied successfully', {toastId: 'success'});
        }

        catch (error) {
            toast.error('Something went wrong', {toastId: 'netwok-error'});
        }
    }

    const deleteBeneficiary = async (regId) => {
        const swalAlert = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Return',
            cancelButtonColor: 'lightcoral',
            confirmButtonColor: 'lightgreen',
            confirmButtonText: 'Proceed'
        })

        if (swalAlert.isConfirmed) {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}delete/beneficiary.php`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({ regId: regId })
                })

                const request = await response.json();
                if (request.status === 'success') {
                    toast.info('Beneficiary has been removed successfully', {toastId: 'success'})
                }

                else {
                    toast.error(request.message || 'Something went wrong', {toastId: 'something-error'});
                }
            }

            catch (error) {
                toast.error('Something went wrong', {toastId: 'network-error'});
            }
        }
    }

    return (
        <>
            <div className={styles['benediciary_container']}>
                <div className={styles['title']}>
                    <p>Saved Beneficiaries</p>
                </div>

                {/* for each container */}
                {data && data.length > 0 ? (
                    data.map((item) => (
                        <div className={styles['beneficiary-data']} key={item.id}>
                            <div className="row">
                                <div className="col-10 col-md-10 col-lg-10">
                                    <div className="d-flex">
                                        <div className={styles['bene_img']}>
                                            <img src={item.avatar && item.avatar.length > 1 ? import.meta.env.VITE_APP_AVATAR + item.avatar: UnknownImg} alt="_blank" />
                                        </div>
                                        <div className={`${styles['bene_name_account']} mx-3`}>
                                            <p>{item.fullname}</p>
                                            <p>{item?.reg_id}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2 col-md-2 col-lg-2">
                                    <Dropdown>
                                        <Dropdown.Toggle variant='normal'>
                                            <span className='bi bi-three-dots'></span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className={styles['dropdown_menu']}>
                                            <div>
                                                <p onClick={() => deleteBeneficiary(item.id)}>Remove <span className='bi bi-trash text-danger small'></span></p>
                                                <p onClick={() => copyRegNo(item.reg_id)}>Copy <span className='bi bi-copy text-secondary'></span></p>
                                            </div>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    ))
                ): (
                    <div className='alert alert-info'>
                        <span className='small text-center'>No beneficiaries found!</span>
                    </div>
                )}
            </div>
        </>
    )
}

export default Beneficiaries;