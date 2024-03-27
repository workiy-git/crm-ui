import React, { useState } from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

function Footer() {
    const [showFooter, setShowFooter] = useState(false);

    return (
        <div style={{ justifyContent: 'center', display: 'flex', position: 'relative', height: '258px' }}>
            <div
                onMouseEnter={() => setShowFooter(true)}
                onMouseLeave={() => setShowFooter(false)}
                style={{ position: 'absolute', background: '#ffffff', height: '10px', width: '300px', borderRadius: '10px 10px 0 0', bottom: '0' }}
            >

            </div>
            {showFooter && (
                <div style={{ position: 'absolute', width: '200px', textAlign: 'center', marginTop: '2px', bottom: '0' }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        style={{
                            background: '#ffffff',
                            padding: '10px',
                            borderRadius: '5px',

                        }}
                    >
                        {'Copyright © '}
                        <Link color="inherit" href="https://www.workiy.com/">
                            Workiy
                        </Link>{' '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Typography>
                </div>
            )}
        </div>
    );
}

export default Footer;