import { Injectable } from '@nestjs/common';
import { ArtworksService } from 'src/artworks/artworks.service';
import * as tinycolor from 'tinycolor2';
import colors from './color-names';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArtworkInsightsService {
  constructor(
    private readonly artworksService: ArtworksService,
    private configService: ConfigService,
  ) {}

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

  async getArtworkColorInsights(userId: number): Promise<{
    colorInsights: any[];
    totalFrequency: number;
  }> {
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

    const totalFrequency = colorInsights.reduce(
      (total, colorInfo) => total + colorInfo.frequency,
      0,
    );

    return {
      colorInsights,
      totalFrequency,
    };
  }

  async getArtworkCultureInsights(userId: number): Promise<any> {
    const artworks = await this.artworksService.findAllByUser(userId);

    const cultureMap = new Map();

    for (const artwork of artworks) {
      const culture = artwork.culture;
      const cultureInfo = cultureMap.get(culture) || {
        frequency: 0,
      };

      cultureInfo.frequency += 1;

      cultureMap.set(culture, cultureInfo);
    }

    const cultureInsights = Array.from(cultureMap.entries()).map(
      ([culture, cultureInfo]) => {
        return { culture, ...cultureInfo };
      },
    );

    cultureInsights.sort((a, b) => b.frequency - a.frequency);

    return cultureInsights;
  }

  async getAiColorInsight(userId: number): Promise<string> {
    const colorInsights = await this.getArtworkColorInsights(userId);

    const topColors = colorInsights.colorInsights
      .slice(0, 3)
      .map((colorInfo) => colorInfo.hue);

    const aiInsight = await this.aiColorInsight(topColors);

    return aiInsight;
  }

  async getAiCultureInsight(userId: number): Promise<string> {
    const cultureInsights = await this.getArtworkCultureInsights(userId);
    const topCulture = cultureInsights[0].culture;
    const aiInsight = await this.aiCultureInsight(topCulture);
    return aiInsight;
  }

  async aiColorInsight(colors: string[]): Promise<string> {
    const openAiSecretKey = this.configService.get<string>('OPENAI_API_KEY');
    const openai = new OpenAI({ apiKey: openAiSecretKey });
    const prompt = `I have these colors: ${colors.join(', ')}. Can you tell me what emotions these colors might represent in an artistic context and what insights I can gain from these favorite colors?`;
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are an art historian and color theorist who specializes in the emotional meaning within art and color. Do not address the user directly, just provide the information that the prompt is asking for. Please include some historical context alongisde emotional insight',
        },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
  }

  async aiCultureInsight(culture: string): Promise<string> {
    const openAiSecretKey = this.configService.get<string>('OPENAI_API_KEY');
    const openai = new OpenAI({ apiKey: openAiSecretKey });
    const prompt = `I have this culture: ${culture}. Can you tell me what insights I can gain from this culture in an artistic context?`;
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are an art historian and culture expert who specializes in the historical and cultural context of art. Do not address the user directly, just provide the information that the prompt is asking for. Please include some historical context alongisde cultural insight',
        },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
  }

  async getArtworkStyleInsights(userId: number): Promise<any> {
    const artworks = await this.artworksService.findAllByUser(userId);

    const styleMap = new Map();

    for (const artwork of artworks) {
      const styles = artwork.styles;

      // If styles is not null, iterate over it
      if (styles) {
        for (const style of styles) {
          const styleInfo = styleMap.get(style) || {
            frequency: 0,
          };

          styleInfo.frequency += 1;

          styleMap.set(style, styleInfo);
        }
      }
    }

    let styleInsights = Array.from(styleMap.entries()).map(
      ([style, styleInfo]) => {
        return { style, ...styleInfo };
      },
    );

    styleInsights = styleInsights.filter(
      (styleInsight) => styleInsight.style !== '20th Century',
    );

    styleInsights.sort((a, b) => b.frequency - a.frequency);

    return styleInsights;
  }

  async getAiStyleInsight(userId: number): Promise<string> {
    const styleInsights = await this.getArtworkStyleInsights(userId);
    const topStyle = styleInsights[0].style;
    const aiInsight = await this.aiStyleInsight(topStyle);
    return aiInsight;
  }

  async aiStyleInsight(style: string): Promise<string> {
    const openAiSecretKey = this.configService.get<string>('OPENAI_API_KEY');
    const openai = new OpenAI({ apiKey: openAiSecretKey });
    const prompt = `I have this style: ${style}. Can you tell me what insights I can gain from this style in an artistic context?`;
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are an art historian and style expert who specializes in the historical and artistic context of art. Do not address the user directly, just provide the information that the prompt is asking for. Please include some historical context alongisde artistic insight',
        },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
  }

  async getArtistInsights(userId: number): Promise<any> {
    const artworks = await this.artworksService.findAllByUser(userId);

    const artistMap = new Map();

    for (const artwork of artworks) {
      const artist = artwork.artist;
      const artistInfo = artistMap.get(artist) || {
        frequency: 0,
      };

      artistInfo.frequency += 1;

      artistMap.set(artist, artistInfo);
    }

    const artistInsights = Array.from(artistMap.entries()).map(
      ([artist, artistInfo]) => {
        return { artist, ...artistInfo };
      },
    );

    artistInsights.sort((a, b) => b.frequency - a.frequency);

    return artistInsights;
  }

  async getAiInsightSummary(userId: number): Promise<string> {
    const colorInsights = await this.getArtworkColorInsights(userId);
    const cultureInsights = await this.getArtworkCultureInsights(userId);
    const styleInsights = await this.getArtworkStyleInsights(userId);
    const artistInsights = await this.getArtistInsights(userId);

    const topColors = colorInsights.colorInsights
      .slice(0, 3)
      .map((colorInfo) => colorInfo.hue);

    const topCulture = cultureInsights[0].culture;
    const topStyle = styleInsights[0].style;
    const topArtist = artistInsights[0].artist;

    const openAiSecretKey = this.configService.get<string>('OPENAI_API_KEY');
    const openai = new OpenAI({ apiKey: openAiSecretKey });
    const prompt = `I have these colors: ${topColors.join(
      ', ',
    )}, this culture: ${topCulture}, this style: ${topStyle}, and this artist: ${topArtist}. Can you tell me what insights I can gain from these favorite colors, culture, style, and artist in an artistic context? Please provide recommendations of other artists / things to look into to learn more.`;
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are an art historian who specializes in the emotional meaning within art, the historical and cultural context of art, the artistic and stylistic context of art, and the artistic context of artists. Do not address the user directly, just provide the information that the prompt is asking for. Please include some historical context alongisde emotional, cultural, stylistic, and artistic insight',
        },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
  }
}
