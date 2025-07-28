import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string | null;
      profileImageUrl: string | null;
    };
    canteen?: {
      id: string;
      name: string;
    } | null;
    menuItem?: {
      id: string;
      name: string;
    } | null;
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const userName = review.user.firstName && review.user.lastName 
    ? `${review.user.firstName} ${review.user.lastName}`
    : review.user.firstName || review.user.email || "Anonymous";

  const userInitials = review.user.firstName?.[0]?.toUpperCase() || 
                      review.user.email?.[0]?.toUpperCase() || "A";

  const timeAgo = (date: string) => {
    const now = new Date();
    const reviewDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return reviewDate.toLocaleDateString();
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={review.user.profileImageUrl || undefined} alt={userName} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-gray-900">{userName}</h4>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : ''}`} />
                ))}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">Student • {timeAgo(review.createdAt)}</p>
            
            {review.comment && (
              <p className="text-gray-800 text-sm mb-3">"{review.comment}"</p>
            )}
            
            <div className="text-xs text-blue-600">
              <MapPin className="inline h-3 w-3 mr-1" />
              {review.canteen && review.canteen.name}
              {review.menuItem && ` • ${review.menuItem.name}`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
