export const submitNotification = async (email: string): Promise<string> => {
  const res = await fetch("/api/notifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok && res.status !== 200)
    throw new Error(data.message || "Something went wrong.");
  return data.message as string;
};
