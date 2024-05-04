import prisma from "@/lib/prisma"

async function main() {
  // Create a function that creates a profile for a user
  await prisma.$executeRaw`
        create or replace function public.handle_new_user()
        returns trigger as $$
        begin
          insert into public.profile (id)
          values (new.id);
          return new;
        end;
        $$ language plpgsql security definer;
        `

  // Create a trigger that will create a profile for a user when they are created
  await prisma.$executeRaw`
        create or replace trigger on_auth_user_created
        after insert on auth.users
        for each row execute procedure public.handle_new_user();
      `

  // Create a function that deletes a user's profile
  await prisma.$executeRaw`
        create or replace function public.handle_user_delete()
        returns trigger as $$
        begin
          delete from auth.users where id = old.id;
          return old;
        end;
        $$ language plpgsql security definer;
      `

  // Create a trigger that will delete a user's profile when the user is deleted
  await prisma.$executeRaw`
        create or replace trigger on_profile_user_deleted
        after delete on public.profile
        for each row execute procedure public.handle_user_delete()
      `

  console.log("Finished adding triggers and functions for profile handling.")
  process.exit()
}

main()
