import { Trip } from '@/app/api/rp-trips/route';

interface UserSpecificTripCardProps {
    trip: Trip;
}

export default function UserSpecificTripCard({ trip }: UserSpecificTripCardProps) {
    return <div>UserSpecificTripCard</div>;
}
