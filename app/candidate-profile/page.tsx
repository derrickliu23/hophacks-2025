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
      <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
        <p>Loading profile...</p>
      </div>
    );
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

      <div className="space-y-6 max-w-lg">
        {/* Profile Picture Upload */}
        <div className="border border-green-400 p-4">
          <label className="block mb-2 text-green-400">Profile Picture</label>
          <div className="flex items-center space-x-4 mb-4">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Profile preview" 
                className="w-16 h-16 rounded border border-green-400 object-cover"
              />
            ) : (
              <div className="w-16 h-16 border border-green-400 flex items-center justify-center">
                <span className="text-xs">NO IMG</span>
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="text-xs text-green-300 file:bg-black file:border file:border-green-400 file:text-green-400 file:px-2 file:py-1 file:text-xs"
              />
              {selectedFile && (
                <p className="text-xs text-green-300 mt-1">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="space-y-4">
          {Object.entries(profile).map(([key, value]) => {
            if (key === 'avatar_url') return null; // Skip avatar_url since we handle it above
            return (
              <div key={key}>
                <label className="block mb-1 capitalize">{key.replace("_", " ")}</label>
                <input
                  type="text"
                  value={value as string}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="w-full bg-black border border-green-400 p-2 text-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            );
          })}
        </div>

        <button
          onClick={updateProfile}
          disabled={saving || uploading}
          className="mt-4 px-4 py-2 border border-green-400 hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? './uploading-image...' : saving ? './updating-profile...' : './update-profile'}
        </button>
      </div>
    </div>
  );
}
