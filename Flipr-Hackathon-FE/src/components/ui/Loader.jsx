// src/components/ui/loader.tsx
const Loader = () => (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="relative w-16 h-16">
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-transparent border-red-500 border-solid rounded-full animate-spin delay-200"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-transparent border-green-500 border-solid rounded-full animate-spin delay-400"></div>
    </div>
  </div>
);

export default Loader;
