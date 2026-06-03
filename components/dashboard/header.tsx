"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, X, Menu, User, LogOut, ChevronDown } from "lucide-react";
import { useCart } from "@/components/cart-context";

export default function DashboardHeader() {
  const [username, setUsername] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUsername(payload.username || "");
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdminRoute = pathname?.startsWith("/dashboard/admin");
  const isCustomerRoute = pathname?.startsWith("/dashboard/customer");

  const dashboardHref = isAdminRoute
    ? "/dashboard/admin"
    : isCustomerRoute
      ? "/dashboard/customer"
      : "/";

  const {
    items,
    count,
    subtotal,
    isCartOpen,
    openCart,
    closeCart,
    removeItem,
  } = useCart();

  return (
    <header className="bg-[#001B54] text-white shadow-md relative z-40">
      <div className="max-w-7xl mx-auto h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4 sm:gap-10">
          <Link
            href={dashboardHref}
            className="text-2xl sm:text-4xl font-extrabold text-yellow-400 tracking-wide"
          >
            RESTO A&V
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-lg font-semibold">
            <Link
              href={dashboardHref}
              className={`transition hover:text-yellow-300 ${
                pathname === dashboardHref ? "text-yellow-300" : ""
              }`}
            >
              Home
            </Link>

            {isAdminRoute && (
              <Link
                href="/dashboard/admin/product"
                className="transition hover:text-yellow-300"
              >
                Product
              </Link>
            )}

            {isCustomerRoute && (
              <Link
                href="/dashboard/customer/menu"
                className="transition hover:text-yellow-300"
              >
                Menu
              </Link>
            )}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold text-sm sm:text-base">
                {username ? username.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="hidden sm:inline font-medium">{username}</span>
              <ChevronDown
                size={14}
                className={`hidden sm:block transition-transform duration-200 ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                {/* User info */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs text-slate-400">Logged in as</p>
                  <p className="font-semibold text-slate-800 truncate">{username || "User"}</p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <Link
                    href={
                      isAdminRoute
                        ? "/dashboard/admin/profile"
                        : "/dashboard/customer/profile"
                    }
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <User size={15} className="text-slate-400" />
                    My Profile
                  </Link>

                  <Link
                    href="/logout"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut size={15} />
                    Logout
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Cart button */}
          <button
            type="button"
            onClick={openCart}
            className="relative text-white transition hover:text-yellow-300"
          >
            <ShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
              {count}
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden text-white hover:text-yellow-300 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden bg-[#001B54] border-t border-white/10 overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-3 gap-1 text-sm font-semibold">
          <Link
            href={dashboardHref}
            className={`py-2 px-3 rounded-lg transition hover:bg-white/10 hover:text-yellow-300 ${
              pathname === dashboardHref ? "text-yellow-300" : ""
            }`}
          >
            Home
          </Link>

          {isAdminRoute && (
            <Link
              href="/dashboard/admin/product"
              className="py-2 px-3 rounded-lg transition hover:bg-white/10 hover:text-yellow-300"
            >
              Product
            </Link>
          )}

          {isCustomerRoute && (
            <Link
              href="/dashboard/customer/menu"
              className="py-2 px-3 rounded-lg transition hover:bg-white/10 hover:text-yellow-300"
            >
              Menu
            </Link>
          )}

          <Link
            href={
              isAdminRoute
                ? "/dashboard/admin/profile"
                : "/dashboard/customer/profile"
            }
            className="py-2 px-3 rounded-lg transition hover:bg-white/10 hover:text-yellow-300"
          >
            My Profile
          </Link>

          <Link
            href="/logout"
            className="py-2 px-3 rounded-lg transition hover:bg-white/10 text-rose-400 hover:text-rose-300"
          >
            Logout
          </Link>
        </nav>
      </div>

      {/* Cart Drawer */}
      <div
        className={`
          fixed inset-0 z-50 flex justify-end
          transition-all duration-300
          ${
            isCartOpen
              ? "pointer-events-auto bg-black/40"
              : "pointer-events-none bg-black/0"
          }
        `}
      >
        <div className="absolute inset-0" onClick={closeCart} />

        <div
          onClick={(e) => e.stopPropagation()}
          className={`
            relative z-10 h-full w-full sm:max-w-md bg-white shadow-2xl
            transition-transform duration-300 ease-out
            ${isCartOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 sm:px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Shopping Cart</h2>
              <p className="text-sm text-slate-500">
                {count} item{count === 1 ? "" : "s"}
              </p>
            </div>
            <button onClick={closeCart} className="text-slate-500 transition hover:text-slate-900">
              <X size={20} />
            </button>
          </div>

          {/* Items */}
          <div className="h-[calc(100%-190px)] overflow-y-auto divide-y divide-slate-200 px-4 sm:px-6 py-4">
            {items.length === 0 ? (
              <div className="py-12 text-center text-slate-500">No products in the cart.</div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 sm:gap-4 py-4">
                  <img
                    src={item.imageUrl || "/makanan.jpg"}
                    alt={item.name}
                    className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">{item.name}</p>
                    <p className="text-xs sm:text-sm text-slate-500">
                      {item.quantity} × Rp {item.price}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 transition hover:text-rose-600 flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 space-y-3 border-t border-slate-200 bg-white px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">Rp {subtotal}</span>
            </div>
            <Link
              href="/dashboard/customer/cart"
              onClick={closeCart}
              className="block w-full rounded-3xl bg-rose-600 px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-rose-700"
            >
              View Cart
            </Link>
            <Link
              href="/dashboard/customer/checkout"
              onClick={closeCart}
              className="block w-full rounded-3xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-slate-900 transition hover:bg-slate-100"
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}