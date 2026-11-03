-- Additive flag so products can appear in New Arrivals without changing primary category.
ALTER TABLE product
  ADD COLUMN IF NOT EXISTS show_in_new_arrivals BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS product_show_in_new_arrivals_idx
  ON product (show_in_new_arrivals)
  WHERE deleted_at IS NULL AND show_in_new_arrivals = TRUE;
