// utils/sendEmail.ts
export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Optional: Authorization if using JWT
    },
    body: JSON.stringify({ to, subject, html }),
  })

  const data = await response.json()
  return data
}
