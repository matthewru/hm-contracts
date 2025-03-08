import Image from "next/image"
import Link from "next/link"

// shadcn/ui components (replace paths as needed)
import { Button } from "@/components/ui/button" 

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header / Navigation */}
      <header className="border-b">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="text-xl font-bold">
            ContractAI
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-1">
        <section className="flex-1 container mx-auto grid items-center gap-6 px-4 md:grid-cols-2">
          {/* Left Column: Headline, Subtext, Features, CTA */}
          <div className="flex flex-col space-y-6">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              AI-Powered Contract Management <br className="hidden sm:block" />
              Made Simple
            </h1>
            <p className="text-lg text-muted-foreground max-w-prose">
              Generate professional contracts in seconds with our Gemini AI-powered
              platform. Save time, ensure compliance, and streamline your workflow.
            </p>

            <ul className="list-inside list-disc space-y-2 pl-1 text-muted-foreground">
              <li>Create contracts 10x faster with AI assistance</li>
              <li>Choose from multiple contract templates</li>
              <li>Ensure legal compliance with AI validation</li>
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href="/register">
                <Button size="lg">Get Started Free</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">Log in</Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Illustration or Image Placeholder */}
          <div className="mt-8 md:mt-0">
            {/* You can replace this Image placeholder with an actual image or illustration */}
            <div className="relative h-64 w-full rounded-md border bg-gray-50">
              <Image
                src="/hero-placeholder.png"
                alt="Illustration of a contract form"
                fill
                className="object-contain p-4"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}