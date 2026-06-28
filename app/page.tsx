import LeadForm from "@/components/LeadForm";
import { ShieldCheck, Phone } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: "#0A0F1E" }}>

      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6" style={{ color: "#F59E0B" }} />
            <span className="text-lg font-bold text-white tracking-tight">ShieldDrive</span>
          </div>
          <a href="tel:+18005551234" className="flex items-center gap-2 text-sm transition" style={{ color: "rgba(255,255,255,0.45)" }}>
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">1-800-555-1234</span>
          </a>
        </div>
      </header>

      {/* hero */}
      <section className="mx-auto max-w-5xl px-5 py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">

          {/* left */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "#F59E0B" }}>
              Auto Insurance
            </p>

            <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl">
              Stop overpaying <br />
              <span style={{ color: "#F59E0B" }}>for car insurance.</span>
            </h1>

            <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              Most drivers save $400–$800 a year just by comparing rates.
              Takes 2 minutes. No spam, no pressure.
            </p>

            <ul className="mt-7 space-y-2.5">
              {[
                "Quotes from top-rated carriers",
                "Licensed agents, 7 days a week",
                "No credit card required",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                  <span className="text-xs" style={{ color: "#F59E0B" }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>

           
          </div>

    
          <div>
            <LeadForm />
          </div>

        </div>
      </section>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto max-w-5xl px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
          <span>© 2026 ShieldDrive Insurance. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>

    </main>
  );
}