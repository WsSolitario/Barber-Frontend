import Link from "next/link";

import { getLanding } from "@/services/landing-service";

export const dynamic = "force-dynamic";

/*
THESIS: A night-shift appointment board replaces the generic luxury-barber hero.
OWN-WORLD: Petroleum ink, paper, lime signals, condensed signage and sharp rules.
STORY: See the craft, understand the visit, then reserve without hunting.
FIRST VIEWPORT: A large promise and booking action sit beside one full-height studio image.
FORM: Precision studio ledger; asymmetrical proof rail, seed 36ec54ec.
*/

export default async function Home() {
  const landing = await getLanding().catch(() => null);
  const hero = landing?.sections.find((section) => section.sectionKey === "hero")?.content;
  const contact = landing?.sections.find((section) => section.sectionKey === "contact")?.content;
  const gallery = landing?.gallery.length
    ? landing.gallery.map((item) => ({ url: item.media.url, alt: item.media.altText ?? "Trabajo realizado en la barberia" }))
    : [
        { url: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=1200&q=85", alt: "Herramientas de barberia listas para un servicio" },
        { url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=85", alt: "Barbero realizando un corte de precision" },
        { url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=85", alt: "Detalle de un corte y perfilado profesional" },
      ];
  const services = landing?.services ?? [];
  const barbers = landing?.barbers ?? [];
  const price = (value: string | number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(Number(value));

  return (
    <main className="overflow-hidden bg-[#f4f3ed] text-[#172b34]">
      <section className="bg-[#10242c] text-[#f4f3ed]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-[.08em]" href="/">BARBER / STUDIO</Link>
          <div className="hidden items-center gap-7 text-sm font-bold md:flex"><a className="transition hover:text-[#d6f22a]" href="#oficio">Oficio</a><a className="transition hover:text-[#d6f22a]" href="#equipo">Equipo</a><a className="transition hover:text-[#d6f22a]" href="#trabajo">Trabajo</a><a className="transition hover:text-[#d6f22a]" href="#visita">Visita</a></div>
          <Link className="bg-[#d6f22a] px-4 py-3 text-sm font-extrabold text-[#10242c] transition hover:bg-[#f4f3ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d6f22a]" href="/booking">Reservar</Link>
        </nav>
        <div className="mx-auto grid min-h-[41rem] max-w-7xl lg:grid-cols-[1.05fr_.95fr]">
          <div className="flex flex-col justify-between px-5 pb-12 pt-16 sm:px-8 lg:py-20">
            <div className="motion-safe:animate-[landing-reveal_.7s_cubic-bezier(.16,1,.3,1)_both]"><p className="text-sm font-bold tracking-[.12em] text-[#d6f22a]">CORTE / BARBA / RITUAL</p><h1 className="mt-5 max-w-3xl font-[family-name:var(--font-bebas-neue)] text-7xl leading-[.82] tracking-[.015em] sm:text-8xl lg:text-[9.5rem]">{hero?.title ?? "BUEN CORTE. MEJOR PRESENCIA."}</h1><p className="mt-8 max-w-xl text-base leading-8 text-[#c8d2d2] sm:text-lg">{hero?.description ?? "Precision en cada linea, tiempo para desconectar y una cita que se adapta a tu ritmo."}</p></div>
            <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-4"><Link className="group relative overflow-hidden bg-[#d6f22a] px-6 py-4 text-sm font-extrabold text-[#10242c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d6f22a]" href="/booking"><span className="relative z-10">{hero?.ctaLabel ?? "Elegir horario"}</span><span className="absolute inset-y-0 w-8 bg-white/50 motion-safe:animate-[landing-scan_2.5s_ease-in-out_infinite]" /></Link><a className="text-sm font-bold text-[#f4f3ed] underline decoration-[#d6f22a] decoration-2 underline-offset-8" href="#trabajo">Ver cortes reales</a></div>
          </div>
          <div className="relative min-h-[26rem] overflow-hidden border-t border-[#5d7279] lg:min-h-0 lg:border-l lg:border-t-0"><img className="absolute inset-0 h-full w-full object-cover grayscale" src="https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1600&q=90" alt="Barbero trabajando en el estudio" /><div className="absolute inset-0 bg-[#10242c]/25" /><p className="absolute bottom-6 left-6 max-w-48 border-t border-[#d6f22a] pt-3 text-sm font-bold leading-5 text-[#f4f3ed]">La diferencia esta en el detalle, no en la prisa.</p></div>
        </div>
      </section>

      <section id="oficio" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"><div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]"><div><p className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-[.12em] text-[#5f747a]">EL OFICIO</p><h2 className="mt-4 max-w-md font-[family-name:var(--font-bebas-neue)] text-6xl leading-[.88]">TODO EMPIEZA CON ESCUCHAR.</h2><p className="mt-6 max-w-md leading-7 text-[#486068]">Elige el servicio que necesitas. Durante la reserva podrás seleccionar al profesional y el horario disponible que mejor te funcione.</p></div><div className="border-t-2 border-[#172b34]">{services.map((service, index) => <article className="grid gap-5 border-b border-[#aebabc] py-7 sm:grid-cols-[4rem_1fr_auto] sm:items-start" key={service.id}><p className="font-[family-name:var(--font-bebas-neue)] text-3xl text-[#5f747a]">{String(index + 1).padStart(2, "0")}</p><div><h3 className="text-xl font-extrabold tracking-tight">{service.name}</h3><p className="mt-2 max-w-md leading-7 text-[#486068]">{service.description ?? `${service.durationMinutes} minutos de atención dedicada.`}</p><p className="mt-3 text-sm font-bold text-[#5f747a]">{service.durationMinutes} min · {price(service.price)}</p></div><Link className="w-fit border-b-2 border-[#d6f22a] py-3 text-sm font-extrabold" href="/booking">Reservar</Link></article>)}{services.length === 0 && <p className="py-7 leading-7 text-[#486068]">Consulta los servicios y horarios disponibles al reservar.</p>}</div></div></section>

      {barbers.length > 0 && <section id="equipo" className="border-y border-[#aebabc] bg-[#e4e8e4] px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 border-b-2 border-[#172b34] pb-9 sm:flex-row sm:items-end"><div><p className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-[.12em] text-[#5f747a]">EL EQUIPO</p><h2 className="mt-3 font-[family-name:var(--font-bebas-neue)] text-6xl leading-[.88]">MANOS CON OFICIO.</h2></div><p className="max-w-xs leading-6 text-[#486068]">Conoce a quienes están detrás de cada cita. Elige a tu profesional al reservar.</p></div><div className="grid md:grid-cols-2 lg:grid-cols-3">{barbers.map((barber, index) => <article className="border-b border-[#aebabc] py-8 lg:border-r lg:px-8 lg:first:pl-0" key={barber.id}><p className="font-[family-name:var(--font-bebas-neue)] text-2xl text-[#5f747a]">{String(index + 1).padStart(2, "0")}</p><h3 className="mt-10 text-3xl font-extrabold tracking-tight">{barber.name}</h3><p className="mt-3 min-h-14 leading-7 text-[#486068]">{barber.description ?? "Profesional del estudio."}</p>{barber.specialties.length > 0 && <p className="mt-5 text-sm font-bold uppercase tracking-[.08em] text-[#172b34]">{barber.specialties.join(" / ")}</p>}</article>)}</div></div></section>}

      <section id="trabajo" className="bg-[#e8d6b3] px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-[.12em] text-[#5f6652]">TRABAJO RECIENTE</p><h2 className="mt-3 font-[family-name:var(--font-bebas-neue)] text-6xl leading-[.88]">QUE HABLE EL ESPEJO.</h2></div><p className="max-w-xs leading-6 text-[#47534a]">Una selección del portafolio del estudio. Cada resultado empieza con una conversación.</p></div><div className="grid gap-3 md:grid-cols-12 md:grid-rows-[17rem_17rem]">{gallery.map((item, index) => <figure className={`${index === 0 ? "md:col-span-7 md:row-span-2" : "md:col-span-5"} overflow-hidden bg-[#789098]`} key={item.url}><img className="h-full min-h-72 w-full object-cover transition duration-700 hover:scale-[1.03]" src={item.url} alt={item.alt} /></figure>)}</div></div></section>

      <section id="visita" className="bg-[#172b34] px-5 py-20 text-[#f4f3ed] sm:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_.9fr]"><div><p className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-[.12em] text-[#d6f22a]">LA VISITA</p><h2 className="mt-4 max-w-2xl font-[family-name:var(--font-bebas-neue)] text-7xl leading-[.84] sm:text-8xl">TU PRÓXIMO TURNO EMPIEZA AQUÍ.</h2><Link className="mt-9 inline-block bg-[#d6f22a] px-6 py-4 text-sm font-extrabold text-[#10242c] transition hover:bg-[#f4f3ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d6f22a]" href="/booking">Ver horarios disponibles</Link></div><div className="border-t border-[#5d7279] pt-6"><p className="text-sm font-bold tracking-[.12em] text-[#c8d2d2]">ENCUÉNTRANOS</p><p className="mt-4 text-xl font-bold">{contact?.address ?? "Sucursal Centro"}</p><p className="mt-2 leading-7 text-[#c8d2d2]">{contact?.hours ?? "Lunes a Sabado, 9:00 a 20:00"}</p><a className="mt-8 inline-block border-b-2 border-[#d6f22a] py-3 text-sm font-extrabold" href={`https://wa.me/${contact?.whatsapp ?? "5550000000"}`}>Resolver dudas por WhatsApp</a></div></div>
      </section>
    </main>
  );
}
