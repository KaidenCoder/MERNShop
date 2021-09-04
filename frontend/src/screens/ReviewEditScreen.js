import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUser } from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import { PRODUCT_UPDATE_REVIEW_RESET } from '../constants/productConstants'
import { listProductDetails, updateProductReview } from '../actions/productActions'

const ReviewEditScreen = (props) => {

    console.log(props)

    const userId = props.match.params.id

    const [rating, setRating] = useState(1)
    const [comment, setComment] = useState('')

    const dispatch = useDispatch()

    const userInfo = localStorage.getItem('userInfo') != null ? JSON.parse(localStorage.getItem('userInfo')) : ''
    console.log(userInfo)

    const userDetails = useSelector(state => state.userDetails)
    const { loading: loadingUser, error: errorUser, user } = userDetails

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const productReviewUpdate = useSelector(state => state.productReviewUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productReviewUpdate

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_REVIEW_RESET })
            props.history.push('/')
        } else {
            if (!product.name) {
                dispatch(listProductDetails(props.match.params.id))
            } else {
                setRating(user.name)
                setComment(user.email)
            }
        }
    }, [dispatch, props.history, userId, user, successUpdate])

    // const submitHandler = (e) => {
    //     e.preventDefault()
    //     // DISPATCH REGISTER
    //     dispatch(updateUser({
    //         _id: userId,
    //         name,
    //         email, isAdmin
    //     }))
    // }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProductReview(props.match.params.id, userInfo.name, {
            rating,
            comment
        }))
    }

    return (
        <>
            <Link to='/' className="btn btn-light my-3">
                Go Back
            </Link>

            <FormContainer>
                <h1>Edit Review</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message>
                    : (
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId="name">
                                <Form.Label>Rating</Form.Label>
                                <Form.Control as="select" value={rating} onChange={(e) => setRating(e.target.value)}>
                                    <option value=''>Select...</option>
                                    <option value='1'>1 - Poor</option>
                                    <option value='2'>2 - Fair</option>
                                    <option value='3'>3 - Good</option>
                                    <option value='4'>4 - Very Good</option>
                                    <option value='5'>5 - Excellent</option>
                                </Form.Control>
                                {/* <Form.Control type="number" placeholder="Enter rating"
                                    value={name}
                                    onChange={(e) => setRating(e.target.value)}>

                                </Form.Control> */}
                            </Form.Group>
                            <Form.Group controlId="email">
                                <Form.Label>Comment</Form.Label>
                                <Form.Control as="textarea" row="3"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}>
                                </Form.Control>
                                {/* <Form.Control type="email" placeholder="Enter comment"
                                    value={email}
                                    onChange={(e) => setComment(e.target.value)}>

                                </Form.Control> */}
                            </Form.Group>

                            <Button type="submit" variant="primary">Update</Button>
                        </Form>
                    )}

            </FormContainer>
        </>
    )
}

export default ReviewEditScreen
