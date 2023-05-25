export async function getRouteById(id) {
  console.log("Fetching route from: ", `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-route?routeId=${id}`);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-route?routeId=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    // TODO: Handle error
    throw new Error(res.statusText);
  }

  const data = await res.json();
  return data;
}

export async function saveRoute(routeObjects) {
  console.log("saving routeObjects:", routeObjects);

  const res = await fetch("/api/create-route", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ routeObjects }),
  });

  if (!res.ok) {
    // TODO: Show error message on screen
    const error = await res.json();
    throw new Error(error.message);
  }

  const { message, routeId } = await res.json();
  console.log(message, routeId);

  return { message, routeId };
}
