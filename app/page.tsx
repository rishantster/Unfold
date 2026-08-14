"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/brand";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  useEffect(() => {
    const supabase = createClient();
    supabase?.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/create");
    });
  }, [router]);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase) return;
    setError("");
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setSent(true);
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
        {sent ? <div className="email-sent"><CheckCircle2 size={30}/><h2>Check your inbox.</h2><p>We sent a sign-in link to <strong>{email}</strong>. Click it and you’re in—no password needed.</p><button className="text-btn" onClick={()=>setSent(false)}>Use a different email</button></div> : <>
          <h2>Make your page.</h2><p>Enter your email. We’ll send you a secure sign-in link—no Google account or password needed.</p>
          {!configured && <div className="setup-note">Supabase environment variables are not available yet. Add the values from <b>.env.example</b> to enable sign-in.</div>}
          <form onSubmit={signIn} className="login-form"><label htmlFor="email">Email address</label><div className="email-input"><Mail size={18}/><input id="email" type="email" autoComplete="email" required value={email} onChange={event=>setEmail(event.target.value)} placeholder="you@example.com"/></div>{error&&<div className="error">{error}</div>}<button className="primary-btn" disabled={!configured||loading}>{loading?"Sending link…":"Email me a sign-in link"}<ArrowRight size={18}/></button></form>
          <div className="login-fine">No password · No Google setup · Free to create</div>
        </>}
      </div></aside>
    </section>
  </main>;
}
