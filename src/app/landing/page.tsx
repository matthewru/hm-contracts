'use client';

import Image from "next/image"
import Link from "next/link"

// shadcn/ui components (replace paths as needed)
import { Button } from "@/components/ui/button" 

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header / Navigation */}
      <header className="border-b border-gray-100">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Image
              src="/paperpilot-logo.png"
              alt="PaperPilot Logo"
              width={180}
              height={50}
              className="mr-2"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-[#75e782] hover:bg-green-50">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#75e782] text-gray-800 hover:bg-[#5bc566] border-none">
                Register
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-1">
        <section className="flex-1 container mx-auto grid items-center gap-10 px-4 md:grid-cols-2 py-12">
          {/* Left Column: Headline, Subtext, Features, CTA */}
          <div className="flex flex-col space-y-6">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl text-gray-800">
              AI-Powered Contract <br className="hidden sm:block" />
              Management <br className="hidden sm:block" />
              Made Simple
            </h1>
            <p className="text-lg text-gray-600 max-w-prose">
              Generate professional contracts in seconds with our Gemini AI-powered
              platform. Save time, ensure compliance, and streamline your workflow.
            </p>

            <ul className="list-inside space-y-2 pl-1 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#75e782] mr-2">•</span>
                Create contracts 10x faster with AI assistance
              </li>
              <li className="flex items-start">
                <span className="text-[#75e782] mr-2">•</span>
                Choose from multiple contract templates
              </li>
              <li className="flex items-start">
                <span className="text-[#75e782] mr-2">•</span>
                Ensure legal compliance with AI validation
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-[#75e782] text-gray-800 hover:bg-[#5bc566] border-none">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-gray-700 border-gray-300 hover:border-[#75e782] hover:text-[#75e782]">
                  Log in
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Demo Image */}
          <div className="mt-8 md:mt-0 flex justify-center items-center">
            <div className="relative w-full transform transition-all duration-300 hover:scale-[1.02]">
              {/* Image Frame */}
              <div className="rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(117,231,130,0.3)] border-2 border-[#75e782]/20">
                <Image
                  src="/demo.png"
                  alt="Contract management interface screenshot"
                  width={800}
                  height={600}
                  quality={100}
                  priority
                  className="w-full h-auto"
                />
              </div>
              
              {/* Caption */}
              <div className="absolute -bottom-8 left-0 right-0 text-center">
                <p className="text-sm text-gray-500 bg-white/80 py-1 px-3 rounded-full inline-block shadow-sm border border-gray-100">
                  ↑ Interactive contract management interface
                </p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#75e782]/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#75e782]/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}