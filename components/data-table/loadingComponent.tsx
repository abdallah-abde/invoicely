import { Loader } from "lucide-react";

export default function LoadingComponent() {
  return (
    <div className="flex items-center gap-5 justify-center h-32 absolute top-1/2 left-1/2 -translate-y-1/2">
      <Loader className="animate-spin h-12 w-12 text-muted-foreground" />
      <p className="animate-pulse text-2xl">Loading...</p>
    </div>
  );
}
