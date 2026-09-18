import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { palette } from "../theme/weddingTheme";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { IS_RSVP_ENABLED } from "../utils/constants";
import { RSVPCard } from "./Partials/RSVPCard";

const Rsvp = () => {
  const sectionRef = useScrollReveal("[data-reveal]");

  return (
    <Box
      id="rsvp"
      component="section"
      ref={sectionRef as React.Ref<HTMLDivElement>}
      sx={{
        bgcolor: palette.cream,
        py: { xs: 7, md: 10 },
        px: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background floral (faint) */}
      <Box
        component="img"
        src="/images/floral-hero.png"
        alt=""
        aria-hidden
        sx={{
          position: "absolute",
          right: { xs: -80, md: -40 },
          top: "50%",
          transform: "translateY(-50%)",
          width: { xs: 280, md: 380 },
          opacity: 0.08,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Section header */}
        <Box
          data-reveal
          sx={{
            textAlign: "center",
            mb: 4,
            opacity: 0,
            transform: "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <Typography variant="h6" component="p" sx={{ mb: 1 }}>
            We&rsquo;d Love to Have You
          </Typography>
          <Typography
            variant="h2"
            sx={{ fontSize: { xs: "2.5rem", md: "4rem" } }}
          >
            RSVP
          </Typography>
        </Box>

        {IS_RSVP_ENABLED ? (
          <RSVPCard />
        ) : (
          <Card
            data-reveal
            data-delay={150}
            sx={{
              maxWidth: 600,
              mx: "auto",
              bgcolor: palette.ivory,
              textAlign: "center",
              opacity: 0,
              transform: "translateY(30px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              {/* Animated hourglass */}
              <Box
                aria-hidden
                sx={{
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 2.5,
                  animation: "spin 8s linear infinite",
                }}
              >
                <svg
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: "100%", height: "100%" }}
                >
                  <path
                    d="M20 10h40v15L40 40 20 25V10z"
                    fill={palette.nude}
                    fillOpacity={0.4}
                    stroke={palette.hazelnut}
                    strokeWidth="1.5"
                  />
                  <path
                    d="M20 70h40V55L40 40 20 55v15z"
                    fill={palette.beige}
                    fillOpacity={0.4}
                    stroke={palette.hazelnut}
                    strokeWidth="1.5"
                  />
                  <path
                    d="M40 40l10-10-10-10-10 10 10 10z"
                    fill={palette.tan}
                    fillOpacity={0.5}
                  />
                  <path
                    d="M40 40l8 10-8 10-8-10 8-10z"
                    fill={palette.tan}
                    fillOpacity={0.3}
                  />
                </svg>
              </Box>

              <Typography variant="h3" sx={{ fontSize: "2rem", mb: 1.5 }}>
                RSVP Coming Soon
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 3, maxWidth: 440, mx: "auto" }}
              >
                We&rsquo;re putting the finishing touches on our RSVP system.
                Please check back closer to the wedding date, or reach out to us
                directly in the meantime.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default Rsvp;
