import { Grain } from "@/components/ui/grain";

export const metadata = { title: "About — BLUR" };

export default function AboutPage() {
  return <main className="about-page"><Grain /><section className="about-statement"><p className="eyebrow">BLUR / A FICTIONAL OPTICAL STUDIO</p><h1>BLUR EXISTS<br />IN THE SPACE<br />BETWEEN <i>SEEING</i><br />AND BEING SEEN.</h1></section>
    <section className="about-notes" aria-label="BLUR object studies"><p className="eyebrow">object research / 2026</p><p>the face as a surface.</p><p>not quite sunglasses.</p></section>
    <section className="about-copy"><p>We make eyewear as wearable objects: imperfect, sculptural, and a little unfamiliar.</p><p>A frame changes more than a face. It shifts the temperature of a room, interrupts a first impression, filters the world into another version of itself.</p><p>BLUR studies that small distortion—the moment identity becomes less fixed and much more interesting.</p></section>
    <footer className="minimal-footer"><span>BLUR / 2026</span><span>MADE FOR THE IN-BETWEEN</span></footer>
  </main>;
}
