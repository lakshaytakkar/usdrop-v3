#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import Replicate from "replicate";

// Initialize Replicate client
const getReplicateClient = () => {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    throw new Error("REPLICATE_API_TOKEN environment variable is required");
  }
  return new Replicate({ auth: apiToken });
};

// Create MCP server
const server = new Server(
  {
    name: "rembg-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "remove_background",
        description: "Remove background from an image using Replicate's rembg model. Accepts an image URL or file path and returns a URL to the processed image with transparent background.",
        inputSchema: {
          type: "object",
          properties: {
            image: {
              type: "string",
              description: "URL or file path to the input image. Supported formats: JPEG, PNG",
            },
          },
          required: ["image"],
        },
      },
      {
        name: "check_replicate_connection",
        description: "Check if Replicate API token is configured and valid",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "check_replicate_connection") {
      try {
        const replicate = getReplicateClient();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "connected",
                message: "Replicate API token is configured correctly",
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "error",
                message: error instanceof Error ? error.message : "Unknown error",
              }, null, 2),
            },
          ],
        };
      }
    }

    if (name === "remove_background") {
      if (!args || typeof args !== "object" || !("image" in args)) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "Missing required parameter: image"
        );
      }

      const imageUrl = args.image as string;

      if (!imageUrl || typeof imageUrl !== "string") {
        throw new McpError(
          ErrorCode.InvalidParams,
          "image parameter must be a non-empty string"
        );
      }

      const replicate = getReplicateClient();

      // Run the model
      const output = await replicate.run("cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003", {
        input: {
          image: imageUrl,
        },
      });

      // The output is a URL string
      const resultUrl = typeof output === "string" ? output : String(output);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              input_image: imageUrl,
              output_image: resultUrl,
              message: "Background removed successfully",
            }, null, 2),
          },
        ],
      };
    }

    throw new McpError(
      ErrorCode.MethodNotFound,
      `Unknown tool: ${name}`
    );
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    throw new McpError(
      ErrorCode.InternalError,
      `Error executing tool: ${errorMessage}`
    );
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Rembg MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});


















