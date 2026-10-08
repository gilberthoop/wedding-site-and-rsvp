import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { palette } from "../../../theme/weddingTheme";
import { alpha } from "@mui/material/styles";
import { AdminUser } from "../../../utils/helpers/admin";
import GuestManager from "./GuestManager";
import RsvpManager from "./RsvpManager";

interface DashboardProps {
  admin: AdminUser;
}

const Dashboard = ({ admin }: DashboardProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
      {/* Welcome Banner */}
      <Card
        sx={{
          bgcolor: palette.ivory,
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          boxShadow: "0 10px 30px rgba(61,28,13,0.06)",
          border: `1px solid ${alpha(palette.beige, 0.35)}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "display",
                fontSize: { xs: "2.2rem", md: "2.8rem" },
                color: palette.chocolate,
                lineHeight: 1.2,
              }}
            >
              Welcome back, {admin.username}!
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: palette.mocha, mt: 0.5, fontSize: "0.9rem" }}
            >
              You are authenticated with full administrative privileges.
            </Typography>
          </Box>

          <Chip
            label={admin.role.toUpperCase()}
            color="success"
            size="small"
            sx={{
              fontWeight: 700,
              letterSpacing: "0.06em",
              px: 1,
            }}
          />
        </Box>

        <Divider sx={{ my: 2, borderColor: alpha(palette.beige, 0.3) }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1.5,
            fontSize: "0.85rem",
            color: palette.mocha,
          }}
        >
          <Box>
            <strong>Username:</strong> {admin.username}
          </Box>
          <Box>
            <strong>Admin ID:</strong> <code>{admin.id}</code>
          </Box>
          {admin.lastLogin && (
            <Box>
              <strong>Last Login:</strong>{" "}
              {new Date(admin.lastLogin).toLocaleString()}
            </Box>
          )}
        </Box>
      </Card>

      {/* Guest Manager */}
      <GuestManager />

      {/* RSVP Manager */}
      <RsvpManager />
    </Box>
  );
};

export default Dashboard;
