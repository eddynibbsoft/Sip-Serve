// components/dashboard/menu/MenuItemForm.tsx

import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

interface MenuItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export const MenuItemForm: React.FC<MenuItemFormProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [name, setName] = React.useState(initialData?.name || '');
  const [email, setEmail] = React.useState(initialData?.email || '');
  const [phone, setPhone] = React.useState(initialData?.phone || '');
  const [address, setAddress] = React.useState(initialData?.address || { city: '', state: '', country: '', street: '' });

  const handleSubmit = () => {
    const data = {
      id: initialData?.id || `USR-${Math.random().toString(36).substr(2, 9)}`, // Generate a new ID for new items
      name,
      email,
      phone,
      address,
    };
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Phone"
          fullWidth
          variant="outlined"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          margin="dense"
          label="City"
          fullWidth
          variant="outlined"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />
        <TextField
          margin="dense"
          label="State"
          fullWidth
          variant="outlined"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Country"
          fullWidth
          variant="outlined"
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Street"
          fullWidth
          variant="outlined"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};
