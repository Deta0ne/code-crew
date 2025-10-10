import { getBeaconById } from '@/lib/services/beacon';
import { Metadata } from 'next';

type Props = {
    params: { beacon: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { beacon } = await params;
    const beaconData = await getBeaconById(beacon);

    return {
        title: beaconData?.title || 'Beacon',
        description: beaconData?.description,
        other: {
            'beacon-title': beaconData?.title || 'Beacon',
        },
    };
}

export default async function BeaconPage({ params }: Props) {
    const { beacon } = await params;

    const beaconData = await getBeaconById(beacon);

    return (
        <div>
            BeaconPage {beaconData?.title} <br />
            {beaconData?.description} <br />
            {beaconData?.project_type} <br />
            {beaconData?.category} <br />
            {beaconData?.difficulty} <br />
            {beaconData?.max_members} <br />
            {beaconData?.current_members}
        </div>
    );
}
