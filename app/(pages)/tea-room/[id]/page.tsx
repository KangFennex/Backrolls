import { PostDetailClient } from '@/app/ui/tea-room/components/PostDetailClient';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function PostDetailPage({ params }: PageProps) {
    const resolvedParams = await params;

    return (
        <PostDetailClient 
            postId={resolvedParams.id}
        />
    );
}
