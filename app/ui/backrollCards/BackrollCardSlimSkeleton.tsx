import './BackrollCardSlim.scss';
import '../shared/Skeleton.scss';

export default function BackrollCardSlimSkeleton() {
  return (
    <div className="mini-quote-card">
      <div className="mini-quote-card--content">
        <div className="bcs-card" style={{ background: 'transparent', padding: 0 }}>
          {/* Left image placeholder */}
          <div className="bcs-image sk sk--image" />

          {/* Right content */}
          <div className="bcs-inner" style={{ background: 'transparent', padding: 0 }}>
            <div className="bcs-content" style={{ padding: 0 }}>
              <div className="bcs-quote-wrapper">
                <div className="sk sk--text-lg" style={{ width: '85%', margin: '0.25rem auto' }} />
                <div className="sk sk--text-lg" style={{ width: '70%', margin: '0.25rem auto' }} />
                <div className="sk sk--text-lg" style={{ width: '55%', margin: '0.25rem auto' }} />
              </div>
              <div className="bcs-speaker" style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '1rem' }}>
                <div className="sk sk--text" style={{ width: 80 }} />
              </div>
            </div>

            {/* Actions row */}
            <div className="bcs-actions-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <div className="sk sk--circle" style={{ width: 24, height: 24 }} />
                <div className="sk sk--text" style={{ width: 20, height: 12 }} />
                <div className="sk sk--circle" style={{ width: 24, height: 24 }} />
              </div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <div className="sk sk--circle" style={{ width: 24, height: 24 }} />
                <div className="sk sk--circle" style={{ width: 24, height: 24 }} />
                <div className="sk sk--circle" style={{ width: 24, height: 24 }} />
              </div>
              <div className="sk sk--circle" style={{ width: 24, height: 24 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
