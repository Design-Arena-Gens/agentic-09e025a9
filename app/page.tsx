import { ChatAgent } from "./components/chat-agent";

const services = [
  {
    title: "Collision panel beating",
    description:
      "Precision frame straightening and reshaping with OEM-approved techniques that restore structural integrity after accidents."
  },
  {
    title: "Spray painting & resprays",
    description:
      "Dust-free spray booth, digital colour matching, and glassy clear coats that deliver a factory-fresh finish."
  },
  {
    title: "Dent removal & polishing",
    description:
      "Paintless dent repair or traditional refinishing for parking dents, hail damage, and detailed polishing."
  },
  {
    title: "Rust repair & protection",
    description:
      "Cut-back, neutralise, weld, and seal rust hotspots before priming and coating with long-term protection."
  },
  {
    title: "Insurance claims assistance",
    description:
      "Complete photographic reports, assessor liaison, and transparent estimates for all major insurers."
  },
  {
    title: "Aftercare & detailing",
    description:
      "Ceramic paint protection, headlight restoration, and scheduled maintenance check-ins after each repair."
  }
];

const turnarounds = [
  { label: "Minor dents & polish", duration: "24 - 48 hours" },
  { label: "Collision repair & respray", duration: "5 - 7 working days" },
  { label: "Full restoration projects", duration: "Custom plan" }
];

const testimonials = [
  {
    quote:
      "Professional from start to finish. They handled my insurer and kept me updated daily. My SUV looks brand new.",
    name: "Carla, Durbanville"
  },
  {
    quote:
      "Family-run service you can trust. Quality workmanship and they even helped with aftercare tips.",
    name: "Vernon, Bellville"
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 lg:px-8">
      <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-500">
            Since 1989 · Family-owned workmanship
          </p>
          <h1 className="font-serif text-5xl text-brand-900">
            De Jongh’s Panelbeating Centre
          </h1>
          <p className="text-lg leading-relaxed text-brand-700">
            Cape Town’s trusted auto body repair and spray-painting experts. Our digital assistant is ready
            to answer questions, arrange estimates, and keep you informed at every step of the repair journey.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {turnarounds.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">
                  {item.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-brand-800">{item.duration}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-brand-600">
            <div>
              <p className="font-semibold text-brand-700">Workshop hours</p>
              <p>Mon – Fri: 07:30 – 17:30</p>
              <p>Sat: by appointment</p>
            </div>
            <div>
              <p className="font-semibold text-brand-700">Contact</p>
              <p>021 948 8825</p>
              <p>hello@dejonghs-panel.co.za</p>
            </div>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-brand-200/30 blur-2xl" />
          <div className="absolute -bottom-16 -right-10 h-52 w-52 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="relative w-full rounded-3xl border border-brand-200 bg-white/70 p-6 shadow-xl backdrop-blur-sm">
            <ChatAgent />
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-6">
          <h2 className="font-serif text-4xl text-brand-900">Repair & spray-painting services</h2>
          <p className="max-w-2xl text-lg text-brand-700">
            Every repair is documented, photographed, and quality-checked before handover. We align chassis,
            blend panels seamlessly, and restore finishes with premium Glasurit and Standox systems.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-2xl border border-brand-100 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-lg font-semibold text-brand-800">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-600">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6 rounded-3xl border border-brand-100 bg-white/80 p-6 shadow-sm">
          <h3 className="font-serif text-2xl text-brand-900">Why motorists choose us</h3>
          <ul className="space-y-4 text-sm leading-relaxed text-brand-600">
            <li>• SAMBRA-accredited with state-of-the-art chassis alignment rigs</li>
            <li>• Lifetime workmanship guarantee on structural repairs</li>
            <li>• Transparent progress updates via WhatsApp, email, or phone</li>
            <li>• Courtesy car and shuttle service available on request</li>
          </ul>
          <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-brand-100 p-6 text-sm text-brand-600">
            <p className="font-semibold text-brand-700">Insurance partner ready</p>
            <p className="mt-2">
              We work with Santam, Hollard, Old Mutual Insure, Momentum, Auto & General and most fleet
              management providers. Marli can collect your claim number, assessor details, and supporting photos.
            </p>
          </div>
          <div className="grid gap-4">
            {testimonials.map((testimonial) => (
              <blockquote
                key={testimonial.name}
                className="rounded-2xl border border-brand-200 bg-white/80 p-5 text-sm text-brand-700 shadow-sm"
              >
                <p className="italic leading-relaxed">“{testimonial.quote}”</p>
                <footer className="mt-2 text-xs uppercase tracking-wide text-brand-500">
                  {testimonial.name}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-10 rounded-3xl border border-brand-100 bg-white/70 px-8 py-12 shadow-lg md:grid-cols-2">
        <div className="space-y-5">
          <h2 className="font-serif text-3xl text-brand-900">Aftercare and paint protection</h2>
          <p className="text-lg text-brand-700">
            Keep your vehicle showroom-ready with the right maintenance plan. Ask Marli for tips or book a
            detailing follow-up.
          </p>
          <ul className="space-y-3 text-sm leading-relaxed text-brand-600">
            <li>• Gentle hand wash only for the first 14 days after respray</li>
            <li>• Apply a pH-neutral shampoo and microfibre drying cloths</li>
            <li>• Annual ceramic protection to guard against Cape Town’s coastal conditions</li>
            <li>• Quarterly inspections to catch stone chips and surface blemishes early</li>
          </ul>
        </div>
        <div
          className="relative h-72 w-full overflow-hidden rounded-3xl border border-brand-200"
          style={{
            background:
              "linear-gradient(135deg, rgba(33,56,86,0.85), rgba(123,161,201,0.55)), url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80') center/cover"
          }}
        >
          <div className="absolute bottom-6 left-6 rounded-2xl bg-white/85 px-5 py-3 text-sm font-semibold text-brand-700 shadow">
            Trusted workmanship · Family operated
          </div>
        </div>
      </section>
    </main>
  );
}
