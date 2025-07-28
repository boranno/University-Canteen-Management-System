import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Heart, Star, Circle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Canteen } from "@shared/schema";

interface CanteenCardProps {
  canteen: Canteen;
}

export default function CanteenCard({ canteen }: CanteenCardProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageError, setImageError] = useState(false);

  const { data: favoriteStatus } = useQuery({
    queryKey: ["/api/favorites/check", { canteenId: canteen.id }],
    queryFn: () => 
      fetch(`/api/favorites/check?canteenId=${canteen.id}`, { credentials: "include" })
        .then(res => res.json()),
    enabled: isAuthenticated,
  });

  const favoriteMutation = useMutation({
    mutationFn: async (action: "add" | "remove") => {
      if (action === "add") {
        await apiRequest("POST", "/api/favorites", { canteenId: canteen.id });
      } else {
        await apiRequest("DELETE", `/api/favorites?canteenId=${canteen.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites/check"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    },
  });

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites",
      });
      return;
    }

    const action = favoriteStatus?.isFavorite ? "remove" : "add";
    favoriteMutation.mutate(action);
  };

  const defaultImage = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200";

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img 
        src={imageError ? defaultImage : (canteen.imageUrl || defaultImage)}
        alt={canteen.name}
        className="w-full h-48 object-cover"
        onError={() => setImageError(true)}
      />
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{canteen.name}</h3>
          <Badge 
            variant={canteen.isOpen ? "default" : "secondary"}
            className={canteen.isOpen ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"}
          >
            <Circle className="h-2 w-2 mr-1 fill-current" />
            {canteen.isOpen ? "Open" : "Closed"}
          </Badge>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{canteen.location}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Clock className="h-4 w-4 mr-1" />
          <span>{canteen.openTime} - {canteen.closeTime}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(canteen.rating || 0) ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {canteen.rating?.toFixed(1) || '0.0'} ({canteen.reviewCount || 0} reviews)
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteToggle}
            disabled={favoriteMutation.isPending}
            className={favoriteStatus?.isFavorite ? "text-red-500 hover:text-red-600" : "text-blue-600 hover:text-blue-700"}
          >
            <Heart className={`h-5 w-5 ${favoriteStatus?.isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {canteen.tags && canteen.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {canteen.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Button 
          className={`w-full font-medium transition ${
            canteen.isOpen 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!canteen.isOpen}
        >
          {canteen.isOpen ? "View Menu" : "Currently Closed"}
        </Button>
      </CardContent>
    </Card>
  );
}
