import { FaFacebook, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Grid de columnas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Columna 1 - Contacto */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">CONTÁCTANOS</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-blue-300" />
                <span>Calle 50 /42-30, Medellín, Colombia</span>
              </li>
              <li className="flex items-start">
                <FaPhoneAlt className="mt-1 mr-3 text-blue-300" />
                <span>+57 604 123 4567</span>
              </li>
              <li className="flex items-start">
                <FaWhatsapp className="mt-1 mr-3 text-blue-300" />
                <span>+57 300 123 4567</span>
              </li>
              <li className="flex items-start">
                <FaEnvelope className="mt-1 mr-3 text-blue-300" />
                <span>contacto@pcvasquez.com</span>
              </li>
            </ul>
          </div>

          {/* Columna 2 - Horarios */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">HORARIOS</h3>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span>Lunes a Viernes:</span>
                <span>8:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sábados:</span>
                <span>9:00 AM - 2:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Domingos:</span>
                <span>Cerrado</span>
              </li>
            </ul>
          </div>

          {/* Columna 3 - Enlaces rápidos */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">ENLACES RÁPIDOS</h3>
            <ul className="space-y-3">
              <li><a href="/" className="hover:text-blue-300 transition">Inicio</a></li>
              <li><a href="/" className="hover:text-blue-300 transition">Catálogo</a></li>
              <li><a href="/" className="hover:text-blue-300 transition">Promociones</a></li>
              <li><a href="/" className="hover:text-blue-300 transition">Servicio Técnico</a></li>
              <li><a href="/" className="hover:text-blue-300 transition">Políticas de Garantía</a></li>
            </ul>
          </div>

          {/* Columna 4 - Redes sociales */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">SÍGUENOS</h3>
            <div className="flex space-x-4 mb-6">
              <a href="/" className="bg-blue-600 hover:bg-blue-700 w-10 h-10 rounded-full flex items-center justify-center transition">
                <FaFacebook size={18} />
              </a>
              <a href="/" className="bg-pink-600 hover:bg-pink-700 w-10 h-10 rounded-full flex items-center justify-center transition">
                <FaInstagram size={18} />
              </a>
              <a href="/" className="bg-green-500 hover:bg-green-600 w-10 h-10 rounded-full flex items-center justify-center transition">
                <FaWhatsapp size={18} />
              </a>
            </div>
            
            <h4 className="font-medium mb-2">SUSCRÍBETE</h4>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="px-4 py-2 rounded-l-lg focus:outline-none text-gray-900 w-full"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition">
                Enviar
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <img 
              src="/logo-pcvasquez-white.png" 
              alt="PC Vásquez" 
              className="h-10"
            />
          </div>
          <div className="text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} PC Vásquez SAS. Todos los derechos reservados.</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="/" className="text-sm hover:text-blue-300 transition">Términos y condiciones</a>
            <a href="/" className="text-sm hover:text-blue-300 transition">Política de privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer