import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BellIcon, MenuIcon, UserIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export const Navbar = ({ user }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();  // React Router navigation
  
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const handleSignOut = () => {
    localStorage.removeItem("token"); // Remove authentication token
    navigate("/login");  // Redirect to login page
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Projects", path: "/projects" },
    { name: "Tasks", path: "/tasks" },
    { name: "Team", path: "/team" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container px-4 mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2 font-semibold text-xl">
              <div className="h-8 w-8 rounded-md flex items-center justify-center">
                <img src="/project-icon.png" alt="Project Icon" className="h-8 w-8" />
              </div>
              <span>
                Project<span className="text-primary font-bold">Stack</span>
              </span>
            </NavLink>
          </div>

          {/* Right Side */}
          <div className="flex items-center">
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="mr-2 relative">
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                          <UserIcon className="h-4 w-4" />
                        </div>
                      )}
                      <span className="hidden sm:inline-block font-medium">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <button onClick={handleSignOut} className="w-full text-left text-destructive">Sign out</button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:flex md:items-center md:space-x-2">
                <Button variant="ghost" asChild>
                  <NavLink to="/login">Sign in</NavLink>
                </Button>
                <Button asChild>
                  <NavLink to="/signup">Sign up</NavLink>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="flex md:hidden ml-4">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-slide-down">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "text-primary bg-accent"
                      : "text-foreground/70 hover:text-foreground hover:bg-accent"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
            {!user && (
              <div className="flex flex-col space-y-2 mt-4 pt-4 border-t">
                <Button variant="outline" asChild>
                  <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign in
                  </NavLink>
                </Button>
                <Button asChild>
                  <NavLink to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign up
                  </NavLink>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
