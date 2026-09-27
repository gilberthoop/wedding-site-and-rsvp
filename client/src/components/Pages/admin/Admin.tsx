import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import { palette } from "../../../theme/weddingTheme";
import { alpha } from "@mui/material/styles";
import {
  AdminUser,
  fetchCurrentAdmin,
  logoutAdmin,
} from "../../../utils/helpers/admin";
import Login from "./Login";
import Dashboard from "./Dashboard";

interface AdminProps {
  onNavigateHome?: () => void;
}

const Admin = ({ onNavigateHome }: AdminProps) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Check existing admin privileges on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const current = await fetchCurrentAdmin();
        if (isMounted) {
          setAdmin(current);
        }
      } catch {
        if (isMounted) setAdmin(null);
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoginSuccess = (admin: AdminUser) => {
    setAdmin(admin);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setAdmin(null);
  };

  const handleBackToWebsite = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  if (initialLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: palette.porcelain,
          p: 3,
        }}
      >
        <CircularProgress sx={{ color: palette.hazelnut, mb: 2 }} />
        <Typography variant="body1" sx={{ color: palette.mocha }}>
          Verifying admin session...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: palette.porcelain,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Top Header Bar */}
      <Box
        component="header"
        sx={{
          bgcolor: palette.ivory,
          borderBottom: `1px solid ${alpha(palette.beige, 0.4)}`,
          py: 2,
          px: { xs: 2, md: 4 },
          boxShadow: "0 2px 12px rgba(61,28,13,0.04)",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              onClick={handleBackToWebsite}
              startIcon={<ArrowBackIcon />}
              sx={{
                color: palette.mocha,
                fontSize: "0.85rem",
                textTransform: "none",
                fontWeight: 500,
                borderRadius: "20px",
                px: 1.5,
                bgcolor: alpha(palette.nude, 0.2),
                "&:hover": {
                  bgcolor: alpha(palette.nude, 0.35),
                  color: palette.chocolate,
                },
              }}
            >
              Wedding Website
            </Button>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "display",
                fontSize: { xs: "1.4rem", sm: "1.8rem" },
                color: palette.chocolate,
                display: { xs: "none", sm: "block" },
              }}
            >
              William &amp; Sweet
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              icon={
                <LockOutlinedIcon
                  style={{ fontSize: "14px", color: palette.hazelnut }}
                />
              }
              label="Admin Portal"
              size="small"
              sx={{
                bgcolor: alpha(palette.beige, 0.3),
                color: palette.hazelnut,
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />
            {admin && (
              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: alpha(palette.beige, 0.6),
                  color: palette.mocha,
                  fontSize: "0.78rem",
                  textTransform: "none",
                  ml: 1,
                  "&:hover": {
                    borderColor: palette.hazelnut,
                    color: palette.chocolate,
                    bgcolor: alpha(palette.nude, 0.15),
                  },
                }}
              >
                Sign Out
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          py: { xs: 4, md: 6 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {!admin ? (
          <Login onLogin={handleLoginSuccess} />
        ) : (
          <Dashboard admin={admin} />
        )}
      </Container>
    </Box>
  );
};

export default Admin;
