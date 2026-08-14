"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Brand } from "@/components/brand";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  async function signIn() {
    const supabase = createClient();
    if (!supabase) return;
    setLoading(true);
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback` } });
    setLoading(false);
  }
  return <main className="shell">
    <nav className="nav"><Brand /><div className="nav-note">Your profile. One minute. No clutter.</div></nav>
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot" /> Made for real-world connections</div>
        <h1>One link.<br/>You’re <span className="accent">connected.</span></h1>
        <p className="sub">A simple page with the few things people need to remember you. Create yours, share it, get on with your day.</p>
        <div className="tiny-proof"><span /> No dashboard to learn. No setup maze.</div>
      </div>
      <aside className="login-panel"><div className="login-card">
        <h2>Make your page.</h2><p>Sign in once. Add your details. You’re live.</p>
        {!configured && <div className="setup-note">Connect Supabase using the three environment variables in <b>.env.example</b> to enable Google sign-in.</div>}
        <button className="google-btn" disabled={!configured || loading} onClick={signIn}><span className="google-icon">G</span>{loading ? "Opening Google…" : "Continue with Google"}<ArrowRight size={18}/></button>
        <div className="login-fine">Free to create · Takes about 60 seconds</div>
      </div></aside>
    </section>
  </main>;
}
