import { useState, useEffect } from "react";
import { getReviews } from "@//lib/apis/apis";
import { Card, CardContent } from "../ui/card"


interface Review {
  author_name: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  profile_photo_url: string;
}

const Reviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
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
                    throw new Error("Invalid data format");
                }
            } catch (error) {
                setError("Failed to fetch reviews");
                
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, []);
    

    useEffect(() => {
        if (reviews.length > 1) {
          const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
          }, 5000); // Auto-rotate every 5 seconds
    
          return () => clearInterval(interval);
        }
      }, [reviews]);

    if (isLoading) return <div>Loading reviews...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-2 rounded-md">
          <h1 className="text-3xl font-bold text-center mb-6">Google Reviews</h1>
          {reviews.length === 0 ? (
            <p className="text-center text-neutral-500">No reviews available</p>
          ) : (
            <Card className="max-w-100 sm:max-w-150 mx-auto shadow-lg pt-6 transition-all duration-500 ease-in-out bg-neutral-800">
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={reviews[currentIndex].profile_photo_url}
                    alt={reviews[currentIndex].author_name}
                    className="w-12 h-12 rounded-full border"
                  />
                  <div>
                    <h3 className="font-semibold text-md text-white">{reviews[currentIndex].author_name}</h3>
                    <p className="text-yellow-500">⭐ {reviews[currentIndex].rating}/5</p>
                  </div>
                </div>
                <p className="mt-3 text-white">
                  {reviews[currentIndex].text.length > 300
                    ? reviews[currentIndex].text.substring(0, 300) + "..."
                    : reviews[currentIndex].text}
                </p>
                <p className="text-sm text-gray-500 mt-2">{reviews[currentIndex].relative_time_description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      );
    
};

export default Reviews;