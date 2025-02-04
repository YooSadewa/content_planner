import { z } from "zod";

export const hostInfoSchema = z.object({
  host_nama: z
    .string()
    .min(3, { message: "Nama host harus terdiri dari minimal 3 karakter" })
    .max(100, { message: "Nama host harus terdiri dari maksimal 100 karakter" }),
});

export const speakerInfoSchema = z.object({
  pmb_nama: z
    .string()
    .min(3, { message: "Nama pembicara harus terdiri dari minimal 3 karakter" })
    .max(100, { message: "Nama pembicara harus terdiri dari maksimal 100 karakter" }),
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
        message: "Tanggal shooting harus valid dan tidak boleh di masa lalu.",
      }
    ),
    pdc_jadwal_upload: z.string().nullable().optional(), 
    pdc_tema: z
      .string()
      .min(1, { message: "Tema harus diisi" })
      .max(150, { message: "Tema harus terdiri dari maksimal 150 karakter" }),
    pmb_id: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Pilih pembicara yang valid.",
    }),
    host_id: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Pilih host yang valid.",
      }),
  })
  .superRefine((data, ctx) => {
    const shootDate = new Date(data.pdc_jadwal_shoot);

    // Tangani kasus null
    if (
      data.pdc_jadwal_upload !== null &&
      data.pdc_jadwal_upload !== undefined
    ) {
      const uploadDate = new Date(data.pdc_jadwal_upload);

      if (uploadDate < shootDate) {
        ctx.addIssue({
          code: "custom",
          path: ["pdc_jadwal_upload"],
          message: "Tanggal upload harus setelah tanggal shooting",
        });
      }
    }
  });

export const uploadInfoSchema = z.object({
  pdc_link: z
    .string()
    .url("URL harus valid")
    .min(1, { message: "URL harus diisi" }),
});
