# Topaz Image Upscale — KIE.ai

> **URL**: https://kie.ai/topaz-image-upscale
> **Model ID**: `topaz/image-upscale`
> **MCP Tool**: (usar via mcporter `kie-ai` — verificar nombre exacto del tool)
> **Scraped**: 2026-03-04

## Overview

Topaz Labs Image Upscale is an AI image enhancement model that increases resolution and restores detail with high-fidelity upscaling, natural texture reconstruction, and improved clarity across low-quality images.

## Pricing

| Resolución | Créditos | USD | USD (high-tier top-up ~10% bonus) |
|-----------|---------|-----|----------------------------------|
| ≤ 2K | 10 | $0.05 | ~$0.045 |
| 4K | 20 | $0.10 | ~$0.09 |
| 8K | 40 | $0.20 | ~$0.18 |

## Parameters

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `image_url` | string | ✅ | URL de la imagen a upscalear. JPEG, PNG, WEBP. Máx 10MB. |
| `upscale_factor` | string | ✅ | Factor de upscale: `"1"`, `"2"`, `"4"`, `"8"` |

**Límite:** El lado más largo de la imagen × `upscale_factor` no puede superar 20,000 píxeles.

## API Request Example

```json
{
  "image_url": "https://example.com/image.png",
  "upscale_factor": "2"
}
```

## Output

- Tipo: imagen
- Formato: misma extensión que la entrada (JPEG, PNG, WEBP)

## Key Features

- **Multi-scale enhancement** — upscale hasta 4× (y 8× según UI) manteniendo bordes nítidos
- **Clarity restoration** — elimina ruido, artefactos de compresión y texturas borrosas
- **Unblur** — corrige motion blur, soft focus y camera shake
- **Edge sharpening** — mejora micro-detalles (cabello, texturas, patrones, bordes finos) sin halos ni distorsiones
- **Smart model selection** — optimizado para portraits, product photos, ilustraciones y AI art

## Use Cases

- Restaurar fotos antiguas o de baja resolución
- Mejorar product shots para e-commerce
- Preparar imágenes para impresión de gran formato (posters, banners)
- Mejorar contenido de redes sociales con motion blur
- Upscalear AI-generated art antes de publicar

## Notas de uso para este equipo

- **Para imágenes de personajes (1K → 4K):** usar `upscale_factor="4"` — resultado similar a regenerar en 4K pero sin reinterpretar la imagen
- **Límite de Cloudinary free plan:** 10MB — si el resultado de upscale supera ese tamaño, comprimir con ffmpeg a JPG antes de subir
- **Alternativa a regenerar en 4K:** este upscaler es más fiel a la imagen original que regenerar en 4K (no cambia nada, solo aumenta resolución)
