import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { palette } from "../theme/weddingTheme";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: palette.chocolate,
        py: { xs: 6, md: 8 },
        px: 2,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background floral (very faint) */}
      <Box
        component="img"
        src="/images/floral-hero.png"
        alt=""
        aria-hidden
        sx={{
          position: "absolute",
          bottom: -30,
          left: -60,
          width: 280,
          opacity: 0.07,
          transform: "scaleX(-1)",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          sx={{
            fontFamily: '"Great Vibes", cursive',
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            color: palette.nude,
            mb: 0.5,
          }}
        >
          William &amp; Sweet
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: palette.nude,
            letterSpacing: "0.18em",
            display: "block",
            mb: 2,
          }}
        >
          MAY 8, 2027 &middot; ALDERGROVE, BC
        </Typography>

        {/* Divider */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mx: "auto",
            maxWidth: 200,
            mb: 2,
          }}
        >
          <Box
            sx={{ flex: 1, height: "1px", bgcolor: alpha(palette.beige, 0.2) }}
          />
          <Box
            component="span"
            sx={{ color: alpha(palette.beige, 0.4), fontSize: "0.8rem" }}
          >
            ✦
          </Box>
          <Box
            sx={{ flex: 1, height: "1px", bgcolor: alpha(palette.beige, 0.2) }}
          />
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: palette.nude,
            letterSpacing: "0.1em",
            display: "block",
          }}
        >
          Made with love for our wedding day
        </Typography>
      </Box>

      {/* Background floral (very faint) */}
      <Box
        component="img"
        src="/images/floral-hero.png"
        alt=""
        aria-hidden
        sx={{
          position: "absolute",
          bottom: -30,
          right: -60,
          width: 280,
          opacity: 0.07,
          transform: "scaleX(-1)",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
};

export default Footer;
