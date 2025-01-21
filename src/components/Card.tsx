import { Speech } from "lucide-react";
import { AbstractAlert } from "./AbstractAlert";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Card({
  title = "Default Title",
  speaker = "Default Speaker",
  host = "Default Host",
  shootDate = "Default Shoot Date",
  uploadDate = "Default Upload Date",
  abstractContent,
  onEdit,
  onVerify,
}: any) {
  return (
      <div className="flex-[1_1_calc(50%-16px)] max-w-[494px] h-fit shadow-md rounded p-7 bg-white">
        <div className="">
          <h1 className="font-bold text-2xl h-5 capitalize">{title}</h1>
          <AbstractAlert content={abstractContent || "Abstract content tidak tersedia"} />
        </div>
        <div className="flex gap-4 mt-2 justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-1 text-[13px]">
              <Speech />
              <p className="flex items-center gap-1">
                Pembicara: <span className="font-semibold capitalize">{speaker}</span>
              </p>
            </div>
            <div className="flex flex-row gap-1 text-[13px]">
              <Image
                src={"/assets/icons/mic.png"}
                alt="Mic"
                width={200}
                height={200}
                className="w-5 h-5"
              />
              <p className="flex items-center gap-1">
                Host: <span className="font-semibold capitalize">{host}</span>
              </p>
            </div>
          </div>
          <span className="w-[1px] h-10 my-auto bg-[#f7b500]" />
          <div className="flex flex-col text-[13px] justify-center">
            <p>
              Jadwal Shoot: <span className="font-semibold">{shootDate}</span>
            </p>
            <p>
              Jadwal Upload: <span className="font-semibold">{uploadDate}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="notupload" size="sm" onClick={onVerify}>
            Verifikasi Upload
          </Button>
          <span className="w-[1px] h-5 bg-[#f7b500] my-auto" />
          <Button
            variant="default"
            className="duration-300"
            size="sm"
            onClick={onEdit}
          >
            Edit Data
          </Button>
        </div>
      </div>
  );
}
