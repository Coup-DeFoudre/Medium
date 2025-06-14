const Quote = () => {
  return (
    <div className="bg-slate-200 h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div className="max-w-md text-left px-4">
          <p className="text-2xl font-semibold text-gray-900 leading-relaxed">
            “The internet is the printing press of the 21st century. Your words
            can travel farther than ever before—start where you are.”
          </p>
          <p className="mt-4 font-semibold text-gray-800">Seth Godin</p>
          <p className="text-gray-500">Author & Marketing Expert</p>
        </div>
      </div>
    </div>
  );
};

export default Quote;
