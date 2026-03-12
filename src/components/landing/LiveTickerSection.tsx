const events = [
  { avatar: "AM", name: "Arjun M.", action: "compliance score 94 — demonetization prevented", city: "Mumbai", color: "text-emerald-400" },
  { avatar: "KN", name: "Kavya N.", action: "Tamil video published — 0 issues flagged", city: "Chennai", color: "text-primary" },
  { avatar: "RP", name: "Rohit P.", action: "Paycheck Preview: ₹7,400/mo projected", city: "Ahmedabad", color: "text-gold" },
  { avatar: "SI", name: "Sneha I.", action: "4-Platform Blitz: exported in 6 min 12 sec", city: "Bengaluru", color: "text-primary" },
  { avatar: "VR", name: "Vikram R.", action: "Monetization Countdown: 203 hrs to YPP", city: "Hyderabad", color: "text-accent" },
  { avatar: "PS", name: "Priya S.", action: "Style Memory matched across 8 videos", city: "Delhi", color: "text-emerald-400" },
  { avatar: "AK", name: "Anika K.", action: "Niche Goldmine Finder: ₹11K RPM gap found", city: "Pune", color: "text-gold" },
  { avatar: "NJ", name: "Nikhil J.", action: "auto-fix rewrote 3 risky script sections", city: "Jaipur", color: "text-primary" },
  { avatar: "DM", name: "Divya M.", action: "revenue milestone: ₹45,000 in AdSense this month", city: "Kochi", color: "text-emerald-400" },
  { avatar: "RS", name: "Rajesh S.", action: "7th consecutive video — 100% compliance", city: "Surat", color: "text-accent" },
  { avatar: "LB", name: "Lakshmi B.", action: "Telugu channel hit 10K subs via VORAX content", city: "Visakhapatnam", color: "text-gold" },
  { avatar: "SK", name: "Sameer K.", action: "Paycheck Preview: crypto niche ₹9,200/mo est.", city: "Indore", color: "text-primary" },
];

const doubled = [...events, ...events];

const LiveTickerSection = () => {
  return (
    <div className="w-full overflow-hidden border-y border-border/30 bg-card/30 backdrop-blur-sm py-2.5 relative z-10">
      {/* Fade masks */}
      <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Live label */}
      <div className="absolute left-4 inset-y-0 z-20 flex items-center gap-1.5 pointer-events-none">
        <span className="live-dot" />
        <span className="text-[9px] font-label tracking-widest text-emerald-400 bg-background px-2 rounded">LIVE</span>
      </div>

      <div className="animate-marquee pl-24">
        {doubled.map((e, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2.5 mx-6 bg-card/60 border border-border/40 rounded-full px-3.5 py-1.5 select-none"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 border border-border flex items-center justify-center shrink-0">
              <span className="text-[7px] font-bold text-foreground">{e.avatar}</span>
            </div>
            <span className="text-[10px] font-medium text-foreground whitespace-nowrap">{e.name}</span>
            <span className="text-[10px] text-muted-foreground">·</span>
            <span className={`text-[10px] whitespace-nowrap ${e.color}`}>{e.action}</span>
            <span className="text-[10px] text-muted-foreground/50 whitespace-nowrap">— {e.city}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveTickerSection;
