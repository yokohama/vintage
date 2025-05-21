"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteUrls } from "@/lib/config/siteConfig";
import Error from "@/components/ui/Error";
import NotFound from "@/components/ui/NotFound";
import Spinner from "@/components/ui/Spinner";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import { ApiErrorType, CheckPointType } from "@/lib/types";

export default function CheckPoints() {
  const [checkPoints, setCheckPoints] = useState<CheckPointType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiErrorType>(null);

  useEffect(() => {
    const fetchCheckPoints = async () => {
      try {
        setLoading(true);
        const data = await checkPointsAPI.getCheckPoints();
        setCheckPoints(data);
      } catch (err) {
        console.error("Error fetching check points:", err);
        setError(err as ApiErrorType);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckPoints();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Error />;
  }

  if (checkPoints?.length === 0 || !checkPoints) {
    return <NotFound msg="鑑定ポイントが見つかりませんでした。" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {checkPoints.map((checkPoint) => (
        <Link key={checkPoint.id} href={siteUrls.checkpoint(checkPoint.id)}>
          <div className="oldies-card cursor-pointer flex flex-col h-full">
            <div className="flex items-start p-3 flex-grow">
              {checkPoint.imageUrl && (
                <div className="relative h-16 w-16 mr-3 flex-shrink-0 oldies-bg-accent rounded-sm overflow-hidden oldies-border">
                  <Image
                    src={checkPoint.imageUrl}
                    alt={checkPoint.point}
                    fill
                    sizes="(max-width: 768px) 100vw, 64px"
                    className="object-cover sepia-[0.15] brightness-[0.98]"
                    priority={true}
                  />
                </div>
              )}
              <div className="flex-1">
                <h4 className="oldies-card-header">{checkPoint.point}</h4>
                <p className="text-xs oldies-text-secondary font-light italic">
                  {checkPoint.description}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
