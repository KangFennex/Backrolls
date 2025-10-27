import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
}

export default function Breadcrumb({
    series,
    season,
    episode,
}: {
    series?: string,
    season?: number,
    episode?: number
}) {
    return (
        <div
            role="presentation"
            className="breadcrumbs"
            onClick={handleClick}>
            <Breadcrumbs aria-label="breadcrumb" separator="/" sx={{
                color: '#2C2C2C',
                fontSize: '0.7rem',
                fontWeight: 700,
            }}>
                <Link
                    underline="hover"
                    color="inherit"
                    href="/"
                >
                    {series}
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    href="/"
                >
                    S{season}
                </Link>
                <Link
                    underline="hover"
                    color="text.primary"
                    href="/backrolls"
                >
                    E{episode}
                </Link>
            </Breadcrumbs>
        </div>
    )
}