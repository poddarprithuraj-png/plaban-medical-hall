import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import primaryLogo from "@/assets/plaban-primary-logo.png";
import iconLogo from "@/assets/plaban-icon-logo.png";
import heroPhoto from "@/assets/photos/indian-pharmacy-hero.webp.asset.json";
import detailPhoto from "@/assets/photos/indian-pharmacy-detail.webp.asset.json";
import shelvesPhoto from "@/assets/photos/medicine-shelves-india.webp.asset.json";
import storePhoto from "@/assets/photos/indian-medical-store.webp.asset.json";
import tabletsPhoto from "@/assets/photos/tablets-india.webp.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "PLABAN MEDICAL HALL" },
      { name: "description", content: "Plaban Medical Hall in Sorbhog Bazar, Assam. Prescriptions, home delivery, diagnostics and doctor consultations. Speak with pharmacist Ranit Saha." },
      { property: "og:title", content: "PLABAN MEDICAL HALL" },
      { property: "og:description", content: "Prescriptions, home delivery, diagnostics and doctor consultations in Sorbhog Bazar, Assam. Call Plaban Medical Hall." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const phone = "8918800371";
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Plaban+Medical+Hall+Sorbhog+Bazar+Assam+India";
const navigation = [
  { label: "Our story", href: "#story", id: "story" },
  { label: "Services", href: "#offerings", id: "offerings" },
  { label: "Prescriptions", href: "#prescriptions", id: "prescriptions" },
  { label: "The gallery", href: "#gallery", id: "gallery" },
  { label: "Find us", href: "#visit", id: "visit" },
];
const gallery = [
  { src: heroPhoto.url, alt: "A working pharmacy in Varanasi, India", caption: "The people behind the counter", shape: "large" },
  { src: tabletsPhoto.url, alt: "Medicine tablets in a blister pack photographed in Howrah, India", caption: "The medicine you need", shape: "tall" },
  { src: shelvesPhoto.url, alt: "Glass medicine bottles on pharmacy shelves in Varanasi, India", caption: "Care in the details", shape: "wide" },
  { src: storePhoto.url, alt: "A neighborhood medical store in Gangtok, India", caption: "A neighborhood essential", shape: "tall" },
  { src: detailPhoto.url, alt: "Pharmacist looking through medicine shelves in Varanasi, India", caption: "A considered approach", shape: "wide" },
];
const services = [
  { number: "01", title: "Prescription care", copy: "Bring your prescription to the pharmacy. We’ll help you find your prescribed medicines and understand what comes next." },
  { number: "02", title: "Home delivery", copy: "Need medicines brought to your door? Call us to confirm availability, delivery area and timing." },
  { number: "03", title: "Diagnostics", copy: "Ask us about available diagnostic tests and how to arrange them." },
  { number: "04", title: "Doctor consultations", copy: "MD physician, diabetes specialist and urologist consultations. Call to check availability and appointments." },
  { number: "05", title: "Everyday essentials", copy: "The practical health and wellness essentials you reach for in everyday life." },
];
const milestones = [
  { value: 5, label: "Ways we care" },
  { value: 3, label: "Doctor specialties" },
  { value: 1, label: "Pharmacist to speak with" },
  { value: 1, label: "Home in Sorbhog" },
];

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 44 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.13 } } };

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} transition={{ delay }}>{children}</motion.div>;
}

function Count({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setCount(value); return; }
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 1100, 1);
        setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.5 });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <span ref={ref}>{String(count).padStart(2, "0")}</span>;
}

function LoaderCount() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1050, 1);
      setProgress(Math.round(100 * (1 - Math.pow(1 - t, 2))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <span className="font-display text-5xl tabular-nums text-primary" aria-label={`Loading ${progress} percent`}>{String(progress).padStart(2, "0")}<span className="text-2xl">%</span></span>;
}

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollYProgress: storyProgress } = useScroll({ target: storyRef, offset: ["start end", "end start"] });
  const heroY = useTransform(heroProgress, [0, 1], [0, 120]);
  const storyY = useTransform(storyProgress, [0, 1], [-35, 35]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), reducedMotion ? 200 : 1050);
    const onScroll = () => setScrolled(window.scrollY > 35);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-35% 0px -55% 0px" });
    navigation.forEach(item => { const section = document.getElementById(item.id); if (section) observer.observe(section); });
    return () => { window.clearTimeout(timer); window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, [reducedMotion]);

  useEffect(() => {
    if (selectedImage === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null);
      if (event.key === "ArrowRight") setSelectedImage(current => current === null ? null : (current + 1) % gallery.length);
      if (event.key === "ArrowLeft") setSelectedImage(current => current === null ? null : (current + gallery.length - 1) % gallery.length);
    };
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = oldOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [selectedImage]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <AnimatePresence>
        {loading && <motion.div key="preloader" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.55 } }} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background" aria-label="Loading PLABAN MEDICAL HALL">
          <motion.img src={primaryLogo} alt="PLABAN MEDICAL HALL" width={934} height={309} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-56 sm:w-72" />
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, ease }} className="mt-8 mb-5 h-px w-32 origin-left bg-primary" />
          {!reducedMotion && <LoaderCount />}
        </motion.div>}
      </AnimatePresence>

      <header className={`site-header fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || menuOpen ? "is-scrolled" : "text-hero-foreground"}`}>
        <div className="site-container flex h-[78px] items-center justify-between gap-4 lg:h-[92px]">
          <a href="#top" className="hero-logo relative z-10 block shrink-0" aria-label="PLABAN MEDICAL HALL, back to top" onClick={closeMenu}>
            <img src={primaryLogo} alt="PLABAN MEDICAL HALL" width={934} height={309} className="h-auto w-40 sm:w-48 lg:w-52" />
          </a>
          <nav className="hidden items-center gap-9 lg:flex" aria-label="Main navigation">
            {navigation.map(item => <a key={item.id} href={item.href} className={`nav-link editorial-label relative transition-opacity hover:opacity-70 ${active === item.id ? "is-active" : ""}`}>{item.label}</a>)}
          </nav>
          <div className="hidden lg:block"><Button variant={scrolled ? "brand" : "brandOutline"} size="brand" asChild><a href={`tel:+91${phone}`}>Call the pharmacy <span aria-hidden="true">↗</span></a></Button></div>
          <Button variant="ghost" size="icon" className="relative z-10 lg:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            <span className="flex h-5 w-6 flex-col justify-center gap-[5px]"><span className={`block h-px w-full bg-current transition-transform ${menuOpen ? "translate-y-[3px] rotate-45" : ""}`} /><span className={`block h-px w-full bg-current transition-transform ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}`} /></span>
          </Button>
        </div>
        <AnimatePresence>{menuOpen && <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border bg-background lg:hidden" aria-label="Mobile navigation"><div className="site-container flex flex-col gap-0 py-5">{navigation.map(item => <a key={item.id} href={item.href} onClick={closeMenu} className="border-b border-border py-4 font-display text-2xl">{item.label}</a>)}<a href={`tel:+91${phone}`} className="editorial-label py-6 text-primary" onClick={closeMenu}>Call us ↗</a></div></motion.nav>}</AnimatePresence>
      </header>

      <main>
        <section id="top" ref={heroRef} className="relative flex min-h-[570px] h-[88svh] max-h-[940px] items-end overflow-hidden bg-dark-panel text-hero-foreground">
          <motion.img src={heroPhoto.url} alt="Pharmacists at work in an Indian pharmacy in Varanasi" width={1280} height={853} fetchPriority="high" className="absolute inset-0 h-[115%] w-full object-cover object-[50%_48%]" style={reducedMotion ? {} : { y: heroY }} initial={{ scale: 1.12, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.9, ease }} />
          <div className="hero-mask absolute inset-0" />
          <motion.div className="pointer-events-none absolute right-[8%] top-[22%] hidden h-28 w-28 rounded-full border border-line-light lg:block" animate={reducedMotion ? {} : { y: [-8, 8, -8], rotate: [0, 8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="pointer-events-none absolute right-[15%] top-[32%] hidden h-1.5 w-1.5 rounded-full bg-hero-foreground lg:block" animate={reducedMotion ? {} : { y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity }} />
          <div className="site-container relative z-10 flex w-full flex-col justify-end pb-12 pt-32 md:pb-16 lg:pb-20">
            <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-[980px] lg:ml-[4vw]">
              <motion.div variants={fadeUp} className="mb-7 flex items-center gap-4"><span className="h-px w-9 bg-hero-foreground" /><span className="editorial-label">A pharmacy with a personal point of view</span></motion.div>
              <motion.h1 variants={fadeUp} className="editorial-title max-w-[1040px] text-[clamp(4rem,9vw,9.4rem)] leading-[.96]">Plaban <span className="block italic">Medical Hall.</span></motion.h1>
              <motion.div variants={fadeUp} className="mt-8 flex max-w-2xl flex-col gap-7 md:mt-9 md:flex-row md:items-end md:gap-12">
                <p className="max-w-[440px] text-base leading-relaxed text-hero-foreground/85 md:text-lg">Prescriptions, delivery, diagnostics and specialist care. Here for your everyday health needs in Sorbhog.</p>
                <Button variant="brandLight" size="brand" asChild className="w-fit shrink-0"><a href="#offerings">Explore our services <span aria-hidden="true">↗</span></a></Button>
              </motion.div>
            </motion.div>
            <div className="mt-16 flex items-end justify-between border-t border-line-light pt-5 md:mt-20"><span className="editorial-label text-hero-foreground/75">Sorbhog Bazar · Assam, India</span><a href="#story" className="editorial-label hidden items-center gap-3 md:flex">Scroll to explore <span aria-hidden="true" className="text-lg">↓</span></a><span className="editorial-label text-hero-foreground/75 md:hidden">Est. in Sorbhog</span></div>
          </div>
        </section>

        <section className="bg-paper py-10 md:py-14" aria-label="Plaban at a glance"><div className="site-container grid grid-cols-2 gap-y-8 border-y border-border py-8 md:grid-cols-4 md:gap-y-0 md:py-12">{milestones.map((item, index) => <Reveal key={item.label} className={`min-w-0 px-3 sm:px-5 md:px-8 ${index === 0 ? "pl-0 md:pl-0" : ""} ${index === 3 ? "md:pr-0" : ""} ${index > 0 ? "md:border-l md:border-border" : ""}`}><p className="font-display text-5xl text-primary tabular-nums sm:text-6xl"><Count value={item.value} /></p><p className="mt-3 text-xs leading-snug text-ink-soft sm:text-sm">{item.label}</p></Reveal>)}</div></section>

        <section id="story" ref={storyRef} className="overflow-hidden bg-background py-24 md:py-36 lg:py-44">
          <div className="site-container grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-2"><Reveal><p className="editorial-label flex items-center gap-3 text-olive"><span className="inline-block h-px w-7 bg-olive" />01 / Our story</p></Reveal></div>
            <div className="lg:col-span-7 lg:col-start-4"><Reveal><h2 className="editorial-title text-[clamp(2.8rem,5.2vw,5.8rem)]">Good care begins <span className="italic text-olive">with being there.</span></h2></Reveal></div>
             <div className="lg:col-span-3 lg:col-start-4"><Reveal className="max-w-sm"><p className="mt-2 text-base leading-[1.9] text-ink-soft">At Plaban Medical Hall, pharmacy is more than a transaction. It’s a conversation, a little reassurance, and the comfort of seeing someone you know.</p><p className="mt-6 text-base leading-[1.9] text-ink-soft">A neighborhood place for your everyday health needs, grounded in Sorbhog Bazar.</p><div className="mt-9 border-l-2 border-olive pl-5"><p className="editorial-label text-muted-foreground">Your pharmacist in Sorbhog</p><p className="mt-2 font-display text-2xl">Ranit Saha</p></div></Reveal></div>
             <div className="relative lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:-mt-1"><Reveal><div className="relative aspect-[1.12] overflow-hidden rounded-[4px] bg-muted"><motion.img src={detailPhoto.url} alt="A pharmacist viewing medicine shelves in Varanasi, India; not a photograph of Plaban Medical Hall staff" width={1279} height={852} loading="lazy" className="absolute inset-0 h-[115%] w-full object-cover object-[50%_45%]" style={reducedMotion ? {} : { y: storyY }} /></div><p className="editorial-label mt-4 text-muted-foreground">Illustrative photograph · Not Plaban Medical Hall or its staff</p></Reveal></div>
            <Reveal className="lg:col-span-3 lg:col-start-4 lg:self-end"><div className="flex items-center gap-5 border-t border-border pt-7"><img src={iconLogo} alt="" width={255} height={295} loading="lazy" className="h-12 w-12 object-contain" /><p className="text-sm leading-relaxed text-ink-soft">Independent in spirit.<br />Personal by nature.</p></div></Reveal>
          </div>
        </section>

        <section id="offerings" className="overflow-hidden bg-background py-24 md:py-36 lg:py-40">
          <div className="site-container"><div className="grid gap-8 lg:grid-cols-12 lg:gap-5"><Reveal className="lg:col-span-3"><p className="editorial-label flex items-center gap-3 text-olive"><span className="inline-block h-px w-7 bg-olive" />02 / What we do</p></Reveal><Reveal className="lg:col-span-8"><h2 className="editorial-title max-w-4xl text-[clamp(3rem,5.6vw,6rem)]">Care for the <span className="italic text-olive">everyday.</span></h2><p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">From your prescription to specialist appointments, a considered way to look after the people who walk through our doors.</p></Reveal></div><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="mt-16 grid gap-5 md:mt-24 md:grid-cols-2 xl:grid-cols-3">{services.map(service => <motion.article variants={fadeUp} key={service.number} className="service-card flex min-h-[290px] flex-col justify-between rounded-[6px] border border-border bg-card p-7 md:min-h-[340px] md:p-9"><span className="font-display text-4xl italic text-olive/75">{service.number}</span><div><h3 className="font-display text-[2rem] leading-tight md:text-[2.3rem]">{service.title}</h3><p className="mt-5 max-w-[320px] text-sm leading-[1.8] text-ink-soft md:text-base">{service.copy}</p></div><div className="flex items-center justify-between border-t border-border pt-5"><span className="editorial-label text-muted-foreground">Plaban Medical Hall</span><span aria-hidden="true" className="text-2xl text-olive">↗</span></div></motion.article>)}</motion.div><Reveal className="mt-10"><Button variant="brand" size="brand" asChild><a href={`tel:+91${phone}`}>Ask about our services <span aria-hidden="true">↗</span></a></Button></Reveal></div>
        </section>

        <section id="prescriptions" className="bg-paper py-24 md:py-32"><div className="site-container grid items-center gap-12 lg:grid-cols-12 lg:gap-16"><Reveal className="lg:col-span-5"><p className="editorial-label text-olive">03 / Prescriptions & delivery</p><h2 className="editorial-title mt-7 text-[clamp(3rem,5.4vw,6rem)]">Your medicine, <span className="italic text-olive">made easier.</span></h2><p className="mt-7 max-w-lg text-base leading-[1.9] text-ink-soft">Have a prescription? Bring it in or call us to ask how to share it. We can help check your medicines and arrange home delivery where available.</p><p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">Prescription medicines are dispensed against a valid prescription. Call to confirm stock and delivery details.</p><div className="mt-9 flex flex-wrap gap-3"><Button variant="brand" size="brand" asChild><a href={`tel:+91${phone}`}>Call with a prescription <span aria-hidden="true">↗</span></a></Button></div></Reveal><Reveal className="lg:col-span-6 lg:col-start-7"><div className="aspect-[4/3] overflow-hidden rounded-[6px] bg-muted shadow-brand"><img src={tabletsPhoto.url} alt="Real medicine tablets in a blister pack photographed in Howrah, India" width={1280} height={2061} loading="lazy" className="h-full w-full object-cover object-center" /></div><p className="editorial-label mt-4 text-muted-foreground">Medicines, with care in every detail</p></Reveal></div></section>

        <section className="bg-background py-20 md:py-28"><div className="site-container grid gap-8 lg:grid-cols-12"><Reveal className="lg:col-span-4"><p className="editorial-label text-olive">04 / Consultations</p><h2 className="editorial-title mt-7 text-[clamp(2.8rem,4.8vw,5.2rem)]">The right person <span className="italic text-olive">to talk to.</span></h2></Reveal><Reveal className="lg:col-span-7 lg:col-start-6"><p className="max-w-xl text-base leading-[1.9] text-ink-soft">Doctor consultations are available at Plaban Medical Hall. Call us for the next available appointment and consultation details.</p><div className="mt-8 divide-y divide-border border-y border-border">{["MD physician", "Diabetes specialist", "Urologist"].map((specialty, index) => <div key={specialty} className="flex items-center justify-between gap-4 py-5"><span className="font-display text-2xl sm:text-3xl">{specialty}</span><span className="editorial-label shrink-0 text-olive">0{index + 1}</span></div>)}</div><Button variant="brandOutline" size="brand" asChild className="mt-9"><a href={`tel:+91${phone}`}>Ask for an appointment <span aria-hidden="true">↗</span></a></Button></Reveal></div></section>

        <section className="relative min-h-[530px] overflow-hidden bg-dark-panel text-dark-panel-foreground md:min-h-[700px]"><img src={shelvesPhoto.url} alt="Rows of medicine bottles inside an Indian pharmacy in Varanasi" width={1280} height={837} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[45%_50%] opacity-45" /><div className="absolute inset-0 bg-gradient-to-r from-dark-panel via-dark-panel/75 to-transparent" /><div className="site-container relative z-10 flex min-h-[530px] flex-col justify-center py-20 md:min-h-[700px]"><Reveal><p className="editorial-label text-olive-light">A familiar face in your corner</p><blockquote className="editorial-title mt-8 max-w-[780px] text-[clamp(2.7rem,5.5vw,6.2rem)]">Not just the right medicine. <span className="italic">The right attention.</span></blockquote><div className="mt-10 h-px w-12 bg-olive-light" /><p className="mt-5 font-display text-2xl">Ranit Saha</p><p className="editorial-label mt-2 text-dark-panel-foreground/65">Pharmacist · Plaban Medical Hall</p></Reveal></div></section>

        <section id="gallery" className="bg-paper py-24 md:py-36 lg:py-40"><div className="site-container"><div className="grid gap-8 lg:grid-cols-12"><Reveal className="lg:col-span-3"><p className="editorial-label flex items-center gap-3 text-olive"><span className="inline-block h-px w-7 bg-olive" />05 / The gallery</p></Reveal><Reveal className="lg:col-span-8"><h2 className="editorial-title max-w-3xl text-[clamp(3rem,5.5vw,6rem)]">Care you can <span className="italic text-olive">see.</span></h2><p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft">Scenes from real pharmacies in India and real medicines. A visual study of the care behind the counter.</p></Reveal></div><motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="mt-16 grid auto-rows-[175px] grid-cols-2 gap-3 md:mt-20 md:auto-rows-[215px] md:grid-cols-4 md:gap-5 lg:auto-rows-[240px]">{gallery.map((photo, index) => <motion.div variants={fadeUp} key={photo.src} className={`gallery-tile group relative overflow-hidden rounded-[4px] bg-muted ${photo.shape === "large" ? "col-span-2 row-span-2" : photo.shape === "tall" ? "row-span-2" : "col-span-1 row-span-1"}`}><Button variant="ghost" onClick={() => setSelectedImage(index)} aria-label={`View image: ${photo.caption}`} className="absolute inset-0 z-10 h-full w-full rounded-none p-0 hover:bg-transparent"><span className="sr-only">View {photo.caption}</span></Button><img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark-panel/75 to-transparent px-5 pb-5 pt-12 text-dark-panel-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100"><span className="editorial-label">{photo.caption}</span></div></motion.div>)}</motion.div><Reveal><p className="editorial-label mt-6 text-muted-foreground">Editorial photographs from India · Illustrative, not photographs of Plaban Medical Hall or its staff</p></Reveal></div></section>

        <section id="visit" className="bg-background py-24 md:py-36 lg:py-44"><div className="site-container grid items-center gap-14 lg:grid-cols-12 lg:gap-10"><div className="lg:col-span-6"><Reveal><p className="editorial-label flex items-center gap-3 text-olive"><span className="inline-block h-px w-7 bg-olive" />06 / Find us</p><h2 className="editorial-title mt-8 text-[clamp(3.3rem,6vw,7.2rem)]">Come on <span className="italic text-olive">in.</span></h2><p className="mt-7 max-w-md text-base leading-[1.9] text-ink-soft">The next time you need a little help, you know where to find us. We’d be glad to see you.</p><div className="mt-12 grid gap-7 border-y border-border py-9 sm:grid-cols-2"><div><span className="editorial-label text-muted-foreground">Find us at</span><p className="mt-3 font-display text-2xl leading-snug">Sorbhog Bazar<br />Assam, India</p></div><div><span className="editorial-label text-muted-foreground">Give us a call</span><a href={`tel:+91${phone}`} className="mt-3 block font-display text-2xl leading-snug transition-colors hover:text-olive">+91 {phone}</a></div></div><div className="mt-10 flex flex-wrap gap-3"><Button variant="brand" size="brand" asChild><a href={mapsUrl} target="_blank" rel="noopener noreferrer">Get directions <span aria-hidden="true">↗</span></a></Button><Button variant="brandOutline" size="brand" asChild><a href={`tel:+91${phone}`}>Call us <span aria-hidden="true">↗</span></a></Button></div></Reveal></div><Reveal className="lg:col-span-5 lg:col-start-8"><div className="relative aspect-[.88] overflow-hidden rounded-[5px] bg-muted"><img src={storePhoto.url} alt="An Indian medical store in Gangtok, shown as an illustrative photograph" width={1280} height={853} loading="lazy" className="h-full w-full object-cover" /></div><div className="mt-4 flex items-center justify-between gap-3"><p className="editorial-label text-muted-foreground">Illustrative Indian pharmacy photograph</p><a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 font-display text-xl italic text-olive sm:text-2xl">Find your way here ↗</a></div></Reveal></div></section>
      </main>

      <footer className="bg-dark-panel text-dark-panel-foreground"><div className="site-container pt-20 md:pt-28"><div className="grid gap-16 border-b border-line-light pb-20 md:grid-cols-2 lg:grid-cols-12"><div className="lg:col-span-7"><p className="editorial-label text-olive-light">The care you come back to</p><p className="editorial-title mt-7 max-w-2xl text-[clamp(2.7rem,4.5vw,5.3rem)]">Here for the little things. <span className="italic">And everything in between.</span></p></div><div className="lg:col-span-3 lg:col-start-10 lg:self-end"><div className="mb-8 flex items-center gap-3"><img src={iconLogo} alt="" width={255} height={295} loading="lazy" className="h-13 w-12 object-contain brightness-0 invert" /><div className="leading-none"><strong className="block font-display text-2xl font-medium">PLABAN</strong><span className="editorial-label mt-1 block text-[8px]">Medical Hall</span></div></div><p className="text-sm leading-7 text-dark-panel-foreground/65">Sorbhog Bazar, Assam, India<br />+91 {phone}</p><a href={`tel:+91${phone}`} className="editorial-label mt-6 inline-block border-b border-line-light pb-2 transition-colors hover:text-olive-light">Let’s talk ↗</a></div></div><div className="flex flex-col gap-5 py-8 text-[11px] text-dark-panel-foreground/60 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} PLABAN MEDICAL HALL. All rights reserved.</span><div className="flex gap-6"><a href="#top" className="transition-colors hover:text-dark-panel-foreground">Back to top ↑</a><a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-dark-panel-foreground">Get directions ↗</a></div></div><div className="border-t border-line-light py-5 text-[10px] leading-relaxed text-dark-panel-foreground/60"><span>Photography credits: </span><a href="https://commons.wikimedia.org/wiki/File:India_-_Varanasi_pharmacy_-_0822.jpg" target="_blank" rel="noopener noreferrer" className="underline">Jorge Royan</a> (Varanasi pharmacy photographs, CC BY-SA 3.0), <a href="https://commons.wikimedia.org/wiki/File:Pharmacy,_Gangtok,_India_(8083933798).jpg" target="_blank" rel="noopener noreferrer" className="underline">flowcomm</a> (Gangtok pharmacy, CC BY 2.0), <a href="https://commons.wikimedia.org/wiki/File:Favipill_800_-_Favipiravir_Tablets_800_mg_-_Howrah_2023-05-15_9871.jpg" target="_blank" rel="noopener noreferrer" className="underline">Biswarup Ganguly</a> (tablets, CC BY 3.0). Images resized and converted to WebP. These are illustrative photographs of other pharmacies and medicines, not of Plaban Medical Hall.</div></div></footer>

      <AnimatePresence>{selectedImage !== null && <motion.div role="dialog" aria-modal="true" aria-label="Gallery image viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-dark-panel/95 px-5 py-16 text-dark-panel-foreground" onClick={() => setSelectedImage(null)}><Button variant="ghost" size="icon" aria-label="Close gallery" className="absolute right-5 top-5 z-10 text-3xl hover:bg-dark-panel-foreground/10 md:right-9 md:top-8" onClick={() => setSelectedImage(null)}>×</Button><Button variant="ghost" size="icon" aria-label="Previous image" className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-3xl hover:bg-dark-panel-foreground/10 md:left-10" onClick={event => { event.stopPropagation(); setSelectedImage((selectedImage + gallery.length - 1) % gallery.length); }}>←</Button><motion.figure key={selectedImage} initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex max-h-full w-full max-w-5xl flex-col items-center gap-5" onClick={event => event.stopPropagation()}><img src={gallery[selectedImage]?.src} alt={gallery[selectedImage]?.alt ?? "Gallery photograph"} className="max-h-[72vh] max-w-full object-contain shadow-brand-hover" /><figcaption className="editorial-label text-center">{gallery[selectedImage]?.caption} <span className="ml-3 text-dark-panel-foreground/55">{String(selectedImage + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</span></figcaption></motion.figure><Button variant="ghost" size="icon" aria-label="Next image" className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-3xl hover:bg-dark-panel-foreground/10 md:right-10" onClick={event => { event.stopPropagation(); setSelectedImage((selectedImage + 1) % gallery.length); }}>→</Button></motion.div>}</AnimatePresence>
    </>
  );
}