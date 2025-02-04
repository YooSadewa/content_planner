import Bread from "@/components/BreadCrumb";
import {
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";

export default function QuotesPage() {
  return (
    <div className="bg-gray-100">
      <div className="p-5 overflow-auto">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Bread>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbLink href="/podcast">Quotes</BreadcrumbLink>
            </Bread>
          </div>
          <div className="flex gap-1 mb-5">
            <p>eq</p>
          </div>
        </div>
      </div>
    </div>
  );
}
