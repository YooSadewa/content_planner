import { z } from "zod";

export const hostInfoSchema = z.object({
  host_nama: z
    .string()
    .min(3, { message: "Nama host harus terdiri dari minimal 3 karakter" })
    .max(100, {
      message: "Nama host harus terdiri dari maksimal 100 karakter",
    }),
});

export const speakerInfoSchema = z.object({
  pmb_nama: z
    .string()
    .min(3, { message: "Nama pembicara harus terdiri dari minimal 3 karakter" })
    .max(100, {
      message: "Nama pembicara harus terdiri dari maksimal 100 karakter",
    }),
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
    pdc_abstrak: z.string(),
    pmb_id: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Pilih pembicara yang valid.",
    }),
    host_id: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Pilih host yang valid.",
      }),
    pdc_catatan: z.string(),
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

export const quoteInfoSchema = z.object({
  qotd_link: z
    .string()
    .url("Link Instagram harus valid")
    .min(1, { message: "Link Instagram harus diisi" }),
});

export const inspiringInfoSchema = z.object({
  ins_nama: z.string().min(1, { message: "Nama harus diisi" }),
  ins_link: z
    .string()
    .url("Link Instagram harus valid")
    .min(1, { message: "Link Instagram harus diisi" }),
});

export const picContentInfoSchema = z.object({
  ikf_tgl: z.string().min(1, { message: "Tanggal harus diisi" }),
  ikf_judul_konten: z
    .string()
    .min(1, { message: "Judul konten harus diisi" })
    .max(150, { message: "Judul konten melebihi batas 150 karakter" }),
  ikf_ringkasan: z
    .string()
    .min(1, { message: "Ringkasan harus diisi" })
    .max(150, { message: "Ringkasan melebihi batas 150 karakter" }),
  ikf_referensi: z
    .string()
    .url("Link Harus Valid")
    .or(z.literal(""))
    .nullable()
    .optional(),
});

const allowedFileTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const vidContentInfoSchema = z.object({
  ikv_tgl: z.string().min(1, { message: "Tanggal harus diisi" }),
  ikv_judul_konten: z
    .string()
    .min(1, { message: "Judul konten harus diisi" })
    .max(150, { message: "Judul konten melebihi batas 150 karakter" }),
  ikv_ringkasan: z
    .string()
    .min(1, { message: "Ringkasan harus diisi" })
    .max(150, { message: "Ringkasan melebihi batas 150 karakter" }),
  ikv_pic: z.string().min(1, { message: "Person in Charge harus diisi" }),
  ikv_status: z
    .string()
    .min(1, { message: "Status harus dipilih" })
    .refine((val) => val === "scheduled" || val === "on hold", {
      message: "Status tidak valid",
    }),
  ikv_skrip: z
    .custom<FileList>((val) => val instanceof FileList && val.length > 0, {
      message: "Skrip harus diupload",
    })
    .refine((files) => files && allowedFileTypes.includes(files[0]?.type), {
      message: "File harus berupa PDF, DOC, atau DOCX",
    }),
});
