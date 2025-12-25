import { Blob } from "./blob";

export default function BlobsBackground() {
  return (
    <div className="pointer-events-none inset-0 overflow-hidden">
      <Blob
        size={360}
        color="bg-chart-2/90 dark:bg-chart-5/50"
        bottom="50%"
        left="-25%"
        blur={90}
      />

      <Blob
        size={360}
        color="bg-chart-2/90 dark:bg-chart-5/50"
        bottom="40%"
        right="-25%"
        blur={90}
      />

      <Blob
        size={360}
        color="bg-chart-2/90 dark:bg-chart-5/50"
        bottom="20%"
        left="-25%"
        blur={90}
      />

      <Blob
        size={360}
        color="bg-chart-2/90 dark:bg-chart-5/50"
        bottom="10%"
        right="-25%"
        blur={90}
      />
    </div>
  );
}
