import React, { useEffect, useMemo, useState } from "react";
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
  const { getUserReviews, UpdateReview } = useProductReviews();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) =>
      review.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, reviews]);

  if (!user) {
    return (
      <div className="w-full h-screen flex p-4">
        <p className="text-lg text-yellow-500">
          Please log in to see your reviews.
        </p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="w-full h-screen flex p-4">
        <p className="text-lg text-red-600">Error loading reviews: {error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="w-full h-screen flex p-4">
        <p className="text-lg">You have not posted any reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold mb-6 dark:text-[#F4F4F4]">
        My Reviews
      </h2>

      <div className="w-full lg:max-w-[350px] mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full border border-[#A3A3A3] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] text-[#333333] dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredReviews.length === 0 ? (
        <p className="text-md text-gray-500 dark:text-gray-400">
          No matching reviews found.
        </p>
      ) : (
        <div className="flex justify-start flex-wrap gap-4">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.review_id}
              review={review}
              onSave={handleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
