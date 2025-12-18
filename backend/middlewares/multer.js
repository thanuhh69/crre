import multer from "multer"
import fs from "fs"
import path from "path"

const publicDir = path.join(process.cwd(), 'public')
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })

const storage = multer.diskStorage({
 destination: (req, file, cb) => {
    cb(null, publicDir)
 },
 filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random()*1e9)
    const ext = path.extname(file.originalname)
    cb(null, `${unique}${ext}`)
 }
})

export const upload = multer({storage})