import { handleUpload } from '@vercel/blob/client';

const ADMIN_KEY = 'edicaoatenas2026@';

export default async function handler(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const { key } = JSON.parse(clientPayload || '{}');
        if (key !== ADMIN_KEY) {
          throw new Error('Não autorizado');
        }

        return {
          allowedContentTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg'],
          addRandomSuffix: true,
          maximumSizeInBytes: 500 * 1024 * 1024,
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('vídeo enviado:', blob.url);
      },
    });

    return Response.json(jsonResponse);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
