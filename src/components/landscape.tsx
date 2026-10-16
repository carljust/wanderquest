import Svg, { Circle, G, Path, Rect } from "react-native-svg";

export function Landscape({
  variant = "forest",
}: {
  variant?: "forest" | "lake" | "summit";
}) {
  const sky =
    variant === "lake"
      ? "#B7D3CB"
      : variant === "summit"
        ? "#E7C9A1"
        : "#C9D6B4";
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 600 320"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <Rect width="600" height="320" fill={sky} />
      <Circle cx="460" cy="76" r="37" fill="#F2DDAC" />
      <Path
        d="M0 208L105 95 180 167 303 39 445 177 510 113 600 199V320H0Z"
        fill="#8BA88B"
      />
      <Path d="M239 116L303 39 370 119 314 94 287 111 275 93Z" fill="#EBEBD5" />
      <Path d="M0 245Q160 117 308 201T600 169V320H0Z" fill="#587F62" />
      <Path d="M0 279Q150 200 294 261T600 223V320H0Z" fill="#295A47" />
      {variant === "lake" ? (
        <Path d="M163 270Q290 229 447 274L521 320H82Z" fill="#91BEB1" />
      ) : (
        <Path
          d="M320 215Q218 250 338 277Q420 296 340 320H251Q371 295 294 278Q190 250 320 215Z"
          fill="#E2C595"
        />
      )}
      <G fill="#183D32">
        <Path d="M32 293V169L-13 244H16L-6 277H32M79 320V202L36 274H59L38 306H79M530 320V152L476 248H506L480 291H530M576 320V192L533 264H557L535 302H576" />
      </G>
      <Path
        d="M110 70q9-10 18 0m0 0q9-10 18 0M365 56q7-8 14 0m0 0q7-8 14 0"
        stroke="#48684E"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
