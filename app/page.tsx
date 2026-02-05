"use client";

import { useState, useCallback, useEffect } from "react";
import confetti from "canvas-confetti";

const NO_TEXTS = [
  "No",
  "Are you sure?",
  "Really sure?",
  "Think again!",
  "Pretty please? \ud83e\udd7a",
  "You're breaking my heart \ud83d\udc94",
  "I'll be sad forever \ud83d\ude22",
  "Just say yes!",
  "Pleaseeeee?",
  "Okay fine... just kidding, say yes!",
];

const BLOBS = [
  { color: "var(--blob-1)", size: 320, x: "8%", y: "15%", cls: "blob-1" },
  { color: "var(--blob-2)", size: 260, x: "72%", y: "8%", cls: "blob-2" },
  { color: "var(--blob-3)", size: 360, x: "78%", y: "62%", cls: "blob-3" },
  { color: "var(--blob-4)", size: 220, x: "15%", y: "72%", cls: "blob-4" },
  { color: "var(--blob-5)", size: 290, x: "45%", y: "85%", cls: "blob-5" },
];

function fireConfetti() {
  const heartShape = confetti.shapeFromPath({
    path: "M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 56,18 76,56z",
  });

  const defaults = {
    spread: 100,
    ticks: 140,
    gravity: 0.7,
    decay: 0.94,
    startVelocity: 35,
    colors: ["#e8365d", "#d42b50", "#fda4af", "#fecdd3", "#fff1f2", "#fbbf24"],
    shapes: [heartShape],
    scalar: 1.4,
  };

  confetti({ ...defaults, particleCount: 50, origin: { x: 0.25, y: 0.6 } });
  setTimeout(() => {
    confetti({ ...defaults, particleCount: 65, origin: { x: 0.75, y: 0.5 } });
  }, 250);
  setTimeout(() => {
    confetti({ ...defaults, particleCount: 80, origin: { x: 0.5, y: 0.35 } });
  }, 500);
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 40,
      spread: 160,
      origin: { x: 0.5, y: 0.7 },
      startVelocity: 45,
    });
  }, 800);
}

export default function Home() {
  const [accepted, setAccepted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const yesScale = 1 + noCount * 0.2;
  const noText =
    noCount === 0
      ? NO_TEXTS[0]
      : NO_TEXTS[((noCount - 1) % (NO_TEXTS.length - 1)) + 1];

  const moveNoButton = useCallback(() => {
    const padding = 24;
    const btnWidth = 140;
    const btnHeight = 52;
    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;
    const x = Math.max(padding, Math.random() * maxX);
    const y = Math.max(padding, Math.random() * maxY);
    setNoPosition({ x, y });
    setNoCount((c) => c + 1);
  }, []);

  const handleNoHover = useCallback(() => {
    if (window.matchMedia("(hover: hover)").matches) {
      moveNoButton();
    }
  }, [moveNoButton]);

  const handleNoClick = useCallback(() => {
    if (!window.matchMedia("(hover: hover)").matches) {
      moveNoButton();
    }
  }, [moveNoButton]);

  const handleYesClick = useCallback(() => {
    setAccepted(true);
    fireConfetti();
  }, []);

  useEffect(() => {
    const handleResize = () => setNoPosition(null);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="valentine-page">
      {/* ── Background blobs ── */}
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className={`bg-blob ${blob.cls}`}
          style={{
            background: blob.color,
            width: blob.size,
            height: blob.size,
            left: blob.x,
            top: blob.y,
          }}
        />
      ))}

      {/* ── Grain texture ── */}
      <div className="grain-overlay" />

      {/* ── Main card ── */}
      <div className="valentine-card">
        {!accepted ? (
          /* ── Question screen ── */
          <div className="entrance-stagger flex flex-col items-center text-center gap-2">
            {/* Character scene */}
            <div className="character-scene">
              <span className="bear" role="img" aria-label="teddy bear">
                {"\ud83e\uddf8"}
              </span>
              <span className="gift-heart" role="img" aria-label="heart gift">
                {"\ud83d\udc9d"}
              </span>
              <span className="sparkle sparkle-1">{"\u2728"}</span>
              <span className="sparkle sparkle-2">{"\u2728"}</span>
              <span className="sparkle sparkle-3">{"\u2728"}</span>
              <span className="sparkle sparkle-4">{"\u2728"}</span>
            </div>

            {/* Heading */}
            <h1 className="heading-romantic">Will you be my Valentine Dee?</h1>

            {/* Sweet handwritten message */}
            <p className="handwritten mt-1">
              I promise to always make you smile&hellip;
            </p>

            {/* Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleYesClick}
                className="yes-btn glow-ring"
                style={{ transform: `scale(${yesScale})` }}
              >
                Yes! {"\ud83d\udc95"}
              </button>

              {noPosition === null && (
                <button
                  className="no-btn"
                  onMouseEnter={handleNoHover}
                  onClick={handleNoClick}
                >
                  {noText}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ── Celebration screen ── */
          <div className="celebration-stagger flex flex-col items-center text-center gap-3">
            <div className="heartbeat-anim text-6xl sm:text-7xl leading-none">
              {"\ud83d\udc95"}
            </div>

            <h1 className="heading-romantic">Yay! You said yes!</h1>

            <p className="handwritten">
              You just made me the happiest person in the whole world!
            </p>

            <div className="emoji-row mt-2 flex gap-5 text-3xl sm:text-4xl">
              <span role="img" aria-label="teddy bear">
                {"\ud83e\uddf8"}
              </span>
              <span role="img" aria-label="love letter">
                {"\ud83d\udc8c"}
              </span>
              <span role="img" aria-label="rose">
                {"\ud83c\udf39"}
              </span>
              <span role="img" aria-label="sparkles">
                {"\u2728"}
              </span>
            </div>

            <p
              className="mt-2 text-sm italic"
              style={{
                fontFamily: "var(--font-caveat), cursive",
                color: "var(--text-muted)",
                fontSize: "1.15rem",
              }}
            >
              ~ Forever yours ~
            </p>
          </div>
        )}
      </div>

      {/* ── Escaped No button (dodging around viewport) ── */}
      {!accepted && noPosition !== null && (
        <button
          className="no-btn-escaped"
          onMouseEnter={handleNoHover}
          onClick={handleNoClick}
          style={{
            position: "fixed",
            left: noPosition.x,
            top: noPosition.y,
          }}
        >
          {noText}
        </button>
      )}
    </main>
  );
}
