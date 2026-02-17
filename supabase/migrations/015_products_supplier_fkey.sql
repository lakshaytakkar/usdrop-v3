DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'products_supplier_id_fkey'
    AND table_name = 'products'
  ) THEN
    ALTER TABLE public.products
    ADD CONSTRAINT products_supplier_id_fkey
    FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id)
    ON DELETE SET NULL;
  END IF;
END $$;
