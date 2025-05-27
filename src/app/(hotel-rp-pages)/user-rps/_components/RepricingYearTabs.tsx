import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TripYear } from "@/contexts/TripsRpContext";

export const RepricingYearTabs = ({
    selectedYear,
    setSelectedYear,
    allYears
}: {
    selectedYear: TripYear;
    setSelectedYear: (year: TripYear) => void;
    allYears: TripYear[];
}) => {
  return (
    <Tabs
      defaultValue={selectedYear.toString()}
      onValueChange={(value) => {
        const yearValue = !isNaN(Number(value)) ? Number(value) : value;
        setSelectedYear(yearValue as TripYear);
      }}
    >
      <TabsList className='bg-transparent gap-2 p-0'>
        {allYears.map((year, index) => (
          <TabsTrigger
            className='rounded-t-3xl px-6 py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:bg-[#F7F7F712] data-[state=inactive]:text-white rounded-b-none'
            key={`${year}-${index}`}
            value={year.toString()}
          >
            {year}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}