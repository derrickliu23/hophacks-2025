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
      router.push('/candidate');
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
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading elite profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          Elite Profile
        </h1>
        <p className="text-xl text-gray-300 font-light">
          Craft your professional digital presence
        </p>
      </div>

      {/* Profile Container */}
      <div className="relative bg-black/60 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-blue-600/20 to-purple-600/20 rounded-3xl blur-xl" />
        
        <div className="relative p-8">
          <div className="bg-black/90 rounded-2xl p-8 font-mono border border-green-400/30">
            <div className="flex items-center mb-6">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              <h2 className="text-2xl text-green-400 font-bold">./profile_editor</h2>
              <div className="ml-auto text-green-300 text-sm">SECURE CONNECTION</div>
            </div>

            {/* Profile Picture Upload */}
            <div className="border border-green-400/50 p-6 rounded-lg mb-6 bg-green-400/5">
              <label className="block mb-3 text-green-400 font-semibold text-sm">AVATAR_CONFIG</label>
              <div className="flex items-center space-x-6">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Profile preview" 
                    className="w-20 h-20 rounded-lg border-2 border-green-400 object-cover shadow-lg shadow-green-400/25"
                  />
                ) : (
                  <div className="w-20 h-20 border-2 border-green-400/50 flex items-center justify-center rounded-lg bg-green-400/10">
                    <span className="text-xs text-green-300">NO_IMG</span>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="text-sm text-green-300 file:bg-green-900/50 file:border file:border-green-400 file:text-green-400 file:px-3 file:py-2 file:text-sm file:rounded file:font-mono"
                  />
                  {selectedFile && (
                    <p className="text-sm text-green-300 mt-2 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-6">
              {Object.entries(profile).map(([key, value]) => {
                if (key === 'avatar_url') return null; // Skip avatar_url since we handle it above
                const fieldName = key.replace("_", " ").toUpperCase();
                return (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-semibold text-green-400">
                      {fieldName}:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-green-400 text-sm">$</span>
                      <input
                        type="text"
                        value={value as string}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="w-full bg-black/80 border border-green-400/50 p-3 pl-8 text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 rounded font-mono transition-all duration-300"
                        placeholder={`Enter ${fieldName.toLowerCase()}...`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={updateProfile}
              disabled={saving || uploading}
              className="mt-8 w-full px-6 py-3 border-2 border-green-400 hover:bg-green-900/50 disabled:opacity-50 disabled:cursor-not-allowed text-green-400 font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-400/25"
            >
              {uploading ? './uploading-image...' : saving ? './updating-profile...' : './update-profile --save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
