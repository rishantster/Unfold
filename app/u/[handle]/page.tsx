import { notFound } from "next/navigation";
import { ExternalLink, MessageCircle } from "lucide-react";
import { Brand } from "@/components/brand";
import { createClient } from "@/lib/supabase/server";

export default async function PublicProfile({params}:{params:Promise<{handle:string}>}){
  const {handle}=await params; const supabase=await createClient(); if(!supabase) notFound();
  const {data:p}=await supabase.from("profiles").select("name,headline,bio,whatsapp,portfolio,avatar_url").eq("handle",handle).single(); if(!p)notFound();
  const phone=p.whatsapp?.replace(/\D/g,""); const msg=encodeURIComponent(`Hi ${p.name}, great connecting with you!`);
  return <main className="public"><div className="public-card"><Brand/><div style={{height:60}}/><div className="avatar">{p.avatar_url?<img src={p.avatar_url} alt={p.name} width="112" height="112"/>:p.name[0]}</div><h1>{p.name}</h1><p className="headline">{p.headline}</p><p className="bio">{p.bio}</p><div style={{marginTop:32}}>{phone&&<a className="action dark" href={`https://wa.me/${phone}?text=${msg}`}><MessageCircle size={16} style={{verticalAlign:"middle",marginRight:8}}/> WhatsApp me</a>}{p.portfolio&&<a className="action" href={p.portfolio} target="_blank" rel="noreferrer">View my work <ExternalLink size={14} style={{verticalAlign:"middle",marginLeft:6}}/></a>}</div></div></main>;
}
