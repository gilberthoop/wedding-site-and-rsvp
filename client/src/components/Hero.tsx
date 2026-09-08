import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";
import { palette } from "../theme/weddingTheme";
import { IS_RSVP_ENABLED } from "../utils/constants";

// ── Petal physics constants ───────────────────────────
const PETAL_COUNT = 38;
const PETAL_COLORS = [
  palette.cream,
  palette.porcelain,
  palette.nude,
  palette.blushNude,
  palette.beige,
  palette.tan,
  // a few soft green accents for leaves
  "#C6D8B0",
  "#B8CFA0",
] as const;

interface Petal {
  x: number;
  y: number;
  size: number; // major axis radius
  aspect: number; // minor/major ratio → ellipse shape
  color: string;
  alpha: number;
  speedY: number; // falling speed
  speedX: number; // lateral drift amplitude
  driftX: number; // current horizontal offset phase
  driftFreq: number; // how fast it sways
  rotation: number; // current angle (radians)
  rotSpeed: number; // rotation speed per frame
  wobble: number; // additional vertical oscillation amplitude
  wobbleFreq: number;
  wobblePhase: number;
}

const initPetal = (
  canvasW: number,
  canvasH: number,
  fromTop = false,
): Petal => {
  const size = 4 + Math.random() * 10;
  return {
    x: Math.random() * canvasW,
    y: fromTop ? -size * 2 : Math.random() * canvasH,
    size,
    aspect: 0.3 + Math.random() * 0.45, // slender to roundish
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    alpha: 0.35 + Math.random() * 0.5,
    speedY: 0.5 + Math.random() * 1.2,
    speedX: (Math.random() - 0.5) * 0.4,
    driftX: Math.random() * Math.PI * 2,
    driftFreq: 0.008 + Math.random() * 0.012,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.025,
    wobble: 10 + Math.random() * 30,
    wobbleFreq: 0.005 + Math.random() * 0.01,
    wobblePhase: Math.random() * Math.PI * 2,
  };
};

const drawPetal = (ctx: CanvasRenderingContext2D, p: Petal) => {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.alpha;

  // Elliptical petal shape
  ctx.beginPath();
  ctx.ellipse(0, 0, p.size, p.size * p.aspect, 0, 0, Math.PI * 2);

  // Slight gradient for depth — lighter center, deeper edge
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
  grad.addColorStop(0, p.color);
  grad.addColorStop(1, alpha(p.color, 0.4));
  ctx.fillStyle = grad;
  ctx.fill();

  // Subtle vein line for realism
  ctx.beginPath();
  ctx.moveTo(0, -p.size * p.aspect);
  ctx.lineTo(0, p.size * p.aspect);
  ctx.strokeStyle = alpha(p.color, 0.2);
  ctx.lineWidth = 0.5;
  ctx.stroke();

  ctx.restore();
};

// ── Hook: canvas petal animation ─────────────────────
const usePetalCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let petals: Petal[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      // Re-scatter petals on resize (keep existing ones, rebuild if none)
      if (petals.length === 0) {
        petals = Array.from({ length: PETAL_COUNT }, () =>
          initPetal(canvas.width, canvas.height, false),
        );
      }
    };

    const animate = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      for (const p of petals) {
        // Physics update
        p.driftX += p.driftFreq;
        p.wobblePhase += p.wobbleFreq;
        p.rotation += p.rotSpeed;

        p.x += p.speedX + Math.sin(p.driftX) * 1.2;
        p.y += p.speedY + Math.sin(p.wobblePhase) * 0.4;

        // Wrap around: when petal exits bottom, re-spawn at top
        if (p.y > height + p.size * 2) {
          Object.assign(p, initPetal(width, height, true));
        }
        // Wrap horizontal edges
        if (p.x < -p.size * 2) p.x = width + p.size;
        if (p.x > width + p.size * 2) p.x = -p.size;

        drawPetal(ctx, p);
      }

      rafId = requestAnimationFrame(animate);
    };

    resize();
    petals = Array.from({ length: PETAL_COUNT }, () =>
      initPetal(canvas.width, canvas.height, false),
    );

    animate();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [canvasRef]);
};

// ── Hero parallax on gradient bg ──────────────────────
const useParallax = (bgRef: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (bgRef.current) {
            bgRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [bgRef]);
};

// ── Component ─────────────────────────────────────────
const Hero = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useParallax(bgRef);
  usePetalCanvas(canvasRef);

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box
      id="home"
      component="section"
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        bgcolor: palette.cream,
      }}
    >
      {/* ── Layer 0: Parallax gradient background ──── */}
      <Box
        ref={bgRef}
        aria-hidden
        sx={{
          position: "absolute",
          inset: "-60px",
          background: `linear-gradient(
            160deg,
            ${palette.cream}      0%,
            ${palette.porcelain}  35%,
            ${palette.nude}       70%,
            ${alpha(palette.beige, 0.4)} 100%
          )`,
          zIndex: 0,
          willChange: "transform",
        }}
      />

      {/* ── Layer 1: Ambient radial glows ──────────── */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backgroundImage: [
            `radial-gradient(ellipse at 15% 85%, ${alpha(palette.beige, 0.22)} 0%, transparent 55%)`,
            `radial-gradient(ellipse at 85% 15%, ${alpha(palette.pistachio, 0.14)} 0%, transparent 50%)`,
            `radial-gradient(ellipse at 55% 45%, ${alpha(palette.nude, 0.12)} 0%, transparent 60%)`,
          ].join(", "),
        }}
      />

      {/* ── Layer 2: Falling petal canvas ──────────── */}
      <Box
        component="canvas"
        ref={canvasRef}
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* ── Layer 3: Floral corner art ──────────────── */}
      <Box
        component="img"
        src="/images/floral-corner.png"
        alt=""
        aria-hidden
        sx={{
          position: "absolute",
          bottom: 0,
          left: { xs: -40, md: -20 },
          width: { xs: "42vw", md: "27vw" },
          maxWidth: 370,
          opacity: 0.9,
          zIndex: 3,
          transform: "scaleX(-1)",
          pointerEvents: "none",
          // Soft blend into the canvas layer below
          mixBlendMode: "multiply",
        }}
      />
      <Box
        component="img"
        src="/images/floral-corner.png"
        alt=""
        aria-hidden
        sx={{
          position: "absolute",
          bottom: 0,
          right: { xs: -40, md: -20 },
          width: { xs: "42vw", md: "27vw" },
          maxWidth: 370,
          opacity: 0.9,
          zIndex: 3,
          pointerEvents: "none",
          mixBlendMode: "multiply",
        }}
      />

      {/* ── Layer 4: Hero text content ──────────────── */}
      <Box
        sx={{
          position: "relative",
          zIndex: 4,
          textAlign: "center",
          px: 2,
          pt: "8rem",
          pb: "4rem",
          maxWidth: 720,
          mx: "auto",
        }}
      >
        <Typography
          variant="h6"
          component="p"
          sx={{
            mb: 1.5,
            opacity: 0,
            animation: "fadeUp 0.8s ease 0.2s forwards",
            "@keyframes fadeUp": {
              from: { opacity: 0, transform: "translateY(30px)" },
              to: { opacity: 1, transform: "none" },
            },
          }}
        >
          The Wedding of
        </Typography>

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "3.5rem", sm: "5.5rem", md: "7rem" },
            mb: 2,
            opacity: 0,
            animation: "fadeUp 0.8s ease 0.4s forwards",
            // Subtle text shadow for legibility over petals
            textShadow: `0 2px 24px ${alpha(palette.cream, 0.8)}, 0 0 60px ${alpha(palette.cream, 0.6)}`,
          }}
        >
          William
          {/* <br></br> */}
          <Box
            component="span"
            sx={{
              display: "block",
              fontSize: "0.75em",
              color: palette.hazelnut,
            }}
          >
            &amp;
          </Box>
          {/* <br></br> */}
          Sweet
        </Typography>

        {/* Divider */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mx: "auto",
            maxWidth: 260,
            mb: 2,
            opacity: 0,
            animation: "fadeUp 0.8s ease 0.6s forwards",
          }}
        >
          <Box sx={{ flex: 1, height: "1px", bgcolor: palette.beige }} />
          <Box component="span" sx={{ color: palette.tan, fontSize: "0.8rem" }}>
            ✦
          </Box>
          <Box sx={{ flex: 1, height: "1px", bgcolor: palette.beige }} />
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: "1.1rem", md: "1.35rem" },
            letterSpacing: "0.12em",
            color: palette.mocha,
            mb: 0.5,
            opacity: 0,
            animation: "fadeUp 0.8s ease 0.8s forwards",
          }}
        >
          May 8, 2027
        </Typography>

        <Typography
          variant="body2"
          sx={{
            letterSpacing: "0.08em",
            mb: 3.5,
            opacity: 0,
            animation: "fadeUp 0.8s ease 1s forwards",
          }}
        >
          Sts. Joachim &amp; Ann Parish &middot; Aldergrove, BC
        </Typography>

        {IS_RSVP_ENABLED && (
          <Box sx={{ opacity: 0, animation: "fadeUp 0.8s ease 1.2s forwards" }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => handleScroll("#rsvp")}
              sx={{
                px: 4,
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              }}
            >
              RSVP
            </Button>
          </Box>
        )}
      </Box>

      {/* ── Layer 5: Scroll indicator ───────────────── */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          alignItems: "center",
        }}
      >
        {[0, 1].map((i) => (
          <Box
            key={i}
            sx={{
              width: 12,
              height: 12,
              borderRight: `2px solid ${palette.beige}`,
              borderBottom: `2px solid ${palette.beige}`,
              transform: "rotate(45deg)",
              animation: `scrollBounce 1.8s ease-in-out ${i * 0.3}s infinite`,
              opacity: i === 1 ? 0.5 : 1,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Hero;
