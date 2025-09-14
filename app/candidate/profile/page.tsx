'use client'

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";

export default function CandidateProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    headline: '',
    resume_url: '',
    avatar_url: '',
    linkedin: '',
    email: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const supabase = createClient();
  const router = useRouter();

  // Animation Variants
  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
  };

  const shardVariants: Variants = {
    hidden: (custom: {x:number, y:number, rotate:number}) => ({
      opacity: 0,
      x: custom.x,
      y: custom.y,
      rotate: custom.rotate,
      scale: 0.5
    }),
    visible: { 
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 20 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.6, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/login');

    const { data, error } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, headline, resume_url, avatar_url, linkedin, email')
      .eq('id', user.id)
      .single();

    if (error) return router.push('/candidate');

    if (data) {
      setProfile({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        headline: data.headline || '',
        resume_url: data.resume_url || '',
        avatar_url: data.avatar_url || '',
        linkedin: data.linkedin || '',
        email: data.email || ''
      });
      if (data.avatar_url) setPreviewUrl(data.avatar_url);
    }

    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadProfilePicture = async (): Promise<string | null> => {
    if (!selectedFile) return null;
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/profile-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('user_data')
        .upload(fileName, selectedFile, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('user_data')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (err) {
      console.error(err);
      alert('Error uploading image: ' + (err as Error).message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/login');

    try {
      let avatarUrl = profile.avatar_url;
      if (selectedFile) {
        const uploadedUrl = await uploadProfilePicture();
        if (uploadedUrl) avatarUrl = uploadedUrl;
        else { setSaving(false); return; }
      }

      const updates = { ...profile, avatar_url: avatarUrl };

      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) alert('Error updating profile: ' + error.message);
      else { setProfile(prev => ({ ...prev, avatar_url: avatarUrl })); setSelectedFile(null); alert('Profile updated!'); }

    } catch (err) { console.error(err); alert('Error saving profile: ' + (err as Error).message); }

    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl text-gray-300 font-mono">Loading elite profile...</p>
      </div>
    </div>
  );

  const shards = [
    { x:-200, y:-100, rotate:-30 },
    { x:180, y:-120, rotate:20 },
    { x:-150, y:130, rotate:10 },
    { x:150, y:100, rotate:-15 },
    { x:0, y:-180, rotate:45 },
    { x:0, y:180, rotate:-45 }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative p-8 min-h-screen bg-black text-green-400 font-mono flex flex-col items-center overflow-hidden"
    >
      {/* Background Shards Spread Across */}
      {shards.map((s, i) => (
        <motion.div
          key={i}
          custom={s}
          variants={shardVariants}
          className="absolute w-48 h-48 bg-gradient-to-r from-green-500 to-blue-500/50 rounded-xl opacity-20 blur-3xl shadow-xl"
        />
      ))}

      {/* Header */}
      <motion.div className="text-center z-10 mb-12">
        <h1 className="text-8xl md:text-9xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 drop-shadow-lg">
          ELITE CARD
        </h1>
        <p className="text-gray-300 text-2xl font-light drop-shadow-sm">
          Assemble your professional Pokémon card
        </p>
      </motion.div>

      {/* Profile Card as a Form */}
      <motion.form
        onSubmit={(e) => { e.preventDefault(); updateProfile(); }}
        variants={cardVariants}
        className="relative bg-black/70 backdrop-blur-3xl border-4 border-gradient-to-r border-green-400/50 rounded-3xl shadow-2xl shadow-green-400/40 p-8 max-w-xl w-full z-10 overflow-hidden flex flex-col items-center space-y-6"
      >
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl pointer-events-none" />

        {/* Avatar */}
        <div className="flex justify-center relative z-10">
          {previewUrl ? (
            <img src={previewUrl} alt="Avatar" className="w-32 h-32 rounded-3xl border-4 border-green-400 shadow-lg shadow-green-400/50 object-cover"/>
          ) : (
            <div className="w-32 h-32 border-4 border-green-400 rounded-3xl flex items-center justify-center bg-green-400/10">
              <span className="text-sm text-green-300">NO IMG</span>
            </div>
          )}
        </div>

        {/* File Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="text-sm text-green-300 file:bg-green-900/50 file:border file:border-green-400 file:text-green-400 file:px-3 file:py-2 file:rounded font-mono"
        />

        {/* Profile Fields */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {Object.entries(profile).map(([key, value]) => {
            if (key === 'avatar_url') return null;
            const label = key.replace("_"," ").toUpperCase();
            return (
              <div key={key} className="flex flex-col p-3 border-2 border-green-400/30 rounded-xl bg-black/50">
                <label className="text-xs text-green-300">{label}</label>
                <input
                  type="text"
                  value={value as string}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="bg-black/70 border border-green-400/50 p-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 font-mono"
                />
              </div>
            )
          })}
        </div>

        <button
          type="submit"
          disabled={saving || uploading}
          className="mt-4 w-full px-6 py-3 border-2 border-green-400 hover:bg-green-900/50 disabled:opacity-50 disabled:cursor-not-allowed text-green-400 font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-400/25"
        >
          {uploading ? './uploading-image...' : saving ? './updating-profile...' : './update-profile --save'}
        </button>
      </motion.form>
    </motion.div>
  );
}
