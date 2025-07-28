import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-white font-bold text-2xl mr-4">
                DIU
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">
                Canteen Hub
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover delicious food at DIU campus. Explore all university canteens, read reviews, and make informed food choices for a healthier campus dining experience.
            </p>
            
            <Button 
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-8 py-4 text-lg"
            >
              Sign In to Get Started
            </Button>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">12</div>
                <div className="text-sm text-blue-200">Active Canteens</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">450+</div>
                <div className="text-sm text-blue-200">Menu Items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">2.5K+</div>
                <div className="text-sm text-blue-200">Student Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">4.2★</div>
                <div className="text-sm text-blue-200">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose DIU Canteen Hub?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to make the best dining decisions on campus
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse All Canteens</h3>
              <p className="text-gray-600">
                Explore every dining option across DIU campus with detailed information about location, hours, and specialties.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Read Real Reviews</h3>
              <p className="text-gray-600">
                Get honest opinions from fellow students about food quality, taste, and value for money.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Favorites</h3>
              <p className="text-gray-600">
                Keep track of your favorite dishes and canteens for quick access to your preferred meals.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join the DIU Food Community Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Sign in with your DIU account and start discovering the best food on campus
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-8 py-4 text-lg"
          >
            Sign In Now
          </Button>
        </div>
      </section>
    </div>
  );
}
