import { Header } from "@/components/Header";
import { AIHealthChat } from "@/components/AIHealthChat";

const AIHealthMonitorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background relative overflow-hidden">
      {/* Neptune blue background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 animate-pulse-glow"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/25 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <AIHealthChat />
        </div>
      </main>
    </div>
  );
};

export default AIHealthMonitorPage;
