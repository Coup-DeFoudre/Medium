import { Link } from 'react-router-dom';
import flowerImg from '../assets/flower.jpeg';

const HeroLanding = () => {
  return (
    <main className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-24 gap-10 md:gap-0 py-12 md:py-0">
        {/* Text Section */}
        <div className="w-full md:w-1/2 text-center md:text-left animate-fade-in">
          <h1 className="text-[8vw] md:text-[5vw] lg:text-6xl font-serif font-bold leading-tight text-black mb-4">
            Human <br /> stories & ideas
          </h1>
          <p className="text-[4vw] md:text-[1.5vw] lg:text-xl mt-4 text-gray-700 leading-relaxed max-w-lg">
            A place to read, write, and deepen your understanding of the world around you.
          </p>
          <Link to="/blogs">
            <button className="mt-8 bg-gradient-to-r from-gray-900 to-black text-white px-8 py-4 rounded-full text-[3.5vw] md:text-[1vw] lg:text-lg font-medium hover:scale-105 hover:shadow-xl transition-all duration-300 transform">
              Start reading
            </button>
          </Link>
          
          {/* Additional CTA */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start">
            <Link to="/create-blog">
              <button className="text-gray-600 hover:text-black border border-gray-300 hover:border-gray-400 px-6 py-3 rounded-full text-[3vw] md:text-[0.9vw] lg:text-base font-medium transition-all duration-300">
                Start writing
              </button>
            </Link>
            <span className="text-gray-400 text-sm hidden sm:inline">•</span>
            <Link to="/blogs" className="text-gray-600 hover:text-black text-[3vw] md:text-[0.9vw] lg:text-base font-medium transition-colors duration-300">
              Explore topics
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center animate-slide-in">
          <div className="relative">
            <img
              src={flowerImg}
              alt="Medium Art"
              className="w-[80%] md:w-[90%] max-w-[500px] h-auto object-contain transition-transform duration-500 hover:scale-105 "
            />
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-green-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
      </main>
  )
}

export default HeroLanding