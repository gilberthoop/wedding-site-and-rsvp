import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import { alpha } from "@mui/material/styles";
import { palette } from "../theme/weddingTheme";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface PartyMember {
  name: string;
  role: string;
}

const BRIDESMAIDS: PartyMember[] = [
  { name: "Name Here", role: "Maid of Honor" },
  { name: "Name Here", role: "Bridesmaid" },
  { name: "Name Here", role: "Bridesmaid" },
  { name: "Name Here", role: "Bridesmaid" },
];

const GROOMSMEN: PartyMember[] = [
  { name: "Name Here", role: "Best Man" },
  { name: "Name Here", role: "Groomsman" },
  { name: "Name Here", role: "Groomsman" },
  { name: "Name Here", role: "Groomsman" },
];

interface MemberCardProps {
  member: PartyMember;
  isBridesmaid: boolean;
  delay: number;
}

const MemberCard = ({ member, isBridesmaid, delay }: MemberCardProps) => {
  return (
    <Grid size={{ xs: 6, sm: 4, md: 3 }}>
      <Card
        data-reveal
        data-delay={delay}
        sx={{
          textAlign: "center",
          bgcolor: palette.ivory,
          opacity: 0,
          transform: "translateY(30px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <CardContent
          sx={{
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: isBridesmaid
                ? `linear-gradient(135deg, ${palette.nude}, ${palette.porcelain})`
                : `linear-gradient(135deg, ${palette.porcelain}, ${palette.cream})`,
              background: isBridesmaid
                ? `linear-gradient(135deg, ${palette.nude}, ${palette.porcelain})`
                : `linear-gradient(135deg, ${palette.porcelain}, ${palette.cream})`,
              border: `2px dashed ${isBridesmaid ? palette.beige : alpha(palette.tan, 0.5)}`,
              mb: 0.5,
            }}
          >
            {/* Placeholder person icon */}
            <Box
              component="svg"
              viewBox="0 0 48 48"
              fill="none"
              sx={{ width: 44, height: 44 }}
            >
              <circle
                cx="24"
                cy="18"
                r="8"
                stroke={isBridesmaid ? palette.tan : palette.hazelnut}
                strokeWidth="1.5"
                strokeOpacity={0.6}
              />
              <path
                d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16"
                stroke={isBridesmaid ? palette.tan : palette.hazelnut}
                strokeWidth="1.5"
                strokeOpacity={0.6}
              />
            </Box>
          </Avatar>

          <Typography variant="h4" sx={{ fontSize: "1rem" }}>
            {member.name}
          </Typography>
          <Typography variant="subtitle2" sx={{ fontSize: "0.68rem" }}>
            {member.role}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

interface PartyGroupProps {
  title: string;
  members: PartyMember[];
  isBridesmaid: boolean;
  baseDelay?: number;
}

const PartyGroup = ({
  title,
  members,
  isBridesmaid,
  baseDelay = 0,
}: PartyGroupProps) => {
  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", mb: 6 }}>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          mb: 3,
          fontStyle: "italic",
          color: palette.mocha,
        }}
      >
        {title}
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {members.map((m, i) => (
          <MemberCard
            key={`${m.role}-${i}`}
            member={m}
            isBridesmaid={isBridesmaid}
            delay={baseDelay + i * 100}
          />
        ))}
      </Grid>
    </Box>
  );
};

const WeddingParty = () => {
  const sectionRef = useScrollReveal("[data-reveal]");

  return (
    <Box
      id="wedding-party"
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
          The People We Love Most
        </Typography>
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: "2.5rem", md: "4rem" } }}
        >
          Wedding Party
        </Typography>
      </Box>

      <PartyGroup
        title="Bridesmaids"
        members={BRIDESMAIDS}
        isBridesmaid
        baseDelay={100}
      />
      <PartyGroup
        title="Groomsmen"
        members={GROOMSMEN}
        isBridesmaid={false}
        baseDelay={200}
      />
    </Box>
  );
};

export default WeddingParty;
