import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = "force-dynamic";

function getCloudinaryConfig() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudinaryUrl) {
    cloudinary.config({
      cloudinary_url: cloudinaryUrl,
      secure: true,
    });
    return { configured: true };
  }

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    return { configured: true };
  }

  return {
    configured: false,
    missing: ["CLOUDINARY_URL (e.g. cloudinary://api_key:api_secret@cloud_name)"],
  };
}

export async function POST(req: NextRequest) {
  try {
    const configCheck = getCloudinaryConfig();
    if (!configCheck.configured) {
      return NextResponse.json(
        {
          error: `Cloudinary is not fully configured. Missing: ${configCheck.missing?.join(", ")}. Please add them to your .env.local file.`,
        },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in the upload request." },
        { status: 400 }
      );
    }

    // Validate mime type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: `Invalid file type (${file.type}). Only images are supported.` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary stream with auto optimizations
    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
      format?: string;
      bytes?: number;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "rosamystica/blogs",
          resource_type: "image",
          transformation: [
            { quality: "auto:good", fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload to Cloudinary failed"));
          } else {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              bytes: result.bytes,
            });
          }
        }
      );

      stream.end(buffer);
    });

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          "An unexpected error occurred while uploading to Cloudinary.",
      },
      { status: 500 }
    );
  }
}
