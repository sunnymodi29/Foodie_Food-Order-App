// SkeletonText.jsx
export default function SkeletonText({ width = "100%", height = "20px" }) {
  return (
    <div
      className="skeleton-loader"
      style={{
        width,
        height,
        borderRadius: "6px",
        background:
          "linear-gradient(90deg, #3b372b 25%, #4a4539 50%, #3b372b 75%)",
        backgroundSize: "400% 100%",
        animation: "skeleton-shimmer 1.5s ease-in-out infinite",
      }}
    ></div>
  );
}
