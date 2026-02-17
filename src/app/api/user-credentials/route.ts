import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("user_credentials")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { service_name, service_url, username, password, notes } = body;

  if (!service_name) {
    return NextResponse.json({ error: "Service name is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("user_credentials")
    .insert({
      user_id: user.id,
      service_name,
      service_url: service_url || null,
      username: username || null,
      password: password || null,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, service_name, service_url, username, password, notes } = body;

  if (!id) return NextResponse.json({ error: "Credential ID is required" }, { status: 400 });
  if (!service_name) return NextResponse.json({ error: "Service name is required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("user_credentials")
    .update({
      service_name,
      service_url: service_url || null,
      username: username || null,
      password: password || null,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  let id = searchParams.get("id");

  if (!id) {
    try {
      const body = await req.json();
      id = body.id;
    } catch {}
  }

  if (!id) return NextResponse.json({ error: "Credential ID is required" }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("user_credentials")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
