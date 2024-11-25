import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "./ui/button";
import ThemeToggleButton from "./ui/theme-toggle-button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 drop-shadow-sm backdrop-blur-sm">
      <section
        className={`mx-auto flex h-[var(--navbar-height)] w-full max-w-full items-center justify-between px-4 2xl:container md:px-8`}
      >
        <Link to="/home" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">Sockify</span>
        </Link>

        <nav className="flex flex-1 justify-center space-x-4">
          {/* Center nav items */}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggleButton />

          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-6 w-6" />
              <span className="sr-only">Open cart</span>
            </Link>
          </Button>
        </div>
      </section>
    </header>
  );
}
