/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  Droplet, 
  Leaf, 
  MapPin, 
  Mail, 
  Phone, 
  ArrowRight, 
  Waves, 
  CloudRain, 
  Users, 
  ShieldCheck,
  ShieldAlert,
  Scale,
  Menu,
  X,
  ChevronDown,
  Search,
  Loader2,
  FileText,
  ExternalLink
} from 'lucide-react';

// --- Constants ---
const GEMINI_MODEL = "gemini-3-flash-preview";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- Components ---

const SearchSection = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `Act as a research assistant for The White Nile and The Sudd Centre (WNSC). Using your search capabilities, find information related to: ${query}. Focus on research papers, reports, and up-to-date data about South Sudan's water resources, hydrology, and environmental policy. Provide a concise summary of findings.`,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "You are the WNSC Research Assistant. You provide evidence-based information regarding South Sudan's hydrology, climate risks, and water management. Always cite your sources or mention that information is derived from current research reports.",
        }
      });

      setResults(response.text || "No specific research findings found for this query.");
    } catch (err) {
      console.error("Search error:", err);
      setError("An error occurred while retrieving research data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white py-24 border-t border-slate-100" id="research-search">
      <div className="content-section">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-water-blue/10 border border-water-blue/20 text-xs font-bold uppercase tracking-widest text-water-blue mb-6">
            <Search size={14} /> AI-Powered Research Portal
          </div>
          <h2 className="text-4xl font-bold text-water-dark mb-6">Explore the WNSC Knowledge Base</h2>
          <p className="text-slate-600 text-lg">
            Search through our scientific reports, feasibility studies, and environmental assessments using our intelligent research assistant.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search e.g., 'Jonglei Canal feasibility', 'Sudd wetland biodiversity', 'flood patterns'..."
              className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-lg focus:ring-4 focus:ring-water-blue/10 focus:border-water-blue transition-all outline-none pl-14"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-water-blue transition-colors" size={24} />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3.5 bg-water-blue text-white font-bold rounded-[1.5rem] hover:bg-water-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Query Base"}
            </button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-3"
              >
                <ShieldAlert size={18} /> {error}
              </motion.div>
            )}

            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-water-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6 text-water-blue font-bold uppercase tracking-widest text-xs">
                    <FileText size={18} /> Research Intelligence Report
                  </div>
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                    {results}
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
                    <span>Generated via WNSC AI-Grounding</span>
                    <button onClick={() => setResults(null)} className="hover:text-water-blue transition-colors">Clear Results</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Research', path: '/#research-search' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    if (path.startsWith('/#')) {
      const id = path.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-white/90 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group" aria-label="WNSC Home">
          <div className="relative">
            <img 
              src="https://res.cloudinary.com/dpskjlq9m/image/upload/v1776848787/Screenshot_2026-04-22_at_12-06-13_The_White_Nile_And_Dudd_Centre-2.pdf_a4kdtd.png" 
              alt="WNSC Logo" 
              className={`h-10 md:h-12 w-auto object-contain transition-all duration-300 ${scrolled ? 'scale-90' : 'scale-100'}`}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-black text-2xl tracking-tighter text-nile-blue uppercase">WNSC</span>
            <span className="text-[10px] font-display font-bold text-wetland-green uppercase tracking-[0.2em]">Water is Life</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              link.path.startsWith('/#') ? (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className="text-sm font-semibold text-slate-600 hover:text-nile-blue transition-colors relative group py-2"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-nile-blue transition-all duration-300 group-hover:w-full" />
                </button>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold transition-colors relative group py-2 ${
                    location.pathname === link.path ? 'text-nile-blue' : 'text-slate-600 hover:text-nile-blue'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-nile-blue transition-all duration-300 group-hover:w-full ${location.pathname === link.path ? 'w-full' : 'w-0'}`} />
                </Link>
              )
            ))}
          </div>

          <Link 
            to="/contact" 
            className="px-8 py-3 bg-nile-blue text-white text-sm font-bold rounded-full shadow-lg hover:shadow-nile-blue/20 transform transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            Get Involved
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0, originY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-2">
              {navLinks.map((link) => (
                link.path.startsWith('/#') ? (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className="w-full text-left py-4 px-4 text-lg font-bold text-slate-700 hover:text-nile-blue hover:bg-slate-50 rounded-xl transition-all"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`w-full py-4 px-4 text-lg font-bold rounded-xl transition-all ${
                      location.pathname === link.path 
                        ? 'text-nile-blue bg-nile-blue/5' 
                        : 'text-slate-700 hover:text-nile-blue hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Link 
                  to="/contact" 
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center py-5 bg-nile-blue text-white rounded-2xl font-bold transform transition-all active:scale-95"
                >
                  Get Involved
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-water-dark text-white pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-16">
      <div className="col-span-1 md:col-span-2">
        <div className="mb-8">
          <img 
            src="https://res.cloudinary.com/dpskjlq9m/image/upload/v1776848787/Screenshot_2026-04-22_at_12-06-13_The_White_Nile_And_Dudd_Centre-2.pdf_a4kdtd.png" 
            alt="WNSC Logo" 
            className="h-16 w-auto object-contain brightness-0 invert"
            referrerPolicy="no-referrer"
          />
        </div>
        <p className="text-water-light/60 max-w-md leading-relaxed mb-6">
          National think tank dedicated to the scientific study, preservation, and sustainable management 
          of South Sudan’s water resources. Bridging the gap between indigenous hydrology and evidence-based policy.
        </p>
        <div className="flex gap-4">
          <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Mail size={18} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <MapPin size={18} />
          </a>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-6">Research Areas</h4>
        <ul className="space-y-4 text-water-light/60 text-sm">
          <li><Link to="/" className="hover:text-white transition-colors">Hydrology Study</Link></li>
          <li><Link to="/" className="hover:text-white transition-colors">Climate Adaptation</Link></li>
          <li><Link to="/" className="hover:text-white transition-colors">Wetland Livelihoods</Link></li>
          <li><Link to="/" className="hover:text-white transition-colors">Policy Advocacy</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-6">Headquarters</h4>
        <p className="text-water-light/60 text-sm leading-relaxed">
          Juba, Republic of South Sudan<br />
          Ministry Complex Area<br />
          Unit 4, White Nile Block
        </p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-water-light/40 uppercase tracking-widest">
      <p>© {new Date().getFullYear()} WNSC. All Rights Reserved.</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-white">Privacy Policy</a>
        <a href="#" className="hover:text-white">Terms of Service</a>
      </div>
    </div>
  </footer>
);

// --- Pages ---

const HomePage = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  const cards = [
    {
      title: "Hydrology",
      icon: <Droplet className="text-water-blue" />,
      desc: "Deep scientific research into the intricate water systems and flow dynamics of the White Nile basin.",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Climate Change",
      icon: <CloudRain className="text-wetland-green" />,
      desc: "Mitigating risks associated with unprecedented flooding and persistent seasonal droughts.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Livelihoods",
      icon: <Users className="text-water-dark" />,
      desc: "Ensuring the Sudd Wetlands continue to support millions of livelihoods through sustainable management.",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-hidden"
    >
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
        <motion.img 
          style={{ y, scale }}
          src="https://res.cloudinary.com/dpskjlq9m/image/upload/v1776851456/WhatsApp_Image_2026-04-22_at_12.48.29_PM_mxlbdv.jpg" 
          alt="Sudd Wetlands"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="content-section relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-water-blue/20 border border-water-blue/30 backdrop-blur-sm text-xs font-semibold uppercase tracking-widest text-water-blue mb-8">
              <Droplet size={14} /> National Think Tank
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8 tracking-tight">
              Protecting the <span className="text-water-blue">Lifelines</span> of South Sudan.
            </h1>
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-10 max-w-2xl font-light">
              "The White Nile and The Sudd Centre (WNSC) is a national think tank dedicated to the scientific study, preservation, and sustainable management of South Sudan’s water resources."
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/about" className="px-8 py-4 bg-water-blue text-white font-semibold rounded-xl hover:bg-water-dark transition-all flex items-center gap-2 group shadow-xl shadow-water-blue/20">
                Explore Our Purpose <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                Global Partnerships
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="bg-slate-50 py-24">
        <div className="content-section">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-water-dark mb-6">Pillars of Research</h2>
            <p className="text-slate-600 text-lg">
              We bridge the gap between indigenous hydrology and evidence-based policy to protect our region's natural treasures.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 card-hover"
              >
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-6 flex items-center gap-3 text-white">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      {card.icon}
                    </div>
                    <span className="font-bold text-lg">{card.title}</span>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-slate-600 leading-relaxed mb-6 italic text-sm">
                    {card.desc}
                  </p>
                  <Link to={`/about`} className="text-water-blue font-bold text-sm inline-flex items-center gap-2 group/btn">
                    Read Research <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Research Search Section */}
      <SearchSection />

      {/* Call to Action */}
      <section className="bg-wetland-dark py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-wetland-green/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="content-section relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Join the Scientific Vanguard</h2>
          <p className="text-wetland-accent text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Collaborating with international research centers to secure a sustainable future for the White Nile basin.
          </p>
          <Link to="/contact" className="px-10 py-5 bg-white text-wetland-dark font-bold rounded-2xl hover:bg-wetland-accent transition-all inline-block shadow-2xl">
            Register as a Partner
          </Link>
        </div>
      </section>
    </motion.div>
  );
};

const AboutPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24"
    >
      <section className="bg-water-dark py-32 text-center relative overflow-hidden">
        <img 
          src="https://res.cloudinary.com/dpskjlq9m/image/upload/v1776851456/WhatsApp_Image_2026-04-22_at_12.48.29_PM_mxlbdv.jpg" 
          alt="WNSC Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="content-section relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Our Mission & Purpose</h1>
          <p className="text-water-light/60 text-xl max-w-2xl mx-auto font-light italic">
            Defining the future of water management through rigorous science and indigenous wisdom.
          </p>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="content-section -mt-20">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-slate-100">
          <h2 className="text-3xl font-bold text-water-dark mb-12 text-center">The Problem Statement</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 group">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6 transition-transform group-hover:scale-110 shadow-sm">
                <ShieldAlert size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Environmental Impact
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Oil pollution and unregulated infrastructure have severely damaged natural ecosystems, threatening biological diversity and water quality.
              </p>
            </div>
            <div className="space-y-4 group">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 transition-transform group-hover:scale-110 shadow-sm">
                <CloudRain size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Climate Risks
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                South Sudan faces a recurring cycle of unprecedented flooding and, paradoxically, acute droughts driven by global climate shifts.
              </p>
            </div>
            <div className="space-y-4 group">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 mb-6 transition-transform group-hover:scale-110 shadow-sm">
                <Scale size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 text-center">
                Policy Gaps
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Resumption of legacy projects like the Jonglei Canal without credible Feasibility Studies (FSs) or ESIAs poses significant regional risks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="content-section grid grid-cols-1 md:grid-cols-2 gap-8 py-24">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-water-light p-12 rounded-[3.5rem] border border-water-blue/20 overflow-hidden relative"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-water-blue rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg shadow-water-blue/20">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-3xl font-bold text-water-dark mb-6">Our Mission</h2>
            <p className="text-water-dark/80 text-lg leading-relaxed">
              To promote sustainable preservation, utilization, development, and control of the White Nile and Sudd Wetlands for the prosperity of South Sudan.
            </p>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=600" 
            className="absolute -bottom-10 -right-10 w-64 h-64 object-cover opacity-10 rounded-full blur-sm"
            alt="Nature Background"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-wetland-accent/30 p-12 rounded-[3.5rem] border border-wetland-green/20 overflow-hidden relative"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-wetland-green rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg shadow-wetland-green/20">
              <Waves size={32} />
            </div>
            <h2 className="text-3xl font-bold text-wetland-dark mb-6">Our Vision</h2>
            <p className="text-wetland-dark/80 text-lg leading-relaxed">
              To be a formal legal entity providing scientific, technical, and professional leadership on water resources to ensure a "people-centered" sustainable future.
            </p>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600" 
            className="absolute -bottom-10 -right-10 w-64 h-64 object-cover opacity-10 rounded-full blur-sm"
            alt="Nature Background"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </section>

      {/* Field Operations Image Section */}
      <section className="content-section py-20 bg-white rounded-[4rem] mb-24 shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-water-blue">Scientific Leadership</span>
            <h2 className="text-4xl font-bold text-water-dark leading-tight">Bridging indigenous wisdom with modern evidence.</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              Our field operations focus on real-time data collection across the White Nile basin, tracking hydrological shifts and ecosystem health. This evidence-based approach ensures that South Sudan's lifelines are protected for generations.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-water-dark text-white rounded-2xl hover:bg-water-blue transition-all group font-bold">
              Inquire About Research <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=600" 
                className="w-full aspect-square object-cover rounded-3xl shadow-xl"
                alt="Water Research"
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&q=80&w=600" 
                className="w-full aspect-square object-cover rounded-3xl shadow-xl translate-y-8"
                alt="Field Operations"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.name.trim().length < 2) {
      newErrors.name = "Full name must be at least 2 characters.";
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    
    if (!formData.department) {
      newErrors.department = "Please select a department.";
    }
    
    if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50 min-h-screen pb-24"
    >
      <section className="bg-gradient-to-br from-water-dark to-wetland-dark py-32 text-center text-white relative overflow-hidden">
        <img 
          src="https://res.cloudinary.com/dpskjlq9m/image/upload/v1776851456/WhatsApp_Image_2026-04-22_at_12.48.29_PM_mxlbdv.jpg" 
          alt="WNSC Context"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          referrerPolicy="no-referrer"
        />
        <div className="content-section relative z-10">
          <h1 className="text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-water-light/60 text-lg max-w-xl mx-auto">
            Located in Juba, Republic of South Sudan. We are open for research partnerships and policy advocacy.
          </p>
        </div>
      </section>

      <div className="content-section -mt-20">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-5 border border-slate-100">
          {/* Contact Info */}
          <div className="lg:col-span-2 bg-water-dark p-12 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-water-blue/20 rounded-full blur-3xl" />
            <h2 className="text-3xl font-bold mb-12">Contact Information</h2>
            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <MapPin size={24} className="text-water-blue" />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest text-water-light/40 mb-2">Location</h4>
                  <p className="text-lg">Juba, Republic of South Sudan</p>
                  <p className="text-sm text-water-light/60 mt-1 italic">Ministry Complex, Nile Block 4</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Mail size={24} className="text-water-blue" />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest text-water-light/40 mb-2">Email Us</h4>
                  <p className="text-lg">info@wnsc.org.ss</p>
                  <p className="text-sm text-water-light/60 mt-1 italic">research@wnsc.org.ss</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Phone size={24} className="text-water-blue" />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest text-water-light/40 mb-2">Call Center</h4>
                  <p className="text-lg">+211 920 000 000</p>
                  <p className="text-sm text-water-light/60 mt-1 italic">Mon - Fri, 8am - 5pm</p>
                </div>
              </div>
            </div>
            
            <div className="mt-20 pt-10 border-t border-white/10 flex items-center gap-6 opacity-60">
              <Waves size={32} />
              <div className="text-xs uppercase tracking-widest font-bold">
                Protecting South Sudan's<br/>Natural Treasures
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 p-12">
            {submitted ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-8"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-8 shadow-inner">
                  <ShieldCheck size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Submission Received</h3>
                <p className="text-slate-600 mb-10 max-w-sm mx-auto">
                  Your inquiry has been logged in our expert registry. A research coordinator will reach out shortly.
                </p>
                <button 
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', department: '', message: '' }); }}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold"
                >
                  Send Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form 
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name</label>
                    <input 
                      name="name"
                      type="text" 
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 bg-slate-50 border ${errors.name ? 'border-red-500' : 'border-slate-200'} rounded-2xl focus:ring-2 focus:ring-water-blue focus:border-transparent transition-all outline-none`} 
                      placeholder="John Doe" 
                    />
                    {errors.name && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider pt-1">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                    <input 
                      name="email"
                      type="email" 
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-2xl focus:ring-2 focus:ring-water-blue focus:border-transparent transition-all outline-none`} 
                      placeholder="john@university.edu" 
                    />
                    {errors.email && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider pt-1">{errors.email}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Inquiry Department</label>
                  <div className="relative">
                    <select 
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 bg-slate-50 border ${errors.department ? 'border-red-500' : 'border-slate-200'} rounded-2xl focus:ring-2 focus:ring-water-blue appearance-none outline-none`}
                    >
                      <option value="">Select a stakeholder pathway</option>
                      <option value="research">Research Partner (University of Juba / SRRC)</option>
                      <option value="policy">Policy & Advocacy (Water Diplomacy / Hydro-politics)</option>
                      <option value="careers">Careers (Job Opportunities & Development)</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.department && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider pt-1">{errors.department}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Message / Proposal Brief</label>
                  <textarea 
                    name="message"
                    rows={4} 
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-6 py-4 bg-slate-50 border ${errors.message ? 'border-red-500' : 'border-slate-200'} rounded-2xl focus:ring-2 focus:ring-water-blue focus:border-transparent transition-all outline-none`} 
                    placeholder="How can we collaborate on the sustainable future of the Sudd?"
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider pt-1">{errors.message}</p>}
                </div>

                <button type="submit" className="w-full py-5 bg-water-blue text-white font-bold rounded-2xl shadow-xl shadow-water-blue/20 hover:bg-water-dark transition-all flex items-center justify-center gap-2 group">
                  Submit Stakeholder Briefing <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

// Utility to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
