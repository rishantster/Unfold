"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Copy, Pencil } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Brand } from "@/components/brand";

function Done(){const params=useSearchParams();const handle=params.get("handle")||"";const base=typeof window!=="undefined"?window.location.origin:"";const url=`${base}/u/${handle}`;return <main className="done-wrap"><div className="done"><Brand/><h1>You’re live.</h1><p className="sub">That’s it. Share your link or QR whenever you meet someone.</p><div className="share-box"><QRCodeSVG value={url} size={112}/><div><b>{url}</b><p style={{color:"var(--muted)",fontSize:13}}>Your page stays here, even when you edit it.</p></div></div><button className="primary-btn" onClick={()=>navigator.clipboard.writeText(url)}><Copy size={18}/> Copy my link</button><div style={{marginTop:20}}><Link className="text-btn" href="/create"><Pencil size={13}/> Edit my details</Link> &nbsp; · &nbsp; <Link className="text-btn" href={`/u/${handle}`}>View my page</Link></div></div></main>}
export default function DonePage(){return <Suspense><Done/></Suspense>}
