import { Blob } from "./blob";

export default function BlobsBackground() {
  return (
    <div className="pointer-events-none inset-0 overflow-hidden">
      {/* <Blob
        size={520}
        color="rgba(59,130,246,0.12)" // blue
        top="-10%"
        left="-10%"
      /> */}

      {/* <Blob
        size={420}
        color="rgba(34,197,94,0.10)" // green
        top="20%"
        right="-15%"
      /> */}

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
