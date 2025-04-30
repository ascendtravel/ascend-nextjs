import RpUpdateDetailsView from './_components/RpUpdateDetailsView';

type RpUpdateDetailsViewProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    params: Promise<{ [key: string]: string }>;
};

export default async function UpdateDetailsPage(props: RpUpdateDetailsViewProps) {
    const searchParams = await props.searchParams;
    const params = await props.params;

    return <RpUpdateDetailsView rpId={params['rp-id']} />;
}
