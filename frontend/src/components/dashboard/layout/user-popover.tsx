import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { SignOut as SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';
import axios from 'axios';
import { AxiosError } from 'axios'; // Import AxiosError


export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  const { checkSession } = useUser();
  const router = useRouter();
  const [userDetails, setUserDetails] = React.useState({
    first_name: '',
    last_name: '',
    email: ''
  });

 // Fetch user details when popover opens
React.useEffect(() => {
  if (open) {
    const fetchUserDetails = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:8000/api/auth/user/', {
          headers: {
            Authorization: `Bearer ${accessToken}` // Include access token in headers
          }
        });
        setUserDetails(response.data);
      } catch (err) {
        // Type assertion for AxiosError
        const error = err as AxiosError;

        logger.error('Failed to fetch user details', error);

        // Optional: Handle token expiration
        if (error.response && error.response.status === 401) {
          // Assuming `paths.auth.signIn` is your login route
          router.push(paths.auth.signIn);
        }
      }
    };
    fetchUserDetails();
  }
}, [open, router]);


// Handle Sign Out
const handleSignOut = React.useCallback(async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');

    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    // Log the tokens for debugging
    console.log('Stored Access Token:', accessToken);
    console.log('Stored Refresh Token:', refreshToken);

    // Attempt to log out
    await axios.post('http://127.0.0.1:8000/api/auth/logout/', {
      refresh: refreshToken,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include if needed
      },
    });

    // Clear tokens after successful logout
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Check session and refresh router
    await checkSession?.();
    router.refresh();
  } catch (err) {
    const error = err as AxiosError;
    logger.error('Sign out error', error.message); // Log the specific error message

    // Redirect to login page regardless of error
    router.push(paths.auth.signIn);
  }
}, [checkSession, router]);



  
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '240px' } } }}
    >
      <Box sx={{ p: '16px 20px ' }}>
        <Typography variant="subtitle1">{`${userDetails.first_name} ${userDetails.last_name}`}</Typography>
        <Typography color="text.secondary" variant="body2">
          {userDetails.email}
        </Typography>
      </Box>
      <Divider />
      <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
        <MenuItem component={RouterLink} href={paths.dashboard.settings} onClick={onClose}>
          <ListItemIcon>
            <GearSixIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem component={RouterLink} href={paths.dashboard.account} onClick={onClose}>
          <ListItemIcon>
            <UserIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <SignOutIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
