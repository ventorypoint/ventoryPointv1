-- Migration: Fix uuid_v7 function to produce valid 128-bit UUIDs
-- Prevents 22P02 'invalid input syntax for type uuid' errors across all tables

CREATE OR REPLACE FUNCTION public.uuid_v7() 
RETURNS uuid 
LANGUAGE plpgsql 
VOLATILE
SET search_path = public, extensions
AS $$
BEGIN
  RETURN gen_random_uuid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.uuid_v7() TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';
