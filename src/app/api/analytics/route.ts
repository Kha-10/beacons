export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization ?? "",
      },
    });

    const data = await res.json();
    console.log("dataHAHA", data);

    return Response.json(data, { status: res.status });
  } catch (err) {
    console.log("err", err);

    return Response.json(
      { error: "Failed to connect to backend" },
      { status: 500 }
    );
  }
}
