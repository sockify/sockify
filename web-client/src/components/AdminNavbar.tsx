import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { PROJECT_GITHUB_URL } from "@/shared/constants";
import { Cloud, Github, LifeBuoy, LogOut, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

import NavLink from "./NavLink";
import { Button } from "./ui/button";

export default function AdminNavbar() {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm">
      <section
        className={`mx-auto flex h-[var(--navbar-height)] w-full max-w-full items-center justify-between px-4 2xl:container`}
      >
        <Link to="/admin/home" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">Sockify</span>
          <span className="text-xs text-muted-foreground">[Admin]</span>
        </Link>

        <nav className="flex flex-1 justify-center space-x-4">
          <NavLink to="/admin/inventory">Inventory</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
        </nav>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-2">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="mr-4 min-w-48">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link to="/admin/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <a href={PROJECT_GITHUB_URL} target="_blank">
                  <Github className="mr-2 h-4 w-4" />
                  <span>GitHub</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Cloud className="mr-2 h-4 w-4" />
                <span>API</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
    </header>
  );
}
