'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon} from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'
import Link from "next/link";
                      


const Hero = () => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    return (
        
        <div className='mx-6'>
             {/* Hero */}
      <section className="pt-32 lg:pt-44 pb-20 lg:pb-32 text-center">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
            Shopora
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-light mb-8">
            Where Fashion Meets <span className="italic text-accent ">Intelligence</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We’re redefining e-commerce by connecting shoppers and vendors through AI.
          </p>
        </div>
      </section>

            <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>
                <div className='relative flex-1 flex flex-col bg-[#e5d0a9]/50 rounded-3xl xl:min-h-100 group'>
                    <div className='p-5 sm:p-16'>
                        <div className='inline-flex items-center gap-3 bg-[#C9A24D]/10 text-[#C9A24D]  pr-4 p-1 rounded-full text-xs sm:text-sm'>
                            <span className='bg-[#C9A24D]/50 text-white hover:bg-[#C9A25A]  px-3 py-1 max-sm:ml-1 rounded-full text-xs'>NEWS</span> Free Shipping on Orders Above $50! <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
                        </div>
                        <h2 className='text-3xl sm:text-5xl leading-[1.2] my-3 font-medium  bg-clip-text text-transparent max-w-xs  sm:max-w-md' style={{
      background: "linear-gradient(135deg, #C9A24D, #F2D98D)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}>
                            Products you'll love. Prices you'll trust.
                        </h2>
                        <div className='text-slate-800 text-sm font-medium mt-4 sm:mt-8'>
                            <p>Starts from</p>
                            <p className='text-3xl'>{currency}4.90</p>
                        </div>
                        <button className='bg-slate-800 text-white text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md hover:bg-slate-900 hover:scale-103 active:scale-95 transition'>LEARN MORE</button>
                    </div>
                    <Image className='sm:absolute bottom-5 right-0 md:right-0 w-full sm:max-w-sm' src={assets.hero_image_} alt="" />
                </div>
                <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
                    <div className='flex-1 flex items-center justify-between w-full bg-slate-900 rounded-3xl p-6 px-8 group'>
                        <div>
                            <p className='text-3xl font-medium bg-gradient-to-r from-slate-300 to-[#78B2FF] bg-clip-text text-transparent max-w-40'>Best products</p>
                        

<Link
  href="/shop"
  className="group flex items-center gap-1 mt-4 cursor-pointer"
>
  <span>View more</span>
  <ArrowRightIcon
    size={18}
    className="transition-all group-hover:ml-2"
  />
</Link>
                        </div>
                        <Image className='w-35' src={assets.hero_product_img1} alt="" />
                    </div>
                    <div className='flex-1 flex items-center justify-between w-full bg-slate-100 rounded-3xl p-6 px-8 group'>
                        <div>
                            <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent max-w-40'>20% discounts</p>

<Link
  href="/shop"
  className="group flex items-center gap-1 mt-4 cursor-pointer"
>
  <span>View more</span>
  <ArrowRightIcon
    size={18}
    className="transition-all group-hover:ml-2"
  />
</Link>
                        </div>
                        <Image className='w-35' src={assets.hero_product_img2} alt="" />
                    </div>
                </div>
            </div>
            <CategoriesMarquee />
        </div>

    )
}

export default Hero