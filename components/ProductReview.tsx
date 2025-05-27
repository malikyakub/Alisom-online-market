import React, { useState, useEffect } from "react";
import useProductReviews from "hooks/useProductReviews";
import Alert from "./Alert";
import useAuth from "hooks/useAuth";
import ClipLoader from "react-spinners/ClipLoader";

interface ProductReviewProps {
  productId: string;
}

const ProductReview: React.FC<ProductReviewProps> = ({ productId }) => {
  const { user } = useAuth();
  const [viewingReviews, setViewingReviews] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);

  const [alert, setAlert] = useState<{
    open: boolean;
    type: "success" | "warning" | "danger" | "info";
    title: string;
    description: string;
  }>({
    open: false,
    type: "success",
    title: "",
    description: "",
  });

  const { GetProductReviews, AddReview } = useProductReviews();

  useEffect(() => {
    if (viewingReviews) {
      fetchReviews();
    }
  }, [viewingReviews, productId]);

  const fetchReviews = async () => {
    const { data, err } = await GetProductReviews(productId);
    if (!err && data) {
      setReviews(data);
    } else {
      setAlert({
        open: true,
        type: "danger",
        title: "Failed to Load Reviews",
        description: "An error occurred while fetching reviews.",
      });
      console.error("Failed to fetch reviews:", err);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      setAlert({
        open: true,
        type: "danger",
        title: "Not Logged In",
        description: "You must be logged in to submit a review.",
      });
      return;
    }

    if (rating < 1 || rating > 5 || !comment.trim()) {
      setAlert({
        open: true,
        type: "warning",
        title: "Incomplete Review",
        description: "Please provide a valid rating and comment.",
      });
      return;
    }

    const { err } = await AddReview({
      user_id: user.id,
      product_id: productId,
      comment,
      rating_stars: rating,
    });

    if (err) {
      console.error("Review submission failed:", err);
      setAlert({
        open: true,
        type: "danger",
        title: "Submission Failed",
        description: "Something went wrong while submitting your review.",
      });
      return;
    }

    setComment("");
    setRating(0);
    setAlert({
      open: true,
      type: "success",
      title: "Review Submitted",
      description: "Thanks for your feedback!",
    });

    if (viewingReviews) fetchReviews();
  };

  return (
    <>
      <Alert
        isOpen={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        type={alert.type}
        title={alert.title}
        description={alert.description}
      />

      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {viewingReviews ? "Customer Reviews" : "Write a Review"}
          </h3>
          <button
            onClick={() => setViewingReviews(!viewingReviews)}
            className="text-sm text-blue-600 hover:underline"
          >
            {viewingReviews ? "Write a Review" : "View Reviews"}
          </button>
        </div>

        {viewingReviews ? (
          <div className="space-y-3">
            {reviews.length === 0 && (
              <p className="text-sm text-gray-500">No reviews yet.</p>
            )}
            <div className="flex flex-col gap-2 py-2 [&::-webkit-scrollbar]:hidden overflow-scroll h-[200px]">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="p-3 border rounded-md bg-white dark:bg-white/20 "
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-[#1A2238] dark:text-[#F4F4F4]">
                      {review.user?.fullname ||
                        review.user?.email ||
                        "Anonymous"}
                    </span>
                    <div className="text-yellow-400 text-sm">
                      {"★".repeat(review.rating_stars)}
                      {"☆".repeat(5 - review.rating_stars)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    rating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Share your thoughts..."
              className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleSubmit}
              className="bg-[#007BFF] hover:bg-[#007bffde] text-white w-full py-2 rounded-md font-semibold flex justify-center items-center disabled:opacity-60"
            >
              Submit Review
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default ProductReview;
