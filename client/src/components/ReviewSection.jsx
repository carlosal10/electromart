import React, { useEffect, useState } from "react"
import { api } from "../utils/api"

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })

  return null
}

export default ReviewSection
