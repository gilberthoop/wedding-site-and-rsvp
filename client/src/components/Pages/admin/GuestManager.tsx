import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { palette } from "../../../theme/weddingTheme";
import { alpha } from "@mui/material/styles";
import {
  fetchGuests,
  addGuest,
  editGuest,
  deleteGuest,
} from "../../../utils/helpers/guest";
import { GuestData } from "../../../utils/types/guests";

const GuestManager = () => {
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Add guest form
  const [addOpen, setAddOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Filter
  const [search, setSearch] = useState("");

  const loadGuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGuests();
      setGuests(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load guests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGuests();
  }, [loadGuests]);

  const handleAdd = async () => {
    const fn = firstName.trim();
    const ln = lastName.trim();
    if (!fn || !ln) {
      setAddError("Both first name and last name are required.");
      return;
    }
    setAddLoading(true);
    setAddError(null);
    try {
      const newGuest = await addGuest(fn, ln);
      setGuests((prev) =>
        [...prev, newGuest].sort((a, b) =>
          a.lastname.localeCompare(b.lastname),
        ),
      );
      setFirstName("");
      setLastName("");
      setAddOpen(false);
      flashSuccess(`${fn} ${ln} has been added to the guest list.`);
    } catch (e: unknown) {
      setAddError(e instanceof Error ? e.message : "Failed to add guest");
    } finally {
      setAddLoading(false);
    }
  };

  const handleEdit = (guest: GuestData) => {
    setEditingId(guest._id);
    setEditFirstName(guest.firstname);
    setEditLastName(guest.lastname);
    setEditError(null);
  };

  const handleSaveEdit = async (guestId: string) => {
    const fn = editFirstName.trim();
    const ln = editLastName.trim();
    if (!fn || !ln) {
      setEditError("Both first name and last name are required.");
      return;
    }
    setEditLoading(true);
    setEditError(null);
    try {
      const updatedGuest = await editGuest(guestId, fn, ln);
      setGuests((prev) =>
        prev
          .map((g) => (g._id === guestId ? updatedGuest : g))
          .sort((a, b) => a.lastname.localeCompare(b.lastname)),
      );
      setEditingId(null);
      flashSuccess(`${fn} ${ln} has been updated.`);
    } catch (e: unknown) {
      setEditError(e instanceof Error ? e.message : "Failed to edit guest");
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditError(null);
  };

  const handleDelete = async (guest: GuestData) => {
    setDeletingId(guest._id);
    try {
      await deleteGuest(guest._id);
      setGuests((prev) => prev.filter((g) => g._id !== guest._id));
      flashSuccess(`${guest.firstname} ${guest.lastname} has been removed.`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete guest");
    } finally {
      setDeletingId(null);
    }
  };

  const flashSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const filteredGuests: GuestData[] = guests.filter((g) => {
    const q = search.toLowerCase();
    const fullName = `${g.firstname} ${g.lastname}`.toLowerCase();
    return (
      g.firstname.toLowerCase().includes(q) ||
      g.lastname.toLowerCase().includes(q) ||
      fullName.includes(q)
    );
  });

  // Group by first letter of last name
  const grouped = filteredGuests.reduce<Record<string, GuestData[]>>(
    (acc, g) => {
      const letter = g.lastname[0]?.toUpperCase() ?? "#";
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(g);
      return acc;
    },
    {},
  );

  // Sort guests within each letter group by last name, then first name
  Object.keys(grouped).forEach((letter) => {
    grouped[letter].sort((a, b) => {
      const lastNameCompare = a.lastname.localeCompare(b.lastname);
      return lastNameCompare !== 0
        ? lastNameCompare
        : a.firstname.localeCompare(b.firstname);
    });
  });

  const sortedLetters = Object.keys(grouped).sort();

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
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <PeopleAltOutlinedIcon sx={{ color: palette.hazelnut }} />
          <Typography
            variant="h5"
            sx={{ fontSize: "1.25rem", color: palette.chocolate }}
          >
            Guest Management
          </Typography>
          <Chip
            label={`${guests.length} guests`}
            size="small"
            sx={{
              bgcolor: alpha(palette.nude, 0.25),
              color: palette.hazelnut,
              fontWeight: 600,
              fontSize: "0.72rem",
            }}
          />
        </Box>

        <Button
          onClick={() => {
            setAddOpen((v) => !v);
            setAddError(null);
          }}
          startIcon={
            addOpen ? <ExpandLessIcon /> : <PersonAddAlt1OutlinedIcon />
          }
          variant={addOpen ? "outlined" : "contained"}
          size="small"
          sx={{
            bgcolor: addOpen ? "transparent" : palette.hazelnut,
            color: addOpen ? palette.hazelnut : palette.ivory,
            borderColor: palette.hazelnut,
            textTransform: "none",
            borderRadius: "20px",
            fontWeight: 600,
            px: 2,
            "&:hover": {
              bgcolor: addOpen ? alpha(palette.nude, 0.15) : palette.mocha,
              borderColor: palette.mocha,
            },
          }}
        >
          {addOpen ? "Cancel" : "Add Guest"}
        </Button>
      </Box>

      {/* Inline Add Form */}
      <Collapse in={addOpen}>
        <Box
          sx={{
            bgcolor: alpha(palette.cream, 0.6),
            border: `1px solid ${alpha(palette.beige, 0.4)}`,
            borderRadius: 2,
            p: 2.5,
            mb: 2.5,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ mb: 1.5, color: palette.hazelnut, letterSpacing: "0.1em" }}
          >
            New Guest
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              size="small"
              sx={{ flex: 1, minWidth: "140px" }}
              disabled={addLoading}
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              size="small"
              sx={{ flex: 1, minWidth: "140px" }}
              disabled={addLoading}
            />
            <Button
              onClick={handleAdd}
              variant="contained"
              disabled={addLoading}
              sx={{
                bgcolor: palette.hazelnut,
                color: palette.ivory,
                textTransform: "none",
                borderRadius: "20px",
                fontWeight: 600,
                px: 3,
                alignSelf: "center",
                "&:hover": { bgcolor: palette.mocha },
                "&:disabled": { bgcolor: alpha(palette.hazelnut, 0.4) },
              }}
            >
              {addLoading ? (
                <CircularProgress size={16} sx={{ color: palette.ivory }} />
              ) : (
                "Add"
              )}
            </Button>
          </Box>
          {addError && (
            <Typography
              variant="caption"
              sx={{ color: "#C62828", mt: 1, display: "block" }}
            >
              {addError}
            </Typography>
          )}
        </Box>
      </Collapse>

      {/* Success alert */}
      <Collapse in={!!successMsg}>
        <Alert
          icon={<CheckCircleIcon fontSize="small" />}
          severity="success"
          sx={{
            mb: 2,
            bgcolor: alpha(palette.pistachio, 0.15),
            color: palette.mocha,
            border: `1px solid ${alpha(palette.pistachio, 0.4)}`,
            borderRadius: 2,
            "& .MuiAlert-icon": { color: palette.pistachio },
          }}
        >
          {successMsg}
        </Alert>
      </Collapse>

      {/* Error alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search guests by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
                <IconButton size="small" onClick={() => setSearch("")}>
                  <ClearIcon sx={{ fontSize: "1rem", color: palette.dove }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
        sx={{ mb: 2 }}
      />

      {/* List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress sx={{ color: palette.hazelnut }} />
        </Box>
      ) : filteredGuests.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6, color: palette.dove }}>
          <PeopleAltOutlinedIcon
            sx={{ fontSize: "2.5rem", mb: 1, opacity: 0.4 }}
          />
          <Typography variant="body2">
            {search
              ? "No guests match your search."
              : "No guests yet. Add one above!"}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            maxHeight: "480px",
            overflowY: "auto",
            pr: 0.5,
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: alpha(palette.beige, 0.5),
              borderRadius: "3px",
            },
          }}
        >
          {sortedLetters.map((letter, li) => (
            <Box key={letter}>
              {/* Sticky letter header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 0.75,
                  px: 0.5,
                  position: "sticky",
                  top: 0,
                  bgcolor: palette.ivory,
                  zIndex: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: palette.hazelnut,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {letter}
                </Typography>
                <Divider
                  sx={{ flex: 1, borderColor: alpha(palette.beige, 0.4) }}
                />
              </Box>

              {grouped[letter].map((guest) => (
                <Box key={guest._id}>
                  {/* Guest row */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      transition: "background 0.15s",
                      "&:hover": {
                        bgcolor:
                          editingId !== guest._id
                            ? alpha(palette.nude, 0.1)
                            : "transparent",
                        "& .action-btns": {
                          opacity: editingId !== guest._id ? 1 : 0,
                        },
                      },
                    }}
                  >
                    {/* Avatar + name or edit form */}
                    {editingId === guest._id ? (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flex: 1,
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            bgcolor: alpha(palette.nude, 0.3),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              color: palette.hazelnut,
                              lineHeight: 1,
                            }}
                          >
                            {editFirstName[0]?.toUpperCase()}
                            {editLastName[0]?.toUpperCase()}
                          </Typography>
                        </Box>
                        <TextField
                          value={editFirstName}
                          onChange={(e) => setEditFirstName(e.target.value)}
                          placeholder="First Name"
                          size="small"
                          disabled={editLoading}
                          sx={{ flex: 0.5, minWidth: "80px" }}
                        />
                        <TextField
                          value={editLastName}
                          onChange={(e) => setEditLastName(e.target.value)}
                          placeholder="Last Name"
                          size="small"
                          disabled={editLoading}
                          sx={{ flex: 0.5, minWidth: "80px" }}
                        />
                      </Box>
                    ) : (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            bgcolor: alpha(palette.nude, 0.3),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              color: palette.hazelnut,
                              lineHeight: 1,
                            }}
                          >
                            {guest.firstname[0]?.toUpperCase()}
                            {guest.lastname[0]?.toUpperCase()}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{ fontSize: "0.9rem", color: palette.chocolate }}
                        >
                          {guest.firstname}{" "}
                          <span style={{ color: palette.mocha }}>
                            {guest.lastname}
                          </span>
                        </Typography>
                      </Box>
                    )}

                    {/* Action buttons */}
                    {editingId === guest._id ? (
                      <Box sx={{ display: "flex", gap: 0.5, ml: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={editLoading}
                          onClick={() => handleCancelEdit()}
                          sx={{
                            textTransform: "none",
                            borderColor: palette.dove,
                            color: palette.dove,
                            fontSize: "0.7rem",
                            px: 1.5,
                            "&:hover": {
                              borderColor: palette.chocolate,
                              color: palette.chocolate,
                            },
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          disabled={editLoading}
                          onClick={() => handleSaveEdit(guest._id)}
                          sx={{
                            textTransform: "none",
                            bgcolor: palette.hazelnut,
                            color: palette.ivory,
                            fontSize: "0.7rem",
                            px: 1.5,
                            "&:hover": { bgcolor: palette.mocha },
                            "&:disabled": {
                              bgcolor: alpha(palette.hazelnut, 0.4),
                            },
                          }}
                        >
                          {editLoading ? (
                            <CircularProgress
                              size={12}
                              sx={{ color: palette.ivory }}
                            />
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </Box>
                    ) : (
                      <Box
                        className="action-btns"
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          opacity: 0,
                          transition: "opacity 0.15s",
                        }}
                      >
                        <Tooltip
                          title={`Edit ${guest.firstname} ${guest.lastname}`}
                          placement="left"
                        >
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(guest)}
                              sx={{
                                color: palette.hazelnut,
                                transition: "color 0.15s",
                                "&:hover": {
                                  color: palette.mocha,
                                  bgcolor: alpha(palette.nude, 0.1),
                                },
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                width="16"
                                height="16"
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip
                          title={`Remove ${guest.firstname} ${guest.lastname}`}
                          placement="left"
                        >
                          <span>
                            <IconButton
                              size="small"
                              disabled={deletingId === guest._id}
                              onClick={() => handleDelete(guest)}
                              sx={{
                                color: palette.dove,
                                transition: "color 0.15s",
                                "&:hover": {
                                  color: "#C62828",
                                  bgcolor: "rgba(198,40,40,0.06)",
                                },
                                "&:disabled": { opacity: 1 },
                              }}
                            >
                              {deletingId === guest._id ? (
                                <CircularProgress
                                  size={14}
                                  sx={{ color: palette.dove }}
                                />
                              ) : (
                                <DeleteIcon fontSize="small" />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>

                  {/* Edit error message */}
                  {editingId === guest._id && editError && (
                    <Box sx={{ px: 1.5, py: 0.5 }}>
                      <Typography variant="caption" sx={{ color: "#C62828" }}>
                        {editError}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}

              {li < sortedLetters.length - 1 && <Box sx={{ height: 4 }} />}
            </Box>
          ))}
        </Box>
      )}

      {/* Footer */}
      {!loading && filteredGuests.length > 0 && (
        <Box
          sx={{
            mt: 2,
            pt: 1.5,
            borderTop: `1px solid ${alpha(palette.beige, 0.3)}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" sx={{ color: palette.dove }}>
            Showing {filteredGuests.length} of {guests.length} guests
          </Typography>
          {search && (
            <Button
              size="small"
              onClick={() => setSearch("")}
              sx={{
                color: palette.hazelnut,
                textTransform: "none",
                fontSize: "0.72rem",
                p: 0,
                minWidth: "auto",
                "&:hover": {
                  bgcolor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              Clear filter
            </Button>
          )}
        </Box>
      )}
    </Card>
  );
};

export default GuestManager;
