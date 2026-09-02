export const metadata = { title: "Info — BLUR" };

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-intro">
        <p className="eyebrow">BLUR / collection 01</p>
        <h1>FOCUS, SHIFTED.</h1>
        <p className="about-lede">Eleven frames, worn as characters. A small study in silhouette, colour, and the point of view you choose.</p>
      </section>

      <section className="about-grid" aria-label="About BLUR">
        <div>
          <p className="eyebrow">01 / object</p>
          <p>BLUR makes eyewear that reads clearly from a distance and changes up close.</p>
        </div>
        <div>
          <p className="eyebrow">02 / collection</p>
          <p>Collection 01 moves between transparent colour, sharp contrast, and wearable utility.</p>
        </div>
        <div>
          <p className="eyebrow">03 / signal</p>
          <p>Every frame is shown on a different person, because a pair of glasses never tells the same story twice.</p>
        </div>
      </section>

      <footer className="minimal-footer"><span>BLUR / 2026</span><span>made for the in-between</span></footer>
    </main>
  );
}
