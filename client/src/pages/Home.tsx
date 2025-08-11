import ScrollPortrait from "@/components/ScrollPortrait";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-6xl md:text-8xl font-bold text-black text-center tracking-tight">
          THE VENUS PROJECT
        </h1>
      </div>
      
      {/* Add extra content to enable scrolling */}
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-black mb-8">Vision for Tomorrow</h2>
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              Cities have always been the product of human imagination and human limitation, shaped by the slow 
              accumulation of decisions made by countless individuals over generations. But what if we could 
              reimagine this process entirely?
            </p>
            <p>
              The Venus Project represents a new paradigm in urban development, where artificial intelligence 
              and human creativity converge to create sustainable, efficient, and beautiful living spaces 
              that serve all of humanity.
            </p>
            <p>
              Through advanced AI systems and distributed computing, we're building the foundation for cities 
              that adapt, learn, and evolve with their inhabitants, creating harmony between technology and nature.
            </p>
            <p>
              Join us in this revolutionary journey toward a sustainable future where every citizen thrives 
              in an environment designed for both individual fulfillment and collective prosperity.
            </p>
          </div>
        </div>
      </div>
      
      <ScrollPortrait />
    </>
  );
}
