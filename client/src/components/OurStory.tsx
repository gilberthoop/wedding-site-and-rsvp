import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { palette } from "../theme/weddingTheme";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { STORY_NODES } from "../utils/constants";

const OurStory = () => {
  const sectionRef = useScrollReveal("[data-reveal]");

  return (
    <Box
      id="our-story"
      component="section"
      ref={sectionRef as React.Ref<HTMLDivElement>}
      sx={{ bgcolor: palette.ivory, py: { xs: 7, md: 10 }, px: 2 }}
    >
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
            background: {
              md: `linear-gradient(to bottom, transparent, ${palette.beige} 10%, ${palette.beige} 90%, transparent)`,
            },
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
                gridTemplateColumns: { xs: "100px 1fr", md: "1fr 60px 1fr" },
                gap: { xs: 3, md: 6 },
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
                  gridColumn: { xs: "1", md: isLeft ? "3" : "1" },
                  gridRow: "1",
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
                    mb: 1.2,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: palette.tan,
                    letterSpacing: "0.14em",
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: { xs: "14px", md: "16px" },
                  }}
                >
                  {node.year}
                </Typography>
              </Box>

              {/* Photo Card */}
              <Card
                sx={{
                  bgcolor: palette.porcelain,
                  gridColumn: { xs: "2", md: isLeft ? "1" : "3" },
                  gridRow: { xs: "1", md: "1" },
                  order: { xs: 0, md: isLeft ? -1 : 0 },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box
                    component="img"
                    src={node.imgSrc}
                    alt={node.imgAlt}
                    sx={{
                      width: "100%",
                      height: "100%",
                      ...(node.imgAspectRatio && {
                        aspectRatio: node.imgAspectRatio,
                      }),
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${palette.nude}, ${palette.porcelain})`,
                      mb: 2,
                      border: `1.5px solid ${palette.beige}`,
                      transition: "border-color 0.3s ease",
                      "&:hover": { borderColor: palette.tan },
                    }}
                  />
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
