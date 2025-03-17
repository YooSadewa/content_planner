import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Globe,
  LinkIcon,
  ExternalLink,
  X,
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";

interface ViewLinksModalProps {
  links: {
    [key: string]: {
      link: string;
    };
  };
  contentTitle: string;
}

const ViewLinksModal: React.FC<ViewLinksModalProps> = ({
  links,
  contentTitle,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Check if there are any links
  const hasLinks = links && Object.keys(links).length > 0;

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram size={20} className="text-pink-600" />;
      case "facebook":
        return <Facebook size={20} className="text-blue-600" />;
      case "twitter":
        return <Twitter size={20} className="text-sky-600" />;
      case "youtube":
        return <Youtube size={20} className="text-red-600" />;
      case "website":
        return <Globe size={20} className="text-indigo-600" />;
      case "tiktok":
        return <FaTiktok size={18} className="text-black" />;
      default:
        return <LinkIcon size={20} className="text-gray-600" />;
    }
  };

  const getPlatformName = (platform: string) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  if (!hasLinks) {
    return <p className="text-gray-400 text-sm text-center">No links</p>;
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-xs w-[150px]"
        onClick={() => setIsOpen(true)}
      >
        <LinkIcon className="h-3 w-3 mr-1" />
        View Links
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed z-50 w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>

            {/* Title */}
            <div className="mb-4 text-center">
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                {contentTitle} - Platform Links
              </h3>
            </div>

            {/* Links */}
            <div className="space-y-4 py-4">
              {Object.entries(links).map(([platform, { link }]) => (
                <div
                  key={platform}
                  className="flex items-center space-x-3 border-b pb-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                    {getIcon(platform)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium">{getPlatformName(platform)}</p>
                    <p className="text-sm text-gray-500 truncate">{link}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(link, "_blank")}
                    className="shrink-0"
                  >
                    <ExternalLink size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewLinksModal;
