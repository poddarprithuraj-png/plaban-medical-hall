CREATE TABLE public.diagnostic_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL CHECK (char_length(patient_name) BETWEEN 2 AND 120),
  phone text NOT NULL CHECK (phone ~ '^[6-9][0-9]{9}$'),
  patient_age integer CHECK (patient_age BETWEEN 0 AND 120),
  selected_tests text[] NOT NULL CHECK (array_length(selected_tests, 1) BETWEEN 1 AND 8),
  preferred_date date NOT NULL,
  preferred_window text NOT NULL CHECK (preferred_window IN ('Morning', 'Afternoon', 'Evening')),
  notes text CHECK (char_length(notes) <= 500),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.diagnostic_requests TO service_role;
ALTER TABLE public.diagnostic_requests ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.set_diagnostic_request_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER diagnostic_requests_updated_at
BEFORE UPDATE ON public.diagnostic_requests FOR EACH ROW
EXECUTE FUNCTION public.set_diagnostic_request_updated_at();