'use client';

import { useEffect, useState } from 'react';
import { Heart, Coffee, ExternalLink, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Sponsor {
  id: string;
  name: string;
  message?: string;
  amount: number;
  tier: 'supporter' | 'champion' | 'founding' | 'monthly' | 'founder';
  avatar?: string | null;
  url?: string | null;
  timestamp: string;
}

const TIER_CONFIG: Record<string, { label: string; color: string; icon: typeof Heart }> = {
  founder:  { label: 'Founder',            color: '#06b6d4', icon: Star },
  founding: { label: 'Founding Supporter', color: '#06b6d4', icon: Star },
  monthly:  { label: 'Monthly Backer',     color: '#ec4899', icon: Heart },
  champion: { label: 'Champion',           color: '#f59e0b', icon: Coffee },
  supporter:{ label: 'Supporter',          color: '#a78bfa', icon: Coffee },
};

function SponsorCard({ sponsor, index }: { sponsor: Sponsor; index: number }) {
  const tier = TIER_CONFIG[sponsor.tier] || TIER_CONFIG.supporter;
  const Icon = tier.icon;
  const initial = sponsor.name.charAt(0).toUpperCase();
  const date = new Date(sponsor.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10
                 hover:border-white/20 hover:bg-white/8 transition-all duration-300"
    >
      {/* Avatar */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
        style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.color}88)` }}
      >
        {sponsor.avatar ? (
          <img src={sponsor.avatar} alt={sponsor.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          initial
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-white text-sm truncate">
            {sponsor.url ? (
              <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {sponsor.name}
              </a>
            ) : (
              sponsor.name
            )}
          </span>
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{ background: `${tier.color}22`, color: tier.color, border: `1px solid ${tier.color}44` }}
          >
            <Icon size={10} />
            {tier.label}
          </span>
        </div>
        {sponsor.message && (
          <p className="text-white/50 text-xs mt-1 leading-relaxed line-clamp-2 italic">
            &ldquo;{sponsor.message}&rdquo;
          </p>
        )}
        <span className="text-white/30 text-[10px] mt-1 block">{date}</span>
      </div>
    </motion.div>
  );
}

export function SponsorsSection() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sponsors')
      .then((r) => r.json())
      .then((data) => {
        setSponsors(data.sponsors || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalRaised = sponsors.reduce((sum, s) => sum + (s.amount || 0), 0);
  const totalSponsors = sponsors.filter((s) => s.tier !== 'founder').length;

  return (
    <section className="relative py-20 px-6 overflow-hidden" id="sponsors">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-6">
            <Heart size={14} className="animate-pulse" />
            Community Powered
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Supporters</span>
          </h2>
          <p className="text-white/50 max-w-lg mx-auto">
            FlowSight is free and privacy-first. These amazing people help keep it that way.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalSponsors}</div>
              <div className="text-xs text-white/40">Supporters</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">
                {loading ? '...' : `€${totalRaised.toFixed(0)}`}
              </div>
              <div className="text-xs text-white/40">Raised</div>
            </div>
          </div>
        </motion.div>

        {/* Sponsors grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        ) : sponsors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
            {sponsors
              .sort((a, b) => {
                const tierOrder = ['founding', 'monthly', 'champion', 'supporter', 'founder'];
                return tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
              })
              .map((sponsor, i) => (
                <SponsorCard key={sponsor.id} sponsor={sponsor} index={i} />
              ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white/30 text-sm">
            Be the first to support FlowSight! 💜
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href="https://ko-fi.com/flowsight"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600
                       text-white font-semibold text-sm hover:from-violet-500 hover:to-cyan-500 transition-all
                       shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
          >
            <Coffee size={18} />
            Buy FlowSight a Coffee
            <ExternalLink size={14} className="opacity-60" />
          </a>
          <p className="text-white/30 text-xs mt-4">
            All donations go directly to development. No strings attached.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
