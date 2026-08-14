"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/brand";
import { createClient } from "@/lib/supabase/client";

type ProfileForm = {
  name: string;
  handle: string;
  headline: string;
  bio: string;
  whatsapp: string;
  portfolio: string;
  avatar_url: string;
};

const emptyProfile: ProfileForm = {
  name: "",
  handle: "",
  headline: "",
  bio: "",
  whatsapp: "",
  portfolio: "",
  avatar_url: "",
};

const profileFields =
  "name,handle,headline,bio,whatsapp,portfolio,avatar_url";

export default function CreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>(emptyProfile);
  const [userId, setUserId] = useState("");
  const [hasPublishedProfile, setHasPublishedProfile] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function loadProfile() {
      if (!supabase) {
        router.replace("/");
        return;
      }

      const { data: authData } = await supabase.auth.getUser();
      if (!active) return;
      if (!authData.user) {
        router.replace("/");
        return;
      }

      setUserId(authData.user.id);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select(profileFields)
        .eq("id", authData.user.id)
        .maybeSingle();

      if (!active) return;
      if (error) {
        setMessage("We couldn’t load your profile. Please refresh and try again.");
      } else if (profile) {
        setForm(profile as ProfileForm);
        setHasPublishedProfile(true);
      }
      setInitializing(false);
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [router]);

  function updateField(key: keyof ProfileForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    if (!userId || initializing) return;

    const handle = form.handle.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (handle.length < 3) {
      setMessage("Choose a handle with at least 3 characters.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase!.from("profiles").upsert({
      ...form,
      handle,
      id: userId,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);

    if (error) {
      setMessage(
        error.code === "23505" ? "That handle is already taken." : error.message,
      );
      return;
    }
    router.push(`/done?handle=${handle}`);
  }

  async function signOut() {
    await createClient()?.auth.signOut();
    router.push("/");
  }

  return (
    <main className="editor">
      <section className="form-side">
        <div className="editor-top">
          <Brand />
          <button className="text-btn" onClick={signOut}>Sign out</button>
        </div>
        <div className="step">Your page · one quick step</div>
        <h1>Tell people<br />who you are.</h1>
        <p className="form-intro">
          Only add what matters. You can come back and change it anytime.
        </p>

        {initializing ? (
          <div className="form-loading" role="status">Loading your profile…</div>
        ) : (
          <form onSubmit={submit}>
            <div className="row">
              <div className="field">
                <label htmlFor="name">Your name *</label>
                <input id="name" required value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Your name" />
              </div>
              <div className="field">
                <label htmlFor="handle">Your link *</label>
                <input id="handle" required maxLength={30} disabled={hasPublishedProfile} value={form.handle} onChange={(event) => updateField("handle", event.target.value)} placeholder="your-name" />
                {hasPublishedProfile && <small>Your link is permanent so previously shared URLs and QR codes keep working.</small>}
              </div>
            </div>
            <div className="field">
              <label htmlFor="headline">What you do *</label>
              <input id="headline" required value={form.headline} onChange={(event) => updateField("headline", event.target.value)} placeholder="Designer, founder, photographer…" />
            </div>
            <div className="field">
              <label htmlFor="bio">A short hello</label>
              <textarea id="bio" maxLength={180} value={form.bio} onChange={(event) => updateField("bio", event.target.value)} placeholder="A sentence or two is plenty." />
            </div>
            <div className="row">
              <div className="field">
                <label htmlFor="whatsapp">WhatsApp number</label>
                <input id="whatsapp" value={form.whatsapp} onChange={(event) => updateField("whatsapp", event.target.value)} placeholder="Include country code" />
              </div>
              <div className="field">
                <label htmlFor="portfolio">Website or portfolio</label>
                <input id="portfolio" type="url" value={form.portfolio} onChange={(event) => updateField("portfolio", event.target.value)} placeholder="https://" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="avatar">Photo URL</label>
              <input id="avatar" type="url" value={form.avatar_url} onChange={(event) => updateField("avatar_url", event.target.value)} placeholder="https://your-photo.jpg" />
            </div>
            {message && <div className="error">{message}</div>}
            <button className="primary-btn" disabled={saving}>
              {saving ? "Publishing…" : hasPublishedProfile ? "Save changes →" : "Publish my page →"}
            </button>
          </form>
        )}
      </section>
      <aside className="preview-side">
        <div className="preview-label">Live preview</div>
        <ProfilePreview form={form} />
      </aside>
    </main>
  );
}

function ProfilePreview({ form }: { form: ProfileForm }) {
  return (
    <div className="phone">
      <div className="avatar">
        {form.avatar_url ? <img src={form.avatar_url} alt="" width="92" height="92" /> : (form.name[0] || "?")}
      </div>
      <h3>{form.name || "Your name"}</h3>
      <p className="headline">{form.headline || "What you do"}</p>
      <p className="bio">{form.bio || "Your short introduction will appear here."}</p>
      {form.whatsapp && <span className="action dark">WhatsApp me</span>}
      {form.portfolio && <span className="action">View my work</span>}
    </div>
  );
}
