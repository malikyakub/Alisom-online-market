import React, { useEffect, useState } from "react";
import useAuth from "hooks/useAuth";
import useProductReviews from "hooks/useProductReviews";
import ReviewCard from "components/ReviewCard";

interface Review {
  review_id: string;
  comment: string | undefined;
  rating_stars: number | null;
  created_at: string;
  product: {
    product_id: string;
    name: string;
    image: string | null;
    brand: { name: string } | null;
    category: { name: string } | null;
  };
}

const MyReviews = () => {
  const { user } = useAuth();
  const { getUserReviews, UpdateReview, isLoading } = useProductReviews();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchReviews() {
      const { data, err } = await getUserReviews(user!.id);
      if (err) {
        setError(err);
      } else {
        setReviews(data ?? []);
      }
    }

    fetchReviews();
  }, [user]);

  const handleSave = async (
    id: string,
    newComment: string,
    newRating: number
  ) => {
    const { err } = await UpdateReview({
      review_id: id,
      comment: newComment,
      rating_stars: newRating,
    });

    if (!err) {
      setReviews((prev) =>
        prev.map((review) =>
          review.review_id === id
            ? { ...review, comment: newComment, rating_stars: newRating }
            : review
        )
      );
    } else {
      console.error("Failed to update review:", err);
    }
  };

  if (!user) {
    return (
      <div className="w-full h-screen flex py-4">
        <p className="text-lg text-yellow-500">
          Please log in to see your reviews.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-lg">Loading your reviews...</p>;
  }

  if (error) {
    return (
      <div className="w-full h-screen flex py-4">
        <p className="text-lg text-red-600">Error loading reviews: {error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    <div className="w-full h-screen flex py-4">
      return <p className="text-lg">You have not posted any reviews yet.</p>;
    </div>;
  }
  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold mb-6">My Reviews</h2>
      <div className="flex justify-start flex-wrap gap-4">
        {reviews.map((review) => (
          <ReviewCard
            isLoading={isLoading}
            key={review.review_id}
            review={review}
            onSave={handleSave}
          />
        ))}
      </div>
    </div>
  );
};

export default MyReviews;
