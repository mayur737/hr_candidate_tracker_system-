const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-3 border-4 border-transparent border-b-blue-300 border-l-blue-300 rounded-full animate-spin-reverse"></div>
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-400 rounded-full shadow-[0_0_12px_4px_rgba(59,130,246,0.7)] animate-ping transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-white text-lg font-medium animate-bounce drop-shadow-md">
          Please wait, loading...
        </p>
      </div>
    </div>
  );
};

export default FullScreenLoader;
