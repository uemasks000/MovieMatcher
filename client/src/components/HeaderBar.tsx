import { Link, useLocation } from "wouter";
import { UserContext } from "../App";
import { useContext } from "react";

const HeaderBar = () => {
  const [location] = useLocation();
  const { username } = useContext(UserContext);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary bg-opacity-90 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <i className="ri-film-line text-primary text-3xl mr-2"></i>
          <h1 className="text-2xl font-heading font-bold">Flick<span className="text-primary">Match</span></h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li className="hidden md:block">
              <Link href="/">
                <div className={`${location === '/' ? 'text-primary' : 'text-white hover:text-primary'} transition cursor-pointer`}>
                  Discover
                </div>
              </Link>
            </li>
            <li className="hidden md:block">
              <Link href="/matches">
                <div className={`${location === '/matches' ? 'text-primary' : 'text-white hover:text-primary'} transition cursor-pointer`}>
                  Matches
                </div>
              </Link>
            </li>
            <li>
              <button type="button" id="user-profile-btn" className="flex items-center">
                <span className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white">
                  {username.charAt(0).toUpperCase()}
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default HeaderBar;
