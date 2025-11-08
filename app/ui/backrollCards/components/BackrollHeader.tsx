import Image from 'next/image';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Breadcrumb from "../../breadcrumbs";
import { BackrollHeaderProps } from '../../../lib/definitions';

export default function BackrollHeader({ quote }: BackrollHeaderProps) {
    return (
        <CardHeader
            title={
                <div className="text-xs warm-ivory">
                    <Breadcrumb
                        series={quote.series}
                        season={quote.season}
                        episode={quote.episode}
                    />
                </div>
            }
            sx={{
                padding: '8px 16px 5px 12px',
                '& .MuiCardHeader-avatar': {
                    marginRight: '12px'
                },
                '& .MuiCardHeader-content': {
                    overflow: 'hidden'
                }
            }}
            action={
                <IconButton 
                    aria-label="settings" 
                    size="small" 
                    sx={{ 
                        color: '#FFFFF0 !important',
                        '& .MuiSvgIcon-root': {
                            color: '#FFFFF0 !important'
                        }
                    }}
                >
                    <MoreVertIcon fontSize="small" />
                </IconButton>
            }
            avatar={
                <Avatar aria-label="avatar" sx={{ width: 30, height: 30 }}>
                    <Image src="/media/rupaul.jpg" alt="RuPaul" width={30} height={30} />
                </Avatar>
            }
        />
    );
}