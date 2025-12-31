import Link from "next/link";
import { ArrowRight, Sparkles, Users, Globe, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
  import Image from "next/image";
import { assets } from "@/assets/assets";

const About = () => {
  return (
    <div className="min-h-screen bg-background">

              {/* ================= STICKY IMAGE SECTION ================= */}
      <section className="relative mt-32 h-[200vh] overflow-hidden">
        
        {/* Background Image */}
        <Image
          src={assets.p1} // 👈 add image in public folder
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

           
          </div>
        </div>
      </section>

      {/* ================= END STICKY SECTION ================= */}


      {/* Hero */}
      <section className="pt-32 lg:pt-44 pb-20 lg:pb-32 text-center">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
            About Shopora
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-light mb-8">
            AI-First Commerce for  <span className="italic text-accent">Modern Vendors</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We’re redefining e-commerce by connecting shoppers and vendors.
          </p>
        </div>
      </section>

{/* Divider */}
<div className="container mx-auto px-6 lg:px-12">
  <div className="h-px bg-slate-200" />
</div>

{/* Story Section */}
<section className="py-20 lg:py-32">
  <div className="container mx-auto px-6 lg:px-12">
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

      {/* Text Content */}
      <div className="animate-fade-up delay-300">
        <p className="text-xs tracking-[0.3em] uppercase text-slate-500 mb-4">
          Our Story
        </p>

        <h2 className="text-3xl lg:text-5xl font-light leading-tight text-slate-900 mb-6">
          Built for the Modern Marketplace
        </h2>

        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            Shopora was born from a simple observation: the e-commerce landscape
            was fragmented, impersonal, and overwhelming. We envisioned a
            platform where technology serves humanity, not the other way around.
          </p>

          <p>
            Our AI-powered engine learns your preferences, anticipates your
            needs, and connects you with vendors who share your values. It’s
            shopping, reimagined for the conscious consumer.
          </p>
        </div>
      </div>

      {/* Image with Quote Overlay */}
      <div className="animate-fade-up delay-400 relative">
        <div className="aspect-[4/5] rounded-sm overflow-hidden relative">

          {/* Image */}
        

<Image
  src={assets.t_}
  alt="Shopora Story"
  fill
  className="object-cover"
/>
          {/* Soft Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

          {/* Quote Overlay */}
          <div className="absolute bottom-8 left-8 right-8">
            <p className="text-xl italic text-white leading-relaxed">
              “The future of shopping is personal, intelligent, and effortless.”
            </p>
            <p className="text-sm text-white/70 mt-4">
              — Shopora Philosophy
            </p>
          </div>

        </div>
      </div>

    </div>
  </div>
</section>

    


      {/* Values */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6 lg:px-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ValueCard icon={<Sparkles />} title="AI-First Innovation" description="Smart automation that feels human." />
          <ValueCard icon={<Users />} title="Vendor Empowerment" description="Tools that help sellers grow." />
          <ValueCard icon={<Globe />} title="Global Community" description="Connecting buyers worldwide." />
          <ValueCard icon={<ShieldCheck />} title="Trust & Security" description="Safe & transparent commerce." />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-foreground text-background text-center">
        <h2 className="text-4xl font-light mb-6">
          Ready to Experience the Future?
        </h2>
        <div className="flex justify-center gap-4">
          <Button variant="accent" size="xl">
            Start Shopping 
          </Button>
          
        </div>
      </section>

    </div>
  );
};

const ValueCard = ({ icon, title, description }) => (
  <div className="p-8 border border-border rounded-sm bg-background">
    <div className="w-10 h-10 mb-6">{icon}</div>
    <h3 className="text-xl mb-3">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

export default About;