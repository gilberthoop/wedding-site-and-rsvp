import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DiamondIcon from "@mui/icons-material/Diamond";
import CelebrationIcon from "@mui/icons-material/Celebration";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { palette } from "../theme/weddingTheme";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { alpha } from "@mui/material/styles";

interface DetailCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  chip?: string;
  link?: { label: string; href: string };
  action?: { label: string; onClick: () => void };
  delay?: number;
}

const DetailCard = ({
  icon,
  title,
  subtitle,
  children,
  chip,
  link,
  action,
  delay = 0,
}: DetailCardProps) => {
  return (
    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
      <Card
        data-reveal
        data-delay={delay}
        sx={{
          bgcolor: palette.ivory,
          height: "100%",
          textAlign: "center",
          opacity: 0,
          transform: "translateY(30px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
          position: "relative",
          zIndex: 1,
        }}
      >
        <CardContent
          sx={{
            p: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: alpha(palette.nude, 0.4),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: palette.hazelnut,
              mb: 1,
            }}
          >
            {icon}
          </Box>

          <Typography variant="h4" sx={{ fontSize: "1.35rem" }}>
            {title}
          </Typography>
          <Typography variant="subtitle2">{subtitle}</Typography>
          <Box>{children}</Box>

          {chip && (
            <Chip
              label={chip}
              size="small"
              sx={{ bgcolor: palette.cream, color: palette.tan, mt: 0.5 }}
            />
          )}
          {link && (
            <Link
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                fontSize: "0.78rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                color: palette.hazelnut,
                borderBottom: `1px solid ${palette.beige}`,
                "&:hover": {
                  color: palette.mocha,
                  borderBottomColor: palette.hazelnut,
                },
              }}
            >
              {link.label} →
            </Link>
          )}
          {action && (
            <Link
              component="button"
              type="button"
              onClick={action.onClick}
              sx={{
                fontSize: "0.78rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                color: palette.hazelnut,
                bgcolor: "transparent",
                border: "none",
                borderBottom: `1px solid ${palette.beige}`,
                cursor: "pointer",
                p: 0,
                fontFamily: "inherit",
                display: "inline-flex",
                alignItems: "center",
                transition: "color 0.2s ease, border-color 0.2s ease",
                "&:hover": {
                  color: palette.mocha,
                  borderBottomColor: palette.hazelnut,
                },
              }}
            >
              {action.label} →
            </Link>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

const WeddingDetails = () => {
  const sectionRef = useScrollReveal("[data-reveal]");
  const [isPaletteModalOpen, setIsPaletteModalOpen] = useState(false);

  return (
    <Box
      id="details"
      component="section"
      ref={sectionRef as React.Ref<HTMLDivElement>}
      sx={{
        bgcolor: palette.porcelain,
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
          left: { xs: -80, md: -40 },
          top: "50%",
          transform: "translateY(-50%)",
          width: { xs: 280, md: 380 },
          opacity: 0.08,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Section header */}
      <Box
        data-reveal
        sx={{
          textAlign: "center",
          mb: 6,
          opacity: 0,
          transform: "translateY(30px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <Typography variant="h6" component="p" sx={{ mb: 1 }}>
          What You Need to Know
        </Typography>
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: "2.5rem", md: "4rem" } }}
        >
          Wedding Details
        </Typography>
      </Box>

      <Grid container spacing={2.5} sx={{ maxWidth: 1100, mx: "auto" }}>
        <DetailCard
          icon={<PlaceIcon fontSize="medium" />}
          title="Ceremony"
          subtitle="Sts. Joachim & Ann Parish"
          delay={100}
          link={{
            label: "Get Directions",
            href: "https://maps.google.com/?q=2827+273+St,+Aldergrove,+BC",
          }}
        >
          <Typography variant="body1" sx={{ fontSize: "0.88rem" }}>
            2827 273 St.
            <br />
            Aldergrove, BC
          </Typography>
        </DetailCard>

        <DetailCard
          icon={<CalendarMonthIcon fontSize="medium" />}
          title="Date & Time"
          subtitle="Saturday, May 8, 2027"
          chip="Save the Date!"
          delay={200}
        >
          <Typography variant="body1" sx={{ fontSize: "0.88rem" }}>
            Nuptial Mass at 2:00 PM. <br /> Reception at 6:00 PM.
          </Typography>
        </DetailCard>

        <DetailCard
          icon={<DiamondIcon fontSize="medium" />}
          title="Dress Code"
          subtitle="Formal Attire"
          delay={300}
          action={{
            label: "View Color Palette",
            onClick: () => setIsPaletteModalOpen(true),
          }}
        >
          <Typography variant="body1" sx={{ fontSize: "0.88rem", mb: 1 }}>
            Traditional Filipino Wear or Neutral Tones are warmly encouraged.
          </Typography>
          <Box
            component="button"
            type="button"
            onClick={() => setIsPaletteModalOpen(true)}
            aria-label="View neutral color palette guide"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.6,
              p: "4px 10px",
              borderRadius: "16px",
              bgcolor: alpha(palette.nude, 0.25),
              border: `1px solid ${alpha(palette.beige, 0.5)}`,
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                bgcolor: alpha(palette.nude, 0.45),
                borderColor: palette.hazelnut,
              },
            }}
          >
            {[
              palette.ivory,
              palette.porcelain,
              palette.nude,
              palette.blushNude,
              palette.beige,
              palette.tan,
              palette.dove,
              palette.mocha,
              palette.hazelnut,
            ].map((color, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: color,
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                }}
              />
            ))}
          </Box>
        </DetailCard>

        <DetailCard
          icon={<CelebrationIcon fontSize="medium" />}
          title="Reception"
          subtitle="Sts. Joachim & Ann Reception Hall"
          delay={400}
        >
          <Typography variant="body1" sx={{ fontSize: "0.88rem" }}>
            Dinner, dancing, and celebration to follow the ceremony.
          </Typography>
        </DetailCard>
      </Grid>

      {/* Dress Code / Color Palette Modal */}
      <Dialog
        open={isPaletteModalOpen}
        onClose={() => setIsPaletteModalOpen(false)}
        maxWidth="xs"
        fullWidth
        aria-labelledby="attire-palette-title"
        slotProps={{
          backdrop: {
            sx: {
              bgcolor: alpha(palette.chocolate, 0.72),
              backdropFilter: "blur(6px)",
            },
          },
          paper: {
            sx: {
              bgcolor: palette.ivory,
              borderRadius: 3,
              p: { xs: 2.5, sm: 3 },
              position: "relative",
              overflow: "hidden",
              border: `1px solid ${alpha(palette.beige, 0.5)}`,
              boxShadow: "0 24px 48px rgba(61, 28, 13, 0.3)",
              m: 2,
            },
          },
        }}
      >
        <IconButton
          aria-label="Close color palette modal"
          onClick={() => setIsPaletteModalOpen(false)}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: palette.mocha,
            bgcolor: alpha(palette.porcelain, 0.7),
            "&:hover": {
              bgcolor: palette.cream,
              color: palette.chocolate,
            },
            zIndex: 1,
          }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>

        <Box sx={{ textAlign: "center", mb: 2, px: 2 }}>
          <Typography
            id="attire-palette-title"
            variant="h4"
            sx={{
              fontSize: { xs: "1.35rem", sm: "1.55rem" },
              color: palette.chocolate,
              mb: 0.5,
            }}
          >
            Guest Attire Inspiration
          </Typography>
        </Box>

        <Box
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "#FFFFFF",
            border: `1px solid ${alpha(palette.beige, 0.35)}`,
            display: "flex",
            justifyContent: "center",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.03)",
          }}
        >
          <Box
            component="img"
            src="/images/attire/Neutral%20tones.png"
            alt="Wedding attire neutral color palette: Ivory, Porcelain, Nude, Blush Nude, Beige, Tan, Dove, Mocha, Hazelnut"
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: { xs: "60vh", sm: "65vh" },
              objectFit: "contain",
              display: "block",
            }}
          />
        </Box>
      </Dialog>

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
    </Box>
  );
};

export default WeddingDetails;
