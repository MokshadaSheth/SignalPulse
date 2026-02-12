import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Activity, Brain, Heart, Users, ArrowRight, Lock, Eye, EyeOff, Zap, BarChart3, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface LandingPageProps {
  onGetStarted: () => void;
}

const features = [
  {
    icon: Activity,
    title: "Outcome Over Activity",
    desc: "Task completion matters more than how fragmented your work looks. We measure what counts.",
    color: "sp-green",
  },
  {
    icon: Brain,
    title: "Context-Aware Intelligence",
    desc: "A developer's workflow differs from a marketer's. Signal Pulse understands your role.",
    color: "sp-purple",
  },
  {
    icon: Lock,
    title: "Privacy by Architecture",
    desc: "Managers never see individual data. Not by policy — by design. Your data is yours alone.",
    color: "sp-blue",
  },
  {
    icon: Heart,
    title: "Wellness-First Design",
    desc: "Break reminders, breathing exercises, and hydration checks. Health is a feature, not an afterthought.",
    color: "sp-amber",
  },
];

const comparisons = [
  { traditional: "Tracks every keystroke", signal: "Measures task completion" },
  { traditional: "Ranks employees by activity", signal: "Understands role context" },
  { traditional: "Managers see everything", signal: "Managers see only team trends" },
  { traditional: "Pressure to look busy", signal: "Freedom to work your way" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-2xl border-b border-border/30"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Signal Pulse</span>
          </div>
          <div className="hidden sm:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#compare" className="hover:text-foreground transition-colors">Why Us</a>
            <a href="#philosophy" className="hover:text-foreground transition-colors">Philosophy</a>
          </div>
          <Button onClick={onGetStarted} className="rounded-full gap-2 px-5" size="sm">
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[100vh] flex flex-col items-center justify-center text-center px-6 pt-20"
      >
        {/* Ambient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-[15%] w-[500px] h-[500px] rounded-full bg-primary/6 blur-[100px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-[15%] w-[400px] h-[400px] rounded-full bg-accent/8 blur-[100px]"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div className="relative z-10 max-w-3xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-medium text-primary mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Shield className="w-3.5 h-3.5" />
            Privacy-first workplace wellness
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Measure outcomes.
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Respect humans.
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            An ethical workplace intelligence platform that understands your work context, 
            supports your wellbeing, and never watches your keystrokes.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button onClick={onGetStarted} size="lg" className="rounded-full gap-2.5 px-8 text-base shadow-lg shadow-primary/20">
              Start Your Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              See how it works <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 mt-14 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-primary" /> End-to-end privacy</span>
            <span className="flex items-center gap-1.5"><EyeOff className="w-3.5 h-3.5 text-primary" /> No keystroke logging</span>
            <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-primary" /> You own your data</span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5">
            <motion.div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
          </div>
        </motion.div>
      </motion.section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Built on four non-negotiable principles
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Every pixel, every algorithm, every nudge — designed to support you, not surveil you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="sp-card group hover:border-primary/30 transition-all duration-300 p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
              >
                <div className={`w-11 h-11 rounded-xl bg-${f.color}-soft flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 text-${f.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section id="compare" className="py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-14" {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Not another productivity tracker
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Signal Pulse was designed to be the opposite of everything wrong with workplace monitoring.
            </p>
          </motion.div>

          <div className="space-y-3">
            {comparisons.map((c, i) => (
              <motion.div
                key={i}
                className="grid grid-cols-2 gap-3"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="sp-card flex items-center gap-3 p-4 opacity-50">
                  <span className="text-xs">✕</span>
                  <span className="text-sm text-muted-foreground">{c.traditional}</span>
                </div>
                <div className="sp-card flex items-center gap-3 p-4 border-primary/20">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{c.signal}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section id="philosophy" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Two perspectives. One ethical platform.</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <motion.div
              className="sp-card-glow p-7"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-xl bg-sp-green-soft flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-sp-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Employees</h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><Sparkles className="w-3.5 h-3.5 text-sp-green mt-0.5 flex-shrink-0" /> Personal focus patterns & AI insights</li>
                <li className="flex items-start gap-2"><Sparkles className="w-3.5 h-3.5 text-sp-green mt-0.5 flex-shrink-0" /> Wellness nudges & breathing breaks</li>
                <li className="flex items-start gap-2"><Sparkles className="w-3.5 h-3.5 text-sp-green mt-0.5 flex-shrink-0" /> Smart task prioritization</li>
                <li className="flex items-start gap-2"><Lock className="w-3.5 h-3.5 text-sp-green mt-0.5 flex-shrink-0" /> 100% private — only you see your data</li>
              </ul>
            </motion.div>

            <motion.div
              className="sp-card-glow p-7"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-xl bg-sp-blue-soft flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-sp-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Managers</h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><BarChart3 className="w-3.5 h-3.5 text-sp-blue mt-0.5 flex-shrink-0" /> Anonymized team-level trends</li>
                <li className="flex items-start gap-2"><BarChart3 className="w-3.5 h-3.5 text-sp-blue mt-0.5 flex-shrink-0" /> Outcome vs. activity correlations</li>
                <li className="flex items-start gap-2"><BarChart3 className="w-3.5 h-3.5 text-sp-blue mt-0.5 flex-shrink-0" /> Structural change suggestions</li>
                <li className="flex items-start gap-2"><EyeOff className="w-3.5 h-3.5 text-sp-blue mt-0.5 flex-shrink-0" /> No individual tracking — ever</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="sp-card-glow p-12 sm:p-16">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Zap className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Ready to rethink workplace wellness?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Join a new era where performance and wellbeing aren't at odds. 
              Where your work is understood, not watched.
            </p>
            <Button onClick={onGetStarted} size="lg" className="rounded-full gap-2.5 px-10 text-base shadow-lg shadow-primary/20">
              Start Your Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
            <p className="text-xs text-muted-foreground mt-6 italic">
              "This app cares about me, not watches me."
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Signal Pulse</span>
            <span className="text-xs text-muted-foreground">· Ethical Workplace Intelligence</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Privacy by architecture, not policy. © 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
