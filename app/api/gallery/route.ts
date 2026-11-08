import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { JourneyItem } from "@/data/gallery";

export async function GET() {
  try {
    const rows = (await sql`
      SELECT * FROM portfolio_gallery ORDER BY created_at DESC
    `) as any[];

    const items: JourneyItem[] = rows.map((r) => ({
      id: r.id,
      title: r.title,
      meaning: r.meaning,
      description: r.description,
      date: r.date,
      location: r.location,
      tag: r.tag,
      photoUrl: r.photo_url,
      createdAt: new Date(r.created_at).getTime(),
    }));

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching gallery items from DB:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const item: JourneyItem = await req.json();
    if (!item.id || !item.title || !item.photoUrl) {
      return NextResponse.json({ error: "Invalid gallery item data" }, { status: 400 });
    }

    await sql`
      INSERT INTO portfolio_gallery (
        id, title, meaning, description, date, location, tag, photo_url
      ) VALUES (
        ${item.id}, ${item.title}, ${item.meaning}, ${item.description},
        ${item.date}, ${item.location}, ${item.tag}, ${item.photoUrl}
      ) ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        meaning = EXCLUDED.meaning,
        description = EXCLUDED.description,
        photo_url = EXCLUDED.photo_url
    `;

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Error saving gallery item to DB:", error);
    return NextResponse.json({ error: "Failed to save gallery item to cloud DB" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Gallery item id is required" }, { status: 400 });
    }

    await sql`DELETE FROM portfolio_gallery WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery item from DB:", error);
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
}

