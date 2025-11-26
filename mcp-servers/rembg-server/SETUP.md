# Quick Setup Guide

## Step 1: Get Replicate API Token

1. Go to https://replicate.com/account/api-tokens
2. Sign up or log in to your Replicate account
3. Create a new API token
4. Copy the token (it should start with `r8_`)

## Step 2: Install the MCP Server

### Automated Setup (Windows)

Run the PowerShell setup script:

```powershell
cd usdrop-v3/mcp-servers/rembg-server
.\setup.ps1
```

This will:
- Install all dependencies
- Create a `.env` file
- Build the server
- Guide you through the setup

### Manual Setup (All Platforms)

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in this directory:
```bash
# .env
REPLICATE_API_TOKEN=r8_your_token_here
```

3. Build the server:
```bash
npm run build
```

## Step 3: Configure Claude Desktop

### Find Your Config File

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```
(Usually: `C:\Users\YourUsername\AppData\Roaming\Claude\claude_desktop_config.json`)

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Linux:**
```
~/.config/claude/claude_desktop_config.json
```

### Add the MCP Server

Edit the config file and add:

```json
{
  "mcpServers": {
    "rembg": {
      "command": "node",
      "args": ["C:\\Development\\usdrop-final-v2\\usdrop-v3\\mcp-servers\\rembg-server\\dist\\index.js"],
      "env": {
        "REPLICATE_API_TOKEN": "r8_your_actual_token_here"
      }
    }
  }
}
```

**Important:** 
- Use your actual Replicate API token
- Use the full absolute path to the `dist/index.js` file
- On Windows, use double backslashes (`\\`) in the path
- On macOS/Linux, use forward slashes (`/`)

### If you already have other MCP servers configured:

```json
{
  "mcpServers": {
    "existing-server": {
      "command": "...",
      "args": ["..."]
    },
    "rembg": {
      "command": "node",
      "args": ["C:\\Development\\usdrop-final-v2\\usdrop-v3\\mcp-servers\\rembg-server\\dist\\index.js"],
      "env": {
        "REPLICATE_API_TOKEN": "r8_your_actual_token_here"
      }
    }
  }
}
```

## Step 4: Restart Claude Desktop

After saving the config file:
1. Completely quit Claude Desktop
2. Restart Claude Desktop
3. The rembg MCP server should now be available

## Step 5: Test the Integration

In Claude Desktop, try:

```
Check if the rembg service is connected
```

Or try removing a background:

```
Remove the background from this image: https://example.com/image.jpg
```

## Troubleshooting

### Server not showing up in Claude

1. Check that the path in `claude_desktop_config.json` is correct
2. Verify the file exists: `dist/index.js`
3. Check Claude Desktop logs for errors
4. Make sure you fully restarted Claude Desktop

### API Token Error

1. Verify your token starts with `r8_`
2. Get a new token from https://replicate.com/account/api-tokens
3. Make sure there are no extra spaces or quotes in the token

### Build Errors

1. Make sure Node.js 18+ is installed
2. Delete `node_modules` and `dist` folders
3. Run `npm install` again
4. Run `npm run build` again

## Usage Examples

Once configured, you can use it in Claude:

**Remove background from a URL:**
```
Remove the background from https://example.com/product.jpg
```

**Check connection:**
```
Check the rembg connection status
```

**Save processed image:**
```
Remove the background from image.jpg and tell me the output URL
```

## Cost Information

- **Price**: ~$0.0042 per image
- **Rate**: 238 images per $1
- **Speed**: ~5 seconds per image
- **GPU**: Nvidia L40S

## Need Help?

- Check the full README.md for more details
- Visit https://replicate.com/cjwbw/rembg for model documentation
- Check Replicate status: https://status.replicate.com/




