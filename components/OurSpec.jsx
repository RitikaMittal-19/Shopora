import React from 'react'
import Title from './Title'
import { ourSpecsData } from '@/assets/assets'

const OurSpecs = () => {

    return (
        <div className='px-6 my-20 max-w-6xl mx-auto'>
            <Title visibleButton={false} title='Our Specifications' description="We offer top-tier service and convenience to ensure your shopping experience is smooth, secure and completely hassle-free." />

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-10 mt-26'>
                {
                    ourSpecsData.map((spec, index) => {
                        return (
                            <div className='relative h-44 px-8 flex flex-col items-center justify-center w-full text-center border rounded-lg group' style={{ backgroundColor: spec.accent + 10, borderColor: spec.accent + 30 }} key={index}>
                                <h3 className='text-slate-800 font-medium'>{spec.title}</h3>
                                <p className='text-sm text-slate-600 mt-3'>{spec.description}</p>
                                <div className='absolute -top-5 text-white size-10 flex items-center justify-center rounded-md group-hover:scale-105 transition' style={{ backgroundColor: spec.accent }}>
                                    <spec.icon size={20} />
                                </div>
                            </div>
                        )
                    })
                }
            </div>

                {/* Become a Vendor */}
<section className="pt-32 lg:pt-44 pb-20 lg:pb-32 text-center">
  <div className="container mx-auto px-6 lg:px-12 max-w-4xl">

    <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
      Become a Vendor
    </p>

    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-balance">
      Turn Your Brand Into 
      <span className="italic  text-[#dcc288]"> A Global Business</span>
    </h1>

    <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
      Join Shopora’s AI-powered multi-vendor marketplace and reach customers
      worldwide. List products faster, sell smarter, and grow without limits.
    </p>

    {/* CTA */}
    <div className="mt-10 flex justify-center gap-4 flex-wrap">
      <a
        href="/create-store"
        className="bg-slate-800 text-white px-8 py-3 rounded-md hover:bg-slate-900 transition"
      >
        Create Store
      </a>

      
    </div>

  </div>
</section>
        </div>
    )
}

export default OurSpecs