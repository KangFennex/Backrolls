import '@/app/scss/components/Skeleton.scss';
import BackrollCardSlimSkeleton from '../../backrollCards/BackrollCardSlimSkeleton';

function ColumnSkeleton() {
  return (
    <div className="vertical-column">
      <h3 className="vertical-column-title">
        <span className="sk sk--text-lg" style={{ display: 'inline-block', width: 160 }} />
      </h3>
      <div className="vertical-column-content">
        {Array.from({ length: 6 }).map((_, i) => (
          <BackrollCardSlimSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function WorkroomVerticalColumnsSkeleton() {
  return (
    <section className="workroom-vertical-columns">
      <div className="vertical-columns-container">
        <ColumnSkeleton />
        <ColumnSkeleton />
        <ColumnSkeleton />
      </div>
    </section>
  );
}
