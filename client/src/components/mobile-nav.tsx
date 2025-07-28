import { useLocation } from "wouter";
import { Home, Search, UtensilsCrossed, Heart, User } from "lucide-react";
import { Link } from "wouter";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { name: "Home", href: "/", icon: Home, current: location === "/" },
    { name: "Search", href: "/canteens", icon: Search, current: location === "/canteens" },
    { name: "Canteens", href: "/canteens", icon: UtensilsCrossed, current: location === "/canteens" },
    { name: "Favorites", href: "/favorites", icon: Heart, current: location === "/favorites" },
    { name: "Profile", href: "/reviews", icon: User, current: location === "/reviews" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="grid grid-cols-5 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <div className={`flex flex-col items-center justify-center py-2 ${
                item.current ? 'text-blue-600' : 'text-gray-600'
              }`}>
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
