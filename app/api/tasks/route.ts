import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { tasksData, Task } from "@/data/tasks";

export async function GET() {
  try {
    const rows = (await sql`
      SELECT * FROM portfolio_tasks ORDER BY created_at DESC
    `) as any[];

    if (!rows || rows.length === 0) {
      // Seed with initial tasks data
      for (const t of tasksData) {
        await sql`
          INSERT INTO portfolio_tasks (
            id, number, title, student, section, campus, instructor,
            category, subject, description, project_url, is_external_link,
            upload_date, preview_image, card_color
          ) VALUES (
            ${t.id}, ${t.number}, ${t.title}, ${t.student}, ${t.section},
            ${t.campus || 'NEMSU - Lianga Campus'}, ${t.instructor},
            ${t.category}, ${t.subject || ''}, ${t.description},
            ${t.projectUrl || null}, ${t.isExternalLink || false},
            ${t.uploadDate}, ${t.previewImage || null},
            ${JSON.stringify(t.cardColor)}
          ) ON CONFLICT (id) DO NOTHING
        `;
      }
      return NextResponse.json(tasksData);
    }

    const tasks: Task[] = rows.map((r) => ({
      id: r.id,
      number: r.number,
      title: r.title,
      student: r.student,
      section: r.section,
      campus: r.campus,
      instructor: r.instructor,
      category: r.category,
      subject: r.subject,
      description: r.description,
      pdfUrl: r.pdf_url || undefined,
      projectUrl: r.project_url || undefined,
      isExternalLink: Boolean(r.is_external_link),
      previewImage: r.preview_image || undefined,
      uploadDate: r.upload_date,
      fileSize: r.file_size || undefined,
      tags: ["BEEd-2C", "NEMSU", (r.subject || "Coursework").slice(0, 8)],
      cardColor: typeof r.card_color === "string" ? JSON.parse(r.card_color) : r.card_color,
    }));

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks from DB:", error);
    return NextResponse.json(tasksData);
  }
}

export async function POST(req: NextRequest) {
  try {
    const task: Task = await req.json();
    if (!task.id || !task.title) {
      return NextResponse.json({ error: "Invalid task data" }, { status: 400 });
    }

    await sql`
      INSERT INTO portfolio_tasks (
        id, number, title, student, section, campus, instructor,
        category, subject, description, pdf_url, project_url,
        is_external_link, upload_date, file_size, preview_image, card_color
      ) VALUES (
        ${task.id}, ${task.number}, ${task.title}, ${task.student},
        ${task.section}, ${task.campus || 'NEMSU - Lianga Campus'},
        ${task.instructor}, ${task.category}, ${task.subject || ''},
        ${task.description}, ${task.pdfUrl || null}, ${task.projectUrl || null},
        ${task.isExternalLink || false}, ${task.uploadDate},
        ${task.fileSize || null}, ${task.previewImage || null},
        ${JSON.stringify(task.cardColor)}
      ) ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        pdf_url = EXCLUDED.pdf_url,
        preview_image = EXCLUDED.preview_image
    `;

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to save task to cloud DB" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Task id is required" }, { status: 400 });
    }

    await sql`DELETE FROM portfolio_tasks WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}

