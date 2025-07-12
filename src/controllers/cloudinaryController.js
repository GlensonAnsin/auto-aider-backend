import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const generateSignature = async (req, res) => {
    try {
        const timestamp = Math.floor(Date.now() / 1000);
        const paramsToSign = {
            timestamp,
            folder: 'profile-pictures'
        };

        const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

        res.status(200).json({
            timestamp,
            signature,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            folder: 'profile-pictures',
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const generateSignatureForShopImages = async (req, res) => {
    try {
        const timestamp = Math.floor(Date.now() / 1000);
        const paramsToSign = {
            timestamp,
            folder: 'shop-images'
        };

        const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

        res.status(200).json({
            timestamp,
            signature,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            folder: 'shop-images',
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const deleteProfilePic = async (req, res) => {
    const { public_id } = req.body;

    try {
        const res = await cloudinary.uploader.destroy(public_id);
        res.status(200)

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};