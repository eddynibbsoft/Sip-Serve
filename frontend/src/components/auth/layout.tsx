'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from '@/paths';
import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100%',
        position: 'relative',
      }}
    >
      {/* Top-left corner animated food image */}
      {/* <Box
        component="img"
        src="/assets/rcu-logo-net.png"
        alt="Food"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '80px',
          height: '80px',
     
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          objectFit: 'cover',
          transition: 'transform 0.3s ease', // Hover effect for scale
          animation: 'scaleAnimation 5s infinite ease-in-out', // Continuous animation
          '&:hover': {
            transform: 'scale(1.2)', // Enlarge on hover
          },
        }}
      /> */}

      {/* Top-right corner animated food image */}
      {/* <Box
        component="img"
        src="/assets/food3.png"
        alt="Food"
        sx={{
          position: 'absolute',
          top: '50px',
          right: '100px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
          animation: 'scaleAnimation 5s infinite ease-in-out',
          '&:hover': {
            transform: 'scale(1.2)',
          },
        }}
      /> */}

      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
        <Box sx={{ p: 3 }}>
          <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
            <DynamicLogo colorDark="light" colorLight="dark" height={32} width={122} />
          </Box>
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 3 }}>
          <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>

      <Box
        sx={{
          alignItems: 'center',
          background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
          color: 'var(--mui-palette-common-white)',
          display: { xs: 'none', lg: 'flex' },
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component="img"
              alt="Logo"
              src="/assets/rcu-logo-net.png"
              sx={{ height: 'auto', width: '70%', maxWidth: '600px' }}
            />
          </Box>
          <Stack spacing={1}>
            <Typography sx={{ fontSize: '28px', lineHeight: '32px', textAlign: 'center' }} variant="h1">
              <Box component="span" sx={{ color: '#009ad4' }}>
                Bar & Restaurant Management System
              </Box>
            </Typography>
            <Typography color="white" align="center" variant="subtitle1">
              CMS-2024
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Bottom-left corner animated food image */}
      {/* <Box
        component="img"
        src="/assets/food3.png"
        alt="Food"
        sx={{
          position: 'absolute',
          bottom: '50px',
          left: '100px',
          width: '400px',
          height: '200px',
          borderRadius: '20%',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
          animation: 'scaleAnimation 5s infinite ease-in-out',
          '&:hover': {
            transform: 'scale(1.2)',
          },
        }}
      /> */}

      {/* Bottom-right corner animated food image */}
      <Box
        component="img"
        src="/assets/food4.png"
        alt="Food"
        sx={{
          position: 'absolute',
          bottom: '50px',
          right: '100px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
          animation: 'scaleAnimation 5s infinite ease-in-out',
          '&:hover': {
            transform: 'scale(1.2)',
          },
        }}
      />

      <style jsx global>{`
        @keyframes scaleAnimation {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </Box>
  );
}
