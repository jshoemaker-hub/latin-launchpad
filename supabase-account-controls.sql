-- Apply once to the production Supabase project after the base schema.
-- Lets an authenticated user delete only their own learning data and Auth user.

CREATE OR REPLACE FUNCTION public.delete_current_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  account_id uuid := auth.uid();
  account_email text;
BEGIN
  IF account_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT email INTO account_email
  FROM auth.users
  WHERE id = account_id;

  DELETE FROM public.user_profiles WHERE email = account_email;
  DELETE FROM auth.users WHERE id = account_id;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_current_account() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.delete_current_account() FROM anon;
GRANT EXECUTE ON FUNCTION public.delete_current_account() TO authenticated;
