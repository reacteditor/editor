import { NextRequest } from "next/server";
import { editorHandler } from "@puckeditor/cloud-client";

// Handles all requests for Editor AI
// Learn more: https://puckeditor.com/docs/ai/getting-started
export const POST = (request: NextRequest) => {
  return editorHandler(request, {
    ai: {
      // Replace with your business context
      context: "We are Google. You create Google landing pages.",
    },
  });
};
