import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserShield,
  faChalkboardTeacher,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { useForm, ValidationError } from "@formspree/react";

const WelcomePage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Three.js setup (unchanged)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(0.5, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.3,
    });

    const particles = [];
    for (let i = 0; i < 20; i++) {
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.x = (Math.random() - 0.5) * 20;
      sphere.position.y = (Math.random() - 0.5) * 20;
      sphere.position.z = (Math.random() - 0.5) * 10;
      particles.push(sphere);
      scene.add(sphere);
    }

    camera.position.z = 10;
    sceneRef.current = { scene, camera, renderer, particles, geometry, material };

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      particles.forEach((particle, index) => {
        particle.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
        particle.position.x += Math.cos(Date.now() * 0.0008 + index) * 0.001;
      });
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (sceneRef.current) {
        sceneRef.current.camera.aspect = window.innerWidth / window.innerHeight;
        sceneRef.current.camera.updateProjectionMatrix();
        sceneRef.current.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      particles.forEach((particle) => scene.remove(particle));
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  // Formspree Contact Form Component
  const ContactForm = () => {
    const [state, handleSubmit] = useForm("xdkzkewq"); // Replace with your Formspree form ID

    if (state.succeeded) {
      return (
        <div className="text-green-400 text-sm" id="form-success">
          Message sent successfully! We'll get back to you soon.
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
            required
            aria-label="Your Name"
            aria-describedby="name-error"
          />
          <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-sm mt-1" />
        </div>
        <div>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
            required
            aria-label="Your Email"
            aria-describedby="email-error"
          />
          <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-sm mt-1" />
        </div>
        <div>
          <select
            id="service"
            name="service"
            className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
            required
            aria-label="Select Service"
            aria-describedby="service-error"
          >
            <option value="">Select Service</option>
            <option value="btech">B.Tech Examinations</option>
            <option value="employee">Employee Assessments</option>
          </select>
          <ValidationError prefix="Service" field="service" errors={state.errors} className="text-red-400 text-sm mt-1" />
        </div>
        <div>
          <textarea
            id="message"
            name="message"
            placeholder="Your Message"
            rows={4}
            className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
            required
            aria-label="Your Message"
            aria-describedby="message-error"
          ></textarea>
          <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-sm mt-1" />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          disabled={state.submitting}
        >
          {state.submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 to-blue-900 text-white font-sans overflow-x-hidden">
      {/* Three.js Background */}
      <div
        ref={mountRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      {/* Navigation (unchanged) */}
      <nav className="fixed top-0 w-full bg-black/30 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-400">ExamPortal Pro</h1>
            <div className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className="hover:text-blue-400 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="hover:text-blue-400 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="hover:text-blue-400 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="hover:text-blue-400 transition-colors"
              >
                Contact
              </button>
            </div>
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
            <div className="relative">
              <button
                className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
                aria-label="Toggle login options"
              >
                Login
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-[#2C3E50] rounded-lg shadow-lg z-10 border border-[#3A547D]">
                  <Link
                    to="/login"
                    className="flex items-center px-4 py-2 text-white no-underline hover:bg-[#3A547D] transition-colors duration-200"
                    onClick={toggleDropdown}
                  >
                    <FontAwesomeIcon icon={faUserShield} className="mr-2" />
                    Admin Login
                  </Link>
                  <Link
                    to="/teacher-login"
                    className="flex items-center px-4 py-2 text-white no-underline hover:bg-[#3A547D] transition-colors duration-200"
                    onClick={toggleDropdown}
                  >
                    <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" />
                    Teacher Login
                  </Link>
                  <Link
                    to="/student-login"
                    className="flex items-center px-4 py-2 text-white no-underline hover:bg-[#3A547D] transition-colors duration-200"
                    onClick={toggleDropdown}
                  >
                    <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                    Student Login
                  </Link>
                </div>
              )}
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("home")}
                className="hover:text-blue-400 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="hover:text-blue-400 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="hover:text-blue-400 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="hover:text-blue-400 transition-colors"
              >
                Contact
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section (unchanged) */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center px-6 pt-20 relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Digital Examination
            <br />
            <span className="text-blue-400">Platform</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Secure and reliable online examinations for B.Tech students and employee
            assessments
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-lg font-semibold mb-2">Secure Testing</h3>
              <p className="text-gray-300 text-sm">Advanced security features</p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Real-time Results</h3>
              <p className="text-gray-300 text-sm">Instant feedback and grading</p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="text-lg font-semibold mb-2">Multi-Device</h3>
              <p className="text-gray-300 text-sm">Works on all devices</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section (unchanged) */}
      <section id="about" className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-blue-400">About Us</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Leading provider of digital examination solutions for educational
              institutions and corporations
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Transforming Assessments</h3>
              <p className="text-gray-300 mb-4">
                Our platform serves both B.Tech students and corporate employees,
                providing secure, reliable, and user-friendly examination experiences.
              </p>
              <p className="text-gray-300 mb-6">
                With advanced features like real-time monitoring, automated grading,
                and comprehensive analytics, we ensure fair and efficient testing
                processes.
              </p>
            </div>
            <div className="bg-blue-600/20 p-8 rounded-lg">
              <h4 className="text-xl font-bold mb-4">Why Choose Us?</h4>
              <ul className="space-y-3 text-gray-300">
                <li>• Advanced security and anti-cheat technology</li>
                <li>• User-friendly interface for all skill levels</li>
                <li>• 24/7 technical support and assistance</li>
                <li>• Customizable exam formats and questions</li>
                <li>• Detailed analytics and reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (unchanged) */}
      <section id="features" className="py-20 px-6 bg-black/20 relative z-2">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-blue-400">Key Features</h2>
            <p className="text-xl text-gray-300">
              Everything you need for modern digital examinations
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-white/5 rounded-lg">
              <div className="text-3xl mb-4">🎓</div>
              <h3 className="text-xl font-bold mb-3">B.Tech Exams</h3>
              <p className="text-gray-300">
                Specialized for engineering students with technical question banks
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-lg">
              <div className="text-3xl mb-4">💼</div>
              <h3 className="text-xl font-bold mb-3">Employee Testing</h3>
              <p className="text-gray-300">
                Corporate assessments and skill evaluation tools
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-lg">
              <div className="text-3xl mb-4">🔐</div>
              <h3 className="text-xl font-bold mb-3">Secure Environment</h3>
              <p className="text-gray-300">
                Advanced proctoring and monitoring capabilities
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-lg">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">Analytics</h3>
              <p className="text-gray-300">
                Detailed performance reports and insights
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-lg">
              <div className="text-3xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold mb-3">Customizable</h3>
              <p className="text-gray-300">Flexible settings to match your requirements</p>
            </div>
            <div className="p-6 bg-white/5 rounded-lg">
              <div className="text-3xl mb-4">🌐</div>
              <h3 className="text-xl font-bold mb-3">Multi-Platform</h3>
              <p className="text-gray-300">
                Works seamlessly across all devices and browsers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section (Updated with Formspree) */}
      <section id="contact" className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-blue-400">Contact Us</h2>
            <p className="text-xl text-gray-300">Get in touch for demos and inquiries</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    📧
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-gray-300">sateeshreddymaddi@gmail.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    📱
                  </div>
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-gray-300">+91 9876543211</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    ⏰
                  </div>
                  <div>
                    <div className="font-semibold">Support</div>
                    <div className="text-gray-300">24/7 Available</div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    aria-label="Visit our Facebook page"
                  >
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    aria-label="Visit our Twitter page"
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    aria-label="Visit our LinkedIn page"
                  >
                    <FontAwesomeIcon icon={faLinkedinIn} />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    aria-label="Visit our Instagram page"
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-white/5 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-6">Send Message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer (unchanged) */}
      <footer className="bg-black/30 py-12 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-400">ExamPortal Pro</h3>
              <p className="text-gray-400 text-sm">
                Leading digital examination platform for educational institutions and
                corporations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>B.Tech Examinations</li>
                <li>Employee Testing</li>
                <li>Custom Solutions</li>
                <li>Technical Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Live Chat</li>
                <li>System Status</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} ExamPortal Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
