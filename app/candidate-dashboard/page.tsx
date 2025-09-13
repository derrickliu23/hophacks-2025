import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

function DashboardButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block w-full text-center px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-indigo-400/50 transform hover:scale-105 transition-all duration-300"
    >
      {children}
    </Link>
  );
}

export default async function CandidateDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile?.role) redirect("/role");
  if (profile.role !== "candidate") redirect("/recruiter-dashboard");

  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  const cards = [
    { title: "Profile", desc: "Manage your elite profile", href: "/candidate-profile" },
    { title: "Job Search", desc: "Seek unparalleled opportunities", href: "#" },
    { title: "Applications", desc: "Monitor your strategic pursuits", href: "/candidate-application" },
    { title: "Resume", desc: "Curate and refine your dossier", href: "#" },
    { title: "Saved Jobs", desc: "Track your chosen quests", href: "#" },
    { title: "Messages", desc: "Communicate with distinguished recruiters", href: "#" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-white">
      {/* Hero Image / Background */}
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-75"
        style={{ backgroundImage: "url('/hero-tech-city.jpg')" }}
      ></div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80"></div>

      <div className="relative z-10 p-12 max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <h1 className="text-6xl lg:text-8xl font-serif font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400">
            Candidate Dashboard
          </h1>
          <p className="mt-4 text-xl text-gray-300 italic">
            Navigate the realms of ambition, intellect, and prestige.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {cards.map((card) => (
            <div
              key={card.title}
              className="relative bg-black/60 backdrop-blur-lg border border-gray-700 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:-translate-y-2"
            >
              <h2 className="text-3xl font-bold mb-3 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                {card.title}
              </h2>
              <p className="text-gray-300 mb-6">{card.desc}</p>
              <DashboardButton href={card.href}>{`./${card.title.replace(" ", "-").toLowerCase()}`}</DashboardButton>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <form action={signOut}>
            <button className="px-8 py-4 bg-red-600 rounded-2xl font-bold text-white shadow-xl hover:shadow-red-500/50 hover:scale-105 transition-all duration-300">
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
