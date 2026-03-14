from flask import Flask, render_template_string

app = Flask(__name__)

HTML = """
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AdCreative Studio</title>
  <style>
    :root {
      --bg-dark: #171717;
      --surface: #ffffff;
      --surface-soft: #f2f1ff;
      --text: #1f1f1f;
      --muted: #666666;
      --border: #e9e9ef;
      --blue: #2d2df6;
      --blue-dark: #2323de;
      --success: #2fbf62;
      --radius-lg: 20px;
      --radius-md: 14px;
      --radius-sm: 10px;
      --shadow-soft: 0 8px 24px rgba(31, 31, 31, 0.06);
      --container: 1160px;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #ffffff);
      color: var(--text);
    }

    a { color: inherit; text-decoration: none; }

    .page-shell {
      max-width: 1240px;
      margin: 0 auto;
      padding: 26px 14px 40px;
    }

    .site {
      background: var(--surface);
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.12);
    }

    .container {
      width: min(var(--container), calc(100% - 64px));
      margin: 0 auto;
    }

    /* Header */
    .header {
      border-bottom: 1px solid #ececf2;
      background: #fff;
    }

    .header-inner {
      min-height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      font-weight: 700;
    }

    .brand-icon {
      width: 16px;
      height: 16px;
      border-radius: 999px;
      background: var(--blue);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 10px;
      line-height: 1;
      box-shadow: 0 0 0 6px rgba(45,45,246,0.08);
    }

    .nav {
      display: flex;
      align-items: center;
      gap: 28px;
      font-size: 14px;
      color: #252525;
    }

    .nav a.active {
      color: var(--blue);
      font-weight: 600;
      position: relative;
    }

    .nav a.active::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: -10px;
      height: 2px;
      background: var(--blue);
      border-radius: 999px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      border: 1px solid transparent;
      transition: 0.2s ease;
      cursor: pointer;
    }

    .btn-primary {
      background: var(--blue);
      color: #fff;
    }

    .btn-primary:hover {
      background: var(--blue-dark);
    }

    .btn-secondary {
      background: #fff;
      color: #2c2c2c;
      border-color: #cfd2ff;
    }

    .btn-secondary:hover {
      border-color: var(--blue);
      color: var(--blue);
    }

    /* Hero */
    .hero {
      background: #fff;
      padding: 54px 0 28px;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.05fr 1fr;
      gap: 42px;
      align-items: center;
    }

    .hero h1 {
      margin: 0 0 18px;
      font-size: clamp(40px, 5vw, 64px);
      line-height: 1.02;
      font-weight: 800;
      letter-spacing: -0.03em;
      max-width: 560px;
    }

    .hero h1 .blue {
      color: var(--blue);
    }

    .hero p {
      max-width: 430px;
      font-size: 16px;
      line-height: 1.65;
      color: var(--muted);
      margin: 0 0 28px;
    }

    .hero-visual {
      min-height: 380px;
      display: grid;
      grid-template-columns: 1.1fr 1fr 0.95fr;
      gap: 16px;
      align-items: end;
    }

    .creative-card {
      position: relative;
      overflow: hidden;
      border-radius: 18px;
      background: linear-gradient(180deg, #f8f9ff 0%, #eef1ff 100%);
      border: 1px solid #ececff;
      box-shadow: var(--shadow-soft);
      min-height: 330px;
    }

    .creative-card.tall { min-height: 360px; }
    .creative-card.short { min-height: 320px; }

    .creative-top-badge {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 28px;
      height: 28px;
      border-radius: 999px;
      background: rgba(255,255,255,0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      border: 1px solid #ededf6;
    }

    .mock-scene {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 78% 18%, rgba(255,255,255,0.85) 0 8%, transparent 9%),
        linear-gradient(180deg, #a8d5ff 0%, #9fd1ff 52%, #efd6b2 53%, #e4c092 100%);
    }

    .mock-scene::before,
    .mock-scene::after {
      content: "";
      position: absolute;
      background: #3fa567;
      border-radius: 999px 999px 0 0;
      width: 20px;
      height: 86px;
      top: 28px;
      transform-origin: bottom center;
      box-shadow:
        34px 6px 0 #3fa567,
        74px -8px 0 #3fa567,
        110px 2px 0 #3fa567;
    }

    .mock-scene::before {
      left: 26px;
      transform: rotate(-8deg);
    }

    .mock-scene::after {
      right: 50px;
      transform: rotate(9deg);
      box-shadow:
        30px -6px 0 #3fa567,
        66px 10px 0 #3fa567;
    }

    .shoe {
      position: absolute;
      left: 50%;
      bottom: 30px;
      transform: translateX(-50%) rotate(-6deg);
      width: 72%;
      height: 92px;
      background: linear-gradient(180deg, #f699b3 0%, #f2819d 100%);
      border-radius: 56px 24px 42px 28px;
      border: 2px solid rgba(0,0,0,0.06);
      box-shadow: inset -10px -8px 0 rgba(0,0,0,0.05);
    }

    .shoe::before {
      content: "";
      position: absolute;
      left: 10%;
      bottom: -16px;
      width: 92%;
      height: 26px;
      background: #d9aa72;
      border-radius: 28px 16px 32px 20px;
      transform: skewX(-10deg);
    }

    .shoe::after {
      content: "";
      position: absolute;
      left: 38%;
      top: 22px;
      width: 18%;
      height: 18px;
      border-top: 5px solid #d65979;
      border-bottom: 5px solid #d65979;
      transform: skewX(-20deg);
      opacity: 0.95;
    }

    .promo-card {
      background: linear-gradient(180deg, #fcfcff 0%, #f1f0ff 100%);
    }

    .promo-copy {
      position: absolute;
      top: 28px;
      left: 22px;
      font-weight: 800;
      line-height: 0.92;
      font-size: 42px;
      letter-spacing: -0.04em;
      color: #151515;
    }

    .promo-copy .orange { color: #db6116; }

    .discount-tag {
      position: absolute;
      right: 0;
      bottom: 18px;
      background: #11142a;
      color: #fff;
      padding: 10px 18px;
      font-size: 15px;
      font-weight: 800;
      border-radius: 10px 0 0 10px;
    }

    /* Section shared */
    section {
      position: relative;
    }

    .section-soft {
      background: var(--surface-soft);
    }

    .section-head {
      text-align: center;
      margin-bottom: 34px;
    }

    .section-head h2 {
      margin: 0 0 14px;
      font-size: clamp(30px, 4vw, 52px);
      line-height: 1.06;
      letter-spacing: -0.03em;
      font-weight: 800;
    }

    .section-head h2 .blue {
      color: var(--blue);
    }

    .section-head p {
      max-width: 650px;
      margin: 0 auto;
      font-size: 15px;
      line-height: 1.6;
      color: var(--muted);
    }

    .soft-glow-left::before,
    .soft-glow-right::after {
      content: "";
      position: absolute;
      width: 220px;
      height: 220px;
      filter: blur(50px);
      opacity: 0.45;
      pointer-events: none;
      background: radial-gradient(circle, rgba(130,120,255,0.4) 0%, rgba(130,120,255,0.06) 50%, transparent 70%);
    }

    .soft-glow-left::before {
      left: -40px;
      top: 30px;
    }

    .soft-glow-right::after {
      right: -20px;
      top: 50%;
      transform: translateY(-50%);
    }

    /* Steps */
    .steps {
      padding: 72px 0 78px;
    }

    .steps-grid {
      position: relative;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 34px;
    }

    .steps-grid::before {
      content: "";
      position: absolute;
      top: 106px;
      left: 16%;
      right: 16%;
      border-top: 2px dashed #d9daf1;
      z-index: 0;
    }

    .step-card {
      position: relative;
      z-index: 1;
      background: #fff;
      border: 1px solid #ececf2;
      border-radius: 16px;
      padding: 28px 28px 26px;
      box-shadow: 0 8px 18px rgba(27, 27, 27, 0.04);
      min-height: 210px;
    }

    .step-icon {
      width: 44px;
      height: 44px;
      border-radius: 999px;
      background: var(--blue);
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      margin-bottom: 20px;
    }

    .step-card h3 {
      margin: 0 0 12px;
      font-size: 24px;
      line-height: 1.18;
      letter-spacing: -0.02em;
    }

    .step-card p {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      color: var(--muted);
    }

    /* Features */
    .features {
      padding: 78px 0 62px;
      background: #fff;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
    }

    .feature-card {
      background: #fff;
      border: 1px solid #ececf2;
      border-radius: 16px;
      padding: 22px 18px 20px;
      min-height: 170px;
      box-shadow: 0 6px 14px rgba(27,27,27,0.03);
    }

    .feature-badge {
      width: 38px;
      height: 38px;
      border-radius: 999px;
      border: 2px solid var(--blue);
      color: var(--blue);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      margin-bottom: 18px;
      background: #fff;
    }

    .feature-card h3 {
      margin: 0 0 10px;
      font-size: 22px;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    .feature-card p {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      color: var(--muted);
    }

    /* Pricing */
    .pricing {
      padding: 72px 0 82px;
    }

    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(280px, 400px));
      justify-content: center;
      gap: 26px;
      margin-top: 18px;
    }

    .plan-card {
      border-radius: 18px;
      padding: 28px 28px 26px;
      min-height: 440px;
    }

    .plan-light {
      background: #fff;
      border: 2px solid #8086ff;
      color: #1e1e1e;
    }

    .plan-pro {
      background: var(--blue);
      color: #fff;
      box-shadow: 0 16px 30px rgba(45,45,246,0.24);
    }

    .plan-top {
      text-align: center;
      margin-bottom: 28px;
    }

    .plan-top .eyebrow {
      font-size: 17px;
      font-weight: 600;
      margin-bottom: 18px;
    }

    .plan-top .title {
      font-size: 42px;
      line-height: 1.05;
      font-weight: 700;
      letter-spacing: -0.03em;
    }

    .plan-divider {
      height: 1px;
      background: rgba(0,0,0,0.10);
      margin: 26px 0;
    }

    .plan-pro .plan-divider {
      background: rgba(255,255,255,0.22);
    }

    .plan-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 14px;
    }

    .plan-list li {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 15px;
      line-height: 1.5;
    }

    .check {
      flex: 0 0 auto;
      width: 18px;
      height: 18px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
    }

    .plan-light .check {
      color: var(--success);
    }

    .plan-pro .check {
      color: #fff;
    }

    .plan-btn {
      width: 100%;
      margin-top: 18px;
      padding: 14px 20px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      border: none;
      cursor: pointer;
    }

    .plan-light .plan-btn {
      background: var(--blue);
      color: #fff;
    }

    .plan-pro .plan-btn {
      background: #fff;
      color: var(--blue);
    }

    /* CTA split */
    .cta-split {
      background: #fff;
      padding: 62px 0 0;
    }

    .cta-box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 52px;
      align-items: center;
      padding-bottom: 42px;
    }

    .collage {
      display: grid;
      grid-template-columns: 0.95fr 1fr 0.82fr;
      gap: 12px;
      align-items: end;
      min-height: 280px;
    }

    .tile {
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #ececf2;
      box-shadow: 0 10px 18px rgba(27,27,27,0.05);
      background: linear-gradient(180deg, #f9f8ff 0%, #eef1ff 100%);
      position: relative;
      min-height: 190px;
    }

    .tile.one {
      min-height: 240px;
      background:
        radial-gradient(circle at 70% 25%, rgba(255,231,154,0.8), transparent 20%),
        linear-gradient(180deg, #ffd2e4 0%, #f8bfc7 38%, #f0e8d6 39%, #e5d8b9 100%);
    }

    .tile.two {
      min-height: 290px;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06)),
        linear-gradient(140deg, #f6f2d9 0%, #f0c068 35%, #d9742b 100%);
    }

    .tile.three {
      min-height: 240px;
      background:
        radial-gradient(circle at 30% 20%, rgba(255,255,255,0.7), transparent 25%),
        linear-gradient(180deg, #d4ecff 0%, #d4ecff 55%, #c6b08d 56%, #b48f62 100%);
    }

    .tile.small-overlap {
      position: absolute;
      left: 14px;
      bottom: 14px;
      width: 84px;
      height: 84px;
      min-height: auto;
      border-radius: 12px;
      background: linear-gradient(180deg, #fffaf0 0%, #efe0cc 100%);
      border: 1px solid #ececf2;
      box-shadow: 0 10px 18px rgba(27,27,27,0.08);
    }

    .cta-copy h2 {
      margin: 0 0 16px;
      font-size: clamp(34px, 4vw, 54px);
      line-height: 1.04;
      letter-spacing: -0.03em;
      font-weight: 800;
      max-width: 460px;
    }

    .cta-copy h2 .blue {
      color: var(--blue);
    }

    .cta-copy p {
      max-width: 420px;
      margin: 0 0 24px;
      font-size: 15px;
      line-height: 1.65;
      color: var(--muted);
    }

    /* Footer */
    .footer {
      background: var(--blue);
      color: #fff;
      margin-top: 0;
    }

    .footer-main {
      padding: 38px 0 26px;
      display: grid;
      grid-template-columns: 1.4fr 1fr 1.5fr 1fr;
      gap: 28px;
      align-items: start;
    }

    .footer .brand {
      font-size: 20px;
      color: #fff;
    }

    .footer .brand-icon {
      background: #fff;
      color: var(--blue);
      box-shadow: 0 0 0 6px rgba(255,255,255,0.10);
    }

    .footer h4 {
      margin: 0 0 14px;
      font-size: 15px;
      font-weight: 700;
    }

    .footer-links,
    .footer-socials,
    .footer-meta {
      display: grid;
      gap: 12px;
      font-size: 14px;
      color: rgba(255,255,255,0.92);
    }

    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.18);
      padding: 14px 0 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      font-size: 13px;
      color: rgba(255,255,255,0.85);
    }

    /* Mobile */
    @media (max-width: 1080px) {
      .hero-grid,
      .cta-box {
        grid-template-columns: 1fr;
      }

      .feature-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .footer-main {
        grid-template-columns: repeat(2, 1fr);
      }

      .hero-visual {
        margin-top: 10px;
      }
    }

    @media (max-width: 840px) {
      .header-inner {
        flex-wrap: wrap;
        justify-content: center;
        padding: 16px 0;
      }

      .nav {
        order: 3;
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
      }

      .steps-grid,
      .feature-grid,
      .pricing-grid {
        grid-template-columns: 1fr;
      }

      .steps-grid::before {
        display: none;
      }

      .collage {
        grid-template-columns: 1fr;
      }

      .container {
        width: min(var(--container), calc(100% - 32px));
      }

      .hero {
        padding-top: 34px;
      }

      .hero-visual {
        grid-template-columns: 1fr;
      }

      .creative-card,
      .creative-card.tall,
      .creative-card.short {
        min-height: 260px;
      }
    }

    @media (max-width: 600px) {
      .hero h1,
      .section-head h2,
      .cta-copy h2 {
        font-size: 36px;
      }

      .footer-main,
      .footer-bottom {
        grid-template-columns: 1fr;
        display: grid;
      }

      .footer-bottom {
        justify-content: start;
      }

      .header-actions {
        width: 100%;
        justify-content: center;
      }

      .btn {
        padding: 11px 18px;
      }
    }
  </style>
</head>
<body>
  <div class="page-shell">
    <div class="site">
      <header class="header">
        <div class="container header-inner">
          <div class="brand">
            <span class="brand-icon">✦</span>
            <span>AdCreative Studio</span>
          </div>

          <nav class="nav">
            <a class="active" href="#home">Home</a>
            <a href="#templates">Templates</a>
            <a href="#creatives">My Creatives</a>
            <a href="#pricing">Pricing</a>
          </nav>

          <div class="header-actions">
            <a class="btn btn-primary" href="#login">Log in</a>
            <a class="btn btn-secondary" href="#signup">Sign up</a>
          </div>
        </div>
      </header>

      <main>
        <section class="hero" id="home">
          <div class="container hero-grid">
            <div class="hero-copy">
              <h1>
                Create Stunning Ad Creatives from
                <span class="blue">One Product Photo</span>
              </h1>
              <p>
                Upload your product image, describe the idea, and let AI generate
                high-quality marketing creatives with design and copy in seconds.
              </p>
              <a class="btn btn-primary" href="#pricing">Get start</a>
            </div>

            <div class="hero-visual" aria-label="Creative samples">
              <div class="creative-card short">
                <div class="creative-top-badge">♡</div>
                <div class="mock-scene"></div>
                <div class="shoe"></div>
              </div>

              <div class="creative-card tall">
                <div class="creative-top-badge">×</div>
                <div class="mock-scene"></div>
                <div class="shoe"></div>
              </div>

              <div class="creative-card promo-card">
                <div class="promo-copy">
                  NEW<br><span class="orange">DROP</span>
                </div>
                <div class="shoe" style="bottom: 58px;"></div>
                <div class="discount-tag">30% OFF</div>
              </div>
            </div>
          </div>
        </section>

        <section class="steps section-soft" id="templates">
          <div class="container">
            <div class="section-head">
              <h2>
                Generate Marketing<br>
                <span class="blue">Creatives</span> in Seconds
              </h2>
              <p>
                Our AI transforms a single product image into multiple ready-to-use
                advertising creatives. Simply upload your product, describe your idea,
                and let AI design eye-catching ads automatically.
              </p>
            </div>

            <div class="steps-grid">
              <article class="step-card">
                <div class="step-icon">⤴</div>
                <h3>1. Upload your product photo</h3>
                <p>Add a photo of your product to start creating your ad.</p>
              </article>

              <article class="step-card">
                <div class="step-icon">✎</div>
                <h3>2. Describe your idea</h3>
                <p>Write a short prompt describing the style or concept.</p>
              </article>

              <article class="step-card">
                <div class="step-icon">✦</div>
                <h3>3. Get AI-generated creatives</h3>
                <p>Receive multiple ready-to-use marketing creatives instantly.</p>
              </article>
            </div>
          </div>
        </section>

        <section class="features soft-glow-left" id="creatives">
          <div class="container">
            <div class="section-head">
              <h2>
                Everything You Need to<br>
                Create <span class="blue">Better Ads</span>
              </h2>
            </div>

            <div class="feature-grid">
              <article class="feature-card">
                <div class="feature-badge">1</div>
                <h3>AI Creative Generation</h3>
                <p>Turn one product photo into multiple ad creatives.</p>
              </article>

              <article class="feature-card">
                <div class="feature-badge">2</div>
                <h3>Marketing Copy Included</h3>
                <p>AI automatically generates promotional text and slogans.</p>
              </article>

              <article class="feature-card">
                <div class="feature-badge">3</div>
                <h3>Multiple Design Styles</h3>
                <p>Create ads for different platforms and audiences.</p>
              </article>

              <article class="feature-card">
                <div class="feature-badge">4</div>
                <h3>Ready for Social Media</h3>
                <p>Export creatives optimized for Instagram, Facebook, and ads.</p>
              </article>
            </div>
          </div>
        </section>

        <section class="pricing section-soft soft-glow-right" id="pricing">
          <div class="container">
            <div class="section-head">
              <h2>
                Compare And Choose<br>
                <span class="blue">The Best</span>
              </h2>
              <p>
                Take your file sharing to the next level with the Pro Plan.
                Designed for professionals and teams who need speed, security,
                and flexibility.
              </p>
            </div>

            <div class="pricing-grid">
              <article class="plan-card plan-light">
                <div class="plan-top">
                  <div class="eyebrow">Free</div>
                  <div class="title">Free plan</div>
                </div>
                <button class="plan-btn">Try for free</button>
                <div class="plan-divider"></div>
                <ul class="plan-list">
                  <li><span class="check">✓</span>1 image per 1 generation session</li>
                  <li><span class="check">✓</span>Limited presets count (3 of 9)</li>
                  <li><span class="check">✓</span>Watermark for High Resolution image</li>
                </ul>
              </article>

              <article class="plan-card plan-pro">
                <div class="plan-top">
                  <div class="eyebrow">Pro</div>
                  <div class="title">Paid plan</div>
                </div>
                <button class="plan-btn">Subscribe</button>
                <div class="plan-divider"></div>
                <ul class="plan-list">
                  <li><span class="check">✓</span>3 image per 1 generation session</li>
<li>              <span class="check">✓</span>All AI presets available + custom prompt</li>
<li>              <span class="check">✓</span>High Resolution image</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section class="cta-split soft-glow-right">
          <div class="container cta-box">
            <div class="collage">
              <div class="tile one"></div>
              <div class="tile two">
                <div class="tile small-overlap"></div>
              </div>
              <div class="tile three"></div>
            </div>

            <div class="cta-copy">
              <h2>
                Ready To Create<br>
                <span class="blue">Better Creatives?</span>
              </h2>
              <p>
                Create AdCreative Studio account to activate the integration and
                get 10 free image generation credits.
              </p>
              <a class="btn btn-primary" href="#pricing">Upgrade to Pro</a>
            </div>
          </div>
        </section>
      </main>

      <footer class="footer">
        <div class="container footer-main">
          <div>
            <div class="brand">
              <span class="brand-icon">✦</span>
              <span>AdCreative Studio</span>
            </div>
          </div>

          <div>
            <div class="footer-links">
              <a href="#home">Home</a>
              <a href="#templates">Templates</a>
              <a href="#creatives">My Creatives</a>
              <a href="#pricing">Pricing</a>
            </div>
          </div>

          <div>
            <h4>Have a suggestion?</h4>
            <div class="footer-meta">
              <span>✉ adcreativestudio@gmail.com</span>
            </div>
          </div>

          <div>
            <div class="footer-socials">
              <span>◉ YouTube</span>
              <span>◉ Facebook</span>
              <span>◉ Instagram</span>
            </div>
          </div>
        </div>

        <div class="container footer-bottom">
          <span>©2026</span>
          <span>AdCreative Studio</span>
        </div>
      </footer>
    </div>
  </div>
</body>
</html>
"""

@app.route("/")
def landing() -> str:
    return render_template_string(HTML)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
