import upload from "../../utils/middle_ware/upload.js";
import { cloudinary } from "../../utils/cloudinary.js";
import { createReadStream } from "streamifier";
import { Router  } from "express";

const router=Router();
export const uploadImage= async (req, res)=>{
  try {
        const result = await new Promise(
          (resolve, reject) => {
            const stream =
              cloudinary.uploader.upload_stream(
                {
                  folder: "user-images",
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
  
            createReadStream(req.file.buffer)
              .pipe(stream);
          }
        );
  
        res.json({
          success: true,
          imageUrl: result.secure_url,
        });
      } catch (error) {
        console.log(error)
        res.status(500).json({
          success: false,
        });
      }
}
router.post(
    "/upload",
    upload.single("image"),
    uploadImage
  );

  export{router as upload}