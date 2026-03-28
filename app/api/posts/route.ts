import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json(
      { message: "Supabase の環境変数が設定されていません。" },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "JSON ボディが不正です。" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "リクエストが不正です。" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const category = typeof b.category === "string" ? b.category.trim() : "";
  const title = typeof b.title === "string" ? b.title.trim() : "";
  const salaryRaw = b.salary;

  if (!title) {
    return NextResponse.json({ message: "タイトルを入力してください。" }, { status: 400 });
  }
  if (!category) {
    return NextResponse.json({ message: "カテゴリを選択してください。" }, { status: 400 });
  }

  let salary_man: number | null = null;
  if (salaryRaw !== undefined && salaryRaw !== null && salaryRaw !== "") {
    const n = typeof salaryRaw === "number" ? salaryRaw : Number(salaryRaw);
    if (!Number.isFinite(n) || n <= 0) {
      return NextResponse.json(
        { message: "年収（万円）は正の数で入力してください。" },
        { status: 400 },
      );
    }
    salary_man = Math.floor(n);
  }

  const supabase = createClient(url, key);
  const { error } = await supabase.from("jobs").insert({
    title,
    category,
    salary_man,
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
