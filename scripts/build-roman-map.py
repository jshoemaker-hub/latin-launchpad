#!/usr/bin/env python3
"""Build the classroom map of the Roman world.

Coastlines, rivers, and lakes are Natural Earth 1:10 million vectors.
Relief is a hillshade of NOAA ETOPO1 (1 arc-minute, public domain), bilinearly
resampled and lightly smoothed so a close view does not show the grid steps.
ETOPO5 is still accepted if that is the file you pass.

  Natural Earth: https://www.naturalearthdata.com/about/terms-of-use/
  ETOPO1: https://www.ngdc.noaa.gov/mgg/global/global.html

The script downloads nothing by itself. Pass the extracted shapefiles and the
elevation grid, then it writes the parchment WebP files and refreshes the
geometry block in roman-world.js.

  python3 scripts/build-roman-map.py \
    --land /tmp/ne-data/land/ne_10m_land.shp \
    --rivers /tmp/ne-data/rivers/ne_10m_rivers_lake_centerlines.shp \
    --lakes /tmp/ne-data/lakes/ne_10m_lakes.shp \
    --etopo /tmp/ne-data/etopo1_ice_g_i2.bin
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
PAD_X = 18.0
PAD_Y = 16.0
CONTENT_W = LOGICAL_W - PAD_X * 2
CONTENT_H = LOGICAL_H - PAD_Y * 2

LON_MIN, LON_MAX = -12.8, 52.2
LAT_MIN, LAT_MAX = 22.6, 58.6
LON0 = 20.0
LAT0 = 39.0
LAT1 = 31.0
LAT2 = 47.0

# Names drawn on the close Italy sheet. The full map keeps the longer list.
ITALY_RIVER_NAMES = {
    'po', 'fiume po', 'tiber', 'tevere', 'arno', 'fiume arno', 'rubicon', 'rubicone'
}

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


# ox, oy, sx, sy are the logical window. pw, ph are output pixels.
# decor draws the compass and cartouche used on the full sheet.
ACTIVE_SHEET = {
    'ox': 0.0,
    'oy': 0.0,
    'sx': LOGICAL_W,
    'sy': LOGICAL_H,
    'pw': WIDTH,
    'ph': HEIGHT,
    'decor': True,
}


def to_pixel(x, y, scale=SCALE):
    lx = PAD_X + (x - PROJ_MIN_X) / (PROJ_MAX_X - PROJ_MIN_X) * CONTENT_W
    ly = PAD_Y + (PROJ_MAX_Y - y) / (PROJ_MAX_Y - PROJ_MIN_Y) * CONTENT_H
    if scale == 1:
        return lx, ly
    sheet = ACTIVE_SHEET
    return (
        (lx - sheet['ox']) / sheet['sx'] * sheet['pw'],
        (ly - sheet['oy']) / sheet['sy'] * sheet['ph'],
    )


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


def boundary_edges(point):
    lon, lat = point
    edges = set()
    if abs(lon - LON_MIN) < 1e-4:
        edges.add('west')
    if abs(lon - LON_MAX) < 1e-4:
        edges.add('east')
    if abs(lat - LAT_MIN) < 1e-4:
        edges.add('south')
    if abs(lat - LAT_MAX) < 1e-4:
        edges.add('north')
    return edges


def densify_boundary(points, step=0.12):
    """Follow clip edges in lon/lat so a parallel does not become one straight chord.

    The closing edge matters: Sutherland-Hodgman leaves the ring unclosed, and
    that last segment is often the long edge along the map border.
    """
    if len(points) < 2:
        return points
    sequence = list(points)
    if sequence[0] != sequence[-1]:
        sequence.append(sequence[0])
    output = [sequence[0]]
    for current in sequence[1:]:
        previous = output[-1]
        shared = boundary_edges(previous) & boundary_edges(current)
        span = max(abs(current[0] - previous[0]), abs(current[1] - previous[1]))
        if shared and span > step:
            pieces = int(span / step)
            for index in range(1, pieces):
                t = index / pieces
                output.append((
                    previous[0] + t * (current[0] - previous[0]),
                    previous[1] + t * (current[1] - previous[1])
                ))
        output.append(current)
    if len(output) > 1 and output[-1] == output[0]:
        output.pop()
    return output


def signed_area(ring):
    area = 0.0
    for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1]):
        area += x1 * y2 - x2 * y1
    return area / 2.0


def project_ring(ring, minimum=0.012):
    if len(ring) < 3 or not bbox_hits(ring):
        return []
    clipped = densify_boundary(clip_ring(thin(ring, minimum)))
    if len(clipped) < 3:
        return []
    lon = np.array([point[0] for point in clipped])
    lat = np.array([point[1] for point in clipped])
    x, y = project(lon, lat)
    px, py = to_pixel(x, y)
    return list(zip(px.tolist(), py.tolist()))


def load_etopo(path):
    size = Path(path).stat().st_size
    etopo1 = 10801 * 21601 * 2
    etopo5 = 2160 * 4320 * 2
    if size == etopo1:
        grid = np.memmap(path, dtype='<i2', mode='r', shape=(10801, 21601))
        return {
            'grid': grid,
            'rows': 10801,
            'cols': 21601,
            'lat0': 90.0,
            'lon0': -180.0,
            'step': 1.0 / 60.0,
            'name': 'ETOPO1'
        }
    if size == etopo5:
        raw = np.fromfile(path, dtype='>i2')
        return {
            'grid': raw.reshape(2160, 4320),
            'rows': 2160,
            'cols': 4320,
            'lat0': 90.0,
            'lon0': 0.0,
            'step': 5.0 / 60.0,
            'name': 'ETOPO5'
        }
    raise SystemExit(f'{path} is {size} bytes, not an ETOPO1 or ETOPO5 grid')


def sample_etopo(dem, lat, lon):
    """Bilinear sample. Row 0 is the northern edge of the grid."""
    if dem['name'] == 'ETOPO5':
        lon = np.where(lon < 0, lon + 360, lon)
        col = np.mod(np.rint(lon / dem['step']).astype(int), dem['cols'])
        row = np.clip(np.rint((90 - lat) / dem['step']).astype(int), 0, dem['rows'] - 1)
        return dem['grid'][row, col].astype(np.float32)
    grid = dem['grid']
    step = dem['step']
    x = (lon - dem['lon0']) / step
    y = (dem['lat0'] - lat) / step
    x0 = np.floor(x).astype(np.int32)
    y0 = np.floor(y).astype(np.int32)
    x1 = x0 + 1
    y1 = y0 + 1
    max_col = dem['cols'] - 1
    max_row = dem['rows'] - 1
    x0c = np.clip(x0, 0, max_col)
    x1c = np.clip(x1, 0, max_col)
    y0c = np.clip(y0, 0, max_row)
    y1c = np.clip(y1, 0, max_row)
    fx = np.clip(x - x0, 0, 1).astype(np.float32)
    fy = np.clip(y - y0, 0, 1).astype(np.float32)
    values = (
        grid[y0c, x0c].astype(np.float32) * (1 - fx) * (1 - fy)
        + grid[y0c, x1c].astype(np.float32) * fx * (1 - fy)
        + grid[y1c, x0c].astype(np.float32) * (1 - fx) * fy
        + grid[y1c, x1c].astype(np.float32) * fx * fy
    )
    return np.where(values < -30000, 0, values).astype(np.float32)


def blur_elevation(elevation, sigma):
    radius = max(1, int(round(sigma * 3)))
    axis = np.arange(-radius, radius + 1, dtype=np.float32)
    kernel = np.exp(-0.5 * (axis / sigma) ** 2)
    kernel /= kernel.sum()
    padded = np.pad(elevation, ((0, 0), (radius, radius)), mode='edge')
    windows = np.lib.stride_tricks.sliding_window_view(padded, kernel.size, axis=1)
    horizontal = windows @ kernel
    padded = np.pad(horizontal, ((radius, radius), (0, 0)), mode='edge')
    windows = np.lib.stride_tricks.sliding_window_view(padded, kernel.size, axis=0)
    return windows @ kernel


def hillshade(elevation, meters_per_pixel):
    exaggeration = 5.5
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


def river_names(record):
    names = []
    for key in ('name_en', 'name', 'name_alt'):
        try:
            value = record[key]
        except (KeyError, IndexError):
            continue
        if value:
            names.append(str(value).strip().lower())
    return names


def river_wanted(record, allowed):
    names = river_names(record)
    return any(name in allowed or name.split(' (')[0] in allowed for name in names)


def draw_tapered_line(draw, points, color, width_start, width_end):
    if len(points) < 2:
        return
    lengths = [0.0]
    for start, end in zip(points, points[1:]):
        lengths.append(lengths[-1] + math.hypot(end[0] - start[0], end[1] - start[1]))
    total = lengths[-1]
    if total < 1:
        return
    for index, (start, end) in enumerate(zip(points, points[1:])):
        t = lengths[index] / total
        width = max(1, int(round(width_start + (width_end - width_start) * t)))
        draw.line((start, end), fill=color, width=width)


def draw_ring(draw, ring, fill=None, outline=None, width=1):
    if len(ring) < 3:
        return
    if fill is not None:
        draw.polygon(ring, fill=fill)
    if outline is not None:
        draw.line(ring + [ring[0]], fill=outline, width=width)


def blend(base, tint, amount):
    return tuple(int(base[channel] + (tint[channel] - base[channel]) * amount) for channel in range(3))


def render_sheet(dem, land_path, rivers_path, lakes_path, sheet, out_path):
    global ACTIVE_SHEET
    # Draw at twice the saved size, then resample. That antialiases the vectors.
    oversample = 2
    saved_sheet = dict(sheet)
    sheet = dict(sheet)
    sheet['pw'] = int(sheet['pw']) * oversample
    sheet['ph'] = int(sheet['ph']) * oversample
    ACTIVE_SHEET = sheet
    width = int(sheet['pw'])
    height = int(sheet['ph'])
    columns = np.arange(width)
    rows = np.arange(height)
    logical_x = sheet['ox'] + (columns + 0.5) / width * sheet['sx']
    logical_y = sheet['oy'] + (rows + 0.5) / height * sheet['sy']
    gx = np.broadcast_to(logical_x, (height, width))
    gy = logical_y[:, None]
    proj_x = PROJ_MIN_X + (gx - PAD_X) / CONTENT_W * (PROJ_MAX_X - PROJ_MIN_X)
    proj_y = PROJ_MAX_Y - (gy - PAD_Y) / CONTENT_H * (PROJ_MAX_Y - PROJ_MIN_Y)
    inside = (
        (gx >= PAD_X) & (gx <= LOGICAL_W - PAD_X)
        & (gy >= PAD_Y) & (gy <= LOGICAL_H - PAD_Y)
    )
    lon, lat = inverse_project(proj_x, proj_y)
    elevation = np.zeros((height, width), dtype=np.float32)
    elevation[inside] = sample_etopo(dem, lat[inside], lon[inside])
    elevation = blur_elevation(elevation, 1.6)
    mid = height // 2
    center = width // 2
    dlat = abs(float(lat[mid, center] - lat[min(mid + 1, height - 1), center]))
    dlon = abs(float(lon[mid, min(center + 1, width - 1)] - lon[mid, center]))
    meters = 111_320.0 * math.hypot(dlat, dlon * math.cos(math.radians(float(lat[mid, center]))))
    shade = hillshade(elevation, max(meters, 40.0))
    print(f'relief {dem["name"]} {width}x{height}, {meters:.0f} m/px')

    paper = np.array([244, 224, 186], dtype=np.float32)
    shallow = np.array([190, 198, 176], dtype=np.float32)
    deep = np.array([112, 136, 126], dtype=np.float32)
    depth = np.clip(-elevation / 4200.0, 0, 1) ** 0.65
    sea = shallow * (1 - depth[..., None]) + deep * depth[..., None]
    sea *= (0.94 + 0.06 * shade)[..., None]

    image = np.empty((height, width, 3), dtype=np.float32)
    image[:] = paper
    image[inside] = sea[inside]
    raster = Image.fromarray(np.clip(image, 0, 255).astype(np.uint8), 'RGB')
    draw = ImageDraw.Draw(raster)

    coast_step = 0.004 if not sheet['decor'] else 0.012
    land_fill = (226, 196, 142)
    land_shells = []
    land_holes = []
    land_reader = shapefile.Reader(str(land_path))
    for shape in land_reader.shapes():
        source_rings = list(rings_of(shape))
        if not source_rings:
            continue
        shell_area = max((signed_area(ring) for ring in source_rings), key=lambda value: abs(value))
        shell_sign = 1 if shell_area >= 0 else -1
        for ring in source_rings:
            area = signed_area(ring)
            if abs(area) < 0.05:
                continue
            projected = project_ring(ring, coast_step)
            if len(projected) < 3:
                continue
            if area == 0 or (area > 0) == (shell_sign > 0):
                land_shells.append(projected)
                draw_ring(draw, projected, fill=land_fill)
            else:
                land_holes.append(projected)
    print(f'land shells {len(land_shells)}, holes {len(land_holes)}')

    land_mask = np.zeros((height, width), dtype=bool)
    mask_image = Image.new('L', (width, height), 0)
    mask_draw = ImageDraw.Draw(mask_image)
    for ring in land_shells:
        mask_draw.polygon(ring, fill=255)
    for ring in land_holes:
        mask_draw.polygon(ring, fill=0)
    land_mask = np.array(mask_image) > 0
    land_mask &= inside

    high = np.clip(elevation / 2800.0, 0, 1)
    parchment = np.array([244, 214, 164], dtype=np.float32)
    upland = np.array([168, 116, 64], dtype=np.float32)
    lowland = np.array([228, 202, 148], dtype=np.float32)
    tint = lowland * (1 - high[..., None]) + upland * high[..., None]
    tint = tint * 0.28 + parchment * 0.72
    relief = 0.84 + (shade - 0.5) * 0.28
    tint *= relief[..., None]
    colored = np.array(raster).astype(np.float32)
    colored[land_mask] = tint[land_mask]
    raster = Image.fromarray(np.clip(colored, 0, 255).astype(np.uint8), 'RGB')
    draw = ImageDraw.Draw(raster)

    hole_sea = sea.copy()
    hole_mask_image = Image.new('L', (width, height), 0)
    hole_draw = ImageDraw.Draw(hole_mask_image)
    for ring in land_holes:
        hole_draw.polygon(ring, fill=255)
    hole_mask = (np.array(hole_mask_image) > 0) & inside
    colored[hole_mask] = hole_sea[hole_mask]
    raster = Image.fromarray(np.clip(colored, 0, 255).astype(np.uint8), 'RGB')
    draw = ImageDraw.Draw(raster)

    lake_color = (176, 190, 174)
    lake_edge = (120, 108, 84)
    lakes_drawn = 0
    lake_reader = shapefile.Reader(str(lakes_path))
    lake_fields = {field[0] for field in lake_reader.fields}
    for shape, record in zip(lake_reader.shapes(), lake_reader.records()):
        rank = record['scalerank'] if 'scalerank' in lake_fields else 9
        if rank is not None and rank > 4:
            continue
        for ring in rings_of(shape):
            projected = project_ring(ring, coast_step)
            if len(projected) < 3:
                continue
            xs = [point[0] for point in projected]
            ys = [point[1] for point in projected]
            min_span = 4 * oversample
            if max(xs) - min(xs) < min_span and max(ys) - min(ys) < min_span:
                continue
            draw_ring(draw, projected, fill=lake_color, outline=lake_edge, width=oversample)
            lakes_drawn += 1
    print(f'lakes drawn: {lakes_drawn}')

    river_color = (118, 146, 142) if not sheet['decor'] else (90, 118, 116)
    river_names_allowed = ITALY_RIVER_NAMES if sheet.get('rivers') == 'italy' else RIVER_NAMES
    rivers_drawn = 0
    river_reader = shapefile.Reader(str(rivers_path))
    for shape, record in zip(river_reader.shapes(), river_reader.records()):
        if not river_wanted(record, river_names_allowed):
            continue
        for ring in rings_of(shape):
            if len(ring) < 2 or not bbox_hits(ring):
                continue
            clipped = densify_boundary(clip_ring(thin(ring, 0.008 if not sheet['decor'] else 0.02)))
            if len(clipped) < 2:
                continue
            lon_values = np.array([point[0] for point in clipped])
            lat_values = np.array([point[1] for point in clipped])
            x, y = project(lon_values, lat_values)
            px, py = to_pixel(x, y)
            line = list(zip(px.tolist(), py.tolist()))
            if sheet['decor']:
                draw.line(line, fill=river_color, width=oversample * 2)
            else:
                ends = sample_etopo(dem, lat_values[[0, -1]], lon_values[[0, -1]])
                mouth = oversample * 1.35
                source = oversample * 0.5
                if float(ends[0]) <= float(ends[-1]):
                    draw_tapered_line(draw, line, river_color, mouth, source)
                else:
                    draw_tapered_line(draw, line, river_color, source, mouth)
            rivers_drawn += 1
    if sheet.get('rivers') == 'italy':
        # Natural Earth 10m includes the Po and the Tiber, not the Arno or the Rubicon.
        extra = [
            [(11.66, 43.86), (11.71, 43.80), (11.77, 43.72), (11.74, 43.64), (11.55, 43.60), (11.40, 43.68), (11.26, 43.77), (11.08, 43.78), (10.95, 43.72), (10.72, 43.71), (10.48, 43.72), (10.28, 43.68)],
            [(12.16, 43.96), (12.25, 44.02), (12.34, 44.08), (12.41, 44.13), (12.47, 44.17)]
        ]
        for coords in extra:
            lon_values = np.array([point[0] for point in coords])
            lat_values = np.array([point[1] for point in coords])
            x, y = project(lon_values, lat_values)
            px, py = to_pixel(x, y)
            line = list(zip(px.tolist(), py.tolist()))
            ends = sample_etopo(dem, lat_values[[0, -1]], lon_values[[0, -1]])
            mouth = oversample * 1.35
            source = oversample * 0.5
            if float(ends[0]) <= float(ends[-1]):
                draw_tapered_line(draw, line, river_color, mouth, source)
            else:
                draw_tapered_line(draw, line, river_color, source, mouth)
            rivers_drawn += 1
    print(f'river parts drawn: {rivers_drawn}')

    coast = (122, 84, 48)
    halo = (196, 164, 116)
    halo_width = oversample * 4 if sheet['decor'] else oversample * 2
    coast_width = oversample if sheet['decor'] else oversample
    for ring in land_shells + land_holes:
        closed = ring + [ring[0]]
        draw.line(closed, fill=halo, width=halo_width)
    for ring in land_shells + land_holes:
        draw.line(ring + [ring[0]], fill=coast, width=coast_width)

    vignette = np.array(raster).astype(np.float32)
    yy = np.linspace(-1, 1, height)[:, None]
    xx = np.linspace(-1, 1, width)[None, :]
    falloff = np.clip(1 - (xx * xx * 0.06 + yy * yy * 0.08), 0.94 if not sheet['decor'] else 0.92, 1)
    vignette *= falloff[..., None]
    raster = Image.fromarray(np.clip(vignette, 0, 255).astype(np.uint8), 'RGB')
    draw = ImageDraw.Draw(raster)

    outer = (110, 72, 40)
    inner = (232, 206, 160)
    if sheet['decor']:
        step = oversample
        draw.rectangle((8 * step, 8 * step, width - 9 * step, height - 9 * step), outline=outer, width=3 * step)
        draw.rectangle((14 * step, 14 * step, width - 15 * step, height - 15 * step), outline=inner, width=2 * step)
        draw.rectangle((18 * step, 18 * step, width - 19 * step, height - 19 * step), outline=outer, width=step)
        draw_compass(draw, step)
        draw_cartouche(draw, step)
    else:
        margin = oversample * 6
        draw.rectangle((margin, margin, width - margin - 1, height - margin - 1), outline=outer, width=oversample + 1)
        draw.rectangle((margin + oversample * 3, margin + oversample * 3, width - margin - oversample * 3 - 1, height - margin - oversample * 3 - 1), outline=inner, width=oversample)

    final_width = int(saved_sheet['pw'])
    final_height = int(saved_sheet['ph'])
    raster = raster.resize((final_width, final_height), Image.Resampling.LANCZOS)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    raster.save(out_path, 'WEBP', quality=82 if saved_sheet['decor'] else 88, method=6)
    print(f'wrote {out_path} ({out_path.stat().st_size} bytes, {final_width}x{final_height})')


def build(land_path, rivers_path, lakes_path, etopo_path):
    dem = load_etopo(etopo_path)
    print(f'elevation {dem["name"]} {dem["rows"]}x{dem["cols"]}')
    render_sheet(dem, land_path, rivers_path, lakes_path, {
        'ox': 0.0,
        'oy': 0.0,
        'sx': LOGICAL_W,
        'sy': LOGICAL_H,
        'pw': WIDTH,
        'ph': HEIGHT,
        'decor': True,
    }, WEBP_PATH)
    write_geometry()
    # Alps to Sicily, with Corsica and Sardinia at the western edge.
    italy = detail_sheet(352, 228, 508, 424)
    italy['rivers'] = 'italy'
    render_sheet(dem, land_path, rivers_path, lakes_path, italy, ROOT / 'assets' / 'roman-map-italy.webp')
    # Ionian islands through the Aegean, Macedonia to Crete.
    render_sheet(dem, land_path, rivers_path, lakes_path, detail_sheet(490, 308, 632, 456), ROOT / 'assets' / 'roman-map-greece.webp')


def detail_sheet(min_x, min_y, max_x, max_y, pixels_per_logical=13):
    span_x = max_x - min_x
    span_y = max_y - min_y
    return {
        'ox': float(min_x),
        'oy': float(min_y),
        'sx': float(span_x),
        'sy': float(span_y),
        'pw': int(round(span_x * pixels_per_logical)),
        'ph': int(round(span_y * pixels_per_logical)),
        'decor': False,
    }


def draw_compass(draw, step=1):
    cx, cy = to_pixel(*project(-9.6, 33.4))
    radius = 34 * SCALE * step
    gold = (122, 78, 36)
    pale = (245, 232, 204)
    dark = (74, 48, 28)
    pad = 4 * step
    draw.ellipse((cx - radius - pad, cy - radius - pad, cx + radius + pad, cy + radius + pad), outline=gold, width=max(1, 2 * step))
    points = []
    for spoke in range(8):
        angle = -math.pi / 2 + spoke * math.pi / 4
        length = radius if spoke % 2 == 0 else radius * 0.42
        points.append((cx + math.cos(angle) * length, cy + math.sin(angle) * length))
    for spoke in range(8):
        end = points[spoke]
        color = dark if spoke % 2 == 0 else gold
        draw.polygon(((cx, cy), points[spoke - 1], end), fill=pale if spoke % 2 else color)
    draw.polygon(((cx, cy - radius), (cx - 8 * step, cy), (cx, cy - 6 * step), (cx + 8 * step, cy)), fill=dark)
    font = ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf', max(12, int(16 * SCALE * step)))
    draw.text((cx - 6 * step, cy - radius - 22 * SCALE * step), 'N', font=font, fill=dark)


def draw_cartouche(draw, step=1):
    cx, cy = to_pixel(*project(-1.2, 25.4))
    width = 210 * SCALE * step
    height = 78 * SCALE * step
    box = (cx - width / 2, cy - height / 2, cx + width / 2, cy + height / 2)
    paper = (244, 232, 204)
    ink = (78, 50, 30)
    draw.rounded_rectangle(box, radius=14 * step, fill=paper, outline=ink, width=max(1, 3 * step))
    draw.rounded_rectangle(
        (box[0] + 6 * step, box[1] + 6 * step, box[2] - 6 * step, box[3] - 6 * step),
        radius=10 * step,
        outline=(168, 124, 72),
        width=max(1, 2 * step)
    )
    title_font = ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf', max(12, int(22 * SCALE * step)))
    sub_font = ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf', max(10, int(13 * SCALE * step)))
    title = 'Orbis Romanus'
    subtitle = 'A classroom map'
    title_w = draw.textlength(title, font=title_font)
    sub_w = draw.textlength(subtitle, font=sub_font)
    draw.text((cx - title_w / 2, cy - 24 * SCALE * step), title, font=title_font, fill=ink)
    draw.text((cx - sub_w / 2, cy + 4 * SCALE * step), subtitle, font=sub_font, fill=ink)


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
