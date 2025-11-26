# Rembg MCP Server

An MCP (Model Context Protocol) server for removing image backgrounds using Replicate's [cjwbw/rembg](https://replicate.com/cjwbw/rembg) model.

## Features

- **Background Removal**: Remove backgrounds from images with transparent output
- **Replicate Integration**: Powered by Replicate's high-quality rembg model
- **Simple API**: Easy-to-use MCP tools for background removal
- **Status Check**: Verify Replicate API connection

## Prerequisites

- Node.js 18 or higher
- A Replicate API token ([Get one here](https://replicate.com/account/api-tokens))

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with your Replicate API token:

```bash
cp .env.example .env
```

3. Edit `.env` and add your Replicate API token:

```
REPLICATE_API_TOKEN=r8_your_token_here
```

4. Build the server:

```bash
npm run build
```

## Usage

### Running the Server

```bash
npm start
```

Or for development with auto-rebuild:

```bash
npm run dev
```

### Available Tools

#### 1. `remove_background`

Remove the background from an image.

**Input:**
- `image` (string, required): URL or file path to the input image

**Example:**
```json
{
  "image": "https://example.com/my-image.jpg"
}
```

**Output:**
```json
{
  "success": true,
  "input_image": "https://example.com/my-image.jpg",
  "output_image": "https://replicate.delivery/pbxt/...",
  "message": "Background removed successfully"
}
```

#### 2. `check_replicate_connection`

Check if the Replicate API token is configured correctly.

**Input:** None

**Output:**
```json
{
  "status": "connected",
  "message": "Replicate API token is configured correctly"
}
```

## Configuration in MCP Client

To use this server with an MCP client (like Claude Desktop), add it to your MCP settings:

### Windows (Claude Desktop)

Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "rembg": {
      "command": "node",
      "args": ["C:/Development/usdrop-final-v2/usdrop-v3/mcp-servers/rembg-server/dist/index.js"],
      "env": {
        "REPLICATE_API_TOKEN": "r8_your_token_here"
      }
    }
  }
}
```

### macOS/Linux (Claude Desktop)

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `~/.config/claude/claude_desktop_config.json` (Linux):

```json
{
  "mcpServers": {
    "rembg": {
      "command": "node",
      "args": ["/path/to/usdrop-v3/mcp-servers/rembg-server/dist/index.js"],
      "env": {
        "REPLICATE_API_TOKEN": "r8_your_token_here"
      }
    }
  }
}
```

## Cost

According to Replicate, this model costs approximately **$0.0042 per run** (238 runs per $1). Predictions typically complete within 5 seconds.

## Examples

### Remove background from a product image:

```
Use the remove_background tool with this image: https://example.com/product.jpg
```

The tool will return a URL to the processed image with a transparent background, perfect for:
- E-commerce product photos
- Profile pictures
- Marketing materials
- Presentations

## Model Information

- **Model**: cjwbw/rembg
- **Provider**: Replicate
- **Hardware**: Nvidia L40S GPU
- **Average Runtime**: ~5 seconds
- **License**: MIT

## Troubleshooting

### "REPLICATE_API_TOKEN environment variable is required"

Make sure you've:
1. Created a `.env` file with your token, or
2. Set the `REPLICATE_API_TOKEN` environment variable, or
3. Configured it in your MCP client settings

### "Invalid API token"

- Verify your token is correct at https://replicate.com/account/api-tokens
- Ensure the token starts with `r8_`
- Check that there are no extra spaces or quotes

## Development

To modify the server:

1. Edit files in `src/`
2. Run `npm run build` to compile
3. Test with `npm start`

## License

MIT License - See Replicate's rembg model for model-specific licensing.




