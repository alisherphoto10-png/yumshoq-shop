import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Composition,
  Sequence,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type YumshoqProps = {
  brand: string;
  tagline: string;
  productLine: string;
  cta: string;
};

export const defaultYumshoqProps: YumshoqProps = {
  brand: "Yumshoq",
  tagline: "Натуральное мыло ручной работы",
  productLine: "Сделано с заботой о вашей коже",
  cta: "@yumshoq_shop",
};

const calculateMetadata: CalculateMetadataFunction<YumshoqProps> = () => {
  return {};
};

export const YumshoqPromo = () => {
  return (
    <Composition
      id="YumshoqPromo"
      component={PromoVideo}
      durationInFrames={210}
      fps={30}
      width={1280}
      height={720}
      defaultProps={defaultYumshoqProps}
      calculateMetadata={calculateMetadata}
    />
  );
};

const Bubble: React.FC<{ seed: number }> = ({ seed }) => {
  const frame = useCurrentFrame();
  const { height, durationInFrames } = useVideoConfig();

  const startDelay = random(`delay-${seed}`) * durationInFrames * 0.6;
  const localFrame = frame - startDelay;
  const size = 14 + random(`size-${seed}`) * 46;
  const left = random(`left-${seed}`) * 100;
  const driftDirection = random(`drift-${seed}`) > 0.5 ? 1 : -1;

  const y = interpolate(
    localFrame,
    [0, durationInFrames],
    [height + size, -size],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const drift = Math.sin(localFrame / 20 + seed) * 18 * driftDirection;
  const opacity = interpolate(
    localFrame,
    [0, 20, durationInFrames - 20, durationInFrames],
    [0, 0.85, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        left: `${left}%`,
        top: y,
        transform: `translateX(${drift}px)`,
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.15) 60%, rgba(255,255,255,0.05) 100%)",
        border: "1px solid rgba(255,255,255,0.6)",
        opacity,
      }}
    />
  );
};

const FoamBackground: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(160deg, #fdf6ef 0%, #f7e9dd 45%, #eddcd0 100%)",
    }}
  >
    {new Array(22).fill(0).map((_, i) => (
      <Bubble key={i} seed={i} />
    ))}
  </AbsoluteFill>
);

const BrandScene: React.FC<{ brand: string; tagline: string }> = ({
  brand,
  tagline,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 200, mass: 1.2 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const taglineOpacity = interpolate(frame, [22, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <span
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 92,
          fontWeight: 700,
          color: "#6b4a3a",
          letterSpacing: 2,
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {brand}
      </span>
      <span
        style={{
          marginTop: 20,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 30,
          fontStyle: "italic",
          color: "#a07d5f",
          opacity: taglineOpacity,
        }}
      >
        {tagline}
      </span>
    </AbsoluteFill>
  );
};

const ProductScene: React.FC<{ productLine: string }> = ({ productLine }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barScale = spring({ frame, fps, config: { damping: 14 } });
  const textOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 34,
      }}
    >
      <div
        style={{
          width: 220,
          height: 90,
          borderRadius: 18,
          background: "linear-gradient(135deg, #f3e2c7, #dcb98a)",
          boxShadow: "0 24px 50px rgba(107,74,58,0.25)",
          transform: `scale(${barScale})`,
        }}
      />
      <span
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 30,
          color: "#6b4a3a",
          opacity: textOpacity,
          textAlign: "center",
          maxWidth: 700,
        }}
      >
        {productLine}
      </span>
    </AbsoluteFill>
  );
};

const CtaScene: React.FC<{ cta: string }> = ({ cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <span
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 40,
          fontWeight: 700,
          color: "#6b4a3a",
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {cta}
      </span>
    </AbsoluteFill>
  );
};

export const PromoVideo: React.FC<YumshoqProps> = ({
  brand,
  tagline,
  productLine,
  cta,
}) => {
  return (
    <AbsoluteFill>
      <FoamBackground />
      <Sequence from={0} durationInFrames={80}>
        <BrandScene brand={brand} tagline={tagline} />
      </Sequence>
      <Sequence from={70} durationInFrames={90}>
        <ProductScene productLine={productLine} />
      </Sequence>
      <Sequence from={160} durationInFrames={50}>
        <CtaScene cta={cta} />
      </Sequence>
    </AbsoluteFill>
  );
};
