import { Link } from 'react-router-dom';
import flowerImg from '../assets/flower.jpeg';

const HeroLanding = () => {
  return (
    <main className="flex-1 flex flex-col md:flex-row items-center justify-between px-6 md:px-24 gap-10 md:gap-0">
        {/* Text Section */}
        <div className="w-full md:w-1/2 text-center md:text-left animate-fade-in">
          <h1 className="text-[8vw] md:text-[5vw] font-serif font-bold leading-tight text-black">
            Human <br /> stories & ideas
          </h1>
          <p className="text-[4vw] md:text-[1.5vw] mt-4 text-gray-800">
            A place to read, write, and deepen your understanding
          </p>
        <Link to = {'/blogs'}>  <button className="mt-6 bg-black text-white px-6 py-3 rounded-full text-[3.5vw] md:text-[1vw] hover:scale-105 transition-transform duration-300">
            Start reading
          </button></Link>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center animate-slide-in">
          <img
            src={flowerImg}
            alt="Medium Art"
            className="w-[80%] md:w-[90%] max-w-[500px] h-auto object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>
      </main>
  )
}

export default HeroLanding
