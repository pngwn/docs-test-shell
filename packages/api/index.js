addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
	const value = await SVELTE_DOCS.get("api:svelte:latest")
  return new Response(value, {
    headers: { 
			'content-type': 'application/json', 
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
		},
  })
}

// ENDPOINT/:type/:site

// k = api:svelte:1.0.0
// k = api:svelte:latest