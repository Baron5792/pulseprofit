import { useEffect, useState } from 'react';
import styles from '../../assets/css/admin/Dashboard.module.css';
import DashboardOverview from '../../component/admin/DasboardOverview';
import { toast } from 'react-toastify';
import { Dropdown, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import unknownImg from '../../assets/images/avatar/unknown.jpeg'

const ManageUsers = () => {
    // fetch all users
    const [users, setUsers] = useState(null);
    const fetchUsers = async() => {
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}admin/fetch/users.php`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const request = await response.json();
            if (request.status === 'success') {
                setUsers(request.data);
            }

            else {
                toast.error('Something went wrong', {toastId: 'error'});
                setUsers(null)
            }
        }

        catch (error) {
            toast.error('Something went wrong', {toastId: 'network error'});
            setUsers(null);
        }
    } 

    const [creditModal, setCreditModal] = useState(false);

    const [user, setUser] = useState(null);

    const closeCreditModal = () => {
        setCreditModal(false);
        setUser(null);
    }

    const openCreditModal = async(userId) => {
        setCreditModal(true);
        try {
            // fetch currenct users balance
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}admin/update/credit_user.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: userId })
            })

            const request = await response.json();
            if (request.status === 'success') {
                setUser(request.data);
            }

            else {
                setUser(null);
                setCreditModal(false);
                toast.error('Something went wrong', {toastId: 'error'});
            }
        }

        catch (error) {
            toast.error('Network error', {toastId: 'network-error'});
        }
    }

    const [formData, setFormData] = useState({
        credit_amount: '',
    })

    const handleCreditInput = (e) => {
        const { name, value } =  e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCreditForm = async(userId, event) => {
        event.preventDefault();

        const SwalAlert = await Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            html: '<p class="small">Value would be added to the users balance immediately</p>',
            showCancelButton: true,
            cancelButtonColor: 'lightcoral',
            cancelButtonText: 'No, cancel',
            confirmButtonColor: 'lightgreen',
            confirmButtonText: 'Yes, proceed'
        })

        if (SwalAlert.isConfirmed) {

            try {
                const response = await fetch (`${import.meta.env.VITE_APP_API_URL}admin/update/credit_balance.php`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({ credit_amount: formData.credit_amount, userId: userId })
                })

                const request = await response.json();
                if (request.status === 'success') {
                    toast.success('Amount has been incremented successfully', {toastId: 'success'});
                    setCreditModal(false);
                    setUser(null);
                    fetchUsers();
                }

                else {
                    toast.error('Something went wrong', {toastId: 'error'});
                }
            }

            catch (error) {
                toast.error('Something went wrong', {toastId: 'network error'});
            }
        }
    }


    // handle modal for edit user
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editUserData, setEditUserData] = useState(null);
    const editUserModal = async(userId) => {
        setOpenEditModal(true);
        try {
            // fetch users data
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}admin/fetch/users_data.php?userId=${userId}`, {
                method: 'GET',
                credentials: 'include', 
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const request = await response.json();
            if (request.status === 'success') {
                setEditUserData(request.data);
            }

            else {
                setOpenEditModal(false);
                setEditUserData(null);
                toast.error('Something went wrong', {toastId: 'error'});
            }
        }

        catch (error) {
            toast.error('Something went wrong', {toastId: 'network error'});
        }

    }

    const closeEditModal = () => {
        setOpenEditModal(false);
    }

    const [editForm, setEditForm] = useState({
        fullname: '',
        email: '',
        interest: '',
        admin: '0'
    })

    const handleEditInput = (event) => {
        const { name, value } = event.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const formatCurrency = (amount) => {
        // 1. Convert the input to a number first, just in case it's a string
        const numericAmount = parseFloat(amount); 
        
        // 2. Check if the conversion resulted in a valid number
        if (isNaN(numericAmount)) {
            return 'N/A'; // Return a safe string instead of a crash/NaN
        }

        // 3. Perform the formatting
        const numberFormatter = new Intl.NumberFormat('en-US', {
            style: 'decimal', 
            minimumFractionDigits: 2, 
        });

        return numberFormatter.format(numericAmount);
    };
    
    useEffect(() => {
        document.title = `Manage Users - ${import.meta.env.VITE_APP_NAME}`;
        fetchUsers();

        if (editUserData) {
            // setEditUserData(null);
            setEditForm({
                fullname: editUserData.fullname || '',
                email: editUserData.email || '',
                admin: editUserData.admin || '',
                interest: editUserData.interest || ''
            })
        }
    }, [editUserData])

    const handleEditForm = async(event) => {
        event.preventDefault();
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}admin/update/update_user.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editForm)
            })

            const request = await response.json();
            if (request.status === 'success') {
                toast.success('User has been updated successful', {toastId: 'success'});
                fetchUsers();
                setOpenEditModal(false);
            }

            else {
                toast.error(request.message || "Something went wrong", {toastId: 'something error'});
            }
        }

        catch (error) {
            toast.error('Something went wrong', {toastId: 'network-error'});
        }
    }


    // for debit user
    const [debitModal, setDebitModal] = useState(false);
    const [debitData, setDebitData] = useState(null);
    const openDebitModal = async(userId) => {
        setDebitModal(true);
        // fetch users data
        try {
            // fetch users data
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}admin/fetch/users_data.php?userId=${userId}`, {
                method: 'GET',
                credentials: 'include', 
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const request = await response.json();
            if (request.status === 'success') {
                setDebitData(request.data);
            }

            else {
                setDebitModal(false);
                setDebitData(null);
                toast.error('Something went wrong', {toastId: 'error'});
            }
        }

        catch (error) {
            toast.error('Something went wrong', {toastId: 'error'});
        }
    }

    const closeDebitModal = () => {
        setDebitModal(false);
    }

    const [debitInput, setDebitInput] = useState({
        debit_amount: ''
    })

    const handleDebitInput = (event) => {
        const { name, value } = event.target;
        setDebitInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleDebitForm = async (userId, event) => {
        event.preventDefault();
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}admin/update/debit_user.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: debitInput.debit_amount,
                    userId: userId
                })
            })

            const request = await response.json();
            if (request.status === 'success') {
                toast.success('User has been debited successfully', {toastId: 'success'});
                setDebitModal(false);
                fetchUsers();
            }

            else {
                toast.error(request.message || 'Something went wrong', {toastId: 'something error'});
            }
        }

        catch (error) {
            toast.error('Something went wrong', {toastId: 'network-error'});
        }
    }


    // handle delete user
    const deleteUser = async (userId) => {
        const SwalAlert = await Swal.fire({
            icon: 'warning',
            title: 'Are you sure ?',
            html: '<p class="small">This user would be permanently deleted and unreachable</p>',
            showCancelButton: true,
            cancelButtonColor: 'lightcoral',
            cancelButtonText: 'No, cancel',
            confirmButtonColor: 'lightgreen',
            confirmButtonText: 'Yes, delete'
        })

        if (SwalAlert.isConfirmed) {
            try {
                const response = await fetch (`${import.meta.env.VITE_APP_API_URL}admin/delete/user.php`, {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({ userId: userId }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const request = await response.json();
                if (request.status === 'success') {
                    toast.success('User has been deleted successfully', {toastId: 'success'});
                    fetchUsers();
                }

                else {
                    toast.error('Something went wrong', {toastId: 'something went wrong'});
                }
            }

            catch(error) {
                toast.error('Something went wrong', {toastId: 'network-error'});
            }
        }
    }


    // view users complete details
    const [info, setInfo] = useState(null);
    const [infoModal, setInfoModal] = useState(false);
    const viewDetails = async(userId) => {
        setInfoModal(true);
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}admin/fetch/users_every_details.php?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            const request = await response.json();
            if (request.status === 'success') {
                setInfo(request.data);
            }

            else {
                setInfo(null);
                setInfoModal(false);
                toast.error(request.message || 'Something went wrong', {toastId: 'something-error'});
            }
        }

        catch (error) {
            setInfo(null);
            setInfoModal(false);
            toast.error('Network error', {toastId: 'network-error'});
        }
    }

    const closeInfoModal = () => {
        setInfoModal(false);
    }



    // for change password
    const [changeModal, setChangeModal] = useState(false);
    const [changeUserId, setChangeUserId] = useState(null);
    const openChangeMoal = (userId) => {
        setChangeModal(true);
        setChangeUserId(userId)
    }

    
2
    const [changeInput, setChangeInput] = useState({
        password: ''
    })

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setChangeInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleChangeForm = async(userId, event) => {
        event.preventDefault();
        const isEmpty = Object.values(changeInput).some(value => value.trim() === '');
        if (isEmpty) {
            toast.warning('Empty field found');
            return;
        }

        const SwalAlert = await Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            confirmButtonColor: 'lightgreen',
            confirmButtonText: 'Yes, proceed',
            showCancelButton: true,
            cancelButtonColor: 'lightcoral',
            cancelButtonText: 'No, cancel'
        })

        if (SwalAlert.isConfirmed) {
            try {
                const response = await fetch (`${import.meta.env.VITE_APP_API_URL}admin/update/change-password.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        new_password: changeInput.password,
                        userId: userId
                    })
                })

                const request = await response.json();
                if (request.status === 'success') {
                    toast.success('Password has been changed successfully', {toastId: 'success'});
                    setChangeModal(false);
                    setChangeInput({
                        password: ''
                    })
                }

                else {
                    toast.error(request.message || 'Something went wrong', {toastId: 'something-error'})
                }
            }

            catch (error) {
                toast.error('Something went wrong', {toastId: 'network-failed'});
            }
        }
    }

    const closeChangeModal = () => {
        setChangeModal(false);
        setChangeUserId(null);
        setChangeInput({
            password: '' 
        })
    }



    // for transacttion details
    const [transactionModal, setTransactionModal] = useState(false);
    const [transactionData, setTransactionData] = useState(null);
    const openTransactionModal = async(userId) => {
        setTransactionModal(true);
        // fetch users transaction details
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}admin/fetch/recent_transactions.php?userId=${userId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const request = await response.json();
            if (request.status === 'success') {
                setTransactionData(request.data);
            }

            else {
                setTransactionModal(false);
                setTransactionData(null);
                toast.error('Something went wrong', {toastId: 'something-error'});
            }
        }

        catch (error) {
            toast.error('Something went wrong', {toastId: 'network-error'});
        }
    }

    return (
        <>
            {/*  */}
            <div className={`${styles['page_title']}`}>
                <p>Manage Users</p>
            </div>

            <div className='mb-5'>
                <DashboardOverview />
            </div>

            {/* users table */}
            <div className={styles['table_container']}>
                <table className={styles['deposit_table']}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Full Name <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th>@ <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th>Email <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th>Phone <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th>Balance <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th>Interest <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.length > 0 ? (
                            users.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item?.fullname}</td>
                                    <td>{item?.username && item.username.length > 10 ? item.username.slice(0, 10) + '...': item.username}</td>
                                    <td>{item?.email}</td>
                                    <td>{item.phone ? item.phone : 'NULL'}</td>
                                    <td>${item?.balance}</td>
                                    <td>${item?.interest}</td>
                                    <td>
                                        <Dropdown>
                                            <Dropdown.Toggle variant='normal'>
                                                <span className='bi bi-three-dots'></span>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className={styles['dropdown_menu']}>
                                                <p onClick={() => editUserModal(item.id)}><span className='bi bi-pen'></span> Edit user</p>

                                                <p onClick={() => deleteUser(item.id)}><span className='bi bi-trash'></span> Delete</p>

                                                <p onClick={() => openCreditModal(item.id)}><span className='bi bi-plus-circle'></span> Credit user</p>

                                                <p onClick={() => openDebitModal(item.id)}><span className='bi bi-dash-circle'></span> Debit user</p>

                                                <p onClick={() => viewDetails(item.id)}><span className='bi bi-eye'></span> View details</p>

                                                <p onClick={() => openChangeMoal(item.id)}><span className='bi bi-key'></span> Change password</p>

                                                <p onClick={() => openTransactionModal(item.id)}><span className='bi bi-file-text'></span> Recent Transactions</p>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                </tr>
                            ))
                        ): (
                            <tr>
                                <td colSpan={9}>No data found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            {/* credit amount modal */}
            {user && (
                 <Modal show={creditModal} className='modal-lg'>
                    <Modal.Title>
                        <div className={styles['modal_title']}>
                            <p>Credit User</p>
                            <button onClick={closeCreditModal} type="button" className='btn btn-normal bi bi-x'></button>
                        </div>
                    </Modal.Title>
                    <Modal.Body>
                        <div className={styles['modal_body']}>
                            <div className={styles['modal_details']}>
                                <p>Full Name</p>
                                <p>{user?.fullname}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>E-Mail</p>
                                <p>{user?.email}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Current Balance</p>
                                <p>$ {formatCurrency(user?.balance)}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Credit Amount</p>
                                <form onSubmit={(event) => handleCreditForm(user?.id, event)}>
                                    <input type="hidden" onChange={handleCreditInput} readOnly name="userId" value={user?.id} />
                                    <input type="number" className='form-control' name="credit_amount" onChange={handleCreditInput} id="" />
                                    <button type="submit" className='btn btn-primary form-control mt-5 btn btn-sm'>Credit {user?.username}</button>
                                </form>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>


                
            )}

            {/* edit modal */}
            {editUserData && (
                <Modal show={openEditModal}>
                    <Modal.Title>
                        <div className={styles['modal_title']}>
                            <p>Edit User</p>
                            <button onClick={closeEditModal} type="button" className='btn btn-normal bi bi-x'></button>
                        </div>
                    </Modal.Title>
                    <Modal.Body>
                        <form onSubmit={handleEditForm}>
                            <div className={styles['modal_body']}>
                                <div className={styles['form-data']}>
                                    <label htmlFor="fullname">Full Name <span className='text-danger'>*</span></label>
                                    <input onChange={handleEditInput} type="text" name="fullname" value={editForm.fullname} className='form-control' id="" />
                                </div>
                                <div className={styles['form-data']}>
                                    <label htmlFor="email">Email <span className='text-danger'>*</span></label>
                                    <input onChange={handleEditInput} type="text" name="email" readOnly value={editForm.email} className='form-control' id="" />
                                </div>
                                <div className={styles['form-data']}>
                                    <label htmlFor="interest">Interest <span className='text-danger'>*</span></label>
                                    <input onChange={handleEditInput} type="number" name="interest" value={editForm.interest} className='form-control' id="" />
                                </div>
                                <div className={styles['form-data']}>
                                    <label htmlFor="admin">Status</label>
                                    <select onChange={handleEditInput} name="admin" className='form-control' id="">
                                            {editForm && editForm.admin === 1 ? (
                                                <option value={'1'}>Selected: Admin</option>
                                            ): (
                                                <option value={'0'}>Selected: User</option>
                                            )}
                                        <option value="0">User</option>
                                        <option value="1">Admin</option> 
                                    </select>
                                </div>
                                <div className={styles['form-data']}>
                                    <button type="submit" className='form-control btn btn-primary'>Update User</button>
                                </div>
                            </div>
                        </form> 
                    </Modal.Body>
                </Modal> 
            )}


            {/* debit modal */}
            {debitData && (
                <Modal show={debitModal}>
                    <Modal.Title>
                        <div className={styles['modal_title']}>
                            <p>Debit User</p>
                            <button onClick={closeDebitModal} type="button" className='btn btn-normal bi bi-x'></button>
                        </div>
                    </Modal.Title>
                    <Modal.Body>
                        <div className={styles['modal_body']}>
                            <div className={styles['modal_details']}>
                                <p>Full Name</p>
                                <p>{debitData?.fullname}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>E-Mail</p>
                                <p>{debitData?.email}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Current Balance</p>
                                <p>$ {debitData?.balance}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Debit Amount</p>
                                <form onSubmit={(event) => handleDebitForm(debitData?.id, event)}>
                                    <input type="number" className='form-control' name="debit_amount" onChange={handleDebitInput} id="" />

                                    <button type="submit" className='btn btn-primary form-control mt-5 btn btn-sm'>Debit {debitData?.username}</button>
                                </form>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            )}


            {/* info modal */}
            {info && (
                <Modal show={infoModal}>
                    <Modal.Title>
                        <div className={styles['modal_title']}>
                            <p></p>
                            <button onClick={closeInfoModal} type="button" className='btn btn-normal bi bi-x'></button>
                        </div>
                    </Modal.Title>
                    <Modal.Body>
                        {/* modals body */}
                        <div className={styles['modal_main_container']}>
                            <div className={styles['modal_img']}>
                                {info && info.avatar && info.avatar.length > 1 ? (
                                    <img src={import.meta.env.VITE_APP_AVATAR + info.avatar} alt="__blank" />
                                ): (
                                    <img src={unknownImg} alt="__blank" />
                                )}
                            </div>
                        </div>
                        <div className={styles['modal_body']}>
                            <div className={styles['modal_details']}>
                                <p>Full Name</p>
                                <p>{info?.fullname}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>E-Mail</p>
                                <p>{info?.email}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Username</p>
                                <p>{info?.username}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Phone Number</p>
                                <p>{info && info.phone ? info.phone : 'NULL'}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Account Balance</p>
                                <p>{formatCurrency(info?.balance)} USD</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Telegram</p>
                                <p>{info && info.telegram ? info.telegram : 'NULL'}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Gender</p>
                                <p>{info && info.gender ? info.gender : 'NULL'}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Date of Birth</p>
                                <p>{info && info.date_of_birth ? info.date_of_birth : 'NULL'}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Country</p>
                                <p>{info && info.country ? info.country : 'NULL'}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Address</p>
                                <p>{info && info.address ? info.address : 'NULL'}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>City</p>
                                <p>{info && info.city ? info.city : 'NULL'}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Total Deposit</p>
                                <p>{formatCurrency(info.total_deposit)} USD</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Interest</p>
                                <p>{formatCurrency(info.interest)} USD</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Status</p>
                                {info && info.admin === 1 ? (
                                    <p>An Admin</p>
                                ): (
                                    <p>A user</p>
                                )}
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Date Joined</p>
                                <p>{new Date(info.date).toLocaleDateString()}</p>
                            </div>
                            {/* recent transaction history */}
                        </div>
                    </Modal.Body>
                </Modal>
            )}


            <Modal show={changeModal}>
                <Modal.Title>
                    <div className={styles['modal_title']}>
                        <p>Change Password</p>
                        <button onClick={closeChangeModal} type="button" className='btn btn-normal bi bi-x'></button>
                    </div>
                </Modal.Title>
                <Modal.Body>
                    <form onSubmit={(event) => handleChangeForm(changeUserId, event)}>
                        <div className={styles['modal_body']}>
                            <div className={styles['form-data']}>
                                <label htmlFor="fullname">New Password <span className='text-danger'>*</span></label>
                                <input onChange={handleChangeInput} value={changeInput.password} type="text" name="password" className='form-control' id="" />
                            </div>
                        </div>
                        <div className={styles['form-data']}>
                            <button type="submit" className='form-control btn btn-primary'>Change password</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
                


            <Modal show={transactionModal}>
                <Modal.Title>
                    <div className={styles['modal_title']}>
                        <p>Recent Transactions</p>
                        <button onClick={() => setTransactionModal(false)} type="button" className='btn btn-normal bi bi-x'></button>
                    </div>
                    <div className={styles['modal_body']}>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                                    <th>USD <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                                    <th> <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                                    <th>DATE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactionData && transactionData.length > 0 ? (
                                    transactionData.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}.</td>
                                            <td>{item?.title}</td>
                                            <td>{item?.amount}</td>
                                            <td>{item.status}</td>
                                            <td>{new Date(item.date).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ): (
                                    <tr>
                                        <td colSpan={5}>No transactions found for this user</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Modal.Title>
            </Modal>
        </>
    )
}

export default ManageUsers;