import React, { useState } from "react";
import { Pencil } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";

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

interface ReviewCardProps {
  review: Review;
  isLoading?: boolean;
  onSave: (id: string, newComment: string, newRating: number) => Promise<void>;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onSave,
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempComment, setTempComment] = useState(review.comment ?? "");
  const [tempRating, setTempRating] = useState(review.rating_stars ?? 0);

  const handleSave = async () => {
    await onSave(review.review_id, tempComment, tempRating);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl w-[300px] shadow p-4 text-gray-900 dark:text-gray-100">
      <img
        src={review.product.image ?? "/assets/images/no-product-image.jpg"}
        alt={review.product.name}
        className="w-full h-48 object-cover rounded-md"
      />

      <h3 className="mt-4 text-lg font-semibold">{review.product.name}</h3>

      {isEditing ? (
        <textarea
          value={tempComment}
          onChange={(e) => setTempComment(e.target.value)}
          disabled={isLoading}
          rows={3}
          className="w-full mt-3 p-2 border border-gray-300 dark:border-gray-700 rounded-md resize-none text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      ) : (
        <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
          {review.comment}
        </p>
      )}

      <div className="mt-3 flex items-center space-x-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const starFilled =
            i < (isEditing ? tempRating : review.rating_stars ?? 0);
          return (
            <svg
              key={i}
              onClick={() => isEditing && !isLoading && setTempRating(i + 1)}
              className={`w-5 h-5 cursor-pointer ${
                starFilled
                  ? "text-yellow-500"
                  : "text-gray-300 dark:text-gray-600"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.951a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.951c.3.921-.755 1.688-1.538 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.783.57-1.838-.197-1.538-1.118l1.287-3.951a1 1 0 00-.364-1.118L2.075 9.378c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.951z" />
            </svg>
          );
        })}
      </div>

      <div className="mt-4 flex justify-between items-center">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              Save
            </button>
            {isLoading && <ClipLoader size={20} color="#2563eb" />}
          </>
        ) : (
          <button
            onClick={() => !isLoading && setIsEditing(true)}
            className="flex items-center gap-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            <Pencil size={14} />
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
