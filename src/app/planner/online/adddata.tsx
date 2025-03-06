import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onlinePlannerSchema } from "@/validation/Validation";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

type Admin = {
  user_id: number;
  user_name: string;
};
type OnlinePlanner = {
  onp_tanggal: string;
  onp_hari: string;
  onp_topik_konten: string;
  user_id: number;
  onp_platform: string;
  onp_checkpoint: string;
  lup_id: number;
};

export default function CreateOnlinePlanner() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [admins, setAdmins] = useState<Admin[]>([]);

  const onAdd = () => {
    setModalOpen(true);
  };
  const handleCancel = () => {
    setModalOpen(false);
  };
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OnlinePlanner>({
    defaultValues: {
      onp_tanggal: "",
      onp_hari: "",
      onp_topik_konten: "",
      user_id: 0,
      onp_platform: "",
      onp_checkpoint: "",
      lup_id: 0,
    },
    resolver: zodResolver(onlinePlannerSchema),
  });
  const onSubmit = async (data: OnlinePlanner) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/onlineplanner/create",
        data
      );

      if (response.status === 200 || response.status === 201) {
        window.location.reload();
        setSuccessMessage("Online Content Planner Berhasil Ditambahkan");
        setModalOpen(false);
      } else {
        setErrorMessage("Terjadi Kesalahan saat menambahkan data");
      }
    } catch (error) {
      console.log("Error details:", error);

      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ||
            "Terjadi kesalahan yang tidak terduga"
        );
      } else {
        setErrorMessage("Terjadi kesalahan yang tidak terdapat");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        size="sm"
        className="bg-indigo-600 hover:bg-indigo-700"
        onClick={onAdd}
      >
        <Calendar className="h-4 w-4 mr-2" />
        Add Content
      </Button>
      {isModalOpen && (
        <AlertDialog defaultOpen open>
          <AlertDialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Tambahkan Konten</AlertDialogTitle>
                <div className="pt-1 pb-4 w-full flex flex-col gap-3">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="onp_topik_konten">
                      Topik Konten <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="onp_topik_konten"
                      disabled={isSubmitting || loading}
                      placeholder="Konten XYZ"
                      {...register("onp_topik_konten")}
                    />
                    {errors.onp_topik_konten?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.onp_topik_konten?.message}
                      </div>
                    )}
                    {errorMessage && (
                      <div className="text-red-500">{errorMessage}</div>
                    )}
                    {successMessage && (
                      <div className="text-green-500">{successMessage}</div>
                    )}
                  </div>
                  <div className="flex gap-5">
                    <div className="grid w-full items-center gap-1.5 h-fit">
                      <Label htmlFor="onp_tanggal">
                        Tanggal <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        id="onp_tanggal"
                        disabled={isSubmitting || loading}
                        {...register("onp_tanggal")}
                      />
                      {errors.onp_tanggal?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.onp_tanggal?.message}
                        </div>
                      )}
                      {errorMessage && (
                        <div className="text-red-500">{errorMessage}</div>
                      )}
                      {successMessage && (
                        <div className="text-green-500">{successMessage}</div>
                      )}
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="onp_hari">
                        Hari <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="onp_hari"
                        disabled={isSubmitting || loading}
                        {...register("onp_hari")}
                      />
                      {errors.onp_hari?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.onp_hari?.message}
                        </div>
                      )}
                      {errorMessage && (
                        <div className="text-red-500">{errorMessage}</div>
                      )}
                      {successMessage && (
                        <div className="text-green-500">{successMessage}</div>
                      )}
                    </div>
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="user_id">
                      Admin <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="user_id"
                      disabled={isSubmitting || loading}
                      {...register("user_id")}
                    />
                    {errors.user_id?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.user_id?.message}
                      </div>
                    )}
                    {errorMessage && (
                      <div className="text-red-500">{errorMessage}</div>
                    )}
                    {successMessage && (
                      <div className="text-green-500">{successMessage}</div>
                    )}
                  </div>
                  <div className="flex gap-5">
                    <div className="grid w-[70%] items-center gap-1.5">
                      <Label htmlFor="onp_platform">
                        Platform Media Sosial
                        <span className="text-red-600"> *</span>
                      </Label>
                      <div className="flex flex-col flex-wrap gap-6 h-24">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="onp_platform" />
                          <label
                            htmlFor="onp_platform"
                            className="text-sm font-medium leading-none "
                          >
                            Website
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="onp_platform" />
                          <label
                            htmlFor="onp_platform"
                            className="text-sm font-medium leading-none "
                          >
                            Instagram
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="onp_platform" />
                          <label
                            htmlFor="onp_platform"
                            className="text-sm font-medium leading-none "
                          >
                            Twitter
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="onp_platform" />
                          <label
                            htmlFor="onp_platform"
                            className="text-sm font-medium leading-none "
                          >
                            Facebook
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="onp_platform" />
                          <label
                            htmlFor="onp_platform"
                            className="text-sm font-medium leading-none "
                          >
                            Youtube
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="onp_platform" />
                          <label
                            htmlFor="onp_platform"
                            className="text-sm font-medium leading-none "
                          >
                            TikTok
                          </label>
                        </div>
                      </div>
                      {errors.onp_platform?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.onp_platform?.message}
                        </div>
                      )}
                      {errorMessage && (
                        <div className="text-red-500">{errorMessage}</div>
                      )}
                      {successMessage && (
                        <div className="text-green-500">{successMessage}</div>
                      )}
                    </div>
                    <div className="grid w-[30%] items-center gap-1.5 h-fit">
                      <Label htmlFor="onp_checkpoint">
                        Checkpoints
                        <span className="text-red-600"> *</span>
                      </Label>
                      <div className="flex flex-col flex-wrap gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="onp_checkpoint" />
                          <label
                            htmlFor="onp_checkpoint"
                            className="text-sm font-medium leading-none "
                          >
                            Jayaridho
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="onp_checkpoint" />
                          <label
                            htmlFor="onp_checkpoint"
                            className="text-sm font-medium leading-none "
                          >
                            Gilang
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="onp_checkpoint" />
                          <label
                            htmlFor="onp_checkpoint"
                            className="text-sm font-medium leading-none "
                          >
                            Chris
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="onp_checkpoint" />
                          <label
                            htmlFor="onp_checkpoint"
                            className="text-sm font-medium leading-none "
                          >
                            Winny
                          </label>
                        </div>
                      </div>
                      {errors.onp_checkpoint?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.onp_checkpoint?.message}
                        </div>
                      )}
                      {errorMessage && (
                        <div className="text-red-500">{errorMessage}</div>
                      )}
                      {successMessage && (
                        <div className="text-green-500">{successMessage}</div>
                      )}
                    </div>
                  </div>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel type="button" onClick={handleCancel}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
