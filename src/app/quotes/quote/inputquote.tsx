import { Button } from "@/components/ui/button";
import { quoteInfoSchema } from "@/validation/Validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Quote = {
  qotd_link: string;
};

export default function CreateQuote() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Quote>({
    defaultValues: {
      qotd_link: "",
    },
    resolver: zodResolver(quoteInfoSchema),
  });

  const sanitizeInstagramLink = (url: string) => {
    const match = url.match(/(https:\/\/www\.instagram\.com\/p\/[\w-]+\/)/);
    return match ? match[1] : url;
  };

  const onSubmit = async (data: Quote) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const sanitizedLink = sanitizeInstagramLink(data.qotd_link);
    setValue("qotd_link", sanitizedLink);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/quote/create",
        { qotd_link: sanitizedLink }
      );
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Quote berhasil ditambahkan");
        setModalOpen(false);
        window.location.reload();
      } else {
        setErrorMessage("Gagal menambahkan quote");
      }
    } catch (err) {
      setErrorMessage("Gagal menambahkan quote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button size="sm" variant="default" onClick={() => setModalOpen(true)}>
        <Plus />
        Tambahkan Quote
      </Button>
      {isModalOpen && (
        <AlertDialog defaultOpen open>
          <AlertDialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Tambahkan Link Quote</AlertDialogTitle>
                <AlertDialogDescription>
                  Tambah link menggunakan link Instagram!
                </AlertDialogDescription>
                <div className="pt-1 pb-4 w-full">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="qotd_link">Link Instagram</Label>
                    <Input
                      type="text"
                      id="qotd_link"
                      disabled={isSubmitting || loading}
                      placeholder="https://www.instagram.com/p/"
                      {...register("qotd_link", {
                        onChange: (e) => {
                          const sanitizedLink = sanitizeInstagramLink(
                            e.target.value
                          );
                          setValue("qotd_link", sanitizedLink, {
                            shouldValidate: true,
                          });
                        },
                      })}
                    />
                    {errors.qotd_link?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.qotd_link?.message}
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
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  type="button"
                  onClick={() => setModalOpen(false)}
                >
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
