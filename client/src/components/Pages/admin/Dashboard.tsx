import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import KeyIcon from "@mui/icons-material/Key";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CodeIcon from "@mui/icons-material/Code";
import { palette } from "../../../theme/weddingTheme";
import { alpha } from "@mui/material/styles";
import { AdminUser, getAdminToken } from "../../../utils/helpers/admin";
import GuestManager from "./GuestManager";
import RsvpManager from "./RsvpManager";

interface DashboardProps {
  admin: AdminUser;
}

const Dashboard = ({ admin }: DashboardProps) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const token = getAdminToken();
  const exampleAuthHeader = token
    ? `Authorization: Bearer ${token}`
    : `Authorization: Bearer <YOUR_TOKEN>`;

  const exampleCurl = `curl -X GET "http://localhost:8080/api/admin/me" \\
    -H "${exampleAuthHeader}"`;

  const handleCopyToken = () => {
    const token = getAdminToken();
    if (token) {
      navigator.clipboard.writeText(token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

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

      {/* Auth Token Card */}
      <Card
        sx={{
          bgcolor: palette.ivory,
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          boxShadow: "0 10px 30px rgba(61,28,13,0.06)",
          border: `1px solid ${alpha(palette.beige, 0.35)}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 1 }}>
          <KeyIcon sx={{ color: palette.hazelnut }} />
          <Typography
            variant="h5"
            sx={{ fontSize: "1.25rem", color: palette.chocolate }}
          >
            Admin Authorization Token
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: palette.mocha, mb: 2 }}>
          This JWT token authenticates your requests from the client or API when
          adding and deleting guests and RSVPs.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: "#251710",
            color: "#F8F6EE",
            borderRadius: 2,
            position: "relative",
            fontFamily: "monospace",
            fontSize: "0.82rem",
            wordBreak: "break-all",
            maxHeight: "110px",
            overflowY: "auto",
          }}
        >
          {token || "No token found"}
        </Paper>

        <Box sx={{ display: "flex", gap: 1.5, mt: 2, flexWrap: "wrap" }}>
          <Button
            onClick={handleCopyToken}
            variant="contained"
            startIcon={copiedToken ? <CheckCircleIcon /> : <ContentCopyIcon />}
            sx={{
              bgcolor: palette.hazelnut,
              color: palette.ivory,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "20px",
              px: 2.5,
              "&:hover": { bgcolor: palette.mocha },
            }}
          >
            {copiedToken ? "Token Copied!" : "Copy Auth Token"}
          </Button>

          <Button
            onClick={() => {
              navigator.clipboard.writeText(exampleCurl);
              setCopiedCurl(true);
              setTimeout(() => setCopiedCurl(false), 2000);
            }}
            variant="outlined"
            startIcon={copiedCurl ? <CheckCircleIcon /> : <CodeIcon />}
            sx={{
              borderColor: alpha(palette.hazelnut, 0.4),
              color: palette.hazelnut,
              textTransform: "none",
              borderRadius: "20px",
              px: 2,
              "&:hover": {
                borderColor: palette.hazelnut,
                bgcolor: alpha(palette.nude, 0.15),
              },
            }}
          >
            {copiedCurl ? "cURL Copied!" : "Copy Test cURL"}
          </Button>
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
