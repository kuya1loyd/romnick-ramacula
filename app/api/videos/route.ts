import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { VideoReportItem } from "@/components/UploadVideoModal";

export async function GET() {
  try {
    const rows = (await sql`
      SELECT * FROM portfolio_videos ORDER BY created_at DESC
    `) as any[];

    const videos: VideoReportItem[] = rows.map((r) => ({
      id: r.id,
      title: r.title,
      subject: r.subject,
      date: r.date,
      duration: r.duration,
      description: r.description,
      instructor: r.instructor,
      videoUrl: r.video_url || undefined,
      fileName: r.file_name || undefined,
      fileSize: r.file_size || undefined,
      isLocalFile: Boolean(r.is_local_file),
      thumbnail: r.thumbnail || undefined,
    }));

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos from DB:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const item: VideoReportItem = await req.json();
    if (!item.id || !item.title) {
      return NextResponse.json({ error: "Invalid video report data" }, { status: 400 });
    }

    await sql`
      INSERT INTO portfolio_videos (
        id, title, subject, date, duration, description, instructor,
        video_url, file_name, file_size, is_local_file, thumbnail
      ) VALUES (
        ${item.id}, ${item.title}, ${item.subject}, ${item.date},
        ${item.duration}, ${item.description},
        ${item.instructor || 'Kerstan Isaac Requiza'},
        ${item.videoUrl || null}, ${item.fileName || null},
        ${item.fileSize || null}, ${item.isLocalFile || false},
        ${item.thumbnail || null}
      ) ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        subject = EXCLUDED.subject,
        date = EXCLUDED.date,
        duration = EXCLUDED.duration,
        description = EXCLUDED.description,
        instructor = EXCLUDED.instructor,
        video_url = EXCLUDED.video_url,
        file_name = EXCLUDED.file_name,
        file_size = EXCLUDED.file_size,
        is_local_file = EXCLUDED.is_local_file,
        thumbnail = EXCLUDED.thumbnail
    `;

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Error saving video report to DB:", error);
    return NextResponse.json({ error: "Failed to save video to cloud DB" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Video id is required" }, { status: 400 });
    }

    await sql`DELETE FROM portfolio_videos WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting video from DB:", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}

