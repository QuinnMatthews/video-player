export default {
	async fetch(request, env, ctx): Promise<Response> {
		// Get the path
		const path = new URL(request.url).pathname;

		// covert slashes to underscores
		const underscorePath = path.replace(/\//g, '_');

		// add video_ prefix to
		const videoPath = `video_${underscorePath}`;

		// Get video link from KV
		const videoLink = await env.VIDEOS.get(videoPath);
		console.log(videoPath);

		if (!videoLink) {
			return new Response('Video not found', { status: 404 });
		}

		return new Response(
`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Player</title>
    <script src="https://cdn.dashjs.org/latest/dash.all.min.js"></script>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #121212;
            margin: 0;
        }
        .video-container {
            max-width: 80%;
            width: 100%;
        }
        iframe {
            width: 100%;
            border-radius: 10px;
            box-shadow: 4px 4px 4px rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body>
    <div class="video-container">
        <div style="position: relative; padding-top: 56.25%;">
            <iframe
              src="${videoLink}">
              style="border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"
              allow="accelerometer; gyroscope; autoplay; encrypted-media;"
              allowfullscreen="true"
            ></iframe>
          </div>
        </div>
</body>
</html>
`,
			{
				headers: {
					'content-type': 'text/html;charset=UTF-8',
				},
			}
		);
	},
} satisfies ExportedHandler<Env>;
