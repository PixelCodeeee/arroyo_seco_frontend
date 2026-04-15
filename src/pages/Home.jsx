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
            En el corazón de la Sierra Gorda queretana se encuentra Arroyo Seco, un rincón mágico donde los ríos de aguas turquesa y esmeralda se encuentran sin mezclarse, los bosques de encinos y pinos custodian historias milenarias, y la calidez de su gente se siente en cada platillo y en cada pieza artesanal.
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
          <img
            src="/images/pan.jpeg"
            alt="Pan artesanal"
            className="img-top"
            style={{ width: "300px", height: "auto" }}
          />
          <img
            src="/images/taco.png"
            alt="Platillo típico"
            className="img-bottom"
          />
        </div>
        <div className="gastronomia-text">
          <h2>
            Nuestra <span>Gastronomía</span>
          </h2>
          <p>
            En las cocinas de Arroyo Seco late el alma de la Sierra Gorda. Sabores intensos, ingredientes locales y recetas que se han transmitido de generación en generación te esperan. Ven y descubre por qué nuestra gastronomía es uno de los mayores tesoros de Querétaro.
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
            Las manos de nuestros artesanos cuentan la historia de Arroyo Seco. Con cuero, madera y barro crean obras llenas de color, tradición y orgullo serrano. Ven y descubre las auténticas artesanías que hacen único a nuestro municipio.
          </p>
          <Link to="/gastronomia" className="btn-primary">
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
