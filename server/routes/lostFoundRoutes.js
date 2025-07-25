import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  updateItemStatus,
  deleteItem,
} from '../controllers/lostFoundController.js';

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Public routes
router.get('/', getAllItems);
router.get('/:id', getItemById);

// Authenticated routes
router.post('/', protect, upload.single('image'), createItem);
router.put('/:id', protect, upload.single('image'), updateItem);
router.put('/status/:id', protect, authorizeRoles('admin'), updateItemStatus);
router.delete('/:id', protect, deleteItem);

export default router; 