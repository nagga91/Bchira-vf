import { MapPin, Phone, Mail, Facebook , Youtube,Music2, Linkedin, Send } from "lucide-react";
import logo from '../assets/images/logo.png'
import { Input , Button } from "antd";
import {FaTiktok} from 'react-icons/fa'
const Contact = () => {
  return (
    <footer className="contact-section py-12">
      <div className="container mx-auto px-6">
        {/* Main Grid */}
        <div className="grid items-center grid-cols-3 h-fit md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="contact-info">
            <h3 className="text-lg font-semibold mb-4">INFOS DE CONTACT</h3>
            <div className="space-y-4 text-gray-700">
              <p className="flex items-start gap-3">
                <span className="p-2 text-white rounded-full">
                  <MapPin className="icon-contact" size={20} />
                </span>
                Raoued rond-point Sidi Omor
              </p>
              <p className="flex items-center gap-3">
                <span className="p-2 text-white rounded-full">
                  <Phone className="icon-contact" size={20} />
                </span>
                92171375
              </p>
              <p className="flex items-center gap-3">
                <span className="p-2 text-white rounded-full">
                  <Mail className="icon-contact" size={20} />
                </span>
                Theme@Demo.Com
              </p>
            </div>
          </div>
          <div>
        <img src={logo} width={300} alt="rideau bchira logo" />

        </div>
          {/* Information */}
          <div className="info-contact">
            <h3 className="text-lg font-semibold mb-4">INFORMATIONS</h3>
            <ul className="space-y-2">
              <li className="cursor-pointer">Conditions générales</li>
              <li className="cursor-pointer">Informations de livraison</li>
              <li className="cursor-pointe">Politique de confidentialité</li>
              <li className="cursor-pointer">Contactez-nous</li>
            </ul>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-end">
          {/* Logo & Socials */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex gap-3 mt-4">
              {[
                { icon: Facebook, link: "https://www.facebook.com/profile.php?id=61569155184641" },
                { icon: Music2, link: "https://www.tiktok.com/@rideaux.bchira?_t=8rWM24CC6Rr&_r=1" },
                { icon: Youtube, link: "#" },
              ].map(({ icon: Icon  , link}, index) => (
                <div key={index} className="w-10 h-10 flex items-center justify-center rounded-md cursor-pointer transition">
                  
                     <a href={link} target="_blank" rel="noopener noreferrer">
                     <Icon size={20} className="text-white social-icon" />
                     </a>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="mt-6 md:mt-0">
            <h3 className="text-lg font-semibold mb-3 text-center md:text-left">S'ABONNER À LA NEWSLETTER</h3>
            <div className="flex">
              <Input
                addonAfter={<Send size={20} />}
                type="email"
                placeholder="Entrez votre e-mail ici..."
                className="p-3 w-64 border border-gray-300 rounded-l-md focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
