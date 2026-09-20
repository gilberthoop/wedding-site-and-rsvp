import { useState, useEffect, useCallback, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";

import { palette } from "../theme/weddingTheme";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { GallerySlot } from "../utils/types/home";
import { SLOTS } from "../utils/constants";

const INITIAL_VISIBLE_COUNT = 12;

interface PhotoSlotProps {
  slot: GallerySlot;
  onClick?: () => void;
}

const PhotoSlot = ({ slot, onClick }: PhotoSlotProps) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const hasImage = Boolean(slot.imgSrc);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, [slot.imgSrc]);

  return (
    <Box
      data-reveal
      data-delay={slot.delay}
      role="button"
      tabIndex={0}
      aria-label={slot.alt || "View wedding photo"}
      onClick={hasImage ? onClick : undefined}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && hasImage && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        gridRow: slot.tall ? "span 2" : "span 1",
        gridColumn: slot.wide ? "span 2" : "span 1",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        cursor: hasImage ? "pointer" : "default",
        boxShadow: "0 8px 40px rgba(61,28,13,0.08)",
        transition: "transform 0.35s ease, box-shadow 0.35s ease",
        "&:hover, &:focus-visible": {
          transform: hasImage ? "scale(1.025)" : "none",
          boxShadow: hasImage
            ? "0 16px 56px rgba(61,28,13,0.16)"
            : "0 8px 40px rgba(61,28,13,0.08)",
          outline: `2px solid ${palette.tan}`,
        },
        opacity: 0,
        transform: "translateY(20px) scale(0.98)",
        transitionProperty: "opacity, transform, box-shadow",
      }}
    >
      {hasImage ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            bgcolor: palette.porcelain,
            overflow: "hidden",
            "&:hover .zoom-overlay": {
              opacity: 1,
            },
            "&:hover img": {
              transform: "scale(1.06)",
            },
          }}
        >
          {/* Subtle placeholder while image is downloading */}
          {!loaded && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(135deg, ${palette.cream}, ${palette.porcelain}, ${palette.nude})`,
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.6 },
                },
              }}
            />
          )}

          <Box
            component="img"
            ref={imgRef}
            src={slot.imgSrc}
            alt={slot.alt || "Wedding gallery photo"}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              opacity: loaded ? 1 : 0,
              transition:
                "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease",
            }}
          />

          {/* Hover highlight overlay */}
          <Box
            className="zoom-overlay"
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to top, rgba(61,28,13,0.45) 0%, rgba(61,28,13,0.05) 50%, transparent 100%)`,
              opacity: 0,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              p: 1.5,
              transition: "opacity 0.3s ease",
            }}
          >
            <Box
              sx={{
                bgcolor: alpha(palette.ivory, 0.85),
                backdropFilter: "blur(6px)",
                color: palette.chocolate,
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <ZoomInRoundedIcon sx={{ fontSize: 20 }} />
            </Box>
          </Box>
        </Box>
      ) : (
        /* Empty Slot Fallback */
        <Box
          sx={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(135deg, ${palette.cream}, ${palette.porcelain}, ${palette.nude})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            border: `1.5px dashed ${palette.beige}`,
            minHeight: 180,
            "&:hover": {
              background: `linear-gradient(135deg, ${palette.porcelain}, ${palette.nude}, ${alpha(palette.beige, 0.5)})`,
            },
            transition: "background 0.3s ease",
          }}
        >
          <Box
            component="svg"
            viewBox="0 0 64 64"
            fill="none"
            sx={{ width: 52, height: 52 }}
          >
            <rect
              width="64"
              height="64"
              rx="4"
              fill={palette.beige}
              fillOpacity={0.2}
            />
            <path
              d="M14 46l12-14 9 10 6-7 13 11H14z"
              fill={palette.tan}
              fillOpacity={0.4}
            />
            <circle
              cx="43"
              cy="22"
              r="5"
              fill={palette.tan}
              fillOpacity={0.4}
            />
          </Box>
          <Typography
            variant="caption"
            sx={{ color: palette.beige, letterSpacing: "0.15em" }}
          >
            Add photo
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const Gallery = () => {
  const sectionRef = useScrollReveal("[data-reveal]");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [showAll, setShowAll] = useState<boolean>(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Extract unique subfolders if any exist
  const availableFolders = Array.from(
    new Set(
      SLOTS.map((s) => s.folder).filter((folder): folder is string =>
        Boolean(folder),
      ),
    ),
  );

  // Filter slots based on folder tab
  const filteredSlots =
    selectedFolder === "all"
      ? SLOTS
      : SLOTS.filter((s) => s.folder === selectedFolder);

  // Photos that can be viewed in the lightbox
  const viewablePhotos = filteredSlots.filter((s) => Boolean(s.imgSrc));

  // Determine items visible in the masonry grid
  const visibleSlots = showAll
    ? filteredSlots
    : filteredSlots.slice(0, INITIAL_VISIBLE_COUNT);

  const hasMore = filteredSlots.length > INITIAL_VISIBLE_COUNT;

  // Lightbox navigation handlers
  const handlePrev = useCallback(() => {
    setActivePhotoIndex((current) => {
      if (current === null || viewablePhotos.length === 0) return null;
      return current > 0 ? current - 1 : viewablePhotos.length - 1;
    });
  }, [viewablePhotos.length]);

  const handleNext = useCallback(() => {
    setActivePhotoIndex((current) => {
      if (current === null || viewablePhotos.length === 0) return null;
      return current < viewablePhotos.length - 1 ? current + 1 : 0;
    });
  }, [viewablePhotos.length]);

  const handleClose = () => {
    setActivePhotoIndex(null);
  };

  // Keyboard controls for lightbox
  useEffect(() => {
    if (activePhotoIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePhotoIndex, handlePrev, handleNext]);

  const activePhoto =
    activePhotoIndex !== null ? viewablePhotos[activePhotoIndex] : null;

  return (
    <Box
      id="gallery"
      component="section"
      ref={sectionRef as React.Ref<HTMLDivElement>}
      sx={{
        bgcolor: palette.ivory,
        py: { xs: 7, md: 10 },
        px: { xs: 2, md: 4 },
      }}
    >
      {/* Section header */}
      <Box
        data-reveal
        sx={{
          textAlign: "center",
          mb: 5,
          opacity: 0,
          transform: "translateY(30px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <Typography variant="h6" component="p" sx={{ mb: 1 }}>
          Memories Together
        </Typography>
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: "2.5rem", md: "4rem" }, mb: 1.5 }}
        >
          Our Gallery
        </Typography>

        {/* Folder filter tabs if photos are organized in subfolders */}
        {availableFolders.length > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              flexWrap: "wrap",
              mt: 2,
            }}
          >
            <Chip
              label="All Photos"
              clickable
              onClick={() => {
                setSelectedFolder("all");
                setShowAll(false);
              }}
              variant={selectedFolder === "all" ? "filled" : "outlined"}
              sx={{
                bgcolor:
                  selectedFolder === "all" ? palette.hazelnut : "transparent",
                color:
                  selectedFolder === "all" ? palette.ivory : palette.chocolate,
                borderColor: palette.tan,
                fontWeight: selectedFolder === "all" ? 600 : 400,
              }}
            />
            {availableFolders.map((folder) => (
              <Chip
                key={folder}
                label={folder.charAt(0).toUpperCase() + folder.slice(1)}
                clickable
                onClick={() => {
                  setSelectedFolder(folder);
                  setShowAll(false);
                }}
                variant={selectedFolder === folder ? "filled" : "outlined"}
                sx={{
                  bgcolor:
                    selectedFolder === folder
                      ? palette.hazelnut
                      : "transparent",
                  color:
                    selectedFolder === folder
                      ? palette.ivory
                      : palette.chocolate,
                  borderColor: palette.tan,
                  fontWeight: selectedFolder === folder ? 600 : 400,
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Masonry grid */}
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            md: "repeat(3, 1fr)",
          },
          gridAutoRows: { xs: 180, md: 280 },
          gridAutoFlow: "dense",
          gap: { xs: 1.5, md: 2 },
        }}
      >
        {visibleSlots.map((slot, i) => {
          const photoIndex = viewablePhotos.findIndex(
            (p) => p.imgSrc === slot.imgSrc,
          );
          return (
            <PhotoSlot
              key={`${slot.imgSrc || i}-${i}`}
              slot={slot}
              onClick={
                photoIndex >= 0
                  ? () => setActivePhotoIndex(photoIndex)
                  : undefined
              }
            />
          );
        })}
      </Box>

      {/* Show more / collapse button */}
      {hasMore && (
        <Box
          data-reveal
          sx={{
            textAlign: "center",
            mt: 5,
            opacity: 0,
            transform: "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setShowAll(!showAll)}
            sx={{
              color: palette.hazelnut,
              borderColor: palette.tan,
              px: { xs: 3, md: 4 },
              py: 1.2,
              letterSpacing: "0.14em",
              "&:hover": {
                borderColor: palette.hazelnut,
                bgcolor: alpha(palette.tan, 0.08),
              },
            }}
          >
            {showAll
              ? "Show Fewer Photos"
              : `View All Photos (${filteredSlots.length})`}
          </Button>
        </Box>
      )}

      {/* Lightbox Dialog */}
      <Dialog
        open={Boolean(activePhoto)}
        onClose={handleClose}
        maxWidth="lg"
        slotProps={{
          paper: {
            sx: {
              bgcolor: "transparent",
              boxShadow: "none",
              overflow: "hidden",
              m: { xs: 1, sm: 2 },
              maxHeight: "92vh",
              maxWidth: "92vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          },
          backdrop: {
            sx: {
              bgcolor: "rgba(25, 12, 6, 0.9)",
              backdropFilter: "blur(10px)",
            },
          },
        }}
      >
        {activePhoto && (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            {/* Close Button */}
            <IconButton
              aria-label="Close photo preview"
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 10,
                color: palette.ivory,
                bgcolor: "rgba(61, 28, 13, 0.6)",
                backdropFilter: "blur(4px)",
                "&:hover": {
                  bgcolor: palette.hazelnut,
                },
              }}
            >
              <CloseRoundedIcon />
            </IconButton>

            {/* Previous Button */}
            {viewablePhotos.length > 1 && (
              <IconButton
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                sx={{
                  position: "absolute",
                  left: { xs: 8, sm: 16 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  color: palette.ivory,
                  bgcolor: "rgba(61, 28, 13, 0.6)",
                  backdropFilter: "blur(4px)",
                  "&:hover": {
                    bgcolor: palette.hazelnut,
                  },
                }}
              >
                <ArrowBackIosNewRoundedIcon
                  sx={{ fontSize: { xs: 18, sm: 24 } }}
                />
              </IconButton>
            )}

            {/* Main Photo in Lightbox */}
            <Box
              component="img"
              src={activePhoto.imgSrc}
              alt={activePhoto.alt || "Wedding gallery photo enlarged"}
              sx={{
                maxHeight: "82vh",
                maxWidth: "88vw",
                objectFit: "contain",
                borderRadius: 2,
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
                display: "block",
              }}
            />

            {/* Next Button */}
            {viewablePhotos.length > 1 && (
              <IconButton
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                sx={{
                  position: "absolute",
                  right: { xs: 8, sm: 16 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  color: palette.ivory,
                  bgcolor: "rgba(61, 28, 13, 0.6)",
                  backdropFilter: "blur(4px)",
                  "&:hover": {
                    bgcolor: palette.hazelnut,
                  },
                }}
              >
                <ArrowForwardIosRoundedIcon
                  sx={{ fontSize: { xs: 18, sm: 24 } }}
                />
              </IconButton>
            )}

            {/* Photo Counter */}
            {activePhotoIndex !== null && viewablePhotos.length > 1 && (
              <Typography
                variant="caption"
                sx={{
                  mt: 1.5,
                  color: palette.porcelain,
                  letterSpacing: "0.2em",
                  fontSize: "0.8rem",
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                {activePhotoIndex + 1} / {viewablePhotos.length}
              </Typography>
            )}
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default Gallery;
