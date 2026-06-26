import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, X, Download, ExternalLink, Mail, Code, Database, Zap, FileText, ChevronDown, ArrowRight,
} from 'lucide-react';
import { 
  FaGithub as Github, FaLinkedin as Linkedin, FaReact, FaNodeJs, FaPython, 
  FaGitAlt, FaDocker, FaLinux, FaHtml5, FaCss3Alt, FaDatabase, FaCode 
} from 'react-icons/fa';
import { SiTailwindcss, SiJavascript, SiExpress, SiC, SiMongodb, SiMysql, SiScikitlearn, SiLeetcode, SiCplusplus, SiPandas, SiNumpy } from 'react-icons/si';
import MarvelousBackground from './MarvelousBackground';

// Custom Hook for Mouse Position
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  useEffect(() => {
    const updateMousePosition = ev => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);
  return mousePosition;
};

// Typewriter Component
const TypeWriter = ({ words }) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    const speed = isDeleting ? 50 : 150;
    
    const timeout = setTimeout(() => {
      if (!isDeleting && text === currentWord) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      } else {
        setText(currentWord.substring(0, text.length + (isDeleting ? -1 : 1)));
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words]);

  return (
    <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent border-r-2 border-cyan-400 pr-1 animate-pulse">
      {text}
    </span>
  );
};

// 3D Tilt Card Component
const TiltCard = ({ children, className }) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease',
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`will-change-transform ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { x, y } = useMousePosition();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState('idle');

  const [githubStats, setGithubStats] = useState({ repos: 0, stars: 0, followers: 0, loading: true });

  useEffect(() => {
    const fetchGithubStats = async () => {
      try {
        const username = 'Mithunsurya-Kumarasamy';
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userRes.json();
        
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        const reposData = await reposRes.json();
        
        let totalStars = 0;
        if (Array.isArray(reposData)) {
          totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        }
        
        setGithubStats({
          repos: userData.public_repos || 0,
          stars: totalStars || 0,
          followers: userData.followers || 0,
          loading: false
        });
      } catch (err) {
        console.error("Failed to fetch GitHub stats:", err);
        setGithubStats({ repos: 12, stars: 35, followers: 10, loading: false }); // Fallback
      }
    };
    
    fetchGithubStats();
  }, []);

  const [leetcodeStats, setLeetcodeStats] = useState({ solved: 0, loading: true });

  useEffect(() => {
    const fetchLeetcodeStats = async () => {
      try {
        const username = 'Mithun_Surya_K_Y';
        const res = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`);
        const data = await res.json();
        
        if (data.totalSolved !== undefined) {
          setLeetcodeStats({ solved: data.totalSolved, loading: false });
        } else {
          setLeetcodeStats({ solved: 203, loading: false }); // Fallback
        }
      } catch (err) {
        console.error("Failed to fetch LeetCode stats:", err);
        setLeetcodeStats({ solved: 203, loading: false }); // Fallback
      }
    };
    
    fetchLeetcodeStats();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Hover detection for custom cursor
  useEffect(() => {
    const handleMouseOver = (e) => {
      const isInteractive = e.target.tagName.toLowerCase() === 'a' || 
                            e.target.tagName.toLowerCase() === 'button' || 
                            e.target.closest('a') || 
                            e.target.closest('button');
      setIsHovering(!!isInteractive);
    };
    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: "461aca06-8053-46ef-ad1e-9d0c4327f471",
          ...formData
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }
    } catch (err) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const skills = [
    {
      category: 'Languages',
      items: [
        { name: 'Python', icon: FaPython, color: '#3776AB' },
        { name: 'C', icon: SiC, color: '#A8B9CC' },
        { name: 'C++', icon: SiCplusplus, color: '#00599C' },
      ]
    },
    {
      category: 'Web Technologies',
      items: [
        { name: 'React', icon: FaReact, color: '#61DAFB' },
        { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
        { name: 'HTML', icon: FaHtml5, color: '#E34F26' },
        { name: 'CSS', icon: FaCss3Alt, color: '#1572B6' },
      ]
    },
    {
      category: 'Data & AI',
      items: [
        { name: 'Pandas', icon: SiPandas, color: '#150458' },
        { name: 'NumPy', icon: SiNumpy, color: '#013243' },
        { name: 'Scikit-learn', icon: SiScikitlearn, color: '#F7931E' },
        { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
        { name: 'Oracle', icon: FaDatabase, color: '#F80000' },
        { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
      ]
    },
    {
      category: 'Tools',
      items: [
        { name: 'Git', icon: FaGitAlt, color: '#F05032' },
        { name: 'VS Code', icon: FaCode, color: '#007ACC' },
      ]
    }
  ];

  const projects = [
    {
      title: 'Fragment Flow',
      description: 'A high-performance download manager extension for Chrome engineered to bypass single-stream limits via multithreading.',
      tech: ['Chrome Extension', 'JavaScript', 'Multithreading'],
      github: 'https://github.com/Mithunsurya-Kumarasamy/fragment-flow-chrome-extension',
      demo: '#',
      image: '/projects/fragment.jpg'
    },
    {
      title: 'Credit Risk Decision Engine',
      description: 'A data-driven analytics engine utilizing feature engineering and machine learning to automate creditworthiness assessment from fintech data.',
      tech: ['Python', 'Machine Learning', 'Data Analytics'],
      github: 'https://github.com/Mithunsurya-Kumarasamy/credit-risk-decision-engine',
      demo: '#',
      image: '/projects/credit.jpg'
    },
    {
      title: 'Dual Arena Game',
      description: 'A competitive Unity arena game showcasing advanced rendering techniques, custom ShaderLab environmental lighting, and real-time mechanics.',
      tech: ['Unity', 'C#', 'ShaderLab', 'SQL'],
      github: 'https://github.com/Mithunsurya-Kumarasamy/dual-arena-game',
      demo: '#',
      image: '/projects/arena.jpg'
    },
    {
      title: 'Cfake: AI vs. Real Image Classifier',
      description: 'An image forgery detection tool utilizing a streamlined pipeline to output probability scores on synthetic artifacts invisible to the human eye.',
      tech: ['Python', 'Computer Vision'],
      github: 'https://github.com/Mithunsurya-Kumarasamy/Cfake',
      demo: '#',
      image: '/projects/cfake.jpg'
    },
    {
      title: 'Interactive Graph Visualization',
      description: 'A graphical application bridging theoretical algorithms and practical visual behavior by rendering Dijkstra, BFS, and DFS pathfinding in real-time.',
      tech: ['Python', 'Pygame', 'NetworkX'],
      github: 'https://github.com/Mithunsurya-Kumarasamy/Graph-Visualization-Tool',
      demo: '#',
      image: '/projects/graph.jpg'
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden">
      
      {/* Custom Cursor */}
      <div 
        className="hidden lg:block cursor-glow pointer-events-none"
        style={{ left: `${x}px`, top: `${y}px` }}
      />
      <div 
        className={`hidden lg:block cursor-dot bg-cyan-400 pointer-events-none mix-blend-screen ${isHovering ? 'w-12 h-12 opacity-30 blur-sm' : 'w-4 h-4 opacity-100'}`}
        style={{ left: `${x}px`, top: `${y}px`, transition: 'width 0.2s, height 0.2s, opacity 0.2s, blur 0.2s' }}
      />
      <div 
        className={`hidden lg:block cursor-dot bg-white pointer-events-none ${isHovering ? 'w-2 h-2 opacity-100' : 'w-0 h-0 opacity-0'}`}
        style={{ left: `${x}px`, top: `${y}px` }}
      />

      {/* Marvelous Canvas Background (Birds & Rotating Earth) */}
      <MarvelousBackground />




      {/* Content wrapper with relative positioning so it sits above the background */}
      <div className="relative z-10">
        
        {/* Navigation Bar */}
        <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-slate-950/50 border-b border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer truncate mr-4">
                Mithun Surya Kumarasamy
              </div>

              <div className="hidden md:flex items-center gap-8">
                {['About', 'Journey', 'Skills', 'Projects', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-gray-300 hover:text-cyan-400 transition-colors text-sm font-medium relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
                  </button>
                ))}
                <a
                  href="/Mithun_Surya_Resume_New.pdf" download="Mithun_Surya_Resume.pdf"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  <Download size={16} />
                  Resume
                </a>
              </div>

              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {isMenuOpen && (
              <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 py-4 px-4 shadow-2xl">
                <div className="flex flex-col gap-4">
                  {['About', 'Journey', 'Skills', 'Projects', 'Contact'].map((item) => (
                    <button
                      key={item}
                      onClick={() => scrollToSection(item.toLowerCase())}
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-lg font-medium text-left px-2 py-1"
                    >
                      {item}
                    </button>
                  ))}
                  <a
                    href="/Mithun_Surya_Resume_New.pdf" download="Mithun_Surya_Resume.pdf"
                    className="flex items-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg font-bold transition-all w-full justify-center mt-2"
                  >
                    <Download size={18} />
                    Download Resume
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center reveal active">
          <div className="max-w-4xl mx-auto text-center relative">

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold mb-6 tracking-tight leading-tight">
              MERN Stack Developer <br/> &{' '}
              <TypeWriter words={['System Architect', 'UI/UX Innovator', 'Code Artisan', 'Creative Thinker']} />
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              I build scalable web applications and craft breathtaking user experiences. 
              Bridging the gap between robust backend systems and mesmerizing frontend interfaces.
            </p>


            <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 animate-bounce" style={{ animationDuration: '2s' }}>
              <ChevronDown size={32} className="text-cyan-500/50" />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-slate-950/50 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto reveal">
            <div className="mb-16 text-center">
              <h2 className="text-5xl font-bold mb-6">
                About Me<span className="text-cyan-400">.</span>
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
            </div>

            <div className="grid md:grid-cols-5 gap-12 items-center">
              <div className="md:col-span-2 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative aspect-square rounded-2xl bg-slate-900 border border-white/10 flex flex-col justify-center items-center text-center overflow-hidden">
                  <img 
                    src="/mithun-photo.jpg" 
                    alt="Mithun Surya" 
                    className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-700" 
                  />
                </div>
              </div>

              <div className="md:col-span-3 space-y-6">
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Computer Science student with strong skills in Python automation and statistical modeling. 
                  Experienced in building data pipelines that transform complex datasets into clear, predictive insights.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Proficient in Pandas, NumPy, and Scikit-Learn for data analysis, along with React for creating interactive dashboards. 
                  Passionate about using technology to improve financial forecasting and operational efficiency.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all">
                    <div className="flex items-center gap-2">
                      <SiLeetcode size={24} className="text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                      <h4 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">
                        {leetcodeStats.loading ? '...' : leetcodeStats.solved}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">LeetCode Solved</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all">
                    <div className="flex items-center gap-2">
                      <Github size={24} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                      <h4 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        {githubStats.loading ? '...' : githubStats.repos}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Live GitHub Repos</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Timeline Section */}
        <section id="journey" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-4xl mx-auto reveal">
            <div className="mb-16 text-center">
              <h2 className="text-5xl font-bold mb-6">
                My Journey<span className="text-cyan-400">.</span>
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
            </div>

            <div className="relative border-l-2 border-cyan-500/30 ml-3 md:ml-6 space-y-12 pb-8">
              {/* Timeline Item 1 */}
              <div className="relative pl-8 md:pl-12 reveal">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
                <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-cyan-500/50 transition-all group">
                  <span className="text-cyan-400 text-sm font-bold tracking-wider uppercase mb-2 block">2026</span>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">Runner, Infinity</h3>
                  <p className="text-gray-400">Secured the runner-up position in Infinity, an Intra-College Technical Competition.</p>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative pl-8 md:pl-12 reveal">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-blue-500/50 transition-all group">
                  <span className="text-blue-400 text-sm font-bold tracking-wider uppercase mb-2 block">2024 - 2029</span>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">M.Sc. Data Science (Integrated)</h3>
                  <p className="text-gray-400">PSG College of Technology, Coimbatore. <br/><span className="text-cyan-300">CGPA: 8.36</span></p>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative pl-8 md:pl-12 reveal">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
                <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-cyan-500/50 transition-all group">
                  <span className="text-cyan-400 text-sm font-bold tracking-wider uppercase mb-2 block">2024</span>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">XII (Higher Secondary)</h3>
                  <p className="text-gray-400">St. Joseph's Matriculation Higher Secondary School, Coimbatore. <br/><span className="text-cyan-300">Score: 91.6%</span></p>
                </div>
              </div>

              {/* Timeline Item 4 */}
              <div className="relative pl-8 md:pl-12 reveal">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white/20"></div>
                <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-white/30 transition-all group">
                  <span className="text-gray-400 text-sm font-bold tracking-wider uppercase mb-2 block">Certifications & Awards</span>
                  <h3 className="text-xl font-bold text-gray-200 mb-2 group-hover:text-white transition-colors">Technical Excellence</h3>
                  <p className="text-gray-400 leading-relaxed">
                    • Certified in Full Stack Development (Master Class) – Novitech<br/>
                    • Python (Basic) Certificate – HackerRank<br/>
                    • Elected Class Representative for a cohort of 40 students
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Matrix */}
        <section id="skills" className="py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto reveal">
            <div className="mb-16 text-center">
              <h2 className="text-5xl font-bold mb-6">
                Technical Arsenal<span className="text-cyan-400">.</span>
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {skills.map(({category, items}) => (
                <TiltCard key={category} className="p-8 backdrop-blur-xl bg-slate-900/50 border border-white/10 rounded-2xl hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group">
                  <h3 className="text-2xl font-semibold mb-6 text-white group-hover:text-cyan-300 transition-colors">{category}</h3>
                  <div className="flex flex-wrap gap-3">
                    {items.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center gap-2 px-5 py-2.5 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-300 cursor-default shadow-lg overflow-hidden"
                      >
                        <skill.icon size={16} color={skill.color} />
                        {skill.name}
                      </div>
                    ))}
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-32 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-slate-950/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto reveal">
            <div className="mb-16 text-center">
              <h2 className="text-5xl font-bold mb-6">
                Featured Work<span className="text-cyan-400">.</span>
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, idx) => (
                <TiltCard key={idx} className="h-full">
                  <div className="group h-full backdrop-blur-xl bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500 shadow-2xl flex flex-col relative">
                    {/* Glowing effect behind card content */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 transition-colors duration-500 pointer-events-none"></div>
                    
                    <div className="h-48 bg-slate-800 relative overflow-hidden flex items-center justify-center border-b border-white/10 group">
                      <div className="absolute inset-0 bg-slate-900/50 z-10 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    <div className="p-8 flex flex-col flex-grow relative z-10">
                      <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-500 transition-all">{project.title}</h3>
                      <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-grow">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-white/5 border border-white/10 text-cyan-300 text-xs font-semibold rounded-full shadow-inner"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-4">

                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white rounded-xl transition-all duration-300 text-sm font-bold"
                        >
                          <Github size={18} />
                          Source
                        </a>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Subtle background glow for contact */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
          
          <div className="max-w-3xl mx-auto reveal relative z-10">
            <div className="mb-16 text-center">
              <h2 className="text-5xl font-bold mb-6">
                Let's Build Something<span className="text-cyan-400">.</span>
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
            </div>

            <div className="backdrop-blur-xl bg-slate-900/60 border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-5 py-4 bg-slate-950/50 border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-600 shadow-inner"
                      placeholder="Misky"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="w-full px-5 py-4 bg-slate-950/50 border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-600 shadow-inner"
                      placeholder="misky@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    rows="5"
                    className="w-full px-5 py-4 bg-slate-950/50 border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-600 resize-none shadow-inner"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitStatus === 'loading' ? 'Sending...' : 
                   submitStatus === 'success' ? 'Message Sent!' : 
                   submitStatus === 'error' ? 'Error Sending' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-lg py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 drop-shadow-sm">
                  Mithun Surya Kumarasamy
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                  Crafting digital experiences with bleeding-edge technology and pixel-perfect precision.
                </p>
              </div>

              <div className="flex flex-col items-end text-right">
                <h4 className="font-bold mb-6 text-white text-lg">Let's Connect</h4>
                <div className="flex gap-4 mb-8">
                  {[
                    { Icon: Linkedin, href: 'https://linkedin.com/in/mithunsurya-kumarasamy' },
                    { Icon: Github, href: 'https://github.com/Mithunsurya-Kumarasamy' },
                    { Icon: Mail, href: 'mailto:mithunsurya1313@gmail.com' },
                  ].map(({ Icon, href }, i) => (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/5 hover:bg-cyan-500 hover:text-slate-950 border border-white/10 rounded-xl transition-all duration-300 text-gray-300 hover:scale-110 hover:rotate-3 shadow-lg"
                    >
                      <Icon size={22} />
                    </a>
                  ))}
                </div>

              </div>
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
              <p>&copy; {new Date().getFullYear()} Mithun Surya Kumarasamy. All rights reserved.</p>

              <p className="flex items-center gap-1">
                Built with React, Tailwind CSS, and <Zap size={14} className="text-cyan-400" />
              </p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Portfolio;
