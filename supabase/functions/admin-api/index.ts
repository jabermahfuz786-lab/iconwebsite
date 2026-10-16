import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Admin-Password",
};

const ADMIN_PASSWORD = "myicon-admin-2024";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const url = new URL(req.url);
    const path = url.pathname.replace("/functions/v1/admin-api", "");
    const segments = path.split("/").filter(Boolean);
    const resource = segments[0] || "";

    // Admin auth check
    const authHeader = req.headers.get("Authorization") || "";
    const body = req.method === "POST" || req.method === "PUT" ? await req.json().catch(() => ({})) : {};
    const adminToken = body._admin_password || req.headers.get("X-Admin-Password") || authHeader.replace("Bearer ", "");
    if (adminToken !== ADMIN_PASSWORD) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    // GET /investors — list all investors for the dropdown
    if (req.method === "GET" && resource === "investors") {
      const { data, error } = await supabase
        .from("investors")
        .select("id, email, investor_code, full_name, is_active, user_id")
        .order("created_at", { ascending: false });
      if (error) return jsonResponse({ error: error.message }, 500);
      return jsonResponse({ investors: data });
    }

    // GET /projects — list all projects (including non-public) for admin
    if (req.method === "GET" && resource === "projects") {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return jsonResponse({ error: error.message }, 500);
      return jsonResponse({ projects: data });
    }

    // GET /investments — list all investments with investor name
    if (req.method === "GET" && resource === "investments") {
      const { data, error } = await supabase
        .from("investments")
        .select(`
          *,
          investors!inner(investor_code, full_name, email)
        `)
        .order("created_at", { ascending: false });
      if (error) return jsonResponse({ error: error.message }, 500);
      return jsonResponse({ investments: data });
    }

    // POST /investors — create a new investor + auth user
    if (req.method === "POST" && resource === "investors") {
      const { email, password, investor_code, full_name, phone, country, nominee_name, nominee_relation, nominee_phone, membership_level } = body;
      if (!email || !password || !investor_code || !full_name) {
        return jsonResponse({ error: "Missing required fields" }, 400);
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (authError) return jsonResponse({ error: `Auth error: ${authError.message}` }, 500);

      // Create investor record with user_id
      const { data: invData, error: invError } = await supabase
        .from("investors")
        .insert({
          email,
          investor_code,
          full_name,
          phone: phone || null,
          country: country || null,
          nominee_name: nominee_name || null,
          nominee_relation: nominee_relation || null,
          nominee_phone: nominee_phone || null,
          membership_level: membership_level || null,
          is_active: true,
          user_id: authData.user.id,
        })
        .select()
        .single();
      if (invError) {
        // Clean up auth user if investor record fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        return jsonResponse({ error: invError.message }, 500);
      }

      return jsonResponse({ investor: invData }, 201);
    }

    // POST /investments — create and assign an investment to an investor
    if (req.method === "POST" && resource === "investments") {
      const {
        investor_id,
        project_id,
        project_name,
        investment_amount,
        paid_amount,
        due_amount,
        currency,
        next_installment_date,
        next_installment_amount,
        profit_distributed,
        agreement_url,
        status,
        investor_project_id,
        expected_return_pct,
      } = body;

      if (!investor_id || !project_name) {
        return jsonResponse({ error: "Missing investor_id or project_name" }, 400);
      }

      // Verify the investor exists
      const { data: investor, error: invError } = await supabase
        .from("investors")
        .select("id, user_id, email")
        .eq("id", investor_id)
        .maybeSingle();
      if (invError) return jsonResponse({ error: invError.message }, 500);
      if (!investor) return jsonResponse({ error: "Investor not found" }, 404);

      const { data: invData, error: insertError } = await supabase
        .from("investments")
        .insert({
          investor_id,
          project_id: project_id || null,
          project_name,
          investment_amount: investment_amount || 0,
          paid_amount: paid_amount || 0,
          due_amount: due_amount || 0,
          currency: currency || "USD",
          next_installment_date: next_installment_date || null,
          next_installment_amount: next_installment_amount || null,
          profit_distributed: profit_distributed || 0,
          agreement_url: agreement_url || null,
          status: status || "active",
          investor_project_id: investor_project_id || null,
          expected_return_pct: expected_return_pct ?? null,
        })
        .select()
        .single();
      if (insertError) return jsonResponse({ error: insertError.message }, 500);

      return jsonResponse({ investment: invData }, 201);
    }

    // POST /projects — create or update a project
    if (req.method === "POST" && resource === "projects") {
      const { id, ...payload } = body;
      delete payload._admin_password;

      if (id) {
        // Update
        const { data, error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", id)
          .select()
          .single();
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse({ project: data });
      } else {
        // Create
        const { data, error } = await supabase
          .from("projects")
          .insert(payload)
          .select()
          .single();
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse({ project: data }, 201);
      }
    }

    // GET /investor-projects — the 8 portal projects (for admin dropdowns)
    if (req.method === "GET" && resource === "investor-projects") {
      const { data, error } = await supabase
        .from("investor_projects")
        .select("id, slug, name_bn, name_en, sort_order, status, progress_percent")
        .order("sort_order");
      if (error) return jsonResponse({ error: error.message }, 500);
      return jsonResponse({ projects: data });
    }

    // POST /investor-pin — set / reset an investor's PIN for one portal project (re-locks it)
    if (req.method === "POST" && resource === "investor-pin") {
      const { investor_id, investor_project_id, pin } = body;
      if (!investor_id || !investor_project_id || !pin) {
        return jsonResponse({ error: "Missing investor_id, investor_project_id or pin" }, 400);
      }
      const { error } = await supabase.rpc("admin_set_investor_pin", {
        p_investor_id: investor_id,
        p_investor_project_id: investor_project_id,
        p_pin: String(pin),
      });
      if (error) return jsonResponse({ error: error.message }, 400);
      return jsonResponse({ ok: true });
    }

    // POST /broadcast — notice to all investors (investor_project_id null) or to holders of one project
    if (req.method === "POST" && resource === "broadcast") {
      const { title, body: message, investor_project_id } = body;
      if (!title || !message) {
        return jsonResponse({ error: "Missing title or body" }, 400);
      }
      const { data, error } = await supabase
        .from("investor_notices")
        .insert({
          investor_id: null,
          investor_project_id: investor_project_id || null,
          title,
          body: message,
        })
        .select()
        .single();
      if (error) return jsonResponse({ error: error.message }, 500);
      return jsonResponse({ notice: data }, 201);
    }

    return jsonResponse({ error: "Not found" }, 404);
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
