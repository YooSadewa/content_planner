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

export const podcastInfoSchema = z
  .object({
    pdc_jadwal_shoot: z.string().refine(
      (val) => {
        const inputDate = new Date(val);
        const currentDate = new Date();
        inputDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        return !isNaN(inputDate.getTime()) && inputDate >= currentDate;
      },
      {
        message: "The shoot date must be valid and must not be in the past.",
      }
    ),
    pdc_jadwal_upload: z.string(),
    pdc_tema: z
      .string()
      .min(1, { message: "Theme must be at least 1 character long" })
      .max(150, { message: "Theme must be at most 150 characters long" }),
    // pdc_abstrak: z.string({ message: "Abstrak harus berupa string." }),
    pmb_id: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Choose a valid speaker.",
    }),
    host_id: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Choose a valid host.",
      }),
    // pdc_catatan: z.string({ message: "Note must be a string." }),
  })
  .superRefine((data, ctx) => {
    const shootDate = new Date(data.pdc_jadwal_shoot);
    const uploadDate = new Date(data.pdc_jadwal_upload);

    if (uploadDate < shootDate) {
      ctx.addIssue({
        code: "custom",
        path: ["pdc_jadwal_upload"], 
        message: "Upload date must be after shoot date.",
      });
    }
  });

export const uploadInfoSchema = z.object({
  pdc_link: z.string().url("URL must be valid").min(1, {message: "URL must be at least 1 character long"})
});
