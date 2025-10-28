import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import { Play, Pause, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


function Home() {

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const handlePlayToggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };
  return (
    <div className="home-page">
        
      <Navbar />

{/* Hero Section */}
<section className="hero-section relative overflow-hidden rounded-[30px] mt-[60px] h-[90vh]">
      {/* Video Background */}
      <div className="hero-video absolute inset-0 rounded-[30px] overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/videos/arroyo.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Overlay */}
        <div className="overlay absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Descubre <span className="text-amber-400">Arroyo Seco</span>
          </h1>
          <div
            className="play-btn border-2 border-white rounded-full p-6 hover:bg-white/20 transition cursor-pointer flex items-center justify-center"
            onClick={handlePlayToggle}
          >
            {isPlaying ? <Pause size={64} /> : <Play size={64} />}
          </div>
        </div>
      </div>
    </section>

      {/* Tesoro Section */}
      <section className="tesoro-section">
        <div className="tesoro-text">
          <h2>
            El <span>Tesoro Escondido</span> <br /> De Querétaro
          </h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
          </p>
          <Link to="/register" className="btn-primary">
            Regístrate
          </Link>
        </div>
        <div className="tesoro-img"></div>
        <div className="scroll-icon">
          <ChevronDown size={28} />
        </div>
      </section>

      {/* Gastronomía Section */}
      <section className="gastronomia-section">
        <div className="gastronomia-imgs">
          <img src="/images/pan.png" alt="Pan artesanal" className="img-top" />
          <img src="/images/taco.png" alt="Platillo típico" className="img-bottom" />
        </div>
        <div className="gastronomia-text">
          <h2>
            Nuestra <span>Gastronomía</span>
          </h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
          </p>
          <Link to="/gastronomia" className="btn-secondary">
            Explora
          </Link>
        </div>
      </section>

      {/* Artesanías Section */}
      <section className="artesanias-section">
        <div className="artesanias-text">
          <h2>
            Nuestras <span>Artesanías</span>
          </h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
          </p>
          <Link to="/artesanias" className="btn-primary">
            Explora
          </Link>
        </div>
        <div className="artesanias-imgs">
          <img src="/images/artesania1.png" alt="Artesanía 1" />
          <img src="/images/artesania2.png" alt="Artesanía 2" />
        </div>
      </section>

        <Footer />
    </div>
  );
}

export default Home;
