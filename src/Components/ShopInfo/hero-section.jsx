import { Button } from "@/components/ui/button";

export default function HeroSection({ shopDetail }) {

  return (
    <div className="border-b pb-6">
      <div className="flex items-start gap-8 p-4">
        <img
          src={shopDetail.bannerUrl}
          alt="LG Electronic"
          className="object-cover w-1/3 h-80 rounded-lg"
        />
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className="">
              <img
                src={shopDetail.logoUrl}
                className="h-10 w-10 object-cover rounded-full"
              />
            </div>
            <div className="">
              <h1 className="text-2xl font-bold mb-1">
                {shopDetail.businessName}
              </h1>
              <p>{shopDetail.location}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {shopDetail.shortDesc}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 px-4">
        <Button variant="outline" size="sm">
          FB
        </Button>
        <Button variant="outline" size="sm">
          Get Connected
        </Button>
        <Button variant="outline" size="sm">
          Instagram
        </Button>
        <Button variant="outline" size="sm">
          Electronic
        </Button>
        <Button variant="outline" size="sm">
          Twitter
        </Button>
      </div>
    </div>
  );
}
