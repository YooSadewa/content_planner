import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/modal-detail-content";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Define types
type PlatformData = {
  dacc_id: string;
  dpl_platform: string;
  dpl_total_konten: string;
  dpl_pengikut: string;
};

// Schema for the whole form
const monthlyDataSchema = z.object({
  dacc_bulan: z.string().min(1, "Bulan harus dipilih"),
  dacc_tahun: z.string().min(1, "Tahun harus dipilih"),
  selectedPlatforms: z.array(z.string()).default([]), // Tambahkan default array
  platforms: z
    .record(
      z.object({
        dpl_total_konten: z.string().min(1, "Total Konten Harus diisi").default(""),
        dpl_pengikut: z.string().optional().default("0"),
      })
    )
    .optional()
    .default({}),
});

type MonthlyDataForm = z.infer<typeof monthlyDataSchema> & {
  selectedPlatforms?: string[];
  platforms?: Record<
    string,
    {
      dpl_total_konten?: string;
      dpl_pengikut?: string;
    }
  >;
};

export default function MonthlyDataForm() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [existingDataId, setExistingDataId] = useState<number | null>(null);
  const [platformIds, setPlatformIds] = useState<Record<string, number>>({});

  const months = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) =>
    (currentYear - i).toString()
  );

  const platforms = [
    "website",
    "instagram",
    "twitter",
    "facebook",
    "youtube",
    "tiktok",
  ];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MonthlyDataForm>({
    defaultValues: {
      dacc_bulan: "",
      dacc_tahun: "",
      selectedPlatforms: [],
      platforms: {},
    },
    resolver: zodResolver(monthlyDataSchema),
  });

  const selectedMonth = watch("dacc_bulan");
  const selectedYear = watch("dacc_tahun");
  const selectedPlatforms = watch("selectedPlatforms");

  // Fetch existing data when month and year are selected
  useEffect(() => {
    const fetchExistingData = async () => {
      if (selectedMonth && selectedYear) {
        try {
          setLoading(true);
          const response = await axios.get(
            `http://127.0.0.1:8000/api/detailaccount/get-by-month-year?month=${selectedMonth}&year=${selectedYear}`
          );

          console.log("bulan dan tahun", selectedMonth, selectedYear);

          if (
            response.data.data &&
            response.data.data.detail_akun &&
            response.data.data.detail_akun.length > 0
          ) {
            // Data exists, set update mode
            setIsUpdateMode(true);
            const accountDetail = response.data.data.detail_akun[0]; // Get the first item in the array
            setExistingDataId(accountDetail.dacc_id);

            console.log("tes data id", accountDetail.dacc_id);

            // Fetch platform details for this account
            const platformResponse = await axios.get(
              `http://127.0.0.1:8000/api/detailplatform/get-by-dacc?dacc_id=${accountDetail.dacc_id}`
            );

            if (
              platformResponse.data &&
              platformResponse.data.data &&
              platformResponse.data.data.detail_akun
            ) {
              const detailAkun = platformResponse.data.data.detail_akun;
              const newSelectedPlatforms: string[] = [];
              const newPlatformValues: Record<string, any> = {};
              const newPlatformIds: Record<string, number> = {};

              // Get platform names (excluding non-platform fields)
              const platformNames = Object.keys(detailAkun).filter(
                (key) =>
                  key !== "dacc_id" &&
                  key !== "dacc_bulan" &&
                  key !== "dacc_tahun" &&
                  key !== "created_at" &&
                  key !== "updated_at"
              );

              platformNames.forEach((platform) => {
                newSelectedPlatforms.push(platform);
                newPlatformValues[platform] = {
                  dpl_total_konten: String(
                    detailAkun[platform].dpl_total_konten || ""
                  ),
                  dpl_pengikut: String(detailAkun[platform].dpl_pengikut || ""),
                };
                newPlatformIds[platform] = detailAkun[platform].dpl_id;
              });

              setValue("selectedPlatforms", newSelectedPlatforms);
              setValue("platforms", newPlatformValues);
              setPlatformIds(newPlatformIds);
            }
          } else {
            // No existing data
            setIsUpdateMode(false);
            setExistingDataId(null);
            setValue("selectedPlatforms", []);
            setValue("platforms", {});
            setPlatformIds({});
          }
        } catch (error) {
          setIsUpdateMode(false);
          setExistingDataId(null);
          setValue("selectedPlatforms", []);
          setValue("platforms", {});
          setPlatformIds({});
        } finally {
          setLoading(false);
        }
      }
    };

    fetchExistingData();
  }, [selectedMonth, selectedYear, setValue]);

  // Handle checkbox change for platforms
  const handleCheckboxChange = (platform: string) => {
    // Gunakan spread operator dengan default array
    const currentSelectedPlatforms = [...(selectedPlatforms ?? [])];

    if (currentSelectedPlatforms.includes(platform)) {
      // Remove platform
      setValue(
        "selectedPlatforms",
        currentSelectedPlatforms.filter((p) => p !== platform)
      );

      // Clear platform values
      const currentPlatforms = { ...(watch("platforms") ?? {}) };
      delete currentPlatforms[platform];
      setValue("platforms", currentPlatforms);
    } else {
      // Add platform
      setValue("selectedPlatforms", [...currentSelectedPlatforms, platform]);

      // Initialize platform values if it's being selected for the first time
      if (!watch(`platforms.${platform}`)) {
        setValue(`platforms.${platform}`, {
          dpl_total_konten: "",
          dpl_pengikut: "",
        });
      }
    }
  };

  const onAdd = () => {
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
    reset();
    setErrorMessage("");
    setSuccessMessage("");
    setIsUpdateMode(false);
    setExistingDataId(null);
    setPlatformIds({});
  };

  const onSubmit = async (data: MonthlyDataForm) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (data.selectedPlatforms.length === 0) {
        setErrorMessage("Minimal satu platform harus dipilih");
        setLoading(false);
        return;
      }

      // Validasi setiap platform memiliki data
      const invalidPlatforms = data.selectedPlatforms.filter(
        (platform) =>
          !data.platforms[platform]?.dpl_total_konten ||
          data.platforms[platform]?.dpl_total_konten.trim() === ""
      );

      if (invalidPlatforms.length > 0) {
        setErrorMessage(
          `Platform ${invalidPlatforms.join(", ")} harus memiliki total konten`
        );
        setLoading(false);
        return;
      }
      if (isUpdateMode && existingDataId) {
        // Hapus platform yang tidak dipilih
        const platformPromises = (data.selectedPlatforms ?? []).map(
          async (platform) => {
            const platformData = {
              dacc_id: existingDataId,
              dpl_platform: platform,
              dpl_total_konten:
                data.platforms?.[platform]?.dpl_total_konten || "",
              dpl_pengikut: data.platforms?.[platform]?.dpl_pengikut || "0",
            };

            // Gunakan optional chaining untuk platformIds
            if (platformIds?.[platform]) {
              return axios.put(
                `http://127.0.0.1:8000/api/detailplatform/update/${platformIds[platform]}`,
                platformData
              );
            } else {
              return axios.post(
                "http://127.0.0.1:8000/api/detailplatform/create",
                platformData
              );
            }
          }
        );

        // Hapus platform yang tidak dipilih
        const deletePlatformPromises = Object.keys(platformIds ?? {})
          .filter(
            (platform) => !(data.selectedPlatforms ?? []).includes(platform)
          )
          .map(async (platform) => {
            return axios.delete(
              `http://127.0.0.1:8000/api/detailplatform/delete/${platformIds[platform]}`
            );
          });

        await Promise.all([...platformPromises, ...deletePlatformPromises]);
        setSuccessMessage("Data berhasil diperbarui");
      } else {
        // Logika untuk membuat data baru (tetap sama)
        const accountData = {
          dacc_bulan: data.dacc_bulan,
          dacc_tahun: data.dacc_tahun,
        };

        const accountResponse = await axios.post(
          "http://127.0.0.1:8000/api/detailaccount/create",
          accountData
        );

        if (
          !(accountResponse.status === 200 || accountResponse.status === 201)
        ) {
          throw new Error("Gagal menambahkan data bulan dan tahun");
        }

        const daccId =
          accountResponse.data.data.id ||
          accountResponse.data.id ||
          accountResponse.data.data.dacc_id;

        if (!daccId) {
          throw new Error(
            "Tidak dapat memperoleh ID dari data yang ditambahkan"
          );
        }

        // Buat entri platform baru
        const platformPromises = (data.selectedPlatforms ?? []).map(
          (platform) => {
            const platformData = {
              dacc_id: daccId,
              dpl_platform: platform,
              dpl_total_konten:
                data.platforms?.[platform]?.dpl_total_konten || "",
              dpl_pengikut: data.platforms?.[platform]?.dpl_pengikut || "0",
            };

            return axios.post(
              "http://127.0.0.1:8000/api/detailplatform/create",
              platformData
            );
          }
        );

        await Promise.all(platformPromises);

        setSuccessMessage("Data berhasil ditambahkan");
      }

      setTimeout(() => {
        setModalOpen(false);
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error details:", error);

      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Terjadi kesalahan pada server"
        );
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Terjadi kesalahan yang tidak diketahui");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button size="sm" variant="default" onClick={onAdd}>
        <Plus className="mr-1" />
        Update Detail Bulanan
      </Button>

      {isModalOpen && (
        <AlertDialog defaultOpen open>
          <AlertDialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {isUpdateMode
                    ? "Perbarui Data Bulanan"
                    : "Tambahkan Data Bulanan"}
                </AlertDialogTitle>
                <div className="pt-1 pb-4 w-full flex flex-col gap-3">
                  <div className="flex gap-5">
                    <div className="grid w-full items-center gap-1.5 w-[70%] h-fit">
                      <Label htmlFor="dacc_bulan">
                        Bulan <span className="text-red-600">*</span>
                      </Label>
                      <Controller
                        name="dacc_bulan"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full text-black">
                              <SelectValue placeholder="Pilih Bulan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {months.map((month) => (
                                  <SelectItem
                                    key={month.value}
                                    value={month.value}
                                  >
                                    {month.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.dacc_bulan && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.dacc_bulan.message}
                        </p>
                      )}
                    </div>

                    <div className="grid w-full items-center gap-1.5 w-[30%] h-fit">
                      <Label htmlFor="dacc_tahun">
                        Tahun <span className="text-red-600">*</span>
                      </Label>
                      <Controller
                        name="dacc_tahun"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full text-black">
                              <SelectValue placeholder="Pilih Tahun" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {years.map((year) => (
                                  <SelectItem key={year} value={year}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.dacc_tahun && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.dacc_tahun.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {loading && (
                    <div className="text-center py-2">Memuat data...</div>
                  )}

                  {!loading && (
                    <div>
                      <div className="flex justify-between items-center">
                        <Label htmlFor="selectedPlatforms">
                          Platform <span className="text-red-600">*</span>
                        </Label>
                        {isUpdateMode && (
                          <span className="text-blue-600 text-sm">
                            Data untuk bulan ini sudah ada dan akan diperbarui
                          </span>
                        )}
                      </div>
                      {errors.selectedPlatforms && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.selectedPlatforms.message}
                        </p>
                      )}
                      {selectedPlatforms && selectedPlatforms.length === 0 && (
                        <p className="text-red-500 text-sm mt-1">
                          Minimal satu platform harus dipilih
                        </p>
                      )}
                      <div className="grid grid-cols-2 gap-4 mt-1">
                        {platforms.map((platform) => (
                          <div
                            key={platform}
                            className="flex flex-col space-y-2 py-1 text-sm h-fit"
                          >
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={
                                  selectedPlatforms?.includes(platform) || false
                                }
                                onChange={() => handleCheckboxChange(platform)}
                                className="w-4 h-4"
                              />
                              <span className="capitalize font-medium">
                                {platform}
                              </span>
                            </label>

                            {selectedPlatforms?.includes(platform) && (
                              <div className="pt-2 flex gap-3">
                                <div className="w-[50%]">
                                  <label className="block text-sm font-medium">
                                    Total Konten{" "}
                                    <span className="text-red-600">*</span>
                                  </label>
                                  <Controller
                                    name={`platforms.${platform}.dpl_total_konten`}
                                    control={control}
                                    render={({ field }) => (
                                      <input
                                        type="number"
                                        min={1}
                                        className={`w-full p-2 border rounded ${
                                          errors.platforms?.[platform]
                                            ?.dpl_total_konten
                                            ? "border-red-500"
                                            : ""
                                        }`}
                                        placeholder="Masukkan total konten"
                                        {...field}
                                      />
                                    )}
                                  />
                                  {errors.platforms?.[platform]
                                    ?.dpl_total_konten && (
                                    <p className="text-red-500 text-sm mt-1">
                                      {
                                        errors.platforms[platform]
                                          ?.dpl_total_konten?.message
                                      }
                                    </p>
                                  )}
                                </div>

                                {platform !== "website" && (
                                  <div className="w-[50%]">
                                    <label className="block text-sm font-medium">
                                      {platform === "youtube"
                                        ? "Subscriber"
                                        : "Pengikut"}{" "}
                                    </label>
                                    <Controller
                                      name={`platforms.${platform}.dpl_pengikut`}
                                      control={control}
                                      render={({ field }) => (
                                        <input
                                          type="number"
                                          min={1}
                                          className={`w-full p-2 border rounded ${
                                            errors.platforms?.[platform]
                                              ?.dpl_pengikut
                                              ? "border-red-500"
                                              : ""
                                          }`}
                                          placeholder={`Masukkan jumlah ${
                                            platform === "youtube"
                                              ? "subscriber"
                                              : "pengikut"
                                          }`}
                                          {...field}
                                        />
                                      )}
                                    />
                                    {errors.platforms?.[platform]
                                      ?.dpl_pengikut && (
                                      <p className="text-red-500 text-sm mt-1">
                                        {
                                          errors.platforms[platform]
                                            ?.dpl_pengikut?.message
                                        }
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel type="button" onClick={handleCancel}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction type="submit" disabled={loading}>
                  {loading ? "Loading..." : isUpdateMode ? "Update" : "Submit"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
