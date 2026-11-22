import { createHmac, timingSafeEqual } from "node:crypto";

type Invoice = { id: string; amountCents: number; paid: boolean };

const seen = new Set<string>();
const invoices = new Map<string, Invoice>();

// Stripe signs `${timestamp}.${rawBody}`. Reject if the timestamp is more
// than five minutes off, or if this event id was inserted before.
export function handleStripeWebhook(rawBody: string, header: string): number {
  const [tPart, v1Part] = header.split(",");
  const timestamp = tPart.slice(2);
  const signature = v1Part.slice(3);
  const expected = createHmac("sha256", process.env.STRIPE_WEBHOOK_SECRET!)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return 401;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return 400;

  const event = JSON.parse(rawBody) as {
    id: string;
    type: string;
    data: { object: { id: string; amount: number } };
  };
  if (seen.has(event.id)) return 200;
  seen.add(event.id);

  if (event.type === "invoice.paid") {
    invoices.set(event.data.object.id, {
      id: event.data.object.id,
      amountCents: event.data.object.amount,
      paid: true,
    });
  }
  return 200;
}
