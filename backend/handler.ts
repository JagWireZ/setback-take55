import { router } from "./router";

export const handler = async (request: Request): Promise<Response> => {
  try {
    const body = await request.json();
    const { action, auth, payload } = body ?? {};

    if (!action) {
      return new Response(
        JSON.stringify({ error: "Missing 'action' field" }),
        { status: 400 }
      );
    }

    const result = await router(action, { auth, payload });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "content-type": "application/json" }
    });

  } catch (err: any) {
    console.error("Lambda error:", err);

    return new Response(
      JSON.stringify({ error: err?.message ?? "Internal server error" }),
      { status: 500 }
    );
  }
};
