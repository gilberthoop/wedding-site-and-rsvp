import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { palette } from "../theme/weddingTheme";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface StoryNode {
  year: string;
  title: string;
  body: string;
  imgAlt: string;
}

const STORY_NODES: StoryNode[] = [
  {
    year: "The Beginning",
    title: "When We First Met",
    body: "Every great love story has a beginning. This is where ours started.",
    imgAlt: "Add a photo of when you first met",
  },
  {
    year: "The Proposal",
    title: "He Asked, She Said Yes",
    body: 'The moment William got down on one knee and Sweet said "yes" — a day they\'ll remember forever.',
    imgAlt: "Add an engagement photo",
  },
  {
    year: "May 8, 2027",
    title: "Forever Begins",
    body: "On this beautiful day in May, William and Sweet will exchange their vows and begin their forever together. We are so grateful you'll be part of this milestone.",
    imgAlt: "Add a save the date photo",
  },
];

const PhotoPlaceholder = ({ alt }: { alt: string }) => {
  return (
    <Box
      aria-label={alt}
      sx={{
        width: "100%",
        aspectRatio: "4/3",
        borderRadius: 2,
        background: `linear-gradient(135deg, ${palette.nude}, ${palette.porcelain})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        mb: 2,
        border: `1.5px dashed ${palette.beige}`,
        transition: "border-color 0.3s ease",
        "&:hover": { borderColor: palette.tan },
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 64 64"
        fill="none"
        sx={{ width: 48, height: 48 }}
      >
        <rect
          width="64"
          height="64"
          rx="8"
          fill={palette.nude}
          fillOpacity={0.3}
        />
        <path
          d="M22 42l8-10 6 7 4-5 8 8H22z"
          fill={palette.tan}
          fillOpacity={0.5}
        />
        <circle cx="38" cy="26" r="4" fill={palette.tan} fillOpacity={0.5} />
        <rect
          x="12"
          y="14"
          width="40"
          height="36"
          rx="4"
          stroke={palette.tan}
          strokeWidth="1.5"
          strokeOpacity={0.6}
        />
      </Box>
      <Typography
        variant="caption"
        sx={{ color: palette.beige, letterSpacing: "0.14em" }}
      >
        Add your photo here
      </Typography>
    </Box>
  );
};

const OurStory = () => {
  const sectionRef = useScrollReveal("[data-reveal]");

  return (
    <Box
      id="our-story"
      component="section"
      ref={sectionRef as React.Ref<HTMLDivElement>}
      sx={{ bgcolor: palette.ivory, py: { xs: 7, md: 10 }, px: 2 }}
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
          How It All Began
        </Typography>
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: "2.5rem", md: "4rem" } }}
        >
          Our Story
        </Typography>
      </Box>

      {/* Timeline */}
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 5,
          "&::before": {
            content: '""',
            position: "absolute",
            left: { xs: 20, md: "50%" },
            top: 0,
            bottom: 0,
            width: "1px",
            background: `linear-gradient(to bottom, transparent, ${palette.beige} 10%, ${palette.beige} 90%, transparent)`,
            transform: { md: "translateX(-50%)" },
          },
        }}
      >
        {STORY_NODES.map((node, i) => {
          const isLeft = i % 2 === 0;
          return (
            <Box
              key={node.year}
              data-reveal
              data-delay={i * 150}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "50px 1fr", md: "1fr 60px 1fr" },
                gap: 2,
                alignItems: "center",
                opacity: 0,
                transform: {
                  xs: "translateY(30px)",
                  md: isLeft ? "translateX(-40px)" : "translateX(40px)",
                },
                transition: "opacity 0.7s ease, transform 0.7s ease",
              }}
            >
              {/* Desktop: empty cell on the right side */}
              {!isLeft && <Box sx={{ display: { xs: "none", md: "block" } }} />}

              {/* Marker (desktop center column) */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gridColumn: { xs: "1", md: isLeft ? "2" : "2" },
                  gridRow: { xs: "1", md: "1" },
                }}
              >
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    bgcolor: palette.tan,
                    border: `3px solid ${palette.ivory}`,
                    boxShadow: `0 0 0 3px ${palette.beige}`,
                    mb: 0.5,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: palette.tan,
                    letterSpacing: "0.14em",
                    textAlign: "center",
                  }}
                >
                  {node.year}
                </Typography>
              </Box>

              {/* Card */}
              <Card
                sx={{
                  bgcolor: palette.porcelain,
                  gridColumn: { xs: "2", md: isLeft ? "1" : "3" },
                  gridRow: { xs: "1", md: "1" },
                  order: { xs: 0, md: isLeft ? -1 : 0 },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <PhotoPlaceholder alt={node.imgAlt} />
                  <Typography
                    variant="h4"
                    sx={{ fontSize: "1.3rem", mb: 0.75 }}
                  >
                    {node.title}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: "0.88rem" }}>
                    {node.body}
                  </Typography>
                </CardContent>
              </Card>

              {/* Desktop: empty cell on the left side */}
              {isLeft && <Box sx={{ display: { xs: "none", md: "block" } }} />}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default OurStory;
