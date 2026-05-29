import { z } from "zod";
import { PARCEL_EVENT_TYPES } from "./constants.js";

export const createParcelSchema = z.object({
  label: z.string().max(200).optional(),
  il_id: z.number().int().positive(),
  ilce_id: z.number().int().positive(),
  mahalle_id: z.number().int().positive(),
  ada: z.string().min(1).max(20),
  parsel_no: z.string().min(1).max(20),
  geometry: z
    .object({
      type: z.literal("Polygon"),
      coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
    })
    .optional()
    .nullable(),
  area_m2: z.number().positive().optional().nullable(),
  nitelik: z.string().max(500).optional().nullable(),
  properties: z.record(z.unknown()).optional().nullable(),
});

export const createParcelEventSchema = z.object({
  type: z.enum(PARCEL_EVENT_TYPES as unknown as [string, ...string[]]),
  occurred_at: z.string().datetime().optional(),
  body: z.string().max(5000).optional().nullable(),
});

export type CreateParcelInput = z.infer<typeof createParcelSchema>;
export type CreateParcelEventInput = z.infer<typeof createParcelEventSchema>;
