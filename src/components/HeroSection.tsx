const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-12 md:py-20 px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-10 right-0 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-fun-purple/10 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block mb-4">
          <span className="text-5xl md:text-7xl animate-wave">👋</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight">
          <span className="text-gradient-fun">KidNews</span>
          <br />
          <span className="text-foreground">News Made Fun!</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Stay up to date with what's happening in your neighborhood, your country,
          and all around the world — written just for <span className="font-bold text-foreground">you</span>! 🌟
        </p>

        {/* Fun stats */}
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {[
            { emoji: "📖", label: "Easy to Read", value: "Simple Words" },
            { emoji: "⏱️", label: "Quick Stories", value: "2-3 Minutes" },
            { emoji: "🌍", label: "Coverage", value: "Local to Global" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-2xl px-6 py-4 shadow-sm"
            >
              <span className="text-2xl">{stat.emoji}</span>
              <p className="font-extrabold text-foreground mt-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
