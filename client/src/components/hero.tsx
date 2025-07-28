export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white">
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Delicious Food at
            <span className="text-yellow-400 block">DIU Campus</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Explore all university canteens, read reviews, and make informed food choices for a healthier campus dining experience.
          </p>
          
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
  );
}
