import React from 'react';
import { Container, Section, GeneratedImage } from './ui';

const perks = [
  {
    title: "Save time & money",
    description: "Remain informed about any product trends, market shifts, or potential opportunities that might help scale your business.",
    prompt: "minimalist map illustration with route connections, line art style, blue and grey"
  },
  {
    title: "Handsfree",
    description: "Receive algorithmically detected product drops on a weekly basis, straight to your USDrop portfolio.",
    prompt: "minimalist calendar interface with notification bubbles, clean ui vector style"
  },
  {
    title: "One sale, bill paid",
    description: "Roughly one sale is all you need to cover the cost of a subscription with us. On the other hand, one winner could do wonders.",
    prompt: "minimalist receipt or bill illustration being stamped paid, clean vector art style"
  }
];

export const Perks: React.FC = () => {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Perks of USDrop</h2>
          <p className="text-slate-500 mt-2">Built by sellers for sellers with the mission to help entrepreneurs start and grow successful businesses.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {perks.map((perk, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-blue-200 transition-colors">
              <div className="aspect-square w-full mb-6 bg-slate-50 rounded-2xl overflow-hidden relative border border-slate-100">
                 <GeneratedImage 
                   prompt={perk.prompt} 
                   className="w-full h-full object-cover opacity-80"
                 />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{perk.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                {perk.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};