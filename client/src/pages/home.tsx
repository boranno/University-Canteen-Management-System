import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import CanteenCard from "@/components/canteen-card";
import MenuItemCard from "@/components/menu-item-card";
import ReviewCard from "@/components/review-card";
import MobileNav from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Circle } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: canteens, isLoading: canteensLoading } = useQuery({
    queryKey: ["/api/canteens"],
  });

  const { data: popularItems, isLoading: itemsLoading } = useQuery({
    queryKey: ["/api/menu-items?popular=true"],
  });

  const { data: recentReviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["/api/reviews?recent=true"],
  });

  const featuredCanteens = canteens?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />

      {/* Filter & Status Bar */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Status Filters */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Filter by status:</span>
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm" className="bg-green-500 text-white hover:bg-green-600">
                  <Circle className="h-3 w-3 mr-1 fill-current" />
                  Open Now (8)
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-700">
                  <Circle className="h-3 w-3 mr-1 fill-current" />
                  All Canteens (12)
                </Button>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <Select defaultValue="nearest">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nearest">Nearest First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="recent">Recently Added</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Featured Canteens Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Featured Canteens</h2>
            <Link href="/canteens">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 font-medium">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {canteensLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCanteens.map((canteen) => (
                <CanteenCard key={canteen.id} canteen={canteen} />
              ))}
            </div>
          )}
        </section>

        {/* Popular Menu Items Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Popular Menu Items</h2>
            <Link href="/canteens">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 font-medium">
                View All Items
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {itemsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularItems?.map((item) => (
                <MenuItemCard key={item.id} menuItem={item} />
              ))}
            </div>
          )}
        </section>

        {/* Recent Reviews Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Recent Reviews</h2>
            <Link href="/reviews">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 font-medium">
                View All Reviews
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {reviewsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentReviews?.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Join the DIU Food Community</h2>
              <p className="text-blue-100 text-lg">Share your dining experiences and help fellow students make better food choices</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✍️</span>
                </div>
                <h3 className="font-semibold mb-2">Write Reviews</h3>
                <p className="text-sm text-blue-100">Share your honest opinions about food quality and service</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❤️</span>
                </div>
                <h3 className="font-semibold mb-2">Save Favorites</h3>
                <p className="text-sm text-blue-100">Keep track of your favorite dishes and canteens</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="font-semibold mb-2">Connect</h3>
                <p className="text-sm text-blue-100">Discover what your friends are eating around campus</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link href="/reviews">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3">
                  Get Started Today
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MobileNav />
    </div>
  );
}
