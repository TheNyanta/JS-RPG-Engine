function DrawMap()
{
    mapIndex = 0;

    for (var y = 0; y < mapHeight; y++)
    {
        for (var x = 0; x < mapWidth; x++, mapIndex++)
        {
            var tile_x = x * tileWidth;
            var tile_y = y * tileHeight;
            var tileType = map[mapIndex];
            if (tileType == 0) grass.draw(tile_x, tile_y);
            else
                stone.draw(tile_x, tile_y);
        }
    }
}