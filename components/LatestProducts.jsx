'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import { assets } from "@/assets/assets";
import Image from 'next/image'

const LatestProducts = () => {

    const displayQuantity = 4
    const products = useSelector(state => state.product.list)

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title title='Latest Products' description={`Showing ${products.length < displayQuantity ? products.length : displayQuantity} of ${products.length} products`} href='/shop' />
            <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between'>
                {products.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, displayQuantity).map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>




                 {/* ================= STICKY IMAGE SECTION ================= */}
      <section className="relative mt-32 h-[200vh] overflow-hidden">
        
        {/* Background Image */}
        <Image
          src={assets.dior} // 👈 add image in public folder
          alt="Shopora Editorial"
          fill
          priority
          className="object-cover"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />

        {/* Sticky Center Content */}
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className="text-center bg-white/90 backdrop-blur-lg px-12 py-10 rounded-2xl shadow-xl max-w-xl">
            <p className="text-xs tracking-[0.3em] uppercase text-slate-500">
              Editorial
            </p>

            <h2 className="mt-4 text-3xl md:text-4xl font-light text-slate-900">
              Fashion that moves
              <br />
              <span className="italic">with you</span>
            </h2>

            <p className="mt-6 text-slate-600">
              Discover curated styles that blend individuality,
              sustainability, and modern design.
            </p>
          </div>
        </div>
      </section>

      {/* ================= END STICKY SECTION ================= */}




            {/* Membership */}
<section className="py-30">
  <div className=" mx-auto px-7 lg:px-9">
    <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200  px-8 py-10 text-center">

      <p className=" py-7 text-xs tracking-[0.3em] uppercase text-slate-500 mb-3">
        Shopora Membership
      </p>

      <h2 className=" py-8 text-2xl md:text-3xl font-medium text-slate-900">
        Unlock Premium Benefits for
        <span
          className="italic ml-2"
          style={{
            background: "linear-gradient(135deg, #C9A24D, #F2D98D)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          just $5
        </span>
      </h2>

      <p className="mt-4 text-slate-600 max-w-xl mx-auto">
        Enjoy free shipping, priority support, exclusive discounts,
        and early access to new collections — all for less than a coffee.
      </p>

      <div className="mt-8 flex justify-center gap-4 flex-wrap">
        <a
          href="/pricing"
          className="bg-slate-800 text-white px-7 py-3 rounded-md hover:bg-slate-900 transition px=10"
        >
          Get Membership
        </a>

      </div>

    </div>
  </div>
</section>
        </div>
    )
}

export default LatestProducts