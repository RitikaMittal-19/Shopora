import Image from "next/image";
import { assets } from "@/assets/assets";
export default function ContactPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src={assets.p7} // 👈 place image in public folder
        alt="Contact background"
        fill
        priority
        className="object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/60" />

      {/* Content */}
      <div className="relative px-6 py-16">
        <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-8">
          <h1 className="text-3xl font-semibold text-slate-800">
            Contact <span className="font-normal">Us</span>
          </h1>

          <p className="mt-4 text-slate-500">
            Have a question, suggestion, or need help?
            We’d love to hear from you.
          </p>

          <form className="mt-10 space-y-6">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                required
                className="p-3 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="p-3 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Write your message here..."
                required
                className="p-3 border border-slate-200 rounded outline-none resize-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-slate-800 text-white px-6 py-2 rounded hover:bg-slate-900 transition"
            >
              Send Message
            </button>
          </form>

          <div className="mt-12 text-sm text-slate-500">
            <p>Email: support@shopora.com</p>
            <p className="mt-1">We usually respond within 24 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}