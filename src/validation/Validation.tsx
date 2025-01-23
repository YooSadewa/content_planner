import { z } from "zod";

export const hostInfoSchema = z.object({
  host_nama: z
    .string()
    .min(3, { message: "Host name must be at least 3 characters long" })
    .max(100, { message: "Host name must be at most 100 characters long" }),
});

export const speakerInfoSchema = z.object({
  pmb_nama: z
    .string()
    .min(3, { message: "Speaker name must be at least 3 characters long" })
    .max(100, { message: "Speaker name must be at most 100 characters long" }),
});

export const podcastInfoSchema = z.object({
  pdc_jadwal_shoot: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date >= new Date();
    },
    {
      message: "Date must be valid and in the future",
    }
  ),
  pdc_tema: z
    .string()
    .min(1, { message: "Theme must be at least 1 character long" })
    .max(150, { message: "Theme must be at most 150 characters long" }),
  pdc_abstrak: z.string({ message: "Abstract must be a string" }),
  pmb_id: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Choose a Speaker",
  }),
  host_id: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Choose a Host",
  }),
  pdc_catatan: z.string({ message: "Abstract must be a string" }),
});

export const uploadInfoSchema = z.object({
  pdc_link: z
    .string()
    .min(1, { message: "YouTube Link must be at least 1 character long" }),
});
