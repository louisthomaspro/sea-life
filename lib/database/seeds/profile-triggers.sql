-- Create a function that creates a profile for a user
create or replace function public.handle_new_user()
  returns trigger as $$
  begin
    insert into public."Profile" (id, email)
    values (new.id, new.email);
    return new;
  end;
  $$ language plpgsql security definer;

  -- Create a trigger that triggers handle_new_user()
  create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


  -- Create a function that deletes a user's profile
  create or replace function public.handle_user_delete()
  returns trigger as $$
  begin
    delete from auth.users where id = old.id;
    return old;
  end;
  $$ language plpgsql security definer;


  -- Create a trigger that triggers handle_user_delete()
  create or replace trigger on_profile_user_deleted
  after delete on public."Profile"
  for each row execute procedure public.handle_user_delete()
      