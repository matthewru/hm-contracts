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
        <section className="flex-1 container mx-auto grid items-center gap-6 px-4 md:grid-cols-2 py-12">
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

          {/* Right Column: Illustration or Image Placeholder */}
          <div className="mt-8 md:mt-0">
            <div className="relative h-80 w-full rounded-md border border-gray-100 bg-gray-50 shadow-sm overflow-hidden">
              <Image
                src="/hero-placeholder.png"
                alt="Illustration of a contract form"
                fill
                className="object-contain p-4"
              />
              {/* Green gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#75e782]/10 to-transparent"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}