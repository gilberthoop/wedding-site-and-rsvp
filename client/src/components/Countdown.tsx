import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { useCountdown } from "../hooks/useCountdown";
import { palette } from "../theme/weddingTheme";

interface CountBlockProps {
  value: number;
  label: string;
  padLength?: number;
}

const CountBlock = ({ value, label, padLength = 2 }: CountBlockProps) => {
  const display = String(value).padStart(padLength, "0");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: { xs: 70, md: 110 },
      }}
    >
      <Typography
        component="span"
        sx={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: { xs: "2.5rem", md: "4rem" },
          fontWeight: 300,
          color: palette.ivory,
          lineHeight: 1,
          letterSpacing: "0.04em",
          textAlign: "center",
          minWidth: "3ch",
        }}
      >
        {display}
      </Typography>
      <Typography
        component="span"
        variant="caption"
        sx={{ color: palette.beige, mt: 0.5, letterSpacing: "0.2em" }}
      >
        {label}
      </Typography>
    </Box>
  );
};

const Countdown = () => {
  const { days, hours, minutes, seconds } = useCountdown();

  return (
    <Box
      component="section"
      aria-label="Wedding countdown"
      sx={{
        position: "relative",
        py: { xs: 6, md: 8 },
        px: 2,
        textAlign: "center",
        background: `linear-gradient(135deg, ${palette.mocha} 0%, ${palette.hazelnut} 50%, ${palette.tan} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Subtle texture dots */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: `radial-gradient(${alpha(palette.ivory, 0.04)} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 900, mx: "auto" }}>
        <Typography
          variant="subtitle1"
          sx={{
            color: palette.nude,
            mb: 3,
            fontStyle: "italic",
            letterSpacing: "0.08em",
          }}
        >
          Days Until We Say &ldquo;I Do&rdquo;
        </Typography>

        <Box
          role="timer"
          aria-live="polite"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 1, md: 2 },
            flexWrap: "wrap",
          }}
        >
          <CountBlock value={days} label="Days" padLength={3} />
          <Typography
            aria-hidden
            sx={{
              color: alpha(palette.beige, 0.5),
              fontSize: { xs: "1.5rem", md: "3rem" },
              fontFamily: '"Cormorant Garamond", serif',
              alignSelf: "flex-start",
              mt: 0.5,
            }}
          >
            :
          </Typography>
          <CountBlock value={hours} label="Hours" />
          <Typography
            aria-hidden
            sx={{
              color: alpha(palette.beige, 0.5),
              fontSize: { xs: "1.5rem", md: "3rem" },
              fontFamily: '"Cormorant Garamond", serif',
              alignSelf: "flex-start",
              mt: 0.5,
            }}
          >
            :
          </Typography>
          <CountBlock value={minutes} label="Minutes" />
          <Typography
            aria-hidden
            sx={{
              color: alpha(palette.beige, 0.5),
              fontSize: { xs: "1.5rem", md: "3rem" },
              fontFamily: '"Cormorant Garamond", serif',
              alignSelf: "flex-start",
              mt: 0.5,
            }}
          >
            :
          </Typography>
          <CountBlock value={seconds} label="Seconds" />
        </Box>
      </Box>
    </Box>
  );
};

export default Countdown;
