'use client'

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, headline, resume_url, avatar_url, linkedin, email')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      router.push('/candidate-dashboard');
      return;
    }

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
      
      if (data.avatar_url) {
        setPreviewUrl(data.avatar_url);
      }
    }
    
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfilePicture = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    setUploading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/profile-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('user_data')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('user_data')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + (error as Error).message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async () => {
    setSaving(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      let avatarUrl = profile.avatar_url;
      if (selectedFile) {
        const uploadedUrl = await uploadProfilePicture();
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        } else {
          setSaving(false);
          return;
        }
      }

      const updates = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        headline: profile.headline,
        resume_url: profile.resume_url,
        avatar_url: avatarUrl,
        linkedin: profile.linkedin,
        email: profile.email,
      };

      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile: ' + error.message);
      } else {
        setProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
        setSelectedFile(null);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile: ' + (error as Error).message);
    }
    
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden font-sans text-white">
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-75"
          style={{ backgroundImage: "url('/hero-tech-city.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80"></div>
        <div className="relative z-10 p-12">
          <p className="text-2xl font-mono text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-white">
      {/* Hero Image / Background */}
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-75"
        style={{ backgroundImage: "url('/hero-tech-city.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80"></div>

      <div className="relative z-10 p-12 max-w-3xl mx-auto">
        <a
          href="/candidate-dashboard"
          className="mb-8 inline-block px-4 py-2 rounded-xl bg-black/50 text-white font-mono shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
        >
          ← Back
        </a>

        <div className="bg-black/60 backdrop-blur-lg border border-gray-700 rounded-3xl p-10 shadow-2xl">
          <h1 className="text-5xl font-serif font-extrabold mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400">
            Edit Profile
          </h1>

          <div className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="border border-gray-600 p-4 rounded-xl flex items-center space-x-4">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Profile preview" 
                  className="w-20 h-20 rounded-full border border-indigo-400 object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border border-indigo-400 flex items-center justify-center">
                  <span className="text-xs text-gray-400">NO IMG</span>
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="text-xs text-gray-300 file:bg-black/50 file:border file:border-indigo-400 file:text-indigo-400 file:px-2 file:py-1 file:text-xs"
                />
                {selectedFile && (
                  <p className="text-xs text-gray-300 mt-1 truncate max-w-xs">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-4">
              {Object.entries(profile).map(([key, value]) => {
                if (key === 'avatar_url') return null; // Skip avatar_url since we handle it above
                return (
                  <div key={key}>
                    <label className="block mb-1 capitalize text-gray-300">{key.replace("_", " ")}</label>
                    <input
                      type="text"
                      value={value as string}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full bg-black/40 border border-indigo-400 p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl transition-all"
                    />
                  </div>
                );
              })}
            </div>

            <button
              onClick={updateProfile}
              disabled={saving || uploading}
              className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-indigo-400/50 transform hover:scale-105 transition-all duration-300"
            >
              {uploading ? './uploading-image...' : saving ? './updating-profile...' : './update-profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
