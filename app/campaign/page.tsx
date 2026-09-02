import Link from "next/link";
import { Grain } from "@/components/ui/grain";
import { TextShuffle } from "@/components/ui/text-shuffle";

const chapters = [
  ["01", "CITY", "Reflective pavement, orbital lenses, 2:17am."],
  ["02", "AFTER DARK", "A face in motion between blue lights."],
  ["03", "HEAT", "The atmosphere changes before the frame does."],
  ["04", "STUDIO", "A quiet study in distortion and pose."],
];

export const metadata = { title: "Campaign 001 — BLUR" };

export default function CampaignPage() {
  return <main className="campaign-page"><Grain /><header className="campaign-header"><p className="eyebrow">BLUR CAMPAIGN 001 / FILM STUDIES</p><h1>CITY<br /><i>AFTERIMAGE</i></h1><p>Four places where a look becomes a layer.</p></header>
    <section className="campaign-list">{chapters.map(([number, title, copy], index) => <article className={`campaign-chapter chapter-${index + 1}`} key={title}>
      <div className="campaign-placeholder"><span>FILM {number}</span><div className="campaign-silhouette" /></div>
      <div><p className="eyebrow">{number} / 04</p><h2>{title}</h2><p>{copy}</p><span className="asset-note">Campaign video placeholder — add video at <code>/public/campaign/{number}.mp4</code></span></div>
    </article>)}</section>
    <footer className="minimal-footer"><Link href="/shop"><TextShuffle text="shop the objects" /> ↗</Link><span>BLUR / CAMPAIGN 001</span></footer>
  </main>;
}
