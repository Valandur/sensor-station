#include "raylib.h"

struct Message
{
	char text[64];
	float size;
	Vector2 pos;
	Color color;
};

struct Message msgs[20];

int main(void)
{
	const int screenWidth = 800;
	const int screenHeight = 480;

	strcpy(msgs[0].text, "Hello there, how are you doing?");
	msgs[0].size = 60.0f;
	msgs[0].pos.x = 100;
	msgs[0].pos.y = 100;
	msgs[0].color = WHITE;

	InitWindow(screenWidth, screenHeight, "main");

	Font fontTtf = LoadFontEx("../../fonts/arial.ttf", 100, 0, 250);

	SetTargetFPS(10);

	while (!WindowShouldClose())
	{
		BeginDrawing();

		ClearBackground(BLACK);

		DrawTextEx(fontTtf, msgs[0].text, msgs[0].pos, msgs[0].size, 2, msgs[0].color);

		EndDrawing();
	}

	UnloadFont(fontTtf);

	CloseWindow();

	return 0;
}
