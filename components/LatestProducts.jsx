'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

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


            {/* Membership */}
<section className="py-30">
  <div className=" mx-auto px-10 lg:px-9">
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