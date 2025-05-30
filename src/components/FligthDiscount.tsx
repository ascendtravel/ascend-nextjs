import Image from "next/image";
import { Button } from "./ui/button";
import { FlightPayload } from "@/app/api/rp-trips/route";
import { formatDateNoTZ } from "@/lib/date-formatters";
import { getCurrencyAndAmountText } from "@/lib/money";

export default function FligthDiscount({ flight }: { flight: FlightPayload }) {

  const savingsString = getCurrencyAndAmountText(
    flight.potential_savings_cents ?? { amount: 0, currency: 'USD' },
    true,
    false
  );

  return <div className="flex flex-col gap-4">

    <div className='flex max-w-md flex-col items-center justify-center gap-3 rounded-2xl bg-neutral-50 py-12'>
      <div className="w-[163px] mb-2">
        {
          flight.airline_logo_url && (
            <Image
              src={flight.airline_logo_url}
              alt='Delta Air Lines'
              width={163}
              height={36}
              className="w-full"
            />
          )
        }
      </div>
      <div className="max-w-[290px]">
        <span className="text-xl font-medium text-center block">{flight.airline} has lowered the fare by <strong className="font-bold">{savingsString}</strong> on your existing booking</span>
      </div>
      <span className="text-sm text-black/50 font-medium mb-3">{flight.departure_airport_iata_code} to {flight.arrival_airport_iata_code} on {formatDateNoTZ(flight.departure_date)}</span>

      <Button variant="primary-green">Get {savingsString} airline credits</Button>

      <span className="text-sm text-black/50 font-medium">Don't want to save? Decline this repricing</span>
    </div>
  </div>;
}