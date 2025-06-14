import Auth from "../components/Auth";
import Quote from "../components/Quote";

const Signup = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="Signup ">
        <Auth type="signup"/>
      </div>
      <div className="hidden md:block">
        <Quote />
      </div>
    </div>
  );
};

export default Signup;
