import React from 'react';

const LegalPage = ({ title, content }) => (
  <div className="min-h-screen bg-slate-50 p-4 sm:p-12 font-sans selection:bg-emerald-100 selection:text-emerald-900">
    <div className="max-w-3xl mx-auto bg-white rounded-[3rem] p-8 sm:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100">
      <div className="flex items-center justify-between mb-12">
        <a href="/" className="inline-flex items-center space-x-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-emerald-600 transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to Muezza</span>
        </a>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-100">
          Official Release v1.0
        </div>
      </div>
      
      <header className="mb-16">
        <h1 className="text-5xl font-black text-slate-800 tracking-tight leading-none mb-4">
          {title}
        </h1>
        <p className="text-slate-400 text-sm font-medium">Effective Date: April 15, 2026</p>
      </header>
      
      <div className="prose prose-slate prose-lg max-w-none space-y-12 text-slate-600 leading-relaxed">
        {content}
      </div>
      
      <footer className="mt-20 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          © 2026 <a href="https://fadlyzaki-design.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">Fadly Uzzaki</a>. All rights reserved.
        </p>
        <div className="flex space-x-6">
           <a href="/privacy" className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors">Privacy</a>
           <a href="/terms" className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  </div>
);

export const PrivacyPolicy = () => (
  <LegalPage 
    title="Privacy Policy"
    content={
      <>
        <section>
          <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">1. Data Architecture & Sovereignty</h2>
          <p>Muezza is fundamentally architected as a <strong>Local-First</strong> application. Your personal daily progress—including prayer logs, habit completions, dinar balance, and local settings—resides exclusively within your device's <code>localStorage</code>. Muezza does not transmit this habitual data to any external server managed by us.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">2. Third-Party Integrations (OAuth2)</h2>
          <p>Muezza provides an optional "Sync with Quran.com" feature. By authenticating via the Quran Foundation OAuth2 protocol, you grant Muezza limited permission to read and write to your global <strong>Bookmarks</strong> and <strong>Streaks</strong>. This data is governed by the Quran Foundation Privacy Policy. Muezza utilizes PKCE (Proof Key for Code Exchange) to ensure your session remains secure and private.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">3. Analytics & Telemetry</h2>
          <p>To improve the user experience and ensure application stability, we utilize Google Analytics for basic telemetry. This includes anonymized events such as screen transitions and button interactions. We do not track sensitive religious data, personal Identifiable Information (PII), or specific Quranic verses read by individual users.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">4. Physical Location Data</h2>
          <p>Prayer time calculation relies on your geographical coordinates. This calculation occurs locally in your browser. If you use the search feature, your query is sent to the OpenStreetMap Nominatim API. Your precise location is never logged or stored on Muezza servers.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">5. Data Deletion</h2>
          <p>As we do not store your habit data in the cloud, you can delete all local data at any time by clearing your browser cache or using the "Reset History" feature within the app settings. To disconnect your Quran.com account, use the "Logout" feature in the Noor tab.</p>
        </section>
      </>
    }
  />
);

export const TermsOfService = () => (
  <LegalPage 
    title="Terms of Service"
    content={
      <>
        <section>
          <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">1. Acceptance of Terms</h2>
          <p>By accessing or using the Muezza application, you agree to be bound by these Terms of Service. Muezza is a spiritual productivity tool offered for the benefit of the community during the Quran Foundation Hackathon 1447.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">2. Spiritual Character & Conduct</h2>
          <p>The Muezza mascot and habit systems are designed to encourage positive spiritual habits. You agree to use the application in a manner consistent with Islamic values and respect for the Quranic text served via our integration partners.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">3. Use of Content (Quran Foundation)</h2>
          <p>All Quranic text, translations, audio, and tafsir insights are provided by the Quran Foundation API v4. Use of this content is subject to the Quran Foundation's own terms and open-source licensing agreements.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">4. Disclaimer of Warranty</h2>
          <p>Muezza is provided "as is" and "as available." While we strive for absolute reliability, we do not guarantee that the app will be error-free or that access will be continuous. Muezza is not liable for the loss of any local data or streak progress resulting from technical issues beyond our control.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">5. Intellectual Property</h2>
          <p>The "Muezza" brand, mascot designs, custom SVG components, and the "Grounded Habits" framework are the intellectual property of the project creators. You may not reproduce or commercially exploit these assets without expressed permission.</p>
        </section>
      </>
    }
  />
);
