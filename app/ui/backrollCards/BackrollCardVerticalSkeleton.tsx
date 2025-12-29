import '../shared/Skeleton.scss';

export default function BackrollCardVerticalSkeleton() {
    return (
        <div style={{ width: 220 }}>
            <div className="sk-card" style={{ width: '100%', borderRadius: 10, overflow: 'hidden' }}>
                <div className="sk sk--image" />
                <div style={{ padding: '0.6rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="sk sk--text-lg" style={{ width: '85%', margin: '0.25rem 0' }} />
                    <div className="sk sk--text-lg" style={{ width: '65%', margin: '0.25rem 0' }} />
                    <div className="sk sk--text" style={{ width: 80, marginTop: '0.5rem' }} />
                </div>
            </div>
        </div>
    );
}
