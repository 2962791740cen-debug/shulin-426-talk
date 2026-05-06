import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown, ChevronUp, RotateCcw, Layers,
  Target, Search, CheckCircle, Circle, ArrowUpRight, Star,
  BookMarked, GitBranch, Brain, Cpu, Repeat,
  ArrowLeft, ArrowRight, Quote, Feather
} from 'lucide-react';

// ── Global styles (always mounted) ───────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    /* ── fonts ── */
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

    /* ── reset ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; overflow: hidden; }
    body { font-family: 'Noto Serif SC', serif; }

    /* ══ WILLPOWER TEST (3-second hold) — embedded card ══════════════════════ */
    .ra-will {
      margin: 3rem 0; padding: 3rem 2rem;
      background: linear-gradient(135deg, #14100a 0%, #1a1208 50%, #0B0805 100%);
      color: #FAF8F3;
      position: relative; overflow: hidden;
      display: flex; flex-direction: column; align-items: center;
      user-select: none; -webkit-user-select: none;
      border: 1px solid rgba(201,162,39,0.15);
    }
    .ra-will::before {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background: radial-gradient(ellipse at center, rgba(201,162,39,0.08) 0%, transparent 60%);
    }
    .ra-will::after {
      content: '体验 / TRY IT'; position: absolute; top: -10px; left: 2rem;
      background: #1a1208; padding: 0 0.8rem; color: #C9A227;
      font-size: 0.7rem; letter-spacing: 0.3em;
    }
    .ra-will-intro {
      max-width: 480px; text-align: center; margin-bottom: 2.5rem;
      position: relative; z-index: 1;
    }
    .ra-will-intro-title {
      font-family: 'Playfair Display','Noto Serif SC',serif;
      color: #FAF8F3; font-size: clamp(1.2rem, 2vw, 1.5rem);
      margin-bottom: 0.8rem; letter-spacing: 0.05em;
    }
    .ra-will-intro-sub {
      color: rgba(250,248,243,0.6); font-size: 0.9rem;
      line-height: 1.8;
    }
    .ra-will-orb-wrap {
      position: relative; width: 160px; height: 160px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
    }
    .ra-will-ring {
      position: absolute; inset: 0;
      transform: rotate(-90deg); pointer-events: none;
    }
    .ra-will-ring circle {
      fill: none; stroke-width: 2;
      transition: stroke 0.3s ease;
    }
    .ra-will-ring .bg { stroke: rgba(201,162,39,0.15); }
    .ra-will-ring .fg {
      stroke: #C9A227; stroke-linecap: round;
      filter: drop-shadow(0 0 10px rgba(201,162,39,0.6));
      transition: stroke-dashoffset 60ms linear;
    }
    .ra-will-orb {
      width: 14px; height: 14px; border-radius: 50%;
      background: #C9A227;
      box-shadow:
        0 0 16px rgba(201,162,39,0.8),
        0 0 40px rgba(201,162,39,0.4),
        0 0 80px rgba(201,162,39,0.2);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                  box-shadow 0.3s ease;
      animation: ra-orb-pulse 2.4s ease-in-out infinite;
    }
    @keyframes ra-orb-pulse {
      0%, 100% { transform: scale(1); }
      50%      { transform: scale(1.15); }
    }
    .ra-will-orb-wrap.holding .ra-will-orb {
      transform: scale(2.2); animation: none;
      box-shadow:
        0 0 30px rgba(201,162,39,1),
        0 0 70px rgba(201,162,39,0.6),
        0 0 140px rgba(201,162,39,0.3);
    }
    .ra-will-orb-wrap.passed .ra-will-orb {
      transform: scale(6); animation: none;
      box-shadow: 0 0 200px rgba(201,162,39,0.8);
    }
    .ra-will-prompt {
      margin-top: 2.5rem; min-height: 4rem; text-align: center;
      position: relative; z-index: 1;
    }
    .ra-will-prompt-main {
      font-family: 'Playfair Display','Noto Serif SC',serif;
      color: rgba(250,248,243,0.92); font-size: clamp(1.05rem, 1.8vw, 1.3rem);
      letter-spacing: 0.1em; margin-bottom: 0.5rem;
    }
    .ra-will-prompt-sub {
      color: rgba(201,162,39,0.6); font-size: 0.78rem;
      letter-spacing: 0.2em;
    }
    .ra-will-prompt.failed .ra-will-prompt-main {
      color: #C9A227; font-style: italic;
    }
    .ra-will-attempts {
      margin-top: 1rem; color: rgba(201,162,39,0.4);
      font-size: 0.7rem; letter-spacing: 0.2em;
    }
    .ra-will-coda {
      margin-top: 2.5rem; padding-top: 2rem; max-width: 540px;
      border-top: 1px solid rgba(201,162,39,0.15);
      color: rgba(250,248,243,0.7); font-size: 0.92rem;
      line-height: 1.9; text-align: center;
      position: relative; z-index: 1;
    }
    .ra-will-coda strong { color: #C9A227; font-weight: 500; }

    /* ══ STAGE SELF-PICK (Ch01) ═══════════════════════════════════════════════ */
    .ra-stage-pick {
      margin-top: 3rem; padding: 2rem;
      border: 1px solid rgba(201,162,39,0.2);
      background: linear-gradient(135deg, rgba(201,162,39,0.04), transparent);
    }
    .ra-stage-pick-q {
      color: #2D2416; font-size: 1.05rem; font-weight: 500;
      margin-bottom: 0.4rem; letter-spacing: 0.05em;
    }
    .ra-stage-pick-hint {
      color: rgba(45,36,22,0.55); font-size: 0.85rem; margin-bottom: 1.5rem;
    }
    .ra-stage-buttons {
      display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.6rem;
      margin-bottom: 1.5rem;
    }
    @media (max-width: 700px) {
      .ra-stage-buttons { grid-template-columns: repeat(2, 1fr); }
    }
    .ra-stage-btn {
      padding: 0.9rem 0.6rem; background: #fff;
      border: 1px solid rgba(45,36,22,0.15);
      cursor: pointer; transition: all 0.3s ease;
      font-family: inherit; text-align: center;
    }
    .ra-stage-btn-num {
      display: block; font-family: 'Playfair Display', serif;
      font-size: 0.75rem; color: #C9A227; letter-spacing: 0.2em;
      margin-bottom: 0.3rem;
    }
    .ra-stage-btn-label {
      display: block; color: #2D2416; font-size: 0.95rem; font-weight: 500;
    }
    .ra-stage-btn:hover {
      border-color: #C9A227; transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(45,36,22,0.08);
    }
    .ra-stage-btn.selected {
      background: #2D2416; border-color: #2D2416;
    }
    .ra-stage-btn.selected .ra-stage-btn-num,
    .ra-stage-btn.selected .ra-stage-btn-label {
      color: #C9A227;
    }
    .ra-stage-feedback {
      padding: 1.5rem 1.8rem; background: #2D2416;
      border-left: 3px solid #C9A227;
      animation: ra-fade-up 0.5s ease;
    }
    @keyframes ra-fade-up {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .ra-stage-feedback-label {
      color: #C9A227; font-size: 0.7rem; letter-spacing: 0.3em;
      margin-bottom: 0.6rem;
    }
    .ra-stage-feedback-text {
      color: #FAF8F3; font-size: 1rem; line-height: 1.9;
    }

    /* ══ COMPOUND VISUALIZER (Ch02) ══════════════════════════════════════════ */
    .ra-compound {
      margin-top: 3rem; padding: 2.2rem; background: #fff;
      border: 1px solid rgba(45,36,22,0.1);
    }
    .ra-compound-title {
      color: #2D2416; font-size: 1.1rem; font-weight: 500;
      margin-bottom: 0.4rem;
    }
    .ra-compound-sub {
      color: rgba(45,36,22,0.55); font-size: 0.85rem; margin-bottom: 1.5rem;
    }
    .ra-compound-input-row {
      display: flex; gap: 0.7rem; flex-wrap: wrap; margin-bottom: 2rem;
    }
    .ra-compound-input {
      flex: 1; min-width: 200px;
      padding: 0.7rem 1rem; border: 1px solid rgba(45,36,22,0.15);
      background: #FAF8F3; font-family: inherit; font-size: 0.95rem;
      color: #2D2416; outline: none; transition: border-color 0.3s ease;
    }
    .ra-compound-input:focus { border-color: #C9A227; }
    .ra-compound-input.num { max-width: 110px; flex: 0 0 110px; text-align: right; }
    .ra-compound-bars {
      display: flex; align-items: flex-end; justify-content: space-between;
      gap: 0.8rem; height: 240px; padding: 1rem 0; margin-bottom: 1rem;
      border-bottom: 1px solid rgba(45,36,22,0.1);
    }
    .ra-compound-bar-col {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: flex-end; height: 100%;
    }
    .ra-compound-bar {
      width: 100%; max-width: 60px;
      background: linear-gradient(180deg, #e8c84a 0%, #C9A227 50%, #8B6914 100%);
      box-shadow: inset 0 -2px 0 rgba(0,0,0,0.1), 0 0 10px rgba(201,162,39,0.3);
      transition: height 1.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .ra-compound-bar-value {
      position: absolute; top: -1.6rem; left: 50%;
      transform: translateX(-50%);
      font-family: 'Playfair Display', serif; font-size: 0.8rem;
      color: #2D2416; font-weight: 600; white-space: nowrap;
    }
    .ra-compound-bar-day {
      margin-top: 0.6rem; font-size: 0.7rem;
      color: rgba(45,36,22,0.55); letter-spacing: 0.1em;
    }
    .ra-compound-summary {
      text-align: center; padding: 1rem; background: rgba(201,162,39,0.06);
      border: 1px dashed rgba(201,162,39,0.3); margin-top: 1rem;
    }
    .ra-compound-summary strong {
      color: #C9A227; font-family: 'Playfair Display', serif;
      font-size: 1.4rem; font-weight: 700;
    }

    /* ══ COMMITMENT CARD (Outro) ═════════════════════════════════════════════ */
    .ra-commit {
      margin: 4rem 0; padding: 0;
      background: linear-gradient(135deg, #1a1208 0%, #2D2416 50%, #1a1208 100%);
      border: 1px solid rgba(201,162,39,0.3);
      position: relative; overflow: hidden;
    }
    .ra-commit::before {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
      opacity: 0.04;
    }
    .ra-commit-glyph {
      position: absolute; right: -2rem; bottom: -3rem;
      font-family: 'Playfair Display', serif;
      font-size: 14rem; color: rgba(201,162,39,0.05);
      line-height: 1; pointer-events: none;
    }
    .ra-commit-inner { padding: 3rem 2.5rem; position: relative; z-index: 1; }
    .ra-commit-eyebrow {
      color: rgba(201,162,39,0.55); font-size: 0.7rem;
      letter-spacing: 0.5em; text-align: center; margin-bottom: 1.5rem;
    }
    .ra-commit-title {
      font-family: 'Playfair Display','Noto Serif SC',serif;
      color: #FAF8F3; font-weight: 400; text-align: center;
      font-size: clamp(1.4rem, 2.5vw, 2rem); letter-spacing: 0.1em;
      margin-bottom: 2rem;
    }
    .ra-commit-fields { display: flex; flex-direction: column; gap: 1.2rem; margin-bottom: 2rem; }
    .ra-commit-field-label {
      color: #C9A227; font-size: 0.7rem; letter-spacing: 0.25em;
      margin-bottom: 0.5rem;
    }
    .ra-commit-input, .ra-commit-textarea {
      width: 100%; padding: 0.9rem 1.2rem;
      background: rgba(250,248,243,0.04);
      border: 1px solid rgba(201,162,39,0.25); color: #FAF8F3;
      font-family: inherit; font-size: 1rem; line-height: 1.6;
      outline: none; transition: all 0.3s ease;
    }
    .ra-commit-input:focus, .ra-commit-textarea:focus {
      border-color: #C9A227; background: rgba(250,248,243,0.06);
    }
    .ra-commit-input::placeholder, .ra-commit-textarea::placeholder {
      color: rgba(250,248,243,0.3);
    }
    .ra-commit-textarea { resize: vertical; min-height: 70px; }
    .ra-commit-card {
      margin-top: 2rem; padding: 2.5rem 2rem;
      border: 1px solid #C9A227; background: rgba(201,162,39,0.04);
      text-align: center;
    }
    .ra-commit-card-q {
      color: rgba(201,162,39,0.6); font-size: 0.7rem;
      letter-spacing: 0.3em; margin-bottom: 1rem;
    }
    .ra-commit-card-line {
      font-family: 'Playfair Display','Noto Serif SC',serif;
      color: #FAF8F3; font-size: clamp(1.2rem, 2vw, 1.6rem);
      line-height: 1.6; margin-bottom: 0.8rem; font-style: italic;
    }
    .ra-commit-card-action {
      color: #C9A227; font-size: 1rem;
      letter-spacing: 0.05em; margin-bottom: 2rem;
    }
    .ra-commit-card-dates {
      display: flex; justify-content: space-around; gap: 1rem;
      padding-top: 1.5rem; border-top: 1px dashed rgba(201,162,39,0.3);
    }
    .ra-commit-date-block {
      flex: 1; text-align: center;
    }
    .ra-commit-date-label {
      color: rgba(201,162,39,0.5); font-size: 0.65rem;
      letter-spacing: 0.3em; margin-bottom: 0.4rem;
    }
    .ra-commit-date-value {
      font-family: 'Playfair Display', serif;
      color: #FAF8F3; font-size: 1.2rem; font-weight: 500;
    }
    .ra-commit-meta {
      text-align: center; color: rgba(201,162,39,0.4);
      font-size: 0.75rem; letter-spacing: 0.2em;
      margin-top: 1.5rem; font-style: italic;
    }
    .ra-commit-save {
      display: block; margin: 1.5rem auto 0;
      background: #C9A227; color: #2D2416; border: none;
      padding: 0.9rem 2.5rem; font-family: inherit;
      font-size: 0.9rem; letter-spacing: 0.2em; cursor: pointer;
      transition: all 0.3s ease;
    }
    .ra-commit-save:hover {
      background: #e8c84a;
      box-shadow: 0 6px 20px rgba(201,162,39,0.3);
    }
    .ra-commit-save:disabled {
      opacity: 0.4; cursor: not-allowed;
    }

    /* ══ READING PROGRESS BAR ════════════════════════════════════════════════ */
    .ra-progress {
      position: fixed; top: 0; left: 220px; right: 0; height: 2px;
      background: rgba(201,162,39,0.08); z-index: 200;
    }
    .ra-progress-fill {
      height: 100%; background: linear-gradient(90deg,#C9A227,#e8c84a);
      transition: width 0.15s linear; box-shadow: 0 0 8px rgba(201,162,39,0.5);
    }

    /* ══ PAPER TEXTURE (subtle grain) ════════════════════════════════════════ */
    .ra-grain::before {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
      opacity: 0.04; mix-blend-mode: multiply; z-index: 0;
    }

    /* ══ LANDING ═══════════════════════════════════════════════════════════ */
    .ra-landing {
      position: fixed; inset: 0; background: #0D0A05;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden;
    }
    .ra-landing::before {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background:
        radial-gradient(ellipse at 20% 30%, rgba(201,162,39,0.05) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 70%, rgba(201,162,39,0.04) 0%, transparent 50%);
    }
    .ra-landing-corner {
      position: absolute; color: rgba(201,162,39,0.4);
      font-size: 0.65rem; letter-spacing: 0.3em; z-index: 5;
    }
    .ra-landing-corner.tl { top: 2rem; left: 2rem; }
    .ra-landing-corner.tr { top: 2rem; right: 2rem; }
    .ra-landing-corner.bl { bottom: 2rem; left: 2rem; }
    .ra-landing-corner.br { bottom: 2rem; right: 2rem; text-align: right; }

    /* Floating gold dust particles */
    .ra-dust {
      position: absolute; width: 2px; height: 2px; border-radius: 50%;
      background: #C9A227; box-shadow: 0 0 6px #C9A227;
      animation: ra-float 12s linear infinite; opacity: 0;
    }
    @keyframes ra-float {
      0%   { transform: translateY(100vh) translateX(0); opacity: 0; }
      10%  { opacity: 0.5; }
      90%  { opacity: 0.3; }
      100% { transform: translateY(-10vh) translateX(50px); opacity: 0; }
    }
    /* Landing exit — let doors keep opening AND landing fades out.
       Both stay dark, continuous with the chapter-entrance curtains that come next. */
    .ra-out { opacity: 0; transition: opacity 1.1s cubic-bezier(0.4, 0, 0.2, 1); }
    .ra-out .ra-door.left  { transform: rotateY(-150deg); transition: transform 1.3s cubic-bezier(0.5, 0, 0.2, 1); }
    .ra-out .ra-door.right { transform: rotateY( 150deg); transition: transform 1.3s cubic-bezier(0.5, 0, 0.2, 1); }
    .ra-out .ra-crack      { width: 10px; filter: blur(6px); box-shadow: 0 0 80px rgba(201,162,39,0.8); transition: all 1.0s ease-out; }
    .ra-out .ra-hero, .ra-out .ra-entry { opacity: 0; transition: opacity 0.5s ease-out; }

    .ra-phrase {
      position: absolute; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      color: #C9A227; font-size: clamp(1.1rem, 2.5vw, 1.8rem);
      letter-spacing: 0.25em; text-align: center; opacity: 0;
      transition: opacity 1.2s ease, transform 1.2s ease;
      white-space: nowrap; text-shadow: 0 0 30px rgba(201,162,39,0.5);
    }
    .ra-phrase.show { opacity: 1; transform: translate(-50%, -50%); }
    .ra-phrase.hide { opacity: 0; transform: translate(-50%, -60%); }

    /* ── Two-door split (cinematic) ── */
    .ra-door-wrap {
      position: absolute; inset: 0; perspective: 1800px;
      display: flex; align-items: stretch; justify-content: center;
      pointer-events: none;
    }
    .ra-door {
      position: absolute; top: 0; height: 100%; width: 50%;
      background: linear-gradient(180deg, #14100a 0%, #1a1208 40%, #2D2416 70%, #1a1208 100%);
      transition: transform 2.4s cubic-bezier(0.6, 0, 0.2, 1);
      box-shadow: inset 0 0 60px rgba(0,0,0,0.6);
    }
    .ra-door::after {
      content: ''; position: absolute; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
      opacity: 0.06; pointer-events: none;
    }
    .ra-door.left {
      left: 0; transform-origin: left center;
      border-right: 1px solid #C9A22744;
      box-shadow: inset -2px 0 4px rgba(201,162,39,0.15), inset 0 0 60px rgba(0,0,0,0.6);
    }
    .ra-door.right {
      right: 0; transform-origin: right center;
      border-left: 1px solid #C9A22744;
      box-shadow: inset 2px 0 4px rgba(201,162,39,0.15), inset 0 0 60px rgba(0,0,0,0.6);
    }
    .ra-door.open.left  { transform: rotateY(-105deg); }
    .ra-door.open.right { transform: rotateY( 105deg); }

    /* Glyph 重 painted on the doors (split between halves) */
    .ra-door-glyph-half {
      position: absolute; top: 50%; transform: translateY(-50%);
      font-family: 'Playfair Display', 'Noto Serif SC', serif;
      font-size: clamp(8rem, 22vw, 22rem); font-weight: 700;
      color: rgba(201,162,39,0.18); line-height: 1;
      pointer-events: none; user-select: none;
      transition: opacity 1.5s ease;
    }
    .ra-door.open .ra-door-glyph-half { opacity: 0; }
    .ra-door.left  .ra-door-glyph-half { right: -0.5em; overflow: hidden; }
    .ra-door.right .ra-door-glyph-half { left:  -0.5em; overflow: hidden; }

    /* Gold crack of light revealed when doors open */
    .ra-crack {
      position: absolute; left: 50%; top: 0; transform: translateX(-50%);
      width: 0; height: 100%; opacity: 0;
      background: linear-gradient(180deg,
        transparent 0%,
        rgba(201,162,39,0.4) 15%,
        rgba(232,200,74,0.9) 50%,
        rgba(201,162,39,0.4) 85%,
        transparent 100%);
      box-shadow:
        0 0 60px rgba(201,162,39,0.6),
        0 0 120px rgba(201,162,39,0.3),
        0 0 200px rgba(201,162,39,0.15);
      transition: width 1.8s cubic-bezier(0.5,0,0.2,1), opacity 0.6s ease;
      filter: blur(0.5px);
    }
    .ra-crack.show {
      width: 3px; opacity: 1;
    }

    .ra-hero { opacity: 0; transition: opacity 2.5s ease; pointer-events: none; }
    .ra-hero.show { opacity: 1; }
    .ra-hero-inner {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center; text-align: center;
    }

    .ra-entry { opacity: 0; transition: opacity 1.8s ease; }
    .ra-entry.show { opacity: 1; pointer-events: auto; }

    .ra-btn {
      background: transparent; border: 1px solid #C9A227; color: #C9A227;
      padding: 0.9rem 3rem; font-family: 'Noto Serif SC', serif;
      font-size: 1rem; letter-spacing: 0.2em; cursor: pointer;
      transition: all 0.4s ease; position: relative; overflow: hidden;
    }
    .ra-btn::before {
      content: ''; position: absolute; inset: 0;
      background: #C9A227; transform: translateX(-100%);
      transition: transform 0.4s ease; z-index: -1;
    }
    .ra-btn:hover::before { transform: translateX(0); }
    .ra-btn:hover { color: #0D0A05; }

    /* ══ LAYOUT ═════════════════════════════════════════════════════════════ */
    .ra-app {
      display: flex; height: 100vh; overflow: hidden;
      font-family: 'Noto Serif SC', serif; background: #FAF8F3; color: #2D2416;
    }

    .ra-sidebar {
      width: 220px; flex-shrink: 0; height: 100vh;
      background: #140E06; border-right: 1px solid rgba(201,162,39,0.2);
      display: flex; flex-direction: column; padding: 2rem 0; z-index: 100;
    }
    .ra-sidebar-logo {
      padding: 0 1.5rem 2rem;
      border-bottom: 1px solid rgba(201,162,39,0.15); margin-bottom: 1.5rem;
    }
    .ra-nav-item {
      padding: 0.7rem 1.5rem; color: rgba(201,162,39,0.5);
      font-size: 0.8rem; letter-spacing: 0.1em; cursor: pointer;
      transition: all 0.3s ease; border-left: 2px solid transparent;
      display: flex; align-items: center; gap: 0.6rem;
    }
    .ra-nav-item:hover { color: #C9A227; background: rgba(201,162,39,0.05); }
    .ra-nav-item.active {
      color: #C9A227; border-left-color: #C9A227;
      background: rgba(201,162,39,0.08);
    }

    .ra-main { flex: 1; overflow-y: auto; height: 100vh; }

    /* ══ COMPONENTS ══════════════════════════════════════════════════════════ */
    .ra-quote {
      border-left: 3px solid #C9A227; padding: 1.2rem 1.5rem;
      background: rgba(201,162,39,0.04); margin: 1.5rem 0;
      font-style: italic; color: #5a4020; font-size: 1.05rem; line-height: 1.8;
    }

    .ra-tag {
      display: inline-flex; align-items: center; gap: 0.4rem;
      background: rgba(201,162,39,0.1); color: #C9A227;
      padding: 0.3rem 0.8rem; font-size: 0.75rem; letter-spacing: 0.1em;
      border: 1px solid rgba(201,162,39,0.2);
    }

    .ra-card {
      background: #fff; border: 1px solid rgba(45,36,22,0.1);
      transition: all 0.4s ease; cursor: pointer; position: relative; overflow: hidden;
    }
    .ra-card::before {
      content: ''; position: absolute; left: 0; top: 0; bottom: 0;
      width: 3px; background: #C9A227;
      transform: scaleY(0); transition: transform 0.4s ease; transform-origin: bottom;
    }
    .ra-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(45,36,22,0.12); }
    .ra-card:hover::before { transform: scaleY(1); }

    .ra-stage-item {
      display: flex; align-items: flex-start; gap: 1.5rem;
      padding: 1.2rem 0; border-bottom: 1px solid rgba(45,36,22,0.08);
      opacity: 0; transform: translateX(-20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .ra-stage-item.show { opacity: 1; transform: translateX(0); }
    .ra-stage-num {
      width: 36px; height: 36px; border: 1px solid #C9A227;
      display: flex; align-items: center; justify-content: center;
      color: #C9A227; font-size: 0.8rem; flex-shrink: 0; margin-top: 2px;
    }

    .ra-method-card {
      background: #fff; border: 1px solid rgba(45,36,22,0.1);
      padding: 1.8rem; position: relative; overflow: hidden;
      transition: all 0.3s ease; cursor: pointer;
    }
    .ra-method-card:hover { box-shadow: 0 8px 24px rgba(45,36,22,0.1); }
    .ra-method-num {
      position: absolute; right: 1.2rem; top: 1rem;
      font-size: 3rem; color: rgba(201,162,39,0.1); font-weight: 700; line-height: 1;
    }

    .ra-flow-step {
      display: flex; align-items: center; gap: 1rem;
      background: #fff; border: 1px solid rgba(45,36,22,0.1);
      padding: 1rem 1.4rem; margin-bottom: 0.6rem; cursor: pointer;
      transition: all 0.3s ease;
    }
    .ra-flow-step:hover { border-color: #C9A227; background: rgba(201,162,39,0.03); }
    .ra-flow-arrow {
      color: #C9A227; display: flex; align-items: center;
      justify-content: center; margin: 0.3rem 0;
    }

    .ra-tool-card {
      border: 1px solid rgba(45,36,22,0.1); padding: 1.5rem;
      background: #fff; transition: all 0.3s ease;
    }
    .ra-tool-card:hover { border-color: #C9A227; }
    .ra-tool-badge {
      display: inline-block; padding: 0.2rem 0.7rem;
      font-size: 0.7rem; letter-spacing: 0.12em; border: 1px solid currentColor;
      margin-bottom: 0.8rem;
    }

    .ra-chapter-bg {
      position: relative; overflow: hidden;
    }
    .ra-chapter-bg::after {
      content: ''; position: absolute; right: -100px; top: -100px;
      width: 500px; height: 500px; border-radius: 50%;
      background: radial-gradient(circle, rgba(201,162,39,0.06) 0%, transparent 70%);
      pointer-events: none;
    }

    /* ══ CHAPTER FOOTER NAV ══════════════════════════════════════════════════ */
    .ra-chap-nav {
      display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
      background: rgba(201,162,39,0.15); margin-top: 4rem;
      border-top: 1px solid rgba(201,162,39,0.2);
    }
    .ra-chap-nav-item {
      background: #FAF8F3; padding: 2rem 2.5rem; cursor: pointer;
      transition: background 0.3s ease; display: flex; flex-direction: column;
      gap: 0.4rem; min-height: 110px; justify-content: center;
    }
    .ra-chap-nav-item:hover { background: #fff; }
    .ra-chap-nav-item.disabled { opacity: 0.3; cursor: not-allowed; pointer-events: none; }
    .ra-chap-nav-label {
      font-size: 0.7rem; color: #C9A227; letter-spacing: 0.2em;
      display: flex; align-items: center; gap: 0.4rem;
    }
    .ra-chap-nav-title { font-size: 1rem; color: #2D2416; font-weight: 500; }

    /* ══ STAGE INTENSITY BARS (Ch01) ═════════════════════════════════════════ */
    .ra-stage-bar {
      display: flex; gap: 3px; height: 6px; margin-top: 0.6rem;
    }
    .ra-stage-bar-cell {
      flex: 1; background: rgba(201,162,39,0.12);
      transition: background 0.4s ease;
    }
    .ra-stage-bar-cell.fill { background: #C9A227; box-shadow: 0 0 6px rgba(201,162,39,0.5); }

    /* ══ WORKFLOW CONNECTOR (Ch04) ═══════════════════════════════════════════ */
    .ra-workflow {
      position: relative;
    }
    .ra-workflow::before {
      content: ''; position: absolute; left: 24px; top: 30px; bottom: 30px;
      width: 1px; background: linear-gradient(to bottom,
        rgba(201,162,39,0.5) 0%,
        rgba(201,162,39,0.2) 50%,
        rgba(201,162,39,0.5) 100%);
    }
    .ra-workflow-row {
      position: relative; display: flex; gap: 1.5rem;
      padding: 1rem 0; align-items: flex-start;
    }
    .ra-workflow-dot {
      width: 48px; height: 48px; border-radius: 50%;
      background: #FAF8F3; border: 2px solid #C9A227;
      display: flex; align-items: center; justify-content: center;
      color: #C9A227; font-weight: 700; font-size: 0.9rem; flex-shrink: 0;
      position: relative; z-index: 1; transition: all 0.3s ease;
      font-family: 'Playfair Display', serif;
    }
    .ra-workflow-row.active .ra-workflow-dot {
      background: #C9A227; color: #FAF8F3; transform: scale(1.1);
      box-shadow: 0 0 0 6px rgba(201,162,39,0.15);
    }

    /* ══ PULSING DOT (sidebar active) ════════════════════════════════════════ */
    .ra-pulse {
      width: 6px; height: 6px; border-radius: 50%; background: #C9A227;
      box-shadow: 0 0 8px #C9A227;
      animation: ra-pulse 2s ease-in-out infinite;
    }
    @keyframes ra-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.3); }
    }

    /* ══ PULL QUOTE (oversized) ══════════════════════════════════════════════ */
    .ra-pullquote {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.4rem, 3vw, 2.2rem);
      line-height: 1.6; color: #2D2416; font-style: italic;
      padding: 2.5rem 0 2.5rem 3rem; position: relative;
      max-width: 720px;
    }
    .ra-pullquote::before {
      content: '"'; position: absolute; left: 0; top: 0;
      font-size: 6rem; color: #C9A227; opacity: 0.3;
      font-family: 'Playfair Display', serif; line-height: 1;
    }

    /* ══ FADE-IN ON SCROLL ═══════════════════════════════════════════════════ */
    .ra-fade { opacity: 0; transform: translateY(20px);
                transition: opacity 0.8s ease, transform 0.8s ease; }
    .ra-fade.visible { opacity: 1; transform: translateY(0); }

    /* ══ PAGE TRANSITION (chapter switch) ════════════════════════════════════
       Page is rendered immediately but stays subtly low until the curtains
       split open at ~1700ms. Just a gentle fade — the *real* reveal is the
       curtains parting and uncovering it. */
    .ra-page {
      animation: ra-page-in 900ms cubic-bezier(0.25, 0.1, 0.25, 1) both;
      animation-delay: 1700ms;
    }
    @keyframes ra-page-in {
      0%   { opacity: 0.3; transform: translateY(8px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    /* ══ CHAPTER ENTRANCE: TWIN-CURTAIN SPLIT ════════════════════════════════
       Total 2.8s. Two dark panels slide in to cover, hold to display info,
       then slide apart to REVEAL the next page (not fade — slide).
       This solves the black→white flash because the new page is uncovered
       spatially, not by color transition. */
    .ra-entrance {
      position: fixed; inset: 0; z-index: 500; pointer-events: none;
    }

    /* Two curtain panels */
    .ra-entrance-curtain {
      position: absolute; top: 0; height: 100%; width: 50%;
      background: linear-gradient(180deg, #14100a 0%, #1a1208 35%, #0B0805 70%, #050302 100%);
    }
    .ra-entrance-curtain::after {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
      opacity: 0.06;
    }
    .ra-entrance-curtain.left {
      left: 0;
      box-shadow: inset -2px 0 4px rgba(201,162,39,0.12), inset 0 0 80px rgba(0,0,0,0.55);
      animation: ra-curtain-left 2800ms cubic-bezier(0.55, 0, 0.2, 1) forwards;
    }
    .ra-entrance-curtain.right {
      right: 0;
      box-shadow: inset 2px 0 4px rgba(201,162,39,0.12), inset 0 0 80px rgba(0,0,0,0.55);
      animation: ra-curtain-right 2800ms cubic-bezier(0.55, 0, 0.2, 1) forwards;
    }
    @keyframes ra-curtain-left {
      0%   { transform: translateX(-100%); }
      9%   { transform: translateX(0); }
      62%  { transform: translateX(0); }
      100% { transform: translateX(-100%); }
    }
    @keyframes ra-curtain-right {
      0%   { transform: translateX(100%); }
      9%   { transform: translateX(0); }
      62%  { transform: translateX(0); }
      100% { transform: translateX(100%); }
    }

    /* Central golden seam — appears when curtains meet, fades as they part */
    .ra-entrance-seam {
      position: absolute; left: 50%; top: 0; bottom: 0; width: 2px;
      transform: translateX(-50%);
      background: linear-gradient(180deg,
        transparent 0%, rgba(201,162,39,0.7) 30%, rgba(232,200,74,0.9) 50%,
        rgba(201,162,39,0.7) 70%, transparent 100%);
      box-shadow: 0 0 16px rgba(201,162,39,0.55), 0 0 40px rgba(201,162,39,0.3);
      filter: blur(0.5px);
      animation: ra-seam 2800ms ease forwards;
    }
    @keyframes ra-seam {
      0%   { opacity: 0; }
      14%  { opacity: 1; }
      58%  { opacity: 1; }
      66%  { opacity: 0; }
      100% { opacity: 0; }
    }

    /* Content layer (number, label, title, bar) */
    .ra-entrance-content {
      position: absolute; inset: 0; z-index: 2;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      pointer-events: none;
    }
    .ra-entrance-content > * {
      opacity: 0; transform: translateY(12px); filter: blur(6px);
      animation: ra-entrance-child 2800ms cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
    }
    @keyframes ra-entrance-child {
      0%   { opacity: 0; transform: translateY(12px); filter: blur(6px); }
      18%  { opacity: 1; transform: translateY(0); filter: blur(0); }
      55%  { opacity: 1; transform: translateY(0); filter: blur(0); }
      66%  { opacity: 0; transform: translateY(-8px); filter: blur(4px); }
      100% { opacity: 0; }
    }
    .ra-entrance-num   { animation-delay: 120ms; }
    .ra-entrance-label { animation-delay: 280ms; }
    .ra-entrance-title { animation-delay: 440ms; }
    .ra-entrance-bar   { animation-delay: 600ms; }

    .ra-entrance-num {
      font-family: 'Playfair Display', 'Noto Serif SC', serif;
      font-size: clamp(7rem, 20vw, 16rem); font-weight: 700; line-height: 1;
      color: rgba(201,162,39,0.16); letter-spacing: -0.05em;
      text-shadow: 0 0 80px rgba(201,162,39,0.15);
    }
    .ra-entrance-label {
      color: rgba(201,162,39,0.55); font-size: 0.75rem;
      letter-spacing: 0.55em; margin: 1.8rem 0 1.2rem;
    }
    .ra-entrance-title {
      color: #FAF8F3; font-family: 'Noto Serif SC', serif;
      font-size: clamp(1.6rem, 3.6vw, 2.6rem); font-weight: 400;
      letter-spacing: 0.18em;
    }
    .ra-entrance-bar {
      width: 80px; height: 1px;
      background: linear-gradient(90deg, transparent, #C9A227, transparent);
      margin-top: 2.2rem; box-shadow: 0 0 8px rgba(201,162,39,0.5);
    }

    /* ══ MOUSE GLOW (subtle follower) ════════════════════════════════════════ */
    .ra-glow {
      position: fixed; pointer-events: none; z-index: 1;
      width: 500px; height: 500px; border-radius: 50%;
      background: radial-gradient(circle, rgba(201,162,39,0.07) 0%, transparent 60%);
      transform: translate(-50%, -50%); transition: opacity 0.3s ease;
      mix-blend-mode: screen;
    }

    /* ══ INK REVEAL (line-by-line on scroll) ═════════════════════════════════ */
    .ra-ink-line {
      display: block; opacity: 0; transform: translateY(15px);
      filter: blur(6px);
      transition: opacity 1s ease, transform 1s ease, filter 1s ease;
    }
    .ra-ink-line.shown {
      opacity: 1; transform: translateY(0); filter: blur(0);
    }

    /* ══ DRAMATIC FATE CARDS (Ch03) ══════════════════════════════════════════ */
    .ra-fate-row {
      display: flex; gap: 1rem; height: 380px; perspective: 1500px;
      transition: gap 0.5s ease;
    }
    .ra-fate {
      flex: 1; padding: 2rem; background: #fff; cursor: pointer;
      border: 1px solid rgba(45,36,22,0.1); position: relative; overflow: hidden;
      transition: flex 0.5s cubic-bezier(0.4,0,0.2,1),
                  background 0.5s ease, transform 0.5s ease,
                  filter 0.5s ease, box-shadow 0.5s ease;
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .ra-fate-num {
      position: absolute; right: 1.2rem; top: 0.5rem;
      font-family: 'Playfair Display', serif; font-size: 5rem;
      color: rgba(201,162,39,0.06); font-weight: 700; line-height: 1;
    }
    .ra-fate-row:hover .ra-fate:not(:hover) {
      flex: 0.6; filter: grayscale(0.5) brightness(0.92);
      transform: scale(0.97);
    }
    .ra-fate:hover {
      flex: 2; box-shadow: 0 30px 60px rgba(45,36,22,0.15);
      transform: scale(1.02); z-index: 2;
    }
    .ra-fate-desc {
      max-height: 0; opacity: 0; overflow: hidden;
      transition: max-height 0.5s ease 0.1s, opacity 0.4s ease 0.2s;
    }
    .ra-fate:hover .ra-fate-desc {
      max-height: 200px; opacity: 1;
    }
    .ra-fate-hint {
      color: rgba(45,36,22,0.4); font-size: 0.75rem;
      letter-spacing: 0.15em; transition: opacity 0.3s ease;
    }
    .ra-fate:hover .ra-fate-hint { opacity: 0; }

    /* ══ ACTION CARD (writeable) ═════════════════════════════════════════════ */
    .ra-action {
      margin: 4rem 0 0; padding: 2.5rem; background: #fff;
      border: 1px dashed rgba(201,162,39,0.5); position: relative;
    }
    .ra-action::before {
      content: '行动卡 / ACTION'; position: absolute; top: -10px; left: 2rem;
      background: #fff; padding: 0 0.8rem; color: #C9A227;
      font-size: 0.7rem; letter-spacing: 0.3em;
    }
    .ra-action h4 {
      font-size: 1.15rem; color: #2D2416; font-weight: 500;
      margin-bottom: 0.5rem; letter-spacing: 0.05em;
    }
    .ra-action-prompt {
      color: rgba(45,36,22,0.65); font-size: 0.9rem;
      line-height: 1.8; margin-bottom: 1.5rem;
    }
    .ra-action-textarea {
      width: 100%; min-height: 100px; padding: 1rem;
      border: 1px solid rgba(45,36,22,0.15); background: #FAF8F3;
      font-family: inherit; font-size: 0.95rem; line-height: 1.7;
      color: #2D2416; resize: vertical; outline: none;
      transition: border-color 0.3s ease;
    }
    .ra-action-textarea:focus { border-color: #C9A227; }

    /* ── Quick-pick chips ── */
    .ra-chips {
      display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;
    }
    .ra-chip {
      padding: 0.5rem 1rem; background: #FAF8F3;
      border: 1px solid rgba(45,36,22,0.15); color: #5a4020;
      font-family: inherit; font-size: 0.85rem; cursor: pointer;
      transition: all 0.25s ease; line-height: 1.4;
      display: inline-flex; align-items: center; gap: 0.4rem;
      border-radius: 20px;
    }
    .ra-chip:hover {
      background: #fff; border-color: #C9A227; color: #2D2416;
      transform: translateY(-1px);
    }
    .ra-chip.selected {
      background: #2D2416; color: #C9A227;
      border-color: #2D2416;
    }
    .ra-chip.selected:hover { background: #2D2416; color: #C9A227; }
    .ra-chip-other {
      border-style: dashed; color: rgba(45,36,22,0.55);
    }
    .ra-chip-other:hover { color: #C9A227; }
    .ra-chips-hint {
      color: rgba(45,36,22,0.45); font-size: 0.75rem;
      letter-spacing: 0.1em; margin-bottom: 0.7rem;
      display: flex; align-items: center; gap: 0.5rem;
    }
    .ra-chips-hint::before, .ra-chips-hint::after {
      content: ''; flex: 1; height: 1px; background: rgba(45,36,22,0.08);
    }
    .ra-action-row {
      display: flex; align-items: center; justify-content: space-between;
      margin-top: 1rem; gap: 1rem;
    }
    .ra-action-save {
      background: #2D2416; color: #C9A227; border: none; padding: 0.7rem 1.8rem;
      font-family: inherit; font-size: 0.85rem; letter-spacing: 0.2em;
      cursor: pointer; transition: all 0.3s ease;
    }
    .ra-action-save:hover { background: #C9A227; color: #2D2416; }
    .ra-action-save.saved { background: rgba(201,162,39,0.2); color: #8B6914; }
    .ra-action-meta {
      color: rgba(45,36,22,0.4); font-size: 0.7rem; letter-spacing: 0.15em;
    }

    /* ══ PREFACE (序) ════════════════════════════════════════════════════════ */
    .ra-preface {
      min-height: 100vh; background:
        radial-gradient(ellipse at 30% 25%, rgba(201,162,39,0.10) 0%, transparent 55%),
        radial-gradient(ellipse at 75% 75%, rgba(201,162,39,0.06) 0%, transparent 55%),
        #0B0805;
      color: #FAF8F3;
      display: flex; align-items: center; justify-content: center;
      padding: 6rem 3rem; position: relative; overflow: hidden;
    }
    /* Subtle vertical golden meditation line on left */
    .ra-preface::before {
      content: ''; position: absolute;
      left: clamp(2rem, 8vw, 7rem); top: 12vh; bottom: 12vh; width: 1px;
      background: linear-gradient(to bottom,
        transparent 0%, rgba(201,162,39,0.3) 25%,
        rgba(201,162,39,0.5) 50%, rgba(201,162,39,0.3) 75%, transparent 100%);
      pointer-events: none;
    }
    /* Decorative giant glyph */
    .ra-preface-glyph {
      position: absolute; right: -2rem; bottom: -6rem;
      font-family: 'Playfair Display', 'Noto Serif SC', serif;
      font-size: clamp(22rem, 38vw, 38rem);
      color: rgba(201,162,39,0.045); line-height: 1; font-weight: 700;
      pointer-events: none; user-select: none; letter-spacing: -0.05em;
    }
    .ra-preface-content {
      max-width: 700px; position: relative; z-index: 1;
      padding-left: clamp(0px, 4vw, 3rem);
    }

    /* Heading area */
    .ra-preface-eyebrow {
      color: rgba(201,162,39,0.55); font-size: 0.7rem;
      letter-spacing: 0.55em; margin-bottom: 1.5rem;
      display: flex; align-items: center; gap: 1rem;
    }
    .ra-preface-eyebrow::after {
      content: ''; flex: 1; height: 1px; background: rgba(201,162,39,0.2);
    }
    .ra-preface-title {
      font-family: 'Playfair Display', 'Noto Serif SC', serif;
      font-size: clamp(1.6rem, 3vw, 2.2rem);
      color: #FAF8F3; font-weight: 400;
      letter-spacing: 0.18em; margin-bottom: 4rem;
      opacity: 0.85;
    }

    /* Body lines */
    .ra-preface-line {
      font-family: 'Noto Serif SC', serif;
      font-size: clamp(1rem, 1.5vw, 1.18rem);
      line-height: 2.4;
      color: rgba(250,248,243,0.78);
      margin-bottom: 1.8rem;
      letter-spacing: 0.04em;
    }
    .ra-preface-line strong {
      color: #C9A227; font-weight: 500;
      text-shadow: 0 0 16px rgba(201,162,39,0.25);
    }
    /* Lead lines (the three "重复" mantras) */
    .ra-preface-lead {
      font-family: 'Playfair Display', 'Noto Serif SC', serif;
      font-size: clamp(1.7rem, 3.2vw, 2.6rem);
      line-height: 1.5; letter-spacing: 0.05em;
      color: #C9A227; font-style: italic;
      margin: 3rem 0; padding-left: 1.5rem;
      border-left: 2px solid rgba(201,162,39,0.4);
      text-shadow: 0 0 30px rgba(201,162,39,0.2);
    }
    .ra-preface-lead.final {
      font-size: clamp(1.4rem, 2.5vw, 2rem);
      color: #FAF8F3; opacity: 0.9; font-style: normal;
      letter-spacing: 0.15em;
    }
    .ra-preface-divider {
      width: 60px; height: 1px; background: rgba(201,162,39,0.35);
      margin: 2.5rem 0;
    }

    /* Enter row at bottom */
    .ra-preface-enter {
      margin-top: 4rem; display: flex; align-items: center;
      gap: 2rem; flex-wrap: wrap;
    }

    /* ══ ANCHOR NAV (right floating mini-toc) ════════════════════════════════ */
    .ra-anchors {
      position: fixed; right: 2rem; top: 50%; transform: translateY(-50%);
      display: flex; flex-direction: column; gap: 1rem; z-index: 80;
    }
    .ra-anchor {
      display: flex; align-items: center; gap: 0.8rem; cursor: pointer;
      color: rgba(45,36,22,0.4); transition: all 0.3s ease;
      font-size: 0.7rem; letter-spacing: 0.1em;
    }
    .ra-anchor-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: rgba(201,162,39,0.3); transition: all 0.3s ease;
    }
    .ra-anchor:hover { color: #C9A227; }
    .ra-anchor:hover .ra-anchor-dot { background: #C9A227; }
    .ra-anchor.active {
      color: #C9A227;
    }
    .ra-anchor.active .ra-anchor-dot {
      background: #C9A227; transform: scale(1.5);
      box-shadow: 0 0 8px rgba(201,162,39,0.6);
    }
    .ra-anchor-label {
      max-width: 0; overflow: hidden; white-space: nowrap;
      transition: max-width 0.3s ease;
    }
    .ra-anchor:hover .ra-anchor-label,
    .ra-anchor.active .ra-anchor-label { max-width: 200px; }
    @media (max-width: 1100px) { .ra-anchors { display: none; } }

    /* ══ BACK TO TOP BUTTON ══════════════════════════════════════════════════ */
    .ra-totop {
      position: fixed; right: 2rem; bottom: 2rem; width: 44px; height: 44px;
      background: #2D2416; color: #C9A227; border: 1px solid rgba(201,162,39,0.3);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      opacity: 0; transform: translateY(10px); transition: all 0.3s ease;
      z-index: 150; pointer-events: none;
    }
    .ra-totop.show { opacity: 1; transform: translateY(0); pointer-events: auto; }
    .ra-totop:hover { background: #C9A227; color: #2D2416; }

    /* ══ KEYBOARD HINT (subtle) ══════════════════════════════════════════════ */
    .ra-kbd {
      display: inline-block; padding: 2px 6px; min-width: 18px; text-align: center;
      border: 1px solid rgba(201,162,39,0.3); border-bottom-width: 2px;
      font-family: 'Playfair Display', serif; font-size: 0.7rem;
      color: rgba(201,162,39,0.7); margin: 0 2px;
    }

    /* ══ CHAPTER HERO SVG DECORATIONS ════════════════════════════════════════ */
    .ra-hero-deco {
      position: absolute; right: 2rem; top: 50%; transform: translateY(-50%);
      width: clamp(120px, 18vw, 220px); height: clamp(120px, 18vw, 220px);
      opacity: 0.85; pointer-events: none;
    }
    .ra-hero-deco svg { width: 100%; height: 100%; }
    @media (max-width: 900px) { .ra-hero-deco { display: none; } }

    /* ══ SPIRAL ANIMATION (Ch02) ═════════════════════════════════════════════ */
    @keyframes ra-spin-slow { from { transform: rotate(0); } to { transform: rotate(360deg); } }
    .ra-spin { animation: ra-spin-slow 80s linear infinite; transform-origin: center; }

    /* ══ DIRECTORY HERO BIG GLYPH ════════════════════════════════════════════ */
    .ra-dir-glyph {
      position: absolute; right: -2rem; top: -3rem; font-family: 'Playfair Display', serif;
      font-size: clamp(14rem, 22vw, 22rem); color: rgba(201,162,39,0.05);
      line-height: 1; font-weight: 700; pointer-events: none; user-select: none;
      letter-spacing: -0.05em;
    }

    /* ══ PULL QUOTE BLOCK (full bleed) ═══════════════════════════════════════ */
    .ra-bigquote {
      position: relative; padding: 4rem 2rem; margin: 4rem 0;
      text-align: center; border-top: 1px solid rgba(201,162,39,0.2);
      border-bottom: 1px solid rgba(201,162,39,0.2);
    }
    .ra-bigquote-text {
      font-family: 'Playfair Display','Noto Serif SC',serif;
      font-size: clamp(1.5rem, 3.2vw, 2.4rem); line-height: 1.6;
      color: #2D2416; font-style: italic; max-width: 720px; margin: 0 auto;
    }
    .ra-bigquote-text strong { color: #C9A227; font-weight: 400; font-style: normal; }
    .ra-bigquote::before, .ra-bigquote::after {
      content: ''; position: absolute; left: 50%; transform: translateX(-50%);
      width: 40px; height: 1px; background: #C9A227;
    }
    .ra-bigquote::before { top: -1px; }
    .ra-bigquote::after  { bottom: -1px; }

    @media (max-width: 768px) {
      .ra-sidebar { display: none; }
      .ra-main { width: 100%; }
      .ra-progress { left: 0; }
      .ra-chap-nav { grid-template-columns: 1fr; }
    }
  `}</style>
);

// ── Willpower Test (3-second hold, embedded as Ch01 demo) ───────────────────
const WillpowerTest = () => {
  const HOLD_MS = 3000;
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  const [attempts, setAttempts] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef(null);
  const passedRef = useRef(false);

  const SIZE = 160, RADIUS = 72;
  const CIRC = 2 * Math.PI * RADIUS;

  const beginHold = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (passedRef.current) return;
    if (status === 'failed') { setStatus('idle'); setProgress(0); }
    setStatus('holding');
    startRef.current = Date.now();
    const tick = () => {
      const pct = Math.min(100, ((Date.now() - startRef.current) / HOLD_MS) * 100);
      setProgress(pct);
      if (pct >= 100) {
        passedRef.current = true;
        setStatus('passed');
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const endHold = () => {
    if (passedRef.current || status !== 'holding') return;
    cancelAnimationFrame(rafRef.current);
    setStatus('failed');
    setAttempts(a => a + 1);
    setTimeout(() => setProgress(0), 900);
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  let mainText = '按住光点 3 秒';
  let subText  = '鼠标 / 手指按住不要松开';
  if (status === 'holding') {
    mainText = '继续按住……';
    subText  = `${(progress / 100 * 3).toFixed(1)} / 3.0 秒`;
  }
  if (status === 'failed') {
    if (attempts === 1) {
      mainText = '看吧 —— 你已经松手了';
      subText  = '连 3 秒都需要意志';
    } else if (attempts === 2) {
      mainText = '再试一次';
      subText  = '一个道理重复 21 天，是 60480 倍的难';
    } else {
      mainText = '没关系。重复，重复，重复';
      subText  = '再来一次';
    }
  }
  if (status === 'passed') {
    mainText = '你做到了';
    subText  = '——3 秒而已。但你刚才确实用上了意志';
  }

  return (
    <div className="ra-will">
      <div className="ra-will-intro">
        <div className="ra-will-intro-title">那么先做一件事——</div>
        <div className="ra-will-intro-sub">
          按住下面这个金色光点 <strong style={{color:'#C9A227'}}>3 秒</strong>，
          中途不要松开。
        </div>
      </div>

      <div className={`ra-will-orb-wrap ${status}`}
           onMouseDown={beginHold} onMouseUp={endHold} onMouseLeave={endHold}
           onTouchStart={beginHold} onTouchEnd={endHold} onTouchCancel={endHold}>
        <svg className="ra-will-ring" viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle className="bg" cx={SIZE/2} cy={SIZE/2} r={RADIUS} />
          <circle className="fg" cx={SIZE/2} cy={SIZE/2} r={RADIUS}
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC - (progress / 100) * CIRC} />
        </svg>
        <div className="ra-will-orb" />
      </div>

      <div className={`ra-will-prompt ${status}`}>
        <div className="ra-will-prompt-main">{mainText}</div>
        <div className="ra-will-prompt-sub">{subText}</div>
        {attempts > 0 && status !== 'passed' && (
          <div className="ra-will-attempts">第 {attempts + 1} 次</div>
        )}
      </div>

      {(status === 'passed' || attempts >= 2) && (
        <div className="ra-will-coda">
          {status === 'passed' ? (
            <>3 秒，你按住了。<br/>
            但试着想象一下：把"早睡"按住 <strong>21 天</strong>。把"少刷手机"按住 <strong>100 天</strong>。<br/>
            <strong>知道</strong>和<strong>做到</strong>之间，差的就是这种意志的延续。</>
          ) : (
            <>这就是<strong>意志的缝隙</strong>。<br/>
            知道要按住，知道只有 3 秒，知道松手就失败——
            但身体还是松开了。<br/>
            生活里的"知道却没做到"，每一次都是同样的机制。</>
          )}
        </div>
      )}
    </div>
  );
};

// ── Landing Page ──────────────────────────────────────────────────────────────
const LandingPage = ({ onEnter }) => {
  const [phase, setPhase] = useState(0);
  const [crackVisible, setCrackVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [entryVisible, setEntryVisible] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 3500),
      setTimeout(() => setPhase(3), 6500),
      setTimeout(() => setCrackVisible(true), 7000),
      setTimeout(() => setHeroVisible(true), 7800),
      setTimeout(() => setEntryVisible(true), 10000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleEnter = () => { setTransitioning(true); setTimeout(onEnter, 1200); };

  // generate floating dust particles
  const dust = Array.from({ length: 18 }, (_, i) => ({
    left: `${(i * 53) % 100}%`,
    delay: `${(i * 0.7) % 12}s`,
    duration: `${10 + (i % 6)}s`,
  }));

  return (
    <div className={`ra-landing ${transitioning ? 'ra-out' : ''}`}>
      {/* Floating gold dust */}
      {dust.map((d, i) => (
        <span key={i} className="ra-dust"
              style={{ left: d.left, animationDelay: d.delay, animationDuration: d.duration }} />
      ))}

      {/* Corner brand */}
      <div className="ra-landing-corner tl">
        <div style={{ color:'#C9A227', fontSize:'0.75rem', letterSpacing:'0.25em', marginBottom:'0.3rem' }}>
          HOPER · 希望者
        </div>
        <div style={{ fontSize:'0.6rem', opacity:0.6 }}>文库 Vol.001 · 2025.05.05</div>
      </div>
      <div className="ra-landing-corner tr">MMXXV</div>
      <div className="ra-landing-corner br">
        240 分钟直播 · 22 万字逐字稿
      </div>

      {/* Phrases */}
      <p className={`ra-phrase ${phase === 1 ? 'show' : phase > 1 ? 'hide' : ''}`}>
        你的注意力，每天被切碎成 10 秒
      </p>
      <p className={`ra-phrase ${phase === 2 ? 'show' : phase > 2 ? 'hide' : ''}`}
         style={{ fontSize: 'clamp(0.9rem,1.8vw,1.3rem)', color: 'rgba(201,162,39,0.75)' }}>
        但你最值钱的东西，恰恰是它
      </p>

      {/* Two-door split (cinematic) */}
      {phase >= 3 && (
        <div className="ra-door-wrap">
          <div className={`ra-door left ${crackVisible ? 'open' : ''}`}>
            <span className="ra-door-glyph-half">莽</span>
          </div>
          <div className={`ra-door right ${crackVisible ? 'open' : ''}`}>
            <span className="ra-door-glyph-half">莽</span>
          </div>
          <div className={`ra-crack ${crackVisible ? 'show' : ''}`} />
        </div>
      )}

      {/* Hero */}
      <div className={`ra-hero ${heroVisible ? 'show' : ''}`}>
        <div className="ra-hero-inner">
          <p style={{ color: 'rgba(201,162,39,0.5)', fontSize: '0.75rem',
                       letterSpacing: '0.4em', marginBottom: '1.5rem' }}>
            COMPOUND · ATTENTION · SOUL
          </p>
          <h1 style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                        fontSize: 'clamp(2rem,5vw,4rem)', color: '#FAF8F3',
                        fontWeight: 400, letterSpacing: '0.05em',
                        textShadow: '0 0 40px rgba(201,162,39,0.3)', lineHeight: 1.3 }}>
            年轻人，就是要莽
          </h1>
          <p style={{ color: 'rgba(201,162,39,0.7)', fontSize: 'clamp(0.95rem,1.6vw,1.1rem)',
                       letterSpacing: '0.3em', marginTop: '1.2rem' }}>
            复利 · 注意力 · 心力
          </p>
          <p style={{ color: 'rgba(250,248,243,0.45)', fontSize: 'clamp(0.78rem,1.2vw,0.9rem)',
                       letterSpacing: '0.15em', marginTop: '0.8rem', fontStyle: 'italic' }}>
            一场四小时的直播，做成一本可以反复翻阅的书
          </p>
        </div>
      </div>

      {/* Entry */}
      <div className={`ra-entry ${entryVisible ? 'show' : ''}`}
           style={{ position: 'absolute', bottom: '12vh', left: 0, right: 0,
                     display: 'flex', justifyContent: 'center',
                     pointerEvents: entryVisible ? 'auto' : 'none' }}>
        <button className="ra-btn" onClick={handleEnter}>
          开始阅读 →
        </button>
      </div>
    </div>
  );
};

// ── SVG Hero Decorations ─────────────────────────────────────────────────────
const HeroDecoCh01 = () => ( // 5 horizontal bars deepening
  <div className="ra-hero-deco">
    <svg viewBox="0 0 200 200">
      {[1,2,3,4,5].map(i => (
        <rect key={i} x={20} y={i*30 - 10} width={160} height={4}
              fill="#C9A227" opacity={0.15 + i * 0.15} />
      ))}
      <text x={100} y={185} textAnchor="middle" fontSize="9"
            fill="#C9A227" opacity={0.6} letterSpacing="2">
        DEEPENING
      </text>
    </svg>
  </div>
);

const HeroDecoCh02 = () => ( // spiral
  <div className="ra-hero-deco">
    <svg viewBox="0 0 200 200">
      <g className="ra-spin">
        <path d="M100,100 m-70,0 a70,70 0 1,0 140,0 a70,70 0 1,0 -140,0"
              fill="none" stroke="#C9A227" strokeWidth="0.7" opacity="0.4" />
        <path d="M100,100 m-50,0 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0"
              fill="none" stroke="#C9A227" strokeWidth="0.7" opacity="0.5" />
        <path d="M100,100 m-30,0 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0"
              fill="none" stroke="#C9A227" strokeWidth="0.7" opacity="0.6" />
      </g>
      {/* spiraling path */}
      <path d="M 100 100 m -10 0 q 0 -10 10 -10 q 20 0 20 20 q 0 30 -30 30 q -40 0 -40 -40 q 0 -50 50 -50 q 60 0 60 60"
            fill="none" stroke="#C9A227" strokeWidth="1.5" opacity="0.8" />
      <circle cx="160" cy="40" r="3" fill="#C9A227" />
    </svg>
  </div>
);

const HeroDecoCh03 = () => ( // mining contrast: dot vs pickaxe wedge
  <div className="ra-hero-deco">
    <svg viewBox="0 0 200 200">
      <g opacity="0.3">
        {Array.from({length: 20}).map((_, i) => (
          <circle key={i} cx={20 + (i*23) % 160} cy={20 + ((i*47) % 160)}
                  r={1 + (i % 3)} fill="#C9A227" />
        ))}
      </g>
      <line x1="40" y1="100" x2="160" y2="100" stroke="#C9A227" strokeWidth="0.5" opacity="0.5" />
      <text x="40" y="92" fontSize="11" fill="#C9A227" opacity="0.6"
            fontFamily="Playfair Display" fontStyle="italic">ore</text>
      <text x="160" y="115" fontSize="11" fill="#C9A227" opacity="0.9" textAnchor="end"
            fontFamily="Playfair Display" fontStyle="italic">miner</text>
      <path d="M 100 60 L 100 140 M 80 80 L 120 80" stroke="#C9A227" strokeWidth="2" opacity="0.8" />
    </svg>
  </div>
);

const HeroDecoCh04 = () => ( // closed loop with 5 nodes
  <div className="ra-hero-deco">
    <svg viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="65" fill="none" stroke="#C9A227"
              strokeWidth="0.8" opacity="0.4" strokeDasharray="3 3" />
      {[0,1,2,3,4].map(i => {
        const angle = (i * 72 - 90) * Math.PI / 180;
        const x = 100 + Math.cos(angle) * 65;
        const y = 100 + Math.sin(angle) * 65;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={i === 0 ? 8 : 5}
                    fill={i === 0 ? '#C9A227' : '#FAF8F3'}
                    stroke="#C9A227" strokeWidth="1.5" />
            <text x={x} y={y + 3} textAnchor="middle" fontSize="7"
                  fill={i === 0 ? '#FAF8F3' : '#C9A227'}
                  fontFamily="Playfair Display" fontWeight="600">
              {i + 1}
            </text>
          </g>
        );
      })}
      <text x="100" y="105" textAnchor="middle" fontSize="9"
            fill="#C9A227" opacity="0.5" letterSpacing="2">LOOP</text>
    </svg>
  </div>
);

// ── Action Card (chips + optional textarea, persisted to localStorage) ──────
const ActionCard = ({ id, title, prompts, chips, chipsLabel, placeholder, hint }) => {
  const key = `ra-action-${id}`;
  const [picked, setPicked] = useState([]);     // selected chip values
  const [custom, setCustom] = useState('');     // free-text "其他" content
  const [showCustom, setShowCustom] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const data = JSON.parse(raw);
        setPicked(data.picked || []);
        setCustom(data.custom || '');
        if (data.custom && data.custom.trim()) setShowCustom(true);
        setSavedAt(data.savedAt || null);
      }
    } catch (e) {}
  }, [key]);

  const togglePick = (chip) => {
    setPicked(prev => prev.includes(chip)
      ? prev.filter(c => c !== chip)
      : [...prev, chip]);
  };

  const save = () => {
    try {
      // Compose human-readable saved value
      const parts = [];
      if (picked.length) parts.push(picked.join(' · '));
      if (custom && custom.trim()) parts.push(custom.trim());
      const value = parts.join('\n\n');

      const ts = new Date().toLocaleString('zh-CN', { hour12: false });
      localStorage.setItem(key, JSON.stringify({
        picked, custom, value, savedAt: ts, title
      }));
      setSavedAt(ts);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1800);
    } catch (e) {}
  };

  const hasContent = picked.length > 0 || (custom && custom.trim());

  return (
    <div className="ra-action">
      <h4>{title}</h4>
      {prompts && (
        <div className="ra-action-prompt">
          {prompts.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span style={{ color: '#C9A227', flexShrink: 0 }}>·</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      )}

      {chips && chips.length > 0 && (
        <>
          <div className="ra-chips-hint">{chipsLabel || '点击挑选 · 可多选'}</div>
          <div className="ra-chips">
            {chips.map((chip, i) => (
              <button key={i} type="button"
                      className={`ra-chip ${picked.includes(chip) ? 'selected' : ''}`}
                      onClick={() => togglePick(chip)}>
                {picked.includes(chip) && <span style={{fontSize:'0.7rem'}}>✓</span>}
                {chip}
              </button>
            ))}
            <button type="button"
                    className={`ra-chip ra-chip-other ${showCustom ? 'selected' : ''}`}
                    onClick={() => setShowCustom(s => !s)}>
              {showCustom ? '✕ 收起' : '+ 其他（自己写）'}
            </button>
          </div>
        </>
      )}

      {(showCustom || !chips) && (
        <textarea className="ra-action-textarea" value={custom}
                  onChange={e => setCustom(e.target.value)}
                  placeholder={placeholder} />
      )}

      <div className="ra-action-row">
        <span className="ra-action-meta">
          {hint || '保存到本地浏览器 · 不上传任何服务器'}
          {savedAt && ` · 已保存 ${savedAt}`}
        </span>
        <button className={`ra-action-save ${justSaved ? 'saved' : ''}`}
                onClick={save}
                disabled={!hasContent}
                style={{ opacity: hasContent ? 1 : 0.4,
                          cursor: hasContent ? 'pointer' : 'not-allowed' }}>
          {justSaved ? '✓ 已保存' : '保 存'}
        </button>
      </div>
    </div>
  );
};

// ── Preface Page (序：重复有万钧之力) ────────────────────────────────────────
// Sequenced reveal with varying delays for breathing rhythm
const PrefaceLine = ({ delay, className = 'ra-preface-line', children }) => {
  const [shown, setShown] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => setShown(true), delay);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={className}
         style={{ opacity: shown ? 1 : 0,
                   transform: shown ? 'translateY(0)' : 'translateY(20px)',
                   filter: shown ? 'blur(0)' : 'blur(8px)',
                   transition: 'opacity 1.6s ease, transform 1.6s ease, filter 1.6s ease' }}>
      {children}
    </div>
  );
};

const PrefacePage = ({ onNav }) => {
  // Floating ambient dust
  const dust = Array.from({ length: 14 }, (_, i) => ({
    left: `${(i * 71) % 100}%`,
    delay: `${(i * 0.9) % 12}s`,
    duration: `${12 + (i % 5)}s`,
  }));

  return (
    <section className="ra-preface">
      {/* Ambient floating dust */}
      {dust.map((d, i) => (
        <span key={i} className="ra-dust"
              style={{ left: d.left, animationDelay: d.delay, animationDuration: d.duration }} />
      ))}

      <span className="ra-preface-glyph">编</span>

      <div className="ra-preface-content">
        <PrefaceLine delay={200}>
          <p className="ra-preface-eyebrow">PREFACE · 编者按</p>
        </PrefaceLine>

        <PrefaceLine delay={500}>
          <h1 className="ra-preface-title">关于这份文档</h1>
        </PrefaceLine>

        {/* Lead */}
        <PrefaceLine delay={1000} className="ra-preface-lead">
          一场四小时的直播，<br/>做成一本可以反复翻阅的书。
        </PrefaceLine>

        <PrefaceLine delay={1900}>
          <p className="ra-preface-line">
            这不是摘要，也不是逐字稿，而是一份<strong>"直播平替稿"</strong>——
            把树林 5 月 5 日整场直播的全部观点、案例、戳人时刻，按底层逻辑重新组织，
            复原成一份"读它就等于看完直播"的完整文档。
          </p>
        </PrefaceLine>

        <PrefaceLine delay={2700}>
          <p className="ra-preface-line">
            原始素材是 <strong>22 万字、5500 行逐字稿</strong>。
            这份整理稿做了三件事：按主题逻辑重排顺序、保留所有不可替代的原话和案例、
            用引用与金句单页让你既能从头读完也能随时翻阅。
          </p>
        </PrefaceLine>

        <PrefaceLine delay={3500}>
          <div className="ra-preface-divider" />
        </PrefaceLine>

        <PrefaceLine delay={3900}>
          <p className="ra-preface-line">
            全文<strong>四篇十一章 + 附录</strong>，约 50 页。
            如果你只读这份文档不看原直播，你会拿到 <strong>90%</strong> 树林想给你的东西。
          </p>
        </PrefaceLine>

        <PrefaceLine delay={4800}>
          <p className="ra-preface-line">
            剩下的 10%，是他在直播里那些只属于现场的、靠语气和情绪传递的部分——
            那些没办法被任何文字复刻。
          </p>
        </PrefaceLine>

        <PrefaceLine delay={5700}>
          <p className="ra-preface-line">
            这场直播表面的题目是 <strong>"年轻人，就是要莽"</strong>。
            但树林真正想说的可能是另一句话——他在结尾说的：
          </p>
        </PrefaceLine>

        {/* The closing line that defines this whole book */}
        <PrefaceLine delay={6700} className="ra-preface-lead">
          "改变世界不死，理想不灭，<br/>现在随便喊。"
        </PrefaceLine>

        <PrefaceLine delay={7600}>
          <p className="ra-preface-line">
            这是一个 <strong>28 岁的人</strong>停更大半年之后的第一场直播。
            他想把这半年沉默换来的所有东西，<strong>毫无保留地交给愿意听的人</strong>。
          </p>
        </PrefaceLine>

        <PrefaceLine delay={8400} className="ra-preface-lead final">
          —— 整理者 · 2025
        </PrefaceLine>

        <PrefaceLine delay={9400}>
          <div className="ra-preface-enter">
            <button onClick={() => onNav('directory')}
                    style={{ background: 'transparent', border: '1px solid #C9A227',
                              color: '#C9A227', padding: '1rem 2.8rem',
                              fontFamily: "'Noto Serif SC',serif", fontSize: '0.95rem',
                              letterSpacing: '0.3em', cursor: 'pointer',
                              transition: 'all 0.4s ease' }}
                    onMouseEnter={e => { e.target.style.background = '#C9A227'; e.target.style.color = '#0B0805'; }}
                    onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#C9A227'; }}>
              进入目录 →
            </button>
            <span style={{ color: 'rgba(201,162,39,0.4)', fontSize: '0.7rem',
                            letterSpacing: '0.2em', display: 'flex',
                            alignItems: 'center', gap: '0.4rem' }}>
              或按 <span className="ra-kbd">→</span> 直接进入
            </span>
          </div>
        </PrefaceLine>
      </div>
    </section>
  );
};

// ── Stage Picker (Ch01: where am I right now?) ──────────────────────────────
const StagePicker = ({ stages }) => {
  const [picked, setPicked] = useState(null);
  const KEY = 'ra-stage-picked';
  useEffect(() => {
    try { const v = localStorage.getItem(KEY); if (v) setPicked(parseInt(v)); } catch (e) {}
  }, []);
  const choose = (i) => {
    setPicked(i);
    try { localStorage.setItem(KEY, String(i)); } catch (e) {}
  };
  const feedback = [
    { label:'信息阶段 · 现在该做的',
      text:'你刚刚听过它。下一步只有一件事——把它写到你今天必看的地方。手机壁纸、桌面便签、笔记扉页都行。让它至少不要消失。' },
    { label:'认同阶段 · 现在该做的',
      text:'你"觉得对"了，但卡在了最深的缝隙——意志的缝隙。下一步：今天就用它做一个真实的小决定。一次就好。让认同长出第一个动作。' },
    { label:'执行阶段 · 现在该做的',
      text:'你已经做过几次。下一步不是做更多，而是做得更稳定。给自己设一个触发器："每次 X 发生，我就用这个原则。"让执行从偶然变成自动。' },
    { label:'习惯阶段 · 现在该做的',
      text:'你已经能默认这样做。下一步是检验：在你最累、最焦虑、最自我批判的时候，它还会出现吗？让它在压力下也成立，才会真正变成你的气质。' },
    { label:'气质阶段 · 现在该做的',
      text:'恭喜——别人能从你身上看见它了。但人不能停。回到第 01 步，找一个新的道理，重新开始一次螺旋。一个气质好的人，永远在重复一些更深的东西。' },
  ];
  return (
    <div className="ra-stage-pick">
      <div className="ra-stage-pick-q">那么——你现在在哪一阶段？</div>
      <p className="ra-stage-pick-hint">挑一个，看一下你的下一步是什么</p>
      <div className="ra-stage-buttons">
        {stages.map((s, i) => (
          <button key={i}
                  className={`ra-stage-btn ${picked === i ? 'selected' : ''}`}
                  onClick={() => choose(i)}>
            <span className="ra-stage-btn-num">{s.n}</span>
            <span className="ra-stage-btn-label">{s.label}</span>
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className="ra-stage-feedback" key={picked}>
          <div className="ra-stage-feedback-label">{feedback[picked].label}</div>
          <p className="ra-stage-feedback-text">{feedback[picked].text}</p>
        </div>
      )}
    </div>
  );
};

// ── Compound Visualizer (Ch02: see compounding with your own habit) ─────────
const CompoundVisualizer = () => {
  const KEY = 'ra-compound';
  const [thing, setThing] = useState('');
  const [amount, setAmount] = useState(100);
  const [unit, setUnit] = useState('字');
  const [animated, setAnimated] = useState(false);
  const days = [1, 7, 21, 100, 365];

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setThing(d.thing || '');
        setAmount(d.amount || 100);
        setUnit(d.unit || '字');
        setAnimated(true);
      }
    } catch (e) {}
  }, []);

  const persist = (next = {}) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ thing, amount, unit, ...next }));
    } catch (e) {}
  };

  const handleVisualize = () => {
    setAnimated(false);
    setTimeout(() => setAnimated(true), 30);
    persist();
  };

  // bar heights (log-scaled so 365 isn't off the chart)
  const totals = days.map(d => d * (Number(amount) || 0));
  const maxTotal = Math.max(...totals, 1);
  const heights = totals.map(t => Math.max(8, (Math.log(t + 1) / Math.log(maxTotal + 1)) * 100));

  const fmt = (n) => n >= 1000 ? n.toLocaleString('zh-CN') : String(n);

  return (
    <div className="ra-compound">
      <div className="ra-compound-title">复利可视化器</div>
      <p className="ra-compound-sub">
        输入你今天准备做的一件小事，看看它在 1 / 7 / 21 / 100 / 365 天后会变成什么。
      </p>

      <div className="ra-compound-input-row">
        <input className="ra-compound-input" type="text" placeholder="例：每天写"
               value={thing} onChange={e => setThing(e.target.value)} />
        <input className="ra-compound-input num" type="number" min="1"
               value={amount} onChange={e => setAmount(e.target.value)} />
        <input className="ra-compound-input num" type="text" placeholder="单位"
               value={unit} onChange={e => setUnit(e.target.value)}
               style={{ maxWidth: 80, flex: '0 0 80px' }} />
        <button className="ra-action-save" onClick={handleVisualize}
                style={{ background: '#C9A227', color: '#2D2416' }}>
          看 →
        </button>
      </div>

      <div className="ra-compound-bars">
        {days.map((d, i) => (
          <div key={d} className="ra-compound-bar-col">
            <div className="ra-compound-bar"
                 style={{
                   height: animated ? `${heights[i]}%` : '0%',
                   transitionDelay: `${i * 200}ms`,
                 }}>
              {animated && (
                <span className="ra-compound-bar-value">
                  {fmt(totals[i])} {unit}
                </span>
              )}
            </div>
            <div className="ra-compound-bar-day">{d} 天</div>
          </div>
        ))}
      </div>

      {animated && thing && (
        <div className="ra-compound-summary">
          一年之后：你「{thing}」积累的总量是
          <strong> {fmt(totals[4])} {unit}</strong>
          <br />
          <span style={{ color: 'rgba(45,36,22,0.55)', fontSize: '0.8rem' }}>
            前提：不要反复清零
          </span>
        </div>
      )}
    </div>
  );
};

// ── Commitment Card (Outro: 21-day pledge) ──────────────────────────────────
const CommitmentCard = () => {
  const KEY = 'ra-commit';
  const [principle, setPrinciple] = useState('');
  const [action, setAction] = useState('');
  const [savedAt, setSavedAt] = useState(null);
  const [revealAt, setRevealAt] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setPrinciple(d.principle || '');
        setAction(d.action || '');
        setSavedAt(d.savedAt || null);
        setRevealAt(d.revealAt || null);
      }
    } catch (e) {}
  }, []);

  // Pre-fill principle from Ch01 action card (if user picked one)
  useEffect(() => {
    if (principle) return;
    try {
      const raw = localStorage.getItem('ra-action-ch01');
      if (raw) {
        const d = JSON.parse(raw);
        if (d.picked && d.picked.length > 0) setPrinciple(d.picked[0]);
        else if (d.custom) setPrinciple(d.custom.split('\n')[0].slice(0, 30));
      }
    } catch (e) {}
  }, []);

  const save = () => {
    if (!principle.trim() || !action.trim()) return;
    const now = new Date();
    const target = new Date(now.getTime() + 21 * 24 * 3600 * 1000);
    const fmt = (d) => `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
    const ts = fmt(now);
    const reveal = fmt(target);
    try {
      localStorage.setItem(KEY, JSON.stringify({
        principle, action, savedAt: ts, revealAt: reveal
      }));
      setSavedAt(ts); setRevealAt(reveal);
    } catch (e) {}
  };

  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
  })();
  const target21 = (() => {
    const d = new Date(Date.now() + 21 * 24 * 3600 * 1000);
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
  })();

  const ready = principle.trim() && action.trim();

  return (
    <div className="ra-commit">
      <span className="ra-commit-glyph">诺</span>
      <div className="ra-commit-inner">
        <p className="ra-commit-eyebrow">21-DAY COMMITMENT</p>
        <h3 className="ra-commit-title">写一份给自己的承诺</h3>

        <div className="ra-commit-fields">
          <div>
            <div className="ra-commit-field-label">那句道理</div>
            <input className="ra-commit-input" type="text"
                   placeholder="例：不要反复归零"
                   value={principle}
                   onChange={e => setPrinciple(e.target.value)} />
          </div>
          <div>
            <div className="ra-commit-field-label">未来 21 天，我承诺这样做</div>
            <textarea className="ra-commit-textarea"
                      placeholder="例：每天睡前问自己一遍：今天有什么留下了？"
                      value={action}
                      onChange={e => setAction(e.target.value)} />
          </div>
        </div>

        {/* Live preview card */}
        <div className="ra-commit-card">
          <div className="ra-commit-card-q">我的承诺</div>
          <div className="ra-commit-card-line">
            「{principle || '——你的那句道理——'}」
          </div>
          <div className="ra-commit-card-action">
            {action || '——你给自己的承诺——'}
          </div>
          <div className="ra-commit-card-dates">
            <div className="ra-commit-date-block">
              <div className="ra-commit-date-label">承诺于</div>
              <div className="ra-commit-date-value">{savedAt || today}</div>
            </div>
            <div className="ra-commit-date-block">
              <div className="ra-commit-date-label">21 天后回来</div>
              <div className="ra-commit-date-value">{revealAt || target21}</div>
            </div>
          </div>
        </div>

        <button className="ra-commit-save" onClick={save} disabled={!ready}>
          {savedAt ? '✓ 已封印 · 重新承诺' : '封 印 这 份 承 诺'}
        </button>

        <p className="ra-commit-meta">
          {savedAt
            ? `已保存到本地浏览器 · ${revealAt} 那天回来看看你做到了什么`
            : '保存后 21 天后回来 · 也是给"重复"的一次实战'}
        </p>
      </div>
    </div>
  );
};

// ── Chapter Entrance Overlay (full-screen ceremony) ─────────────────────────
const ChapterEntrance = ({ pageId, navKey }) => {
  // Only show for actual chapters
  const chapterMap = {
    preface: { num: '序', label: 'PREFACE',     title: '编者按 · 关于这份文档' },
    ch01:    { num: '壹', label: 'PART ONE',    title: '底层操作系统 · 注意力' },
    ch02:    { num: '贰', label: 'PART TWO',    title: '身体的物理学' },
    ch03:    { num: '叁', label: 'PART THREE',  title: '商业世界的真相' },
    ch04:    { num: '肆', label: 'PART FOUR',   title: 'AI 时代与心力' },
    outro:   { num: '∞',  label: 'APPENDIX',    title: '金句索引 · 后记' },
  };
  const meta = chapterMap[pageId];
  if (!meta) return null;
  return (
    <div className="ra-entrance" key={navKey}>
      {/* Two curtain panels — close in to cover, then split apart to reveal */}
      <div className="ra-entrance-curtain left" />
      <div className="ra-entrance-curtain right" />
      {/* Golden seam where the curtains meet */}
      <div className="ra-entrance-seam" />
      {/* Content (number / label / title / bar) sits centered above curtains */}
      <div className="ra-entrance-content">
        <div className="ra-entrance-num">{meta.num}</div>
        <div className="ra-entrance-label">{meta.label}</div>
        <div className="ra-entrance-title">{meta.title}</div>
        <div className="ra-entrance-bar" />
      </div>
    </div>
  );
};

// ── Mouse Glow (subtle follower) ─────────────────────────────────────────────
const MouseGlow = () => {
  const ref = useRef(null);
  useEffect(() => {
    const onMove = (e) => {
      if (ref.current) {
        ref.current.style.left = e.clientX + 'px';
        ref.current.style.top  = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return <div ref={ref} className="ra-glow" />;
};

// ── Ink Reveal (line-by-line on scroll) ──────────────────────────────────────
const InkReveal = ({ lines, as: Tag = 'div', style, lineStyle, delay = 80 }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        lines.forEach((_, i) =>
          setTimeout(() => setShown(s => Math.max(s, i + 1)), i * delay)
        );
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [lines, delay]);
  return (
    <Tag ref={ref} style={style}>
      {lines.map((line, i) => (
        <span key={i} className={`ra-ink-line ${i < shown ? 'shown' : ''}`}
              style={lineStyle}>
          {line}
        </span>
      ))}
    </Tag>
  );
};

// ── Anchor Nav (floating right-side mini-TOC) ────────────────────────────────
const AnchorNav = ({ scrollEl, items }) => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = scrollEl?.current;
    if (!el) return;
    const onScroll = () => {
      const probe = el.scrollTop + el.clientHeight * 0.3;
      let curr = 0;
      items.forEach((it, i) => {
        const node = document.getElementById(it.id);
        if (node && node.offsetTop <= probe) curr = i;
      });
      setActive(curr);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollEl, items]);
  const goTo = (id) => {
    const node = document.getElementById(id);
    const el = scrollEl?.current;
    if (node && el) el.scrollTo({ top: node.offsetTop - 40, behavior: 'smooth' });
  };
  return (
    <nav className="ra-anchors">
      {items.map((it, i) => (
        <div key={it.id} className={`ra-anchor ${i === active ? 'active' : ''}`}
             onClick={() => goTo(it.id)}>
          <span className="ra-anchor-label">{it.label}</span>
          <span className="ra-anchor-dot" />
        </div>
      ))}
    </nav>
  );
};

// ── Back to top button ───────────────────────────────────────────────────────
const BackToTop = ({ scrollEl, threshold = 400 }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = scrollEl?.current;
    if (!el) return;
    const onScroll = () => setShow(el.scrollTop > threshold);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollEl, threshold]);
  return (
    <button className={`ra-totop ${show ? 'show' : ''}`}
            onClick={() => scrollEl.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top">
      <ChevronUp size={18} />
    </button>
  );
};

// ── Sidebar ───────────────────────────────────────────────────────────────────
export const PAGE_ORDER = ['preface', 'directory', 'ch01', 'ch02', 'ch03', 'ch04', 'outro'];
export const PAGE_META = {
  preface:   { label: '编者按',                icon: <Feather    size={13} />, time: '2 min' },
  directory: { label: '目录',                  icon: <BookMarked size={13} />, time: '1 min' },
  ch01:      { label: '壹 · 上篇 · 注意力',     icon: <Repeat     size={13} />, time: '9 min' },
  ch02:      { label: '贰 · 中篇 · 身体',       icon: <RotateCcw  size={13} />, time: '11 min' },
  ch03:      { label: '叁 · 下篇 · 商业',       icon: <Brain      size={13} />, time: '9 min' },
  ch04:      { label: '肆 · 终篇 · AI 与心力',  icon: <Cpu        size={13} />, time: '10 min' },
  outro:     { label: '金句索引 · 后记',        icon: <Star       size={13} />, time: '4 min' },
};

const Sidebar = ({ active, onNav }) => {
  const idx = PAGE_ORDER.indexOf(active);
  const progress = ((idx + 1) / PAGE_ORDER.length) * 100;

  return (
    <nav className="ra-sidebar">
      <div className="ra-sidebar-logo">
        <div style={{ color: '#C9A227', fontSize: '0.75rem', letterSpacing: '0.3em', marginBottom: '0.4rem' }}>
          HOPER · 希望者
        </div>
        <div style={{ color: 'rgba(250,248,243,0.3)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
          文库 Vol.001 · 2025.05.05
        </div>
      </div>

      {PAGE_ORDER.map((id, i) => {
        const item = PAGE_META[id];
        const isActive = active === id;
        return (
          <div key={id}
               className={`ra-nav-item ${isActive ? 'active' : ''}`}
               onClick={() => onNav(id)}
               style={{ position: 'relative' }}>
            {item.icon}
            <span style={{ flex: 1 }}>{item.label}</span>
            {isActive && <span className="ra-pulse" />}
            {!isActive && (
              <span style={{ fontSize: '0.6rem', opacity: 0.4, letterSpacing: 0 }}>
                {item.time}
              </span>
            )}
          </div>
        );
      })}

      {/* Reading progress + keyboard hint */}
      <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid rgba(201,162,39,0.1)' }}>
        <div style={{ color: 'rgba(201,162,39,0.4)', fontSize: '0.6rem',
                       letterSpacing: '0.2em', marginBottom: '0.5rem',
                       display: 'flex', justifyContent: 'space-between' }}>
          <span>READING</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: 2, background: 'rgba(201,162,39,0.15)', overflow: 'hidden', marginBottom: '1.2rem' }}>
          <div style={{ width: `${progress}%`, height: '100%',
                         background: 'linear-gradient(90deg,#C9A227,#e8c84a)',
                         transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem',
                       color: 'rgba(201,162,39,0.45)', fontSize: '0.6rem',
                       letterSpacing: '0.1em' }}>
          <span className="ra-kbd">←</span>
          <span className="ra-kbd">→</span>
          <span style={{ marginLeft: '0.4rem' }}>切换章节</span>
        </div>
      </div>
    </nav>
  );
};

// ── Chapter footer nav (prev/next) ───────────────────────────────────────────
const ChapterNav = ({ current, onNav }) => {
  const idx = PAGE_ORDER.indexOf(current);
  const prev = idx > 0 ? PAGE_ORDER[idx - 1] : null;
  const next = idx < PAGE_ORDER.length - 1 ? PAGE_ORDER[idx + 1] : null;
  return (
    <div className="ra-chap-nav">
      <div className={`ra-chap-nav-item ${!prev ? 'disabled' : ''}`}
           onClick={() => prev && onNav(prev)}>
        <div className="ra-chap-nav-label">
          <ArrowLeft size={11} /> 上一章
        </div>
        {prev && <div className="ra-chap-nav-title">{PAGE_META[prev].label.replace(/^Ch\d+ · /,'')}</div>}
      </div>
      <div className={`ra-chap-nav-item ${!next ? 'disabled' : ''}`}
           onClick={() => next && onNav(next)}
           style={{ textAlign: 'right', alignItems: 'flex-end' }}>
        <div className="ra-chap-nav-label" style={{ justifyContent: 'flex-end' }}>
          下一章 <ArrowRight size={11} />
        </div>
        {next && <div className="ra-chap-nav-title">{PAGE_META[next].label.replace(/^Ch\d+ · /,'')}</div>}
      </div>
    </div>
  );
};

// ── Directory ────────────────────────────────────────────────────────────────
const DirectoryPage = ({ onNav }) => {
  const parts = [
    { id: 'ch01', num: '壹', cn: '上篇', en: 'PART ONE', color: '#8B6914',
      title: '底层操作系统', sub: '注意力如何被分配、消耗、聚焦',
      desc: '在你想做任何事之前，先理解你的注意力是如何被分配、被消耗、被聚焦的。这是这场直播——也是这本书——的根。',
      chapters: [
        { n: '01', t: '复利的本质是注意力' },
        { n: '02', t: '注意力的劫持与压强' },
      ],
      tags: ['复利', '压强公式', '虐恋三要素'] },
    { id: 'ch02', num: '贰', cn: '中篇', en: 'PART TWO', color: '#6B4F12',
      title: '身体的物理学', sub: '人首先是一台烧炭的机器',
      desc: '一切赚钱、幸福、深度行动的能力，都建立在身体能量供给之上。能量先于认知，身体先于心智。',
      chapters: [
        { n: '03', t: '人是烧炭的机器' },
        { n: '04', t: '高酮、多巴胺与攻击性' },
        { n: '05', t: 'DMN 默认网络' },
      ],
      tags: ['ATP / 血糖', '60 分能量线', '深夜 EMO'] },
    { id: 'ch03', num: '叁', cn: '下篇', en: 'PART THREE', color: '#4A3A0A',
      title: '商业世界的真相', sub: '资本如何进化，你又被怎样剥削',
      desc: '这个世界一直在剥削你——只是手法越来越精细。从你的土地，到你的劳动力，到你的注意力，到你未来的钱。',
      chapters: [
        { n: '06', t: '资本演进史：从地主到注意力' },
        { n: '07', t: '杠杆思维与陌生人交易' },
        { n: '08', t: '营销不邪恶' },
      ],
      tags: ['资本四阶段', '杠杆 × 陌生人', '营销中性化'] },
    { id: 'ch04', num: '肆', cn: '终篇', en: 'PART FOUR', color: '#2D2416',
      title: 'AI 时代与心力', sub: '智能将平价，护城河是审美与心力',
      desc: '当智能即将平价，护城河是什么？审美、心力、诚意正心——以及一个 28 岁的人停更大半年之后想明白的所有事。',
      chapters: [
        { n: '09', t: 'AI 代差与审美护城河' },
        { n: '10', t: '世界观→结果：八步循环链' },
        { n: '11', t: '诚意正心：树林的回归与告白' },
      ],
      tags: ['AI 代差', '八步循环', '诚意正心'] },
  ];
  return (
    <section style={{ background: '#FAF8F3', padding: '5rem 3rem', minHeight: '100vh',
                       position: 'relative', overflow: 'hidden' }}>
      <span className="ra-dir-glyph">莽</span>
      <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <p style={{ color: '#C9A227', fontSize: '0.75rem', letterSpacing: '0.4em', marginBottom: '1rem' }}>
          — TABLE OF CONTENTS —
        </p>
        <h2 style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                      fontSize: 'clamp(2.2rem,4.5vw,3.2rem)',
                      color: '#2D2416', fontWeight: 400, marginBottom: '0.5rem' }}>
          四篇 · 十一章 · 一份附录
        </h2>
        <p style={{ color: 'rgba(45,36,22,0.55)', fontSize: '0.85rem',
                     letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
          约 50 页 · 38 分钟阅读 · 推荐按顺序，可随时翻阅
        </p>
        <div className="ra-quote" style={{ maxWidth: 640 }}>
          如果你只读这份文档不看原直播，<br/>
          你会拿到 90% 树林想给你的东西。
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(400px,1fr))',
                       gap: '1.5rem', marginTop: '3rem' }}>
          {parts.map(p => (
            <div key={p.id} className="ra-card" onClick={() => onNav(p.id)}
                 style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                             alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                <div>
                  <span style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                                  fontSize: '3.5rem',
                                  color: p.color, opacity: 0.18, lineHeight: 1, fontWeight: 400 }}>
                    {p.num}
                  </span>
                  <span style={{ display: 'block', color: '#C9A227', fontSize: '0.65rem',
                                  letterSpacing: '0.3em', marginTop: '0.3rem' }}>
                    {p.en} · {p.cn}
                  </span>
                </div>
                <ArrowUpRight size={16} style={{ color: '#C9A227', marginTop: '0.5rem' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#2D2416', fontWeight: 500,
                            marginBottom: '0.3rem' }}>{p.title}</h3>
              <p style={{ color: '#C9A227', fontSize: '0.85rem', letterSpacing: '0.1em',
                           marginBottom: '1rem', fontStyle: 'italic' }}>{p.sub}</p>
              <p style={{ color: 'rgba(45,36,22,0.65)', fontSize: '0.88rem',
                           lineHeight: 1.85, marginBottom: '1.2rem' }}>{p.desc}</p>
              {/* Chapter list */}
              <div style={{ marginBottom: '1.2rem', paddingTop: '1rem',
                             borderTop: '1px dashed rgba(201,162,39,0.25)' }}>
                {p.chapters.map(c => (
                  <div key={c.n} style={{ display: 'flex', alignItems: 'baseline',
                                             gap: '0.8rem', padding: '0.3rem 0',
                                             color: 'rgba(45,36,22,0.7)', fontSize: '0.85rem' }}>
                    <span style={{ color: '#C9A227', fontFamily: "'Playfair Display',serif",
                                    fontSize: '0.78rem', fontWeight: 600,
                                    width: '22px' }}>
                      {c.n}
                    </span>
                    <span>{c.t}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {p.tags.map(t => <span key={t} className="ra-tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Part I · 上篇 · 注意力 ────────────────────────────────────────────────────
const Ch01Page = ({ onNav }) => {
  return (
    <section style={{ background: '#FAF8F3', minHeight: '100vh' }}>
      {/* Hero */}
      <div className="ra-chapter-bg"
           style={{ background: 'linear-gradient(135deg,#FAF8F3 0%,#F0EBE0 100%)',
                     padding: '6rem 3rem 4rem', position: 'relative' }}>
        <HeroDecoCh01 />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.4em', marginBottom: '1.2rem' }}>
            PART I · 壹 / 肆
          </p>
          <h2 style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                        fontSize: 'clamp(2rem,4vw,3.2rem)',
                        color: '#2D2416', fontWeight: 400, marginBottom: '0.4rem', lineHeight: 1.3 }}>
            底层操作系统
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#8B6914', letterSpacing: '0.1em',
                       marginBottom: '2rem', fontStyle: 'italic' }}>
            注意力如何被分配、消耗、聚焦
          </p>
          <div className="ra-quote" style={{ maxWidth: 620 }}>
            在你想做任何事之前，先理解你的注意力<br/>
            是如何被分配、被消耗、被聚焦的。<br />
            <strong style={{ color: '#2D2416' }}>这是这场直播——也是这本书——的根。</strong>
          </div>
        </div>
      </div>

      <div style={{ padding: '4rem 3rem', maxWidth: 800, margin: '0 auto' }}>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* CHAPTER 1 · 复利的本质是注意力 */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <div id="ch1-compound" style={{ scrollMarginTop: '40px' }}>
          <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                       marginBottom: '0.6rem' }}>第 一 章 · CHAPTER ONE</p>
          <h3 style={{ fontSize: '1.6rem', color: '#2D2416', letterSpacing: '0.05em',
                        fontWeight: 500, marginBottom: '0.5rem',
                        fontFamily: "'Playfair Display','Noto Serif SC',serif" }}>
            复利的本质是注意力
          </h3>
          <p style={{ color: 'rgba(45,36,22,0.6)', fontSize: '0.9rem',
                       fontStyle: 'italic', marginBottom: '2rem' }}>
            "我大概在大半年时间里，刚刚摸到了'复利'这个词的门槛。"
          </p>

          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1.4rem' }}>
            你以前一定听过这个词。第八大奇迹。所有讲投资的人都在用它，所有讲成长的人都在引用它。
            但你大概率没真正用过它——除了用它来吓唬自己。
          </p>

          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '2rem' }}>
            这场直播一开场，树林给出了一个反转：<strong style={{color:'#2D2416'}}>复利不是钱滚钱，
            它的本体是注意力</strong>——一份注意力的投入，能在多长时间维度里、被多少人接收到、产生多少回报。
            这个定义把"复利"从一个金融术语翻译成了一件你每天都在做、却从来没用对的事。
          </p>

          {/* ── 锁在脑子里的认知不会复利 ── */}
          <h4 style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.05em',
                        fontWeight: 500, marginTop: '2.5rem', marginBottom: '1rem' }}>
            锁在脑子里的认知不会复利
          </h4>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              你的所有最厉害的东西<br/>
              都在你的<strong>脑子里面</strong>，<br/>
              你并没有公开给这个世界。<br/>
              只有世界看到了，<br/>
              世界才能给你<strong>定价</strong>。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林
            </p>
          </div>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginTop: '1.5rem' }}>
            树林说他大半年里每天写一万字以上，但全部锁在备忘录里没发出去——所以他没增加任何粉丝。
            他用这件事戳的不是"应该多发朋友圈"这种鸡汤，是一个更狠的真相：
            <strong style={{color:'#2D2416'}}>没有被外界看到的认知，无法被定价</strong>。
            它不进入复利循环，它只是消耗。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginTop: '1rem' }}>
            这就是为什么很多"很有想法"的人赚不到钱。不是认知不够——是认知没有变成可被外界看到、
            可被定价的资产。这一步叫<strong style={{color:'#C9A227'}}>"封装"</strong>。
            封装能力比认知本身更稀缺。
          </p>

          {/* ── 急切就是不复利 ── */}
          <h4 style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.05em',
                        fontWeight: 500, marginTop: '2.5rem', marginBottom: '1rem' }}>
            急切就是不复利
          </h4>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1rem' }}>
            你白天和心仪的人聊得很好。互道晚安之后，他上了王者荣耀，你打开网易云开始云起来。
            多巴胺褪去，血清素不足，刚好今天又没晒太阳。你睡不着，抓心挠肝，发出"你喜不喜欢我"。
            又怕加豪赶紧补一大段。第二天对方睡醒一看：十几条消息。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1rem' }}>
            原本你们这段关系可能有三四年的可能。前面已经聊了两个月，临门一脚都暧昧了。
            但你的<strong style={{color:'#2D2416'}}>急切</strong>——这种当下立马就要结果、被注意力劫持的行为——
            让对方瞬间下头。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '2rem' }}>
            这个例子的杀伤力在于：你能立刻代入，每个人都做过。它真正的含义不是"恋爱要慢"，
            是<strong style={{color:'#C9A227'}}>急切就是不复利</strong>——
            你把未来几年可能的相遇，换成了当下一晚上的确定性。
          </p>

          {/* ── 复利的结构 ── */}
          <h4 style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.05em',
                        fontWeight: 500, marginTop: '2.5rem', marginBottom: '1rem' }}>
            什么是真正的复利
          </h4>
          <div style={{ background: '#fff', border: '1px solid rgba(201,162,39,0.3)',
                          padding: '2rem', position: 'relative', marginBottom: '1.5rem' }}>
            <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                         marginBottom: '0.8rem' }}>复利的结构</p>
            <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                         color: '#2D2416', fontSize: 'clamp(1.4rem,2.5vw,1.9rem)',
                         letterSpacing: '0.05em', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              <strong style={{color:'#C9A227'}}>1 份注意力 → N 份回流</strong>
            </p>
            <p style={{ color: 'rgba(45,36,22,0.7)', fontSize: '0.92rem',
                         lineHeight: 1.95, fontStyle: 'italic' }}>
              "我用我的现在的直播服务了七八千人——我用一份时间换了你们四千份的注意力，
              那我就会越来越有钱。"
            </p>
          </div>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1rem' }}>
            同样是一份时间——你拿去刷短视频，复利系数是<strong style={{color:'#c0392b'}}>负的</strong>；
            你拿去和朋友吃饭，复利系数<strong>接近 1</strong>；你拿去写一篇能发出去的文档，
            复利系数<strong style={{color:'#C9A227'}}>可以是几百倍</strong>；
            你拿去做一个能反复销售的产品，复利系数<strong style={{color:'#C9A227'}}>可以是几千几万倍</strong>。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '2rem' }}>
            分水岭在于：这一份注意力的产出，<strong>能不能被外界看到、能不能被多次接收、能不能在未来持续回报</strong>。
            三个能，就是复利；三个不能，就只是消耗。
          </p>

          {/* 复利可视化器 — 配合"1 份注意力 → N 份回流" */}
          <CompoundVisualizer />

          {/* 本章收束 */}
          <div style={{ marginTop: '3rem', padding: '1.8rem 2rem',
                         background: '#2D2416', borderLeft: '3px solid #C9A227' }}>
            <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                         marginBottom: '0.8rem' }}>本章收束</p>
            <p style={{ color: '#FAF8F3', fontSize: '1rem', lineHeight: 1.95 }}>
              复利不是钱滚钱，是注意力的产出能被多少人接收、能持续多久。<br/>
              <span style={{color:'#C9A227'}}>你赚不到钱，是因为你最厉害的东西，从未走出你的脑子。</span>
            </p>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* PULL QUOTE 01 · 论短视频 */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <div style={{ margin: '5rem 0', padding: '4rem 2rem',
                       background: 'linear-gradient(135deg, #14100a 0%, #1a1208 100%)',
                       textAlign: 'center', position: 'relative', overflow: 'hidden',
                       borderTop: '1px solid rgba(201,162,39,0.3)',
                       borderBottom: '1px solid rgba(201,162,39,0.3)' }}>
          <div style={{ position: 'absolute', left: '1rem', top: '0.5rem',
                         color: 'rgba(201,162,39,0.4)', fontSize: '0.65rem',
                         letterSpacing: '0.3em' }}>PULL QUOTE · 01</div>
          <div style={{ position: 'absolute', right: '1rem', bottom: '0.5rem',
                         color: 'rgba(201,162,39,0.4)', fontSize: '0.65rem',
                         letterSpacing: '0.3em' }}>论 短 视 频</div>
          <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                       color: '#FAF8F3', fontSize: 'clamp(1.4rem, 3.2vw, 2.2rem)',
                       lineHeight: 1.7, fontStyle: 'italic', maxWidth: 600, margin: '0 auto' }}>
            如果从今天开始，<br/>
            我<strong style={{color:'#C9A227', fontStyle:'normal'}}>一分钟打你一次</strong>。<br/>
            无论你做什么——<br/>
            你这辈子还能有<br/>什么<strong style={{color:'#C9A227', fontStyle:'normal'}}>出息</strong>？
          </p>
          <p style={{ color: 'rgba(201,162,39,0.7)', fontSize: '0.8rem',
                       letterSpacing: '0.4em', marginTop: '2rem' }}>
            — 树 林
          </p>
        </div>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* CHAPTER 2 · 注意力的劫持与压强 */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <div id="ch2-attention" style={{ scrollMarginTop: '40px' }}>
          <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                       marginBottom: '0.6rem' }}>第 二 章 · CHAPTER TWO</p>
          <h3 style={{ fontSize: '1.6rem', color: '#2D2416', letterSpacing: '0.05em',
                        fontWeight: 500, marginBottom: '0.5rem',
                        fontFamily: "'Playfair Display','Noto Serif SC',serif" }}>
            注意力的劫持与压强
          </h3>
          <p style={{ color: 'rgba(45,36,22,0.6)', fontSize: '0.9rem',
                       fontStyle: 'italic', marginBottom: '2rem' }}>
            "瘾的本质是什么？瘾的本质是——不可撤销的注意力。"
          </p>

          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '2rem' }}>
            上一章讲了复利的本体是注意力。这一章讲两件事：<strong>你的注意力正在被怎样劫持，
            以及抢回来之后该怎么用。</strong>
          </p>

          {/* ── 三重劫持 ── */}
          <h4 style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.05em',
                        fontWeight: 500, marginTop: '2.5rem', marginBottom: '1rem' }}>
            三重劫持
          </h4>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1.4rem' }}>
            劫持有三种形态。<strong>第一种是切碎。</strong>
            树林讲短视频，没有用任何"碎片化阅读不好"这种空话。他直接抛出一个让人脊背发凉的画面——
            如果有人每分钟打断你一次、连续一整天，你能做成什么事？哪怕做手艺活也不行，连性体验都会变得糟糕。
            但短视频做的就是这件事，而且更狠：不是 1 分钟打断一次，是
            <strong style={{color:'#c0392b'}}> 20 秒、10 秒打断一次</strong>。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1.4rem' }}>
            这件事最深的代价不是浪费当下时间，是它在
            <strong style={{color:'#2D2416'}}>系统性摧毁你做"长动作"的能力</strong>。
            一篇一万字的文章至少需要 20 个小时连续投入。10 秒打断一次的大脑，再也聚不回来。
            而所有真正能赚到钱的事——写一篇能传播的长文、做一个可卖的产品、谈成一个大客户——都是长动作。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1.4rem' }}>
            <strong>第二种劫持是情绪。</strong>同样是刷手机：搞笑段子是当下愉悦、消费完就结束；
            但"年轻人没希望了""老登抢走了你们的机会"这类内容，会在你未来 3 到 4 个小时里持续压低自我评价。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1.5rem' }}>
            <strong>第三种是关系，也就是虐恋。</strong>三个特征同时出现就是它：
          </p>
          <div style={{ background: 'linear-gradient(135deg, #fdf0ed 0%, #fdf8e8 100%)',
                          border: '1px solid rgba(192,57,43,0.3)',
                          padding: '1.8rem 2rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#c0392b', fontSize: '0.7rem', letterSpacing: '0.3em',
                         marginBottom: '0.8rem' }}>虐恋三要素</p>
            <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                         color: '#2D2416', fontSize: 'clamp(1.2rem,2.2vw,1.6rem)',
                         lineHeight: 1.6, marginBottom: '1rem' }}>
              <strong style={{color:'#c0392b'}}>高性吸引</strong> +
              <strong style={{color:'#c0392b'}}> 高情绪波动</strong> +
              <strong style={{color:'#c0392b'}}> 高需求感</strong>
            </p>
            <p style={{ color: 'rgba(45,36,22,0.75)', fontSize: '0.88rem',
                         lineHeight: 1.9, fontStyle: 'italic' }}>
              性吸引让你一见面所有问题都解决；高需求感让你一分开就焦虑恐慌；
              情绪波动让你的多巴胺剧烈起伏。三件加在一起就是上瘾。
            </p>
          </div>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1.5rem' }}>
            这种关系最可怕的地方不是过程多痛苦，是它在
            <strong style={{color:'#c0392b'}}>分手之后的几个月、甚至几百天里</strong>，
            每隔一段时间还来吸走你一次。一段虐恋的真实代价不是它存在的两个月，
            是它在你余下未来 100 天、200 天、500 天里的每一次反刍。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '2rem' }}>
            而好的爱情是反过来的：
          </p>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              好的爱情会让你<strong>打开和开放</strong>——<br/>
              不会让你的思维收缩，<br/>
              不会让你的行动收缩，<br/>
              也不会让你的情绪收缩。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论好的关系
            </p>
          </div>

          {/* ── 压强公式 ── */}
          <h4 id="ch2-pressure" style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.05em',
                        fontWeight: 500, marginTop: '3rem', marginBottom: '1rem',
                        scrollMarginTop: '40px' }}>
            压强公式 · P = F / S
          </h4>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1.5rem' }}>
            把注意力抢回来之后，下一个问题是：放在哪里。树林给了一个非常具象的画面——
            一根细高跟为什么能把厚木板刺穿？体重没变，但接触面积小到像一根针，压强就大到能穿透。
          </p>
          <div style={{ background: '#fff', border: '1px solid rgba(201,162,39,0.3)',
                          padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                         marginBottom: '1rem' }}>压强公式</p>
            <p style={{ fontFamily: "'Playfair Display',serif",
                         color: '#2D2416', fontSize: 'clamp(2rem,4vw,3rem)',
                         letterSpacing: '0.1em', lineHeight: 1.4, fontStyle: 'italic' }}>
              <strong style={{color:'#C9A227'}}>P</strong> ={' '}
              <strong style={{color:'#C9A227'}}>F</strong> /{' '}
              <strong style={{color:'#C9A227'}}>S</strong>
            </p>
            <p style={{ color: 'rgba(45,36,22,0.6)', fontSize: '0.85rem',
                         marginTop: '1rem', lineHeight: 1.8 }}>
              P = 注意力的产出　|　F = 注意力总量　|　S = 聚焦面积<br/>
              <strong style={{color:'#2D2416'}}>F 不变，S 越小，P 越大</strong>
            </p>
          </div>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '2rem' }}>
            大部分人想做的事很多——读书、健身、写作、副业、考研——一天分十件事做，每件事 10% 的注意力。
            结果什么都做了一点，什么都没做出来。<strong style={{color:'#c0392b'}}>S 太大</strong>，
            每件事的压强都不足以穿透那块木板。
          </p>

          {/* ── 焦虑与最小动作 ── */}
          <h4 id="ch2-anxiety" style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.05em',
                        fontWeight: 500, marginTop: '2.5rem', marginBottom: '1rem',
                        scrollMarginTop: '40px' }}>
            焦虑与最小动作
          </h4>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1.5rem' }}>
            压强公式还能解释焦虑——这是树林在直播里最精彩的一段：
          </p>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              焦虑的本质是<br/>
              你的注意力放在了<strong>未来</strong>——<br/>
              许多无限的未来。<br/>
              你的身体只能在当下，<br/>
              而你的脑子去到了那么远的地方。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.85rem',
                         letterSpacing: '0.15em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — "我他妈到底在哪？我快凉了。"
            </p>
          </div>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginTop: '1.5rem', marginBottom: '1rem' }}>
            用压强公式翻译就是：你的注意力被无限多个"未来时刻"分散了，
            <strong style={{color:'#c0392b'}}>S 趋于无穷大，P 趋于零</strong>——
            所以你浑身紧绷却什么都做不了。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1.5rem' }}>
            解药不是"想开点"，是<strong style={{color:'#C9A227'}}>把动作缩到极小</strong>：
          </p>
          <div style={{ background: 'rgba(201,162,39,0.06)',
                          border: '1px dashed rgba(201,162,39,0.4)',
                          padding: '1.5rem 1.8rem', marginBottom: '2rem' }}>
            <p style={{ color: 'rgba(45,36,22,0.85)', fontSize: '0.95rem',
                         lineHeight: 2, fontStyle: 'italic' }}>
              你做不了高考 → 那做语文。<br/>
              做不了语文 → 那做作文。<br/>
              做不了作文 → 那做开头两句话。<br/>
              <span style={{color:'#C9A227', fontStyle:'normal'}}>
                这种总能做了吧？开头两句话写完，你已经在写作文了。
              </span>
            </p>
          </div>

          {/* 意志测试 — 完美匹配"压强压在最小面积上"的主题 */}
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '0.5rem' }}>
            <strong>慢即是快</strong>——把同样的注意力压在更小的面积上。
            连"按住 3 秒"都需要一整面注意力的聚焦：
          </p>

          <WillpowerTest />

          {/* 本章收束 */}
          <div style={{ marginTop: '3rem', padding: '1.8rem 2rem',
                         background: '#2D2416', borderLeft: '3px solid #C9A227' }}>
            <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                         marginBottom: '0.8rem' }}>本章收束</p>
            <p style={{ color: '#FAF8F3', fontSize: '1rem', lineHeight: 1.95 }}>
              抢回注意力的关键，不是多做，是<strong style={{color:'#C9A227'}}>更少</strong>。<br/>
              把一件事做到，胜过同时做十件事都没结果。
            </p>
          </div>
        </div>

        {/* ── 行动卡 ── */}
        <ActionCard
          id="ch01"
          title="挑出你今天的「最小动作」"
          prompts={[
            '焦虑的解药是把 S 缩到极小：你做不了高考，那就做开头两句话。',
            '挑一个你今天就能完成的最小动作——它必须小到你不会再为它焦虑。',
          ]}
          chipsLabel="今天的最小动作（可多选）"
          chips={[
            '深蹲 5 个',
            '写 100 字',
            '发一条朋友圈',
            '读 5 页书',
            '出门走 10 分钟',
            '关闭一个 app',
            '回一个搁置的消息',
            '把一件未完成的事推进 1 步',
            '联系一个许久没联系的朋友',
            '把桌面收拾干净',
          ]}
          placeholder="或者写下：你今天准备做的那件最小的事……"
        />

        <ChapterNav current="ch01" onNav={onNav} />
      </div>
    </section>
  );
};

// ── Chapter 02 ───────────────────────────────────────────────────────────────
const Ch02Page = ({ onNav }) => {
  const [openMethod, setOpenMethod] = useState(null);
  const methods = [
    { n: '01', title: '物理重复', icon: <Layers size={18} />, sub: '最笨，最有效',
      desc: '把道理写下来，放在你每天必看的地方。手机壁纸、桌面贴纸、日记开头——用物理存在代替记忆依赖。',
      detail: '不要相信"我记得"。人的大脑天生遗忘。物理提醒是在跟遗忘对抗的最低成本手段。每天一次，重复21天，它会开始自动出现在你脑子里。' },
    { n: '02', title: '多维重复', icon: <GitBranch size={18} />, sub: '用不同介质触碰同一道理',
      desc: '同一个原则，用书读一遍，用播客听一遍，用写作说一遍，用对话讲一遍——每次都是不同层次的吸收。',
      detail: '每一种介质都能激活大脑的不同区域。听到的是一维的，看到的是二维的，亲口说出来的是内化的。多维重复让道理从文字变成立体的认知网络。' },
    { n: '03', title: '实践重复', icon: <Target size={18} />, sub: '在真实场景中触发',
      desc: '为道理设置"触发器"：每次遇到某类情景，就主动用这个原则做决策。失败也是重复——它让你看到道理的边界。',
      detail: '光想不够，必须在生活中创造使用场景。提前想好：当X发生时，我就用Y原则来应对。每一次使用都是一次神经元的强化，失败的使用尤其有价值。' },
    { n: '04', title: '螺旋重复', icon: <RotateCcw size={18} />, sub: '每次重复都比上次深一层',
      desc: '不是机械地背诵，而是带着新经验回来重新理解。同一个道理，二十岁读和三十岁读，感受完全不同。',
      detail: '真正的重复不是循环，是螺旋上升。你带着更多的人生经验和失败教训回来审视这个道理，会发现它有更深的层次。每一次重读都是一次元认知升级。' },
  ];

  return (
    <section style={{ background: '#F5F2EB', minHeight: '100vh' }}>
      <div className="ra-chapter-bg"
           style={{ background: 'linear-gradient(135deg,#F5F2EB 0%,#EDE5D0 100%)',
                     padding: '6rem 3rem 4rem', position: 'relative' }}>
        <HeroDecoCh02 />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.4em', marginBottom: '1.2rem' }}>CHAPTER 02 / 04</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3.2rem)',
                        color: '#2D2416', fontWeight: 400, marginBottom: '1rem', lineHeight: 1.3 }}>如何重复</h2>
          <p style={{ fontSize: '1.2rem', color: '#8B6914', letterSpacing: '0.1em',
                       marginBottom: '2rem', fontStyle: 'italic' }}>四种方式 · 原则即宪法 · 不归零</p>
        </div>
      </div>

      <div style={{ padding: '4rem 3rem', maxWidth: 900, margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.1em',
                      fontWeight: 500, marginBottom: '0.5rem', scrollMarginTop: '40px' }} id="ch02-methods">四种重复方式</h3>
        <p style={{ color: 'rgba(45,36,22,0.55)', fontSize: '0.85rem', marginBottom: '2.5rem' }}>点击每张卡片展开详解</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(360px,1fr))',
                       gap: '1.2rem', marginBottom: '4rem' }}>
          {methods.map((m, i) => (
            <div key={i} className="ra-method-card"
                 onClick={() => setOpenMethod(openMethod === i ? null : i)}>
              <div className="ra-method-num">{m.n}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                <span style={{ color: '#C9A227' }}>{m.icon}</span>
                <h4 style={{ fontSize: '1.05rem', color: '#2D2416', fontWeight: 500 }}>{m.title}</h4>
              </div>
              <p style={{ color: '#8B6914', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.7rem' }}>{m.sub}</p>
              <p style={{ color: 'rgba(45,36,22,0.7)', fontSize: '0.9rem', lineHeight: 1.8 }}>{m.desc}</p>
              {openMethod === i && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(201,162,39,0.2)' }}>
                  <p style={{ color: 'rgba(45,36,22,0.65)', fontSize: '0.88rem', lineHeight: 1.9 }}>{m.detail}</p>
                </div>
              )}
              <div style={{ marginTop: '0.8rem', display: 'flex', justifyContent: 'flex-end' }}>
                {openMethod === i
                  ? <ChevronUp size={14} style={{ color: '#C9A227' }} />
                  : <ChevronDown size={14} style={{ color: 'rgba(201,162,39,0.5)' }} />}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ background: '#2D2416', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '1rem', top: '0.5rem', fontSize: '4rem',
                           color: 'rgba(201,162,39,0.07)', fontFamily: "'Playfair Display',serif" }}>原则</div>
            <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em', marginBottom: '1rem' }}>PRINCIPLE = CONSTITUTION</p>
            <h3 style={{ color: '#FAF8F3', fontSize: '1.1rem', fontWeight: 500, marginBottom: '1rem' }}>原则即宪法</h3>
            <p style={{ color: 'rgba(250,248,243,0.65)', fontSize: '0.9rem', lineHeight: 1.9 }}>
              宪法的作用不是让你背诵它，而是让它在关键时刻约束你的行为。
              原则也一样——它不是口号，是你在压力下的决策框架。
            </p>
          </div>
          <div style={{ background: '#fff', padding: '2.5rem', border: '1px solid rgba(45,36,22,0.1)',
                         position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '1rem', top: '0.5rem', fontSize: '4rem',
                           color: 'rgba(201,162,39,0.07)', fontFamily: "'Playfair Display',serif" }}>零</div>
            <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em', marginBottom: '1rem' }}>NO RESET = NO ZERO</p>
            <h3 style={{ color: '#2D2416', fontSize: '1.1rem', fontWeight: 500, marginBottom: '1rem' }}>不归零</h3>
            <p style={{ color: 'rgba(45,36,22,0.65)', fontSize: '0.9rem', lineHeight: 1.9 }}>
              每次重新开始都是在清空账户。不归零的意思是：昨天的积累，今天还在。
              哪怕跌倒，也要从现在的位置站起来，而不是退回原点。
            </p>
          </div>
        </div>

        <CompoundVisualizer />

        <div className="ra-bigquote">
          <p className="ra-bigquote-text">
            重复的本质，是在用时间<br />
            换取<strong>"不需要思考就能做对"</strong>的能力。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                       letterSpacing: '0.2em', marginTop: '1.5rem',
                       fontStyle: 'italic' }}>
            — 当正确的事变成条件反射，你就自由了
          </p>
        </div>

        <ActionCard
          id="ch02"
          title="挑你的重复方式"
          prompts={[
            '回到上一章那句话，决定你今天要怎么让它真的进入生活：',
            '挑一个你最有可能做到的最小动作。',
          ]}
          chipsLabel="今天我准备这样重复它（可多选）"
          chips={[
            '写在手机壁纸',
            '写在桌面便签',
            '贴在书桌前',
            '放进每日打开的笔记',
            '每天起床读一遍',
            '睡前问自己一遍',
            '用它做今天一个决定',
            '在写作里用一次',
            '在关系里用一次',
            '7 天后回来检查',
          ]}
          placeholder="或者写下你自己的具体做法……"
        />

        <ChapterNav current="ch02" onNav={onNav} />
      </div>
    </section>
  );
};

// ── Chapter 03 ───────────────────────────────────────────────────────────────
const Ch03Page = ({ onNav }) => {
  const [fate, setFate] = useState(null);
  const fates = [
    { label: '被替代', color: '#c0392b', bg: '#fdf0ed',
      desc: '把AI当搜索引擎用——只问答案，不问背后的逻辑。你的工作被AI替代，因为你做的就是AI最擅长的：检索和复述。' },
    { label: '被辅助', color: '#8B6914', bg: '#fdf8e8',
      desc: '把AI当工具用——它帮你写文案、改代码、做PPT。效率提升了，但你的判断力没有成长。AI是你的助手，也是你的天花板。' },
    { label: '成为矿工', color: '#2d7a2d', bg: '#edf8ed',
      desc: '把AI当延伸用——你有问题意识，你有品位，你把AI的输出封装成自己的能力。AI是你的铲子，你挖出来的是属于自己的金子。' },
  ];
  const abilities = [
    { icon: <Search size={20} />, title: '元提问', en: 'Meta-Questioning', tag: '最核心的能力',
      desc: '不问"帮我写篇文章"，而是问"这个问题的本质是什么，我需要问什么问题才能得到真正有用的答案"。' },
    { icon: <Star size={20} />, title: '品位', en: 'Taste & Judgment', tag: '无法被替代的能力',
      desc: 'AI可以生成一百个答案，但你需要知道哪一个好。品位是筛选能力，是你对"好"的感知阈值。它来自大量阅读和独立思考，无法外包。' },
    { icon: <Layers size={20} />, title: '封装', en: 'Encapsulation', tag: '让能力不归零',
      desc: '把AI帮你完成的内容，转化成你自己的认知资产——整理进知识库，提炼成原则，融入工作流。不封装等于不积累。' },
  ];

  return (
    <section style={{ background: '#FAF8F3', minHeight: '100vh' }}>
      <div className="ra-chapter-bg"
           style={{ background: 'linear-gradient(135deg,#FAF8F3 0%,#EEE8DC 100%)',
                     padding: '6rem 3rem 4rem', position: 'relative' }}>
        <HeroDecoCh03 />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.4em', marginBottom: '1.2rem' }}>CHAPTER 03 / 04</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3.2rem)',
                        color: '#2D2416', fontWeight: 400, marginBottom: '1rem', lineHeight: 1.3 }}>AI 世界观</h2>
          <p style={{ fontSize: '1.2rem', color: '#8B6914', letterSpacing: '0.05em',
                       marginBottom: '2rem', fontStyle: 'italic' }}>"刷短视频你是矿，用 AI 你是矿工"</p>
          <div style={{ background: '#2D2416', padding: '2rem 2.5rem', maxWidth: 600, borderLeft: '3px solid #C9A227' }}>
            <InkReveal
              as="div"
              style={{ color: '#FAF8F3', fontSize: '1rem', lineHeight: 2 }}
              lineStyle={{ marginBottom: '0.2rem' }}
              delay={300}
              lines={[
                '短视频平台上，',
                '你的注意力是原材料，被算法挖掘、打包、卖给广告主。',
                <span style={{ color: '#C9A227', fontSize: '1.4rem',
                                fontFamily: "'Playfair Display',serif",
                                fontStyle: 'italic' }} key="a">你是矿。</span>,
                <span key="sp" style={{ display:'block', height:'0.8rem' }} />,
                '但如果你用 AI 来挖掘信息、提炼认知、封装工作流——',
                <span style={{ color: '#C9A227', fontSize: '1.4rem',
                                fontFamily: "'Playfair Display',serif",
                                fontStyle: 'italic' }} key="b">你是矿工。</span>,
              ]}
            />
          </div>
        </div>
      </div>

      <div style={{ padding: '4rem 3rem', maxWidth: 900, margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.1em',
                      fontWeight: 500, marginBottom: '0.5rem', scrollMarginTop: '40px' }} id="ch03-fates">AI 回答的三种命运</h3>
        <p style={{ color: 'rgba(45,36,22,0.55)', fontSize: '0.85rem', marginBottom: '2rem' }}>你现在处于哪一种？</p>
        <div className="ra-fate-row" style={{ marginBottom: '4rem' }}>
          {fates.map((f, i) => (
            <div key={i} className="ra-fate"
                 style={{ borderTop: `3px solid ${f.color}` }}>
              <div className="ra-fate-num">{String(i+1).padStart(2,'0')}</div>
              <div>
                <div style={{ width: 10, height: 10, borderRadius: '50%',
                               background: f.color, marginBottom: '1.2rem',
                               boxShadow: `0 0 10px ${f.color}` }} />
                <h4 style={{ fontSize: '1.4rem', color: f.color, fontWeight: 500,
                              marginBottom: '0.6rem', letterSpacing: '0.05em' }}>
                  {f.label}
                </h4>
                <div className="ra-fate-hint">悬停展开</div>
                <div className="ra-fate-desc">
                  <p style={{ color: 'rgba(45,36,22,0.75)', fontSize: '0.9rem',
                               lineHeight: 1.9, marginTop: '1rem' }}>
                    {f.desc}
                  </p>
                </div>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '1.5rem',
                             borderTop: `1px dashed ${f.color}33`,
                             color: f.color, fontSize: '0.7rem',
                             letterSpacing: '0.2em', opacity: 0.8 }}>
                FATE / {String(i+1).padStart(2,'0')}
              </div>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.1em',
                      fontWeight: 500, marginBottom: '0.5rem', scrollMarginTop: '40px' }} id="ch03-abilities">AI 时代三种核心能力</h3>
        <p style={{ color: 'rgba(45,36,22,0.55)', fontSize: '0.85rem', marginBottom: '2rem' }}>这三种能力，AI 无法替代你</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {abilities.map((a, i) => (
            <div key={i} className="ra-card"
                 style={{ display: 'flex', gap: '2rem', padding: '2rem', alignItems: 'flex-start' }}>
              <div style={{ width: 50, height: 50, background: 'rgba(201,162,39,0.1)',
                             display: 'flex', alignItems: 'center', justifyContent: 'center',
                             color: '#C9A227', flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem',
                               marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <h4 style={{ fontSize: '1.05rem', color: '#2D2416', fontWeight: 500 }}>{a.title}</h4>
                  <span style={{ fontSize: '0.7rem', color: '#C9A227', letterSpacing: '0.1em' }}>{a.en}</span>
                  <span className="ra-tag" style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>{a.tag}</span>
                </div>
                <p style={{ color: 'rgba(45,36,22,0.65)', fontSize: '0.9rem', lineHeight: 1.9 }}>{a.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="ra-bigquote">
          <p className="ra-bigquote-text">
            AI 给你的不是<strong>最终成品</strong>，<br />
            而是可以被你<strong>加工的材料</strong>。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                       letterSpacing: '0.2em', marginTop: '1.5rem',
                       fontStyle: 'italic' }}>
            — 元提问决定能挖到什么 · 品位决定能留下什么 · 封装决定它能不能变成资产
          </p>
        </div>

        <ActionCard
          id="ch03"
          title="打开 AI 前的三问"
          prompts={[
            '下一次打开 AI 之前，先在这里挑或写下三件事：',
            '我带着什么原问题进去 · 我准备判断什么值得留下 · 这次要封装成什么。',
          ]}
          chipsLabel="选一类你最常用 AI 做的事（可多选）"
          chips={[
            '打穿一个观点',
            '梳理一篇长文',
            '拆一个产品方案',
            '写一份提案',
            '理一段关系',
            '复盘一次失败',
            '搭一个学习路径',
            '研究一个领域',
            '做一次决策推演',
            '写一段代码',
          ]}
          placeholder="或者写下：我下次想带进 AI 的具体原问题是……"
        />

        <ChapterNav current="ch03" onNav={onNav} />
      </div>
    </section>
  );
};

// ── Chapter 04 ───────────────────────────────────────────────────────────────
const Ch04Page = ({ onNav }) => {
  const [activeStep, setActiveStep] = useState(0);
  const workflow = [
    { step: '01', title: '元提问', color: '#C9A227',
      desc: '不要急着问"帮我写一篇文章"。先找到那个最值得被打穿的原问题——它来自一句真正打动你的话，或者你早就知道但一直没真正做到的道理。',
      example: '❌ "帮我总结这场直播"\n✅ "一个道理到底怎样才会真正变成你的人生？"\n\n元提问决定了这一次对话的深度。从哪里下铲，决定能挖到什么。' },
    { step: '02', title: '六轮追问', color: '#B8860B',
      desc: '一轮回答只是表面铺开。围绕同一个原问题追问 3-5 轮甚至更多，从不同方向重复理解同一个观点。',
      example: '第 1 轮：你怎么看这句话？           → 先拿到基础理解\n第 2 轮：说得更深一点、本质一点      → 往底层挖\n第 3 轮：高手会怎么看？               → 提高视角\n第 4 轮：反面观点是什么？             → 避免单向理解\n第 5 轮：有没有极端案例？             → 把问题推到边界\n第 6 轮：怎么变成行动、文章或产品？   → 落到输出与执行' },
    { step: '03', title: '工具分工', color: '#8B6914',
      desc: '不同 AI 进入不同工序。但工具可以分工，主编只能是你——AI 不能替你决定什么最重要、什么该删、什么值得放大。',
      example: 'GPT     → 结构师：拆逻辑、搭框架、找层次\nGemini  → 金句机：提亮点、找锋利表达、压传播句\nClaude  → 文章导师：看语感、顺不顺、像不像人写' },
    { step: '04', title: '筛选', color: '#6B4F12',
      desc: '不要把 AI 所有回答都当成宝。AI 给的内容里有些只是看起来正确，有些只是结构完整，有些只是语言顺滑。要先筛一遍。',
      example: '哪一句最打中？\n哪一段最有结构？\n哪个例子能保留？\n哪个判断有传播力？\n哪些只是"正确废话"？' },
    { step: '05', title: '重写', color: '#5a4020',
      desc: '不要复制粘贴。用自己的话重新打一遍——这一步不是为了换表达，而是为了逼自己真正理解。AI 写出来很顺，换成自己的话就会卡住，那个卡住正是你还没消化的地方。',
      example: '问自己四个问题：\n· 这是我会说的话吗？\n· 这句话我真的理解了吗？\n· 这个表达贴不贴我的语气？\n· 这里有没有我的经验、判断和取舍？' },
    { step: '06', title: '封装', color: '#4A3A0A',
      desc: '把重写过的碎片变成一个可被理解、被复用、被传播的东西。封装做得好不好，决定了这次 AI 对话会不会归零。',
      example: '一段对话    → 一篇文章\n几个判断    → 一张清单\n一个流程    → 工具页\n一套方法    → 提示词模板\n一批材料    → 课程 / 报告 / 产品' },
    { step: '07', title: '输出', color: '#3a2e0e',
      desc: '把它带到真实世界里。如果内容永远停在 AI 对话框或自己的文档里，会给人"我已经想明白了"的错觉——但这还不是完整反馈。',
      example: '发出去 · 给一个真实的人看 · 发布到平台\n\n"发布不是为了证明自己，而是为了校准判断。"' },
    { step: '08', title: '反馈', color: '#2D2416',
      desc: '真实读者会不会停下来、看完、收藏、追问，只能在真实世界里发生。没有人点开，本身也是反馈——它不一定好受，但很真实。',
      example: '检验四件事：\n· 别人能不能看懂？\n· 它有没有真的打中问题？\n· 它能不能引出行动？\n· 它能不能积累信任？' },
    { step: '09', title: '下一轮迭代', color: '#1a1208',
      desc: '把反馈带回来，变成下一轮提问的起点。读者反复问的同一个问题，不是麻烦，是在提醒——下一个元提问就藏在这里。',
      example: '数据低 → 标题和开头没打开\n收藏高 → 这里有工具价值\n反复追问同一处 → 下一个元提问的种子\n\n→ 回到第 01 步：新的元提问' },
  ];
  const tools = [
    { name: 'GPT-4o', role: '结构师', color: '#10a37f',
      strengths: ['逻辑框架搭建', '信息整合归纳', '提纲拆解', '多角度分析'] },
    { name: 'Gemini', role: '金句机', color: '#4285f4',
      strengths: ['语言打磨', '金句提炼', '文风调整', '表达创意'] },
    { name: 'Claude', role: '文章导师', color: '#CC785C',
      strengths: ['长文修改润色', '论点深化', '风格一致性', '细节审校'] },
  ];

  return (
    <section style={{ background: '#F5F2EB', minHeight: '100vh' }}>
      <div className="ra-chapter-bg"
           style={{ background: 'linear-gradient(135deg,#F5F2EB 0%,#EDE5D0 100%)',
                     padding: '6rem 3rem 4rem', position: 'relative' }}>
        <HeroDecoCh04 />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.4em', marginBottom: '1.2rem' }}>CHAPTER 04 / 04</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3.2rem)',
                        color: '#2D2416', fontWeight: 400, marginBottom: '1rem', lineHeight: 1.3 }}>AI 使用方法</h2>
          <p style={{ fontSize: '1.2rem', color: '#8B6914', letterSpacing: '0.05em',
                       marginBottom: '2rem', fontStyle: 'italic' }}>从元提问到完整闭环</p>
        </div>
      </div>

      <div style={{ padding: '4rem 3rem', maxWidth: 900, margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.1em',
                      fontWeight: 500, marginBottom: '0.5rem', scrollMarginTop: '40px' }} id="ch04-workflow">完整工作流：九步闭环</h3>
        <p style={{ color: 'rgba(45,36,22,0.55)', fontSize: '0.85rem', marginBottom: '2rem' }}>
          元提问 → 多轮追问 → 工具分工 → 筛选 → 重写 → 封装 → 输出 → 反馈 → 下一轮迭代 · 点击每一步展开
        </p>

        <div className="ra-workflow" style={{ marginBottom: '4rem' }}>
          {workflow.map((w, i) => (
            <div key={i} className={`ra-workflow-row ${activeStep === i ? 'active' : ''}`}>
              <div className="ra-workflow-dot">{w.step}</div>
              <div style={{ flex: 1 }}>
                <div onClick={() => setActiveStep(activeStep === i ? -1 : i)}
                     style={{ display: 'flex', alignItems: 'center', gap: '1rem',
                                background: activeStep === i ? '#fff' : '#fff',
                                border: `1px solid ${activeStep === i ? w.color : 'rgba(45,36,22,0.1)'}`,
                                padding: '1rem 1.4rem', cursor: 'pointer',
                                transition: 'all 0.3s ease' }}>
                  <span style={{ flex: 1, fontSize: '1.05rem', color: '#2D2416', fontWeight: 500 }}>
                    {w.title}
                  </span>
                  {activeStep === i
                    ? <ChevronUp size={14} style={{ color: '#C9A227' }} />
                    : <ChevronDown size={14} style={{ color: 'rgba(45,36,22,0.3)' }} />}
                </div>
                {activeStep === i && (
                  <div style={{ background: 'rgba(201,162,39,0.03)',
                                 border: '1px solid rgba(201,162,39,0.15)', borderTop: 'none',
                                 padding: '1.5rem 1.8rem' }}>
                    <p style={{ color: 'rgba(45,36,22,0.7)', fontSize: '0.9rem',
                                 lineHeight: 1.9, marginBottom: '1.2rem' }}>{w.desc}</p>
                    <div style={{ background: '#2D2416', padding: '1rem 1.4rem', borderLeft: `3px solid ${w.color}` }}>
                      <p style={{ color: w.color, fontSize: '0.7rem', marginBottom: '0.4rem',
                                   letterSpacing: '0.2em' }}>EXAMPLE / 示例</p>
                      <pre style={{ color: 'rgba(250,248,243,0.85)', fontSize: '0.82rem',
                                      lineHeight: 1.8, fontFamily: 'inherit', whiteSpace: 'pre-wrap', margin: 0 }}>
                        {w.example}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.1em',
                      fontWeight: 500, marginBottom: '0.5rem', scrollMarginTop: '40px' }} id="ch04-tools">工具分工表</h3>
        <p style={{ color: 'rgba(45,36,22,0.55)', fontSize: '0.85rem', marginBottom: '2rem' }}>盲目使用一个工具是在浪费它们的个性</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.2rem', marginBottom: '3rem' }}>
          {tools.map((t, i) => (
            <div key={i} className="ra-tool-card">
              <span className="ra-tool-badge" style={{ color: t.color, borderColor: t.color }}>{t.role}</span>
              <h4 style={{ fontSize: '1.1rem', color: '#2D2416', fontWeight: 600, marginBottom: '1rem' }}>{t.name}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {t.strengths.map((s, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CheckCircle size={11} style={{ color: t.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.82rem', color: 'rgba(45,36,22,0.7)' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="ra-bigquote">
          <p className="ra-bigquote-text">
            AI 可以帮你<strong>挖深问题</strong>，<br />
            但<strong>真实世界</strong>才会训练你的判断。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                       letterSpacing: '0.2em', marginTop: '1.5rem',
                       fontStyle: 'italic' }}>
            — AI 不能替你完成摩擦
          </p>
        </div>

        <ActionCard
          id="ch04"
          title="今天的最低成本版本"
          prompts={[
            '不用一开始就跑完整流程。今天只承诺最小版本——',
            '挑一个你愿意今天就发出去的最小输出。',
          ]}
          chipsLabel="今天的最小输出（可多选）"
          chips={[
            '写一段 100 字',
            '发一条朋友圈',
            '发一篇小红书',
            '发给一个朋友看',
            '语音给自己讲一遍',
            '写进自己的笔记',
            '做一张截图卡片',
            '回一个评论',
            '改一段过去的稿子',
          ]}
          placeholder="或者写下：今天我打算这样跑一遍最小闭环……"
        />

        <ChapterNav current="ch04" onNav={onNav} />
      </div>
    </section>
  );
};

// ── Outro ─────────────────────────────────────────────────────────────────────
const OutroPage = ({ onNav }) => {
  const principles = [
    '听过不等于拥有，认同也不等于做到',
    '知道和做到之间，不是知识的缝隙，而是意志的缝隙',
    '人生不是由你临时想做什么决定的，而是由你的默认设置决定的',
    '一个人重复什么，就会默认什么；默认什么，就会活成什么',
    '普通人的重复是画圈，高手的重复是螺旋',
    '原则就是你的宪法 · 复利的前提，是不要反复清零',
    '刷短视频，你是矿；用 AI，你是矿工',
    'AI 给你的不是最终成品，而是可以被你加工的材料',
    'AI 可以帮你挖深问题，但真实世界才会训练你的判断',
  ];

  // Read user's action card responses from localStorage
  const [traces, setTraces] = useState([]);
  useEffect(() => {
    const found = [];
    ['ch01','ch02','ch03','ch04'].forEach(id => {
      try {
        const raw = localStorage.getItem(`ra-action-${id}`);
        if (raw) {
          const data = JSON.parse(raw);
          if (data.value && data.value.trim()) {
            found.push({ id, ...data });
          }
        }
      } catch (e) {}
    });
    setTraces(found);
  }, []);

  const chapterTitleMap = {
    ch01: 'Ch01 · 你写下的那句话',
    ch02: 'Ch02 · 你的重复训练',
    ch03: 'Ch03 · 打开 AI 前的三问',
    ch04: 'Ch04 · 今天的最低成本版本',
  };
  return (
    <section style={{ minHeight: '100vh', background: '#140E06', color: '#FAF8F3',
                       position: 'relative', overflow: 'hidden' }}>
      {/* Big atmospheric glow */}
      <div style={{ position: 'absolute', inset: 0,
                     background: 'radial-gradient(ellipse at 50% 30%,rgba(201,162,39,0.12) 0%,transparent 50%)',
                     pointerEvents: 'none' }} />
      {/* Decorative giant character */}
      <div style={{ position: 'absolute', right: '-3rem', bottom: '-5rem',
                     fontFamily: "'Playfair Display',serif",
                     fontSize: 'clamp(20rem,40vw,40rem)',
                     color: 'rgba(201,162,39,0.04)', lineHeight: 1, fontWeight: 700,
                     pointerEvents: 'none', userSelect: 'none' }}>
        重
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1,
                     padding: '8rem 3rem 6rem' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <p style={{ color: 'rgba(201,162,39,0.5)', fontSize: '0.7rem',
                       letterSpacing: '0.5em', marginBottom: '2rem' }}>
            — FINALE —
          </p>
          <h2 style={{ fontFamily: "'Playfair Display',serif",
                        fontSize: 'clamp(2.5rem,7vw,5rem)', color: '#FAF8F3',
                        fontWeight: 400, marginBottom: '1.5rem', lineHeight: 1.2 }}>
            把它重复到身体里
          </h2>
          <p style={{ color: 'rgba(201,162,39,0.7)', fontSize: 'clamp(1rem,1.6vw,1.2rem)',
                       letterSpacing: '0.15em', fontStyle: 'italic' }}>
            直到它成为你的气质
          </p>
        </div>

        {/* Core sentence — MASSIVE typography */}
        <div style={{ borderTop: '1px solid rgba(201,162,39,0.2)',
                       borderBottom: '1px solid rgba(201,162,39,0.2)',
                       padding: '5rem 0', marginBottom: '6rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(250,248,243,0.4)', fontSize: '0.7rem',
                       letterSpacing: '0.4em', marginBottom: '2.5rem' }}>
            THE CORE SENTENCE
          </p>
          <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                       color: '#FAF8F3', fontSize: 'clamp(1.6rem,4vw,3rem)',
                       lineHeight: 1.6, fontWeight: 400, marginBottom: '0.5rem' }}>
            把一个道理重复到身体里，
          </p>
          <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                       color: '#C9A227', fontSize: 'clamp(1.6rem,4vw,3rem)',
                       lineHeight: 1.6, fontWeight: 400, fontStyle: 'italic' }}>
            它才会变成你的人生。
          </p>
        </div>

        {/* Principles list */}
        <div style={{ marginBottom: '5rem' }}>
          <p style={{ color: 'rgba(201,162,39,0.5)', fontSize: '0.7rem',
                       letterSpacing: '0.4em', marginBottom: '2rem', textAlign: 'center' }}>
            NINE PRINCIPLES TO REPEAT
          </p>
          {principles.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem',
                                    padding: '1.2rem 0', borderBottom: '1px solid rgba(201,162,39,0.08)' }}>
              <span style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.2em',
                               marginTop: '0.3rem', flexShrink: 0,
                               fontFamily: "'Playfair Display',serif", fontWeight: 600 }}>
                {String(i+1).padStart(2,'0')}
              </span>
              <p style={{ color: 'rgba(250,248,243,0.78)', fontSize: '1rem',
                           lineHeight: 1.9, flex: 1 }}>{p}</p>
            </div>
          ))}
        </div>

        {/* Your traces — what you wrote in the action cards */}
        <div style={{ marginBottom: '5rem', padding: '3rem 2rem',
                       border: '1px solid rgba(201,162,39,0.2)',
                       background: 'rgba(201,162,39,0.03)' }}>
          <p style={{ color: 'rgba(201,162,39,0.6)', fontSize: '0.7rem',
                       letterSpacing: '0.4em', marginBottom: '0.5rem', textAlign: 'center' }}>
            YOUR TRACES
          </p>
          <h3 style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                        fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', textAlign: 'center',
                        color: '#FAF8F3', fontWeight: 400, marginBottom: '0.5rem' }}>
            你在这本手册里留下的痕迹
          </h3>
          <p style={{ textAlign: 'center', color: 'rgba(250,248,243,0.5)',
                       fontSize: '0.85rem', marginBottom: '2.5rem',
                       fontStyle: 'italic' }}>
            一段关系过去了、一个项目失败了、一次对话结束了——<br />
            真正可惜的，不是事情结束，而是结束以后什么都没有留下。
          </p>

          {traces.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ color: 'rgba(250,248,243,0.4)', fontSize: '0.9rem',
                           lineHeight: 1.9, marginBottom: '1.5rem' }}>
                你还没有在任何一张行动卡上写下东西。<br />
                这本手册的真正价值，发生在你动手写下来的瞬间。
              </p>
              <button onClick={() => onNav('ch01')}
                      style={{ background: 'transparent', border: '1px solid rgba(201,162,39,0.5)',
                                color: '#C9A227', padding: '0.7rem 2rem', cursor: 'pointer',
                                fontFamily: 'inherit', fontSize: '0.85rem', letterSpacing: '0.2em' }}>
                回到 Ch01 写下第一句
              </button>
            </div>
          ) : (
            <>
              {traces.map(t => (
                <div key={t.id} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem',
                                            borderBottom: '1px dashed rgba(201,162,39,0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                                 alignItems: 'baseline', marginBottom: '0.6rem' }}>
                    <span style={{ color: '#C9A227', fontSize: '0.75rem',
                                     letterSpacing: '0.15em' }}>
                      {chapterTitleMap[t.id]}
                    </span>
                    <span style={{ color: 'rgba(250,248,243,0.3)', fontSize: '0.65rem' }}>
                      {t.savedAt}
                    </span>
                  </div>
                  <p style={{ color: 'rgba(250,248,243,0.85)', fontSize: '0.95rem',
                               lineHeight: 1.9, whiteSpace: 'pre-wrap',
                               fontFamily: "'Noto Serif SC',serif" }}>
                    {t.value}
                  </p>
                </div>
              ))}
              <p style={{ textAlign: 'center', color: 'rgba(201,162,39,0.5)',
                           fontSize: '0.75rem', letterSpacing: '0.2em',
                           marginTop: '2rem', fontStyle: 'italic' }}>
                — 这些是你的不归零 —
              </p>
            </>
          )}
        </div>

        <CommitmentCard />

        {/* Restart button — 重复 themed */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <button onClick={() => onNav('directory')}
                  className="ra-btn"
                  style={{ background: 'transparent', border: '1px solid rgba(201,162,39,0.5)',
                            color: '#C9A227', padding: '1rem 3rem',
                            fontFamily: "'Noto Serif SC',serif",
                            fontSize: '0.95rem', letterSpacing: '0.25em', cursor: 'pointer' }}>
            <RotateCcw size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.6rem' }} />
            再读一遍
          </button>
          <p style={{ color: 'rgba(250,248,243,0.3)', fontSize: '0.75rem',
                       letterSpacing: '0.15em', marginTop: '1.5rem', fontStyle: 'italic' }}>
            重复，是螺旋上升 · 第二次读会有第一次没看见的东西
          </p>
        </div>

        {/* Signature */}
        <div style={{ textAlign: 'center', paddingTop: '3rem',
                       borderTop: '1px solid rgba(201,162,39,0.1)' }}>
          <p style={{ color: 'rgba(250,248,243,0.25)', fontSize: '0.7rem',
                       letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
            REPEAT · AI · ENCAPSULATE · NO RESET
          </p>
          <p style={{ color: 'rgba(250,248,243,0.2)', fontSize: '0.65rem',
                       letterSpacing: '0.2em' }}>
            封装手册 · Vol.001 · MMXXVI
          </p>
        </div>
      </div>
    </section>
  );
};

// ── App (root) ────────────────────────────────────────────────────────────────
export default function App() {
  const [entered, setEntered] = useState(false);
  const [activePage, setActivePage] = useState('preface');
  const [scrollPct, setScrollPct] = useState(0);
  const [navKey, setNavKey] = useState(0);   // increments on each nav, triggers entrance animation
  const mainRef = useRef(null);

  const handleNav = (id) => {
    setActivePage(id);
    setNavKey(k => k + 1);
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Anchors per chapter
  const anchorsByPage = {
    ch01: [
      { id: 'ch1-compound',  label: '01 · 复利的本质' },
      { id: 'ch2-attention', label: '02 · 三重劫持' },
      { id: 'ch2-pressure',  label: '02 · 压强公式' },
      { id: 'ch2-anxiety',   label: '02 · 焦虑与最小动作' },
    ],
    // ch02-ch04 anchors will be added in next iteration
  };
  const currentAnchors = anchorsByPage[activePage];

  // Track scroll progress within current page
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setScrollPct(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [entered, activePage]);

  // Keyboard navigation: ← → to switch chapters, Esc to top
  useEffect(() => {
    if (!entered) return;
    const onKey = (e) => {
      // Skip if user is typing in an input/textarea
      if (['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
      const idx = PAGE_ORDER.indexOf(activePage);
      if (e.key === 'ArrowRight' && idx < PAGE_ORDER.length - 1) {
        handleNav(PAGE_ORDER[idx + 1]);
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        handleNav(PAGE_ORDER[idx - 1]);
      } else if (e.key === 'Escape') {
        mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [entered, activePage]);

  const renderPage = () => {
    switch (activePage) {
      case 'preface':   return <PrefacePage onNav={handleNav} />;
      case 'directory': return <DirectoryPage onNav={handleNav} />;
      case 'ch01':      return <Ch01Page onNav={handleNav} />;
      case 'ch02':      return <Ch02Page onNav={handleNav} />;
      case 'ch03':      return <Ch03Page onNav={handleNav} />;
      case 'ch04':      return <Ch04Page onNav={handleNav} />;
      case 'outro':     return <OutroPage onNav={handleNav} />;
      default:          return <PrefacePage onNav={handleNav} />;
    }
  };

  return (
    <>
      {/* GlobalStyles is always mounted — CSS never disappears */}
      <GlobalStyles />

      {!entered ? (
        <LandingPage onEnter={() => setEntered(true)} />
      ) : (
        <div className="ra-app">
          <Sidebar active={activePage} onNav={handleNav} />
          {/* Scroll progress bar */}
          <div className="ra-progress">
            <div className="ra-progress-fill" style={{ width: `${scrollPct}%` }} />
          </div>
          <main ref={mainRef} className="ra-main">
            {/* key triggers fade-in on chapter switch */}
            <div key={activePage} className="ra-page">
              {renderPage()}
            </div>
          </main>
          {/* Floating UI overlays */}
          <MouseGlow />
          {currentAnchors && (
            <AnchorNav scrollEl={mainRef} items={currentAnchors} key={`anchor-${activePage}`} />
          )}
          <BackToTop scrollEl={mainRef} />
          {/* Full-screen ceremony overlay on chapter change */}
          <ChapterEntrance pageId={activePage} navKey={navKey} />
        </div>
      )}
    </>
  );
}
