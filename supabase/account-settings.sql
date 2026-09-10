-- Run this once in the Supabase SQL Editor for projects that already ran schema.sql.
-- Keep public.profiles.email aligned after a user confirms an email-address change.

drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed
after insert or update of email on auth.users
for each row execute function public.handle_new_user();
