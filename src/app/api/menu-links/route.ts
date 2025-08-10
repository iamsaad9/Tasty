import { NextResponse } from "next/server";
import MenuLink from "@/../models/menuLinks";  // fix import path if needed
import { connectDB } from "@/lib/mongoose";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || "user";

    const links = await MenuLink.find({
      roles: role,
    }).sort({ order: 1 });

    const processedLinks = links.map((link) => ({
      id: link.id || link._id.toString(),
      name: link.name,
      href: link.href,
      icon: link.icon,
      order: link.order,
      roles: link.roles || [],
    }));

    return NextResponse.json(processedLinks);
  } catch (error) {
    console.error("Error fetching menu links:", error);
    return NextResponse.json([], { status: 500 });
  }
}
