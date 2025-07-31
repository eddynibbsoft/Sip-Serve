"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

// Define TypeScript interfaces for your data
interface MenuItemData {
  menu_item_id: number;
  menu: number;
  product: number;
  quantity: number;
  unit: string;
  price: number;
}

interface Product {
  product_id: number;
  name: string;
}

interface Menu {
  menu_id: number;
  name: string;
  description: string;
}


const MenuPage = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [menuData, setMenuData] = useState({ name: '', description: '' });
  const [menuItemData, setMenuItemData] = useState({
    menu: '',
    product: '',
    quantity: '',
    unit: '',
    price: '',
  });
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [editMenuId, setEditMenuId] = useState<number | null>(null);
  const [editMenuItemId, setEditMenuItemId] = useState<number | null>(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [openMenuModal, setOpenMenuModal] = useState(false);
  const [openMenuItemModal, setOpenMenuItemModal] = useState(false);
  
  // State for delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<Menu | null>(null);

  const accessToken = localStorage.getItem('access_token');

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  useEffect(() => {
    fetchMenus();
    fetchProducts();
  }, []);

  // Fetch all menus
  const fetchMenus = async () => {
    try {
      const response = await axiosInstance.get('http://127.0.0.1:8000/api/restaurant/menus/');
      setMenus(response.data);
    } catch (error) {
      console.error('Error fetching menus:', error);
      setNotification({ open: true, message: 'Error fetching menus!', severity: 'error' });
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('http://127.0.0.1:8000/api/restaurant/products/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setNotification({ open: true, message: 'Error fetching products!', severity: 'error' });
    }
  };

  // Fetch menu items for a specific menu
  const fetchMenuItems = async (menuId: number) => {
    try {
      const response = await axiosInstance.get(`http://127.0.0.1:8000/api/restaurant/menus/${menuId}/items/`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setNotification({ open: true, message: 'Error fetching menu items!', severity: 'error' });
    }
  };

  // Handle form submission for creating/updating menus
  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMenuId) {
        // Update existing menu
        await axiosInstance.put(`http://127.0.0.1:8000/api/restaurant/menus/${editMenuId}/`, menuData);
        setMenus(menus.map(menu => (menu.menu_id === editMenuId ? { ...menu, ...menuData } : menu)));
        setNotification({ open: true, message: 'Menu updated successfully!', severity: 'success' });
      } else {
        // Create new menu
        const response = await axiosInstance.post('http://127.0.0.1:8000/api/restaurant/menus/', menuData);
        setMenus([...menus, response.data]);
        setNotification({ open: true, message: 'Menu created successfully!', severity: 'success' });
      }
      // Reset form and close modal
      setMenuData({ name: '', description: '' });
      setEditMenuId(null);
      setOpenMenuModal(false);
    } catch (error) {
      console.error('Error handling menu submit:', error);
      setNotification({ open: true, message: 'Failed to create/update menu!', severity: 'error' });
    }
  };

  // Handle form submission for creating/updating menu items
  const handleMenuItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const menuItemDataToSubmit: MenuItemData = {
        menu_item_id: editMenuItemId ?? 0,
        menu: selectedMenu?.menu_id ?? 0, // Ensure it's linked to the selected menu
        product: Number(menuItemData.product),
        quantity: Number(menuItemData.quantity),
        unit: menuItemData.unit,
        price: Number(menuItemData.price),
      };

      if (editMenuItemId) {
        // Update existing menu item
        await axiosInstance.put(`http://127.0.0.1:8000/api/restaurant/menu-items/${editMenuItemId}/`, menuItemDataToSubmit);
        setMenuItems(menuItems.map(item => (item.menu_item_id === editMenuItemId ? { ...item, ...menuItemDataToSubmit } : item)));
        setNotification({ open: true, message: 'Menu Item updated successfully!', severity: 'success' });
      } else {
        // Create new menu item
        const response = await axiosInstance.post('http://127.0.0.1:8000/api/restaurant/menu-items/', menuItemDataToSubmit);
        setMenuItems([...menuItems, response.data]);
        setNotification({ open: true, message: 'Menu Item created successfully!', severity: 'success' });
      }

      // Reset form and close modal
      setMenuItemData({ menu: '', product: '', quantity: '', unit: '', price: '' });
      setEditMenuItemId(null);
      setOpenMenuItemModal(false);
      fetchMenuItems(menuItemDataToSubmit.menu);
    } catch (error) {
      console.error('Error handling menu item submit:', error);
      setNotification({ open: true, message: 'Failed to create/update menu item!', severity: 'error' });
    }
  };

  // Handle deleting a menu
  const handleMenuDelete = async () => {
    if (!menuToDelete) return;

    try {
      await axiosInstance.delete(`http://127.0.0.1:8000/api/restaurant/menus/${menuToDelete.menu_id}/`);
      setMenus(menus.filter(menu => menu.menu_id !== menuToDelete.menu_id));
      setNotification({ open: true, message: 'Menu deleted successfully!', severity: 'success' });
      // If the deleted menu was selected, reset selection
      if (selectedMenu?.menu_id === menuToDelete.menu_id) {
        setSelectedMenu(null);
        setMenuItems([]);
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
      setNotification({ open: true, message: 'Failed to delete menu!', severity: 'error' });
    } finally {
      setOpenDeleteDialog(false);
      setMenuToDelete(null);
    }
  };

  // Open delete confirmation dialog
  const confirmDeleteMenu = (menu: Menu) => {
    setMenuToDelete(menu);
    setOpenDeleteDialog(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setMenuToDelete(null);
  };

  // Close notification snackbar
  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  // Handle selecting a menu
  const handleMenuClick = (menu: Menu) => {
    setSelectedMenu(menu);
    fetchMenuItems(menu.menu_id);
  };

  // Handle editing a menu
  const handleEditMenuClick = (menu: Menu) => {
    setMenuData({ name: menu.name, description: menu.description });
    setEditMenuId(menu.menu_id);
    setOpenMenuModal(true);
  };

  // Function to handle deleting a menu item
const handleMenuItemDelete = async (menuItemId: number) => {
  try {
    await axiosInstance.delete(`http://127.0.0.1:8000/api/restaurant/menu-items/${menuItemId}/`);
    setMenuItems(menuItems.filter(item => item.menu_item_id !== menuItemId));
    setNotification({ open: true, message: 'Menu Item deleted successfully!', severity: 'success' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    setNotification({ open: true, message: 'Failed to delete menu item!', severity: 'error' });
  }
};


  // Handle editing a menu item
  const handleEditMenuItemClick = (item: MenuItemData) => {
    setMenuItemData({
      menu: item.menu.toString(),
      product: item.product.toString(),
      quantity: item.quantity.toString(),
      unit: item.unit,
      price: item.price.toString(),
    });
    setEditMenuItemId(item.menu_item_id);
    setOpenMenuItemModal(true);
  };

  return (
    <Box sx={{ display: 'flex', height: 'auto', backgroundColor: 'cornwhite', padding: '5px' }}>
      {/* Snackbar for notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Menu</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the menu "{menuToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleMenuDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vertical Navigation for Menus */}
      <Box
        sx={{
          width: '300px',
          borderRight: '2px solid #e0e0e0',
          padding: '20px',
          backgroundColor: '#fff',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          borderRadius: '8px',
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: '20px', textAlign: 'center', color: '#1976d2', fontWeight: 'bold' }}>
          Menus
        </Typography>
        <Box>
          {menus.map(menu => (
            <Box key={menu.menu_id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Button
                sx={{
                  flexGrow: 1,
                  textAlign: 'left',
                  padding: '10px 20px',
                  backgroundColor: selectedMenu?.menu_id === menu.menu_id ? '#1976d2' : '#f5f5f5',
                  color: selectedMenu?.menu_id === menu.menu_id ? '#fff' : '#000',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: selectedMenu?.menu_id === menu.menu_id ? '#1565c0' : '#eeeeee',
                  },
                }}
                onClick={() => handleMenuClick(menu)}
              >
                {menu.name}
              </Button>
              {/* Edit Menu Button */}
              <Tooltip title="Edit Menu">
                <IconButton
                  color="primary"
                  onClick={() => handleEditMenuClick(menu)}
                  sx={{ marginLeft: '5px' }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              {/* Delete Menu Button */}
              <Tooltip title="Delete Menu">
                <IconButton
                  color="error"
                  onClick={() => confirmDeleteMenu(menu)}
                  sx={{ marginLeft: '5px' }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
          <Button
            sx={{
              width: '100%',
              textAlign: 'center',
              padding: '10px',
              backgroundColor: '#4caf50',
              color: '#fff',
              borderRadius: '4px',
              '&:hover': { backgroundColor: '#43a047' },
              marginTop: '20px',
            }}
            startIcon={<Add />}
            onClick={() => setOpenMenuModal(true)}
          >
            Add New Menu
          </Button>
        </Box>
      </Box>

      {/* Menu Items Display */}
      <Box sx={{ flexGrow: 1, padding: '20px' }}>
        {selectedMenu ? (
          <>
            <Typography variant="h4" sx={{ color: '#1976d2', marginBottom: '20px' }}>
              Menu Items for "{selectedMenu.name}"
            </Typography>

            {/* Button to Add Menu Item */}
            <Button
              sx={{
                padding: '10px 20px',
                backgroundColor: '#4caf50',
                color: '#fff',
                borderRadius: '4px',
                '&:hover': { backgroundColor: '#43a047' },
                marginBottom: '20px',
              }}
              startIcon={<Add />}
              onClick={() => {
                setMenuItemData({
                  menu: selectedMenu.menu_id.toString(),
                  product: '',
                  quantity: '',
                  unit: '',
                  price: '',
                });
                setEditMenuItemId(null);
                setOpenMenuItemModal(true);
              }}
            >
              Add New Menu Item
            </Button>

            {/* Table to display menu items */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {menuItems.length > 0 ? (
                    menuItems.map(item => (
                      <TableRow key={item.menu_item_id}>
                        <TableCell>{products.find(p => p.product_id === item.product)?.name || 'N/A'}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>
  ${Number.isNaN(Number(item.price)) ? '0.00' : Number(item.price).toFixed(2)}
</TableCell>

                        <TableCell align="center">
                          <Tooltip title="Edit Menu Item">
                            <IconButton onClick={() => handleEditMenuItemClick(item)}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Menu Item">
                            <IconButton onClick={() => handleMenuItemDelete(item.menu_item_id)}>
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No menu items found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Typography variant="h6" sx={{ color: '#888', textAlign: 'center', marginTop: '50px' }}>
            Please select a menu to view its items.
          </Typography>
        )}
      </Box>

      {/* Modal for Adding/Editing Menus */}
      <Modal
        open={openMenuModal}
        onClose={() => {
          setOpenMenuModal(false);
          setEditMenuId(null);
          setMenuData({ name: '', description: '' });
        }}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Box
          sx={{
            width: 400,
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: '20px', color: '#1976d2', fontWeight: 'bold' }}>
            {editMenuId ? 'Edit Menu' : 'Add New Menu'}
          </Typography>
          <form onSubmit={handleMenuSubmit}>
            <TextField
              label="Menu Name"
              variant="outlined"
              fullWidth
              required
              sx={{ marginBottom: '20px' }}
              value={menuData.name}
              onChange={e => setMenuData({ ...menuData, name: e.target.value })}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              sx={{ marginBottom: '20px' }}
              value={menuData.description}
              onChange={e => setMenuData({ ...menuData, description: e.target.value })}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setOpenMenuModal(false);
                setEditMenuId(null);
                setMenuData({ name: '', description: '' });
              }} sx={{ marginRight: '10px' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {editMenuId ? 'Update Menu' : 'Create Menu'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Modal for Adding/Editing Menu Items */}
      <Modal
        open={openMenuItemModal}
        onClose={() => {
          setOpenMenuItemModal(false);
          setEditMenuItemId(null);
          setMenuItemData({ menu: selectedMenu?.menu_id.toString() || '', product: '', quantity: '', unit: '', price: '' });
        }}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Box
          sx={{
            width: 400,
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: '20px', color: '#1976d2', fontWeight: 'bold' }}>
            {editMenuItemId ? 'Edit Menu Item' : 'Add New Menu Item'}
          </Typography>
          <form onSubmit={handleMenuItemSubmit}>
            {/* Since the menu is already selected, we can display it as read-only */}
            <FormControl fullWidth variant="outlined" sx={{ marginBottom: '20px' }}>
              <InputLabel>Menu</InputLabel>
              <Select
                value={menuItemData.menu}
                onChange={e => setMenuItemData({ ...menuItemData, menu: e.target.value })}
                label="Menu"
                disabled // Disable as it's tied to the selected menu
              >
                {menus.map(menu => (
                  <MenuItem key={menu.menu_id} value={menu.menu_id}>
                    {menu.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Product Selection */}
            <FormControl fullWidth variant="outlined" sx={{ marginBottom: '20px' }} required>
              <InputLabel>Product</InputLabel>
              <Select
                value={menuItemData.product}
                onChange={e => setMenuItemData({ ...menuItemData, product: e.target.value })}
                label="Product"
              >
                {products.map(product => (
                  <MenuItem key={product.product_id} value={product.product_id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Quantity */}
            <TextField
              label="Quantity"
              variant="outlined"
              fullWidth
              type="number"
              required
              sx={{ marginBottom: '20px' }}
              value={menuItemData.quantity}
              onChange={e => setMenuItemData({ ...menuItemData, quantity: e.target.value })}
            />

            {/* Unit */}
            <TextField
              label="Unit"
              variant="outlined"
              fullWidth
              required
              sx={{ marginBottom: '20px' }}
              value={menuItemData.unit}
              onChange={e => setMenuItemData({ ...menuItemData, unit: e.target.value })}
            />

            {/* Price */}
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              type="number"
              required
              sx={{ marginBottom: '20px' }}
              value={menuItemData.price}
              onChange={e => setMenuItemData({ ...menuItemData, price: e.target.value })}
            />

            {/* Form Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setOpenMenuItemModal(false);
                setEditMenuItemId(null);
                setMenuItemData({
                  menu: selectedMenu?.menu_id.toString() || '',
                  product: '',
                  quantity: '',
                  unit: '',
                  price: '',
                });
              }} sx={{ marginRight: '10px' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {editMenuItemId ? 'Update Menu Item' : 'Create Menu Item'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default MenuPage;
