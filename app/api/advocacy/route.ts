import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { AdvocacyItem } from "@/components/UploadAdvocacyModal";

export async function GET() {
  try {
    const rows = (await sql`
      SELECT * FROM portfolio_advocacy ORDER BY created_at DESC
    `) as any[];

    const advocacies: AdvocacyItem[] = rows.map((r) => ({
      id: r.id,
      title: r.title,
      focus: r.focus,
      description: r.description,
      iconName: r.icon_name || "Heart",
      date: r.date,
    }));

    return NextResponse.json(advocacies);
  } catch (error) {
    console.error("Error fetching advocacies from DB:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const item: AdvocacyItem = await req.json();
    if (!item.id || !item.title) {
      return NextResponse.json({ error: "Invalid advocacy data" }, { status: 400 });
    }

    await sql`
      INSERT INTO portfolio_advocacy (
        id, title, focus, description, icon_name, date
      ) VALUES (
        ${item.id}, ${item.title}, ${item.focus}, ${item.description},
        ${item.iconName || 'Heart'}, ${item.date}
      ) ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        focus = EXCLUDED.focus,
        description = EXCLUDED.description,
        icon_name = EXCLUDED.icon_name
    `;

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Error saving advocacy item to DB:", error);
    return NextResponse.json({ error: "Failed to save advocacy to cloud DB" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Advocacy id is required" }, { status: 400 });
    }

    await sql`DELETE FROM portfolio_advocacy WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting advocacy from DB:", error);
    return NextResponse.json({ error: "Failed to delete advocacy" }, { status: 500 });
  }
}

