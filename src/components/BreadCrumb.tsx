import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
export default function Bread({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          {children}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
