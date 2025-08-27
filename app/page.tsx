import Header from "@/components/header";
import HopiumForm from "@/components/hopium-form";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center px-6 py-10 gap-8">
      <Header />
      <HopiumForm />
      <Footer />
    </div>
  );
}
