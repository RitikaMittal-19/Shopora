'use client'

import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { fetchCart, uploadCart } from "@/lib/features/cart/cartSlice";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchAddress } from "@/lib/features/address/addressSlice";
import { fetchUserRatings } from "@/lib/features/rating/ratingSlice";



export default function PublicLayout({ children }) {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { cartItems } = useSelector((state) => state.cart);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch, pathname]);

  /* ================= CART + ADDRESS BOOTSTRAP ================= */
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    (async () => {
      const token = await getToken();
      if (!token) return;

      dispatch(fetchCart(token));
      dispatch(fetchAddress(token));
      dispatch(fetchUserRatings(token));
      
    })();
  }, [dispatch, isLoaded, isSignedIn]);

  /* ================= SYNC CART TO DB ================= */
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (Object.keys(cartItems).length === 0) return;

    const timer = setTimeout(async () => {
      const token = await getToken();
      if (!token) return;

      dispatch(uploadCart(token));
    }, 800);

    return () => clearTimeout(timer);
  }, [dispatch, isLoaded, isSignedIn, cartItems]);

  return (
    <>
      <Banner />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}