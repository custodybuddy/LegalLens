import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Select } from '../components/ui/Select';
import { User, Globe, Save, Bell, Eye, Shield, CheckCircle } from 'lucide-react';
import { UserProfile } from '../types/types';
import { getUserProfile, saveUserProfile, createDefaultProfile } from '../services/userProfileService';
import { JURISDICTIONS, CANADIAN_JURISDICTIONS, US_JURISDICTIONS } from '../services/legal/jurisdictions';

export const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const loaded = getUserProfile() || createDefaultProfile();
    setProfile(loaded);
  }, []);

  const handleSave = () => {
    if (!profile) return;
    setLoading(true);
    setSuccessMsg(null);
    
    // Simulate network delay
    setTimeout(() => {
      saveUserProfile(profile);
      setLoading(false);
      setSuccessMsg("Profile settings updated successfully.");
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 600);
  };

  const updateField = (field: keyof UserProfile, value: any) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const updatePreference = (key: keyof UserProfile['preferences'], value: boolean) => {
    if (!profile) return;
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        [key]: value
      }
    });
  };

  if (!profile) return null;

  // Group Jurisdictions
  const canadianJurisdictions = JURISDICTIONS.filter(j => CANADIAN_JURISDICTIONS.includes(j.id));
  const usJurisdictions = JURISDICTIONS.filter(j => US_JURISDICTIONS.includes(j.id));
  const selectedJurisdiction = JURISDICTIONS.find(j => j.id === profile.defaultJurisdictionId);

  return (
    <div className="max-w-[1120px] mx-auto space-y-6 md:space-y-8 animate-[fade-in_0.5s_ease-out] pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-cb-primary mb-2">My Profile</h1>
          <p className="text-sm text-cb-muted">Manage your personal information and legal jurisdiction settings.</p>
        </div>
        <Button 
          onClick={handleSave} 
          isLoading={loading} 
          className="w-full md:w-auto gap-2"
          aria-label="Save profile changes"
        >
          <Save className="w-4 h-4" aria-hidden="true" /> Save Changes
        </Button>
      </header>

      {successMsg && (
        <div 
          role="alert" 
          aria-live="polite" 
          className="bg-green-900/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg flex items-center gap-2 mb-6 animate-fade-in"
        >
          <CheckCircle className="w-4 h-4" aria-hidden="true" /> 
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Personal Info */}
        <section className="md:col-span-2 space-y-6" aria-label="Personal Details">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cb-primary/10 rounded-lg text-cb-primary">
                  <User className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle className="text-xl text-cb-primary">Personal Information</CardTitle>
                  <CardDescription className="text-cb-muted">Basic details for your account</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  value={profile.name} 
                  onChange={(e) => updateField('name', e.target.value)} 
                  placeholder="e.g. Jane Doe"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={profile.email} 
                  onChange={(e) => updateField('email', e.target.value)} 
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  id="role"
                  value={profile.role}
                  onChange={(e) => updateField('role', e.target.value)}
                >
                  <option value="self-represented">Self-Represented Litigant</option>
                  <option value="lawyer">Family Lawyer</option>
                  <option value="legal-assistant">Legal Assistant / Clerk</option>
                  <option value="student">Law Student</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cb-primary/10 rounded-lg text-cb-primary">
                  <Globe className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle className="text-xl text-cb-primary">Jurisdiction Settings</CardTitle>
                  <CardDescription className="text-cb-muted">Set the default context for legal analysis</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jurisdiction">Default Region</Label>
                <Select 
                  id="jurisdiction"
                  value={profile.defaultJurisdictionId}
                  onChange={(e) => updateField('defaultJurisdictionId', e.target.value)}
                  aria-describedby="jurisdiction-notes"
                >
                  <optgroup label="Canada">
                    {canadianJurisdictions.map(j => (
                      <option key={j.id} value={j.id}>{j.region}</option>
                    ))}
                  </optgroup>
                  <optgroup label="United States">
                    {usJurisdictions.map(j => (
                      <option key={j.id} value={j.id}>{j.region}</option>
                    ))}
                  </optgroup>
                </Select>
                {/* Dynamic Notes Display */}
                <div 
                  id="jurisdiction-notes" 
                  className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10 text-xs text-cb-muted leading-relaxed"
                  role="status"
                  aria-live="polite"
                >
                  <span className="text-cb-primary font-bold block mb-1">
                    {selectedJurisdiction?.region} Context:
                  </span>
                  {selectedJurisdiction?.notes}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Right Column: Preferences */}
        <section className="space-y-6" aria-label="App Preferences">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl text-cb-primary">Preferences</CardTitle>
              <CardDescription className="text-cb-muted">Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Notification Preference */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-cb-text font-medium text-sm">
                    <Bell className="w-4 h-4 text-cb-primary" aria-hidden="true" />
                    <Label htmlFor="pref-notifications" className="cursor-pointer">Notifications</Label>
                  </div>
                  <p id="desc-notifications" className="text-xs text-cb-muted">Receive analysis alerts</p>
                </div>
                <input 
                  id="pref-notifications"
                  type="checkbox" 
                  checked={profile.preferences.notifications}
                  onChange={(e) => updatePreference('notifications', e.target.checked)}
                  className="accent-cb-primary h-4 w-4 cursor-pointer focus:ring-2 focus:ring-cb-primary focus:outline-none rounded"
                  aria-describedby="desc-notifications"
                />
              </div>
              <hr className="border-white/10" aria-hidden="true" />
              
              {/* High Contrast Preference */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-cb-text font-medium text-sm">
                    <Eye className="w-4 h-4 text-cb-primary" aria-hidden="true" />
                    <Label htmlFor="pref-contrast" className="cursor-pointer">High Contrast</Label>
                  </div>
                  <p id="desc-contrast" className="text-xs text-cb-muted">Increase UI visibility</p>
                </div>
                <input 
                  id="pref-contrast"
                  type="checkbox" 
                  checked={profile.preferences.highContrast}
                  onChange={(e) => updatePreference('highContrast', e.target.checked)}
                  className="accent-cb-primary h-4 w-4 cursor-pointer focus:ring-2 focus:ring-cb-primary focus:outline-none rounded"
                  aria-describedby="desc-contrast"
                />
              </div>
              <hr className="border-white/10" aria-hidden="true" />
              
              {/* Auto-Redaction Preference */}
              <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-cb-text font-medium text-sm">
                    <Shield className="w-4 h-4 text-cb-primary" aria-hidden="true" />
                    <Label htmlFor="pref-redaction" className="cursor-pointer">Auto-Redaction</Label>
                  </div>
                  <p id="desc-redaction" className="text-xs text-cb-muted">Mask PII by default</p>
                </div>
                <input 
                  id="pref-redaction"
                  type="checkbox" 
                  checked={profile.preferences.autoRedaction}
                  onChange={(e) => updatePreference('autoRedaction', e.target.checked)}
                  className="accent-cb-primary h-4 w-4 cursor-pointer focus:ring-2 focus:ring-cb-primary focus:outline-none rounded"
                  aria-describedby="desc-redaction"
                />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};
