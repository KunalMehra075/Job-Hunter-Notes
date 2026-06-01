import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { BaseURL } from "../utils/BaseURL";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";
import { User, LogOut, Menu, SlidersHorizontal } from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = ({ showBrand = true, onOpenVariables }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BaseURL}/auth/me`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    toast.info("Logged out successfully");
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  const menuContent = (
    <DropdownMenuContent className="w-56" align="end" forceMount>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            {user.email}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => navigate("/profile")}>
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {showBrand && (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-md transition-opacity hover:opacity-80"
              >
                <img src={logo} alt="Reuse Notes logo" className="h-8 w-8" />
                <span className="hidden text-xl font-extrabold tracking-tight sm:inline">
                  <span className="text-foreground">Reuse</span>
                  <span className="text-primary">Notes</span>
                </span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />

            {/* Mobile: open the variables drawer */}
            {onOpenVariables && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenVariables}
                className="flex items-center gap-2 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Variables
              </Button>
            )}

            {/* Desktop: welcome + avatar menu */}
            <div className="hidden items-center space-x-2 lg:flex">
              <span className="text-muted-foreground">
                Welcome, {user.firstName}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.firstName?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                {menuContent}
              </DropdownMenu>
            </div>

            {/* Mobile: hamburger menu (profile / logout) */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                {menuContent}
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
