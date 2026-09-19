import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { alpha } from "@mui/material/styles";
import { palette } from "../../theme/weddingTheme";
import { FormEvent, ReactNode, useState, useEffect } from "react";
import { findGuestByName } from "../../utils/helpers/guest";
import { submitRsvp, findRsvpByName } from "../../utils/helpers/rsvp";
import { FormResponse, RSVPDetails, Attendance } from "../../utils/types/rsvp";
import { GuestEntry } from "../../utils/types/guests";
import { CONTACT_EMAIL, DIETARY_OPTIONS } from "../../utils/constants";
import { sanitizeNameInput, sanitizeTextInput } from "../../utils/helpers/form";

enum Step {
  verify = "verify",
  rsvp = "rsvp",
  details = "details",
  success = "success",
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: alpha(palette.ivory, 0.6),
    "& fieldset": { borderColor: alpha(palette.beige, 0.6) },
    "&:hover fieldset": { borderColor: palette.hazelnut },
    "&.Mui-focused fieldset": { borderColor: palette.hazelnut },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: palette.hazelnut },
};

const StepDot = ({ active, done }: { active: boolean; done: boolean }) => (
  <Box
    sx={{
      width: 10,
      height: 10,
      borderRadius: "50%",
      bgcolor: done || active ? palette.hazelnut : alpha(palette.beige, 0.5),
      transition: "background-color 0.3s ease",
      border: active ? `2px solid ${palette.mocha}` : "none",
    }}
  />
);

const BackButton = ({
  loading = false,
  handleGoBack,
}: {
  loading?: boolean;
  handleGoBack: () => void;
}): ReactNode => (
  <Button
    id="back-btn"
    variant="outlined"
    onClick={handleGoBack}
    disabled={loading}
    sx={{
      borderRadius: 3,
      py: 1.4,
      borderColor: alpha(palette.beige, 0.8),
      color: palette.mocha,
      "&:hover": { borderColor: palette.hazelnut },
    }}
  >
    ← Back
  </Button>
);

export const RSVPCard = () => {
  const [step, setStep] = useState<Step>(Step.verify);
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [attending, setAttending] = useState<Attendance | null>(null);
  const [message, setMessage] = useState<string>("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>("");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [hasOtherDietary, setHasOtherDietary] = useState<boolean>(false);
  const [otherDietaryText, setOtherDietaryText] = useState<string>("");
  const [songRequest, setSongRequest] = useState<string>("");

  const [formResponse, setFormResponse] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, []);

  const attendanceStatus: string[] =
    attending === "yes"
      ? [
          "You are attending to the wedding. See you on May 8, 2027!",
          `If you need to make changes to your RSVP, please email us at ${CONTACT_EMAIL}.`,
        ]
      : [
          "We will miss you!",
          `If you change your mind and would like to join us, please let us know at ${CONTACT_EMAIL}`,
        ];

  const resetFields = (): void => {
    setFirstname("");
    setLastname("");
    setEmail("");
    setAttending(null);
    setMessage("");
    setDietaryRestrictions("");
    setSelectedDietary([]);
    setHasOtherDietary(false);
    setOtherDietaryText("");
    setSongRequest("");
  };

  const handleVerifyGuest = async (e: FormEvent) => {
    e.preventDefault();
    const sanitizedFirstname = sanitizeNameInput(firstname);
    const sanitizedLastName = sanitizeNameInput(lastname);

    if (!sanitizedFirstname || !sanitizedLastName) return;
    setFormResponse({ message: "", status: "info" });

    try {
      setLoading(true);
      const guest: GuestEntry | null = await findGuestByName(
        sanitizedFirstname,
        sanitizedLastName,
      );
      if (!guest) {
        setFormResponse({
          message: `We couldn't find your name on the guest list. Please check your spelling or contact us directly at ${CONTACT_EMAIL}.`,
          status: "error",
        });
        return;
      }

      // Sync canonical name from verified guest record (handles fuzzy matches and typos)
      setFirstname(guest.firstname);
      setLastname(guest.lastname);

      const rsvpDetails: RSVPDetails | null = await findRsvpByName(
        guest.firstname,
        guest.lastname,
      );

      // Show details if guest has already RSVPed. Otherwise, send guest to rsvp form
      if (rsvpDetails) {
        setAttending(rsvpDetails.attending);
        setEmail(rsvpDetails.email);
        setMessage(rsvpDetails.message || "");
        setDietaryRestrictions(rsvpDetails.dietaryRestrictions || "");
        setSongRequest(rsvpDetails.songRequest || "");

        // Parse dietary restrictions for form editing or display
        if (
          rsvpDetails.dietaryRestrictions &&
          rsvpDetails.dietaryRestrictions !== "None"
        ) {
          const parts = rsvpDetails.dietaryRestrictions
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean);
          const foundSelected: string[] = [];
          const otherParts: string[] = [];

          for (const part of parts) {
            const matched = DIETARY_OPTIONS.find(
              (opt) => opt.label.toLowerCase() === part.toLowerCase(),
            );
            if (matched) {
              foundSelected.push(matched.label);
            } else if (part.toLowerCase().startsWith("other:")) {
              otherParts.push(part.replace(/^other:\s*/i, ""));
            } else {
              otherParts.push(part);
            }
          }

          setSelectedDietary(foundSelected);
          if (otherParts.length > 0) {
            setHasOtherDietary(true);
            setOtherDietaryText(otherParts.join(", "));
          }
        }

        setStep(Step.details);
      } else {
        setStep(Step.rsvp);
      }
    } catch (err) {
      setFormResponse({
        message:
          err instanceof Error
            ? err.message
            : "Unable to find guest information. Please try again.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRsvp = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !attending) return;

    try {
      setLoading(true);

      // Assemble composite dietary restrictions string
      const dietaryList = [...selectedDietary];
      if (hasOtherDietary && otherDietaryText.trim()) {
        dietaryList.push(`Other: ${sanitizeTextInput(otherDietaryText)}`);
      }
      const formattedDietary =
        dietaryList.length > 0 ? dietaryList.join(", ") : "None";

      const payload: RSVPDetails = {
        firstname: sanitizeNameInput(firstname),
        lastname: sanitizeNameInput(lastname),
        email: email.trim(),
        attending,
        dietaryRestrictions: formattedDietary,
        songRequest: sanitizeTextInput(songRequest) || undefined,
        message: sanitizeTextInput(message) || undefined,
      };
      const response: string = await submitRsvp(payload);
      setFormResponse({
        message: response,
        status: "success",
      });
      setStep(Step.success);
    } catch (err) {
      setFormResponse({
        message:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      data-reveal
      data-delay={150}
      sx={{
        maxWidth: 600,
        mx: "auto",
        bgcolor: palette.ivory,
        opacity: 0,
        transform: "translateY(30px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        borderRadius: 4,
        boxShadow: `0 8px 40px ${alpha(palette.mocha, 0.1)}`,
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 5 } }}>
        {/* Stepper Dots */}
        {step !== Step.success && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              mb: 3.5,
            }}
          >
            <StepDot
              active={step === Step.verify}
              done={step === Step.rsvp || step === Step.details}
            />
            <StepDot
              active={step === Step.rsvp || step === Step.details}
              done={false}
            />
          </Box>
        )}

        {/* Step: Guest verification */}
        {step === Step.verify && (
          <Box
            component="form"
            onSubmit={handleVerifyGuest}
            aria-label="Guest name verification"
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: 3,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              Find Your Invitation
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                id="rsvp-firstname"
                label="First Name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                fullWidth
                autoComplete="given-name"
                sx={fieldSx}
              />
              <TextField
                id="rsvp-lastname"
                label="Last Name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                fullWidth
                autoComplete="family-name"
                sx={fieldSx}
              />
            </Box>

            {formResponse?.status === "error" && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                {formResponse.message}
              </Alert>
            )}

            <Button
              id="rsvp-verify-btn"
              type="submit"
              variant="contained"
              fullWidth
              disabled={!firstname.trim() || !lastname.trim()}
              sx={{
                py: 1.4,
                borderRadius: 3,
                fontSize: "1rem",
                bgcolor: palette.hazelnut,
                "&:hover": { bgcolor: palette.mocha },
              }}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: palette.ivory }} />
              ) : (
                "Find My Invitation →"
              )}
            </Button>
          </Box>
        )}

        {/* Step: RSVP Form  */}
        {step === Step.rsvp && (
          <Box
            component="form"
            onSubmit={handleSubmitRsvp}
            aria-label="RSVP form"
          >
            <Typography
              variant="h5"
              sx={{ mb: 0.5, textAlign: "center", fontWeight: 600 }}
            >
              Hello, {firstname}!
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                textAlign: "center",
                color: alpha(palette.mocha, 0.7),
              }}
            >
              Please let us know if you&rsquo;ll be joining us.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {/* Attending toggle */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: palette.mocha, fontWeight: 600 }}
                >
                  Will you be attending?
                </Typography>
                <ToggleButtonGroup
                  value={attending}
                  exclusive
                  onChange={(_, val) => {
                    if (val !== null) setAttending(val);
                  }}
                  aria-label="Attending status"
                  fullWidth
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2.5,
                    "& .MuiToggleButton-root": {
                      borderRadius: 2,
                      borderColor: alpha(palette.beige, 0.6),
                      color: palette.mocha,
                      py: 1,
                      "&.Mui-selected": {
                        bgcolor: palette.hazelnut,
                        color: palette.ivory,
                        "&:hover": { bgcolor: palette.mocha },
                      },
                      "&:hover": { bgcolor: alpha(palette.beige, 0.3) },
                    },
                  }}
                >
                  <ToggleButton value="yes" id="rsvp-attending-yes">
                    🎉 Joyfully Accepts
                  </ToggleButton>
                  <ToggleButton value="no" id="rsvp-attending-no">
                    😔 Regretfully Declines
                  </ToggleButton>
                </ToggleButtonGroup>

                <Typography
                  variant="body2"
                  sx={{ mt: 1, color: palette.mocha }}
                >
                  Don't worry if you are not sure about attending yet. You can
                  fill out this form later and submit your response.
                </Typography>
              </Box>

              {/* Email */}
              <TextField
                id="rsvp-email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                autoComplete="email"
                disabled={loading}
                sx={fieldSx}
              />

              {/* Conditional fields — only shown when attending */}
              {attending === "yes" && (
                <>
                  <Divider
                    sx={{
                      borderColor: alpha(palette.beige, 0.4),
                      my: 0.5,
                    }}
                  />
                  {/* Dietary Restrictions & Meal Preferences */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 0.5, color: palette.mocha, fontWeight: 600 }}
                    >
                      Dietary Restrictions & Meal Preferences
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "block",
                        mb: 1.5,
                        color: palette.mocha,
                      }}
                    >
                      Please select any allergies, dietary preferences, or if a
                      kid&rsquo;s meal is needed:
                    </Typography>

                    <FormGroup
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        rowGap: 0.5,
                        columnGap: 1,
                      }}
                    >
                      {DIETARY_OPTIONS.map((opt) => (
                        <FormControlLabel
                          key={opt.id}
                          control={
                            <Checkbox
                              id={`dietary-${opt.id}`}
                              size="small"
                              checked={selectedDietary.includes(opt.label)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDietary((prev) => [
                                    ...prev,
                                    opt.label,
                                  ]);
                                } else {
                                  setSelectedDietary((prev) =>
                                    prev.filter((item) => item !== opt.label),
                                  );
                                }
                              }}
                              sx={{
                                color: alpha(palette.hazelnut, 0.6),
                                "&.Mui-checked": { color: palette.hazelnut },
                                p: 0.75,
                              }}
                            />
                          }
                          label={
                            <Typography
                              variant="body2"
                              sx={{
                                color: palette.mocha,
                                fontSize: "0.875rem",
                              }}
                            >
                              {opt.label}
                            </Typography>
                          }
                          sx={{ m: 0 }}
                        />
                      ))}

                      <FormControlLabel
                        control={
                          <Checkbox
                            id="dietary-other-checkbox"
                            size="small"
                            checked={hasOtherDietary}
                            onChange={(e) => {
                              setHasOtherDietary(e.target.checked);
                              if (!e.target.checked) {
                                setOtherDietaryText("");
                              }
                            }}
                            sx={{
                              color: alpha(palette.hazelnut, 0.6),
                              "&.Mui-checked": { color: palette.hazelnut },
                              p: 0.75,
                            }}
                          />
                        }
                        label={
                          <Typography
                            variant="body2"
                            sx={{
                              color: palette.mocha,
                              fontSize: "0.875rem",
                            }}
                          >
                            Other
                          </Typography>
                        }
                        sx={{ m: 0 }}
                      />
                    </FormGroup>

                    {hasOtherDietary && (
                      <TextField
                        id="rsvp-dietary-other"
                        label="Please specify other restriction or allergy"
                        value={otherDietaryText}
                        onChange={(e) => setOtherDietaryText(e.target.value)}
                        fullWidth
                        size="small"
                        placeholder="e.g. Halal, Kosher, no mushrooms…"
                        disabled={loading}
                        sx={{ ...fieldSx, mt: 1.5 }}
                      />
                    )}
                  </Box>
                  <Divider
                    sx={{
                      borderColor: alpha(palette.beige, 0.4),
                      my: 0.5,
                    }}
                  />
                  <TextField
                    id="rsvp-song"
                    label="Song Request (optional)"
                    value={songRequest}
                    onChange={(e) => setSongRequest(e.target.value)}
                    fullWidth
                    placeholder="What song will get you on the dance floor?"
                    disabled={loading}
                    sx={fieldSx}
                  />
                </>
              )}

              {/* Message */}
              <TextField
                id="rsvp-message"
                label="Message to the Couple (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder="Share your well-wishes…"
                disabled={loading}
                sx={fieldSx}
              />
            </Box>

            {formResponse?.status === "error" && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                {formResponse.message}
              </Alert>
            )}

            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 3 }}
            >
              <BackButton
                loading={loading}
                handleGoBack={() => {
                  setFormResponse(null);
                  setStep(Step.verify);
                  resetFields();
                }}
              />
              <Button
                id="rsvp-submit-btn"
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !attending || !email.trim()}
                sx={{
                  py: 1.4,
                  borderRadius: 3,
                  fontSize: "1rem",
                  bgcolor: palette.hazelnut,
                  "&:hover": { bgcolor: palette.mocha },
                }}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ color: palette.ivory }} />
                ) : (
                  "Send RSVP 💌"
                )}
              </Button>
            </Box>
          </Box>
        )}

        {/* Step: RSVP confirmation details */}
        {step === Step.details && (
          <Stack spacing={1.5}>
            <Typography
              variant="h5"
              sx={{ mb: 0.5, textAlign: "center", fontWeight: 600 }}
            >
              Hello, {firstname}!
            </Typography>
            {attendanceStatus.map((message, idx) => (
              <Typography
                key={`rsvp-${idx}`}
                variant="body2"
                sx={{
                  mb: 3,
                  textAlign: "center",
                  color: alpha(palette.mocha, 0.7),
                }}
              >
                {message}
              </Typography>
            ))}

            {/* More RSVP details */}
            {dietaryRestrictions && dietaryRestrictions !== "None" && (
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  textAlign: "center",
                  color: alpha(palette.mocha, 0.7),
                }}
              >
                Dietary Restrictions: {dietaryRestrictions}
              </Typography>
            )}

            {songRequest && (
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  textAlign: "center",
                  color: alpha(palette.mocha, 0.7),
                }}
              >
                Song Request: {songRequest}
              </Typography>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 3,
                mt: 3,
              }}
            >
              <BackButton
                loading={loading}
                handleGoBack={() => {
                  setFormResponse(null);
                  setStep(Step.verify);
                  resetFields();
                }}
              />
            </Box>
          </Stack>
        )}

        {/* Step: RSVP submit feedback */}
        {step === Step.success && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "3.5rem", lineHeight: 1 }} aria-hidden>
              {attending === "yes" ? "🎊" : "💐"}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {attending === "yes" ? "See You There!" : "We'll Miss You!"}
            </Typography>

            {formResponse?.message && (
              <Typography
                variant="body1"
                sx={{
                  color: alpha(palette.mocha, 0.75),
                  maxWidth: 380,
                  mx: "auto",
                  textAlign: "center",
                }}
              >
                {formResponse.message}
              </Typography>
            )}
            <BackButton
              handleGoBack={() => {
                setFormResponse(null);
                setStep(Step.verify);
                resetFields();
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
