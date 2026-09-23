import { useState, useEffect } from "react";
import { getReviews } from "../../lib/apis/apis";
import { Card, CardContent } from "../ui/card";

// Matches the normalized backend response structure
interface Review {
  id?: string;
  authorName?: string;
  author_name?: string; // fallback if backend uses snake_case
  authorPhoto?: string;
  profile_photo_url?: string; // fallback if backend uses snake_case
  rating: number;
  text: string;
  relativeTimeDescription?: string;
  relative_time_description?: string; // fallback if backend uses snake_case
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const data = await getReviews();
        console.log("Fetched reviews:", data);

        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load reviews.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (reviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12 text-neutral-400">
        <span className="animate-pulse">Loading reviews...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-6 text-red-400">{error}</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Google Reviews</h2>
        <p className="text-neutral-500">No reviews available at this time.</p>
      </div>
    );
  }

  const current = reviews[currentIndex];
  // Support both camelCase and snake_case safely
  const name = current.authorName || current.author_name || "Google Reviewer";
  const photo = current.authorPhoto || current.profile_photo_url;
  const time = current.relativeTimeDescription || current.relative_time_description || "";
  const content = current.text || "No written review provided.";

  return (
    <div className="p-4 w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-white">Google Reviews</h2>

      <Card className="shadow-xl bg-neutral-900 border-neutral-800 transition-all duration-300">
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-3">
            {photo ? (
              <img
                src={photo}
                alt={name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-neutral-700"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center font-bold text-white uppercase">
                {name.charAt(0)}
              </div>
            )}

            <div>
              <h3 className="font-semibold text-base text-white">{name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-sm">
                  {"★".repeat(Math.round(current.rating || 5))}
                  {"☆".repeat(5 - Math.round(current.rating || 5))}
                </span>
                <span className="text-xs text-neutral-400">({current.rating}/5)</span>
              </div>
            </div>
          </div>

          <p className="text-neutral-200 text-sm sm:text-base leading-relaxed">
            {content.length > 280 ? `${content.substring(0, 280)}...` : content}
          </p>

          {time && <p className="text-xs text-neutral-500">{time}</p>}
        </CardContent>
      </Card>

      {/* Pagination / Dots indicator */}
      {reviews.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to review ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-6 bg-yellow-400" : "w-2 bg-neutral-600"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;