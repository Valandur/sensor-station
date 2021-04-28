const ray = require('raylib');

ray.InitWindow(800, 480, 'main');
ray.SetTargetFPS(30);

const font = ray.LoadFont('./fonts/arial.fnt');

const rec = { x: 100, y: 100, width: 600, height: 280 };

let count = 0;
setInterval(() => count++, 100);

const main = async () => {
	while (!ray.WindowShouldClose()) {
		const text = 'Hello world: ' + count;

		ray.BeginDrawing();
		ray.ClearBackground(ray.BLACK);

		ray.DrawFPS(0, 0);

		ray.DrawRectangleLinesEx({ x: 100, y: 100, width: 600, height: 280 }, 1, ray.RED);

		ray.DrawTextRec(font, text, { x: 100, y: 100, width: 600, height: 280 }, 40, 1, true, ray.WHITE);

		ray.EndDrawing();

		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	ray.CloseWindow();
};

main();
