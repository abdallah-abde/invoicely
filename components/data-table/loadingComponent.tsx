import { Loader } from "lucide-react";

export default function LoadingComponent() {
  return (
    <div className="flex items-center gap-5 justify-center h-[calc(100vh-75px)] text-primary">
      <Loader className="animate-spin h-12 w-12" />
      <p className="animate-pulse text-2xl">Loading...</p>
    </div>
  );
}
