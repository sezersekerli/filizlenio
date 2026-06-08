import { z } from "zod";
import {
  EXPENSE_CATEGORIES,
  FARM_TASK_TYPES,
  PARCEL_EVENT_TYPES,
  TASK_PRIORITIES,
} from "./constants.js";

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

export const upsertParcelSeasonSchema = z.object({
  crop: z.string().min(1).max(100),
  planted_at: z.string().optional().nullable(),
  stage: z.string().min(1).max(100).optional(),
  progress_pct: z.number().int().min(0).max(100).optional(),
  notes: z.string().max(2000).optional().nullable(),
});

export const createFarmTaskSchema = z.object({
  parcel_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  task_type: z.enum(FARM_TASK_TYPES as unknown as [string, ...string[]]),
  due_at: z.string().datetime(),
  priority: z.enum(TASK_PRIORITIES as unknown as [string, ...string[]]).optional(),
  body: z.string().max(2000).optional().nullable(),
});

export const updateFarmTaskSchema = z.object({
  status: z.enum(["pending", "completed", "cancelled"] as const).optional(),
  title: z.string().min(1).max(200).optional(),
  due_at: z.string().datetime().optional(),
  priority: z.enum(TASK_PRIORITIES as unknown as [string, ...string[]]).optional(),
  body: z.string().max(2000).optional().nullable(),
});

export const createExpenseSchema = z.object({
  category: z.enum(EXPENSE_CATEGORIES as unknown as [string, ...string[]]),
  amount: z.number().positive(),
  currency: z.string().length(3).optional(),
  occurred_at: z.string().datetime().optional(),
  note: z.string().max(500).optional().nullable(),
});

export const createNotificationSchema = z.object({
  parcel_id: z.string().uuid().optional().nullable(),
  label: z.string().min(1).max(100),
  body: z.string().min(1).max(2000),
  scheduled_at: z.string().datetime().optional().nullable(),
});

export type UpsertParcelSeasonInput = z.infer<typeof upsertParcelSeasonSchema>;
export type CreateFarmTaskInput = z.infer<typeof createFarmTaskSchema>;
export type UpdateFarmTaskInput = z.infer<typeof updateFarmTaskSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
