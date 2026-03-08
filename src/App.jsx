import React, { useState, useEffect } from 'react';
import { Github, ExternalLink, Linkedin, Mail, Terminal, Code2, ChevronRight, Briefcase, GitCommit } from 'lucide-react';

const navLinks = ['About', 'Experience', 'Projects', 'Certifications', 'Contact'];

const techStack = [
  'Python', 'JavaScript (ES6+)', 'ReactJS', 'NextJS',
  'FastAPI', 'TailwindCSS', 'PostgreSQL', 'Docker',
  'Git', 'HTML/CSS', 'Django', 'Figma', 'REST APIs',
  'Prompt Engineering', 'RAG'
];

const projectsFallback = [
  {
    title: 'CLI-Tasker',
    description: 'A blazing fast command-line task manager built with Rust and packaged for npm.',
    tech: ['Rust', 'CLI', 'GitHub Actions'],
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=800',
    github: 'https://github.com/aditya-dev-19',
    live: '#'
  }
];
const experiences = [
  {
    company: 'Deepcytes.uk',
    role: 'Frontend Developer Intern',
    date: '// Jul 2025 - Present',
    description: 'Played a key role in a major UI/UX overhaul, developing 50% of the frontend architecture using ReactJS and NextJS.',
    achievements: [
      'Developed 50% of the frontend architecture using ReactJS and NextJS',
      'Resolved 25+ bugs and feature tickets assigned via ClickUp, improving site stability',
      'Implemented an AI-driven solution that directly enhanced the user experience'
    ]
  }
];

// Custom hook for typing effect
const useTypewriter = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    setDisplayText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return displayText;
};

// Intersection Observer for scroll animations
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

import BootSequence from './components/BootSequence';
import ProjectDetails from './components/ProjectDetails';

function App() {
  const subtitleText = "Full stack developer // Building things that matter";
  const typedSubtitle = useTypewriter(subtitleText, 50);
  useScrollReveal();

  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [githubError, setGithubError] = useState(null);

  useEffect(() => {
    const fetchGitHubProjects = async () => {
      try {
        const response = await fetch('https://api.github.com/users/aditya-dev-19/repos?sort=updated&per_page=100');
        if (!response.ok) throw new Error('Failed to fetch from GitHub');

        const data = await response.json();

        // Filter repos that have the 'portfolio' topic
        const portfolioRepos = data.filter(repo => repo.topics && repo.topics.includes('portfolio'));

        // Map to our project structure
        const formattedProjects = portfolioRepos.map(repo => {
          // Generate a deterministic placeholder image based on the repo name length
          const placeholderImages = [
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800', // code
            'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=800', // linux
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', // data
            'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800', // circuit
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800', // matrix
          ];
          const imgIndex = repo.name.length % placeholderImages.length;

          const techList = repo.language ? [repo.language, ...repo.topics.filter(t => t !== 'portfolio')] : repo.topics.filter(t => t !== 'portfolio');

          return {
            title: repo.name.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
            description: repo.description || 'No description provided for this repository.',
            tech: techList.slice(0, 4), // max 4 tags
            image: placeholderImages[imgIndex],
            github: repo.html_url,
            live: repo.homepage || repo.html_url
          };
        });

        if (formattedProjects.length > 0) {
          setProjects(formattedProjects);
        } else {
          // Fall back to empty or static if none found with tag yet
          setProjects(projectsFallback);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setGithubError(err.message);
        setProjects(projectsFallback);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchGitHubProjects();
  }, []);

  const [bootingProject, setBootingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] text-[var(--color-text-body)] selection:bg-[var(--color-primary-green)] selection:text-black pb-10 relative">
      <ProjectDetails project={selectedProject} onClose={() => setSelectedProject(null)} />

      {/* Sticky Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-[var(--color-bg-dark)]/80 border-b border-[var(--color-border-glow)] transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-mono text-white font-bold tracking-tighter">
            <a href="#" className="hover:text-[var(--color-primary-green)] transition-colors">ADITYA_NAIR</a>
          </div>
          <div className="hidden md:flex gap-8 font-mono text-xs tracking-widest uppercase">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="relative group text-gray-400 hover:text-[var(--color-primary-green)] transition-all flex items-center gap-2"
              >
                <span>[{link}]</span>
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-[var(--color-primary-green)] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 relative">
        <div className="absolute top-24 right-4 text-[10px] font-mono text-[var(--color-border-glow)] select-none">SYSTEM.LOG_INIT</div>

        {/* Hero Section */}
        <section id="hero" className="min-h-[90vh] flex flex-col justify-center relative reveal opacity-0 translate-y-10 transition-all duration-1000">
          <div className="absolute inset-0 scanline pointer-events-none opacity-20"></div>
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--color-primary-green)] rounded-full blur-[150px] opacity-[0.07] pointer-events-none"></div>

          <div className="relative z-10 w-full overflow-hidden">
            <div className="text-[10px] font-mono text-[var(--color-primary-green)]/50 mb-4 tracking-widest pl-1">{"<SYS_BOOT> OK"}</div>
            <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter text-white hover:text-glow transition-all duration-500 cursor-default uppercase break-words">
              ADITYA_NAIR
            </h1>
            <div className="min-h-[2.5rem] mb-10 flex items-center text-lg md:text-2xl font-mono text-[var(--color-primary-green)] tracking-tight">
              <div className="flex flex-wrap items-center">
                <Terminal className="mr-3 w-6 h-6 md:w-8 md:h-8" />
                <span>{typedSubtitle}</span>
                <span className="inline-block w-3 h-6 md:w-4 md:h-8 bg-[var(--color-primary-green)] ml-1 cursor-blink"></span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 font-mono text-sm mt-12">
              <a href="#projects" className="px-6 py-4 border border-[var(--color-primary-green)] bg-[var(--color-primary-green)]/10 text-[var(--color-primary-green)] hover:bg-[var(--color-primary-green)] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all flex items-center group relative overflow-hidden tracking-widest font-bold">
                <span className="relative z-10 flex items-center">
                  [VIEW_WORK]
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 h-full w-0 bg-[var(--color-primary-green)] transition-all duration-300 ease-out group-hover:w-full"></div>
              </a>
              <a
                href="/Aditya Nair's resume.pdf"
                download="Aditya Nair's resume.pdf"
                className="px-6 py-4 border border-gray-600 text-gray-400 hover:border-white hover:text-white transition-all flex items-center hover:bg-white/5 tracking-widest uppercase relative group"
                title="Download Resume"
              >
                [FETCH_RESUME]
              </a>
              <a href="#contact" className="px-6 py-4 border border-gray-600 text-gray-400 hover:border-white hover:text-white transition-all flex items-center hover:bg-white/5 tracking-widest uppercase relative group">
                [CONTACT]
              </a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 reveal opacity-0 translate-y-10 transition-all duration-700 ease-out relative">
          <div className="absolute top-24 right-4 text-[10px] font-mono text-[var(--color-border-glow)] select-none whitespace-nowrap hidden md:block">CORE_MODULE_LOADED</div>

          <div className="mb-16 border-b border-[var(--color-border-glow)] pb-4 flex items-end justify-between">
            <h2 className="text-xl sm:text-3xl font-mono text-gray-400 uppercase tracking-widest flex items-center group">
              <span className="text-[var(--color-primary-green)]/50 mr-4 text-xl">{"01"}</span>
              <span className="text-[var(--color-primary-green)] mr-3 transition-transform group-hover:translate-x-1">{"// "}</span> ABOUT
            </h2>
            <div className="text-xs font-mono text-gray-600 hidden sm:block">{"{ bio.md }"}</div>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-2 gap-12 md:gap-16 w-full max-w-full overflow-hidden">
            <div className="space-y-6 text-base md:text-lg leading-relaxed text-gray-400 font-sans tracking-wide break-words whitespace-normal text-balance">
              <p className="hover:text-gray-200 transition-colors">
                Hello. I'm a software engineer who specializes in building exceptional digital experiences.
                Currently, I'm focused on writing fast, accessible, and maintainable code.
              </p>
              <p className="hover:text-gray-200 transition-colors">
                I thrive in environments where I can dive deep into complex problems, optimizing systems
                from the database layer all the way up to the client interface. I believe in tools that
                empower developers and interfaces that respect the user.
              </p>
              <p className="hover:text-gray-200 transition-colors text-[var(--color-primary-green)]/80">
                When I'm not writing code, you'll find me reading technical documentation for fun or
                customizing my neovim configuration.
              </p>
            </div>

            <div className="reveal -mt-8 opacity-0 translate-y-10 transition-all duration-700 delay-200">
              {/* Neon Container */}
              <div className="relative neon-border-container bg-[#08090a] p-1 rounded-sm overflow-hidden group w-full max-w-full">
                {/* CRT Scanline Overlay */}
                <div className="absolute inset-0 scanline pointer-events-none opacity-20 z-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-primary-green)]/5 to-transparent animate-crt-flicker pointer-events-none z-20"></div>

                {/* Top Terminal Bar */}
                <div className="flex justify-between items-center px-4 py-2 border-b border-[var(--color-primary-green)]/20 bg-[#0a0c10] relative z-30">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="font-mono text-[10px] text-[var(--color-primary-green)] flex items-center bg-[var(--color-primary-green)]/10 px-2 py-0.5 border border-[var(--color-primary-green)]/30 rounded-sm">
                      <Code2 className="w-3 h-3 mr-1.5" />
                      TECH_STACK.sys
                    </div>
                  </div>
                  <div className="font-mono text-[9px] text-[var(--color-primary-green)]/70 flex gap-4 hidden sm:flex">
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-green)] animate-pulse"></span> CPU: 12%</span>
                    <span>MEM: 4.2GB</span>
                    <span>NET: OK</span>
                  </div>
                </div>

                {/* Marquee Area */}
                <div className="relative overflow-hidden w-full py-6 md:py-8 bg-[#0a0a0a] z-10 border-y border-[var(--color-primary-green)]/10">
                  {/* Decorative Brackets framing the marquee */}
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 font-mono text-4xl text-[var(--color-primary-green)]/40 pointer-events-none select-none z-30">[</div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-4xl text-[var(--color-primary-green)]/40 pointer-events-none select-none z-30">]</div>

                  {/* Left/Right Gradient Masks */}
                  <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent z-20 pointer-events-none"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent z-20 pointer-events-none"></div>

                  {/* Scrolling Content */}
                  <div className="flex animate-marquee whitespace-nowrap w-max hover:animation-play-state-paused">
                    {/* First set of items */}
                    <div className="flex items-center">
                      {techStack.map((tech) => (
                        <React.Fragment key={`t1-${tech}`}>
                          <span className="px-6 md:px-8 font-mono text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 hover:from-[var(--color-primary-green)] hover:to-[#00ffcc] transition-all cursor-crosshair tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]">
                            {tech}
                          </span>
                          <span className="inline-flex items-center font-mono text-[10px] text-[var(--color-primary-green)]/60 bg-[var(--color-primary-green)]/5 px-2 py-1 border border-[var(--color-primary-green)]/20 mx-2">
                            [OK]
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                    {/* Duplicated set for seamless loop */}
                    <div className="flex items-center">
                      {techStack.map((tech) => (
                        <React.Fragment key={`t2-${tech}`}>
                          <span className="px-6 md:px-8 font-mono text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 hover:from-[var(--color-primary-green)] hover:to-[#00ffcc] transition-all cursor-crosshair tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]">
                            {tech}
                          </span>
                          <span className="inline-flex items-center font-mono text-[10px] text-[var(--color-primary-green)]/60 bg-[var(--color-primary-green)]/5 px-2 py-1 border border-[var(--color-primary-green)]/20 mx-2">
                            [OK]
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Footer Border Glow */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-[var(--color-primary-green)]/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-24 reveal opacity-0 translate-y-10 transition-all duration-700 ease-out relative">
          <div className="absolute top-24 left-4 text-[10px] font-mono text-[var(--color-border-glow)] select-none whitespace-nowrap hidden lg:block -rotate-90 origin-left">TIMELINE_TRACED</div>

          <div className="mb-16 border-b border-[var(--color-border-glow)] pb-4 flex items-end justify-between">
            <h2 className="text-xl sm:text-3xl font-mono text-gray-400 uppercase tracking-widest flex items-center group">
              <span className="text-[var(--color-primary-green)]/50 mr-4 text-xl">{"02"}</span>
              <span className="text-[var(--color-primary-green)] mr-3 transition-transform group-hover:translate-x-1">{"// "}</span> EXPERIENCE
            </h2>
          </div>

          <div className="pl-6 md:pl-16 max-w-4xl relative">
            {/* Master timeline line */}
            <div className="absolute top-0 bottom-0 left-[23px] md:left-[63px] w-px bg-gradient-to-b from-transparent via-[var(--color-border-glow)] to-transparent z-0"></div>

            <div className="space-y-16 relative z-10">
              {experiences.map((exp, idx) => (
                <div key={idx} className="relative group reveal opacity-0 translate-x-4 transition-all duration-500" style={{ transitionDelay: `${idx * 150}ms` }}>

                  {/* Timeline dot */}
                  <div className="absolute -left-6 top-6 w-12 h-12 rounded-full bg-[#0A0C10] border border-[var(--color-border-glow)] group-hover:border-[var(--color-primary-green)] transition-all flex items-center justify-center z-10 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_15px_rgba(0,255,136,0.2)]">
                    <div className="w-3 h-3 rounded-full bg-gray-600 group-hover:bg-[var(--color-primary-green)] group-hover:shadow-[0_0_8px_rgba(0,255,136,1)] transition-colors"></div>
                  </div>

                  <div className="ml-12 bg-[#0A0C10] border border-[var(--color-border-glow)] p-8 group-hover:border-[var(--color-primary-green)]/40 transition-all duration-500 group-hover:-translate-y-1 relative overflow-hidden">
                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-8 h-8 font-mono text-xs flex justify-end">
                      <div className="w-0 h-0 border-t-[32px] border-t-[var(--color-primary-green)]/10 border-l-[32px] border-l-transparent group-hover:border-t-[var(--color-primary-green)]/30 transition-all"></div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white font-mono break-words flex items-center">
                          <Briefcase className="w-5 h-5 mr-3 text-gray-500 group-hover:text-[var(--color-primary-green)] transition-colors" />
                          <span className="group-hover:text-glow transition-all">{exp.role}</span>
                        </h3>
                        <div className="text-[var(--color-primary-green)] font-mono text-sm mt-2 font-bold tracking-widest uppercase">{exp.company}</div>
                      </div>
                      <span className="text-xs tracking-widest font-mono text-gray-500 md:ml-4 shrink-0 mt-4 md:mt-0 font-bold group-hover:text-white transition-colors">
                        {exp.date}
                      </span>
                    </div>

                    <p className="text-base text-gray-400 leading-relaxed font-sans mb-6 pb-6 border-b border-dashed border-gray-800">
                      {exp.description}
                    </p>

                    <ul className="space-y-3 font-mono text-sm text-gray-400">
                      {exp.achievements.map((ach, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-[var(--color-primary-green)] mr-3 mt-1 text-[10px]">▶</span>
                          <span className="leading-relaxed hover:text-[var(--color-primary-green)] transition-colors cursor-crosshair">{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 reveal opacity-0 translate-y-10 transition-all duration-700 ease-out">
          <div className="mb-12 border-b border-[var(--color-border-glow)] pb-4 flex items-end justify-between">
            <h2 className="text-xl sm:text-3xl font-mono text-gray-400 uppercase tracking-widest flex items-center group">
              <span className="text-[var(--color-primary-green)]/50 mr-4 text-xl">{"03"}</span>
              <span className="text-[var(--color-primary-green)] mr-3 transition-transform group-hover:translate-x-1">{"/* "}</span> PROJECTS <span className="text-[var(--color-primary-green)] ml-3">{" */"}</span>
            </h2>
            <div className="text-xs font-mono text-gray-600 hidden sm:block">{"[ array: " + projects.length + " ]"}</div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingProjects ? (
              <div className="col-span-1 border border-[var(--color-border-glow)] bg-[#0A0C10] p-8 h-48 flex items-center justify-center">
                <div className="font-mono text-gray-500 animate-pulse">[FETCHING_REPOSITORIES...]</div>
              </div>
            ) : githubError && projects.length === projectsFallback.length ? (
              <div className="col-span-full border border-red-900/50 bg-[#0A0C10] p-4 flex items-center justify-center">
                <div className="font-mono text-red-500 text-sm">[ERR] Github API Limit Reached or Failed. Showing cached data.</div>
              </div>
            ) : null}

            {!isLoadingProjects && projects.map((project, idx) => (
              <div
                key={project.title}
                className="border border-[var(--color-border-glow)] bg-[#0A0C10] hover:border-[var(--color-primary-green)] hover:shadow-[0_0_25px_rgba(0,255,136,0.1)] hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full overflow-hidden relative cursor-pointer"
                onClick={() => setBootingProject(project.title)}
              >
                {/* Decorative brackets on sides */}
                <div className="absolute top-1/2 left-2 -translate-y-1/2 opacity-0 group-hover:opacity-10 text-[var(--color-primary-green)] font-mono text-6xl pointer-events-none transition-all duration-500">{"{"}</div>
                <div className="absolute top-1/2 right-2 -translate-y-1/2 opacity-0 group-hover:opacity-10 text-[var(--color-primary-green)] font-mono text-6xl pointer-events-none transition-all duration-500">{"}"}</div>

                {/* Project Image */}
                <div className="relative h-48 overflow-hidden bg-[#10121a] border-b border-[var(--color-border-glow)] group-hover:border-[var(--color-primary-green)]/50 transition-colors p-[1px]">

                  {/* Boot Sequence targeting */}
                  <div className={`absolute inset-0 z-30 transition-opacity duration-300 pointer-events-none ${bootingProject === project.title ? 'opacity-100' : 'opacity-0'}`}>
                    <BootSequence
                      isActive={bootingProject === project.title}
                      onComplete={() => {
                        setSelectedProject(project);
                        setBootingProject(null);
                      }}
                    />
                  </div>

                  <div className="absolute inset-0 bg-[var(--color-primary-green)]/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-color"></div>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover filter grayscale sepia-[0.3] hue-rotate-[90deg] group-hover:grayscale-[0.5] group-hover:sepia-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  {/* Overlay scanline */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 z-10 transition-colors pointer-events-none"></div>
                  <div className="absolute top-2 right-2 z-20 bg-black/80 px-2 py-1 font-mono text-[10px] text-[var(--color-primary-green)] border border-[var(--color-primary-green)]/30 backdrop-blur-md pointer-events-none">STATUS:ONLINE</div>
                </div>

                <div className="p-8 flex flex-col flex-grow relative z-20">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-mono font-bold text-white group-hover:text-[var(--color-primary-green)] transition-colors group-hover:text-glow">
                      {project.title}
                    </h3>
                    <div className="flex gap-4 text-gray-500 z-20">
                      <a href={project.github} onClick={(e) => e.stopPropagation()} className="hover:text-[var(--color-primary-green)] hover:scale-110 transition-all drop-shadow-md" aria-label="GitHub">
                        <Github className="w-5 h-5" />
                      </a>
                      <a href={project.live} onClick={(e) => e.stopPropagation()} className="hover:text-[var(--color-primary-green)] hover:scale-110 transition-all drop-shadow-md" aria-label="Live Demo">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-8 flex-grow leading-relaxed font-sans">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto border-t border-[var(--color-border-glow)] pt-4 border-dashed group-hover:border-[var(--color-primary-green)]/30 transition-colors">
                    {project.tech.map(tech => (
                      <span key={tech} className="text-[10px] font-mono tracking-widest text-[var(--color-primary-green)] bg-[var(--color-primary-green)]/5 px-2 py-1 border border-[var(--color-primary-green)]/20 uppercase">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="py-24 reveal opacity-0 translate-y-10 transition-all duration-700 ease-out">
          <div className="mb-12 border-b border-[var(--color-border-glow)] pb-4 flex items-end justify-between">
            <h2 className="text-xl sm:text-3xl font-mono text-gray-400 uppercase tracking-widest flex items-center group">
              <span className="text-[var(--color-primary-green)]/50 mr-4 text-xl">{"04"}</span>
              <span className="text-[var(--color-primary-green)] mr-3 transition-transform group-hover:translate-x-1">{"/* "}</span> CERTIFICATIONS <span className="text-[var(--color-primary-green)] ml-3">{" */"}</span>
            </h2>
            <div className="text-xs font-mono text-gray-600 hidden sm:block">{"[ verified.log ]"}</div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Python Django 101',
                issuer: 'Simplilearn',
                date: 'Aug 2025',
                id: 'SIMP-DJANGO-25'
              },
              {
                title: 'Claude Code in Action',
                issuer: 'Anthropic',
                date: 'March 2026',
                id: 'ANTH-CC-26'
              }
            ].map((cert, idx) => (
              <div
                key={cert.id}
                className="relative group border border-[var(--color-border-glow)] bg-[#0A0C10] hover:border-[var(--color-primary-green)]/60 hover:shadow-[0_0_20px_rgba(0,255,136,0.08)] transition-all duration-500 overflow-hidden flex"
              >
                {/* Neon left border accent */}
                <div className="w-1 shrink-0 bg-[var(--color-primary-green)]/30 group-hover:bg-[var(--color-primary-green)] transition-colors duration-500 shadow-[2px_0_10px_rgba(0,255,136,0.3)]" />

                <div className="p-6 flex-1 font-mono">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-[10px] text-gray-600 mb-1 tracking-widest">CERT_{String(idx + 1).padStart(2, '0')}.log</div>
                      <h3 className="text-white font-bold text-lg tracking-tight leading-snug">{cert.title}</h3>
                    </div>
                    <span className="text-[10px] font-bold text-[var(--color-primary-green)] border border-[var(--color-primary-green)]/40 bg-[var(--color-primary-green)]/5 px-2 py-1 shrink-0 ml-4">
                      [VERIFIED]
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-[var(--color-primary-green)]/20 to-transparent mb-4" />

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">ISSUER:</span>
                      <span className="text-[var(--color-primary-green)] font-bold tracking-widest uppercase">{cert.issuer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">DATE:</span>
                      <span className="text-gray-400">{cert.date}</span>
                    </div>
                  </div>

                  {/* ID footer */}
                  <div className="mt-4 text-[10px] text-gray-700 tracking-widest">
                    ID: {cert.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 pb-32 reveal opacity-0 translate-y-10 transition-all duration-700 ease-out">
          <div className="mb-16 border-b border-[var(--color-border-glow)] pb-4 flex items-end justify-between">
            <h2 className="text-xl sm:text-3xl font-mono text-gray-400 uppercase tracking-widest flex items-center group">
              <span className="text-[var(--color-primary-green)]/50 mr-4 text-xl">{"05"}</span>
              <span className="text-[var(--color-primary-green)] mr-3 transition-transform group-hover:translate-x-1">{"/* "}</span> CONTACT <span className="text-[var(--color-primary-green)] ml-3">{" */"}</span>
            </h2>
          </div>

          <div className="max-w-3xl border border-[var(--color-border-glow)] bg-[#0A0C10] font-mono mx-auto hover:border-[var(--color-primary-green)]/40 transition-colors hover:shadow-[0_0_40px_rgba(0,255,136,0.06)] relative overflow-hidden">
            {/* Terminal header */}
            <div className="border-b border-[var(--color-border-glow)] px-4 py-3 flex items-center justify-between bg-[#10121a]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 cursor-pointer"></div>
                <div className="w-3 h-3 rounded-full bg-[var(--color-primary-green)]/80 hover:bg-[var(--color-primary-green)] hover:shadow-[0_0_8px_rgba(0,255,136,0.8)] cursor-pointer transition-all"></div>
                <span className="text-[10px] sm:text-xs text-gray-500 ml-4 border-l border-gray-700 pl-4 font-bold tracking-widest opacity-80 truncate hidden xs:inline-block">aditya@portfolio: ~/contact</span>
              </div>
              <div className="text-[10px] text-gray-600">bash</div>
            </div>

            {/* Scanline overlay for terminal */}
            <div className="absolute inset-x-0 top-12 bottom-0 scanline opacity-10 pointer-events-none"></div>

            {/* Terminal body */}
            <div className="p-6 md:p-12 text-sm text-gray-300 relative z-10 overflow-hidden">
              <p className="mb-6 flex items-center text-base">
                <span className="text-[var(--color-primary-green)] font-bold mr-3 drop-shadow-[0_0_5px_rgba(0,255,136,0.8)]">➜</span>
                <span className="text-blue-400 mr-2 font-bold">~</span>
                <span className="text-white">./connect.sh</span>
              </p>

              <div className="pl-6 border-l-2 border-gray-800 ml-[5px] py-2 mb-8">
                <p className="text-gray-400 leading-relaxed max-w-lg mb-2">
                  <span className="text-gray-500 select-none">1 | </span> Currently open to new opportunities.
                </p>
                <p className="text-gray-400 leading-relaxed max-w-lg mb-2">
                  <span className="text-gray-500 select-none">2 | </span> Whether you have a question or just want to say hi,
                </p>
                <p className="text-gray-400 leading-relaxed max-w-lg mb-8">
                  <span className="text-gray-500 select-none">3 | </span> I'll try my best to get back to you!
                </p>

                <div className="space-y-6 max-w-sm">
                  <a href="mailto:aditya.nair.dev@gmail.com" className="flex items-center justify-between hover:text-white transition-all group p-4 border border-[var(--color-border-glow)] hover:border-[var(--color-primary-green)] bg-[#10121a] hover:bg-[#0d1f16]">
                    <div className="flex items-center gap-4">
                      <Mail className="w-5 h-5 text-gray-500 group-hover:text-[var(--color-primary-green)] transition-colors" />
                      <span className="font-bold tracking-wide">Email</span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500 group-hover:text-[var(--color-primary-green)] opacity-50 group-hover:opacity-100 transition-all uppercase tracking-widest font-mono select-all truncate ml-2">aditya.nair.dev@gmail.com</span>
                  </a>

                  <a href="https://github.com/aditya-dev-19" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-white transition-all group p-4 border border-[var(--color-border-glow)] hover:border-[var(--color-primary-green)] bg-[#10121a] hover:bg-[#0d1f16]">
                    <div className="flex items-center gap-4">
                      <Github className="w-5 h-5 text-gray-500 group-hover:text-[var(--color-primary-green)] transition-colors" />
                      <span className="font-bold tracking-wide">GitHub</span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500 group-hover:text-[var(--color-primary-green)] opacity-50 group-hover:opacity-100 transition-all uppercase tracking-widest font-mono truncate ml-2">/aditya-dev-19</span>
                  </a>

                  <a href="https://www.linkedin.com/in/aditya-dev19" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-white transition-all group p-4 border border-[var(--color-border-glow)] hover:border-[var(--color-primary-green)] bg-[#10121a] hover:bg-[#0d1f16]">
                    <div className="flex items-center gap-4">
                      <Linkedin className="w-5 h-5 text-gray-500 group-hover:text-[var(--color-primary-green)] transition-colors" />
                      <span className="font-bold tracking-wide">LinkedIn</span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500 group-hover:text-[var(--color-primary-green)] opacity-50 group-hover:opacity-100 transition-all uppercase tracking-widest font-mono truncate ml-2">/in/aditya-dev19</span>
                  </a>
                </div>
              </div>

              <p className="mt-8 flex items-center">
                <span className="text-[var(--color-primary-green)] font-bold mr-3 drop-shadow-[0_0_5px_rgba(0,255,136,0.8)]">➜</span>
                <span className="text-blue-400 mr-2 font-bold">~</span>
                <span className="w-3 h-6 bg-[var(--color-primary-green)] cursor-blink inline-block ml-1"></span>
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-[#0A0C10] border-t border-[var(--color-border-glow)] py-2 px-6 flex items-center justify-between font-mono text-[10px] sm:text-xs text-gray-500 z-40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 hover:text-[var(--color-primary-green)] transition-colors cursor-crosshair">
            <GitCommit className="w-4 h-4" />
            <span className="uppercase tracking-widest font-bold">LAST_COMMIT: <span className="text-gray-300">7f3e1a2</span></span>
          </div>
        </div>
        <div className="flex items-center gap-4 uppercase tracking-widest">
          <span className="hidden sm:inline">adityanair.dev &copy; {new Date().getFullYear()}</span>
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary-green)] mr-2 animate-pulse"></span>
            SYSTEM_ONLINE
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
