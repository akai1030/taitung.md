import { getLayerById } from "@/lib/layers";

interface LayerTagProps {
  layerId: string;
  size?: "sm" | "md";
}

export default function LayerTag({ layerId, size = "sm" }: LayerTagProps) {
  const layer = getLayerById(layerId);
  if (!layer) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${
        size === "sm" ? "text-[0.7rem] px-2.5 py-0.5" : "text-xs px-3 py-1"
      }`}
      style={{
        backgroundColor: `${layer.color}15`,
        color: layer.color,
      }}
    >
      <span>{layer.icon}</span>
      {layer.name}
    </span>
  );
}
