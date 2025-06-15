import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Fade,
  Paper,
  Link as MuiLink,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import octoFilmsLogo from "/logo.svg";
import { darkTheme, lightTheme } from "./ui/themes";

const GradientBackground = styled(Box)({
  minHeight: "100vh",
  margin: 0,
  background: "linear-gradient(135deg, #1a237e 0%, #8e24aa 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  position: "relative",
  overflow: "hidden",
});

const GlassCard = styled(Paper)({
  background: "rgba(255,255,255,0.15)",
  borderRadius: 24,
  padding: "48px 32px",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.18)",
  maxWidth: 540,
  width: "100%",
  textAlign: "center",
  margin: "48px auto 32px auto",
});

const AnimatedLogo = styled("img")({
  width: 96,
  height: 96,
  marginBottom: 24,
  filter: "drop-shadow(0 0 16px #8e24aa88)",
  animation: "spin 8s linear infinite",
  "@keyframes spin": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },
});

const FeatureCard = styled(Card)(({ theme }) => ({
  background: "rgba(255,255,255,0.10)",
  borderRadius: 20,
  boxShadow: "0 4px 24px 0 rgba(31, 38, 135, 0.18)",
  color: theme.palette.mode === "dark" ? "#fff" : theme.palette.text.primary,
  minHeight: 220,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-8px) scale(1.03)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.28)",
  },
}));

function App() {
  const [mode, setMode] = useState("dark");
  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Theme toggle button */}
      <Box sx={{ position: "fixed", top: 24, right: 24, zIndex: 10 }}>
        <IconButton
          aria-label={
            mode === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          color="secondary"
          size="large"
        >
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Box>
      <GradientBackground>
        <Container maxWidth="md" sx={{ zIndex: 2, pt: 6 }}>
          <Fade in timeout={1200}>
            <GlassCard elevation={8}>
              <AnimatedLogo
                src={octoFilmsLogo}
                alt="Octo Films Logo"
                aria-label="Octo Films Logo"
              />
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: "#fff",
                  textShadow: "0 2px 8px #8e24aa88",
                }}
              >
                Octo Films
              </Typography>
              <Typography
                variant="h5"
                color="#fff"
                sx={{ mb: 2, fontWeight: 400 }}
              >
                Discover, review, and manage your favorite movies.
                <br />
                <b>Work in Progress:</b> This site is a student project for the
                Frontend Finals.
              </Typography>
              <Typography variant="body1" color="#f3e5f5" sx={{ mb: 3 }}>
                Sign up or log in to start rating films and join our growing
                community!
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="center"
                sx={{ mb: 2 }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ fontWeight: 600, px: 4 }}
                  href="/login"
                  aria-label="Login"
                  disabled={true} // Disable until backend is ready
                  aria-disabled="true" // For accessibility
                  // add a tooltip or message explaining why it's disabled
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  sx={{ fontWeight: 600, px: 4, borderWidth: 2 }}
                  href="/register"
                  aria-label="Create Account"
                  disabled={true} // Disable until backend is ready
                  aria-disabled="true" // For accessibility
                  // add a tooltip or message explaining why it's disabled
                >
                  Create Account
                </Button>
              </Stack>
              <Typography>
                The authentication system is not yet implemented.
              </Typography>
              <Typography variant="caption" color="#fff" sx={{ opacity: 0.8 }}>
                Made by Lucian Diaconu as a student project.{" "}
                <MuiLink
                  href="https://www.figma.com/design/dPeA6lGy8tOHCLZoJPKRDv/Octo-Films?node-id=0-1&t=chQnjXG8pvWHCI9Y-1"
                  color="inherit"
                  underline="always"
                  target="_blank"
                  rel="noopener"
                >
                  See the Figma prototype
                </MuiLink>
                .
              </Typography>
            </GlassCard>
          </Fade>
          {/* Features Section */}
          <Box sx={{ mt: 6, mb: 8 }}>
            <Typography
              variant="h4"
              component="h2"
              align="center"
              sx={{
                color: "#fff",
                fontWeight: 600,
                mb: 4,
                textShadow: "0 2px 8px #8e24aa55",
              }}
            >
              Why Octo Films?
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={4}
              justifyContent="center"
              alignItems="stretch"
              useFlexGap
            >
              <FeatureCard
                tabIndex={0}
                role="region"
                aria-label="Discover Films"
                sx={{ flex: 1, minWidth: 260, maxWidth: 360 }}
              >
                <CardHeader
                  title={
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700 }}
                      color={theme.palette.secondary.main}
                    >
                      Discover Films
                    </Typography>
                  }
                  sx={{
                    textAlign: "center",
                    pb: 0,
                    color: theme.palette.secondary.main,
                  }}
                />
                <CardContent>
                  <Typography>
                    Browse a rich catalog of movies, filter by genre, rating,
                    and more. Find your next favorite film easily!
                  </Typography>
                </CardContent>
              </FeatureCard>
              <FeatureCard
                tabIndex={0}
                role="region"
                aria-label="Review and Rate"
                sx={{ flex: 1, minWidth: 260, maxWidth: 360 }}
              >
                <CardHeader
                  title={
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700 }}
                      color={theme.palette.secondary.main}
                    >
                      Review & Rate
                    </Typography>
                  }
                  sx={{
                    textAlign: "center",
                    pb: 0,
                    color: theme.palette.secondary.main,
                  }}
                />
                <CardContent>
                  <Typography>
                    Share your thoughts and rate movies. Edit or delete your
                    reviews anytime. Your opinion matters!
                  </Typography>
                </CardContent>
              </FeatureCard>
              <FeatureCard
                tabIndex={0}
                role="region"
                aria-label="Personal Dashboard"
                sx={{ flex: 1, minWidth: 260, maxWidth: 360 }}
              >
                <CardHeader
                  title={
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700 }}
                      color={theme.palette.secondary.main}
                    >
                      Personal Dashboard
                    </Typography>
                  }
                  sx={{
                    textAlign: "center",
                    pb: 0,
                    color: theme.palette.secondary.main,
                  }}
                />
                <CardContent>
                  <Typography>
                    Manage your reviews, favorites, and profile in one place.
                    Enjoy a personalized movie experience.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Stack>
          </Box>
        </Container>
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            width: "100vw",
            height: "100vh",
            top: 0,
            left: 0,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          {/* Decorative animated circles for visual effect */}
          <Box
            sx={{
              position: "absolute",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #8e24aa55 0%, transparent 80%)",
              top: -80,
              left: -80,
              animation: "float1 12s ease-in-out infinite",
              "@keyframes float1": {
                "0%, 100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(40px)" },
              },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #3949ab55 0%, transparent 80%)",
              bottom: -60,
              right: -60,
              animation: "float2 10s ease-in-out infinite",
              "@keyframes float2": {
                "0%, 100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(-30px)" },
              },
            }}
          />
        </Box>
      </GradientBackground>
    </ThemeProvider>
  );
}

export default App;
