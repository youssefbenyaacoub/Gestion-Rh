import React, { useState } from 'react';
import { Shield, TrendingUp, Users, Globe, ArrowRight, CheckCircle, Mail, Phone, MapPin, Award, Briefcase, Target } from 'lucide-react';

const CorporateWebsite = ({ onLoginClick }) => {
  const [view, setView] = useState('home'); // 'home', 'expertise', 'about', 'contact'

  const ExpertisePage = () => (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">Nos Domaines d'Intervention</h2>
          <h3 className="text-4xl font-bold text-gray-900 mb-4">Une Expertise Pluridisciplinaire</h3>
          <p className="text-gray-600 text-lg">Nous mobilisons des équipes sur-mesure pour répondre à vos enjeux les plus complexes.</p>
        </div>

        <div className="space-y-20">
          {/* Audit & Assurance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h4 className="text-3xl font-bold text-gray-900 mb-4">Audit & Assurance</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                La confiance est le moteur de l'économie. Nos auditeurs certifient vos comptes avec rigueur et indépendance, apportant une assurance précieuse à vos actionnaires et partenaires.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700"><CheckCircle className="w-5 h-5 text-green-500" /> Audit légal et contractuel</li>
                <li className="flex items-center gap-3 text-gray-700"><CheckCircle className="w-5 h-5 text-green-500" /> Commissariat aux comptes</li>
                <li className="flex items-center gap-3 text-gray-700"><CheckCircle className="w-5 h-5 text-green-500" /> Audit des systèmes d'information</li>
                <li className="flex items-center gap-3 text-gray-700"><CheckCircle className="w-5 h-5 text-green-500" /> Revue des procédures internes</li>
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Audit" className="rounded-2xl shadow-xl" />
            </div>
          </div>

          {/* Conseil Financier */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Finance" className="rounded-2xl shadow-xl" />
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h4 className="text-3xl font-bold text-gray-900 mb-4">Conseil Financier</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Dans un environnement économique incertain, nous vous aidons à sécuriser vos transactions et à optimiser votre performance financière.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700"><CheckCircle className="w-5 h-5 text-green-500" /> Due Diligence & Évaluation</li>
                <li className="flex items-center gap-3 text-gray-700"><CheckCircle className="w-5 h-5 text-green-500" /> Fusions & Acquisitions (M&A)</li>
                <li className="flex items-center gap-3 text-gray-700"><CheckCircle className="w-5 h-5 text-green-500" /> Restructuration financière</li>
                <li className="flex items-center gap-3 text-gray-700"><CheckCircle className="w-5 h-5 text-green-500" /> Gestion de trésorerie</li>
              </ul>
            </div>
          </div>

          {/* Consulting */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h4 className="text-3xl font-bold text-gray-900 mb-4">Consulting & Stratégie</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Nous accompagnons les dirigeants dans leurs prises de décision stratégiques et la transformation de leur organisation.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700"><CheckCircle className="w-5 h-5 text-green-500" /> Stratégie de croissance</li>
                <li className="flex items-center gap-3 text-gray-700"><CheckCircle className="w-5 h-5 text-green-500" /> Transformation digitale</li>
                <li className="flex items-center gap-3 text-gray-700"><CheckCircle className="w-5 h-5 text-green-500" /> Excellence opérationnelle</li>
                <li className="flex items-center gap-3 text-gray-700"><CheckCircle className="w-5 h-5 text-green-500" /> Gestion du changement</li>
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Consulting" className="rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AboutPage = () => (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-slide-up">
          <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">Le Cabinet</h2>
          <h3 className="text-4xl font-bold text-gray-900 mb-4">L'Excellence au Service de la Performance</h3>
          <p className="text-gray-600 text-lg">Depuis plus de 15 ans, Ben Yaacoub Consulting s'impose comme un acteur de référence dans le conseil et l'audit en Tunisie et en Afrique.</p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Excellence</h4>
            <p className="text-gray-600">Nous visons les plus hauts standards de qualité dans chacune de nos missions.</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Intégrité</h4>
            <p className="text-gray-600">L'éthique et l'indépendance sont au cœur de notre relation de confiance avec nos clients.</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Innovation</h4>
            <p className="text-gray-600">Nous réinventons constamment nos méthodes pour anticiper les défis de demain.</p>
          </div>
        </div>

        {/* Story / Team */}
        <div className="bg-blue-900 rounded-3xl overflow-hidden text-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 lg:p-16 flex flex-col justify-center">
              <h3 className="text-3xl font-bold mb-6">Notre Histoire</h3>
              <p className="text-blue-100 mb-6 leading-relaxed text-lg">
                Fondé en 2008 par Youssef Ben Yaacoub, expert-comptable et commissaire aux comptes, le cabinet a connu une croissance soutenue grâce à la fidélité de ses clients et l'engagement de ses équipes.
              </p>
              <p className="text-blue-100 leading-relaxed text-lg">
                Aujourd'hui, nous sommes fiers d'accompagner aussi bien des PME dynamiques que des grands groupes internationaux dans leur développement.
              </p>
            </div>
            <div className="relative h-96 lg:h-auto">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Team" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ContactPage = () => (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">Contactez-nous</h2>
          <h3 className="text-4xl font-bold text-gray-900 mb-4">Parlons de votre projet</h3>
          <p className="text-gray-600 text-lg">Notre équipe d'experts est à votre disposition pour répondre à toutes vos questions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">Nos Coordonnées</h4>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Adresse</h5>
                    <p className="text-gray-600">Centre Urbain Nord, Tunis<br/>1082 Tunisie</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Email</h5>
                    <p className="text-gray-600">contact@benyaacoub-consulting.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Téléphone</h5>
                    <p className="text-gray-600">+216 71 123 456</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-900 p-8 rounded-2xl shadow-lg text-white">
              <h4 className="text-2xl font-bold mb-4">Horaires d'ouverture</h4>
              <ul className="space-y-2">
                <li className="flex justify-between"><span>Lundi - Vendredi</span> <span>08:30 - 17:30</span></li>
                <li className="flex justify-between"><span>Samedi</span> <span>09:00 - 13:00</span></li>
                <li className="flex justify-between"><span>Dimanche</span> <span>Fermé</span></li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h4 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h4>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Votre nom" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Votre prénom" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="votre@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                  <option>Demande de devis</option>
                  <option>Renseignements</option>
                  <option>Candidature</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows="4" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Comment pouvons-nous vous aider ?"></textarea>
              </div>
              <button type="button" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-600/30">
                Envoyer le message
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 bg-white p-4 rounded-2xl shadow-lg border border-gray-100 animate-slide-up hover:scale-[1.01] transition-transform duration-500">
          <h4 className="text-2xl font-bold text-gray-900 mb-6 px-4">Notre Localisation</h4>
          <div className="rounded-xl overflow-hidden h-96 w-full relative z-0">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.466316486534!2d10.19401331529056!3d36.83126897994214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd34c6d1e93d3f%3A0x63a5601fab562d53!2sCentre%20Urbain%20Nord!5e0!3m2!1sfr!2stn!4v1625678901234!5m2!1sfr!2stn" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localisation du Cabinet"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(view) {
      case 'expertise': return <ExpertisePage />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      default: return (
        <>
          {/* Hero Section */}
          <section id="home" className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-100/50 rounded-l-full transform translate-x-1/3"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 animate-slide-up">
                  <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                    L'Audit et le Conseil <br/>
                    <span className="text-blue-600">Réinventés.</span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Accompagner votre croissance avec rigueur, vision et innovation. 
                    Nous transformons vos défis complexes en opportunités durables.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => setView('expertise')} className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-600/30 flex items-center justify-center gap-2">
                      Découvrir nos services <ArrowRight className="w-5 h-5" />
                    </button>
                    <button onClick={() => setView('contact')} className="bg-white text-blue-900 border-2 border-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all flex items-center justify-center">
                      Nous contacter
                    </button>
                  </div>
                  <div className="flex items-center gap-8 pt-4 text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Audit Certifié</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Conseil Stratégique</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                    alt="Consulting Meeting" 
                    className="rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <TrendingUp className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Croissance Client</p>
                        <p className="text-2xl font-bold text-gray-900">+45%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services Preview Section */}
          <section id="services" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">Nos Expertises</h2>
                <h3 className="text-4xl font-bold text-gray-900 mb-4">Des solutions sur mesure pour votre entreprise</h3>
                <p className="text-gray-600 text-lg">Nous combinons expertise technique et vision sectorielle pour vous apporter une valeur ajoutée réelle.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Service 1 */}
                <div onClick={() => setView('expertise')} className="group p-8 rounded-2xl bg-gray-50 hover:bg-blue-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-white">Audit & Assurance</h4>
                  <p className="text-gray-600 mb-6 group-hover:text-blue-100">
                    Certification des comptes, audit interne, et gestion des risques pour garantir la fiabilité de votre information financière.
                  </p>
                  <span className="text-blue-600 font-bold flex items-center gap-2 group-hover:text-white">En savoir plus <ArrowRight className="w-4 h-4" /></span>
                </div>

                {/* Service 2 */}
                <div onClick={() => setView('expertise')} className="group p-8 rounded-2xl bg-gray-50 hover:bg-blue-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-white">Conseil Financier</h4>
                  <p className="text-gray-600 mb-6 group-hover:text-blue-100">
                    Accompagnement dans vos transactions, évaluations, et optimisation de la performance financière.
                  </p>
                  <span className="text-blue-600 font-bold flex items-center gap-2 group-hover:text-white">En savoir plus <ArrowRight className="w-4 h-4" /></span>
                </div>

                {/* Service 3 */}
                <div onClick={() => setView('expertise')} className="group p-8 rounded-2xl bg-gray-50 hover:bg-blue-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors">
                    <Users className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-white">Consulting & Stratégie</h4>
                  <p className="text-gray-600 mb-6 group-hover:text-blue-100">
                    Transformation digitale, organisationnelle et stratégique pour préparer votre entreprise aux défis de demain.
                  </p>
                  <span className="text-blue-600 font-bold flex items-center gap-2 group-hover:text-white">En savoir plus <ArrowRight className="w-4 h-4" /></span>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-20 bg-blue-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold mb-2 text-blue-300">15+</div>
                  <div className="text-blue-100">Années d'expérience</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2 text-blue-300">500+</div>
                  <div className="text-blue-100">Clients satisfaits</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2 text-blue-300">50+</div>
                  <div className="text-blue-100">Consultants experts</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2 text-blue-300">3</div>
                  <div className="text-blue-100">Bureaux internationaux</div>
                </div>
              </div>
            </div>
          </section>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                BY
              </div>
              <span className="text-2xl font-bold text-blue-900 tracking-tight">Ben Yaacoub <span className="text-blue-600">Consulting</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => setView('home')} className={`font-medium transition-colors ${view === 'home' ? 'text-blue-900' : 'text-gray-600 hover:text-blue-900'}`}>Accueil</button>
              <button onClick={() => setView('expertise')} className={`font-medium transition-colors ${view === 'expertise' ? 'text-blue-900' : 'text-gray-600 hover:text-blue-900'}`}>Expertise</button>
              <button onClick={() => setView('about')} className={`font-medium transition-colors ${view === 'about' ? 'text-blue-900' : 'text-gray-600 hover:text-blue-900'}`}>Le Cabinet</button>
              <button onClick={() => setView('contact')} className={`font-medium transition-colors ${view === 'contact' ? 'text-blue-900' : 'text-gray-600 hover:text-blue-900'}`}>Contact</button>
              <button 
                onClick={onLoginClick}
                className="bg-blue-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-900/20"
              >
                Espace Employé
              </button>
            </div>
          </div>
        </div>
      </nav>

      {renderContent()}

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">BY</div>
                <span className="text-xl font-bold text-white">Ben Yaacoub Consulting</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                Partenaire de confiance pour votre réussite. Nous nous engageons à fournir des services d'audit et de conseil de la plus haute qualité.
              </p>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Services</h5>
              <ul className="space-y-2">
                <li><button onClick={() => setView('expertise')} className="hover:text-blue-400 transition-colors">Audit Financier</button></li>
                <li><button onClick={() => setView('expertise')} className="hover:text-blue-400 transition-colors">Conseil Fiscal</button></li>
                <li><button onClick={() => setView('expertise')} className="hover:text-blue-400 transition-colors">Gestion des Risques</button></li>
                <li><button onClick={() => setView('expertise')} className="hover:text-blue-400 transition-colors">Transformation Digitale</button></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Contact</h5>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><Globe className="w-4 h-4" /> Tunis, Tunisie</li>
                <li>contact@benyaacoub-consulting.com</li>
                <li>+216 71 123 456</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
            &copy; 2025 Ben Yaacoub Consulting. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CorporateWebsite;
