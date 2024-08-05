import multer from "module"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
    //   cb(null, file.originalname)  we can add name cnage

    }
  })
  
  const upload = multer({ storage })