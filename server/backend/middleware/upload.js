// middleware/upload.js
const multer = require('multer')
const path = require('path')

// Destination & nom de fichier
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')          // assurez-vous que ce dossier existe
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, Date.now() + ext)     // ex. 1618033988749.jpg
  }
})

// Filtre pour n’accepter que les images
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/
  const validExt = allowed.test(path.extname(file.originalname).toLowerCase())
  const validMime = allowed.test(file.mimetype)
  if (validExt && validMime) cb(null, true)
  else cb(new Error('Seules les images sont autorisées'))
}

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 Mo max / fichier
})
