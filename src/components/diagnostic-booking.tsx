import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CalendarDays, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { diagnosticTests, requestDiagnosticBooking } from "@/lib/diagnostics.functions";

type Window = "Morning" | "Afternoon" | "Evening";
const windows: { name: Window; hours: string }[] = [
  { name: "Morning", hours: "9 AM – 12 PM" },
  { name: "Afternoon", hours: "12 PM – 4 PM" },
  { name: "Evening", hours: "4 PM – 7 PM" },
];

function indianDate(daysAhead: number) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const day = new Date(`${parts}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() + daysAhead);
  return day.toISOString().slice(0, 10);
}

export function DiagnosticBooking() {
  const [step, setStep] = useState(0);
  const [tests, setTests] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [window, setWindow] = useState<Window | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  const selectedTests = tests.filter((test): test is typeof diagnosticTests[number] => diagnosticTests.some((allowed) => allowed === test));
  const toggle = (test: string) => setTests(current => current.includes(test) ? current.filter(item => item !== test) : [...current, test]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!window || !date || !selectedTests.length) return;
    setError("");
    setSending(true);
    try {
      const response = await requestDiagnosticBooking({ data: {
        patientName: name,
        phone: phone.replace(/\D/g, ""),
        age: age === "" ? null : Number(age),
        tests: selectedTests,
        date,
        window,
        notes,
        website,
      } });
      setReference(response.reference);
      setStep(3);
    } catch (cause) {
      setError(cause instanceof Error && /30 days|another request|valid/i.test(cause.message) ? cause.message : "We couldn’t send your request. Please call the pharmacy instead.");
    } finally { setSending(false); }
  }

  return <div className="border-y border-border py-8 md:py-10">
    <div className="flex items-center justify-between gap-3 border-b border-border pb-6">
      <span className="editorial-label text-olive">{step === 3 ? "Request received" : `Step 0${step + 1} / 03`}</span>
      {step !== 3 && <span className="text-xs text-muted-foreground">Sorbhog Bazar, Assam</span>}
    </div>
    <div className="min-h-[355px] pt-9">
      {step === 0 && <motion.div key="tests" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="font-display text-3xl md:text-4xl">Which tests do you need?</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">Choose one or more. The pharmacy will confirm which tests are available.</p>
        <div className="mt-8 grid gap-2 sm:grid-cols-2">{diagnosticTests.map(test => <Button key={test} type="button" variant="outline" aria-pressed={tests.includes(test)} onClick={() => toggle(test)} className={`h-auto min-h-14 justify-between whitespace-normal rounded-[4px] px-4 py-3 text-left text-sm font-normal ${tests.includes(test) ? "border-primary bg-secondary text-primary" : "bg-card text-foreground"}`}><span>{test}</span><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${tests.includes(test) ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{tests.includes(test) && <Check size={13} />}</span></Button>)}</div>
        <Button type="button" variant="brand" size="brand" disabled={!tests.length} onClick={() => setStep(1)} className="mt-8">Continue <ArrowRight size={16} /></Button>
      </motion.div>}
      {step === 1 && <motion.div key="slot" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="font-display text-3xl md:text-4xl">When would suit you?</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">Select a preferred date and time window. These are requests, not live availability; we’ll confirm your appointment by phone.</p>
        <label htmlFor="booking-date" className="editorial-label mt-8 block text-olive">Preferred date</label>
        <div className="relative mt-3 max-w-sm"><CalendarDays size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-olive" /><input id="booking-date" type="date" min={indianDate(0)} max={indianDate(30)} value={date} onChange={event => setDate(event.target.value)} className="h-14 w-full rounded-[4px] border border-border bg-card pl-12 pr-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20" /></div>
        <span className="editorial-label mt-8 block text-olive">Preferred window</span>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">{windows.map(slot => <Button type="button" key={slot.name} variant="outline" aria-pressed={window === slot.name} onClick={() => setWindow(slot.name)} className={`h-auto min-h-20 flex-col items-start rounded-[4px] px-4 py-3 text-left ${window === slot.name ? "border-primary bg-secondary text-primary" : "bg-card text-foreground"}`}><span className="font-display text-lg">{slot.name}</span><span className="text-xs font-normal text-ink-soft">{slot.hours}</span></Button>)}</div>
        <div className="mt-8 flex flex-wrap gap-3"><Button type="button" variant="brandOutline" size="brand" onClick={() => setStep(0)}><ArrowLeft size={16} /> Back</Button><Button type="button" variant="brand" size="brand" disabled={!date || !window} onClick={() => setStep(2)}>Continue <ArrowRight size={16} /></Button></div>
      </motion.div>}
      {step === 2 && <motion.form key="details" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit}>
        <h3 className="font-display text-3xl md:text-4xl">Who is the booking for?</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">We’ll use these details only to follow up about this request.</p>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium">Patient name <input required minLength={2} maxLength={120} autoComplete="name" value={name} onChange={event => setName(event.target.value)} className="mt-2 h-13 w-full rounded-[4px] border border-border bg-card px-4 outline-none focus:border-primary" placeholder="Full name" /></label>
          <label className="block text-sm font-medium">Mobile number <input required type="tel" inputMode="numeric" pattern="[6-9][0-9]{9}" autoComplete="tel" value={phone} onChange={event => setPhone(event.target.value)} className="mt-2 h-13 w-full rounded-[4px] border border-border bg-card px-4 outline-none focus:border-primary" placeholder="10-digit number" /></label>
          <label className="block text-sm font-medium">Age <span className="font-normal text-muted-foreground">(optional)</span><input type="number" min="0" max="120" value={age} onChange={event => setAge(event.target.value)} className="mt-2 h-13 w-full rounded-[4px] border border-border bg-card px-4 outline-none focus:border-primary" placeholder="Age in years" /></label>
          <label className="block text-sm font-medium">Note <span className="font-normal text-muted-foreground">(optional)</span><input maxLength={500} value={notes} onChange={event => setNotes(event.target.value)} className="mt-2 h-13 w-full rounded-[4px] border border-border bg-card px-4 outline-none focus:border-primary" placeholder="Anything we should know?" /></label>
        </div>
        <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={event => setWebsite(event.target.value)} className="absolute left-[-9999px]" />
        <div className="mt-7 bg-secondary px-5 py-4 text-sm leading-relaxed text-secondary-foreground"><strong className="font-medium">Your request</strong> · {selectedTests.join(", ")} · {date && new Date(`${date}T12:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · {window}</div>
        {error && <p role="alert" className="mt-5 text-sm text-destructive">{error}</p>}
        <div className="mt-8 flex flex-wrap gap-3"><Button type="button" variant="brandOutline" size="brand" onClick={() => setStep(1)}><ArrowLeft size={16} /> Back</Button><Button type="submit" variant="brand" size="brand" disabled={sending}>{sending ? "Sending…" : "Request appointment"} <ArrowRight size={16} /></Button></div>
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">No payment is taken. Final test availability, timing and preparation are confirmed by the pharmacy.</p>
      </motion.form>}
      {step === 3 && <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} role="status" className="max-w-xl"><span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary"><Check size={24} /></span><h3 className="font-display text-4xl">Your request is in.</h3><p className="mt-5 text-base leading-relaxed text-ink-soft">We’ve received your preferred diagnostics appointment for {name}. The pharmacy will call {phone} to confirm test availability, your date and time. This is not a confirmed booking yet.</p><p className="editorial-label mt-7 text-olive">Reference · {reference}</p><p className="mt-5 text-sm text-ink-soft">Need to make a change? Call us directly.</p><Button variant="brandOutline" size="brand" asChild className="mt-5"><a href="tel:+918918800371"><Phone size={16} /> Call the pharmacy</a></Button></motion.div>}
    </div>
  </div>;
}