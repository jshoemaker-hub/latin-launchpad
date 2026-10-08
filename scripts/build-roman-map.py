#!/usr/bin/env python3
"""Build the classroom map of the Roman world.

Coastlines, rivers, and lakes are Natural Earth 1:10 million vectors.
Relief is a hillshade of NOAA ETOPO5. Both sources are public domain.

  Natural Earth: https://www.naturalearthdata.com/about/terms-of-use/
  ETOPO5: https://www.ngdc.noaa.gov/mgg/global/relief/ETOPO5/

The script downloads nothing by itself. Pass the extracted shapefiles and the
ETOPO5 grid, then it writes assets/roman-map.webp and refreshes the geometry
block in roman-world.js.

  python3 scripts/build-roman-map.py \
    --land /tmp/ne-data/land/ne_10m_land.shp \
    --rivers /tmp/ne-data/rivers/ne_10m_rivers_lake_centerlines.shp \
    --lakes /tmp/ne-data/lakes/ne_10m_lakes.shp \
    --etopo /tmp/ne-data/ETOPO5.DAT
"""

from __future__ import annotations

import argparse
import math
import re
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import shapefile

ROOT = Path(__file__).resolve().parents[1]
WORLD_JS = ROOT / 'roman-world.js'
WEBP_PATH = ROOT / 'assets' / 'roman-map.webp'

LOGICAL_W = 1000.0
LOGICAL_H = 640.0
SCALE = 2.8
WIDTH = int(LOGICAL_W * SCALE)
HEIGHT = int(LOGICAL_H * SCALE)
PAD_X = 34.0
PAD_Y = 28.0
CONTENT_W = LOGICAL_W - PAD_X * 2
CONTENT_H = LOGICAL_H - PAD_Y * 2

LON_MIN, LON_MAX = -12.8, 52.2
LAT_MIN, LAT_MAX = 22.6, 58.6
LON0 = 20.0
LAT0 = 39.0
LAT1 = 31.0
LAT2 = 47.0

RIVER_NAMES = {
    'nile', 'rhine', 'rhone', 'rhône', 'danube', 'po', 'ebro', 'tiber',
    'tigris', 'euphrates', 'thames', 'seine', 'loire', 'garonne', 'tagus',
    'tejo', 'guadalquivir', 'douro', 'duero', 'guadiana', 'meuse', 'elbe',
    'dniester', 'dnieper', 'don', 'jordan', 'orontes', 'kizilirmak',
    'kızılırmak', 'sakarya', 'maritsa', 'evros', 'vardar', 'axios', 'sava',
    'drava', 'tisza', 'inn', 'adige', 'arno', 'volturno', 'saone', 'saône',
    'kura', 'rioni', 'kuban', 'halys', 'meander', 'büyük menderes',
    'buyuk menderes', 'rubicon', 'rubicone'
}


def lambert_constants():
    phi1 = math.radians(LAT1)
    phi2 = math.radians(LAT2)
    phi0 = math.radians(LAT0)
    n = math.log(math.cos(phi1) / math.cos(phi2)) / math.log(
        math.tan(math.pi / 4 + phi2 / 2) / math.tan(math.pi / 4 + phi1 / 2)
    )
    f_const = math.cos(phi1) * (math.tan(math.pi / 4 + phi1 / 2) ** n) / n
    rho0 = f_const / (math.tan(math.pi / 4 + phi0 / 2) ** n)
    return n, f_const, rho0


N_CONST, F_CONST, RHO0 = lambert_constants()


def project(lon, lat):
    phi = np.radians(lat)
    lam = np.radians(lon)
    rho = F_CONST / (np.tan(np.pi / 4 + phi / 2) ** N_CONST)
    theta = N_CONST * (lam - math.radians(LON0))
    x = rho * np.sin(theta)
    y = RHO0 - rho * np.cos(theta)
    return x, y


def inverse_project(x, y):
    rho = np.sign(N_CONST) * np.hypot(x, RHO0 - y)
    theta = np.arctan2(x, RHO0 - y)
    lon = np.degrees(theta / N_CONST + math.radians(LON0))
    lat = np.degrees(2 * np.arctan((F_CONST / rho) ** (1 / N_CONST)) - np.pi / 2)
    return lon, lat


def projected_bounds():
    samples = []
    edge = np.linspace(0, 1, 80)
    for t in edge:
        samples.append((LON_MIN + t * (LON_MAX - LON_MIN), LAT_MIN))
        samples.append((LON_MIN + t * (LON_MAX - LON_MIN), LAT_MAX))
        samples.append((LON_MIN, LAT_MIN + t * (LAT_MAX - LAT_MIN)))
        samples.append((LON_MAX, LAT_MIN + t * (LAT_MAX - LAT_MIN)))
    xs, ys = project(*np.array(samples).T)
    return float(xs.min()), float(xs.max()), float(ys.min()), float(ys.max())


PROJ_MIN_X, PROJ_MAX_X, PROJ_MIN_Y, PROJ_MAX_Y = projected_bounds()


def to_pixel(x, y, scale=SCALE):
    lx = PAD_X + (x - PROJ_MIN_X) / (PROJ_MAX_X - PROJ_MIN_X) * CONTENT_W
    ly = PAD_Y + (PROJ_MAX_Y - y) / (PROJ_MAX_Y - PROJ_MIN_Y) * CONTENT_H
    return lx * scale, ly * scale


def clip_ring(points):
    def clip_edge(pts, inside, cross):
        if not pts:
            return []
        output = []
        previous = pts[-1]
        previous_in = inside(previous)
        for current in pts:
            current_in = inside(current)
            if current_in:
                if not previous_in:
                    output.append(cross(previous, current))
                output.append(current)
            elif previous_in:
                output.append(cross(previous, current))
            previous, previous_in = current, current_in
        return output

    def cross_vertical(a, b, lon):
        if a[0] == b[0]:
            return (lon, a[1])
        t = (lon - a[0]) / (b[0] - a[0])
        return (lon, a[1] + t * (b[1] - a[1]))

    def cross_horizontal(a, b, lat):
        if a[1] == b[1]:
            return (a[0], lat)
        t = (lat - a[1]) / (b[1] - a[1])
        return (a[0] + t * (b[0] - a[0]), lat)

    ring = list(points)
    ring = clip_edge(ring, lambda p: p[0] >= LON_MIN, lambda a, b: cross_vertical(a, b, LON_MIN))
    ring = clip_edge(ring, lambda p: p[0] <= LON_MAX, lambda a, b: cross_vertical(a, b, LON_MAX))
    ring = clip_edge(ring, lambda p: p[1] >= LAT_MIN, lambda a, b: cross_horizontal(a, b, LAT_MIN))
    ring = clip_edge(ring, lambda p: p[1] <= LAT_MAX, lambda a, b: cross_horizontal(a, b, LAT_MAX))
    return ring


def thin(points, minimum):
    if len(points) < 4:
        return points
    kept = [points[0]]
    for point in points[1:]:
        if abs(point[0] - kept[-1][0]) + abs(point[1] - kept[-1][1]) >= minimum:
            kept.append(point)
    if kept[-1] != points[-1]:
        kept.append(points[-1])
    return kept


def bbox_hits(points):
    lons = [point[0] for point in points]
    lats = [point[1] for point in points]
    return max(lons) >= LON_MIN and min(lons) <= LON_MAX and max(lats) >= LAT_MIN and min(lats) <= LAT_MAX


def rings_of(shape):
    parts = list(shape.parts) + [len(shape.points)]
    for index in range(len(shape.parts)):
        yield shape.points[parts[index]:parts[index + 1]]


def project_ring(ring):
    if len(ring) < 3 or not bbox_hits(ring):
        return []
    clipped = clip_ring(thin(ring, 0.012))
    if len(clipped) < 3:
        return []
    lon = np.array([point[0] for point in clipped])
    lat = np.array([point[1] for point in clipped])
    x, y = project(lon, lat)
    px, py = to_pixel(x, y)
    return list(zip(px.tolist(), py.tolist()))


def load_etopo(path):
    grid = np.fromfile(path, dtype='>i2')
    if grid.size != 2160 * 4320:
        raise SystemExit(f'ETOPO5 grid has {grid.size} values, expected {2160 * 4320}')
    return grid.reshape(2160, 4320)


def sample_etopo(grid, lat, lon):
    lon = np.where(lon < 0, lon + 360, lon)
    col = np.mod(np.rint(lon / (5 / 60)).astype(int), 4320)
    row = np.clip(np.rint((90 - lat) / (5 / 60)).astype(int), 0, 2159)
    return grid[row, col].astype(np.float32)


def hillshade(elevation):
    meters_per_pixel = 3_300.0
    exaggeration = 14.0
    dy, dx = np.gradient(elevation * exaggeration, meters_per_pixel)
    slope = np.arctan(np.hypot(dx, dy))
    aspect = np.arctan2(-dx, dy)
    azimuth = math.radians(315)
    altitude = math.radians(42)
    shaded = (
        math.cos(altitude) * np.cos(slope)
        + math.sin(altitude) * np.sin(slope) * np.cos(azimuth - aspect)
    )
    return np.clip(shaded, 0, 1)


def river_wanted(record):
    names = []
    for key in ('name_en', 'name', 'name_alt'):
        try:
            value = record[key]
        except (KeyError, IndexError):
            continue
        if value:
            names.append(str(value).strip().lower())
    return any(name in RIVER_NAMES or name.split(' (')[0] in RIVER_NAMES for name in names)


def draw_ring(draw, ring, fill=None, outline=None, width=1):
    if len(ring) < 3:
        return
    if fill is not None:
        draw.polygon(ring, fill=fill)
    if outline is not None:
        draw.line(ring + [ring[0]], fill=outline, width=width)


def blend(base, tint, amount):
    return tuple(int(base[channel] + (tint[channel] - base[channel]) * amount) for channel in range(3))


def build(land_path, rivers_path, lakes_path, etopo_path):
    grid = load_etopo(etopo_path)
    columns = np.arange(WIDTH)
    rows = np.arange(HEIGHT)
    logical_x = columns / SCALE
    logical_y = rows / SCALE
    gx = np.broadcast_to(logical_x, (HEIGHT, WIDTH))
    gy = logical_y[:, None]
    proj_x = PROJ_MIN_X + (gx - PAD_X) / CONTENT_W * (PROJ_MAX_X - PROJ_MIN_X)
    proj_y = PROJ_MAX_Y - (gy - PAD_Y) / CONTENT_H * (PROJ_MAX_Y - PROJ_MIN_Y)
    inside = (
        (gx >= PAD_X) & (gx <= LOGICAL_W - PAD_X)
        & (gy >= PAD_Y) & (gy <= LOGICAL_H - PAD_Y)
    )
    lon, lat = inverse_project(proj_x, proj_y)
    elevation = np.zeros((HEIGHT, WIDTH), dtype=np.float32)
    elevation[inside] = sample_etopo(grid, lat[inside], lon[inside])
    shade = hillshade(elevation)

    paper = np.array([236, 224, 196], dtype=np.float32)
    shallow = np.array([198, 206, 190], dtype=np.float32)
    deep = np.array([118, 142, 140], dtype=np.float32)
    depth = np.clip(-elevation / 4200.0, 0, 1) ** 0.65
    sea = shallow * (1 - depth[..., None]) + deep * depth[..., None]
    sea *= (0.94 + 0.06 * shade)[..., None]

    image = np.empty((HEIGHT, WIDTH, 3), dtype=np.float32)
    image[:] = paper
    image[inside] = sea[inside]
    raster = Image.fromarray(np.clip(image, 0, 255).astype(np.uint8), 'RGB')
    draw = ImageDraw.Draw(raster)

    land_fill = (214, 186, 132)
    land_rings = []
    land_reader = shapefile.Reader(str(land_path))
    for shape in land_reader.shapes():
        for ring in rings_of(shape):
            projected = project_ring(ring)
            if len(projected) >= 3:
                land_rings.append(projected)
                draw_ring(draw, projected, fill=land_fill)
    print(f'land rings drawn: {len(land_rings)}')

    land_mask = np.zeros((HEIGHT, WIDTH), dtype=bool)
    mask_image = Image.new('L', (WIDTH, HEIGHT), 0)
    mask_draw = ImageDraw.Draw(mask_image)
    for ring in land_rings:
        mask_draw.polygon(ring, fill=255)
    land_mask = np.array(mask_image) > 0
    land_mask &= inside

    high = np.clip(elevation / 2800.0, 0, 1)
    parchment = np.array([236, 214, 168], dtype=np.float32)
    upland = np.array([154, 112, 68], dtype=np.float32)
    lowland = np.array([214, 196, 150], dtype=np.float32)
    tint = lowland * (1 - high[..., None]) + upland * high[..., None]
    tint = tint * 0.28 + parchment * 0.72
    relief = 0.84 + (shade - 0.5) * 0.28
    tint *= relief[..., None]
    colored = np.array(raster).astype(np.float32)
    colored[land_mask] = tint[land_mask]
    raster = Image.fromarray(np.clip(colored, 0, 255).astype(np.uint8), 'RGB')
    draw = ImageDraw.Draw(raster)

    lake_color = (168, 184, 176)
    lake_edge = (92, 108, 108)
    lakes_drawn = 0
    lake_reader = shapefile.Reader(str(lakes_path))
    lake_fields = {field[0] for field in lake_reader.fields}
    for shape, record in zip(lake_reader.shapes(), lake_reader.records()):
        rank = record['scalerank'] if 'scalerank' in lake_fields else 9
        if rank is not None and rank > 4:
            continue
        for ring in rings_of(shape):
            projected = project_ring(ring)
            if len(projected) < 3:
                continue
            xs = [point[0] for point in projected]
            ys = [point[1] for point in projected]
            if max(xs) - min(xs) < 4 and max(ys) - min(ys) < 4:
                continue
            draw_ring(draw, projected, fill=lake_color, outline=lake_edge, width=1)
            lakes_drawn += 1
    print(f'lakes drawn: {lakes_drawn}')

    river_color = (78, 108, 116)
    rivers_drawn = 0
    river_reader = shapefile.Reader(str(rivers_path))
    for shape, record in zip(river_reader.shapes(), river_reader.records()):
        if not river_wanted(record):
            continue
        for ring in rings_of(shape):
            if len(ring) < 2 or not bbox_hits(ring):
                continue
            clipped = clip_ring(thin(ring, 0.02))
            if len(clipped) < 2:
                continue
            lon = np.array([point[0] for point in clipped])
            lat = np.array([point[1] for point in clipped])
            x, y = project(lon, lat)
            px, py = to_pixel(x, y)
            line = list(zip(px.tolist(), py.tolist()))
            draw.line(line, fill=river_color, width=max(2, int(round(SCALE * 0.8))))
            rivers_drawn += 1
    print(f'river parts drawn: {rivers_drawn}')

    coast = (86, 58, 36)
    for ring in land_rings:
        draw.line(ring + [ring[0]], fill=coast, width=max(2, int(round(SCALE))))

    vignette = np.array(raster).astype(np.float32)
    yy = np.linspace(-1, 1, HEIGHT)[:, None]
    xx = np.linspace(-1, 1, WIDTH)[None, :]
    falloff = np.clip(1 - (xx * xx * 0.10 + yy * yy * 0.12), 0.86, 1)
    vignette *= falloff[..., None]
    raster = Image.fromarray(np.clip(vignette, 0, 255).astype(np.uint8), 'RGB')
    raster = raster.filter(ImageFilter.SMOOTH)
    draw = ImageDraw.Draw(raster)

    margin = int(10 * SCALE)
    outer = (92, 58, 32)
    inner = (232, 214, 176)
    draw.rectangle((6, 6, WIDTH - 7, HEIGHT - 7), outline=outer, width=max(4, int(3 * SCALE)))
    draw.rectangle((margin, margin, WIDTH - margin - 1, HEIGHT - margin - 1), outline=inner, width=max(2, int(SCALE)))
    draw.rectangle((margin + 5, margin + 5, WIDTH - margin - 6, HEIGHT - margin - 6), outline=outer, width=2)

    draw_compass(draw)
    draw_cartouche(draw)

    WEBP_PATH.parent.mkdir(parents=True, exist_ok=True)
    raster.save(WEBP_PATH, 'WEBP', quality=72, method=6)
    print(f'wrote {WEBP_PATH} ({WEBP_PATH.stat().st_size} bytes)')
    write_geometry()


def draw_compass(draw):
    cx, cy = to_pixel(*project(-9.6, 33.4))
    radius = 34 * SCALE
    gold = (122, 78, 36)
    pale = (245, 232, 204)
    dark = (74, 48, 28)
    draw.ellipse((cx - radius - 4, cy - radius - 4, cx + radius + 4, cy + radius + 4), outline=gold, width=2)
    points = []
    for step in range(8):
        angle = -math.pi / 2 + step * math.pi / 4
        length = radius if step % 2 == 0 else radius * 0.42
        points.append((cx + math.cos(angle) * length, cy + math.sin(angle) * length))
    for step in range(8):
        end = points[step]
        color = dark if step % 2 == 0 else gold
        draw.polygon(( (cx, cy), points[step - 1], end ), fill=pale if step % 2 else color)
    draw.polygon(((cx, cy - radius), (cx - 8, cy), (cx, cy - 6), (cx + 8, cy)), fill=dark)
    font = ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf', int(16 * SCALE))
    draw.text((cx - 6, cy - radius - 22 * SCALE), 'N', font=font, fill=dark)


def draw_cartouche(draw):
    cx, cy = to_pixel(*project(-1.2, 25.4))
    width = 210 * SCALE
    height = 78 * SCALE
    box = (cx - width / 2, cy - height / 2, cx + width / 2, cy + height / 2)
    paper = (244, 232, 204)
    ink = (78, 50, 30)
    draw.rounded_rectangle(box, radius=14, fill=paper, outline=ink, width=3)
    draw.rounded_rectangle(
        (box[0] + 6, box[1] + 6, box[2] - 6, box[3] - 6),
        radius=10,
        outline=(168, 124, 72),
        width=2
    )
    title_font = ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf', int(22 * SCALE))
    sub_font = ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf', int(13 * SCALE))
    title = 'Orbis Romanus'
    subtitle = 'A classroom map'
    title_w = draw.textlength(title, font=title_font)
    sub_w = draw.textlength(subtitle, font=sub_font)
    draw.text((cx - title_w / 2, cy - 24 * SCALE), title, font=title_font, fill=ink)
    draw.text((cx - sub_w / 2, cy + 4 * SCALE), subtitle, font=sub_font, fill=ink)


def write_geometry():
    check_lon, check_lat = 12.496, 41.903
    px, py = to_pixel(*project(check_lon, check_lat), scale=1)
    block = f"""/* roman-map-geometry:start */
const ROMAN_MAP_GEOMETRY = {{
  width: {LOGICAL_W:.0f},
  height: {LOGICAL_H:.0f},
  padX: {PAD_X:.1f},
  padY: {PAD_Y:.1f},
  contentW: {CONTENT_W:.1f},
  contentH: {CONTENT_H:.1f},
  lon0: {LON0:.1f},
  lat0: {LAT0:.1f},
  lat1: {LAT1:.1f},
  lat2: {LAT2:.1f},
  projMinX: {PROJ_MIN_X:.8f},
  projMaxX: {PROJ_MAX_X:.8f},
  projMinY: {PROJ_MIN_Y:.8f},
  projMaxY: {PROJ_MAX_Y:.8f},
  checkLon: {check_lon:.3f},
  checkLat: {check_lat:.3f},
  checkX: {px:.2f},
  checkY: {py:.2f},
  imageWidth: {WIDTH},
  imageHeight: {HEIGHT},
  image: 'assets/roman-map.webp'
}};
/* roman-map-geometry:end */"""
    source = WORLD_JS.read_text()
    updated, count = re.subn(
        r'/\* roman-map-geometry:start \*/[\s\S]*?/\* roman-map-geometry:end \*/',
        block,
        source,
        count=1
    )
    if count != 1:
        raise SystemExit('roman-world.js is missing the roman-map-geometry block')
    WORLD_JS.write_text(updated)
    print(f'geometry check Rome -> {px:.2f}, {py:.2f}')


def main():
    parser = argparse.ArgumentParser(description='Build the Roman world classroom map')
    parser.add_argument('--land', required=True)
    parser.add_argument('--rivers', required=True)
    parser.add_argument('--lakes', required=True)
    parser.add_argument('--etopo', required=True)
    args = parser.parse_args()
    build(args.land, args.rivers, args.lakes, args.etopo)


if __name__ == '__main__':
    main()
