import { Gamepad2 } from "lucide-react";

const coverStyles = [
  "from-[#eef3e7] to-[#e1e8d7] text-[#4e603a]",
  "from-[#f4e9df] to-[#efdfd1] text-[#795339]",
  "from-[#e9e7f2] to-[#ddd8ed] text-[#595077]",
  "from-[#e2edf0] to-[#d1e3e6] text-[#43636a]",
];

export function GameCover({
  title,
  imageUrl,
  className = "",
}: {
  title: string;
  imageUrl?: string;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <div
        className={`overflow-hidden bg-[#f1f1ee] ${className}`}
        style={{ backgroundImage: `url("${imageUrl}")`, backgroundSize: "cover", backgroundPosition: "center" }}
        role="img"
        aria-label={`${title} cover`}
      />
    );
  }

  const style = coverStyles[(title.charCodeAt(0) || 0) % coverStyles.length];
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${style} ${className}`}
      aria-label={`${title} cover placeholder`}
    >
      <Gamepad2 size={24} strokeWidth={1.5} />
    </div>
  );
}
