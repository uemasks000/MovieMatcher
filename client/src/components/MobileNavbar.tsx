import { Link, useLocation } from "wouter";

const MobileNavbar = () => {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark bg-opacity-90 backdrop-blur-md shadow-lg z-40 md:hidden">
      <div className="flex justify-around items-center py-3">
        <Link href="/">
          <a className={`flex flex-col items-center ${location === '/' ? 'text-primary' : 'text-gray-400 hover:text-primary'} transition`}>
            <i className="ri-compass-3-line text-xl"></i>
            <span className="text-xs mt-1">Discover</span>
          </a>
        </Link>
        <Link href="/matches">
          <a className={`flex flex-col items-center ${location === '/matches' ? 'text-primary' : 'text-gray-400 hover:text-primary'} transition`}>
            <i className="ri-heart-line text-xl"></i>
            <span className="text-xs mt-1">Matches</span>
          </a>
        </Link>
        <a href="#" className="flex flex-col items-center text-gray-400 hover:text-primary transition">
          <i className="ri-settings-3-line text-xl"></i>
          <span className="text-xs mt-1">Settings</span>
        </a>
      </div>
    </nav>
  );
};

export default MobileNavbar;
