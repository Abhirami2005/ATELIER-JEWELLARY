import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Crown, Mail, Phone, User, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Consultation } from '../types';

interface ConsultationFormProps {
  onBookConsultation: (consultation: Omit<Consultation, 'id' | 'status'>) => void;
}

const SERVICES = [
  {
    id: 'Bespoke Design',
    title: 'Bespoke Co-Design Session',
    desc: 'Work directly with our lead artisans to co-create a one-of-a-kind heritage piece.'
  },
  {
    id: 'Bridal Consultation',
    title: 'Bridal Set Consultation',
    desc: 'Find or customize the perfect bridal trousseau sets matching your wedding attire.'
  },
  {
    id: 'Private Showroom Viewing',
    title: 'Private Showroom Viewing',
    desc: 'An exclusive individual tour of our premium collections at the physical atelier.'
  },
  {
    id: 'Sizing & Care',
    title: 'Sizing, Appraisals & Care',
    desc: 'Schedule detailed GIA inspections, physical sizing adjustments, and ultrasonic cleaning.'
  }
];

export default function ConsultationForm({ onBookConsultation }: ConsultationFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('Bespoke Design');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !date || !time) return;

    onBookConsultation({
      name,
      email,
      phone,
      date,
      time,
      serviceRequested: service as any,
      notes,
    });

    setSuccess(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setDate('');
      setTime('');
      setService('Bespoke Design');
      setNotes('');
      setSuccess(false);
    }, 4000);
  };

  return (
    <section id="consultation" className="relative bg-transparent py-24 border-t border-[#1d2f30]">
      {/* Background radial soft light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Information Column (Left) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 text-left">
            <div className="flex items-center space-x-2">
              <div className="h-[1px] w-8 bg-[#c5a059]" />
              <span className="font-display text-xs tracking-[0.25em] text-[#c5a059] uppercase font-semibold">
                ATELIER SUITE
              </span>
            </div>

            <h2 className="font-luxury-title text-3xl md:text-5xl font-medium leading-tight text-white">
              Schedule a Private <br />
              <span className="italic font-normal text-gold-gradient">Atelier Consultation</span>
            </h2>

            <p className="font-sans text-xs md:text-sm text-neutral-400 leading-relaxed">
              Step into the world of luxury design. Choose between a virtual consultation with our jewelry curators, or schedule an exclusive visit to our private showroom. Allow us to personalize your selection experience to perfection.
            </p>

            <div className="pt-6 space-y-4">
              <div className="flex items-start space-x-3.5">
                <div className="h-9 w-9 rounded border border-[#1d2f30] bg-[#111e1f] flex items-center justify-center shrink-0">
                  <Crown className="h-4.5 w-4.5 text-[#c5a059]" />
                </div>
                <div>
                  <h4 className="font-serif text-sm text-neutral-200">Bespoke Guidance</h4>
                  <p className="text-xs text-neutral-500">Unmatched access to high-jewelry gemological reports and rare rough designs.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="h-9 w-9 rounded border border-[#1d2f30] bg-[#111e1f] flex items-center justify-center shrink-0">
                  <Clock className="h-4.5 w-4.5 text-[#c5a059]" />
                </div>
                <div>
                  <h4 className="font-serif text-sm text-neutral-200">1-on-1 Dedicated Time</h4>
                  <p className="text-xs text-neutral-500">Enjoy 45 minutes of dedicated private viewing with luxury jewellery advisors.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Booking Card (Right) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-lg border border-[#1d2f30] bg-[#111e1f] p-8 md:p-10 shadow-gold-glow overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059]/40 to-transparent" />
              
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-16 text-center space-y-4"
                  >
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#c5a059]/10 border border-[#c5a059]/50 text-[#c5a059] mb-2">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="font-luxury-title text-2xl text-white font-medium">Reservation Requested</h3>
                    <p className="font-sans text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                      Thank you, {name}. Your private consultation request has been submitted. Our luxury relations team will verify schedule slots and send a confirmation to <span className="text-neutral-200 font-medium">{email}</span> within 2 hours.
                    </p>
                    <p className="text-[10px] text-[#c5a059] font-display uppercase tracking-widest font-semibold pt-4">
                      STAFF SYNCED IN REAL-TIME
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6 text-left"
                  >
                    {/* Services Choice Pills */}
                    <div>
                      <label className="block text-[10px] font-display tracking-widest text-neutral-400 uppercase mb-3 font-semibold">
                        Select Consultation Type
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {SERVICES.map((srv) => (
                          <button
                            key={srv.id}
                            type="button"
                            onClick={() => setService(srv.id)}
                            className={`p-4 rounded border text-left transition-all duration-300 cursor-pointer ${
                              service === srv.id
                                ? 'border-[#c5a059] bg-[#c5a059]/5 text-[#c5a059] shadow-inner-gold'
                                : 'border-[#1d2f30] bg-[#0a1617]/40 text-neutral-400 hover:border-[#c5a059]'
                            }`}
                          >
                            <h4 className="font-serif text-sm font-medium mb-1">{srv.title}</h4>
                            <p className="text-[10px] text-neutral-500 leading-normal">{srv.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-[1px] bg-[#1d2f30]/75 my-6" />

                    {/* Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                          Your Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                          <input
                            required
                            type="text"
                            placeholder="e.g. Priyesh Patel"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-3.5 pl-10 pr-4 text-xs text-neutral-200 placeholder-neutral-600 focus:border-[#c5a059] focus:outline-none focus:ring-1 focus:ring-[#c5a059]/50"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                          <input
                            required
                            type="email"
                            placeholder="e.g. client@luxury.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-3.5 pl-10 pr-4 text-xs text-neutral-200 placeholder-neutral-600 focus:border-[#c5a059] focus:outline-none focus:ring-1 focus:ring-[#c5a059]/50"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                          <input
                            required
                            type="tel"
                            placeholder="e.g. +91 99000 88800"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-3.5 pl-10 pr-4 text-xs text-neutral-200 placeholder-neutral-600 focus:border-[#c5a059] focus:outline-none focus:ring-1 focus:ring-[#c5a059]/50"
                          />
                        </div>
                      </div>

                      {/* Schedule Group */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                            Date
                          </label>
                          <input
                            required
                            type="date"
                            value={date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-3.5 px-3.5 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none focus:ring-1 focus:ring-[#c5a059]/50"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                            Preferred Time
                          </label>
                          <input
                            required
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-3.5 px-3.5 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none focus:ring-1 focus:ring-[#c5a059]/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Special Notes */}
                    <div className="space-y-2">
                      <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                        Special Notes or Design Preferences (Optional)
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-neutral-500" />
                        <textarea
                          rows={3}
                          placeholder="Tell us about metal preferences, ring sizes, specific gemstone interests, or milestone celebrations."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-3 pl-10 pr-4 text-xs text-neutral-200 placeholder-neutral-600 focus:border-[#c5a059] focus:outline-none focus:ring-1 focus:ring-[#c5a059]/50"
                        />
                      </div>
                    </div>

                    {/* Book Action */}
                    <button
                      type="submit"
                      className="w-full rounded bg-gold-gradient py-4 text-xs font-display font-bold uppercase tracking-[0.2em] text-black hover:opacity-95 shadow-gold-glow transition-all duration-300 cursor-pointer"
                    >
                      REQUEST SECURE RESERVATION
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
