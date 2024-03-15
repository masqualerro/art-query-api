import { Injectable } from '@nestjs/common';
import { ArtworksService } from 'src/artworks/artworks.service';
import * as tinycolor from 'tinycolor2';
import colors from './color-names';
@Injectable()
export class ArtworkInsightsService {
  constructor(private readonly artworksService: ArtworksService) {}

  colorDistance(rgb1, rgb2) {
    const rmean = (rgb1.r + rgb2.r) / 2;
    const r = rgb1.r - rgb2.r;
    const g = rgb1.g - rgb2.g;
    const b = rgb1.b - rgb2.b;
    const weightR = 2 + rmean / 256;
    const weightG = 4.0;
    const weightB = 2 + (255 - rmean) / 256;
    return Math.sqrt(weightR * r * r + weightG * g * g + weightB * b * b);
  }

  closestColorName(hslColor) {
    let minDistance = Infinity;
    let closestColorName = '';

    for (const name in colors) {
      const rgbColor = colors[name];
      const distance = this.colorDistance(hslColor, {
        r: rgbColor[0],
        g: rgbColor[1],
        b: rgbColor[2],
      });

      if (distance < minDistance) {
        minDistance = distance;
        closestColorName = name;
      }
    }

    return closestColorName;
  }

  async getArtworkColorInsights(userId: number): Promise<any[]> {
    const artworks = await this.artworksService.findAllByUser(userId);

    const colorMap = new Map();

    for (const artwork of artworks) {
      const colors = artwork.colors;
      if (Array.isArray(colors.hex)) {
        for (const color of colors.hex) {
          const hue = color.hue;
          const hex_color = color.color;

          const colorInfo = colorMap.get(hue) || {
            frequency: 0,
            hex_colors: [],
          };

          colorInfo.frequency += 1;
          colorInfo.hex_colors.push(hex_color);

          colorMap.set(hue, colorInfo);
        }
      } else if (colors.hsl) {
        const hue = tinycolor(colors.hsl);
        const hex_color = tinycolor(colors.hsl).toHexString();
        let hue_name = this.closestColorName(hue.toRgb());

        if (hue_name == 'gray') {
          hue_name = 'grey';
        } else if (hue_name == 'grey') {
          hue_name = 'gray';
        }

        hue_name = hue_name.charAt(0).toUpperCase() + hue_name.slice(1);

        if (colorMap.has(hue_name)) {
          const colorInfo = colorMap.get(hue_name);
          colorInfo.frequency += 1;
          colorInfo.hex_colors.push(hex_color);
        } else {
          const colorInfo = {
            frequency: 1,
            hex_colors: [hex_color],
          };
          colorMap.set(hue_name, colorInfo);
        }
      }
    }

    const colorInsights = Array.from(colorMap.entries()).map(
      ([hue, colorInfo]) => {
        return { hue, ...colorInfo };
      },
    );

    colorInsights.sort((a, b) => b.frequency - a.frequency);

    return colorInsights;
  }
}
