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
  ikf_tgl: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => !val || new Date(val) >= today,
      "Tanggal tidak boleh di masa lalu"
    ),
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

export const editPicContentInfoSchema = (
  isEdit: boolean,
  previousDate?: string
) =>
  z.object({
    ikf_tgl: z
      .string()
      .nullable()
      .refine(
        (val) => {
          if (!val) return true; // Izinkan null atau undefined

          const inputDate = new Date(val);
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          inputDate.setHours(0, 0, 0, 0);

          if (isEdit && previousDate) {
            const prevDate = new Date(previousDate);
            prevDate.setHours(0, 0, 0, 0);

            if (
              prevDate < currentDate &&
              inputDate.getTime() === prevDate.getTime()
            ) {
              return true;
            }

            if (prevDate < currentDate) {
              return inputDate >= currentDate;
            }

            if (prevDate >= currentDate) {
              return inputDate >= currentDate;
            }
          }

          return inputDate >= currentDate;
        },
        {
          message: "Tanggal tidak boleh di masa lalu",
        }
      ),

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
const today = new Date();
today.setHours(0, 0, 0, 0);

export const vidContentInfoSchema = z.object({
  ikv_judul_konten: z
    .string()
    .min(1, { message: "Judul konten harus diisi" })
    .max(150, { message: "Judul konten melebihi batas 150 karakter" }),
  ikv_tgl: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => !val || new Date(val) >= today,
      "Tanggal tidak boleh di masa lalu"
    ),
  ikv_pic: z.string().min(1, { message: "Person in Charge harus diisi" }),
  ikv_ringkasan: z
    .string()
    .min(1, { message: "Ringkasan harus diisi" })
    .max(150, { message: "Ringkasan melebihi batas 150 karakter" }),
  ikv_status: z
    .string()
    .min(1, { message: "Status harus dipilih" })
    .refine((val) => val === "scheduled" || val === "on hold", {
      message: "Status tidak valid",
    }),
  ikv_skrip: z.any().nullable().optional(),
  ikv_referensi: z
    .string()
    .url("Link Harus Valid")
    .or(z.literal(""))
    .nullable()
    .optional(),
});

export const editVidContentInfoSchema = (
  isEdit: boolean,
  previousDate?: string
) =>
  z.object({
    ikv_tgl: z
      .string()
      .nullable()
      .refine(
        (val) => {
          const inputDate = new Date(val as any);
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

const platformSchema = z.object({
  dpl_platform: z.string().min(1, "Platform harus dipilih"),
  dpl_total_konten: z.string().min(1, "Total konten harus diisi"),
  dpl_pengikut: z.string(),
});

// Schema for the whole form
export const monthlyDataSchema = z.object({
  dacc_bulan: z.string().min(1, "Bulan harus dipilih"),
  dacc_tahun: z.string().min(1, "Tahun harus dipilih"),
  platforms: z
    .array(platformSchema)
    .min(1, "Minimal satu platform harus dipilih"),
});

export const onlinePlannerSchema = (isEdit: boolean, previousDate?: string) =>
  z.object({
    onp_tgl: z
      .string()
      .nullable()
      .refine(
        (val) => {
          const inputDate = new Date(val as any);
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
    onp_topik_konten: z.string().min(1, "Topik Konten harus diisi"),
    onp_hari: z.string(),
    onp_admin: z.string(),
    onp_platform: z.string(),
    onp_checkpoint: z.string(),
  });

export const createUploadOnlinePlannerSchema = (platform: {
  instagram?: boolean;
  facebook?: boolean;
  twitter?: boolean;
  youtube?: boolean;
  website?: boolean;
  tikTok?: boolean;
}) => {
  const schema = z.object({
    lup_instagram: platform.instagram
      ? z.union([
          z.string().url("Link harus valid"),
          z.string().length(0),
          z.null(),
          z.undefined(),
        ])
      : z.string().optional().nullable(),
    lup_facebook: platform.facebook
      ? z.union([
          z.string().url("Link harus valid"),
          z.string().length(0),
          z.null(),
          z.undefined(),
        ])
      : z.string().optional().nullable(),
    lup_twitter: platform.twitter
      ? z.union([
          z.string().url("Link harus valid"),
          z.string().length(0),
          z.null(),
          z.undefined(),
        ])
      : z.string().optional().nullable(),
    lup_youtube: platform.youtube
      ? z.union([
          z.string().url("Link harus valid"),
          z.string().length(0),
          z.null(),
          z.undefined(),
        ])
      : z.string().optional().nullable(),
    lup_website: platform.website
      ? z.union([
          z.string().url("Link harus valid"),
          z.string().length(0),
          z.null(),
          z.undefined(),
        ])
      : z.string().optional().nullable(),
    lup_tiktok: platform.tikTok
      ? z.union([
          z.string().url("Link harus valid"),
          z.string().length(0),
          z.null(),
          z.undefined(),
        ])
      : z.string().optional().nullable(),
  });

  return schema.refine(
    (data) => {
      // Jika tidak ada platform yang dipilih, tidak perlu validasi tambahan
      if (
        !platform.instagram &&
        !platform.facebook &&
        !platform.twitter &&
        !platform.youtube &&
        !platform.website &&
        !platform.tikTok
      ) {
        return true;
      }

      // Jika ada platform yang dipilih, setidaknya satu field harus diisi
      const hasValue = Object.entries(data).some(([key, value]) => {
        const platformKey = key.replace("lup_", "");
        const platformValue = (platform as any)[
          platformKey === "tiktok" ? "tikTok" : platformKey
        ];
        return platformValue && value && value.trim() !== "";
      });

      return hasValue;
    },
    {
      message: "Setidaknya satu link platform harus diisi",
      path: [""], // Untuk menunjukkan error pada level form
    }
  );
};

export const AnalyticSchema = z.object({
  anc_tanggal: z.string().min(1, "Tanggal harus diisi"),
  anc_hari: z.string().min(1, "Hari harus diisi"),
  lup_id: z.string().min(1, "Topik konten harus dipilih"),
  platforms: z.string().min(1, "Platform harus dipilih"),
});

export const PlatformMetricSchema = z.object({
  website: z
    .object({
      reach: z.string().min(1, "Wajib Diisi"),
    })
    .optional(),
  instagram: z
    .object({
      reach: z.string().min(1, "Wajib Diisi"),
      like: z.string().optional(),
      comment: z.string().optional(),
      share: z.string().optional(),
      save: z.string().optional(),
    })
    .optional(),
  twitter: z
    .object({
      reach: z.string().min(1, "Wajib Diisi"),
      like: z.string().optional(),
      comment: z.string().optional(),
      share: z.string().optional(),
      save: z.string().optional(),
    })
    .optional(),
  facebook: z
    .object({
      reach: z.string().min(1, "Wajib Diisi"),
      like: z.string().optional(),
      comment: z.string().optional(),
      share: z.string().optional(),
      save: z.string().optional(),
    })
    .optional(),
  youtube: z
    .object({
      reach: z.string().min(1, "Wajib Diisi"),
      like: z.string().optional(),
      comment: z.string().optional(),
      share: z.string().optional(),
      save: z.string().optional(),
    })
    .optional(),
  tiktok: z
    .object({
      reach: z.string().min(1, "Wajib Diisi"),
      like: z.string().optional(),
      comment: z.string().optional(),
      share: z.string().optional(),
      save: z.string().optional(),
    })
    .optional(),
});

// This should be a function that uses the schema
export const validatePlatformMetrics = (
  selectedPlatforms: string[],
  metrics: any
) => {
  // Create a dynamic schema that only includes the selected platforms
  const selectedSchema = z.object(
    Object.fromEntries(
      selectedPlatforms.map((platform) => [
        platform,
        z.object({
          reach: z.string().min(1, `${platform} reach harus diisi`),
          like: z.string().optional(),
          comment: z.string().optional(),
          share: z.string().optional(),
          save: z.string().optional(),
        }),
      ])
    )
  );

  try {
    // Validate only the selected platforms
    selectedSchema.parse(metrics);
    return { success: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.format() };
    }
    return { success: false, error: "Validation failed" };
  }
};
