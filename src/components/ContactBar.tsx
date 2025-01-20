import Image from "next/image";
import Link from "next/link";

export default function ContactBar() {
  return (
    <div className="bg-[#f7b500] py-2 px-3 flex justify-between">
      <Link href={""} className="flex items-center">
        <Image
          src={"/assets/icons/envelope.png"}
          alt="envelope icon"
          width={200}
          height={200}
          className="w-5 h-fit flex"
        />
        <p className="font-bold text-sm ml-2 flex items-center">Kontak</p>
      </Link>
      <div className="flex gap-5 pe-5">
        <div className="flex gap-10">
          <Link
            href={"https://www.uib.ac.id/akses-uib/"}
            className="text-sm font-bold flex items-center"
          >
            Akses UIB
          </Link>
          <Link
            href={"https://career.uib.ac.id/"}
            className="text-sm font-bold flex items-center"
          >
            Karir & Alumni
          </Link>
        </div>
        <div className="flex gap-2">
          <Link href={"https://www.uib.ac.id/akses-uib/"}>
            <Image
              src={"/assets/icons/indonesia.png"}
              alt="indo-flag"
              width={25}
              height={20}
            />
          </Link>
          <Link href={"https://www.uib.ac.id/en/uib-access/"}>
            <Image
              src={"/assets/icons/usa.png"}
              alt="usa-flag"
              width={21}
              height={20}
              className="pt-[2px]"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
