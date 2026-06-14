import { CtaBand } from "./components/landing/CtaBand";
import { Footer } from "./components/landing/Footer";
import { Hero } from "./components/landing/Hero";
import { Nav } from "./components/landing/Nav";
import { SplitDemo } from "./components/landing/SplitDemo";
import { Steps } from "./components/landing/Steps";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Steps />
        <SplitDemo />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
