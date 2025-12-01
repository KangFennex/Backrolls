import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb({
    region,
    seriesCode,
    series,
    season,
    episode,
}: {
    region?: string,
    seriesCode?: string,
    series?: string,
    season?: number,
    episode?: number
}) {
    const pathname = usePathname();

    // Helper function to build URLs safely
    const buildUrl = (base: string, params: Record<string, string | number | undefined>) => {
        const urlParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                urlParams.append(key, value.toString());
            }
        });

        return `${base}?${urlParams.toString()}`;
    };

    const breadcrumbs = [
        {
            label: series,
            href: series ? buildUrl('/series', {
                region,
                series: seriesCode,
                season: 1,
                episode: 1
            }) : undefined,
            active: pathname === '/series'
        },
        {
            label: season !== undefined ? `S${season}` : undefined,
            href: season !== undefined ? buildUrl('/series', {
                region,
                series: seriesCode,
                season,
                episode: 1
            }) : undefined,
            active: pathname === '/series' && season !== undefined
        },
        {
            label: episode !== undefined ? `E${episode}` : undefined,
            href: episode !== undefined ? buildUrl('/series', {
                region,
                series: seriesCode,
                season,
                episode
            }) : undefined,
            active: pathname === '/series' && episode !== undefined
        }
    ].filter(breadcrumb => breadcrumb.label);

    return (
        <div
            role="navigation"
            aria-label="Breadcrumb"
            className="breadcrumbs"
        >
            <Breadcrumbs
                aria-label="breadcrumb"
                separator="/"
                sx={{
                    color: '#FFFFF0',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                }}
            >
                {breadcrumbs.map((breadcrumb, index) => {
                    // All breadcrumbs should be links if they have a href
                    if (!breadcrumb.href) {
                        return (
                            <span
                                key={index}
                                style={{
                                    color: '#FFFFF0',
                                    cursor: 'default'
                                }}
                            >
                                {breadcrumb.label}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            component={NextLink}
                            href={breadcrumb.href}
                            underline="hover"
                            color="inherit"
                            sx={{
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            {breadcrumb.label}
                        </Link>
                    );
                })}
            </Breadcrumbs>
        </div>
    );
}