import { z } from "zod";

export const podcastInfoSchema = (isEdit: boolean, previousDate?: string) =>
  z
    .object({
      pdc_jadwal_shoot: z.string().refine(
        (val) => {
          const inputDate = new Date(val);
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          inputDate.setHours(0, 0, 0, 0);

          if (isEdit && previousDate) {
            const prevDate = new Date(previousDate);
            prevDate.setHours(0, 0, 0, 0);

            // Jika previousDate di masa lalu dan tidak diubah, tetap lolos
            if (
              prevDate < currentDate &&
              inputDate.getTime() === prevDate.getTime()
            ) {
              return true;
            }

            // Jika previousDate di masa lalu tapi diubah, minimal harus hari ini
            if (prevDate < currentDate) {
              return inputDate >= currentDate;
            }

            // Jika previousDate di masa depan dan diubah, minimal harus setelah hari ini tetapi boleh di bawah previousDate
            if (prevDate >= currentDate) {
              return inputDate >= currentDate;
            }
          }

          // Jika bukan edit, tetap tidak boleh di masa lalu
          return inputDate >= currentDate;
        },
        {
          message: "Tanggal shooting tidak boleh di masa lalu",
        }
      ),
      pdc_jadwal_upload: z.string().nullable().optional(),
      pdc_tema: z
        .string()
        .min(1, { message: "Tema harus diisi" })
        .max(150, { message: "Tema maksimal 150 karakter" }),
      pdc_abstrak: z.string().optional().nullable(),
      pdc_host: z.string().min(1, { message: "Host harus diisi" }),
      pdc_speaker: z.string().min(1, { message: "Pembicara harus diisi" }),
      pdc_catatan: z.string().optional().nullable(),
    })
    .superRefine((data, ctx) => {
      const shootDate = new Date(data.pdc_jadwal_shoot);

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
  ikf_judul_konten: z
    .string()
    .min(1, { message: "Judul konten harus diisi" })
    .max(150, { message: "Judul konten melebihi batas 150 karakter" }),
  ikf_tgl: z.string().nullable().optional(),
  ikf_pic: z.string().min(1, { message: "Person in Charge harus diisi" }),
  ikf_ringkasan: z
    .string()
    .min(1, { message: "Ringkasan harus diisi" })
    .max(150, { message: "Ringkasan melebihi batas 150 karakter" }),
  ikf_status: z
    .string()
    .min(1, { message: "Status harus dipilih" })
    .refine((val) => val === "scheduled" || val === "on hold", {
      message: "Status tidak valid",
    }),
  ikf_skrip: z.any().nullable().optional(),
  ikf_referensi: z
    .string()
    .url("Link Harus Valid")
    .or(z.literal(""))
    .nullable()
    .optional(),
});

export const editPicContentInfoSchema = z.object({
  ikf_tgl: z.string().nullable().optional(),
  ikf_judul_konten: z
    .string()
    .min(1, { message: "Judul konten harus diisi" })
    .max(150, { message: "Judul konten melebihi batas 150 karakter" }),
  ikf_ringkasan: z
    .string()
    .min(1, { message: "Ringkasan harus diisi" })
    .max(150, { message: "Ringkasan melebihi batas 150 karakter" }),
  ikf_pic: z.string().min(1, { message: "Person in Charge harus diisi" }),
  ikf_status: z
    .string()
    .min(1, { message: "Status harus dipilih" })
    .refine(
      (val) => val === "scheduled" || val === "on hold" || val === "done",
      {
        message: "Status tidak valid",
      }
    ),
  ikf_skrip: z.any().optional().nullable(),
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
    .refine(
      (val) => val === "scheduled" || val === "on hold" || val === "done",
      {
        message: "Status tidak valid",
      }
    ),
  ikv_skrip: z
    .custom<FileList>((val) => val instanceof FileList && val.length > 0, {
      message: "Skrip harus diupload",
    })
    .refine((files) => files && allowedFileTypes.includes(files[0]?.type), {
      message: "File harus berupa PDF, DOC, atau DOCX",
    }),
});

export const editVidContentInfoSchema = z.object({
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
    .refine(
      (val) => val === "scheduled" || val === "on hold" || val === "done",
      {
        message: "Status tidak valid",
      }
    ),
  ikv_skrip: z.any().optional().nullable(),
});
