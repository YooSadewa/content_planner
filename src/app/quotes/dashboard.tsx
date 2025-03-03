import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LinkPreview } from "@/components/ui/link-preview";
import axios from "axios";
import { AlertCircle, Flame, Info, MessageSquareQuote } from "lucide-react";
import { useEffect, useState } from "react";

interface Quote {
  qotd_id: number;
  qotd_link: string;
  created_at: string;
  updated_at: string;
}

interface Person {
  ins_id: number;
  ins_link: string;
  created_at: string;
  updated_at: string;
}

interface QuoteResponse {
  status: boolean;
  message: string;
  data: {
    quote: Quote[];
  };
}

interface PeopleResponse {
  status: boolean;
  message: string;
  data: {
    inspiringPeople: Person[];
  };
}

// Define interface for combined item
interface CombinedItem {
  type: "quote" | "person";
  instagram_link: string;
  timestamp: Date;
  qotd_id?: number;
  ins_id?: number;
  name?: string;
  created_at: string;
  updated_at: string;
}

export default function DashboardQuotePage() {
  const [combinedData, setCombinedData] = useState<CombinedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set the limit to 3 items
  const displayLimit = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quoteResponse, peopleResponse] = await Promise.all([
          axios.get<QuoteResponse>("http://127.0.0.1:8000/api/quote"),
          axios.get<PeopleResponse>(
            "http://127.0.0.1:8000/api/inspiringpeople"
          ),
        ]);

        // Extract data from nested structure
        const quotes = quoteResponse.data.data.quote;
        const people = peopleResponse.data.data.inspiringPeople || [];

        // Combine and format both datasets
        const combinedItems: CombinedItem[] = [
          ...quotes.map((quote: Quote) => ({
            ...quote,
            type: "quote" as const,
            instagram_link: quote.qotd_link,
            timestamp: new Date(
              Math.max(
                new Date(quote.created_at).getTime(),
                new Date(quote.updated_at).getTime()
              )
            ),
          })),
          ...people.map((person: Person) => ({
            ...person,
            type: "person" as const,
            instagram_link: person.ins_link,
            timestamp: new Date(
              Math.max(
                new Date(person.created_at).getTime(),
                new Date(person.updated_at).getTime()
              )
            ),
          })),
        ];

        // Sort by most recent timestamp
        const sortedItems = combinedItems.sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        );

        // Limit to first 3 items
        const limitedItems = sortedItems.slice(0, displayLimit);

        setCombinedData(limitedItems);
        setLoading(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError("Failed to fetch data: " + errorMessage);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="w-96 bg-white hover:shadow-lg transition-shadow duration-300 h-[227px]">
      <CardHeader className="pb-2">
        <div className="flex items-start flex-col justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Quotes & Inspiring People
          </h2>
          <small className="flex flex-row items-center gap-1 text-xs text-gray-400 mt-1">
            <Info size={14} />
            Hover untuk lihat preview
          </small>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid gap-1">
            <div className="flex items-center h-[42px] p-4 bg-gray-100 skeleton rounded-lg"></div>
            <div className="flex items-center h-[42px] p-4 bg-gray-100 skeleton rounded-lg"></div>
            <div className="flex items-center h-[42px] p-4 bg-gray-100 skeleton rounded-lg"></div>
          </div>
        ) : combinedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[120px] p-4 text-gray-500 text-center">
            <AlertCircle className="w-10 h-10 mb-2 text-gray-400" />
            <p>Tidak ada data</p>
          </div>
        ) : (
          <div className="grid gap-1">
            {combinedData.map((item, index) => (
              <LinkPreview
                quality={100}
                key={index}
                url={item.instagram_link} // This will be the main Instagram URL
                previewUrl={`${item.instagram_link}embed`} // This will be used for the preview image
                className="flex items-center p-[10px] transition-colors group rounded-lg hover:shadow-lg transition-shadow duration-300 bg-white shadow-[0_0_7px_rgba(0,0,0,0.1)] border"
              >
                <div className="flex-1">
                  <p className="text-gray-500 text-[10px]">
                    {item.instagram_link}
                  </p>
                </div>
                {item.type === "quote" ? (
                  <MessageSquareQuote className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                ) : (
                  <Flame className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                )}
              </LinkPreview>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
