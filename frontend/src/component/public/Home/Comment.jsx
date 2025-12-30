import styles from '../../../assets/css/What-customers-say.module.css';
import Commenter from '../../../assets/images/featured/image.png';
import ScrollFadeIn from '../ScrollFadeIn';
import Comment1 from '../../../assets/images/comments/comment1.png';
import Comment2 from '../../../assets/images/comments/comment2.png';
import Comment3 from '../../../assets/images/comments/comment3.png';
const CustomersComment = () => {
    return (
        <>
            <div className="row" style={{ padding: '20px 0px 50px 0px' }}>
                <div className="col-12 col-md-6 col-lg-3 col-xl-3 mt-3">
                    <div>
                        <span className='bi bi-quote text-secondary' style={{ fontSize: '60px' }}></span>
                    </div>
                    <p className='fs-2'>What our Customers are saying</p>
                    <div className={`${styles['tiny-line']}`}></div>
                </div>

                {/* comment here */}
                <div className="col-12 col-md-6 col-lg-3 col-xl-3 mt-4">
                    <ScrollFadeIn>
                        <div className={`${styles.testimonialCard} card`}>
        
                            {/* Testimonial Text */}
                            <p className={`${styles.testimonialText} mb-3`}>
                                A very inspiring community where like-minded people get to learn from one of the best traders in the industry, Since joining, I have completely changed as a trader and person. I see the markets with a lot of clarity and more productivity in everyday life thanks to binncex.
                            </p>

                            {/* Rating Stars */}
                            <div className={`${styles.testimonialRating} mb-3`}>
                                <span className='bi bi-star-fill' style={{ color: 'gold' }}></span>
                                <span className='bi bi-star-fill' style={{ color: 'gold' }}></span>
                                <span className='bi bi-star-fill' style={{ color: 'gold' }}></span>
                                <span className='bi bi-star-fill' style={{ color: 'gold' }}></span>
                            </div>

                            {/* Author Info (Image and Details) */}
                            <div className="d-flex align-items-center">
                                {/* Author Image */}
                                <img 
                                    src={Comment1}
                                    alt={'_blank'} 
                                    className={`${styles.authorImage} rounded-circle me-3`} 
                                />
                                
                                {/* Author Name and Time */}
                                <div>
                                    <h6 className="mb-0">{'Howard Chavez'}</h6>
                                    <small className="text-muted">{'Enterpreneur'}</small>
                                </div>
                            </div>
                        </div>
                    </ScrollFadeIn>
                </div>

                <div className="col-12 col-md-6 col-lg-3 col-xl-3 mt-4">
                    <ScrollFadeIn>
                        <div className={`${styles.testimonialCard} card`}>
        
                            {/* Testimonial Text */}
                            <p className={`${styles.testimonialText} mb-3`}>
                                If you want to level up all areas of your life using trading as a vehicle then berylassets is the one, thay set you up for long term success with laying the right foundations from the very start, From mindset to technical analysis the attention to detail is unmatched.
                            </p>

                            {/* Rating Stars */}
                            <div className={`${styles.testimonialRating} mb-3`}>
                                <span className='bi bi-star-fill' style={{ color: 'gold' }}></span>
                                <span className='bi bi-star-fill' style={{ color: 'gold' }}></span>
                                <span className='bi bi-star-fill' style={{ color: 'gold' }}></span>
                                <span className='bi bi-star-fill' style={{ color: 'gold' }}></span>
                                <span className='bi bi-star-fill' style={{ color: 'gold' }}></span>
                            </div>

                            {/* Author Info (Image and Details) */}
                            <div className="d-flex align-items-center">
                                {/* Author Image */}
                                <img 
                                    src={Comment2}
                                    alt={'_blank'} 
                                    className={`${styles.authorImage} rounded-circle me-3`} 
                                />
                                
                                {/* Author Name and Time */}
                                <div>
                                    <h6 className="mb-0">{'Lucal Elliot'}</h6>
                                    <small className="text-muted">{'Designer'}</small>
                                </div>
                            </div>
                        </div>
                    </ScrollFadeIn>
                </div>

                <div className="col-12 col-md-6 col-lg-3 col-xl-3 mt-4">
                    <ScrollFadeIn>
                        <div className={`${styles.testimonialCard} card`}>
        
                            {/* Testimonial Text */}
                            <p className={`${styles.testimonialText} mb-3`}>
                                I was tired of passive investment apps. {import.meta.env.VITE_APP_NAME} provided not just returns, but a complete framework for financial growth. Their transparency and dedication to educating me on long-term strategy have completely changed how I view my future.
                            </p>

                            {/* Rating Stars */}
                            <div className={`${styles.testimonialRating} mb-3`}>
                                <span className='bi bi-star-fill' style={{ color: 'gold' }}></span>
                                <span className='bi bi-star-fill' style={{ color: 'gold' }}></span>
                                <span className='bi bi-star-fill' style={{ color: 'gold' }}></span>
                                <span className='bi bi-star-fill' style={{ color: 'gold' }}></span>
                                <span className='bi bi-star-half' style={{ color: 'gold' }}></span>
                            </div>

                            {/* Author Info (Image and Details) */}
                            <div className="d-flex align-items-center">
                                {/* Author Image */}
                                <img 
                                    src={Comment3}
                                    alt={'_blank'} 
                                    className={`${styles.authorImage} rounded-circle me-3`} 
                                />
                                
                                {/* Author Name and Time */}
                                <div>
                                    <h6 className="mb-0">{'Hailey Martins'}</h6>
                                    <small className="text-muted">{'Secretary'}</small>
                                </div>
                            </div>
                        </div>
                    </ScrollFadeIn>
                </div>

            </div>
        </>
    )
}

export default CustomersComment;