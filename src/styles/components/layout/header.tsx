"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Container from "../shared/container";
import HeaderLogo from "../features/header/header-logo";
import HeaderSearch from "../features/header/header-search";

import HeaderActions from "../features/header/header-actions";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>
        </div>
        <HeaderLogo />
        <div className="hidden md:flex md:flex-1 md:justify-end md:max-w-md">
          <HeaderSearch />
        </div>
        <HeaderActions />
      </Container>
    </header>
  );
}
