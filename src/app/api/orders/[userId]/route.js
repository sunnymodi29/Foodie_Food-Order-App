export const runtime = "nodejs";

export async function GET(request, { params }) {
  const { userId } = await params;

  return Response.json({
    success: true,
    userId,
    message: "API route is working on Vercel"
  });
}