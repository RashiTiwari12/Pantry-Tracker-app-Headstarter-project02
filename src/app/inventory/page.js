"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  Pagination,
} from "@mui/material";
import { auth, firestore } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { onAuthStateChanged, signOut } from "firebase/auth";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#fff",
  border: "none",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
  borderRadius: "12px",
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const itemsPerPage = 5;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateInventory = async () => {
    if (!user) return;
    const snapshot = query(collection(firestore, user.uid));

    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    if (user) {
      updateInventory();
    }
  }, [user]);

  const addItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, user.uid), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data();
      await setDoc(docRef, { quantity: existingQuantity + quantity });
    } else {
      await setDoc(docRef, { quantity });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, user.uid), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!user) {
    return <Typography>Please log in to view the inventory.</Typography>;
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: "#f7f7f7",
        backgroundImage:
          'url("https://cdn.pixabay.com/photo/2021/02/01/06/48/geometric-5969508_1280.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: 3,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          alignItems: "center",
          gap: 1,
          backgroundColor: "#fff",
          padding: "8px 12px",
          borderRadius: "8px",
          boxShadow: 1,
        }}
      >
        <AccountCircleIcon sx={{ color: "#333" }} />
        <Typography sx={{ color: "#333", fontWeight: "bold" }}>
          {user.displayName}
        </Typography>
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{
            marginLeft: 2,
            backgroundColor: "#333",
            color: "#fff",
            "&:hover": { backgroundColor: "#555" },
            borderRadius: "8px",
            padding: "4px 8px",
            minWidth: "auto",
          }}
        >
          <LogoutIcon />
        </Button>
      </Box>
      <Box
        width={{ xs: "90%", sm: "80%", md: "70%", lg: "60%" }}
        maxWidth="800px"
        bgcolor="#fff"
        boxShadow={3}
        borderRadius="12px"
        p={3}
      >
        <Typography
          sx={{ color: "#333", fontWeight: "bold", fontSize: "2rem", mb: 3 }}
          textAlign="center"
        >
          Inventory Management
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            display: "block",
            mx: "auto",
            mb: 3,
            backgroundColor: "#333",
            color: "#fff",
            "&:hover": { backgroundColor: "#555" },
            borderRadius: "8px",
          }}
        >
          Add New Item
        </Button>
        <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
          <TextField
            label="Search"
            variant="outlined"
            onChange={handleSearchChange}
            fullWidth
            sx={{
              input: { color: "#333" },
              label: { color: "#333" },
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "#333",
              },
              "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#333",
                },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#333",
                },
            }}
          />
        </Box>
        <Stack
          spacing={2}
          sx={{
            overflowY: "auto",
            maxHeight: "400px",
            mb: 3,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ccc",
              borderRadius: "8px",
            },
          }}
        >
          {paginatedInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              p={2}
              bgcolor="#fafafa"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderRadius="8px"
              boxShadow="0px 0px 6px rgba(0, 0, 0, 0.1)"
            >
              <Typography variant="h6" color="#333">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6" color="#333">
                Quantity: {quantity}
              </Typography>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addItem(name, 1)}
                  sx={{
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#45a049" },
                    borderRadius: "8px",
                  }}
                >
                  +
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => removeItem(name)}
                  sx={{
                    backgroundColor: "#f44336",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#e53935" },
                    borderRadius: "8px",
                  }}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
        <Box display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(filteredInventory.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{
              ".MuiPaginationItem-root": {
                color: "#333",
              },
              ".MuiPaginationItem-page.Mui-selected": {
                backgroundColor: "#333",
                color: "#fff",
              },
            }}
          />
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="outlined-quantity"
              label="Quantity"
              type="number"
              variant="outlined"
              fullWidth
              value={itemQuantity}
              onChange={(e) => setItemQuantity(Number(e.target.value))}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName, itemQuantity);
                setItemName("");
                setItemQuantity(1);
                handleClose();
              }}
              sx={{
                backgroundColor: "#333",
                color: "#fff",
                "&:hover": { backgroundColor: "#555" },
                borderRadius: "8px",
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
