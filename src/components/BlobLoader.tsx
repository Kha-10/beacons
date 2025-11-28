export default function BlobLoader() {
  return (
    <div className="relative w-64 h-64" style={{ filter: "url(#goo)" }}>
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className="absolute top-1/2 left-1/2 w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--color-blob-1)  opacity-80 animate-[blob-move-1_8s_ease-in-out_infinite]" />
      <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--color-blob-2) opacity-80 animate-[blob-move-2_6s_ease-in-out_infinite_-2s]" />
      <div className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--color-blob-3)  opacity-80 animate-[blob-move-3_10s_ease-in-out_infinite_-4s]" />
    </div>
  );
}
