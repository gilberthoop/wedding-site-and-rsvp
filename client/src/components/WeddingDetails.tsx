import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DiamondIcon from "@mui/icons-material/Diamond";
import CelebrationIcon from "@mui/icons-material/Celebration";
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
  delay?: number;
}

const DetailCard = ({
  icon,
  title,
  subtitle,
  children,
  chip,
  link,
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
        </CardContent>
      </Card>
    </Grid>
  );
};

const WeddingDetails = () => {
  const sectionRef = useScrollReveal("[data-reveal]");

  return (
    <Box
      id="details"
      component="section"
      ref={sectionRef as React.Ref<HTMLDivElement>}
      sx={{ bgcolor: palette.porcelain, py: { xs: 7, md: 10 }, px: 2 }}
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
            Ceremony time to be announced.
            <br />
            Please check back for updates.
          </Typography>
        </DetailCard>

        <DetailCard
          icon={<DiamondIcon fontSize="medium" />}
          title="Dress Code"
          subtitle="Formal Attire"
          delay={300}
        >
          <Typography variant="body1" sx={{ fontSize: "0.88rem" }}>
            Traditional Filipino Wear or Neutral Tones are warmly encouraged.
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "0.78rem", fontStyle: "italic", mt: 1 }}
          >
            Maria Clara / Terno is exclusively reserved for the Bride.
          </Typography>
        </DetailCard>

        <DetailCard
          icon={<CelebrationIcon fontSize="medium" />}
          title="Reception"
          subtitle="Venue To Be Announced"
          chip="Details Coming Soon"
          delay={400}
        >
          <Typography variant="body1" sx={{ fontSize: "0.88rem" }}>
            Dinner, dancing, and celebration to follow the ceremony.
          </Typography>
        </DetailCard>
      </Grid>
    </Box>
  );
};

export default WeddingDetails;
