import React, { useState, useEffect, useRef } from 'react';

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface Value {
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  borderColor: string;
}

interface AnimatedNumberProps {
  end: number;
  suffix?: string;
  duration?: number;
}

const OurStoryPage: React.FC = () => {
  const [scrollY, setScrollY] = useState<number>(0);
  const [visibleElements, setVisibleElements] = useState<Set<number>>(new Set());
  const [animatingNumbers, setAnimatingNumbers] = useState<boolean>(false);
  const sectionRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check which elements are visible
      const newVisibleElements = new Set<number>();
      sectionRefs.current.forEach((ref, index) => {
        if (ref && ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          if (isVisible) {
            newVisibleElements.add(index);
          }
        }
      });
      setVisibleElements(newVisibleElements);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize refs array
  useEffect(() => {
    // @ts-ignore
    sectionRefs.current = Array.from({ length: 20 }, () => React.createRef<HTMLDivElement>());
  }, []);

  const milestones: Milestone[] = [
    {
      year: "2018",
      title: "The Spark",
      description: "It all began with a simple idea - to create something meaningful that would make a difference in people's lives.",
      icon: "💡",
      color: "from-amber-400 to-orange-400"
    },
    {
      year: "2019",
      title: "Building the Foundation",
      description: "We assembled our core team of passionate individuals who shared our vision for innovation and excellence.",
      icon: "🏗️",
      color: "from-blue-400 to-cyan-400"
    },
    {
      year: "2020",
      title: "First Breakthrough",
      description: "Despite global challenges, we launched our first product and gained our initial community of supporters.",
      icon: "🚀",
      color: "from-purple-400 to-pink-400"
    },
    {
      year: "2021",
      title: "Scaling New Heights",
      description: "Our user base grew exponentially as we expanded our offerings and refined our mission.",
      icon: "📈",
      color: "from-green-400 to-emerald-400"
    },
    {
      year: "2022",
      title: "Global Recognition",
      description: "Awards and recognition poured in as our impact became evident across multiple industries.",
      icon: "🏆",
      color: "from-red-400 to-rose-400"
    },
    {
      year: "2024",
      title: "The Future Unfolds",
      description: "Today, we're not just building products - we're crafting experiences that shape tomorrow.",
      icon: "🌟",
      color: "from-indigo-400 to-violet-400"
    }
  ];

  const values: Value[] = [
    {
      title: "Innovation",
      description: "We constantly push boundaries and challenge the status quo",
      icon: "⚡",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-100",
      borderColor: "border-amber-200"
    },
    {
      title: "Integrity",
      description: "Transparency and honesty guide every decision we make",
      icon: "🛡️",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-100",
      borderColor: "border-blue-200"
    },
    {
      title: "Excellence",
      description: "We strive for perfection in everything we create",
      icon: "💎",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-100",
      borderColor: "border-purple-200"
    },
    {
      title: "Community",
      description: "Our users and team members are at the heart of everything",
      icon: "🤝",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-100",
      borderColor: "border-green-200"
    }
  ];

  const FloatingParticles: React.FC = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );

  const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ end, suffix = "", duration = 2000 }) => {
    const [count, setCount] = useState<number>(0);
    const [started, setStarted] = useState<boolean>(false);

    useEffect(() => {
      if (animatingNumbers && !started) {
        setStarted(true);
        let startTime: number | null = null;
        const animate = (currentTime: number) => {
          if (startTime === null) startTime = currentTime;
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(easeOut * end));
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      }
    }, [animatingNumbers, started, end, duration]);

    return <span>{count}{suffix}</span>;
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }
        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }
        .animate-slide-in-down {
          animation: slideInDown 0.6s ease-out forwards;
        }
        .animate-delay-100 { animation-delay: 0.1s; }
        .animate-delay-200 { animation-delay: 0.2s; }
        .animate-delay-300 { animation-delay: 0.3s; }
        .animate-delay-400 { animation-delay: 0.4s; }
        .animate-delay-500 { animation-delay: 0.5s; }
        .animate-delay-600 { animation-delay: 0.6s; }
        .animate-delay-700 { animation-delay: 0.7s; }
        .animate-delay-800 { animation-delay: 0.8s; }
      `}</style>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <FloatingParticles />
        
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`,
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8 opacity-0 animate-slide-in-down">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg border border-gray-200">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-gray-700 text-sm font-medium">Our Journey</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight opacity-0 animate-fade-in-up animate-delay-200">
            Our 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Story</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto opacity-0 animate-fade-in-up animate-delay-400">
            A tale of passion, perseverance, and the relentless pursuit of making the impossible possible.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up animate-delay-600">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105">
              Discover Our Mission
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 backdrop-blur-sm">
              Watch Our Story
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce opacity-0 animate-fade-in-up animate-delay-800">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            ref={sectionRefs.current[0]}
            className={`mb-12 transition-all duration-1000 ${
              visibleElements.has(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="text-6xl mb-6 block animate-bounce">🎯</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Mission</span>
            </h2>
          </div>
          
          <blockquote 
        //   @ts-ignore
            ref={sectionRefs.current[1]}
            className={`text-2xl md:text-3xl text-gray-700 leading-relaxed italic mb-8 relative transition-all duration-1000 delay-300 ${
              visibleElements.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="text-8xl text-blue-100 absolute -top-4 -left-4 leading-none">"</span>
            To empower individuals and organizations with innovative solutions that transform challenges into opportunities, creating a better tomorrow for everyone.
            <span className="text-8xl text-blue-100 absolute -bottom-8 -right-4 leading-none">"</span>
          </blockquote>
          
          <div 
            ref={sectionRefs.current[2]}
            className={`grid md:grid-cols-3 gap-8 mt-16 transition-all duration-1000 delay-500 ${
              visibleElements.has(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            onTransitionEnd={() => {
              if (visibleElements.has(2)) {
                setAnimatingNumbers(true);
              }
            }}
          >
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                <AnimatedNumber end={10} suffix="M+" />
              </div>
              <p className="text-gray-600 font-medium">Lives Impacted</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                <AnimatedNumber end={150} suffix="+" />
              </div>
              <p className="text-gray-600 font-medium">Countries Reached</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl font-bold text-green-600 mb-2">
                <AnimatedNumber end={500} suffix="+" />
              </div>
              <p className="text-gray-600 font-medium">Team Members</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-6xl mx-auto px-4">
          <div 
            ref={sectionRefs.current[3]}
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleElements.has(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every great story has defining moments. Here are the milestones that shaped who we are today.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-200 to-purple-200 rounded-full hidden md:block"></div>
            
            {milestones.map((milestone, index) => (
              <div
                key={index}
                ref={sectionRefs.current[4 + index]}
                className={`relative mb-16 md:mb-20 transition-all duration-1000 ${
                  visibleElements.has(4 + index) 
                    ? 'opacity-100 translate-x-0' 
                    : `opacity-0 ${index % 2 === 0 ? 'translate-x-10' : '-translate-x-10'}`
                } ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} ${index % 2 === 0 ? 'md:mr-1/2' : 'md:ml-1/2'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="md:absolute md:top-4 left-1/2 transform md:-translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-lg border-4 border-blue-300 flex items-center justify-center text-2xl mb-6 md:mb-0 mx-auto md:mx-0 z-10 hover:scale-110 transition-transform duration-300">
                  {milestone.icon}
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-white font-bold mb-4 bg-gradient-to-r ${milestone.color} shadow-lg`}>
                    {milestone.year}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{milestone.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div 
            ref={sectionRefs.current[10]}
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleElements.has(10) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="text-6xl mb-6 block">⭐</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide us every day and shape our culture.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                ref={sectionRefs.current[11 + index]}
                className={`${value.bgColor} ${value.borderColor} border-2 rounded-2xl p-8 text-center transition-all duration-1000 hover:scale-105 hover:shadow-xl transform ${
                  visibleElements.has(11 + index) 
                    ? 'opacity-100 translate-y-0 rotate-0' 
                    : 'opacity-0 translate-y-10 rotate-3'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="text-4xl mb-4 hover:scale-125 transition-transform duration-300">{value.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-700 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div 
            ref={sectionRefs.current[15]}
            className={`transition-all duration-1000 ${
              visibleElements.has(15) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">Dreamers</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Behind every great story are exceptional people who make it all possible.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                ref={sectionRefs.current[15 + i]}
                className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                  visibleElements.has(15 + i) 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-10 scale-95'
                }`}
                style={{ transitionDelay: `${i * 200}ms` }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white shadow-lg hover:scale-110 transition-transform duration-300">
                  {String.fromCharCode(64 + i)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Team Member {i}</h3>
                <p className="text-gray-600">Passionate about creating amazing experiences</p>
              </div>
            ))}
          </div>
          
          <div 
            ref={sectionRefs.current[19]}
            className={`transition-all duration-1000 delay-500 ${
              visibleElements.has(19) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105">
              Meet Our Full Team
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
            Ready to Be Part of Our Story?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
            Every great story needs passionate people to help write the next chapter. Join us on this incredible journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-400">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105">
              Join Our Team
            </button>
            <button className="border-2 border-white/50 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:border-white">
              Partner With Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurStoryPage;