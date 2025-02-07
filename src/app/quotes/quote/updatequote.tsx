import { quoteInfoSchema } from "@/validation/Validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

type Quote = {
  qotd_id: number;
  qotd_link: string;
};

type QuoteProps = {
  id: string | number;
  currentLink: string;
};

export default function UpdateQuote({ id, currentLink }: QuoteProps) {
  const [loading, setLoading] = useState(false);
  const [isModalQuoteOpen, setModalQuoteOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const onEditQuote = () => {
    setModalQuoteOpen(true);
  };
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Quote>({
    defaultValues: {
      qotd_link: currentLink,
    },
    resolver: zodResolver(quoteInfoSchema),
  });

  const sanitizeInstagramLink = (url: string) => {
    const match = url.match(/(https:\/\/www\.instagram\.com\/p\/[\w-]+\/)/);
    return match ? match[1] : url;
  };

  const handleCancel = () => {
    reset();
    setModalQuoteOpen(false);
  };
  const onUpdate = async (data: Quote) => {
    setLoading(true), setErrorMessage(""), setSuccessMessage("");
    const sanitizedLink = sanitizeInstagramLink(data.qotd_link);
    setValue("qotd_link", sanitizedLink);

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/quote/update/${id}`,
        { qotd_link: sanitizedLink }
      );
      if (response.status === 200) {
        window.location.reload();
        setSuccessMessage("Quote berhasil diperbarui");
        setModalQuoteOpen(false);
      } else {
        setErrorMessage("Terjadi kesalahan saat memperbarui data");
      }
    } catch (err) {
      setErrorMessage("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="h-full"
        onClick={onEditQuote}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <AlertDialog open={isModalQuoteOpen}>
        <AlertDialogContent>
          <form onSubmit={handleSubmit(onUpdate)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Link Quote</AlertDialogTitle>
              <AlertDialogDescription>
                Edit link menggunakan link Instagram!
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
    </>
  );
}
