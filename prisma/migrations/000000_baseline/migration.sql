-- Baseline migration
-- Intentionally empty

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
  y INT;
  next_seq INT;
BEGIN
  y := EXTRACT(YEAR FROM NEW."createdAt");

  INSERT INTO invoice_year_sequence (year, last_seq)
  VALUES (y, 1)
  ON CONFLICT (year)
  DO UPDATE
    SET last_seq = invoice_year_sequence.last_seq + 1
  RETURNING last_seq INTO next_seq;

  NEW.year := y;
  NEW.seq := next_seq;
  NEW.number := 'INV-' || y || '-' || next_seq;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER invoice_number_trigger
BEFORE INSERT ON "Invoice"
FOR EACH ROW
EXECUTE FUNCTION generate_invoice_number();