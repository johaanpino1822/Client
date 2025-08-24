import React from 'react';
import { Link } from 'react-router-dom';
import { FaLaptop, FaSearch, FaStar, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HeroWelcome = () => {
  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A2E38] via-[#072A32] to-[#051F26]">
      {/* Efecto de partículas animadas */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#B5EAD7] opacity-20"
          style={{
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, (Math.random() * 100) - 50],
            x: [0, (Math.random() * 60) - 30],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}

      {/* Fondo con efecto parallax */}
      <motion.div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-10 mix-blend-soft-light"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
      />
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto"
        >
          {/* Título principal */}
          <motion.div 
            className="mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                background: 'linear-gradient(45deg, #C7A8FF 30%, #7FDBFF 70%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '1.5px',
                fontWeight: 400
              }}
              whileHover={{ scale: 1.02 }}
            >
              PC<span className="font-bold" style={{ fontWeight: 700 }}>VASQUEZ</span>
            </motion.h1>
            
            <motion.div 
              className="w-32 h-1 bg-gradient-to-r from-[#C7A8FF] to-[#7FDBFF] mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            />
          </motion.div>
          
          {/* Subtítulo */}
          <motion.div 
            className="mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <p className="text-xl md:text-2xl text-[#7FDBFF] mb-6 max-w-3xl mx-auto font-light leading-relaxed tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <span className="inline-block">
                EQUIPOS DE <span className="font-semibold text-[#FF9FF3]">ALTO RENDIMIENTO</span> PARA TODAS TUS
              </span>
              <br />
              <span className="inline-block">
                NECESIDADES <span className="font-semibold text-[#FF9FF3]">TECNOLÓGICAS</span>
              </span>
            </p>
          </motion.div>
          
          {/* Botón CTA */}
          <motion.div 
            className="flex justify-center mb-20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-[#FF9FF3] rounded-lg blur-md opacity-50 -z-10"></div>
              <Link 
                to="/products" 
                className="relative bg-gradient-to-br from-[#5E2B97] to-[#C7A8FF] hover:from-[#4B2280] hover:to-[#B597F5] text-white font-semibold py-4 px-10 rounded-lg text-lg transition-all duration-300 shadow-xl hover:shadow-[0_20px_50px_rgba(94,43,151,0.4)] flex items-center justify-center group overflow-hidden uppercase tracking-wider" 
                style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '1px' }}
              >
                <span className="relative z-10 flex items-center">
                  <FaSearch className="mr-3 group-hover:rotate-12 transition-transform" />
                  Descubrir Productos
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -rotate-45 scale-x-150"></span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Tarjetas de beneficios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { 
                icon: <FaLaptop className="text-3xl" />, 
                text: "TECNOLOGÍA DE ÚLTIMA GENERACIÓN", 
                gradient: "bg-gradient-to-r from-[#C7A8FF] to-[#B597F5]" 
              },
              { 
                icon: <FaShieldAlt className="text-3xl" />, 
                text: "GARANTÍA EXTENDIDA", 
                gradient: "bg-gradient-to-r from-[#7FDBFF] to-[#6AC4E5]" 
              },
              { 
                icon: <FaStar className="text-3xl" />, 
                text: "CALIDAD PREMIUM", 
                gradient: "bg-gradient-to-r from-[#5E2B97] to-[#4B2280]" 
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`${item.gradient} rounded-lg p-0.5 overflow-hidden`}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 * index, duration: 0.5 }}
                whileHover={{ y: -10 }}
              >
                <div className="bg-[#0A2E38]/90 backdrop-blur-sm rounded-[10px] p-5 h-full">
                  <div className={`text-4xl mb-4 ${item.gradient} text-transparent bg-clip-text`}>
                    {item.icon}
                  </div>
                  <p className="text-[#E0F7FA] font-medium uppercase text-sm tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Efecto de onda decorativo */}
      <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="absolute bottom-0 left-0 right-0 h-full w-full"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            fill="#5E2B97" 
            opacity="0.4"
          />
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            fill="#C7A8FF" 
            opacity="0.3"
          />
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            fill="#7FDBFF" 
            opacity="0.2"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroWelcome;