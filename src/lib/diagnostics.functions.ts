import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const diagnosticTests = [
  "Complete blood count (CBC)",
  "Blood glucose",
  "HbA1c",
  "Lipid profile",
  "Thyroid profile",
  "Liver function test",
  "Kidney function test",
  "Urine routine",
] as const;

const requestSchema = z.object({
  patientName: z.string().trim().min(2).max(120),
  phone: z.string().regex(/^[6-9][0-9]{9}$/, "Enter a valid 10-digit Indian mobile number"),
  age: z.number().int().min(0).max(120).nullable(),
  tests: z.array(z.enum(diagnosticTests)).min(1).max(8),
  date: z.iso.date(),
  window: z.enum(["Morning", "Afternoon", "Evening"]),
  notes: z.string().trim().max(500),
  website: z.string().max(0),
});

export const requestDiagnosticBooking = createServerFn({ method: "POST" })
  .inputValidator((data) => requestSchema.parse(data))
  .handler(async ({ data }) => {
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    const maxDate = new Date(`${today}T00:00:00Z`);
    maxDate.setUTCDate(maxDate.getUTCDate() + 30);
    if (data.date < today || data.date > maxDate.toISOString().slice(0, 10)) {
      throw new Error("Please choose a date within the next 30 days.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabaseAdmin
      .from("diagnostic_requests")
      .select("id", { count: "exact", head: true })
      .eq("phone", data.phone)
      .gte("created_at", since);
    if (countError) throw new Error("We couldn’t send your request. Please call the pharmacy instead.");
    if ((count ?? 0) >= 3) throw new Error("Please call the pharmacy to make another request today.");

    const { data: booking, error } = await supabaseAdmin
      .from("diagnostic_requests")
      .insert({
        patient_name: data.patientName,
        phone: data.phone,
        patient_age: data.age,
        selected_tests: data.tests,
        preferred_date: data.date,
        preferred_window: data.window,
        notes: data.notes || null,
      })
      .select("id")
      .single();
    if (error || !booking) throw new Error("We couldn’t send your request. Please call the pharmacy instead.");
    return { reference: booking.id.slice(0, 8).toUpperCase() };
  });