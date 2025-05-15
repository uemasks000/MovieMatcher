import { Link, useLocation } from "wouter";

const MobileNavbar = () => {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark bg-opacity-90 backdrop-blur-md shadow-lg z-40 md:hidden">
      <div className="flex justify-around items-center py-3">
        <Link href="/">
          <div className={`flex flex-col items-center ${location === '/' ? 'text-primary' : 'text-gray-400 hover:text-primary'} transition cursor-pointer`}>
            <i className="ri-compass-3-line text-xl"></i>
            <span className="text-xs mt-1">Discover</span>
          </div>
        </Link>
        <Link href="/matches">
          <div className={`flex flex-col items-center ${location === '/matches' ? 'text-primary' : 'text-gray-400 hover:text-primary'} transition cursor-pointer`}>
            <i className="ri-heart-line text-xl"></i>
            <span className="text-xs mt-1">Matches</span>
          </div>
        </Link>
        <Link href="/settings">
          <div className={`flex flex-col items-center ${location === '/settings' ? 'text-primary' : 'text-gray-400 hover:text-primary'} transition cursor-pointer`}>
            <i className="ri-settings-3-line text-xl"></i>
            <span className="text-xs mt-1">Settings</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavbar;
