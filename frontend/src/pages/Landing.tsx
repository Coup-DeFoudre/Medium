import HeroLanding from "../components/HeroLanding";
import NavbarLanding from "../components/NavbarLanding";

const Landing = () => {
  return (
    <div className="bg-[#fefaf6] h-screen w-full overflow-hidden flex flex-col">
      <NavbarLanding />
      <HeroLanding />
    </div>
  );
};

export default Landing;
