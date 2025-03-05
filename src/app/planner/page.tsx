import Bread from "@/components/BreadCrumb";
import {
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Slash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import OnlineContentPlanner from "./online/page";

export default function ContentPlannerPage() {
  return (
    <div className="w-[1050px]">
      <div className="px-5 pt-5 overflow-auto">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Bread>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbLink href="/ide-konten">Rencana Konten</BreadcrumbLink>
            </Bread>
          </div>
          {/* <div className="flex gap-1">
            <CreateKontenFoto />
            <CreateKontenVideo />
          </div> */}
        </div>
      </div>
      <div className="mx-5">
        <h1 className="font-bold text-2xl mt-5 text-[#293854] me-auto mb-4 flex items-center">
          Perencanaan Konten
        </h1>
        <Card className="w-full shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-3">
                <Calendar className="h-6 w-6" />
                <span>Content Calendar</span>
              </CardTitle>
              <Badge variant="secondary" className="bg-white/20 text-white">
                January 2025
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <OnlineContentPlanner />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
