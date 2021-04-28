const ray = require('raylib');

ray.InitWindow(800, 480, 'main');
ray.SetTargetFPS(30);

const font = ray.LoadFont('./fonts/arial.fnt');

const rec = { x: 100, y: 100, width: 600, height: 280 };

while (!ray.WindowShouldClose()) {
	const text = 'Hello world ' + new Date().getTime();

	ray.BeginDrawing();
	ray.ClearBackground(ray.BLACK);

	ray.DrawFPS(0, 0);

	ray.DrawRectangleLinesEx(rec, 1, ray.RED);

	ray.DrawTextRec(font, text, rec, 40, 1, true, ray.WHITE);

	ray.EndDrawing();
}

ray.CloseWindow();
