import { CRequest } from "@shared/customRequest";
import { CustomError, RequiredParameterError } from "@shared/customError";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import multer from "multer";
import path from 'path';

export default  async function handleFileUploadRequestRequest(httpRequest: CRequest) {
  try {
    if (!httpRequest.file) {
      throw new RequiredParameterError('No file uploaded.')
    }
    const imageUrl = `${httpRequest.file.filename}`;
    return makeHttpResponse({
      statusCode: 200,
      data: { imageUrl }
    });
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) {
      if (error instanceof RequiredParameterError) {
        return makeHttpError({
          statusCode: 400,
          errorMessage: error.message
        });
      }
      return makeHttpError({
        statusCode: 400,
        errorMessage: error.message
      });
    }
    return makeHttpError({
      statusCode: 500,
      errorMessage: "Something went wrong."
    });
  }
}



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../../public');
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage: storage });

export const multerHandleUploadFileRequest = upload.single('image');