import { NextRequest } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return new Response(JSON.stringify({ error: 'Missing fileName' }), { status: 400 });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 240 });
    console.log('📥 Generated GET URL:', signedUrl);

    return Response.json({ url: signedUrl });
  } catch (error) {
    console.error('Error generating GET URL:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate URL' }), { status: 500 });
  }
}

