import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { palette } from "../theme/weddingTheme";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface GallerySlot {
  tall?: boolean;
  wide?: boolean;
  delay: number;
}

const SLOTS: GallerySlot[] = [
  { tall: true, delay: 0 },
  { delay: 100 },
  { delay: 150 },
  { wide: true, delay: 200 },
  { delay: 250 },
  { tall: true, delay: 300 },
];

const PhotoSlot = ({ slot }: { slot: GallerySlot }) => {
  return (
    <Box
      data-reveal
      data-delay={slot.delay}
      role="button"
      tabIndex={0}
      aria-label="Gallery photo placeholder — click to view"
      sx={{
        gridRow: slot.tall ? "span 2" : "span 1",
        gridColumn: slot.wide ? "span 2" : "span 1",
        borderRadius: 3,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 8px 40px rgba(61,28,13,0.08)",
        transition: "transform 0.35s ease, box-shadow 0.35s ease",
        "&:hover, &:focus-visible": {
          transform: "scale(1.025)",
          boxShadow: "0 16px 56px rgba(61,28,13,0.14)",
          outline: `2px solid ${palette.tan}`,
        },
        opacity: 0,
        transform: "translateY(20px) scale(0.98)",
        transitionProperty: "opacity, transform, box-shadow",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${palette.cream}, ${palette.porcelain}, ${palette.nude})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          border: `1.5px dashed ${palette.beige}`,
          minHeight: 180,
          "&:hover": {
            background: `linear-gradient(135deg, ${palette.porcelain}, ${palette.nude}, ${alpha(palette.beige, 0.5)})`,
          },
          transition: "background 0.3s ease",
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 64 64"
          fill="none"
          sx={{ width: 52, height: 52 }}
        >
          <rect
            width="64"
            height="64"
            rx="4"
            fill={palette.beige}
            fillOpacity={0.2}
          />
          <path
            d="M14 46l12-14 9 10 6-7 13 11H14z"
            fill={palette.tan}
            fillOpacity={0.4}
          />
          <circle cx="43" cy="22" r="5" fill={palette.tan} fillOpacity={0.4} />
        </Box>
        <Typography
          variant="caption"
          sx={{ color: palette.beige, letterSpacing: "0.15em" }}
        >
          Add photo
        </Typography>
      </Box>
    </Box>
  );
};

const Gallery = () => {
  const sectionRef = useScrollReveal("[data-reveal]");

  return (
    <Box
      id="gallery"
      component="section"
      ref={sectionRef as React.Ref<HTMLDivElement>}
      sx={{
        bgcolor: palette.ivory,
        py: { xs: 7, md: 10 },
        px: { xs: 2, md: 4 },
      }}
    >
      {/* Botanical divider */}
      {/* <Box sx={{ textAlign: "center", mb: 4, opacity: 0.65 }}>
        <Box
          component="img"
          src="/images/divider-botanical.png"
          alt=""
          aria-hidden
          sx={{ maxWidth: 500, width: "100%", mx: "auto" }}
        />
      </Box> */}

      {/* Section header */}
      <Box
        data-reveal
        sx={{
          textAlign: "center",
          mb: 5,
          opacity: 0,
          transform: "translateY(30px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <Typography variant="h6" component="p" sx={{ mb: 1 }}>
          Memories Together
        </Typography>
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: "2.5rem", md: "4rem" } }}
        >
          Our Gallery
        </Typography>
      </Box>

      {/* Masonry grid */}
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            md: "repeat(3, 1fr)",
          },
          gridAutoRows: { xs: 180, md: 280 },
          gap: { xs: 1.5, md: 2 },
        }}
      >
        {SLOTS.map((slot, i) => (
          <PhotoSlot key={i} slot={slot} />
        ))}
      </Box>
    </Box>
  );
};

export default Gallery;
