const Premium = () => {
  return (
    <div className="h-full w-full flex items-center justify-center mt-50">
      <div className="flex flex-col items-center text-center gap-5 px-6">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Go Premium 🎧
        </h1>

        <p className="text-gray-400 max-w-md">
          Enjoy ad-free music, offline listening and high quality audio.
        </p>

        <button
          className="mt-2 px-6 py-2 bg-green-500 text-black rounded-full
                     font-semibold hover:scale-105 transition"
        >
          Coming Soon
        </button>
      </div>
    </div>
  );
};

export default Premium;
