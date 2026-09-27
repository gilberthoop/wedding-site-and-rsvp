import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonIcon from "@mui/icons-material/Person";
import { palette } from "../../../theme/weddingTheme";
import { alpha } from "@mui/material/styles";
import { AdminUser, loginAdmin } from "../../../utils/helpers/admin";

interface LoginProps {
  onLogin(admin: AdminUser): void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      const res = await loginAdmin({ username, password });
      if (res.admin) {
        onLogin(res.admin);
        setSuccessMsg("Logged in successfully!");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
      setUsername("");
      setPassword("");
    }
  };

  return (
    <Box sx={{ maxWidth: 480, mx: "auto", width: "100%" }}>
      <Card
        sx={{
          bgcolor: palette.ivory,
          borderRadius: 4,
          boxShadow: "0 16px 40px rgba(61,28,13,0.08)",
          border: `1px solid ${alpha(palette.beige, 0.35)}`,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            pt: 4,
            pb: 2,
            px: 3,
            textAlign: "center",
            bgcolor: alpha(palette.porcelain, 0.5),
            borderBottom: `1px solid ${alpha(palette.beige, 0.25)}`,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: alpha(palette.nude, 0.4),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: palette.hazelnut,
              mx: "auto",
              mb: 1.5,
            }}
          >
            <LockOutlinedIcon fontSize="medium" />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "display",
              fontSize: "2.4rem",
              color: palette.chocolate,
            }}
          >
            Admin Portal
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: palette.mocha, mt: 0.5, fontSize: "0.85rem" }}
          >
            Sign in with your credentials to manage guests and RSVPs.
          </Typography>
        </Box>

        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{ mb: 2.5, borderRadius: 2 }}
            >
              {error}
            </Alert>
          )}

          {successMsg && (
            <Alert
              severity="success"
              onClose={() => setSuccessMsg(null)}
              sx={{ mb: 2.5, borderRadius: 2 }}
            >
              {successMsg}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              autoComplete="username"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: palette.tan }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#FFFFFF",
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: alpha(palette.beige, 0.5),
                  },
                  "&:hover fieldset": { borderColor: palette.hazelnut },
                  "&.Mui-focused fieldset": {
                    borderColor: palette.hazelnut,
                  },
                },
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: palette.tan }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#FFFFFF",
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: alpha(palette.beige, 0.5),
                  },
                  "&:hover fieldset": { borderColor: palette.hazelnut },
                  "&.Mui-focused fieldset": {
                    borderColor: palette.hazelnut,
                  },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              fullWidth
              sx={{
                bgcolor: palette.hazelnut,
                color: palette.ivory,
                py: 1.3,
                borderRadius: "24px",
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 600,
                mt: 1,
                "&:hover": {
                  bgcolor: palette.mocha,
                },
              }}
            >
              {submitting ? (
                <CircularProgress size={24} sx={{ color: palette.ivory }} />
              ) : (
                "Sign in"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
