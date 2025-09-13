// app/candidate-profile/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function CandidateProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("first_name, last_name, headline, resume_url, avatar_url, linkedin, email")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    redirect("/candidate-dashboard");
  }

  async function updateProfile(formData: FormData) {
    "use server";
    const supabase = await createClient();

    const updates = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      headline: formData.get("headline"),
      resume_url: formData.get("resume_url"),
      avatar_url: formData.get("avatar_url"),
      linkedin: formData.get("linkedin"),
      email: formData.get("email"),
    };

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
    }

    redirect("/candidate-profile"); // refresh page after submit
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
      <a
        href="/candidate-dashboard"
        className="mb-4 inline-block text-sm border border-green-400 px-2 py-1 hover:bg-green-900"
      >
        ← Back
      </a>

      <h1 className="text-3xl mb-6">Edit Profile</h1>

      <form action={updateProfile} className="space-y-4 max-w-lg">
        {Object.entries(profile || {}).map(([key, value]) => (
          <div key={key}>
            <label className="block mb-1 capitalize">{key.replace("_", " ")}</label>
            <input
              type="text"
              name={key}
              defaultValue={value ?? ""}
              className="w-full bg-black border border-green-400 p-2 text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}
        <button
          type="submit"
          className="mt-4 px-4 py-2 border border-green-400 hover:bg-green-900"
        >
          ./update-profile
        </button>
      </form>
    </div>
  );
}
