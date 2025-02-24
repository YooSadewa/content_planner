import {
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Bread from "@/components/BreadCrumb";
import { Slash } from "lucide-react";

export default function StatistikPage() {
  return (
    <div className="w-[1050px]">
      <div className="p-5 overflow-auto">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Bread>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbLink href="/statistik">Statistik Medsos</BreadcrumbLink>
            </Bread>
          </div>
        </div>
      </div>
    </div>
  );
}
