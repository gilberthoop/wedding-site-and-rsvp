import { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { alpha } from "@mui/material/styles";
import { palette } from "../../../theme/weddingTheme";
import {
  deleteRsvp,
  editRsvp,
  fetchRsvps,
  ATTENDANCE_LABEL,
  ATTENDANCE_COLOR,
} from "../../../utils/helpers/rsvp";
import { Attendance, RSVPDetails, RsvpData } from "../../../utils/types/rsvp";

const emptyRsvp = (): RSVPDetails => ({
  firstname: "",
  lastname: "",
  email: "",
  attending: "yes",
  dietaryRestrictions: "",
  songRequest: "",
  message: "",
});

const RsvpManager = () => {
  const [rsvps, setRsvps] = useState<RsvpData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingRsvp, setEditingRsvp] = useState<RsvpData | null>(null);
  const [editForm, setEditForm] = useState<RSVPDetails>(emptyRsvp);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RsvpData | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadRsvps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchRsvps();
      setRsvps(response.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load RSVPs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRsvps();
  }, [loadRsvps]);

  const counts = useMemo(
    () => ({
      total: rsvps.length,
      attending: rsvps.filter((rsvp) => rsvp.attending === "yes").length,
      notAttending: rsvps.filter((rsvp) => rsvp.attending === "no").length,
    }),
    [rsvps],
  );

  const filteredRsvps = useMemo(() => {
    const query = search.trim().toLocaleLowerCase().replace(/\s+/g, " ");
    if (!query) return rsvps;

    return rsvps.filter((rsvp) => {
      const first = rsvp.firstname.toLocaleLowerCase();
      const last = rsvp.lastname.toLocaleLowerCase();
      const fullName = `${first} ${last}`.trim().replace(/\s+/g, " ");
      return (
        first.includes(query) ||
        last.includes(query) ||
        fullName.includes(query)
      );
    });
  }, [rsvps, search]);

  const flashSuccess = (message: string) => {
    setSuccessMessage(message);
    window.setTimeout(() => setSuccessMessage(null), 4000);
  };

  const startEditing = (rsvp: RsvpData) => {
    setEditingRsvp(rsvp);
    setEditForm({
      firstname: rsvp.firstname,
      lastname: rsvp.lastname,
      email: rsvp.email,
      attending: rsvp.attending,
      dietaryRestrictions: rsvp.dietaryRestrictions ?? "",
      songRequest: rsvp.songRequest ?? "",
      message: rsvp.message ?? "",
    });
    setError(null);
  };

  const saveEdit = async () => {
    if (!editingRsvp) return;
    setEditLoading(true);
    setError(null);
    try {
      const updated = await editRsvp(editingRsvp._id, editForm);
      setRsvps((current) =>
        current.map((rsvp) => (rsvp._id === updated._id ? updated : rsvp)),
      );
      setEditingRsvp(null);
      flashSuccess(
        `${updated.firstname} ${updated.lastname}’s RSVP was updated.`,
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update RSVP.");
    } finally {
      setEditLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setError(null);
    try {
      await deleteRsvp(deleteTarget._id);
      setRsvps((current) =>
        current.filter((rsvp) => rsvp._id !== deleteTarget._id),
      );
      flashSuccess(
        `${deleteTarget.firstname} ${deleteTarget.lastname}’s RSVP was deleted.`,
      );
      setDeleteTarget(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete RSVP.");
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const updateEditField = <K extends keyof RSVPDetails>(
    field: K,
    value: RSVPDetails[K],
  ) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <Card
      sx={{
        bgcolor: palette.ivory,
        borderRadius: 3,
        p: { xs: 2.5, md: 4 },
        boxShadow: "0 10px 30px rgba(61,28,13,0.06)",
        border: `1px solid ${alpha(palette.beige, 0.35)}`,
        "&:hover": {
          transform: "none",
          boxShadow: "0 10px 30px rgba(61,28,13,0.06)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <EventAvailableOutlinedIcon sx={{ color: palette.hazelnut }} />
          <Typography
            variant="h5"
            sx={{ fontSize: "1.35rem", color: palette.chocolate }}
          >
            RSVP Management
          </Typography>
          <Chip
            label={`${counts.total} ${counts.total === 1 ? "response" : "responses"}`}
            size="small"
            sx={{
              bgcolor: alpha(palette.nude, 0.25),
              color: palette.hazelnut,
              fontWeight: 600,
              fontSize: "0.72rem",
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(4, 1fr)",
          },
          gap: 1.25,
          mb: 2.5,
        }}
      >
        {[
          { label: "Total", value: counts.total, color: palette.hazelnut },
          { label: "Attending", value: counts.attending, color: "#58764F" },
          { label: "Declined", value: counts.notAttending, color: "#8B5543" },
        ].map((stat) => (
          <Box
            key={stat.label}
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha(palette.cream, 0.7),
              border: `1px solid ${alpha(palette.beige, 0.25)}`,
            }}
          >
            <Typography
              sx={{
                color: stat.color,
                fontFamily: "Georgia, serif",
                fontSize: { xs: "1.5rem", sm: "1.8rem" },
                lineHeight: 1.1,
              }}
            >
              {stat.value}
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                color: palette.dove,
                fontSize: "0.68rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Box>

      <TextField
        fullWidth
        placeholder="Find a guest by first or full name"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: palette.dove, fontSize: "1.1rem" }} />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="Clear RSVP search"
                  onClick={() => setSearch("")}
                >
                  <ClearIcon sx={{ fontSize: "1rem", color: palette.dove }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
        sx={{ mb: 2 }}
      />

      {successMessage && (
        <Alert
          icon={<CheckCircleIcon fontSize="small" />}
          severity="success"
          onClose={() => setSuccessMessage(null)}
          sx={{
            mb: 2,
            bgcolor: alpha(palette.pistachio, 0.15),
            color: palette.mocha,
            border: `1px solid ${alpha(palette.pistachio, 0.4)}`,
            borderRadius: 2,
            "& .MuiAlert-icon": { color: palette.pistachio },
          }}
        >
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: palette.hazelnut }} />
        </Box>
      ) : filteredRsvps.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6, color: palette.dove }}>
          <EventAvailableOutlinedIcon
            sx={{ fontSize: "2.5rem", mb: 1, opacity: 0.4 }}
          />
          <Typography variant="body2">
            {search
              ? "No RSVP matches that name."
              : "No RSVPs have been submitted yet."}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            maxHeight: 560,
            overflowY: "auto",
            pr: 0.5,
            display: "grid",
            gap: 1.25,
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: alpha(palette.beige, 0.5),
              borderRadius: "3px",
            },
          }}
        >
          {filteredRsvps.map((rsvp) => {
            const initials = `${rsvp.firstname[0] ?? ""}${rsvp.lastname[0] ?? ""}`;
            const statusColor = ATTENDANCE_COLOR[rsvp.attending];
            return (
              <Box
                key={rsvp._id}
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: 2.5,
                  bgcolor: alpha(palette.cream, 0.38),
                  border: `1px solid ${alpha(palette.beige, 0.3)}`,
                  transition: "background 0.2s, border-color 0.2s",
                  "&:hover": {
                    bgcolor: alpha(palette.cream, 0.7),
                    borderColor: alpha(palette.beige, 0.55),
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        bgcolor: alpha(palette.nude, 0.55),
                        color: palette.hazelnut,
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}
                    >
                      {initials.toUpperCase()}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          color: palette.chocolate,
                          fontSize: "1rem",
                          fontWeight: 600,
                          lineHeight: 1.3,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {rsvp.firstname} {rsvp.lastname}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: palette.mocha, overflowWrap: "anywhere" }}
                      >
                        {rsvp.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 0.25 }}
                  >
                    <IconButton
                      aria-label={`Edit RSVP for ${rsvp.firstname} ${rsvp.lastname}`}
                      onClick={() => startEditing(rsvp)}
                      size="small"
                      sx={{ color: palette.hazelnut }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      aria-label={`Delete RSVP for ${rsvp.firstname} ${rsvp.lastname}`}
                      onClick={() => setDeleteTarget(rsvp)}
                      size="small"
                      sx={{ color: "#985E4B" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    flexWrap: "wrap",
                    mt: 1.5,
                    pl: { xs: 0, sm: 7.25 },
                  }}
                >
                  <Chip
                    label={ATTENDANCE_LABEL[rsvp.attending]}
                    size="small"
                    sx={{
                      bgcolor: statusColor.background,
                      color: statusColor.foreground,
                      fontWeight: 600,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ letterSpacing: "0.04em" }}
                  >
                    Received{" "}
                    {new Date(rsvp.submittedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>

                {(rsvp.dietaryRestrictions ||
                  rsvp.songRequest ||
                  rsvp.message) && (
                  <>
                    <Divider
                      sx={{
                        my: 1.5,
                        ml: { xs: 0, sm: 7.25 },
                        borderColor: alpha(palette.beige, 0.25),
                      }}
                    />
                    <Box
                      sx={{
                        pl: { xs: 0, sm: 7.25 },
                        display: "grid",
                        gap: 0.5,
                      }}
                    >
                      {rsvp.dietaryRestrictions && (
                        <Typography variant="body2">
                          <strong>Dietary:</strong> {rsvp.dietaryRestrictions}
                        </Typography>
                      )}
                      {rsvp.songRequest && (
                        <Typography variant="body2">
                          <strong>Song request:</strong> {rsvp.songRequest}
                        </Typography>
                      )}
                      {rsvp.message && (
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "pre-wrap" }}
                        >
                          <strong>Message:</strong> {rsvp.message}
                        </Typography>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            );
          })}
        </Box>
      )}

      {/* Edit RSVP Dialog */}
      <Dialog
        open={Boolean(editingRsvp)}
        onClose={() => !editLoading && setEditingRsvp(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{ color: palette.chocolate, fontFamily: "Georgia, serif" }}
        >
          Edit RSVP
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              pt: 1,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 3,
            }}
          >
            <TextField
              label="First name"
              value={editForm.firstname}
              onChange={(event) =>
                updateEditField("firstname", event.target.value)
              }
              required
              disabled={editLoading}
              fullWidth
            />
            <TextField
              label="Last name"
              value={editForm.lastname}
              onChange={(event) =>
                updateEditField("lastname", event.target.value)
              }
              disabled={editLoading}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={editForm.email}
              onChange={(event) => updateEditField("email", event.target.value)}
              required
              disabled={editLoading}
              fullWidth
              sx={{ gridColumn: { sm: "1 / -1" } }}
            />
            <FormControl fullWidth sx={{ gridColumn: { sm: "1 / -1" } }}>
              <InputLabel id="rsvp-attending-label">Attendance</InputLabel>
              <Select
                labelId="rsvp-attending-label"
                value={editForm.attending}
                label="Attendance"
                onChange={(event) =>
                  updateEditField("attending", event.target.value as Attendance)
                }
                disabled={editLoading}
              >
                <MenuItem value="yes">Joyfully attending</MenuItem>
                <MenuItem value="no">Unable to attend</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Dietary restrictions"
              value={editForm.dietaryRestrictions ?? ""}
              onChange={(event) =>
                updateEditField("dietaryRestrictions", event.target.value)
              }
              disabled={editLoading}
              fullWidth
              multiline
              minRows={2}
              sx={{ gridColumn: { sm: "1 / -1" } }}
            />
            <TextField
              label="Song request"
              value={editForm.songRequest ?? ""}
              onChange={(event) =>
                updateEditField("songRequest", event.target.value)
              }
              disabled={editLoading}
              fullWidth
              sx={{ gridColumn: { sm: "1 / -1" } }}
            />
            <Box
              sx={{
                padding: 3,
                bgcolor: alpha(palette.beige, 0.15),
                borderRadius: 2,
                gridColumn: { sm: "1 / -1" },
              }}
            >
              <Typography variant="body2" sx={{ color: palette.mocha }}>
                {editForm.message}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setEditingRsvp(null)}
            disabled={editLoading}
            sx={{ color: palette.mocha, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={saveEdit}
            disabled={
              editLoading ||
              !editForm.firstname.trim() ||
              !editForm.email.trim()
            }
            variant="contained"
            sx={{
              bgcolor: palette.hazelnut,
              color: palette.ivory,
              textTransform: "none",
              "&:hover": { bgcolor: palette.mocha },
            }}
          >
            {editLoading ? (
              <CircularProgress size={18} sx={{ color: palette.ivory }} />
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => !deleteLoading && setDeleteTarget(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{ color: palette.chocolate, fontFamily: "Georgia, serif" }}
        >
          Delete this RSVP?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: palette.mocha }}>
            This will permanently remove{" "}
            <strong>
              {deleteTarget?.firstname} {deleteTarget?.lastname}
            </strong>
            ’s response.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            disabled={deleteLoading}
            sx={{ color: palette.mocha, textTransform: "none" }}
          >
            Keep RSVP
          </Button>
          <Button
            onClick={confirmDelete}
            disabled={deleteLoading}
            variant="contained"
            sx={{
              bgcolor: "#985E4B",
              color: palette.ivory,
              textTransform: "none",
              "&:hover": { bgcolor: "#784633" },
            }}
          >
            {deleteLoading ? (
              <CircularProgress size={18} sx={{ color: palette.ivory }} />
            ) : (
              "Delete RSVP"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default RsvpManager;
