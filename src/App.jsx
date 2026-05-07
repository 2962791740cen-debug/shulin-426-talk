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
    /* ── fonts (self-hosted Playfair Display + system stack for Chinese) ── */
    /* Self-hosted woff2 — fast in China, no external requests, ~67KB total */
    @font-face {
      font-family: 'Playfair Display';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('/fonts/playfair-400-normal.woff2') format('woff2');
    }
    @font-face {
      font-family: 'Playfair Display';
      font-style: italic;
      font-weight: 400;
      font-display: swap;
      src: url('/fonts/playfair-400-italic.woff2') format('woff2');
    }
    @font-face {
      font-family: 'Playfair Display';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: url('/fonts/playfair-700-normal.woff2') format('woff2');
    }

    /* ── reset ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; overflow: hidden; }
    body { font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Source Han Serif SC", "Songti SC", serif; }

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
      position: fixed; top: 0; left: 220px; right: 0; height: 3px;
      background: linear-gradient(90deg,
        rgba(201,162,39,0.05) 0%,
        rgba(201,162,39,0.08) 50%,
        rgba(201,162,39,0.05) 100%);
      z-index: 200;
      backdrop-filter: blur(2px);
    }
    .ra-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #8B6914 0%, #C9A227 50%, #e8c84a 100%);
      transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow:
        0 0 10px rgba(201,162,39,0.6),
        0 0 20px rgba(201,162,39,0.3);
      position: relative;
    }
    /* glowing tip at the leading edge */
    .ra-progress-fill::after {
      content: ''; position: absolute; right: 0; top: -2px; bottom: -2px;
      width: 6px; border-radius: 50%;
      background: radial-gradient(circle, #fff 0%, #e8c84a 40%, transparent 70%);
      opacity: 0.9;
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

    /* ══ PULL QUOTE BLOCK (oversized typography, gold accent) ════════════════ */
    .ra-bigquote {
      position: relative; padding: 5rem 2rem 4rem; margin: 4.5rem 0;
      text-align: center;
      background:
        linear-gradient(180deg,
          rgba(201,162,39,0.025) 0%,
          rgba(201,162,39,0.06) 50%,
          rgba(201,162,39,0.025) 100%);
      border-top: 1px solid rgba(201,162,39,0.25);
      border-bottom: 1px solid rgba(201,162,39,0.25);
    }
    /* Decorative giant left quote mark */
    .ra-bigquote::before {
      content: '"';
      position: absolute; top: 1.4rem; left: 50%; transform: translateX(-50%);
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(3rem, 5vw, 4.5rem); font-weight: 700;
      color: #C9A227; opacity: 0.45; line-height: 1;
      pointer-events: none; letter-spacing: -0.05em;
    }
    /* Center seam — short golden line under the quote mark */
    .ra-bigquote::after {
      content: ''; position: absolute; bottom: -1px; left: 50%;
      transform: translateX(-50%);
      width: 80px; height: 1px;
      background: linear-gradient(90deg, transparent, #C9A227, transparent);
      box-shadow: 0 0 8px rgba(201,162,39,0.5);
    }
    .ra-bigquote-text {
      font-family: 'Playfair Display','Noto Serif SC', Georgia, serif;
      font-size: clamp(1.5rem, 3.2vw, 2.4rem);
      line-height: 1.65; letter-spacing: 0.02em;
      color: #2D2416; font-style: italic;
      max-width: 720px; margin: 0 auto;
    }
    .ra-bigquote-text strong {
      color: #C9A227; font-weight: 500; font-style: normal;
      text-shadow: 0 0 24px rgba(201,162,39,0.18);
    }

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
      subText  = '连 3 秒，都需要意志的连续';
    } else if (attempts === 2) {
      mainText = '再试一次';
      subText  = '"先做一次"也只需要这种意志';
    } else {
      mainText = '没关系。再来一次';
      subText  = '0 到 1 的难，多半就在这一刻松开';
    }
  }
  if (status === 'passed') {
    mainText = '你做到了';
    subText  = '——3 秒而已。但你刚才确实没有松开';
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
            但试着想象一下：把"今天就发"按住 <strong>21 天</strong>。把"每天先做一次"按住 <strong>100 天</strong>。<br/>
            <strong>想</strong>和<strong>做</strong>之间，差的就是这种意志的连续。</>
          ) : (
            <>这就是<strong>第零次的缝隙</strong>。<br/>
            知道要按住，知道只有 3 秒，知道松手就失败——
            但身体还是松开了。<br/>
            "想了一百遍但没做"，每一次的机制都是这一刻。</>
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
        <div style={{ fontSize:'0.6rem', opacity:0.6 }}>文库 Vol.002 · 2026.04.26</div>
      </div>
      <div className="ra-landing-corner tr">MMXXVI</div>
      <div className="ra-landing-corner br">
        19 分钟讲话 · 6000 字逐字稿
      </div>

      {/* Phrases */}
      <p className={`ra-phrase ${phase === 1 ? 'show' : phase > 1 ? 'hide' : ''}`}>
        你脑子里把这件事想了一百遍
      </p>
      <p className={`ra-phrase ${phase === 2 ? 'show' : phase > 2 ? 'hide' : ''}`}
         style={{ fontSize: 'clamp(0.9rem,1.8vw,1.3rem)', color: 'rgba(201,162,39,0.75)' }}>
        但都不如真的去做一次
      </p>

      {/* Two-door split (cinematic) */}
      {phase >= 3 && (
        <div className="ra-door-wrap">
          <div className={`ra-door left ${crackVisible ? 'open' : ''}`}>
            <span className="ra-door-glyph-half">先</span>
          </div>
          <div className={`ra-door right ${crackVisible ? 'open' : ''}`}>
            <span className="ra-door-glyph-half">先</span>
          </div>
          <div className={`ra-crack ${crackVisible ? 'show' : ''}`} />
        </div>
      )}

      {/* Hero */}
      <div className={`ra-hero ${heroVisible ? 'show' : ''}`}>
        <div className="ra-hero-inner">
          <p style={{ color: 'rgba(201,162,39,0.5)', fontSize: '0.75rem',
                       letterSpacing: '0.4em', marginBottom: '1.5rem' }}>
            ZERO · TO · ONE
          </p>
          <h1 style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                        fontSize: 'clamp(2rem,5vw,4rem)', color: '#FAF8F3',
                        fontWeight: 400, letterSpacing: '0.05em',
                        textShadow: '0 0 40px rgba(201,162,39,0.3)', lineHeight: 1.3 }}>
            先做了，再说
          </h1>
          <p style={{ color: 'rgba(201,162,39,0.7)', fontSize: 'clamp(0.95rem,1.6vw,1.1rem)',
                       letterSpacing: '0.3em', marginTop: '1.2rem' }}>
            0 到 1 · 充分表达 · 心力
          </p>
          <p style={{ color: 'rgba(250,248,243,0.45)', fontSize: 'clamp(0.78rem,1.2vw,0.9rem)',
                       letterSpacing: '0.15em', marginTop: '0.8rem', fontStyle: 'italic' }}>
            一段十九分钟的讲话，做成一本反复翻阅的小书
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
          一段十九分钟的讲话，<br/>做成一本反复翻阅的小书。
        </PrefaceLine>

        <PrefaceLine delay={1900}>
          <p className="ra-preface-line">
            这不是摘要，也不是干涩的逐字稿，而是一份<strong>"讲话整理稿"</strong>——
            把树林 4 月 26 日那段不到 20 分钟的群讲，按底层逻辑重新组织、补足语境，
            做成一份你随时翻一页都能拿走点东西的小册子。
          </p>
        </PrefaceLine>

        <PrefaceLine delay={2700}>
          <p className="ra-preface-line">
            原始素材是 <strong>19 分钟录音、6000 字逐字稿、60 段</strong>。
            这份整理稿做了三件事：按主题重排顺序、保留所有戳人的原话、
            把锋利的句子单独拎出来——让你既能顺着读完，也能随时翻金句。
          </p>
        </PrefaceLine>

        <PrefaceLine delay={3500}>
          <div className="ra-preface-divider" />
        </PrefaceLine>

        <PrefaceLine delay={3900}>
          <p className="ra-preface-line">
            全文<strong>三篇六章 + 附录</strong>，约 20 分钟读完。
            体量只有上一本《年轻人，就是要莽！》的三十分之一，
            但它<strong>更紧、更短、更适合反复看</strong>——
            因为它讲的是一件最朴素也最难做的事。
          </p>
        </PrefaceLine>

        <PrefaceLine delay={4800}>
          <p className="ra-preface-line">
            那件事没有花哨的术语，没有惊艳的金句结构，
            就是一句话：<strong style={{color:'#C9A227'}}>想了一百遍，不如先做一次</strong>。
          </p>
        </PrefaceLine>

        <PrefaceLine delay={5700}>
          <p className="ra-preface-line">
            这段讲话表面是讲<strong>公开输出、AI、IP、陌生人</strong>，
            但树林贯穿始终在反复说的，其实是：
          </p>
        </PrefaceLine>

        {/* The closing line that defines this whole book */}
        <PrefaceLine delay={6700} className="ra-preface-lead">
          "从 0 到 1，<br/>是最贵的。<br/>而 0 到 1 的唯一方式，<br/>是先做。"
        </PrefaceLine>

        <PrefaceLine delay={7600}>
          <p className="ra-preface-line">
            这是说给那些<strong>卡在零</strong>的人听的——
            那些每天在脑子里把一件事演练一百遍，
            但还<strong>没真正动手做过一次</strong>的人。
          </p>
        </PrefaceLine>

        <PrefaceLine delay={8400} className="ra-preface-lead final">
          —— 整理者 · 2026
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

// ── Compound Visualizer (Ch03: AI growth slope) ─────────────────────────────
const CompoundVisualizer = () => {
  const KEY = 'ra-compound';
  const [thing, setThing] = useState('每天用 AI');
  const [amount, setAmount] = useState(4);
  const [unit, setUnit] = useState('小时');
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
      <div className="ra-compound-title">AI 成长斜率可视化器</div>
      <p className="ra-compound-sub">
        每天用 AI 几小时？看看在 1 / 7 / 21 / 100 / 365 天后，
        你跟"还没用 AI 的人"差出多少。
      </p>

      <div className="ra-compound-input-row">
        <input className="ra-compound-input" type="text" placeholder="例：每天用 AI"
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
          一年之后：你「{thing}」累计已经是
          <strong> {fmt(totals[4])} {unit}</strong>
          <br />
          <span style={{ color: 'rgba(45,36,22,0.55)', fontSize: '0.8rem' }}>
            前提：每天都做，不反复清零 · 否则斜率回到 0
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
            <div className="ra-commit-field-label">那件 0 到 1 的事</div>
            <input className="ra-commit-input" type="text"
                   placeholder="例：把那个想了一年的副业先发出去"
                   value={principle}
                   onChange={e => setPrinciple(e.target.value)} />
          </div>
          <div>
            <div className="ra-commit-field-label">未来 21 天，我承诺这样做</div>
            <textarea className="ra-commit-textarea"
                      placeholder="例：每天先做一件最小的、可以发出去的事——不修不删，直接发"
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
            ? `已保存到本地浏览器 · ${revealAt} 那天回来看看你从 0 走到了哪里`
            : '保存后 21 天回来 · 也是给"先做了，再说"的一次实战'}
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
    ch01:    { num: '壹', label: 'PART ONE',    title: '恐惧与第零次' },
    ch02:    { num: '贰', label: 'PART TWO',    title: '身体决定你怎么看世界' },
    ch03:    { num: '叁', label: 'PART THREE',  title: 'AI 时代与陌生人' },
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
export const PAGE_ORDER = ['preface', 'directory', 'ch01', 'ch02', 'ch03', 'outro'];
export const PAGE_META = {
  preface:   { label: '编者按',                  icon: <Feather    size={13} />, time: '2 min' },
  directory: { label: '目录',                    icon: <BookMarked size={13} />, time: '1 min' },
  ch01:      { label: '壹 · 上篇 · 第零次',       icon: <Repeat     size={13} />, time: '5 min' },
  ch02:      { label: '贰 · 中篇 · 身体',        icon: <RotateCcw  size={13} />, time: '6 min' },
  ch03:      { label: '叁 · 终篇 · AI 与陌生人', icon: <Cpu        size={13} />, time: '6 min' },
  outro:     { label: '金句索引 · 后记',          icon: <Star       size={13} />, time: '3 min' },
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
          文库 Vol.002 · 2026.04.26
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
      title: '恐惧与第零次', sub: '想了一百遍 ≠ 做了一次',
      desc: '所有"不过如此"的事情，在你第零次的时候都会被想象得无限恐怖。第零次的恐惧是真的，但事情本身不是。这一篇讲：你为什么卡在零，以及怎么走出第一步。',
      chapters: [
        { n: '01', t: '不过如此 · 第零次的恐惧' },
        { n: '02', t: '0 到 1 是最贵的' },
      ],
      tags: ['公开输出', '想 vs 做', '既往才能开来'] },
    { id: 'ch02', num: '贰', cn: '中篇', en: 'PART TWO', color: '#6B4F12',
      title: '身体决定你怎么看世界', sub: '不是想清楚了才去做，是身体先撑得住',
      desc: '你对这个世界的恐惧、急切、内耗——多半不是性格问题，是血糖、肌肉、睾酮的问题。身体先于心智。把炭烧起来，世界自然就不那么吓人。',
      chapters: [
        { n: '03', t: '血糖、肌肉、睾酮' },
        { n: '04', t: '充分表达 = 频率 × 深度 × 领域' },
      ],
      tags: ['控糖', '练腿', '充分表达'] },
    { id: 'ch03', num: '叁', cn: '终篇', en: 'PART THREE', color: '#2D2416',
      title: 'AI 时代与陌生人', sub: '最菜的一届，可能是最好的一届',
      desc: 'IP 的本质是信息、能量、情绪自高向低流动。陌生人是你交易最高频的人群。AI 时代的成长斜率，第一次让"最菜的一届"有机会变成"最好的一届"。',
      chapters: [
        { n: '05', t: 'IP 是自高向低的流动' },
        { n: '06', t: '最菜的一届，可能是最好的一届' },
      ],
      tags: ['陌生人', '黑箱翻译', 'AI 斜率'] },
  ];
  return (
    <section style={{ background: '#FAF8F3', padding: '5rem 3rem', minHeight: '100vh',
                       position: 'relative', overflow: 'hidden' }}>
      <span className="ra-dir-glyph">先</span>
      <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <p style={{ color: '#C9A227', fontSize: '0.75rem', letterSpacing: '0.4em', marginBottom: '1rem' }}>
          — TABLE OF CONTENTS —
        </p>
        <h2 style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                      fontSize: 'clamp(2.2rem,4.5vw,3.2rem)',
                      color: '#2D2416', fontWeight: 400, marginBottom: '0.5rem' }}>
          三篇 · 六章 · 一份附录
        </h2>
        <p style={{ color: 'rgba(45,36,22,0.55)', fontSize: '0.85rem',
                     letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
          约 20 页 · 17 分钟阅读 · 短而紧，建议读两遍
        </p>
        <div className="ra-quote" style={{ maxWidth: 640 }}>
          这本小书只讲一件事——<br/>
          想了一百遍，不如先做一次。
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

// ── Part I · 上篇 · 恐惧与第零次 ────────────────────────────────────────────
const Ch01Page = ({ onNav }) => {
  return (
    <section style={{ background: '#FAF8F3', minHeight: '100vh' }}>
      <PartHero partNum="壹" partRoman="I" title="恐惧与第零次"
                subtitle="想了一百遍 ≠ 做了一次"
                deco={<HeroDecoCh01 />}
                leadQuote={<>
                  所有"不过如此"的事情，<br/>
                  在你<strong style={{ color: '#2D2416' }}>第零次</strong>的时候，
                  都会被想象得无限恐怖。<br/>
                  这一篇讲：你为什么卡在零，<strong style={{ color: '#2D2416' }}>以及怎么走出第一步。</strong>
                </>} />

      <div style={{ padding: '4rem 3rem', maxWidth: 800, margin: '0 auto' }}>

        {/* CHAPTER 1 · 不过如此 · 第零次的恐惧 */}
        <div id="ch1-zeroth" style={{ scrollMarginTop: '40px' }}>
          <ChapterIntro num="一" en="ONE" title="不过如此 · 第零次的恐惧"
                        lead='"那些不过如此的事情，在你第零次的时候，会被想象得无限恐怖。"' />

          <Para>
            树林这段讲话开场就抛出了一个朴素到几乎被忽视的事实——
            <strong style={{color:'#2D2416'}}>大部分人对外展示自己的观点、态度、想法，本能地恐惧</strong>。
            但这种恐惧只在做之前存在，做完之后就消失。所有"不过如此"的事情，
            <strong style={{color:'#C9A227'}}>都是事后说的</strong>。
          </Para>

          <SubH id="ch1-public">每天必要的一件事 · 公开输出</SubH>
          <Para>
            他给学员的硬规定不是"多读书""多思考"，而是
            <strong>每天公开输出</strong>。强制性。把恐惧拆掉。
            因为这件事的结构是：你不做，恐惧只会变大；你做了，"不过如此"四个字才会出现。
          </Para>

          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              所有不过如此的事情，<br/>
              在大家<strong>第零次</strong>的时候，<br/>
              无限的对这个第一次的想象里面，<br/>
              你们会<strong>异常的恐惧</strong>。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论第零次
            </p>
          </div>

          <Para style={{ marginTop: '1.5rem' }}>
            他举的例子非常具体——
            <strong>跟好看的男生女生搭讪、第一次一个人出去做什么、第一次公开演讲、
            第一次卖什么东西、第一次发表你的看法</strong>。
            这些事情你想十遍想一百遍，恐惧不会变小一丝。
            <strong style={{color:'#C9A227'}}>它只会在你真的做了一次之后变小。</strong>
          </Para>

          <SubH>第零次的悖论</SubH>
          <Para>
            第零次的恐惧有一个非常残酷的悖论：
            <strong style={{color:'#c0392b'}}>你越没经验，越觉得它复杂；越觉得复杂，越不敢做；越不敢做，越没经验</strong>。
            这是一个完美的封闭循环。
          </Para>
          <Para>
            打破它的方式只有一种——
            <strong style={{color:'#C9A227'}}>不思考，先做</strong>。
            因为这一刻你的思考没有素材，全是想象。想象不出经验。
            你只有先做了，才有真实的反馈进入大脑，认知才能开始更新。
          </Para>

          <ChapterClose>
            恐惧只在第零次存在。<br/>
            <span style={{color:'#C9A227'}}>你想得越多，反而越不敢做；做了一次，"不过如此"自己会冒出来。</span>
          </ChapterClose>
        </div>

        {/* PULL QUOTE 01 · 论想 vs 做 */}
        <PullQuote num="01" label="论 想 vs 做" attr="树林">
          想就是<strong style={{color:'#C9A227', fontStyle:'normal'}}>纯粹语言的演绎</strong>，<br/>
          且还是在你的<br/>
          大脑里面的<br/>
          语言的演绎。
        </PullQuote>

        {/* CHAPTER 2 · 0 到 1 是最贵的 */}
        <div id="ch2-zerotoone" style={{ scrollMarginTop: '40px', marginTop: '4rem' }}>
          <ChapterIntro num="二" en="TWO" title="0 到 1 是最贵的"
                        lead='"从 0 到 1 是最贵的——只有先有了 0 到 1 的经验，你的思考才有意义。"' />

          <Para>
            上一章讲了第零次的恐惧。这一章讲一个更狠的真相——
            <strong style={{color:'#2D2416'}}>所有的思考，都建立在你已经从 0 走到 1 的基础上</strong>。
            还在 0 的位置上无限思考，本质上不是思考，是
            <strong style={{color:'#c0392b'}}>内耗</strong>。
          </Para>

          <SubH id="ch2-imagination">卡在零的想象</SubH>
          <Para>
            树林给了一个让人哭笑不得的画面——
            一个还没赚到钱的人，会不停想象有钱的世界长什么样；
            一个还没谈过恋爱的人，会不停想象跟帅哥美女谈恋爱是什么样；
            一个 AI 用得很烂的人，会不停想象 AI 用得很溜是什么样；
            一个还没做出一个 IP 的人，会不停想象做出来一个 IP 是什么样。
          </Para>

          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              基于你仅有的对世界的认识和理解，<br/>
              基于你可能是个<strong>处男或者处女</strong>，<br/>
              对男人女人一概不知；<br/>
              基于你可能是一个<strong>商业的小白</strong>，<br/>
              对商业一概不知；<br/>
              基于你<strong>从来都没做过 IP</strong>——<br/>
              你要去想到一个完美的路径，<br/>
              不觉得不可能吗？
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论纯粹的想象
            </p>
          </div>

          <Para style={{ marginTop: '1.5rem' }}>
            这段话的杀伤力在于：
            <strong style={{color:'#2D2416'}}>它把"还没做就开始想"这件事的荒谬感讲透了</strong>。
            一个素材库为零的人，要在大脑里推导出最优路径，本身就是不可能的事。
            你的"思考"只是在<strong style={{color:'#C9A227'}}>用更不可知的方式</strong>，
            把不可知的世界包装得更复杂、更严肃、更恐怖。
          </Para>

          <SubH>三个阶段：0 / 1 / 10 / 100</SubH>
          <Para>
            树林把成长拆成几段，每一段需要的帮助完全不同：
          </Para>
          <div style={{ marginBottom: '1.5rem' }}>
            {[
              { n:'0 → 1', label:'心力阶段', desc:'最难、最贵。靠强制做、公开做、第零次硬走出来。这一阶段里思考没用，动作才有用。' },
              { n:'1 → 10', label:'自走阶段', desc:'有了第一次经验之后，你能自己走。这一段大部分人能走，主要靠重复 + 反思。' },
              { n:'10 → 100', label:'放大阶段', desc:'差不多到月入二三十万的位置。这时候反而是心智、IP、生活平衡这些"软的东西"决定上限。' },
            ].map(s => (
              <div key={s.n}
                    style={{ display: 'flex', gap: '1.2rem', padding: '1rem 0',
                              borderBottom: '1px dashed rgba(201,162,39,0.25)',
                              alignItems: 'flex-start' }}>
                <span style={{ color: '#C9A227', fontFamily: "'Playfair Display',serif",
                                fontSize: '1rem', fontWeight: 600,
                                letterSpacing: '0.1em', minWidth: 70, marginTop: '0.1rem' }}>
                  {s.n}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#2D2416', fontSize: '1rem', fontWeight: 500,
                                marginBottom: '0.3rem' }}>{s.label}</p>
                  <p style={{ color: 'rgba(45,36,22,0.7)', fontSize: '0.9rem',
                                lineHeight: 1.85 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Para>
            这里面最贵的就是 <strong style={{color:'#C9A227'}}>0 到 1</strong>。
            为什么贵？因为前面没有任何经验做支撑，你完全是裸的。
            裸的状态下要走出来，需要的不是更多的思考——是更多的<strong>意志</strong>。
          </Para>

          <SubH id="ch2-past">既往才能开来</SubH>
          <Para>
            走完 0 到 1 之后，下一步还有一个很容易被忽视的事——
            <strong>知道自己怎么好的</strong>。
          </Para>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              如果你今天不错了，<br/>
              你<strong>不知道你的不错</strong><br/>
              到底来源于什么——<br/>
              明天你的这个不错<br/>
              就会<strong style={{color:'#C9A227', fontStyle:'normal'}}>非常脆弱</strong>。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论既往才能开来
            </p>
          </div>
          <Para style={{ marginTop: '1.5rem' }}>
            为什么脆弱？因为下一个阶段，你的货币会更充分、社交会变多、不良诱惑会变多。
            你前面积攒的好习惯，如果你不知道它是怎么形成的——
            <strong style={{color:'#c0392b'}}>你不会守护它，不会守卫它，不会捍卫它</strong>。
          </Para>
          <Para>
            所以从 0 到 1 走完之后，第二件该做的事，是
            <strong style={{color:'#C9A227'}}>把"我怎么走过来的"用语言写下来</strong>——
            结构化你能结构化的，剩下的归为命，归为运。
          </Para>

          {/* 意志测试 — 完美匹配"0 到 1 也只需要这样的意志" */}
          <Para>
            <strong>0 到 1 也只需要这样的意志</strong>——
            连"按住 3 秒"都需要一整面注意力的聚焦：
          </Para>

          <WillpowerTest />

          <ChapterClose>
            想是没结果的。0 到 1 是最贵的。<br/>
            <span style={{color:'#C9A227'}}>不知道自己怎么好的，下一阶段就守不住——既往才能开来。</span>
          </ChapterClose>
        </div>

        {/* ── 行动卡 ── */}
        <ActionCard
          id="ch01"
          title="挑出你今天就做的「第一件 0 到 1」"
          prompts={[
            '你想了一百遍但一次都没做过的那件事——挑一件，今天就做。',
            '不要找完美的那件，找最小的那件。先做了，再说。',
          ]}
          chipsLabel="今天就先做的 0 到 1（可多选）"
          chips={[
            '发一条朋友圈',
            '在群里第一次发声',
            '主动搭讪一次',
            '把一个想法说出来',
            '把一个作品挂上去',
            '主动开个价',
            '报一次咨询',
            '私信一个想认识的人',
            '把脑子里的想法写成 100 字',
            '把搁置的事推进 1 步',
          ]}
          placeholder="或者写下：你想了很久但还没做的那件事……"
        />

        <ChapterNav current="ch01" onNav={onNav} />
      </div>
    </section>
  );
};


// ──────────────────────────────────────────────────────────────────────────
// Helpers for Part chapters
// ──────────────────────────────────────────────────────────────────────────
const PartHero = ({ partNum, partRoman, totalParts, title, subtitle, leadQuote, deco }) => (
  <div className="ra-chapter-bg"
       style={{ background: 'linear-gradient(135deg,#FAF8F3 0%,#F0EBE0 100%)',
                 padding: '6rem 3rem 4rem', position: 'relative' }}>
    {deco}
    <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.4em', marginBottom: '1.2rem' }}>
        PART {partRoman} · {partNum} / 叁
      </p>
      <h2 style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                    fontSize: 'clamp(2rem,4vw,3.2rem)',
                    color: '#2D2416', fontWeight: 400, marginBottom: '0.4rem', lineHeight: 1.3 }}>
        {title}
      </h2>
      <p style={{ fontSize: '1.2rem', color: '#8B6914', letterSpacing: '0.1em',
                   marginBottom: '2rem', fontStyle: 'italic' }}>
        {subtitle}
      </p>
      {leadQuote && (
        <div className="ra-quote" style={{ maxWidth: 620 }}>{leadQuote}</div>
      )}
    </div>
  </div>
);

const ChapterIntro = ({ num, en, title, lead }) => (
  <>
    <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                 marginBottom: '0.6rem' }}>第 {num} 章 · CHAPTER {en}</p>
    <h3 style={{ fontSize: '1.6rem', color: '#2D2416', letterSpacing: '0.05em',
                  fontWeight: 500, marginBottom: '0.5rem',
                  fontFamily: "'Playfair Display','Noto Serif SC',serif" }}>
      {title}
    </h3>
    {lead && (
      <p style={{ color: 'rgba(45,36,22,0.6)', fontSize: '0.9rem',
                   fontStyle: 'italic', marginBottom: '2rem' }}>
        {lead}
      </p>
    )}
  </>
);

const SubH = ({ id, children }) => (
  <h4 id={id} style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.05em',
                fontWeight: 500, marginTop: '2.5rem', marginBottom: '1rem',
                scrollMarginTop: '40px' }}>
    {children}
  </h4>
);

const Para = ({ children, style }) => (
  <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
               lineHeight: 1.95, marginBottom: '1.4rem', ...style }}>
    {children}
  </p>
);

const ChapterClose = ({ children }) => (
  <div style={{ marginTop: '3rem', padding: '1.8rem 2rem',
                  background: '#2D2416', borderLeft: '3px solid #C9A227' }}>
    <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                 marginBottom: '0.8rem' }}>本章收束</p>
    <p style={{ color: '#FAF8F3', fontSize: '1rem', lineHeight: 1.95 }}>
      {children}
    </p>
  </div>
);

const PullQuote = ({ num, label, children, attr }) => (
  <div style={{ margin: '5rem 0', padding: '4rem 2rem',
                  background: 'linear-gradient(135deg, #14100a 0%, #1a1208 100%)',
                  textAlign: 'center', position: 'relative', overflow: 'hidden',
                  borderTop: '1px solid rgba(201,162,39,0.3)',
                  borderBottom: '1px solid rgba(201,162,39,0.3)' }}>
    <div style={{ position: 'absolute', left: '1rem', top: '0.5rem',
                   color: 'rgba(201,162,39,0.4)', fontSize: '0.65rem',
                   letterSpacing: '0.3em' }}>PULL QUOTE · {num}</div>
    <div style={{ position: 'absolute', right: '1rem', bottom: '0.5rem',
                   color: 'rgba(201,162,39,0.4)', fontSize: '0.65rem',
                   letterSpacing: '0.3em' }}>{label}</div>
    <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                 color: '#FAF8F3', fontSize: 'clamp(1.4rem, 3.2vw, 2.2rem)',
                 lineHeight: 1.7, fontStyle: 'italic', maxWidth: 600, margin: '0 auto' }}>
      {children}
    </p>
    {attr && (
      <p style={{ color: 'rgba(201,162,39,0.7)', fontSize: '0.8rem',
                   letterSpacing: '0.4em', marginTop: '2rem' }}>
        — {attr}
      </p>
    )}
  </div>
);

// ── Part II · 中篇 · 身体决定你怎么看世界 ───────────────────────────────────
const Ch02Page = ({ onNav }) => {
  return (
    <section style={{ background: '#FAF8F3', minHeight: '100vh' }}>
      <PartHero partNum="贰" partRoman="II" title="身体决定你怎么看世界"
                subtitle="不是想清楚了才去做，是身体先撑得住"
                deco={<HeroDecoCh02 />}
                leadQuote={<>
                  你对这个世界的<strong style={{ color: '#2D2416' }}>恐惧、急切、内耗</strong>，<br/>
                  多半不是性格问题——<br/>
                  是<strong style={{ color: '#2D2416' }}>血糖、肌肉、睾酮</strong>的问题。
                </>} />

      <div style={{ padding: '4rem 3rem', maxWidth: 800, margin: '0 auto' }}>

        {/* CHAPTER 3 · 血糖、肌肉、睾酮 */}
        <div id="ch3-bloodsugar" style={{ scrollMarginTop: '40px' }}>
          <ChapterIntro num="三" en="THREE" title="血糖、肌肉、睾酮"
                        lead='"你血糖稳，情绪就稳。情绪稳，对世界的认识就连续。"' />

          <Para>
            上一篇讲了为什么你卡在零。这一章讲一个更朴素的问题——
            <strong style={{color:'#2D2416'}}>你卡在零，可能根本不是因为想得不够清楚，是因为身体撑不住</strong>。
            一个能量塌了的人，怎么思考都没用，怎么动员都没用。先把炭烧起来。
          </Para>

          <SubH>血糖决定情绪</SubH>
          <Para>
            树林讲了一个被严重低估的杠杆——<strong>血糖</strong>。原因很物理：
          </Para>
          <div style={{ background: '#fff', border: '1px solid rgba(201,162,39,0.3)',
                          padding: '1.5rem 2rem', marginBottom: '1.5rem' }}>
            <p style={{ color: 'rgba(45,36,22,0.85)', fontSize: '0.95rem', lineHeight: 1.95 }}>
              <strong style={{color:'#c0392b'}}>血糖一波动 → 前额叶下线 → 杏仁核接管</strong><br/>
              前额叶管理性、决策、远期规划；杏仁核管恐惧、紧张、即时反应。
              一个血糖剧烈起伏的人，前额叶忽上忽下、杏仁核反复被激活——
              <strong>边缘系统频繁警报</strong>。他自己以为是"心态问题"，
              其实身体先告诉了他：能量底子塌了。
            </p>
          </div>

          <Para>
            最简单的一个动作：<strong style={{color:'#C9A227'}}>吃饭别让米饭先冲一道口</strong>。
            血糖平稳了，情绪平稳，对世界的认识才会是连续的。
            否则你刚刚还觉得世界很美好，下一秒就觉得自己废了——
            其实只是<strong>你刚吃了一大碗白米饭</strong>。
          </Para>

          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              你<strong>血糖忽上忽下</strong>，<br/>
              你的前额叶忽上忽下，<br/>
              一会儿控制你，一会儿不控制。<br/>
              你的<strong>杏仁核</strong>就会一会儿高度敏感，<br/>
              一会儿不高度敏感——<br/>
              情绪波动肯定就大。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论血糖
            </p>
          </div>

          {/* Anecdote · 公司剪辑小伙的故事 */}
          <SubH>一个被血糖出卖的人</SubH>
          <Para style={{ color: 'rgba(45,36,22,0.85)' }}>
            树林在直播里讲了公司里一个剪辑小伙的故事——
            那天中午没吃饭，晚上 7 点才上来吃，先来一大碗米饭。
            树林一看就说："你晚上肯定很寂寞吧。"小伙惊呆——
            <strong style={{color:'#C9A227'}}>"你怎么知道我晚上寂寞？"</strong>
          </Para>
          <Para>
            这不是算命。这是一个非常物理的推理链：
            <strong>不规律饮食 → 血糖剧烈波动 → 前额叶下线 → 杏仁核接管 → 焦虑、孤独、寂寞涌上来</strong>。
            身体的运行机制比算命准得多——你以为你晚上心情不好是因为想多了，
            其实是<strong style={{color:'#c0392b'}}>你今天没好好吃饭</strong>。
          </Para>

          <SubH id="ch3-legs">练腿与睾酮</SubH>
          <Para>
            树林给那个剪辑小伙的"奖金分配建议"是——
            <strong>奖金全部报私教，而且全部练腿</strong>。
            练腿的逻辑非常具体：<strong style={{color:'#C9A227'}}>练腿 → 睾酮飙升 → 攻击性回升 → 对世界不再恐惧</strong>。
          </Para>
          <Para>
            睾酮不是只跟性欲有关，它跟你<strong>面对这个世界的姿态</strong>有关。
            睾酮高的人攻击性强、敢冒犯、敢拒绝、敢说不；
            睾酮低的人——典型是日本"平成废宅"——肌肉萎缩、神经习惯了待在家里、惯性越来越大。
          </Para>
          <Para>
            <strong>女生也要练腿。</strong>这不是男性专属的事。
            练腿的本质是把"勇气"翻译成一个具体的、物理的、可干预的指标——
            你不敢卖东西、不敢发朋友圈、不敢主动开口，本质上很多时候不是"性格内向"，
            是<strong style={{color:'#C9A227'}}>睾酮不够，攻击性不够</strong>。
            解药不在心理层面，在腿上。
          </Para>

          <SubH id="ch3-fearless">来干这个世界</SubH>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              睾酮一增加，<br/>
              你对这个世界就是<strong style={{color:'#C9A227', fontStyle:'normal'}}>来干我</strong>。<br/>
              世界都在干，<br/>
              我疯狂干、欢迎来干。<br/>
              你这个世界<strong>一点都不怕</strong>，<br/>
              你说他妈有本事就来。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论攻击性
            </p>
          </div>
          <Para style={{ marginTop: '1.5rem' }}>
            这种状态下你看待世界的方式会发生根本变化——
            <strong>几千万你不怕、几个亿你不怕、长得好看你也不怕</strong>。
            不是因为你想通了，是因为你身体里的化学物质改变了。
          </Para>
          <Para>
            而这件事的入口非常具体：
            <strong style={{color:'#C9A227'}}>去练腿、去跑步、去晒太阳、去稳定饮食</strong>。
            其他什么"心态调整""自我和解"都是慢的。
            身体上来了，心态自然就来。<strong>反过来不成立。</strong>
          </Para>

          <ChapterClose>
            你的勇气、攻击性、敢做敢卖——<br/>
            <span style={{color:'#C9A227'}}>多半是化学物质的事，不是性格的事。先把炭烧起来。</span>
          </ChapterClose>
        </div>

        {/* PULL QUOTE 02 · 论身体先于心智 */}
        <PullQuote num="02" label="论 身 体 先 于 心 智" attr="树林">
          你不是因为<strong style={{color:'#C9A227', fontStyle:'normal'}}>想清楚了</strong>才去做，<br/>
          是因为你<strong style={{color:'#C9A227', fontStyle:'normal'}}>身体撑住了</strong>，<br/>
          才想得清楚。
        </PullQuote>

        {/* CHAPTER 4 · 充分表达 = 频率 × 深度 × 领域 */}
        <div id="ch4-fully" style={{ scrollMarginTop: '40px', marginTop: '4rem' }}>
          <ChapterIntro num="四" en="FOUR" title="充分表达 = 频率 × 深度 × 领域"
                        lead='"只要你充分表达，你的认知和你的表达就不会差太远。"' />

          <Para>
            上一章讲了身体撑得住才有思考。这一章讲身体撑住之后该把能量倒在哪——
            <strong>充分表达</strong>。这是一个非常具体的、可量化的概念，不是"多说话"那种空话。
          </Para>

          <SubH id="ch4-think">想是没结果的</SubH>
          <Para>
            还在 0 的位置上想，本质上是
            <strong style={{color:'#c0392b'}}>纯粹语言的演绎，且只在你大脑里面</strong>。
            素材库为零，怎么演绎出有用的结果？
          </Para>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              想就是<strong>纯粹语言的演绎</strong>，<br/>
              且还是在你的大脑里面的<br/>
              语言的演绎。<br/>
              基于你<strong>仅有的</strong><br/>
              对世界的认识和理解。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论纯想
            </p>
          </div>

          <SubH id="ch4-three">充分表达的三个维度</SubH>
          <Para>
            "表达" 这个词如果只停在 "多说一点话"，没意义。树林给了三个具体的维度——
          </Para>
          <div style={{ background: '#fff', border: '1px solid rgba(201,162,39,0.3)',
                          padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                         marginBottom: '1rem' }}>充分表达 = 三件事同时成立</p>
            <p style={{ fontFamily: "'Playfair Display',serif",
                         color: '#2D2416', fontSize: 'clamp(1.5rem,3vw,2.2rem)',
                         letterSpacing: '0.05em', lineHeight: 1.5, fontStyle: 'italic' }}>
              <strong style={{color:'#C9A227'}}>频率</strong> ×{' '}
              <strong style={{color:'#C9A227'}}>深度</strong> ×{' '}
              <strong style={{color:'#C9A227'}}>领域</strong>
            </p>
            <p style={{ color: 'rgba(45,36,22,0.6)', fontSize: '0.85rem',
                         marginTop: '1rem', lineHeight: 1.8 }}>
              频率高 · 内容深 · 领域广
            </p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            {[
              { n:'01', label:'频率（够多）', desc:'每天都输出，不能是想到了再发。每天 = 让肌肉记住，不让恐惧重新长回来。' },
              { n:'02', label:'深度（够深）', desc:'内容不能停在"我今天吃了什么"。要触到你真实的判断、真实的观点。' },
              { n:'03', label:'领域（够广）', desc:'恋爱、商业、AI、写作、健身——你对什么有真兴趣就讲什么，但不要只讲一个。' },
            ].map(item => (
              <div key={item.n}
                    style={{ background: '#fff', border: '1px solid rgba(45,36,22,0.1)',
                              padding: '1.2rem 1.5rem', borderTop: '3px solid #C9A227',
                              marginBottom: '0.8rem' }}>
                <span style={{ color: '#C9A227', fontFamily: "'Playfair Display',serif",
                                fontSize: '0.75rem', letterSpacing: '0.2em' }}>
                  {item.n}
                </span>
                <p style={{ color: '#2D2416', fontSize: '1.05rem', fontWeight: 500,
                              marginTop: '0.4rem', marginBottom: '0.3rem' }}>
                  {item.label}
                </p>
                <p style={{ color: 'rgba(45,36,22,0.7)', fontSize: '0.9rem',
                              lineHeight: 1.85 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <Para>
            <strong style={{color:'#C9A227'}}>三件事同时成立</strong>，
            你的认知和你的表达就不会差太远。
            "蠢"在这种维度下不是观点向左，是
            <strong>认知和表达之间错位太大</strong>——
            你脑子里其实有东西，但表达出来的全是糊的。
          </Para>

          <SubH>充分接触，找到擅长的事</SubH>
          <Para>
            充分表达的另一面——是<strong>充分接触</strong>。
            你要找到自己擅长的事（不是热爱，是擅长——做起来就感觉远超别人），
            前提是大量接触、跟真实世界强烈碰撞。
          </Para>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              <strong>找擅长的事情</strong>。<br/>
              严格意义上热爱都不是最重要的——<br/>
              你<strong>擅长</strong>，<br/>
              你有天赋、你一做做起来<br/>
              就感觉远超别人的。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论擅长
            </p>
          </div>
          <Para style={{ marginTop: '1.5rem' }}>
            擅长是被发现的，不是被规划的。
            你只能在<strong style={{color:'#C9A227'}}>大量真实接触</strong>之后，
            发现"咦，这件事别人做要 5 个小时，我 1 小时就做完了"——
            那才是擅长。坐在家里想你擅长什么，永远想不出来。
          </Para>

          <ChapterClose>
            充分表达 = 频率 × 深度 × 领域。<br/>
            <span style={{color:'#C9A227'}}>三个都做到，你的认知和表达就不会差太远；擅长才会浮出来。</span>
          </ChapterClose>
        </div>

        {/* ── 行动卡 ── */}
        <ActionCard
          id="ch02"
          title="今晚 / 明天就做的「身体上能量」的事"
          prompts={[
            '能量先于认知。先把身体撑住，思考才有意义。',
            '挑一件你今晚 / 明天起就能做、能让你能量上来的事。',
          ]}
          chipsLabel="一件能让你「炭烧起来」的事（可多选）"
          chips={[
            '今晚 11 点前睡',
            '明早晒 10 分钟太阳',
            '深蹲 20 个',
            '私教课 · 全部练腿',
            '吃饭前别先冲一碗白米',
            '断糖 1 天',
            '连续 3 天每天写 100 字发出去',
            '主动开口表达一次观点',
            '在群里发一条没发过的看法',
            '不修不删 · 直接发',
          ]}
          placeholder="或者写下你今晚 / 明天具体要做的那一件事……"
        />

        <ChapterNav current="ch02" onNav={onNav} />
      </div>
    </section>
  );
};

// ── Part III · 终篇 · AI 时代与陌生人 ──────────────────────────────────────
const Ch03Page = ({ onNav }) => {
  return (
    <section style={{ background: '#FAF8F3', minHeight: '100vh' }}>
      <PartHero partNum="叁" partRoman="III" title="AI 时代与陌生人"
                subtitle="最菜的一届，可能是最好的一届"
                deco={<HeroDecoCh03 />}
                leadQuote={<>
                  IP 的本质是<strong style={{ color: '#2D2416' }}>信息、能量、情绪</strong>自高向低流动。<br/>
                  陌生人是你交易最高频的人群。<br/>
                  AI 时代的成长斜率，第一次让<strong style={{ color: '#2D2416' }}>"最菜的一届"</strong>
                  有机会变成"最好的一届"。
                </>} />

      <div style={{ padding: '4rem 3rem', maxWidth: 800, margin: '0 auto' }}>

        {/* CHAPTER 5 · IP 是信息、能量、情绪自高向低流动 */}
        <div id="ch5-strangers" style={{ scrollMarginTop: '40px' }}>
          <ChapterIntro num="五" en="FIVE" title="IP 是自高向低的流动"
                        lead='"IP 的本质是什么？信息、能量、情绪——自高向低流动。"' />

          <Para>
            前两篇讲了"你为什么卡在零""怎么把身体撑起来"。这一章讲：
            撑起来之后，你输出的东西到底在干什么——
            <strong style={{color:'#2D2416'}}>它在跟陌生人之间做一种自高向低的流动</strong>。
          </Para>

          <SubH>陌生人是最高频的交易人群</SubH>
          <Para>
            一个反直觉的事实——
            <strong>赚钱的关系往往不是熟人，是陌生人</strong>。
            熟人之间所有的钱都裹在情感、人情、不好意思里，不好变现。
            陌生人之间是最简洁的："我提供什么、你付多少钱"。
          </Para>
          <Para>
            做 IP 的本质不是"做内容"——是
            <strong style={{color:'#C9A227'}}>批量地、规模化地跟陌生人建立联系</strong>。
            这个能力，今天比任何一项专业技能都贵。
            因为它直接通向赚钱、影响力、社会网络。
          </Para>

          <SubH id="ch5-blackbox">写作 = 把黑箱翻译给世界</SubH>
          <Para>
            那"建立联系"是怎么发生的？通过你输出的东西——文字、视频、声音。
            树林讲了一个非常本质的视角——
            <strong>你对所有人，本质上都是一个黑箱</strong>。
          </Para>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              你看不到我的<strong>裸体</strong>，<br/>
              更不要说看到我的<strong>思想</strong>，<br/>
              看到我的器官之间是怎么运作的。<br/>
              但你怎么去理解我？<br/>
              你通过了我<strong style={{color:'#C9A227', fontStyle:'normal'}}>输出的 token</strong>。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论黑箱
            </p>
          </div>
          <Para style={{ marginTop: '1.5rem' }}>
            你输出的 token 就是别人理解你的全部入口。
            你不输出，别人对你的理解就是 0；你输出的 token 越多、越深、越真——
            别人理解你的颗粒度才会越细。
          </Para>
          <Para>
            所以"做 IP"用一句话翻译就是——
            <strong style={{color:'#C9A227'}}>训练你这个黑箱往外翻译的能力</strong>。
            这是为什么哪怕没有任何结果，每天公开输出的事也要做下去。
            你在训练的不是"结果"，是这套翻译能力本身。
          </Para>

          <SubH id="ch5-flow">三种流动 · 信息、能量、情绪</SubH>
          <Para>
            那这个"翻译"具体在传递什么？树林给了三个东西——
          </Para>
          <div style={{ background: '#fff', border: '1px solid rgba(201,162,39,0.3)',
                          padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                         marginBottom: '1rem' }}>IP 的本质</p>
            <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                         color: '#2D2416', fontSize: 'clamp(1.3rem,2.5vw,1.8rem)',
                         letterSpacing: '0.05em', lineHeight: 1.5 }}>
              <strong style={{color:'#C9A227'}}>信息</strong> ·{' '}
              <strong style={{color:'#C9A227'}}>能量</strong> ·{' '}
              <strong style={{color:'#C9A227'}}>情绪</strong>
            </p>
            <p style={{ color: 'rgba(45,36,22,0.65)', fontSize: '0.88rem',
                         marginTop: '1rem', lineHeight: 1.9, fontStyle: 'italic' }}>
              自高向低流动
            </p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            {[
              { n:'01', label:'信息流动',
                desc:'你知道的事别人不知道。比如"血糖波动 → 前额叶下线 → 杏仁核激活" —— 你知道这个机制，你周围的人不知道，信息就从你流向他们。' },
              { n:'02', label:'能量流动',
                desc:'你笃定的事会传给观众。坚定地相信"确定性"本身就是一种能量。这件事本身没办法用信息传递，只能用一种"你看到我做"的方式传递。' },
              { n:'03', label:'情绪流动',
                desc:'有时情绪在能量里，有时不在。一个稳定、平静、不焦虑的人和一个焦虑外显的人，传递的情绪完全不同。但情绪的流动也是从高向低的。' },
            ].map(item => (
              <div key={item.n}
                    style={{ background: '#fff', border: '1px solid rgba(45,36,22,0.1)',
                              padding: '1.2rem 1.5rem', borderTop: '3px solid #C9A227',
                              marginBottom: '0.8rem' }}>
                <span style={{ color: '#C9A227', fontFamily: "'Playfair Display',serif",
                                fontSize: '0.75rem', letterSpacing: '0.2em' }}>
                  {item.n}
                </span>
                <p style={{ color: '#2D2416', fontSize: '1.05rem', fontWeight: 500,
                              marginTop: '0.4rem', marginBottom: '0.3rem' }}>
                  {item.label}
                </p>
                <p style={{ color: 'rgba(45,36,22,0.7)', fontSize: '0.9rem',
                              lineHeight: 1.85 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <SubH id="ch5-conviction">笃定本身就是能量</SubH>
          <Para>
            这一点容易被低估——
            <strong>"笃定地相信确定性"本身就是一种能量</strong>。
            观众听一场直播，他不只在拿信息，更多时候他是在拿
            <strong style={{color:'#C9A227'}}>"这个人居然是这么相信的"</strong>这种感觉。
            这种感觉在他能量低的时候，会变成他自己的能量。
          </Para>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              你也在从我的这种<strong>笃定</strong>里面<br/>
              获得一些能量——<br/>
              坚定、确定性、相信。<br/>
              这个能量，<strong style={{color:'#C9A227', fontStyle:'normal'}}>非常的重要</strong>。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论笃定
            </p>
          </div>

          <ChapterClose>
            做 IP 不是"做内容"——是训练你这个黑箱往外翻译的能力。<br/>
            <span style={{color:'#C9A227'}}>翻译过去的不是文字，是信息、能量、情绪三种流动。</span>
          </ChapterClose>
        </div>

        {/* PULL QUOTE 03 · 论 AI 与最菜的一届 */}
        <PullQuote num="03" label="论 时 间 差" attr="树林">
          严格意义上，<br/>
          你们应该是<strong style={{color:'#C9A227', fontStyle:'normal'}}>最菜的一届</strong>。<br/>
          但因为<strong style={{color:'#C9A227', fontStyle:'normal'}}>AI</strong>，<br/>
          你们可能<br/>
          会变成最好的一届。
        </PullQuote>

        {/* CHAPTER 6 · 最菜的一届，可能是最好的一届 */}
        <div id="ch6-worst" style={{ scrollMarginTop: '40px', marginTop: '4rem' }}>
          <ChapterIntro num="六" en="SIX" title="最菜的一届，可能是最好的一届"
                        lead='"按理说你们是漏网之鱼里最菜的——但 AI 时代，斜率会让事情完全不一样。"' />

          <Para>
            上一章讲了 IP 是怎么流动的。这一章讲一个反转——
            <strong style={{color:'#2D2416'}}>同样是新人入场，AI 时代你的成长斜率，跟前几届完全不在一个量级</strong>。
          </Para>

          <SubH>最菜的一届</SubH>
          <Para>
            树林说话非常直——
            <strong>"严格意义上你们应该是最菜的一届。"</strong>
            前面三四届的赢家已经把"漏网之鱼"摘走了。今天还在 0 状态没赚到钱、
            听了一堆课还没结果的人——按经验来讲，这就是最不容易跑出来的那一波。
          </Para>
          <Para>
            但他紧接着给了一个反转：
            <strong style={{color:'#C9A227'}}>"基于我看到的你们的斜率——你们应该会成为最好的一届。"</strong>
          </Para>

          <SubH id="ch6-slope">成长斜率</SubH>
          <Para>
            斜率这个词在这里非常具体。树林给了一个对比：
          </Para>
          <div style={{ background: '#fff', border: '1px solid rgba(201,162,39,0.3)',
                          padding: '2rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                         marginBottom: '1rem', textAlign: 'center' }}>成长斜率 · 时代差异</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem',
                            textAlign: 'center' }}>
              <div style={{ padding: '1rem', background: 'rgba(45,36,22,0.04)',
                              border: '1px dashed rgba(45,36,22,0.15)' }}>
                <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.7rem',
                              letterSpacing: '0.25em', marginBottom: '0.6rem' }}>IP 时代</p>
                <p style={{ fontFamily: "'Playfair Display',serif",
                              color: '#2D2416', fontSize: '2.2rem', fontWeight: 700,
                              lineHeight: 1.2 }}>15°</p>
                <p style={{ color: 'rgba(45,36,22,0.55)', fontSize: '0.78rem',
                              marginTop: '0.4rem' }}>螺旋上升 · 慢</p>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(201,162,39,0.08)',
                              border: '1px solid rgba(201,162,39,0.4)' }}>
                <p style={{ color: '#8B6914', fontSize: '0.7rem',
                              letterSpacing: '0.25em', marginBottom: '0.6rem' }}>AI 时代</p>
                <p style={{ fontFamily: "'Playfair Display',serif",
                              color: '#C9A227', fontSize: '2.2rem', fontWeight: 700,
                              lineHeight: 1.2 }}>陡峭</p>
                <p style={{ color: '#8B6914', fontSize: '0.78rem',
                              marginTop: '0.4rem' }}>2-3 天就能看到</p>
              </div>
            </div>
          </div>
          <Para>
            "信息差"这个事，在 AI 之前是一个稀缺资源——你在某个领域有信息差就能吃上饭。
            但 AI 把信息差<strong style={{color:'#c0392b'}}>压扁了</strong>。
            这听起来是坏消息，但反过来——
            <strong style={{color:'#C9A227'}}>你这个新人，第一次有机会跨过老兵的护城河</strong>。
            因为他们多年积累的信息差，AI 一夜之间替你补上了。
          </Para>

          <SubH>10 小时门槛</SubH>
          <Para>
            树林给了一个非常具体的最低门槛——
            <strong>每天使用 AI 超过 10 小时</strong>。
            不是让你"学 AI"，是让你<strong style={{color:'#C9A227'}}>住在 AI 里面</strong>。
            写、问、复盘、规划、起草、推演——把所有"语言性的工作"都丢给它一起做。
          </Para>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              这是一个<strong>时间差</strong>。<br/>
              等到每个人都<br/>
              充分跟 AI 聊天了，<br/>
              这个智能的<strong style={{color:'#C9A227', fontStyle:'normal'}}>信息差就没有了</strong>。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论 AI 时间差
            </p>
          </div>
          <Para style={{ marginTop: '1.5rem' }}>
            所以这件事的紧迫性不是"AI 会取代你"——是
            <strong style={{color:'#c0392b'}}>"还没用上 AI 的人正在被用上 AI 的人甩开"</strong>。
            这个甩开的速度比任何一个上一代技术（互联网、移动互联网）都快。
          </Para>

          {/* AI 成长斜率可视化器 */}
          <CompoundVisualizer />

          <SubH id="ch6-best">也可能是最好的一届</SubH>
          <Para>
            为什么"最菜的一届"反而可能成为"最好的一届"？
            因为前几届的人已经被旧的范式塑形了——
            <strong>他们脑子里有一套"我应该怎么做 IP"的肌肉记忆</strong>。
            AI 时代来了，他们要先把这套肌肉记忆推倒再重来。
          </Para>
          <Para>
            而你，<strong style={{color:'#C9A227'}}>因为是白纸，反而没有要推倒的旧东西</strong>。
            从第一天起就跟 AI 一起长——你的成长曲线不是在前人的肩膀上走，
            是直接换了个坐标系。
          </Para>

          <ChapterClose>
            最菜不是终局，是起点。<br/>
            <span style={{color:'#C9A227'}}>AI 把信息差压扁了，"白纸"第一次成了优势。每天 10 小时——别犹豫。</span>
          </ChapterClose>
        </div>

        {/* ── 行动卡 ── */}
        <ActionCard
          id="ch03"
          title="本周 / 本月就做的「跟陌生人 + AI」的事"
          prompts={[
            'IP 是跟陌生人建立联系。AI 是这个时代的杠杆。两件事合起来 = 你的护城河。',
            '挑一件你这周 / 这月就能做、能让"陌生人 + AI"复合起来的事。',
          ]}
          chipsLabel="一件提升你「黑箱翻译能力」的事（可多选）"
          chips={[
            '今天起每天用 AI 超过 4 小时',
            '每天发一条公开输出',
            '把你的判断写成 500 字发出去',
            '把作品挂上链接',
            '给陌生人主动报一次价',
            '给一个垂类做 7 天日更',
            '把昨天用 AI 学到的东西复述给一个人',
            '私信一个想认识的陌生人',
            '用 AI 把一个旧想法写完',
            '把"想了一百遍"的那件事 · 直接发',
          ]}
          placeholder="或者写下你这周准备做的那件事……"
        />

        <ChapterNav current="ch03" onNav={onNav} />
      </div>
    </section>
  );
};

// ── Outro ─────────────────────────────────────────────────────────────────────
const OutroPage = ({ onNav }) => {
  // 金句按 7 主题分组（4.26 讲话内容）
  const quoteGroups = [
    { theme: '关于第零次的恐惧', color: '#C9A227', quotes: [
      '所有不过如此的事情，在你第零次的时候会被想象得无限恐怖。',
      '搭讪、第一次演讲、第一次卖东西、第一次发表看法——恐惧只在做之前存在。',
      '想十遍想一百遍，恐惧不会变小一丝；做一次，恐惧自己就消失了。',
      '公开输出，是用强制性把恐惧拆掉。',
      '你不做，恐惧只会变大；你做了，"不过如此"四个字才会出现。',
    ]},
    { theme: '关于 0 到 1 是最贵的', color: '#B8860B', quotes: [
      '从 0 到 1 是最贵的——只有先有了 0 到 1 的经验，思考才有意义。',
      '想就是纯粹语言的演绎，且只在你的大脑里面。',
      '基于你仅有的对世界的认识和理解，你要去想到一个完美的路径——不可能。',
      '0 到 1 不是思考问题，是意志问题。',
      '一个 IP 还没做过的人，不停想象做出来一个 IP 是什么样——这是内耗。',
      '0 到 1 卡住了，所有再多的思考都是用更不可知的方式包装不可知。',
    ]},
    { theme: '关于既往才能开来', color: '#8B6914', quotes: [
      '你不知道你的不错来源于什么，明天你的这个不错就会非常脆弱。',
      '货币更充分了、社交变多了、不良诱惑就变多了——你前面积攒的好习惯就会被瓦解。',
      '你不知道自己怎么好的，就不会守护它、不会守卫它、不会捍卫它。',
      '结构化你能结构化的，剩下的归为命，归为运。',
    ]},
    { theme: '关于身体决定情绪', color: '#6B4F12', quotes: [
      '血糖一波动，前额叶就下线；前额叶下线，杏仁核就接管。',
      '吃饭别让米饭先冲一道口——血糖平稳，情绪才平稳。',
      '不规律饮食 → 血糖剧烈波动 → 寂寞、焦虑、孤独自动涌上来。',
      '你晚上情绪不好，不是因为想多了——是你今天没好好吃饭。',
    ]},
    { theme: '关于练腿与睾酮', color: '#5a4020', quotes: [
      '不敢卖东西？兄弟，你需要深蹲。',
      '不敢发朋友圈？兄弟，你需要深蹲。',
      '女生也要练腿。',
      '睾酮一增加，你对这个世界就是来干我。',
      '几千万你不怕，几个亿你不怕，长得好看你也不怕。',
      '不是因为你想清楚了才行动——是因为你身体撑住了，才想得清楚。',
    ]},
    { theme: '关于充分表达', color: '#4A3A0A', quotes: [
      '充分表达 = 频率 × 深度 × 领域。',
      '只要你充分表达，你的认知和你的表达就不会差太远。',
      '"蠢"不是观点向左，是认知和表达之间错位太大。',
      '找擅长的事，不是热爱——你做起来感觉远超别人的。',
      '擅长是被发现的，不是被规划的。',
      '坐在家里想你擅长什么，永远想不出来。',
    ]},
    { theme: '关于 IP 与陌生人', color: '#3a2e0e', quotes: [
      'IP 的本质：信息、能量、情绪自高向低流动。',
      '你输出的 token 是别人理解你的全部入口。',
      '做 IP 不是"做内容"——是训练你这个黑箱往外翻译的能力。',
      '陌生人是你交易最高频的人群——熟人之间的钱裹在情感里不好赚。',
      '观众听你直播，不只在拿信息——更在拿"这个人居然是这么相信的"那种感觉。',
      '坚定地相信确定性，本身就是一种能量。',
    ]},
    { theme: '关于 AI 时代的最菜一届', color: '#2D2416', quotes: [
      '严格意义上你们应该是最菜的一届——但 AI 时代，斜率会让事情完全不一样。',
      'IP 时代成长斜率 15 度算很好；AI 时代是陡峭，2-3 天就能看到。',
      '每天用 AI 超过 10 小时——别犹豫。',
      '等到每个人都充分跟 AI 聊天了，这个智能的信息差就没有了。',
      '前几届的人脑子里有"我应该怎么做 IP"的肌肉记忆——你是白纸，反而是优势。',
      '想了一百遍，不如先做一次。',
    ]},
  ];

  const totalQuotes = quoteGroups.reduce((s, g) => s + g.quotes.length, 0);

  // 用户在三张行动卡上的痕迹
  const [traces, setTraces] = useState([]);
  useEffect(() => {
    const found = [];
    ['ch01','ch02','ch03'].forEach(id => {
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
    ch01: '上篇 · 你今天就做的第一件 0 到 1',
    ch02: '中篇 · 你今晚 / 明天上能量的事',
    ch03: '终篇 · 你这周的「陌生人 + AI」',
  };

  return (
    <section style={{ minHeight: '100vh', background: '#140E06', color: '#FAF8F3',
                       position: 'relative', overflow: 'hidden' }}>
      {/* Big atmospheric glow */}
      <div style={{ position: 'absolute', inset: 0,
                     background: 'radial-gradient(ellipse at 50% 20%,rgba(201,162,39,0.12) 0%,transparent 50%)',
                     pointerEvents: 'none' }} />
      {/* Decorative giant glyph */}
      <div style={{ position: 'absolute', right: '-3rem', bottom: '-5rem',
                     fontFamily: "'Playfair Display','Noto Serif SC',serif",
                     fontSize: 'clamp(20rem,40vw,40rem)',
                     color: 'rgba(201,162,39,0.04)', lineHeight: 1, fontWeight: 700,
                     pointerEvents: 'none', userSelect: 'none' }}>
        先
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1,
                     padding: '6rem 3rem 6rem' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <p style={{ color: 'rgba(201,162,39,0.5)', fontSize: '0.7rem',
                       letterSpacing: '0.5em', marginBottom: '2rem' }}>
            — APPENDIX · 附录 —
          </p>
          <h2 style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                        fontSize: 'clamp(2.2rem,5vw,3.6rem)', color: '#FAF8F3',
                        fontWeight: 400, marginBottom: '1rem', lineHeight: 1.3 }}>
            金句索引 · 后记
          </h2>
          <p style={{ color: 'rgba(201,162,39,0.7)', fontSize: 'clamp(0.95rem,1.5vw,1.1rem)',
                       letterSpacing: '0.15em', fontStyle: 'italic' }}>
            {totalQuotes} 条原话 · 8 个主题 · 给那些只想翻金句的人
          </p>
        </div>

        {/* THE CORE SENTENCE */}
        <div style={{ borderTop: '1px solid rgba(201,162,39,0.2)',
                       borderBottom: '1px solid rgba(201,162,39,0.2)',
                       padding: '4rem 0', marginBottom: '5rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(250,248,243,0.4)', fontSize: '0.7rem',
                       letterSpacing: '0.4em', marginBottom: '2.5rem' }}>
            THE CORE SENTENCE
          </p>
          <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                       color: '#FAF8F3', fontSize: 'clamp(1.4rem,3.2vw,2.4rem)',
                       lineHeight: 1.7, fontWeight: 400, marginBottom: '0.6rem' }}>
            想了一百遍，
          </p>
          <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                       color: '#C9A227', fontSize: 'clamp(1.4rem,3.2vw,2.4rem)',
                       lineHeight: 1.7, fontWeight: 400, fontStyle: 'italic' }}>
            不如先做一次。
          </p>
        </div>

        {/* QUOTE INDEX — grouped by theme */}
        <div style={{ marginBottom: '5rem' }}>
          <p style={{ color: 'rgba(201,162,39,0.5)', fontSize: '0.7rem',
                       letterSpacing: '0.4em', marginBottom: '2rem', textAlign: 'center' }}>
            QUOTE INDEX · {totalQuotes} 条原话
          </p>
          {quoteGroups.map((group, gi) => (
            <div key={gi} style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem',
                              marginBottom: '1.5rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px',
                                background: '#C9A227', borderRadius: '50%',
                                boxShadow: '0 0 8px rgba(201,162,39,0.6)' }} />
                <h3 style={{ color: '#C9A227', fontSize: '0.95rem',
                              letterSpacing: '0.2em', fontWeight: 500 }}>
                  ❶ · {group.theme}
                </h3>
                <span style={{ color: 'rgba(201,162,39,0.4)', fontSize: '0.7rem',
                                letterSpacing: '0.15em', marginLeft: 'auto' }}>
                  {group.quotes.length} 条
                </span>
              </div>
              {group.quotes.map((q, qi) => (
                <div key={qi}
                      style={{ display: 'flex', gap: '1rem', padding: '0.8rem 0',
                                borderBottom: '1px solid rgba(201,162,39,0.06)',
                                alignItems: 'flex-start' }}>
                  <span style={{ color: 'rgba(201,162,39,0.4)', fontSize: '0.7rem',
                                  fontFamily: "'Playfair Display',serif",
                                  marginTop: '0.3rem', flexShrink: 0, minWidth: 28 }}>
                    /
                  </span>
                  <p style={{ color: 'rgba(250,248,243,0.78)', fontSize: '0.95rem',
                                lineHeight: 1.9, flex: 1 }}>
                    {q}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* YOUR TRACES */}
        <div style={{ marginBottom: '5rem', padding: '3rem 2rem',
                       border: '1px solid rgba(201,162,39,0.2)',
                       background: 'rgba(201,162,39,0.03)' }}>
          <p style={{ color: 'rgba(201,162,39,0.6)', fontSize: '0.7rem',
                       letterSpacing: '0.4em', marginBottom: '0.5rem', textAlign: 'center' }}>
            YOUR TRACES · 你的痕迹
          </p>
          <h3 style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                        fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)', textAlign: 'center',
                        color: '#FAF8F3', fontWeight: 400, marginBottom: '0.5rem' }}>
            你在这本小书里写下的东西
          </h3>
          <p style={{ textAlign: 'center', color: 'rgba(250,248,243,0.5)',
                       fontSize: '0.85rem', marginBottom: '2.5rem',
                       fontStyle: 'italic' }}>
            想了一百遍，不如先做一次——<br />
            你刚刚为自己写下的那几件事，就是 0 到 1 的入口。
          </p>

          {traces.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ color: 'rgba(250,248,243,0.4)', fontSize: '0.9rem',
                           lineHeight: 1.9, marginBottom: '1.5rem' }}>
                你还没有在任何一张行动卡上写下东西。<br />
                这本小书的真正价值，就在你动手写下来的那一刻。
              </p>
              <button onClick={() => onNav('ch01')}
                      style={{ background: 'transparent', border: '1px solid rgba(201,162,39,0.5)',
                                color: '#C9A227', padding: '0.7rem 2rem', cursor: 'pointer',
                                fontFamily: 'inherit', fontSize: '0.85rem', letterSpacing: '0.2em' }}>
                回到上篇 · 先写下第一件 0 到 1
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
                — 这些是你从 0 走出来的脚印 —
              </p>
            </>
          )}
        </div>

        <CommitmentCard />

        {/* EDITOR'S POSTSCRIPT */}
        <div style={{ marginTop: '5rem', padding: '3rem 2rem',
                        borderTop: '1px solid rgba(201,162,39,0.2)' }}>
          <p style={{ color: 'rgba(201,162,39,0.5)', fontSize: '0.7rem',
                       letterSpacing: '0.4em', marginBottom: '1.5rem', textAlign: 'center' }}>
            EDITOR'S POSTSCRIPT · 编 者 后 记
          </p>
          <h3 style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                        fontSize: 'clamp(1.3rem,2.4vw,1.6rem)', textAlign: 'center',
                        color: '#FAF8F3', fontWeight: 400, marginBottom: '2.5rem' }}>
            关于这段讲话，<br/>我最想留给你的一件事。
          </h3>
          <p style={{ color: 'rgba(250,248,243,0.78)', fontSize: '0.95rem',
                       lineHeight: 2, marginBottom: '1.4rem' }}>
            整理这份讲话稿大约花了一晚上的时间。原始素材只有 19 分钟、6000 字，
            体量不到上一本《年轻人，就是要莽》的三十分之一——但读完之后我反而觉得，
            <strong style={{color:'#C9A227'}}>它讲的事情更朴素，也更难做</strong>。
          </p>
          <p style={{ color: 'rgba(250,248,243,0.78)', fontSize: '0.95rem',
                       lineHeight: 2, marginBottom: '1.4rem' }}>
            上一本是讲"道理"——P=F/S 的压强公式、DMN 的运行机制、注意力的三重劫持。
            这一本几乎没有华丽的术语。它只在反复说一件事——
            <strong style={{color:'#C9A227'}}>想得再多都不算数，先做一次才算数</strong>。
          </p>
          <p style={{ color: 'rgba(250,248,243,0.78)', fontSize: '0.95rem',
                       lineHeight: 2, marginBottom: '2.5rem' }}>
            这件事最难的地方在于：它没办法被任何金句、任何理论、任何 AI 帮你做完。
            你只能<strong>自己走一步</strong>。所以如果你只从这本小书里拿走一件事，
            我希望它不是 IP 的三种流动，也不是充分表达的三个维度——
            <strong>我希望是这一句</strong>——
          </p>
          <div style={{ padding: '2rem', background: 'rgba(201,162,39,0.05)',
                          borderLeft: '3px solid #C9A227', marginBottom: '2rem' }}>
            <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                         color: '#FAF8F3', fontSize: 'clamp(1.2rem,2.4vw,1.6rem)',
                         lineHeight: 1.8, fontStyle: 'italic' }}>
              你脑子里把这件事想了一百遍——<br/>
              都不如<strong style={{color:'#C9A227', fontStyle:'normal'}}>真的去做一次</strong>。
            </p>
          </div>
          <p style={{ color: 'rgba(250,248,243,0.78)', fontSize: '0.95rem',
                       lineHeight: 2, marginBottom: '1.4rem' }}>
            这句话之所以重要，是因为它把"成长""改变""做出点什么"这种听起来宏大的命题，
            翻译成了一个极其具体的、可操作的、个人尺度的事情——
            <strong style={{color:'#C9A227'}}>把你最害怕的那件小事，今天就做一次</strong>。
            其他所有的命题——0 到 1、充分表达、IP 流动、AI 斜率——都是为这件事服务的。
          </p>
          <p style={{ color: 'rgba(250,248,243,0.78)', fontSize: '0.95rem',
                       lineHeight: 2, fontStyle: 'italic', textAlign: 'center',
                       marginTop: '2.5rem' }}>
            愿这本小书的读者，<br/>
            每一个都能<strong style={{color:'#C9A227', fontStyle:'normal'}}>从 0 走到 1</strong>。
          </p>
          <p style={{ color: 'rgba(250,248,243,0.4)', fontSize: '0.75rem',
                       letterSpacing: '0.3em', textAlign: 'center', marginTop: '2rem' }}>
            —— 整 理 者 · 2026
          </p>
        </div>

        {/* Restart button */}
        <div style={{ textAlign: 'center', margin: '4rem 0' }}>
          <button onClick={() => onNav('preface')}
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
            先做了，再说 · 第二次读会有第一次没看见的东西
          </p>
        </div>

        {/* Signature */}
        <div style={{ textAlign: 'center', paddingTop: '3rem',
                       borderTop: '1px solid rgba(201,162,39,0.1)' }}>
          <p style={{ color: 'rgba(250,248,243,0.25)', fontSize: '0.7rem',
                       letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
            ZERO · TO · ONE
          </p>
          <p style={{ color: 'rgba(250,248,243,0.2)', fontSize: '0.65rem',
                       letterSpacing: '0.2em' }}>
            HOPER 希望者文库 · Vol.002 · 2026.04.26
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

  // Dynamic browser tab title — follow current chapter
  useEffect(() => {
    const SITE = '先做了，再说';
    const titleMap = {
      preface:    '编者按',
      directory:  '目录',
      ch01:       '上篇 · 恐惧与第零次',
      ch02:       '中篇 · 身体决定你怎么看世界',
      ch03:       '终篇 · AI 时代与陌生人',
      outro:      '附录 · 金句索引 + 编者后记',
    };
    const sub = titleMap[activePage];
    document.title = sub ? `${sub} · ${SITE}` : SITE;
  }, [activePage]);

  // Anchors per chapter
  const anchorsByPage = {
    ch01: [
      { id: 'ch1-zeroth',     label: '01 · 第零次的恐惧' },
      { id: 'ch1-public',     label: '01 · 公开输出' },
      { id: 'ch2-zerotoone',  label: '02 · 0 到 1 是最贵的' },
      { id: 'ch2-imagination',label: '02 · 卡在零的想象' },
      { id: 'ch2-past',       label: '02 · 既往才能开来' },
    ],
    ch02: [
      { id: 'ch3-bloodsugar', label: '03 · 血糖决定情绪' },
      { id: 'ch3-legs',       label: '03 · 练腿与睾酮' },
      { id: 'ch3-fearless',   label: '03 · 来干这个世界' },
      { id: 'ch4-fully',      label: '04 · 充分表达' },
      { id: 'ch4-three',      label: '04 · 频率 × 深度 × 领域' },
      { id: 'ch4-think',      label: '04 · 想是没结果的' },
    ],
    ch03: [
      { id: 'ch5-strangers',  label: '05 · 陌生人是最高频' },
      { id: 'ch5-blackbox',   label: '05 · 黑箱往外翻译' },
      { id: 'ch5-flow',       label: '05 · 信息能量情绪' },
      { id: 'ch5-conviction', label: '05 · 笃定的能量' },
      { id: 'ch6-worst',      label: '06 · 最菜的一届' },
      { id: 'ch6-slope',      label: '06 · 成长斜率' },
      { id: 'ch6-best',       label: '06 · 也可能是最好的' },
    ],
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
