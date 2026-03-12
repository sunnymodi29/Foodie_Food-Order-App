export const runtime = "nodejs";

export async function GET(request, { params }) {
  const { userid } = await params;

  return Response.json({
    success: true,
    userid,
    message: "API route is working on Vercel"
  });
}