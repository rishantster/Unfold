"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/brand";
import { createClient } from "@/lib/supabase/client";

type Form = { name:string; handle:string; headline:string; bio:string; whatsapp:string; portfolio:string; avatar_url:string };
const empty: Form = { name:"",handle:"",headline:"",bio:"",whatsapp:"",portfolio:"",avatar_url:"" };

export default function CreatePage() {
  const [form,setForm]=useState<Form>(empty); const [userId,setUserId]=useState("");
  const [saving,setSaving]=useState(false); const [message,setMessage]=useState(""); const router=useRouter();
  useEffect(()=>{ const supabase=createClient(); if(!supabase){router.replace("/");return} supabase.auth.getUser().then(async ({data})=>{
    if(!data.user){router.replace("/");return} setUserId(data.user.id);
    const {data:profile}=await supabase.from("profiles").select("name,handle,headline,bio,whatsapp,portfolio,avatar_url").eq("id",data.user.id).maybeSingle();
    if(profile) setForm(profile as Form); else setForm(v=>({...v,name:data.user?.user_metadata.full_name||"",avatar_url:data.user?.user_metadata.avatar_url||""}));
  }); },[router]);
  const set=(key:keyof Form,value:string)=>setForm(v=>({...v,[key]:value}));
  async function submit(e:FormEvent){ e.preventDefault(); setMessage(""); if(!userId)return;
    const handle=form.handle.toLowerCase().replace(/[^a-z0-9_-]/g,""); if(handle.length<3){setMessage("Choose a handle with at least 3 characters.");return}
    setSaving(true); const supabase=createClient(); const {error}=await supabase!.from("profiles").upsert({...form,handle,id:userId,updated_at:new Date().toISOString()}); setSaving(false);
    if(error){setMessage(error.code==="23505"?"That handle is already taken.":error.message);return} router.push(`/done?handle=${handle}`);
  }
  async function signOut(){await createClient()?.auth.signOut();router.push("/")}
  return <main className="editor"><section className="form-side">
    <div className="editor-top"><Brand/><button className="text-btn" onClick={signOut}>Sign out</button></div>
    <div className="step">Your page · one quick step</div><h1>Tell people<br/>who you are.</h1><p className="form-intro">Only add what matters. You can come back and change it anytime.</p>
    <form onSubmit={submit}>
      <div className="row"><div className="field"><label>Your name *</label><input required value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Your name"/></div><div className="field"><label>Your link *</label><input required value={form.handle} onChange={e=>set("handle",e.target.value)} placeholder="your-name"/></div></div>
      <div className="field"><label>What you do *</label><input required value={form.headline} onChange={e=>set("headline",e.target.value)} placeholder="Designer, founder, photographer…"/></div>
      <div className="field"><label>A short hello</label><textarea maxLength={180} value={form.bio} onChange={e=>set("bio",e.target.value)} placeholder="A sentence or two is plenty."/></div>
      <div className="row"><div className="field"><label>WhatsApp number</label><input value={form.whatsapp} onChange={e=>set("whatsapp",e.target.value)} placeholder="Include country code"/></div><div className="field"><label>Website or portfolio</label><input type="url" value={form.portfolio} onChange={e=>set("portfolio",e.target.value)} placeholder="https://"/></div></div>
      <div className="field"><label>Photo URL</label><input type="url" value={form.avatar_url} onChange={e=>set("avatar_url",e.target.value)} placeholder="https:// (your Google photo is added automatically)"/></div>
      {message&&<div className="error">{message}</div>}<button className="primary-btn" disabled={saving}>{saving?"Publishing…":"Publish my page →"}</button>
    </form>
  </section><aside className="preview-side"><div className="preview-label">Live preview</div><ProfilePreview form={form}/></aside></main>;
}

function ProfilePreview({form}:{form:Form}){return <div className="phone"><div className="avatar">{form.avatar_url?<img src={form.avatar_url} alt="" width="92" height="92"/>:(form.name[0]||"?")}</div><h3>{form.name||"Your name"}</h3><p className="headline">{form.headline||"What you do"}</p><p className="bio">{form.bio||"Your short introduction will appear here."}</p>{form.whatsapp&&<span className="action dark">WhatsApp me</span>}{form.portfolio&&<span className="action">View my work</span>}</div>}
