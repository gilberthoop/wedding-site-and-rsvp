import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme, alpha } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { palette } from '../theme/weddingTheme';

const NAV_LINKS = [
  { label: 'Our Story',     href: '#our-story'     },
  { label: 'Details',       href: '#details'       },
  { label: 'Gallery',       href: '#gallery'       },
  { label: 'Wedding Party', href: '#wedding-party' },
];

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [scrolled, setScrolled]   = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setDrawerOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: scrolled ? alpha(palette.ivory, 0.94) : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? '0 4px 24px rgba(61,28,13,0.08)' : 'none',
          transition: 'all 0.4s ease',
          borderBottom: scrolled ? `1px solid ${alpha(palette.beige, 0.3)}` : 'none',
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1200,
            width: '100%',
            mx: 'auto',
            px: { xs: 2, md: 4 },
            py: scrolled ? 0.5 : 1,
            transition: 'padding 0.4s ease',
            justifyContent: 'space-between',
          }}
        >
          {/* Monogram */}
          <Typography
            component="a"
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '1.3rem',
              fontWeight: 600,
              color: palette.hazelnut,
              letterSpacing: '0.05em',
              cursor: 'pointer',
              '&:hover': { color: palette.mocha },
              transition: 'color 0.3s ease',
            }}
          >
            W <Box component="span" sx={{ fontFamily: '"Great Vibes", cursive', fontSize: '1.6rem' }}>&amp;</Box> S
          </Typography>

          {/* Desktop nav links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3.5 }}>
              {NAV_LINKS.map((link) => (
                <Typography
                  key={link.href}
                  component="a"
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  sx={{
                    fontFamily: '"Jost", sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: palette.mocha,
                    position: 'relative',
                    cursor: 'pointer',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -3, left: 0,
                      width: '0%', height: '1px',
                      background: palette.tan,
                      transition: 'width 0.3s ease',
                    },
                    '&:hover': { color: palette.hazelnut },
                    '&:hover::after': { width: '100%' },
                    transition: 'color 0.3s ease',
                  }}
                >
                  {link.label}
                </Typography>
              ))}

              <Button
                href="#rsvp"
                onClick={(e) => { e.preventDefault(); handleNavClick('#rsvp'); }}
                variant="outlined"
                color="primary"
                size="small"
                sx={{ borderRadius: 50, fontSize: '0.7rem', px: 2.2, py: 0.6 }}
              >
                RSVP
              </Button>
            </Box>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              sx={{ color: palette.hazelnut }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: alpha(palette.ivory, 0.97),
            backdropFilter: 'blur(16px)',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: palette.hazelnut }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ px: 3, pb: 2 }}>
          <Typography
            sx={{
              fontFamily: '"Great Vibes", cursive',
              fontSize: '2rem',
              color: palette.chocolate,
              mb: 2,
            }}
          >
            William &amp; Sweet
          </Typography>
        </Box>

        <List>
          {[...NAV_LINKS, { label: 'RSVP', href: '#rsvp' }].map((link) => (
            <ListItem key={link.href} disablePadding>
              <ListItemButton
                onClick={() => handleNavClick(link.href)}
                sx={{
                  px: 3,
                  py: 1.5,
                  fontFamily: '"Jost", sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: palette.mocha,
                  '&:hover': { bgcolor: alpha(palette.nude, 0.2), color: palette.hazelnut },
                }}
              >
                {link.label}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
