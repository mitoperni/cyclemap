import { z } from 'zod';

export const LocationSchema = z.object({
  city: z.string(),
  country: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export const NetworkSchema = z.object({
  id: z.string(),
  name: z.string(),
  href: z.string(),
  location: LocationSchema,
  company: z.array(z.string()).nullable().transform((val) => val ?? []),
  gbfs_href: z.string().optional(),
});

export const StationSchema = z.object({
  id: z.string(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  free_bikes: z.number(),
  empty_slots: z.number().nullable(),
  timestamp: z.string(),
  extra: z.record(z.string(), z.unknown()).optional(),
});

export const NetworksResponseSchema = z.object({
  networks: z.array(NetworkSchema),
});

export const NetworkDetailResponseSchema = z.object({
  network: NetworkSchema.extend({
    stations: z.array(StationSchema),
    ebikes: z.boolean().optional(),
  }),
});

// Type inference from schemas
export type NetworkFromSchema = z.infer<typeof NetworkSchema>;
export type StationFromSchema = z.infer<typeof StationSchema>;
export type LocationFromSchema = z.infer<typeof LocationSchema>;
