export function PostCardSkeleton() {
    return (
        <div className="post-card post-card--skeleton">
            <div className="post-card__votes">
                <div className="skeleton skeleton--btn"></div>
                <div className="skeleton skeleton--text skeleton--short"></div>
                <div className="skeleton skeleton--btn"></div>
            </div>

            <div className="post-card__content">
                <div className="post-card__meta">
                    <div className="skeleton skeleton--text skeleton--short"></div>
                </div>
                <div className="skeleton skeleton--text skeleton--title"></div>
                <div className="skeleton skeleton--text"></div>
                <div className="skeleton skeleton--text skeleton--short"></div>
            </div>
        </div>
    );
}
