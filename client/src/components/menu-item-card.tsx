import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Heart } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { MenuItem } from "@shared/schema";

interface MenuItemCardProps {
  menuItem: MenuItem;
}

export default function MenuItemCard({ menuItem }: MenuItemCardProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageError, setImageError] = useState(false);

  const { data: favoriteStatus } = useQuery({
    queryKey: ["/api/favorites/check", { menuItemId: menuItem.id }],
    queryFn: () => 
      fetch(`/api/favorites/check?menuItemId=${menuItem.id}`, { credentials: "include" })
        .then(res => res.json()),
    enabled: isAuthenticated,
  });

  const favoriteMutation = useMutation({
    mutationFn: async (action: "add" | "remove") => {
      if (action === "add") {
        await apiRequest("POST", "/api/favorites", { menuItemId: menuItem.id });
      } else {
        await apiRequest("DELETE", `/api/favorites?menuItemId=${menuItem.id}`);
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

  const defaultImage = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={imageError ? defaultImage : (menuItem.imageUrl || defaultImage)}
        alt={menuItem.name}
        className="w-full h-40 object-cover"
        onError={() => setImageError(true)}
      />
      
      <CardContent className="p-4">
        <h4 className="font-semibold text-gray-900 mb-1">{menuItem.name}</h4>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{menuItem.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-blue-600">৳{menuItem.price}</span>
          <div className="flex items-center">
            <div className="flex text-yellow-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3 w-3 ${i < Math.floor(menuItem.rating || 0) ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-600">{menuItem.rating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mb-3">
          <Badge 
            variant={menuItem.isAvailable ? "default" : "secondary"}
            className={`text-xs ${menuItem.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}
          >
            {menuItem.isAvailable ? "Available" : "Unavailable"}
          </Badge>
          {menuItem.category && (
            <span className="ml-2">{menuItem.category}</span>
          )}
        </div>
        
        <Button 
          onClick={handleFavoriteToggle}
          disabled={favoriteMutation.isPending || !menuItem.isAvailable}
          className={`w-full text-sm transition ${
            favoriteStatus?.isFavorite 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {favoriteMutation.isPending ? (
            "Loading..."
          ) : favoriteStatus?.isFavorite ? (
            <>
              <Heart className="h-3 w-3 mr-1 fill-current" />
              Favorited
            </>
          ) : (
            "Add to Favorites"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
